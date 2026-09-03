import {
  patchSceneConfig,
  type SceneConfig,
} from "@liveroom-tech/react-immersive/utils";
import { sceneConfig } from "./sceneConfig";

// Keep the BindingBuilder export intact, then layer the demo's cinematic look
// over it. This makes it clear which values came from the builder and which
// ones are part of the animated horror treatment.
export const horrorSceneConfig: SceneConfig = patchSceneConfig(sceneConfig, {
  lighting: {
    ambient: {
      intensity: 0.006,
      color: "#526080",
    },
    lights: [
      {
        id: "horror-key",
        type: "directional",
        color: "#52617f",
        intensity: 0.02,
        position: [20, 30, 25],
        attachedToCamera: false,
        castShadow: false,
        shadowBias: -0.0005,
        visible: true,
      },
    ],
  },
  environment: {
    intensity: 0.012,
  },
  background: {
    enabled: true,
    type: "color",
    color: "#010204",
  },
  postProcessing: {
    brightnessContrast: {
      enabled: true,
      brightness: -0.06,
      contrast: 0.12,
    },
    bloom: {
      enabled: true,
      intensity: 1.45,
      luminanceThreshold: 0.35,
      luminanceSmoothing: 0.25,
      mipmapBlur: true,
      radius: 0.72,
      levels: 8,
    },
    vignette: {
      enabled: true,
      offset: 0.22,
      darkness: 0.85,
      eskil: false,
    },
  },
});
