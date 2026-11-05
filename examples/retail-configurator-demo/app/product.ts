import type { ObjectBinding, ProductDefinition, ProductOption } from "@liveroom-tech/react-immersive";

const fabrics = [
  { id: "oat", label: "Oat linen", swatch: "#c8b9a0" },
  { id: "sage", label: "Sage boucle", swatch: "#8a9a7b", priceDeltaMinor: 12000 },
  { id: "clay", label: "Clay weave", swatch: "#b0674f", priceDeltaMinor: 12000 },
  { id: "navy", label: "Navy velvet", swatch: "#2f3b57", priceDeltaMinor: 24000 },
];
const finishes = [
  { id: "stone", label: "Stone", swatch: "#6b6f5e" },
  { id: "charcoal", label: "Charcoal", swatch: "#3a3d42" },
  { id: "sand", label: "Sand", swatch: "#b9a98c" },
];
const legs = [
  { id: "walnut", label: "Walnut", swatch: "#3b2a1e" },
  { id: "oak", label: "Natural oak", swatch: "#b89063", priceDeltaMinor: 4000 },
  { id: "black", label: "Black steel", swatch: "#1d1d1f", priceDeltaMinor: 6000 },
];

/** Each choice recolours every part in one binding group. */
function swatchOptions(
  choices: { id: string; label: string; swatch: string; priceDeltaMinor?: number }[],
  group: string,
  roughness: number,
): ProductOption[] {
  return choices.map((choice) => ({
    ...choice,
    appearance: [{ target: { group }, material: { baseColor: choice.swatch, roughness } }],
  }));
}

export const product: ProductDefinition = {
  id: "harbour-sofa",
  label: "Harbour three-seat sofa",
  revision: "1",
  pricing: { currency: "USD", basePriceMinor: 189900 },
  groups: [
    { id: "seat", label: "Seat cushions", required: true, defaultOptionId: "oat", display: "swatches", options: swatchOptions(fabrics, "seat", 0.95) },
    { id: "back", label: "Back cushions", required: true, defaultOptionId: "oat", display: "swatches", options: swatchOptions(fabrics, "back", 0.95) },
    { id: "frame", label: "Frame upholstery", required: true, defaultOptionId: "stone", display: "swatches", options: swatchOptions(finishes, "frame", 0.85) },
    { id: "legs", label: "Legs", required: true, defaultOptionId: "walnut", display: "swatches", options: swatchOptions(legs, "legs", 0.45) },
  ],
};

/** Node names in public/sofa.glb, grouped so one choice reaches every matching part. */
const parts: Record<string, { label: string; group: string }> = {
  Seat_Cushion_Left: { label: "Left seat cushion", group: "seat" },
  Seat_Cushion_Right: { label: "Right seat cushion", group: "seat" },
  Back_Cushion_Left: { label: "Left back cushion", group: "back" },
  Back_Cushion_Right: { label: "Right back cushion", group: "back" },
  Frame_Base: { label: "Base", group: "frame" },
  Frame_Arm_Left: { label: "Left arm", group: "frame" },
  Frame_Arm_Right: { label: "Right arm", group: "frame" },
  Frame_Back: { label: "Back frame", group: "frame" },
  Leg_FL: { label: "Front left leg", group: "legs" },
  Leg_FR: { label: "Front right leg", group: "legs" },
  Leg_BL: { label: "Back left leg", group: "legs" },
  Leg_BR: { label: "Back right leg", group: "legs" },
};

export const objectBindings: Record<string, ObjectBinding> = Object.fromEntries(
  Object.entries(parts).map(([name, { label, group }]) => [
    name,
    { id: name, modelObjectId: name, label, group, type: "furniture" },
  ]),
);
