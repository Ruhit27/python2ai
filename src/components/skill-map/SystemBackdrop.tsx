"use client";

// Particle buffers are mutated every frame by design.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdditiveBlending, CanvasTexture, type BufferGeometry, type Group, type PointsMaterial } from "three";

const DRIFT = 700;
const BURST = 360;
const BG = "#020617";

/** A soft round dot, so particles aren't drawn as squares. */
function dot() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const g = canvas.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}

function scatter() {
  const p = new Float32Array(DRIFT * 3);
  for (let i = 0; i < DRIFT; i++) {
    p[i * 3] = (Math.random() - 0.5) * 40;
    p[i * 3 + 1] = (Math.random() - 0.5) * 20;
    p[i * 3 + 2] = -Math.random() * 30;
  }
  return p;
}

/** Motes of light rising slowly through the void, wrapping back to the bottom. */
function Drift({ still, map }: { still: boolean; map: CanvasTexture }) {
  const geometry = useRef<BufferGeometry>(null);
  const [positions] = useState(scatter);

  useFrame((_, delta) => {
    if (still || !geometry.current) return;
    for (let i = 0; i < DRIFT; i++) {
      positions[i * 3 + 1] += delta * (0.25 + (i % 7) * 0.05);
      if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -10;
    }
    geometry.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map}
        size={0.14}
        color="#7dd3fc"
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** A floor of grid lines receding into the dark, gliding toward the viewer. */
function Floor({ still }: { still: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (still || !group.current) return;
    group.current.position.z = (group.current.position.z + delta * 0.6) % 2;
  });
  return (
    <group ref={group}>
      <gridHelper args={[80, 40, "#0ea5e9", "#0c2a4a"]} position={[0, -3, -10]} />
    </group>
  );
}

/** A fountain of light when the Learner levels up; fired whenever `burst` changes. */
function Burst({ burst, map }: { burst: number; map: CanvasTexture }) {
  const geometry = useRef<BufferGeometry>(null);
  const material = useRef<PointsMaterial>(null);
  const life = useRef(0);
  const positions = useMemo(() => new Float32Array(BURST * 3), []);
  const velocity = useMemo(() => new Float32Array(BURST * 3), []);

  useEffect(() => {
    if (!burst) return;
    for (let i = 0; i < BURST; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 2.5;
      positions.set([Math.cos(a) * 0.3, -2.5, Math.sin(a) * 0.3], i * 3);
      velocity.set([Math.cos(a) * r, 5 + Math.random() * 7, Math.sin(a) * r], i * 3);
    }
    life.current = 1;
  }, [burst, positions, velocity]);

  useFrame((_, delta) => {
    if (!geometry.current || !material.current) return;
    if (life.current <= 0) {
      material.current.opacity = 0;
      return;
    }
    life.current -= delta * 0.6;
    for (let i = 0; i < BURST * 3; i++) positions[i] += velocity[i] * delta;
    for (let i = 1; i < BURST * 3; i += 3) velocity[i] -= delta * 4;
    material.current.opacity = Math.max(0, life.current);
    geometry.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        map={map}
        size={0.3}
        color="#a5f3fc"
        transparent
        opacity={0}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** The dark blue void behind every System window. `still` stops all motion. */
export default function SystemBackdrop({ burst, still }: { burst: number; still: boolean }) {
  const [map] = useState(dot);
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0.5, 9], fov: 55 }} dpr={[1, 1.5]} frameloop={still ? "demand" : "always"}>
        <color attach="background" args={[BG]} />
        <fog attach="fog" args={[BG, 6, 34]} />
        <Floor still={still} />
        <Drift still={still} map={map} />
        <Burst burst={burst} map={map} />
      </Canvas>
      {/* A soft blue glow from below, and a vignette to keep windows readable. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgba(14,165,233,0.25),transparent_60%),radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.85))]" />
    </div>
  );
}
