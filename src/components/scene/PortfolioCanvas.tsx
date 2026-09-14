import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

import { ArchitecturalScene } from "./ArchitecturalScene";
import { BloomEffects } from "./BloomEffects";
import { CameraController } from "./CameraController";
import { ContextEvents } from "./ContextEvents";
import { GraphicsLifecycle } from "./GraphicsLifecycle";
import { sceneConfig } from "./scene-config";

interface Props {
  reduceEffects: boolean;
  pageVisible: boolean;
  onReady: () => void;
  onContextLost: () => void;
  onContextRestored: () => void;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

/**
 * The single persistent Canvas. It is mounted once per page visit and is
 * never remounted by section navigation.
 */
export default function PortfolioCanvas({
  reduceEffects,
  pageVisible,
  onReady,
  onContextLost,
  onContextRestored,
}: Props) {
  const { camera, render } = sceneConfig;
  const dprCap = reduceEffects ? render.dprCapReduced : render.dprCap;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, dprCap]}
      gl={{ antialias: !reduceEffects, powerPreference: "high-performance" }}
      camera={{
        position: camera.position,
        fov: camera.fov,
        near: camera.near,
        far: camera.far,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <CameraController />
      <ArchitecturalScene />
      {!reduceEffects && <BloomEffects />}
      <GraphicsLifecycle
        qualityKey={`${reduceEffects ? "reduced" : "full"}:${dprCap}`}
        pageVisible={pageVisible}
      />
      <ContextEvents onContextLost={onContextLost} onContextRestored={onContextRestored} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
