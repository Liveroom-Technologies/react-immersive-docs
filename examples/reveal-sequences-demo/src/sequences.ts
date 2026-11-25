import type {
  SceneSequence,
  SequenceCameraView,
  SequenceEasing,
  SequenceKeyframe,
  SequenceTrack,
  SequenceVector3,
} from "@liveroom-tech/react-immersive";

// Keyframed sequences for bike.glb, stored as plain data on
// sceneConfig.sequences. BindingBuilder's Sequences timeline produces this
// same shape, so these could equally be authored visually and pasted in.
//
// Coordinate notes for this model:
// - Object IDs are glTF node names as three.js loads them (spaces become "_").
//   Most tracks target group nodes, so one track moves every mesh inside it.
// - Position keyframes are absolute node-local values, not offsets, so each
//   part lists its rest position from the GLB. For children of "RootNode" the
//   axes match the world axes (+y up, -z toward the front wheel, +x the
//   exhaust side) in centimetres; the world is 1.635x that.
// - "head_stem" (forks, front wheel, bars, headlight) lives inside "frame",
//   whose local axes are in metres with +y toward the front and +z up.
// - Camera keyframes are world-space. The bike is roughly 330 units long,
//   210 tall and centred near [0, 95, 0].

const BIKE_CENTER: SequenceVector3 = [0, 95, -10];
const HOME_CAMERA: SequenceVector3 = [430, 200, -420];
const REVEAL_END_CAMERA: SequenceVector3 = [540, 290, 260];

// Rest positions read from the GLB node transforms.
const REST: Record<string, SequenceVector3> = {
  seat: [0, 85.5957, 52.5391],
  tail_plastics: [0, 74.4385, 46.228],
  subframe_cover: [0, 86.3596, 71.4945],
  tail_light_glass: [0, 86.3596, 71.4945],
  tail_light_reflector: [0, 86.3596, 71.4945],
  tail_light: [0, 87.2408, 80.6863],
  tail_light_LEDs: [0, 86.8992, 78.6127],
  fuel_tank: [0, 89.3777, -10.8206],
  tank_sides: [0, 89.3777, -10.8206],
  tank_front_trim: [0, 89.3777, -10.8206],
  tank_dressing: [0, 89.3777, -10.8206],
  tank_front_trim_fasteners: [0, 98.5816, -29.31],
  scoops: [21.597, 79.9733, -36.5578],
  scoop_bolts: [0, 80.8137, -22.8901],
  rear_tire_surface: [0, 30.4016, 72.0032],
  rear_wheel_geometry: [0, 30.4016, 72.0032],
  rear_sprocket: [-10.743, 30.4016, 72.0032],
  rear_rotor: [6.7229, 30.4016, 72.0032],
  sprocket_nuts: [-11.3953, 30.4016, 72.0032],
  rear_rotor_bolts: [6.9924, 37.8315, 70.5425],
  sprocket_studs: [-11.4723, 30.4016, 72.0032],
  rear_wheel_spacer_left: [-12.0957, 30.4016, 72.0032],
  rear_wheel_spacer_right: [6.6097, 30.4016, 72.0032],
  head_stem: [0, 0.3021, 0.2519],
  headers_and_pipe: [-0.8354, 0, 0],
  exhaust_barrel: [7.5599, 23.7418, 28.0003],
  exhaust_mesh: [17.3313, 33.1987, 44.285],
  exhaust_ring: [16.2585, 32.1774, 42.4358],
  exhaust_bolt: [6.0074, 34.4433, 23.476],
  clutch_cover: [11.4845, 32.2723, 9.0668],
  timing_cover: [17.7795, 38.0646, -7.6996],
  stator_cover: [-21.5775, 35.9314, -4.084],
  water_pump_cover: [-21.7209, 35.9314, -4.084],
  valve_cover: [-0.8354, 57.373, -23.9746],
  valve_cover_bolts: [-9.0057, 54.9805, -28.3051],
  raditator: [0.2946, 57.8369, -36.5021],
  radiator_fan: [0.0001, 60.8887, -35.4431],
};

// Parts that move together, in the order they leave during the reveal.
const GROUPS: { name: string; parts: string[]; offset: SequenceVector3 }[] = [
  { name: "Seat lifts", parts: ["seat"], offset: [0, 22, 12] },
  {
    name: "Tail slides back",
    parts: [
      "tail_plastics",
      "subframe_cover",
      "tail_light_glass",
      "tail_light_reflector",
      "tail_light",
      "tail_light_LEDs",
    ],
    offset: [0, 10, 40],
  },
  {
    name: "Tank lifts",
    parts: [
      "fuel_tank",
      "tank_sides",
      "tank_front_trim",
      "tank_dressing",
      "tank_front_trim_fasteners",
    ],
    offset: [0, 38, 0],
  },
  {
    name: "Scoops lift",
    parts: ["scoops", "scoop_bolts"],
    offset: [0, 18, -14],
  },
  {
    name: "Rear wheel slides out",
    parts: [
      "rear_tire_surface",
      "rear_wheel_geometry",
      "rear_sprocket",
      "rear_rotor",
      "sprocket_nuts",
      "rear_rotor_bolts",
      "sprocket_studs",
      "rear_wheel_spacer_left",
      "rear_wheel_spacer_right",
    ],
    offset: [0, 0, 55],
  },
  // Inside "frame": metres, +y is forward.
  { name: "Front end pulls forward", parts: ["head_stem"], offset: [0, 0.45, 0] },
  {
    name: "Exhaust swings out",
    parts: [
      "headers_and_pipe",
      "exhaust_barrel",
      "exhaust_mesh",
      "exhaust_ring",
      "exhaust_bolt",
    ],
    offset: [32, 0, 0],
  },
  {
    name: "Right engine covers",
    parts: ["clutch_cover", "timing_cover"],
    offset: [22, 0, 0],
  },
  {
    name: "Left engine covers",
    parts: ["stator_cover", "water_pump_cover"],
    offset: [-22, 0, 0],
  },
  {
    name: "Valve cover lifts",
    parts: ["valve_cover", "valve_cover_bolts"],
    offset: [0, 22, 0],
  },
  {
    name: "Radiator moves forward",
    parts: ["raditator", "radiator_fan"],
    offset: [0, 0, -25],
  },
];

function add(a: SequenceVector3, b: SequenceVector3): SequenceVector3 {
  return [
    Number((a[0] + b[0]).toFixed(4)),
    Number((a[1] + b[1]).toFixed(4)),
    Number((a[2] + b[2]).toFixed(4)),
  ];
}

function key(
  id: string,
  time: number,
  value: SequenceKeyframe["value"],
  easing?: SequenceEasing,
): SequenceKeyframe {
  return easing ? { id, time, value, easing } : { id, time, value };
}

function cameraView(position: SequenceVector3, fov = 40): SequenceCameraView {
  return { position, target: BIKE_CENTER, fov, zoom: 1 };
}

function groupTracks(
  direction: "out" | "in",
  timing: (groupIndex: number) => [number, number],
  easing: SequenceEasing,
): SequenceTrack[] {
  return GROUPS.flatMap((group, index) => {
    const [start, end] = timing(index);
    return group.parts.map((objectId): SequenceTrack => {
      const rest = REST[objectId];
      const moved = add(rest, group.offset);
      const [from, to] = direction === "out" ? [rest, moved] : [moved, rest];
      return {
        id: `${objectId}-position`,
        name: `${group.name} (${objectId})`,
        target: { kind: "object", objectId, property: "position" },
        keyframes: [key("from", start, from, easing), key("to", end, to)],
      };
    });
  });
}

function emissiveTrack(
  id: string,
  name: string,
  objectId: string,
  keyframes: SequenceKeyframe[],
): SequenceTrack {
  return {
    id,
    name,
    target: { kind: "object", objectId, property: "emissive" },
    keyframes,
  };
}

// 1. Reveal: flagged autoPlay, so ModelViewer starts it on load. Part groups
// leave in a staggered cascade while the camera rises round to the rear.
const reveal: SceneSequence = {
  id: "reveal",
  name: "Exploded reveal",
  duration: 6,
  loop: false,
  autoPlay: true,
  tracks: [
    {
      id: "camera",
      name: "Camera sweep",
      target: { kind: "camera" },
      keyframes: [
        key("start", 0, cameraView(HOME_CAMERA), "ease-in-out"),
        key("end", 6, cameraView(REVEAL_END_CAMERA, 36)),
      ],
    },
    ...groupTracks("out", (i) => [0.5 + i * 0.3, 2.1 + i * 0.3], "ease-out"),
    emissiveTrack("tail-glow", "Tail light glows", "tail_light_LEDs", [
      key("off", 4.6, "#000000", "ease-in"),
      key("on", 5.6, "#ff2a2a"),
    ]),
    emissiveTrack("headlight-glow", "Headlight glows", "Headlight_LED_Lenses", [
      key("off", 4.6, "#000000", "ease-in"),
      key("on", 5.6, "#ffffff"),
    ]),
  ],
};

// 2. Assemble: the reverse, last part out is first back, with ease-in-out.
const assemble: SceneSequence = {
  id: "assemble",
  name: "Assemble",
  duration: 4,
  loop: false,
  autoPlay: false,
  tracks: [
    {
      id: "camera",
      name: "Camera returns",
      target: { kind: "camera" },
      keyframes: [
        key("start", 0, cameraView(REVEAL_END_CAMERA, 36), "ease-in-out"),
        key("end", 4, cameraView(HOME_CAMERA)),
      ],
    },
    ...groupTracks(
      "in",
      (i) => {
        const order = GROUPS.length - 1 - i;
        return [order * 0.15, 1.8 + order * 0.15];
      },
      "ease-in-out",
    ),
  ],
};

// 3. Showroom loop: a full camera orbit with linear easing, body paint that
// eases between colours, and lights that flash with step easing.
const ORBIT_DURATION = 10;
const ORBIT_STEPS = 8;
const ORBIT_RADIUS = 600;

const orbitKeys: SequenceKeyframe[] = Array.from(
  { length: ORBIT_STEPS + 1 },
  (_, step) => {
    // Start at the home camera angle (front right) and go once round.
    const angle =
      Math.atan2(HOME_CAMERA[0], HOME_CAMERA[2]) +
      (step / ORBIT_STEPS) * Math.PI * 2;
    const position: SequenceVector3 = [
      Number((Math.sin(angle) * ORBIT_RADIUS).toFixed(2)),
      220,
      Number((Math.cos(angle) * ORBIT_RADIUS).toFixed(2)),
    ];
    return key(
      `orbit-${step}`,
      (step / ORBIT_STEPS) * ORBIT_DURATION,
      cameraView(position),
      "linear",
    );
  },
);

const PAINT = ["#c81e1e", "#1d4ed8", "#f2b705", "#c81e1e"];
// Every node that uses the GLB's "Paint" material (the red bodywork).
const PAINTED_PARTS = ["fuel_tank", "tail_plastics", "front_fender"];
const FLASH_TIMES = [0, 0.3, 0.6, 0.9, 5, 5.3, 5.6, 5.9];

const showroom: SceneSequence = {
  id: "showroom",
  name: "Showroom loop",
  duration: ORBIT_DURATION,
  loop: true,
  autoPlay: false,
  tracks: [
    {
      id: "camera",
      name: "Camera orbit",
      target: { kind: "camera" },
      keyframes: orbitKeys,
    },
    ...PAINTED_PARTS.map(
      (objectId): SequenceTrack => ({
        id: `${objectId}-paint`,
        name: `Paint (${objectId})`,
        target: { kind: "object", objectId, property: "baseColor" },
        keyframes: PAINT.map((color, index) =>
          key(
            `paint-${index}`,
            (index / (PAINT.length - 1)) * ORBIT_DURATION,
            color,
            "ease-in-out",
          ),
        ),
      }),
    ),
    emissiveTrack(
      "headlight-flash",
      "Headlights flash",
      "Headlight_LED_Lenses",
      FLASH_TIMES.map((time, index) =>
        key(`flash-${index}`, time, index % 2 === 0 ? "#ffffff" : "#000000", "step"),
      ),
    ),
    emissiveTrack(
      "tail-flash",
      "Tail light flashes",
      "tail_light_LEDs",
      FLASH_TIMES.map((time, index) =>
        key(`flash-${index}`, time, index % 2 === 0 ? "#ff2a2a" : "#000000", "step"),
      ),
    ),
  ],
};

export const SEQUENCES: SceneSequence[] = [reveal, assemble, showroom];

