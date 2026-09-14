import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

import { sceneConfig } from "./scene-config";

/**
 * The single owner of camera movement.
 *
 * Layer 1 keeps the camera fixed: it is positioned once and never animated.
 * Layer 3 will add GSAP-driven travel here, and nowhere else, so that no
 * other loop or control can compete for the camera.
 */
export function CameraController() {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const { position, lookAt } = sceneConfig.camera;
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate]);

  return null;
}
