import {
  patchSceneConfig,
  type SceneConfig,
} from "@liveroom-tech/react-immersive";
import { sceneConfig } from "./sceneConfig";

// Keep the BindingBuilder export intact, then layer the demo's cinematic look
// over it. This makes it clear which values came from the builder and which
// ones are part of the animated horror treatment.
export const horrorSceneConfig: SceneConfig = patchSceneConfig(sceneConfig, {
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
