"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef, useState, type RefObject } from "react";
import { AdditiveBlending, CanvasTexture, Color, MathUtils, Vector3, type Group, type Mesh } from "three";
import type { Branch } from "@/lib/skill-map/types";

type Props = {
  branches: Branch[];
  recommended: string | null;
  chosen: string | null;
  onPick: (id: string) => void;
  /** Buttons in the DOM, one per Branch, that the scene pins under each Gate. */
  labels: RefObject<Map<string, HTMLElement>>;
};

/** A disc that glows in the Branch color at the rim and falls to black in the middle. */
function vortexTexture(color: string) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  const c = new Color(color);
  const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(2,6,23,1)");
  grad.addColorStop(0.55, `rgba(${rgb},0.35)`);
  grad.addColorStop(0.92, `rgba(${rgb},0.9)`);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  // Faint spiral arms so the rotation reads.
  g.strokeStyle = `rgba(${rgb},0.5)`;
  g.lineWidth = 3;
  for (let arm = 0; arm < 4; arm++) {
    g.beginPath();
    for (let t = 0; t < 1; t += 0.02) {
      const a = arm * (Math.PI / 2) + t * 5;
      const r = (size / 2) * 0.9 * t;
      g.lineTo(size / 2 + Math.cos(a) * r, size / 2 + Math.sin(a) * r);
    }
    g.stroke();
  }
  return new CanvasTexture(canvas);
}

function Gate({
  branch,
  position,
  recommended,
  chosen,
  onPick,
}: {
  branch: Branch;
  position: Vector3;
  recommended: boolean;
  chosen: boolean;
  onPick: () => void;
}) {
  const group = useRef<Group>(null);
  const vortex = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => vortexTexture(branch.color), [branch.color]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const k = 1 - Math.exp(-delta * 6);
    if (vortex.current) vortex.current.rotation.z -= delta * (hovered || chosen ? 2.4 : 0.9);
    if (group.current) {
      const s = chosen ? 1.25 : hovered ? 1.12 : 1;
      group.current.scale.setScalar(MathUtils.lerp(group.current.scale.x, s, k));
      group.current.position.y = position.y + Math.sin(t * 1.2 + position.x) * 0.08;
    }
    if (halo.current) halo.current.scale.setScalar(1 + (recommended ? 0.08 + Math.sin(t * 3) * 0.06 : 0));
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onPick();
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
      <mesh ref={vortex}>
        <circleGeometry args={[1.05, 64]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      <mesh ref={halo}>
        <torusGeometry args={[1.12, 0.06, 16, 96]} />
        <meshBasicMaterial
          color={new Color(branch.color).multiplyScalar(recommended || chosen ? 2.2 : 1.4)}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <ringGeometry args={[1.15, 1.6, 64]} />
        <meshBasicMaterial
          color={branch.color}
          transparent
          opacity={0.05}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Keeps each Branch's DOM button pinned under its Gate as the view resizes. */
function LabelSync({ spots, labels }: { spots: Map<string, Vector3>; labels: Props["labels"] }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    spots.forEach((at, id) => {
      const el = labels.current.get(id);
      if (!el) return;
      v.copy(at)
        .setY(at.y - 1.7)
        .project(camera);
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * size.width}px, ${(-v.y * 0.5 + 0.5) * size.height}px) translate(-50%, 0)`;
      el.style.visibility = "visible";
    });
  });
  return null;
}

export default function GatesScene({ branches, recommended, chosen, onPick, labels }: Props) {
  // An arc of Gates, the middle one nearest.
  const spots = useMemo(
    () =>
      new Map(
        branches.map((b, i) => {
          const off = i - (branches.length - 1) / 2;
          return [b.id, new Vector3(off * 3.2, 0.2, -Math.abs(off) * 0.9)];
        }),
      ),
    [branches],
  );

  return (
    <Canvas camera={{ position: [0, 0.4, 10.5], fov: 50 }} dpr={[1, 2]}>
      <color attach="background" args={["#020617"]} />
      {branches.map((b) => (
        <Gate
          key={b.id}
          branch={b}
          position={spots.get(b.id)!}
          recommended={b.id === recommended}
          chosen={b.id === chosen}
          onPick={() => onPick(b.id)}
        />
      ))}
      <LabelSync spots={spots} labels={labels} />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
