"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type SpriteMaterial,
} from "three";
import type { AgentId } from "@/lib/agentic-os/types";
import { AGENTS } from "./agents";

export type CoreState = "idle" | "thinking" | "answering";

type Props = {
  state: CoreState;
  selected: AgentId | null;
  onSelect: (id: AgentId) => void;
};

const CORE = new Color("#22d3ee");
const ORBIT_RADIUS = 3.6;
// How fast the core breathes in each state (radians per second).
const PULSE_SPEED: Record<CoreState, number> = { idle: 1.2, thinking: 6, answering: 3 };

function Core({ state, tint }: { state: CoreState; tint: string }) {
  const shell = useRef<Mesh>(null);
  const heart = useRef<Mesh>(null);
  const rings = useRef<Group>(null);
  const heartMaterial = useRef<MeshBasicMaterial>(null);
  const target = useMemo(() => new Color(), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * PULSE_SPEED[state]) * (state === "idle" ? 0.04 : 0.1);
    heart.current?.scale.setScalar(pulse);
    if (shell.current) {
      shell.current.rotation.y += delta * (state === "thinking" ? 1.2 : 0.25);
      shell.current.rotation.x += delta * 0.1;
    }
    if (rings.current) {
      rings.current.children.forEach((ring, i) => {
        ring.rotation.z += delta * (0.3 + i * 0.25) * (state === "thinking" ? 3 : 1) * (i % 2 ? -1 : 1);
      });
    }
    // Drift the core's color toward the active Agent's while it works.
    target.set(state === "idle" ? CORE : tint).multiplyScalar(2.2);
    heartMaterial.current?.color.lerp(target, Math.min(1, delta * 3));
  });

  return (
    <group>
      <mesh ref={heart}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshBasicMaterial ref={heartMaterial} color={CORE.clone().multiplyScalar(2.2)} toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={0.35} />
      </mesh>
      <group ref={rings}>
        {[1.5, 1.85, 2.2].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2 + (i - 1) * 0.5, i * 0.6, 0]}>
            <torusGeometry args={[r, 0.012, 8, 160, Math.PI * (1.2 + i * 0.3)]} />
            <meshBasicMaterial color={CORE.clone().multiplyScalar(1.6)} toneMapped={false} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** A glowing text label drawn once to a canvas and shown as a camera-facing sprite. */
function Label({ text, color, bright }: { text: string; color: string; bright: boolean }) {
  const material = useRef<SpriteMaterial>(null);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    ctx.font = "500 28px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.fillText(text.toUpperCase(), 256, 32);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, [text, color]);

  useFrame((_, delta) => {
    if (material.current) material.current.opacity += ((bright ? 1 : 0.65) - material.current.opacity) * Math.min(1, delta * 6);
  });

  return (
    <sprite position={[0, -0.75, 0]} scale={[2, 0.25, 1]}>
      <spriteMaterial ref={material} map={texture} transparent depthWrite={false} opacity={0.65} />
    </sprite>
  );
}

function AgentNode({
  id,
  name,
  color,
  angle,
  active,
  onSelect,
}: {
  id: AgentId;
  name: string;
  color: string;
  angle: number;
  active: boolean;
  onSelect: (id: AgentId) => void;
}) {
  const node = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const glow = useMemo(() => new Color(color).multiplyScalar(2.5), [color]);
  const scale = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame(({ clock }, delta) => {
    if (!node.current) return;
    node.current.rotation.y += delta * (active ? 2 : 0.6);
    const s = (active ? 1.35 : hovered ? 1.2 : 1) + Math.sin(clock.elapsedTime * 2 + angle) * 0.04;
    node.current.scale.lerp(scale.setScalar(s), Math.min(1, delta * 8));
  });

  return (
    <group position={[Math.cos(angle) * ORBIT_RADIUS, 0, Math.sin(angle) * ORBIT_RADIUS]}>
      <mesh
        ref={node}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <octahedronGeometry args={[0.32, 0]} />
        <meshBasicMaterial color={glow} toneMapped={false} wireframe={!active && !hovered} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.53, 48]} />
        <meshBasicMaterial color={glow} toneMapped={false} transparent opacity={active ? 0.9 : 0.35} />
      </mesh>
      <Label text={name} color={color} bright={active || hovered} />
    </group>
  );
}

function Orbit({ selected, onSelect }: { selected: AgentId | null; onSelect: (id: AgentId) => void }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    // Hold still while an Agent is open so its node stays where the visitor clicked.
    if (group.current && !selected) group.current.rotation.y += delta * 0.12;
  });
  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ORBIT_RADIUS, 0.006, 6, 200]} />
        <meshBasicMaterial color="#155e75" transparent opacity={0.8} />
      </mesh>
      {AGENTS.map((agent, i) => (
        <AgentNode
          key={agent.id}
          id={agent.id}
          name={agent.name}
          color={agent.color}
          angle={(i / AGENTS.length) * Math.PI * 2 + Math.PI / 2}
          active={selected === agent.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function Particles({ count = 1600 }: { count?: number }) {
  const points = useRef<Group>(null);
  const positions = useMemo(() => {
    // Seeded so the field looks the same on every visit.
    let seed = 42;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + rand() * 14;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      array[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y -= delta * 0.02;
  });

  return (
    <group ref={points}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#67e8f9" transparent opacity={0.6} blending={AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}

export default function JarvisScene({ state, selected, onSelect }: Props) {
  const tint = AGENTS.find((a) => a.id === selected)?.color ?? "#22d3ee";
  return (
    <Canvas camera={{ position: [0, 2.6, 9.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={["#02050a"]} />
      <fog attach="fog" args={["#02050a", 10, 26]} />
      <Core state={state} tint={tint} />
      <Orbit selected={selected} onSelect={onSelect} />
      <Particles />
      <polarGridHelper args={[9, 12, 8, 64, "#0e3a4a", "#0a2530"]} position={[0, -2.4, 0]} />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={!selected} autoRotateSpeed={0.25} maxPolarAngle={Math.PI * 0.62} minPolarAngle={Math.PI * 0.25} />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.25} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
