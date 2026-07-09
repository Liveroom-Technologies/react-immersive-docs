import type { ObjectBinding } from "@live_room/react-immersive";

export type ActionEffect = {
  targetObjectId: string;
  patch: Partial<ObjectBinding>;
};

export type DemoAction = NonNullable<ObjectBinding["actions"]>[number] & {
  effects?: ActionEffect[];
};

export type DemoObjectBinding = Omit<ObjectBinding, "actions"> & {
  actions?: DemoAction[];
};

export const objectBindings: Record<string, DemoObjectBinding> = {
  control_panel: {
    id: "control-panel",
    modelObjectId: "control_panel",
    type: "other",
    label: "Control Panel",
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  light_a_1: {
    id: "light-a-1",
    modelObjectId: "light_a_1",
    type: "light",
    label: "Light A 1",
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {
      material: {
        baseColor: "#64748b",
        emissiveIntensity: 0,
      },
    },
    actions: [],
    metrics: {},
    metadata: { state: "off", controlledBy: "switch_a" },
  },
  light_a_2: {
    id: "light-a-2",
    modelObjectId: "light_a_2",
    type: "light",
    label: "Light A 2",
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {
      material: {
        baseColor: "#64748b",
        emissiveIntensity: 0,
      },
    },
    actions: [],
    metrics: {},
    metadata: { state: "off", controlledBy: "switch_a" },
  },
  light_b_1: {
    id: "light-b-1",
    modelObjectId: "light_b_1",
    type: "light",
    label: "Light B 1",
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {
      material: {
        baseColor: "#64748b",
        emissiveIntensity: 0,
      },
    },
    actions: [],
    metrics: {},
    metadata: { state: "off", controlledBy: "switch_b" },
  },
  light_b_2: {
    id: "light-b-2",
    modelObjectId: "light_b_2",
    type: "light",
    label: "Light B 2",
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {
      material: {
        baseColor: "#64748b",
        emissiveIntensity: 0,
      },
    },
    actions: [],
    metrics: {},
    metadata: { state: "off", controlledBy: "switch_b" },
  },
  light_a_1_fixture: {
    id: "light-a-1-fixture",
    modelObjectId: "light_a_1_fixture",
    type: "light",
    label: "Light A 1 Fixture",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  light_a_2_fixture: {
    id: "light-a-2-fixture",
    modelObjectId: "light_a_2_fixture",
    type: "light",
    label: "Light A 2 Fixture",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  light_b_1_fixture: {
    id: "light-b-1-fixture",
    modelObjectId: "light_b_1_fixture",
    type: "light",
    label: "Light B 1 Fixture",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  light_b_2_fixture: {
    id: "light-b-2-fixture",
    modelObjectId: "light_b_2_fixture",
    type: "light",
    label: "Light B 2 Fixture",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  room_back_wall: {
    id: "room-back-wall",
    modelObjectId: "room_back_wall",
    type: "wall",
    label: "Room Back Wall",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  room_floor: {
    id: "room-floor",
    modelObjectId: "room_floor",
    type: "floor",
    label: "Room Floor",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  room_left_wall: {
    id: "room-left-wall",
    modelObjectId: "room_left_wall",
    type: "wall",
    label: "Room Left Wall",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  room_right_wall: {
    id: "room-right-wall",
    modelObjectId: "room_right_wall",
    type: "wall",
    label: "Room Right Wall",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  switch_a: {
    id: "switch-a",
    modelObjectId: "switch_a",
    type: "switch",
    label: "Switch A",
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {
      material: {
        baseColor: "#334155",
        emissiveIntensity: 0,
      },
    },
    actions: [
      {
        id: "turn-on-a-lights",
        label: "Turn On",
        type: "command",
        effects: [
          {
            targetObjectId: "light_a_1",
            patch: {
              style: {
                material: {
                  baseColor: "#fef08a",
                  emissive: "#fde047",
                  emissiveIntensity: 2.2,
                },
              },
              metadata: { state: "on" },
            },
          },
          {
            targetObjectId: "light_a_2",
            patch: {
              style: {
                material: {
                  baseColor: "#fef08a",
                  emissive: "#fde047",
                  emissiveIntensity: 2.2,
                },
              },
              metadata: { state: "on" },
            },
          },
        ],
      },
      {
        id: "turn-off-a-lights",
        label: "Turn Off",
        type: "command",
        effects: [
          {
            targetObjectId: "light_a_1",
            patch: {
              style: {
                material: {
                  baseColor: "#64748b",
                  emissive: undefined,
                  emissiveIntensity: 0,
                },
              },
              metadata: { state: "off" },
            },
          },
          {
            targetObjectId: "light_a_2",
            patch: {
              style: {
                material: {
                  baseColor: "#64748b",
                  emissive: undefined,
                  emissiveIntensity: 0,
                },
              },
              metadata: { state: "off" },
            },
          },
        ],
      },
    ],
    metrics: {},
    metadata: {
      state: "off",
      controls: ["light_a_1", "light_a_2"],
    },
  },
  switch_a_indicator: {
    id: "switch-a-indicator",
    modelObjectId: "switch_a_indicator",
    type: "indicator",
    label: "Switch A Indicator",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
  switch_b: {
    id: "switch-b",
    modelObjectId: "switch_b",
    type: "switch",
    label: "Switch B",
    status: "normal",
    selectable: true,
    hoverable: true,
    visible: true,
    style: {
      material: {
        baseColor: "#334155",
        emissiveIntensity: 0,
      },
    },
    actions: [
      {
        id: "turn-on-b-lights",
        label: "Turn On",
        type: "command",
        effects: [
          {
            targetObjectId: "light_b_1",
            patch: {
              style: {
                material: {
                  baseColor: "#fef08a",
                  emissive: "#fde047",
                  emissiveIntensity: 2.2,
                },
              },
              metadata: { state: "on" },
            },
          },
          {
            targetObjectId: "light_b_2",
            patch: {
              style: {
                material: {
                  baseColor: "#fef08a",
                  emissive: "#fde047",
                  emissiveIntensity: 2.2,
                },
              },
              metadata: { state: "on" },
            },
          },
        ],
      },
      {
        id: "turn-off-b-lights",
        label: "Turn Off",
        type: "command",
        effects: [
          {
            targetObjectId: "light_b_1",
            patch: {
              style: {
                material: {
                  baseColor: "#64748b",
                  emissive: undefined,
                  emissiveIntensity: 0,
                },
              },
              metadata: { state: "off" },
            },
          },
          {
            targetObjectId: "light_b_2",
            patch: {
              style: {
                material: {
                  baseColor: "#64748b",
                  emissive: undefined,
                  emissiveIntensity: 0,
                },
              },
              metadata: { state: "off" },
            },
          },
        ],
      },
    ],
    metrics: {},
    metadata: {
      state: "off",
      controls: ["light_b_1", "light_b_2"],
    },
  },
  switch_b_indicator: {
    id: "switch-b-indicator",
    modelObjectId: "switch_b_indicator",
    type: "indicator",
    label: "Switch B Indicator",
    status: "normal",
    selectable: false,
    hoverable: false,
    visible: true,
    style: {},
    actions: [],
    metrics: {},
    metadata: {},
  },
};
