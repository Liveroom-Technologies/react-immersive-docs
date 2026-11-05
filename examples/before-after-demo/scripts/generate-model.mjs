// Generates public/kitchen-before.glb and public/kitchen-after.glb: an original,
// box-built 6 m x 4.5 m kitchen before and after a renovation, in metres. Both
// share one coordinate system, so the comparison lines up exactly.
import { fileURLToPath } from "node:url";
import { writeBoxModel } from "./glb.mjs";

const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const room = (floor, wall) => [
  { name: "Floor", size: [6, 0.1, 4.5], position: [0, -0.05, 0], color: floor, roughness: 0.7 },
  { name: "Wall_Back", size: [6, 2.7, 0.15], position: [0, 1.35, -2.25], color: wall },
  { name: "Wall_Left", size: [0.15, 2.7, 4.5], position: [-3, 1.35, 0], color: wall },
];

const before = [
  ...room("#9c8f7e", "#d9cfa7"),
  { name: "Counter_Base", size: [3.6, 0.86, 0.6], position: [-0.6, 0.43, -1.95], color: "#7b5a3c" },
  { name: "Counter_Top", size: [3.6, 0.04, 0.62], position: [-0.6, 0.88, -1.94], color: "#a39c8f" },
  { name: "Upper_Cabinets", size: [3.6, 0.7, 0.35], position: [-0.6, 1.95, -2.0], color: "#7b5a3c" },
  { name: "Stove_Top", size: [0.6, 0.02, 0.55], position: [0, 0.91, -1.95], color: "#222222", roughness: 0.4 },
  { name: "Fridge", size: [0.75, 1.8, 0.7], position: [1.85, 0.9, -1.9], color: "#e8e6e1", roughness: 0.4 },
  { name: "Table_Top", size: [1.2, 0.05, 0.8], position: [0.5, 0.75, 0.6], color: "#8a6a4a" },
  { name: "Table_Base", size: [0.1, 0.72, 0.1], position: [0.5, 0.36, 0.6], color: "#5a4632" },
];

const green = "#2f4a45", quartz = "#ece9e4";
const after = [
  ...room("#c9b79c", "#f2f0ec"),
  { name: "Counter_Base", size: [3.6, 0.86, 0.6], position: [-0.6, 0.43, -1.95], color: green },
  { name: "Counter_Top", size: [3.6, 0.04, 0.62], position: [-0.6, 0.88, -1.94], color: quartz, roughness: 0.3 },
  { name: "Shelf_Lower", size: [1.6, 0.04, 0.28], position: [-1.6, 1.6, -2.03], color: "#b89063" },
  { name: "Shelf_Upper", size: [1.6, 0.04, 0.28], position: [-1.6, 2.0, -2.03], color: "#b89063" },
  { name: "Upper_Cabinets", size: [1.8, 0.7, 0.35], position: [0.3, 1.95, -2.0], color: green },
  { name: "Stove_Top", size: [0.6, 0.02, 0.55], position: [0, 0.91, -1.95], color: "#222222", roughness: 0.4 },
  { name: "Fridge_Panel", size: [0.75, 2.1, 0.7], position: [1.85, 1.05, -1.9], color: green },
  { name: "Island", size: [2, 0.9, 0.9], position: [0.2, 0.45, 0.5], color: green },
  { name: "Island_Top", size: [2.1, 0.04, 1], position: [0.2, 0.92, 0.5], color: quartz, roughness: 0.3 },
];
[-0.5, 0.2, 0.9].forEach((x, index) => {
  after.push({ name: `Stool_${index + 1}`, size: [0.38, 0.65, 0.38], position: [x, 0.325, 1.35], color: "#b89063" });
});
[-0.2, 0.6].forEach((x, index) => {
  after.push(
    { name: `Pendant_${index + 1}`, size: [0.25, 0.25, 0.25], position: [x, 2.1, 0.5], color: "#1f1f1f", roughness: 0.4 },
    { name: `Pendant_${index + 1}_Cord`, size: [0.02, 0.5, 0.02], position: [x, 2.475, 0.5], color: "#1f1f1f" },
  );
});

writeBoxModel(out("kitchen-before.glb"), before);
writeBoxModel(out("kitchen-after.glb"), after);
console.log(`Wrote public/kitchen-before.glb (${before.length} parts) and public/kitchen-after.glb (${after.length} parts)`);
