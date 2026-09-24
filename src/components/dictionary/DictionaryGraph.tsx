"use client";

// The force simulation and per-node animation state are mutated every frame by
// design, so React's immutability rule does not apply to this file.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  forceZ,
} from "d3-force-3d";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  Color,
  DynamicDrawUsage,
  MathUtils,
  Object3D,
  Plane,
  Vector3,
  type BufferGeometry,
  type Fog,
  type PerspectiveCamera,
  type Sprite,
  type SpriteMaterial,
  type InstancedMesh,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { DictionaryTerm } from "@/lib/dictionary";
import { SECTION_COLORS } from "./colors";
import { playHover } from "./sound";

/** Screen-space label positions, written every frame and drawn by the DOM overlay. */
export type LabelData = {
  x: Float32Array;
  y: Float32Array;
  /** 0 hides the label. */
  o: Float32Array;
  strong: number;
};

type Props = {
  /** Pixels of the right edge covered by the side panel. */
  insetRight: number;
  /** `section` colors nodes by curriculum section; `mono` keeps them grey. */
  colorMode: "mono" | "section";
  labelData: LabelData;
  terms: DictionaryTerm[];
  connections: Map<string, Set<string>>;
  selected: string | null;
  matches: Set<string> | null;
  onSelect: (slug: string) => void;
};

const UP = new Vector3(0, 1, 0);
const BG = new Color("#ecebe8");
const DARK = new Color("#262626");
const FADED = new Color("#b4b4b0");
const FOCUS_DISTANCE = 28;
// A flight scales with how far the camera has to travel: short hops between
// nearby terms are quick, long ones pull back further and swing wider.
const FLIGHT_SECONDS = [1.3, 2.8] as const;
const FLIGHT_PULL = [30, 80] as const;
const FLIGHT_SWING = [0.5, 1.0] as const;
const FLIGHT_FULL_TRAVEL = 20;

type SimNode = {
  x: number;
  y: number;
  z: number;
  ax: number;
  ay: number;
  az: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
};

function buildModel(terms: DictionaryTerm[], connections: Map<string, Set<string>>) {
  const indexOf = new Map(terms.map((t, i) => [t.slug, i]));
  // Start slightly contracted around the precomputed layout so the graph eases
  // out into place. Starting on top of each other makes repulsion explode.
  const nodes: SimNode[] = terms.map((t) => ({
    x: t.position[0] * 0.6,
    y: t.position[1] * 0.6,
    z: t.position[2] * 0.6,
    ax: t.position[0],
    ay: t.position[1],
    az: t.position[2],
  }));
  const edges: [number, number][] = [];
  connections.forEach((set, slug) => {
    const a = indexOf.get(slug)!;
    set.forEach((other) => {
      const b = indexOf.get(other)!;
      if (a < b) edges.push([a, b]);
    });
  });
  const adjacency = terms.map((t) =>
    [...(connections.get(t.slug) ?? [])].map((s) => indexOf.get(s)!),
  );
  const sim = forceSimulation(nodes, 3)
    .force("charge", forceManyBody().strength(-30).distanceMin(2).distanceMax(40))
    .force("link", forceLink(edges.map(([source, target]) => ({ source, target }))).distance(3.4).strength(0.3))
    .force("center", forceCenter(0, 0, 0))
    .force("x", forceX((d: SimNode) => d.ax).strength(0.05))
    .force("y", forceY((d: SimNode) => d.ay).strength(0.05))
    .force("z", forceZ((d: SimNode) => d.az).strength(0.05))
    .alphaDecay(0.03)
    .velocityDecay(0.5)
    .stop();
  return {
    indexOf,
    nodes,
    edges,
    adjacency,
    sim,
    radius: adjacency.map((a) => 0.16 + 0.06 * Math.sqrt(a.length)),
    emphasis: new Float32Array(terms.length).fill(1),
    hoverAmt: new Float32Array(terms.length),
    edgeAmt: new Float32Array(edges.length).fill(0.2),
    flowAmt: new Float32Array(edges.length),
    pos: new Float32Array(terms.length * 3),
  };
}

function Scene({ insetRight, colorMode, labelData, terms, connections, selected, matches, onSelect }: Props) {
  const model = useMemo(() => buildModel(terms, connections), [terms, connections]);
  const { camera, size, clock, scene } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const lineGeo = useRef<BufferGeometry>(null);
  const pointGeo = useRef<BufferGeometry>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const selectedIdx = selected ? (model.indexOf.get(selected) ?? -1) : -1;
  const selectedRef = useRef(-1);
  const lastSel = useRef(-1);
  const flight = useRef<{
    start: number;
    from: Vector3;
    distance: number;
    dir: Vector3;
    seconds: number;
    pull: number;
    swing: number;
  } | null>(null);
  const roll = useRef(0);
  const camDistance = useRef(32);
  const viewShift = useRef(0);
  const interactedAt = useRef(-10);
  const matchesRef = useRef<Set<string> | null>(null);
  const drag = useRef<{ index: number; startX: number; startY: number; moved: boolean } | null>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const sectionColors = useMemo(() => terms.map((t) => new Color(SECTION_COLORS[t.section % SECTION_COLORS.length])), [terms]);
  const selHalo = useRef<Sprite>(null);
  const hovHalo = useRef<Sprite>(null);
  // Soft radial glow drawn behind the selected and hovered node.
  const haloTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const g = canvas.getContext("2d")!;
    const gradient = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0.5)");
    gradient.addColorStop(0.4, "rgba(0,0,0,0.14)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gradient;
    g.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
  }, []);
  const tmp = useMemo(() => ({ a: new Vector3(), b: new Vector3(), c: new Vector3(), d: new Vector3(), plane: new Plane(), color: new Color() }), []);

  const lineBuffers = useMemo(
    () => ({ pos: new Float32Array(model.edges.length * 6), col: new Float32Array(model.edges.length * 6) }),
    [model],
  );
  const pointBuffers = useMemo(
    () => ({ pos: new Float32Array(model.edges.length * 6), col: new Float32Array(model.edges.length * 6) }),
    [model],
  );

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);
  useEffect(() => {
    selectedRef.current = selectedIdx;
  }, [selectedIdx]);
  useEffect(() => {
    matchesRef.current = matches;
  }, [matches]);
  useEffect(() => {
    model.sim.alpha(0.5);
    return () => void model.sim.stop();
  }, [model]);

  useFrame((state, dt) => {
    const mesh = meshRef.current;
    const c = controls.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const { sim, nodes, edges, adjacency, radius, emphasis, hoverAmt, edgeAmt, flowAmt, pos } = model;
    const sel = selectedRef.current;
    const hov = hoveredRef.current;
    const active = hov ?? (sel >= 0 ? sel : -1);
    const activeNeighbours = active >= 0 ? new Set(adjacency[active]) : null;
    const selNeighbours = sel >= 0 ? new Set(adjacency[sel]) : null;
    const matched = matchesRef.current;
    const ease = 1 - Math.exp(-dt * 6);
    const hoverEase = 1 - Math.exp(-dt * 3);

    if (sim.alpha() > sim.alphaMin()) sim.tick();

    // Node positions, with a slow idle float layered on top of the physics.
    nodes.forEach((n, i) => {
      const dragging = drag.current?.index === i;
      pos[i * 3] = n.x + (dragging ? 0 : Math.sin(t * 0.6 + i * 1.7) * 0.07);
      pos[i * 3 + 1] = n.y + (dragging ? 0 : Math.cos(t * 0.5 + i * 2.3) * 0.07);
      pos[i * 3 + 2] = n.z + (dragging ? 0 : Math.sin(t * 0.4 + i * 0.9) * 0.07);
    });

    // Nodes: size, color and hover pulse.
    for (let i = 0; i < nodes.length; i++) {
      const inFocus = sel < 0 || i === sel || selNeighbours!.has(i);
      const isMatch = !matched || matched.has(terms[i].slug);
      emphasis[i] += ((inFocus && isMatch ? 1 : 0) - emphasis[i]) * ease;
      const related = active >= 0 && (i === active || activeNeighbours!.has(i));
      hoverAmt[i] += ((related ? 1 : 0) - hoverAmt[i]) * hoverEase;
      const pulse = hoverAmt[i] * (0.12 + 0.08 * Math.sin(t * 3 + i));
      let scale = 1 + (1 - emphasis[i]) * 0.3 + pulse;
      if (i === sel) scale *= 1.45;
      if (i === hov) scale *= 1.2;
      dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      dummy.scale.setScalar(radius[i] * scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      tmp.color.copy(FADED).lerp(colorMode === "section" ? sectionColors[i] : DARK, emphasis[i]);
      mesh.setColorAt(i, tmp.color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();

    // Glow behind the selected node, and behind the hovered one.
    for (const [ref, index, strength, wobble] of [
      [selHalo, sel, 1, 0.5],
      [hovHalo, hov !== null && hov !== sel ? hov : -1, 0.7, 0.3],
    ] as const) {
      const halo = ref.current;
      if (!halo) continue;
      const material = halo.material as SpriteMaterial;
      material.opacity = MathUtils.damp(material.opacity, index >= 0 ? strength : 0, 5, dt);
      halo.visible = material.opacity > 0.01;
      if (index >= 0) {
        halo.position.set(pos[index * 3], pos[index * 3 + 1], pos[index * 3 + 2]);
        halo.scale.setScalar(radius[index] * (9 + wobble * Math.sin(t * 2)));
      }
    }

    // Edges and the particles flowing along them.
    const lp = lineBuffers.pos;
    const lc = lineBuffers.col;
    const pp = pointBuffers.pos;
    const pc = pointBuffers.col;
    edges.forEach(([a, b], e) => {
      const incident = active >= 0 && (a === active || b === active);
      const quiet = matched ? 0.04 : sel >= 0 ? 0.05 : 0.14;
      edgeAmt[e] += ((incident ? 0.85 : quiet) - edgeAmt[e]) * hoverEase;
      flowAmt[e] += ((incident ? 1 : !matched && sel < 0 && hov === null ? 0.3 : 0) - flowAmt[e]) * hoverEase;
      for (let k = 0; k < 3; k++) {
        lp[e * 6 + k] = pos[a * 3 + k];
        lp[e * 6 + 3 + k] = pos[b * 3 + k];
      }
      const r = BG.r + (DARK.r - BG.r) * edgeAmt[e];
      const g = BG.g + (DARK.g - BG.g) * edgeAmt[e];
      const bl = BG.b + (DARK.b - BG.b) * edgeAmt[e];
      lc.set([r, g, bl, r, g, bl], e * 6);

      // Two particles per edge, moving away from the active node.
      const from = incident && b === active ? b : a;
      const to = from === a ? b : a;
      const fr = BG.r + (DARK.r - BG.r) * flowAmt[e];
      const fg = BG.g + (DARK.g - BG.g) * flowAmt[e];
      const fb = BG.b + (DARK.b - BG.b) * flowAmt[e];
      for (let p = 0; p < 2; p++) {
        const u = (t * 0.22 + p * 0.5 + e * 0.137) % 1;
        for (let k = 0; k < 3; k++)
          pp[e * 6 + p * 3 + k] = pos[from * 3 + k] + (pos[to * 3 + k] - pos[from * 3 + k]) * u;
        pc[e * 6 + p * 3] = fr;
        pc[e * 6 + p * 3 + 1] = fg;
        pc[e * 6 + p * 3 + 2] = fb;
      }
    });
    for (const geo of [lineGeo.current, pointGeo.current]) {
      if (!geo) continue;
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
    }

    // Project label anchors to screen space for the DOM overlay. With nothing
    // selected every node keeps a quiet name; a selection brings its own forward.
    labelData.strong = hov ?? sel;
    const hovNeighbours = hov !== null ? new Set(adjacency[hov]) : null;
    for (let i = 0; i < nodes.length; i++) {
      tmp.a.set(pos[i * 3], pos[i * 3 + 1] + radius[i] + 0.5, pos[i * 3 + 2]);
      const depth = tmp.a.distanceTo(camera.position);
      tmp.a.project(camera);
      labelData.x[i] = (tmp.a.x * 0.5 + 0.5) * size.width;
      labelData.y[i] = (-tmp.a.y * 0.5 + 0.5) * size.height;
      // Fade by depth within the graph, and hide names once the camera has pulled far back.
      const zoomFade = MathUtils.clamp(1 - (camDistance.current - 45) / 25, 0, 1);
      const fade = MathUtils.clamp(1.4 - (depth - camDistance.current + 16) / 30, 0.25, 1) * zoomFade;
      let o = 0.6 * fade;
      if (matched) o = matched.has(terms[i].slug) ? fade : 0;
      else if (sel >= 0) o = i === sel ? 1 : selNeighbours!.has(i) ? 0.85 * fade : 0.15 * fade;
      if (i === labelData.strong) o = 1;
      else if (hovNeighbours?.has(i)) o = Math.max(o, 0.85 * fade);
      labelData.o[i] = o;
    }

    // The canvas stays full width behind the side panel, so opening it never
    // resizes the canvas. Shift the view instead so the focus sits in the
    // visible part.
    const shift = MathUtils.damp(viewShift.current, insetRight / 2, 5, dt);
    if (Math.abs(shift - viewShift.current) > 0.01) {
      viewShift.current = shift;
      if (Math.abs(shift) < 0.5) camera.clearViewOffset();
      else (camera as PerspectiveCamera).setViewOffset(size.width, size.height, shift, 0, size.width, size.height);
    }

    // Camera. Selecting a term pulls back, swings around and eases in to the
    // node; at rest it slowly breathes in and out and rolls.
    if (c) {
      if (sel !== lastSel.current) {
        lastSel.current = sel;
        if (sel >= 0) {
          const offset = tmp.c.subVectors(camera.position, c.target);
          tmp.a.set(pos[sel * 3], pos[sel * 3 + 1], pos[sel * 3 + 2]);
          const span = MathUtils.clamp(c.target.distanceTo(tmp.a) / FLIGHT_FULL_TRAVEL, 0, 1);
          const lerp = (range: readonly [number, number]) => range[0] + (range[1] - range[0]) * span;
          flight.current = {
            start: t,
            from: c.target.clone(),
            distance: offset.length(),
            dir: offset.normalize().clone(),
            seconds: lerp(FLIGHT_SECONDS),
            pull: lerp(FLIGHT_PULL),
            swing: lerp(FLIGHT_SWING),
          };
        } else flight.current = null;
      }
      const f = flight.current;
      let rollTarget = 0;
      if (f && sel >= 0) {
        const p = Math.min((t - f.start) / f.seconds, 1);
        const u = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
        tmp.a.set(pos[sel * 3], pos[sel * 3 + 1], pos[sel * 3 + 2]);
        // Curve the look-at point through the middle of the graph, so the whole
        // cluster stays centred while the camera is pulled far back.
        c.target
          .copy(f.from)
          .multiplyScalar((1 - u) ** 2)
          .addScaledVector(tmp.a, u * u);
        const distance = f.distance + (FOCUS_DISTANCE - f.distance) * u + f.pull * Math.sin(Math.PI * u);
        tmp.d.copy(f.dir).applyAxisAngle(UP, f.swing * u);
        camera.position.copy(c.target).addScaledVector(tmp.d, distance);
        rollTarget = 0.22 * Math.sin(Math.PI * u);
        if (p >= 1) flight.current = null;
      } else if (sel >= 0) {
        // Keep following the node as the simulation moves it.
        tmp.b.copy(c.target);
        tmp.a.set(pos[sel * 3], pos[sel * 3 + 1], pos[sel * 3 + 2]);
        c.target.x = MathUtils.damp(c.target.x, tmp.a.x, 4, dt);
        c.target.y = MathUtils.damp(c.target.y, tmp.a.y, 4, dt);
        c.target.z = MathUtils.damp(c.target.z, tmp.a.z, 4, dt);
        camera.position.add(tmp.b.subVectors(c.target, tmp.b));
      } else if (t - interactedAt.current > 3 && hov === null) {
        const offset = tmp.c.subVectors(camera.position, c.target);
        const desired = 33 + 7 * Math.sin(t * 0.26);
        offset.setLength(MathUtils.damp(offset.length(), desired, 1.2, dt));
        camera.position.copy(c.target).add(offset);
        rollTarget = 0.2 * Math.sin(t * 0.2);
      }
      // Fog and the zoom limit follow the camera, so the graph stays visible
      // (as a small cluster) while the camera is pulled far back.
      camDistance.current = camera.position.distanceTo(c.target);
      const fog = scene.fog as Fog | null;
      if (fog) {
        fog.near = camDistance.current - 8;
        fog.far = camDistance.current + 38;
      }
      c.maxDistance = flight.current ? 300 : 70;
      roll.current = MathUtils.damp(roll.current, rollTarget, 2, dt);
      tmp.d.subVectors(c.target, camera.position).normalize();
      camera.up.copy(UP).applyAxisAngle(tmp.d, roll.current);
      // OrbitControls only re-aims the camera while enabled, so aim it here too:
      // otherwise the flight drifts off target and snaps back when it lands.
      camera.lookAt(c.target);
      // The visitor takes over again once the flight lands.
      if (!drag.current) c.enabled = flight.current === null;
    }
  });

  const startDrag = (e: ThreeEvent<PointerEvent>) => {
    if (e.instanceId === undefined) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    const i = e.instanceId;
    drag.current = { index: i, startX: e.nativeEvent.clientX, startY: e.nativeEvent.clientY, moved: false };
    tmp.a.set(model.pos[i * 3], model.pos[i * 3 + 1], model.pos[i * 3 + 2]);
    camera.getWorldDirection(tmp.b);
    tmp.plane.setFromNormalAndCoplanarPoint(tmp.b, tmp.a);
    if (controls.current) controls.current.enabled = false;
  };

  const moveDrag = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d) {
      if (e.instanceId !== undefined && e.instanceId !== hoveredRef.current) {
        hoveredRef.current = e.instanceId;
        setHovered(e.instanceId);
        playHover(e.instanceId);
        document.body.style.cursor = "pointer";
      }
      return;
    }
    if (Math.hypot(e.nativeEvent.clientX - d.startX, e.nativeEvent.clientY - d.startY) > 5) d.moved = true;
    if (!d.moved || !e.ray.intersectPlane(tmp.plane, tmp.a)) return;
    const node = model.nodes[d.index];
    node.fx = tmp.a.x;
    node.fy = tmp.a.y;
    node.fz = tmp.a.z;
    model.sim.alphaTarget(0.3);
    if (model.sim.alpha() < 0.3) model.sim.alpha(0.3);
  };

  const endDrag = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    const node = model.nodes[d.index];
    node.fx = node.fy = node.fz = null;
    model.sim.alphaTarget(0);
    drag.current = null;
    if (controls.current) controls.current.enabled = true;
    if (!d.moved) onSelect(terms[d.index].slug);
  };

  return (
    <>
      <fog attach="fog" args={["#ecebe8", 24, 70]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[6, 10, 12]} intensity={1.7} />

      <sprite ref={selHalo} renderOrder={1.5} visible={false}>
        <spriteMaterial map={haloTexture} transparent opacity={0} depthWrite={false} depthTest={false} fog={false} />
      </sprite>
      <sprite ref={hovHalo} renderOrder={1.5} visible={false}>
        <spriteMaterial map={haloTexture} transparent opacity={0} depthWrite={false} depthTest={false} fog={false} />
      </sprite>

      <lineSegments frustumCulled={false} renderOrder={0}>
        <bufferGeometry ref={lineGeo}>
          <bufferAttribute attach="attributes-position" args={[lineBuffers.pos, 3]} usage={DynamicDrawUsage} />
          <bufferAttribute attach="attributes-color" args={[lineBuffers.col, 3]} usage={DynamicDrawUsage} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors depthTest={false} depthWrite={false} />
      </lineSegments>

      <points frustumCulled={false} renderOrder={1}>
        <bufferGeometry ref={pointGeo}>
          <bufferAttribute attach="attributes-position" args={[pointBuffers.pos, 3]} usage={DynamicDrawUsage} />
          <bufferAttribute attach="attributes-color" args={[pointBuffers.col, 3]} usage={DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial vertexColors size={3.5} sizeAttenuation={false} depthTest={false} depthWrite={false} />
      </points>

      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, terms.length]}
        frustumCulled={false}
        renderOrder={2}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerOut={() => {
          if (drag.current) return;
          hoveredRef.current = null;
          setHovered(null);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial roughness={0.55} metalness={0} />
      </instancedMesh>

      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        minDistance={8}
        maxDistance={70}
        autoRotate={selectedIdx < 0 && hovered === null}
        autoRotateSpeed={0.35}
        onStart={() => (interactedAt.current = clock.elapsedTime)}
        onEnd={() => (interactedAt.current = clock.elapsedTime)}
      />
    </>
  );
}

/** Depth of field: nodes far from the camera's focus blur, like the hosted site. */
function Effects() {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as OrbitControlsImpl | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dof = useRef<any>(null);

  useFrame(() => {
    const effect = dof.current;
    if (!effect || !controls) return;
    effect.circleOfConfusionMaterial.worldFocusDistance = camera.position.distanceTo(controls.target);
    effect.circleOfConfusionMaterial.worldFocusRange = 22;
  });

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField ref={dof} bokehScale={3} height={480} />
    </EffectComposer>
  );
}

// Heavy effects are skipped on touch devices and machines that report few
// cores or little memory; a frame-rate monitor switches them off if they lag.
function canRunEffects() {
  const override = new URLSearchParams(window.location.search).get("fx");
  if (override) return override === "on";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return !coarse && (nav.hardwareConcurrency ?? 8) > 4 && (nav.deviceMemory ?? 8) > 4;
}

export default function DictionaryGraph(props: Props) {
  const [effects, setEffects] = useState(canRunEffects);
  return (
    <Canvas camera={{ position: [0, 0, 32], fov: 50 }} dpr={[1, effects ? 1.5 : 2]}>
      <color attach="background" args={["#ecebe8"]} />
      <PerformanceMonitor bounds={() => [24, 200]} onDecline={() => setEffects(false)} />
      <Scene {...props} />
      {effects && <Effects />}
    </Canvas>
  );
}
