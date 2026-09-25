"use client";

// Skill positions and the edge buffer are mutated every frame by design, so
// React's immutability rule does not apply to this file.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, PerformanceMonitor, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef, useState, type RefObject } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  Color,
  MathUtils,
  Vector3,
  type BufferGeometry,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { areaColor } from "@/lib/skill-map/colors";
import { layoutSkillMap, type Vec3 } from "@/lib/skill-map/layout";
import type { SkillMap } from "@/lib/skill-map/types";

type Props = {
  map: SkillMap;
  learned: ReadonlySet<string>;
  ready: ReadonlySet<string>;
  branch: string | null;
  selected: string | null;
  onSelect: (id: string) => void;
  /** Pixels of the right edge covered by the side panel. */
  insetRight: number;
};

/** Label elements in the DOM layer over the canvas, by Skill id; the scene moves them each frame. */
type Labels = RefObject<Map<string, HTMLSpanElement>>;

const projected = new Vector3();

// The middle of the map, from the top of the Core to the bottom of the longest Branch.
const HOME_TARGET = new Vector3(0, -3, 0);
const EDGE_DIM = new Color("#2a2e38");

function colorsFor(map: SkillMap) {
  return new Map(map.skills.map((s) => [s.id, new Color(areaColor(map, s.area))]));
}

function SkillOrb({
  id,
  labels,
  color,
  target,
  current,
  learned,
  ready,
  selected,
  faded,
  onSelect,
  onHover,
}: {
  id: string;
  labels: Labels;
  color: Color;
  target: Vec3;
  current: Vector3;
  learned: boolean;
  ready: boolean;
  selected: boolean;
  faded: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  // Each Skill bobs out of step with its neighbours, the same way on every visit.
  const phase = useMemo(() => ([...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7) % 628) / 100, [id]);

  useFrame(({ clock, camera, size }, delta) => {
    const t = clock.elapsedTime;
    // Glide toward the layout position, then drift gently around it.
    const k = 1 - Math.exp(-delta * 3);
    current.x = MathUtils.lerp(current.x, target[0], k);
    current.y = MathUtils.lerp(current.y, target[1], k);
    current.z = MathUtils.lerp(current.z, target[2], k);
    group.current?.position.set(current.x, current.y + Math.sin(t * 0.8 + phase) * 0.12, current.z);

    const mat = core.current?.material as MeshStandardMaterial | undefined;
    if (mat) {
      const glow = learned ? 2.4 : ready ? 1.2 + Math.sin(t * 3 + phase) * 0.6 : 0.35;
      mat.emissiveIntensity = MathUtils.lerp(mat.emissiveIntensity, faded ? glow * 0.25 : glow, k);
      mat.opacity = MathUtils.lerp(mat.opacity, faded ? 0.35 : 1, k);
    }
    const scale = (selected ? 1.5 : hovered ? 1.3 : 1) * (learned ? 1.1 : 1);
    core.current?.scale.setScalar(MathUtils.lerp(core.current.scale.x, scale, k * 2));

    if (halo.current) {
      const pulse = ready && !learned ? 1.6 + Math.sin(t * 3 + phase) * 0.25 : selected ? 1.9 : 0.001;
      halo.current.scale.setScalar(MathUtils.lerp(halo.current.scale.x, pulse, k * 2));
    }

    // Pin the DOM label just under the Skill; hide it when the Skill is behind the camera.
    const label = labels.current.get(id);
    if (label && group.current) {
      projected.copy(group.current.position).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      label.style.transform = `translate(${x}px, ${y + 14}px) translate(-50%, 0)`;
      label.style.visibility = projected.z < 1 ? "visible" : "hidden";
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(id);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = "";
  };

  return (
    <group ref={group}>
      <mesh
        ref={core}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        onPointerOver={over}
        onPointerOut={out}
      >
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={learned ? color : "#0d0f14"}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.1}
          transparent
        />
      </mesh>
      <mesh ref={halo} scale={0.001}>
        <ringGeometry args={[0.55, 0.62, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** One line per Prerequisite, redrawn each frame so it follows moving Skills. */
function PrerequisiteLines({
  map,
  current,
  colors,
  learned,
  faded,
}: {
  map: SkillMap;
  current: Map<string, Vector3>;
  colors: Map<string, Color>;
  learned: ReadonlySet<string>;
  faded: (id: string) => boolean;
}) {
  const edges = useMemo(() => map.skills.flatMap((s) => s.prerequisites.map((p) => [p, s.id] as const)), [map]);
  const geometry = useRef<BufferGeometry>(null);
  const positions = useMemo(() => new Float32Array(edges.length * 6), [edges]);
  const vertexColors = useMemo(() => new Float32Array(edges.length * 6), [edges]);
  const scratch = useMemo(() => new Color(), []);

  useFrame(() => {
    const geo = geometry.current;
    if (!geo) return;
    edges.forEach(([from, to], i) => {
      const a = current.get(from)!;
      const b = current.get(to)!;
      positions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
      // Lines between two learned Skills light up in the destination's color.
      const lit = learned.has(from) && learned.has(to);
      scratch.copy(lit ? colors.get(to)! : EDGE_DIM);
      if (!lit) scratch.lerp(colors.get(to)!, 0.25);
      if (faded(to)) scratch.multiplyScalar(0.35);
      vertexColors.set([scratch.r, scratch.g, scratch.b, scratch.r, scratch.g, scratch.b], i * 6);
    });
    if (!geo.getAttribute("position")) {
      geo.setAttribute("position", new BufferAttribute(positions, 3));
      geo.setAttribute("color", new BufferAttribute(vertexColors, 3));
    }
    geo.getAttribute("position").needsUpdate = true;
    geo.getAttribute("color").needsUpdate = true;
    geo.computeBoundingSphere();
  });

  return (
    <lineSegments>
      <bufferGeometry ref={geometry} />
      <lineBasicMaterial vertexColors transparent opacity={0.9} />
    </lineSegments>
  );
}

function Scene({
  map,
  learned,
  ready,
  branch,
  selected,
  onSelect,
  insetRight,
  labels,
  faded,
  onHover,
}: Props & { labels: Labels; faded: (id: string) => boolean; onHover: (id: string | null) => void }) {
  const colors = useMemo(() => colorsFor(map), [map]);
  const layout = useMemo(() => layoutSkillMap(map, branch), [map, branch]);
  // Start everything at the center so Skills fly out into place on load.
  const current = useMemo(() => new Map(map.skills.map((s) => [s.id, new Vector3(0, 0, -10)])), [map]);
  const controls = useRef<OrbitControlsImpl>(null);
  useFrame(({ camera, size }, delta) => {
    const c = controls.current;
    if (!c) return;
    // Ease the orbit target toward the selected Skill, nudged left so it stays
    // clear of the side panel.
    const goal = selected ? current.get(selected)!.clone() : HOME_TARGET.clone();
    if (selected && insetRight) {
      const dist = camera.position.distanceTo(c.target);
      const worldPerPx = (2 * dist * Math.tan(MathUtils.degToRad(50 / 2))) / size.height;
      goal.x += (insetRight / 2) * worldPerPx;
    }
    c.target.lerp(goal, 1 - Math.exp(-delta * 2));
    c.update();
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 12, 18]} intensity={60} />
      <Stars radius={90} depth={40} count={2500} factor={3} fade speed={0.4} />
      <PrerequisiteLines map={map} current={current} colors={colors} learned={learned} faded={faded} />
      {map.skills.map((s) => (
        <SkillOrb
          key={s.id}
          id={s.id}
          labels={labels}
          color={colors.get(s.id)!}
          target={layout.get(s.id)!}
          current={current.get(s.id)!}
          learned={learned.has(s.id)}
          ready={ready.has(s.id)}
          selected={selected === s.id}
          faded={faded(s.id)}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        enablePan={false}
        minDistance={10}
        maxDistance={60}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}

// Bloom is skipped on touch devices and machines that report few cores or
// little memory; a frame-rate monitor switches it off if it lags.
function canRunEffects() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return !coarse && (nav.hardwareConcurrency ?? 8) > 4 && (nav.deviceMemory ?? 8) > 4;
}

export default function SkillMapScene(props: Props) {
  const [effects, setEffects] = useState(canRunEffects);
  const [hovered, setHovered] = useState<string | null>(null);
  const labels = useRef(new Map<string, HTMLSpanElement>());
  const { map, branch, learned, selected } = props;
  const area = useMemo(() => new Map(map.skills.map((s) => [s.id, s.area])), [map]);
  const faded = (id: string) => branch !== null && area.get(id) !== "core" && area.get(id) !== branch;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 2, 36], fov: 50 }}
        dpr={[1, 2]}
        onPointerMissed={() => (document.body.style.cursor = "")}
      >
        <color attach="background" args={["#08090c"]} />
        <fog attach="fog" args={["#08090c", 40, 90]} />
        <PerformanceMonitor bounds={() => [30, 200]} onDecline={() => setEffects(false)} />
        <Scene {...props} labels={labels} faded={faded} onHover={setHovered} />
        {effects && (
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.25} luminanceSmoothing={0.3} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {map.skills.map((s) => {
          const strong = s.id === selected || s.id === hovered;
          return (
            <span
              key={s.id}
              ref={(el) => {
                if (el) labels.current.set(s.id, el);
                else labels.current.delete(s.id);
              }}
              className={`absolute top-0 left-0 whitespace-nowrap rounded px-1.5 py-0.5 font-sans text-[11px] font-semibold tracking-tight transition-[opacity,background-color] duration-500 ${
                strong ? "z-10 bg-black/75 text-white" : "text-foreground/80"
              }`}
              style={{ opacity: faded(s.id) && !strong ? 0.3 : 1, visibility: "hidden" }}
            >
              {learned.has(s.id) && "✓ "}
              {s.title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
