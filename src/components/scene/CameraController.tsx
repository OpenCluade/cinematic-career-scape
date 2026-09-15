import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PerspectiveCamera } from "three";

import { MOBILE_BREAKPOINT, sceneConfig } from "./scene-config";

/**
 * The single owner of camera movement.
 *
 * The camera is stationary within a layout. The only change it makes is
 * swapping between the desktop and mobile pose when the canvas crosses the
 * responsive breakpoint — applied instantly, with no animated travel.
 * Layer 3 will add GSAP-driven choreography here, and nowhere else.
 */
export function CameraController() {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const width = useThree((state) => state.size.width);

  const isMobile = width > 0 && width < MOBILE_BREAKPOINT;

  useEffect(() => {
    const pose = isMobile ? sceneConfig.camera.mobile : sceneConfig.camera.desktop;
    camera.position.set(pose.position[0], pose.position[1], pose.position[2]);
    camera.lookAt(pose.lookAt[0], pose.lookAt[1], pose.lookAt[2]);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = pose.fov;
      camera.near = sceneConfig.camera.near;
      camera.far = sceneConfig.camera.far;
    }
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, isMobile]);

  return null;
}
