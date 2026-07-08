export const objectBindings = {
  BrickWall: {
    id: "brick-wall",
    modelObjectId: "BrickWall",
    type: "wall",
    label: "Room Walls",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {},
    metrics: {},
    metadata: {},
    cameraState: {
      position: [-0.91, 0.87, 0.42],
      target: [0.09, 0.98, 0.036],
      fov: 45,
    },
    actions: [
      { id: "change-color", label: "Change Color", type: "command" },
      { id: "change-material", label: "Change Material", type: "command" },
      { id: "toggle-visibility", label: "Toggle Visibility", type: "command" },
    ],
  },
};
