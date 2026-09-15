import { sceneConfig } from "./scene-config";

const { materials, emissive, lighting, fog, architecture } = sceneConfig;
const { portal, pierSize } = architecture;

/**
 * One coherent architectural gallery, built entirely from procedural
 * geometry. Composition rules:
 * - a continuous floor establishes perspective,
 * - two asymmetric foreground elements frame the view,
 * - midground piers and recessed openings form a route,
 * - distant silhouettes dissolve into fog,
 * - a freestanding portal is the single focal landmark.
 */

function Architecture({
  position,
  size,
  mineral = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  mineral?: boolean;
}) {
  const m = mineral ? materials.mineral : materials.architecture;
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={m.color} roughness={m.roughness} metalness={m.metalness} />
    </mesh>
  );
}

function Metal({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={materials.metal.color}
        roughness={materials.metal.roughness}
        metalness={materials.metal.metalness}
      />
    </mesh>
  );
}

function Emissive({
  position,
  size,
  intensity,
}: {
  position: [number, number, number];
  size: [number, number, number];
  intensity: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={emissive.color}
        emissive={emissive.color}
        emissiveIntensity={intensity}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Substantial pier with a thin metal inset on its inward face. */
function Pier({
  x,
  z,
  height,
  mineral,
  insetSide,
}: {
  x: number;
  z: number;
  height: number;
  mineral: boolean;
  insetSide: 1 | -1;
}) {
  const { width, depth } = pierSize;
  return (
    <group position={[x, 0, z]}>
      <Architecture position={[0, height / 2, 0]} size={[width, height, depth]} mineral={mineral} />
      <Metal
        position={[(insetSide * width) / 2 + insetSide * 0.015, height / 2, 0]}
        size={[0.06, height * 0.82, depth * 0.34]}
      />
      <Architecture position={[0, height + 0.18, 0]} size={[width + 0.5, 0.36, depth + 0.5]} />
    </group>
  );
}

/** A recessed opening: a set-back panel with a lit channel at its head. */
function Recess({
  x,
  z,
  width,
  height,
  facing,
}: {
  x: number;
  z: number;
  width: number;
  height: number;
  facing: 1 | -1;
}) {
  return (
    <group position={[x, 0, z]} rotation-y={(facing * Math.PI) / 2}>
      <Architecture position={[0, height / 2, -0.55]} size={[width, height, 0.5]} />
      <Metal position={[0, height / 2, -0.24]} size={[width * 0.5, height * 0.7, 0.05]} />
      <Emissive
        position={[0, height - 0.25, -0.2]}
        size={[width * 0.78, 0.05, 0.05]}
        intensity={emissive.guideIntensity}
      />
    </group>
  );
}

/**
 * The focal landmark: a freestanding rectangular portal with substantial dark
 * framing, a thin illuminated inner edge and a shallow plinth.
 */
function Portal() {
  const { outer, opening, frameDepth, innerEdge, plinth, position } = portal;
  const sideWidth = (outer.width - opening.width) / 2;
  const headHeight = outer.height - opening.height - plinth.height;
  const openingBase = plinth.height;
  const sideX = opening.width / 2 + sideWidth / 2;
  const edgeZ = frameDepth / 2 + innerEdge / 2;

  return (
    <group position={position}>
      {/* Shallow plinth */}
      <Architecture
        position={[0, plinth.height / 2, 0]}
        size={[plinth.width, plinth.height, plinth.depth]}
        mineral
      />

      {/* Dark frame: two jambs and a head */}
      <Architecture
        position={[-sideX, openingBase + opening.height / 2, 0]}
        size={[sideWidth, opening.height, frameDepth]}
      />
      <Architecture
        position={[sideX, openingBase + opening.height / 2, 0]}
        size={[sideWidth, opening.height, frameDepth]}
      />
      <Architecture
        position={[0, openingBase + opening.height + headHeight / 2, 0]}
        size={[outer.width, headHeight, frameDepth]}
      />

      {/* Metal facing keeps the silhouette crisp */}
      <Metal
        position={[0, openingBase + opening.height + headHeight / 2, frameDepth / 2 + 0.02]}
        size={[outer.width, 0.12, 0.04]}
      />

      {/* Thin illuminated inner edge, front and back */}
      {[edgeZ, -edgeZ].map((z) => (
        <group key={z}>
          <Emissive
            position={[-opening.width / 2 + innerEdge / 2, openingBase + opening.height / 2, z]}
            size={[innerEdge, opening.height, innerEdge]}
            intensity={emissive.portalIntensity}
          />
          <Emissive
            position={[opening.width / 2 - innerEdge / 2, openingBase + opening.height / 2, z]}
            size={[innerEdge, opening.height, innerEdge]}
            intensity={emissive.portalIntensity}
          />
          <Emissive
            position={[0, openingBase + opening.height - innerEdge / 2, z]}
            size={[opening.width, innerEdge, innerEdge]}
            intensity={emissive.portalIntensity}
          />
          <Emissive
            position={[0, openingBase + innerEdge / 2, z]}
            size={[opening.width, innerEdge, innerEdge]}
            intensity={emissive.portalIntensity}
          />
        </group>
      ))}

      <pointLight
        position={[0, openingBase + opening.height / 2, 0]}
        intensity={lighting.portal.intensity}
        color={lighting.portal.color}
        distance={lighting.portal.distance}
      />
    </group>
  );
}

export function ArchitecturalScene() {
  return (
    <group>
      <color attach="background" args={[sceneConfig.render.clearColor]} />
      <fogExp2 attach="fog" args={[fog.color, fog.density]} />

      <ambientLight intensity={lighting.fill.intensity} color={lighting.fill.color} />
      <directionalLight
        position={lighting.key.position}
        intensity={lighting.key.intensity}
        color={lighting.key.color}
      />
      <pointLight
        position={lighting.rim.position}
        intensity={lighting.rim.intensity}
        color={lighting.rim.color}
        distance={lighting.rim.distance}
      />

      {/* Continuous floor */}
      <mesh rotation-x={-Math.PI / 2} position={[architecture.routeX, 0, architecture.floor.z]}>
        <planeGeometry args={[architecture.floor.size, architecture.floor.size]} />
        <meshStandardMaterial
          color={materials.floor.color}
          roughness={materials.floor.roughness}
          metalness={materials.floor.metalness}
        />
      </mesh>

      {architecture.foreground.map((f) => (
        <Architecture key={f.key} position={f.position} size={f.size} />
      ))}

      {architecture.piers.map((p) => (
        <Pier
          key={p.key}
          x={p.x}
          z={p.z}
          height={p.height}
          mineral={p.mineral}
          insetSide={p.x < architecture.routeX ? 1 : -1}
        />
      ))}

      {architecture.recesses.map((r) => (
        <Recess
          key={r.key}
          x={r.x}
          z={r.z}
          width={r.width}
          height={r.height}
          facing={r.x < architecture.routeX ? -1 : 1}
        />
      ))}

      {architecture.platforms.map((p) => (
        <Architecture key={p.key} position={p.position} size={p.size} mineral />
      ))}

      {architecture.guides.map((g) => (
        <Emissive
          key={g.key}
          position={g.position}
          size={g.size}
          intensity={emissive.guideIntensity}
        />
      ))}

      {architecture.distant.map((d) => (
        <mesh key={d.key} position={d.position}>
          <boxGeometry args={d.size} />
          <meshStandardMaterial
            color={materials.distant.color}
            roughness={materials.distant.roughness}
            metalness={materials.distant.metalness}
          />
        </mesh>
      ))}

      <Portal />
    </group>
  );
}
