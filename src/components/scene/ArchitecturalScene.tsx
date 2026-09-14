import { sceneConfig } from "./scene-config";

const { palette, lighting, fog } = sceneConfig;

interface Monolith {
  key: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

/** Original, procedurally placed architectural volumes. No imported assets. */
const monoliths: Monolith[] = [
  { key: "a", position: [-6.2, 3.2, -8], size: [3.2, 6.4, 3.2], color: palette.monolith },
  { key: "b", position: [-2.4, 5.4, -14], size: [2.6, 10.8, 2.6], color: palette.monolithFar },
  { key: "c", position: [3.4, 2.4, -6.5], size: [3.8, 4.8, 2.8], color: palette.monolith },
  { key: "d", position: [7.6, 4.6, -12], size: [3, 9.2, 3], color: palette.monolithFar },
  { key: "e", position: [-9.5, 2, -18], size: [5, 4, 4], color: palette.monolithFar },
  { key: "f", position: [11.5, 3, -20], size: [4.4, 6, 4.4], color: palette.monolithFar },
  { key: "g", position: [0.4, 0.6, -2.4], size: [8.4, 1.2, 4.2], color: palette.monolith },
];

/** Thin emissive strips that read as architectural lighting. */
const strips: {
  key: string;
  position: [number, number, number];
  size: [number, number, number];
}[] = [
  { key: "s1", position: [-6.2, 1.1, -6.35], size: [2.6, 0.09, 0.06] },
  { key: "s2", position: [3.4, 1.4, -5.05], size: [3, 0.09, 0.06] },
  { key: "s3", position: [0.4, 1.25, -0.25], size: [7.2, 0.07, 0.06] },
];

export function ArchitecturalScene() {
  return (
    <group>
      <color attach="background" args={[sceneConfig.render.clearColor]} />
      <fogExp2 attach="fog" args={[fog.color, fog.density]} />

      <ambientLight intensity={lighting.ambientIntensity} color="#7f93b5" />
      <directionalLight
        position={lighting.keyPosition}
        intensity={lighting.keyIntensity}
        color="#8fb4d8"
      />
      <pointLight
        position={lighting.rimPosition}
        intensity={lighting.rimIntensity}
        color={palette.emissiveSecondary}
        distance={60}
      />

      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -6]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color={palette.ground} roughness={0.86} metalness={0.08} />
      </mesh>

      {monoliths.map((m) => (
        <mesh key={m.key} position={m.position}>
          <boxGeometry args={m.size} />
          <meshStandardMaterial color={m.color} roughness={0.72} metalness={0.18} />
        </mesh>
      ))}

      {strips.map((s) => (
        <mesh key={s.key} position={s.position}>
          <boxGeometry args={s.size} />
          <meshStandardMaterial
            color={palette.emissive}
            emissive={palette.emissive}
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Focal emissive object — the intended Bloom subject. */}
      <mesh position={[4.6, 3.6, -8]}>
        <torusGeometry args={[1.45, 0.055, 24, 140]} />
        <meshStandardMaterial
          color={palette.emissive}
          emissive={palette.emissive}
          emissiveIntensity={4.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[4.6, 3.6, -8]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial
          color="#d8fbff"
          emissive={palette.emissive}
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
