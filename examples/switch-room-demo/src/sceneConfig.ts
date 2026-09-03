import {
  DEFAULT_SCENE_CONFIG,
  patchSceneConfig,
  type SceneConfig,
} from "@liveroom-tech/react-immersive/utils";

export const SWITCH_LIGHT_IDS = [
  "light_a_1",
  "light_a_2",
  "light_b_1",
  "light_b_2",
] as const;

export const switchSceneConfig: SceneConfig = patchSceneConfig(
  DEFAULT_SCENE_CONFIG,
  {
    lighting: {
      ambient: { color: "#dbeafe", intensity: 0.035 },
      lights: [
        {
          id: "switch-room-key",
          type: "directional",
          color: "#f8fafc",
          intensity: 0.04,
          position: [3, 5, 4],
          attachedToCamera: false,
          castShadow: false,
          shadowBias: -0.0005,
          visible: true,
        },
        ...SWITCH_LIGHT_IDS.map((objectId) => ({
          id: `scene-${objectId}`,
          type: "point" as const,
          color: "#fde68a",
          intensity: 1.8,
          position: [0, 0, 0] as [number, number, number],
          distance: 4,
          decay: 2,
          attachedToCamera: false,
          castShadow: false,
          shadowBias: -0.0005,
          visible: false,
        })),
      ],
    },
  },
);
