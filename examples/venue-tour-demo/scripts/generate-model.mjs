// Generates public/venue.glb: an original, box-built event hall, 20 m x 14 m, in
// metres. The stage is at the back (-z), the bar on the left (-x) and the
// entrance in the front wall (+z). public/tour.json places its stops to match.
import { fileURLToPath } from "node:url";
import { writeBoxModel } from "./glb.mjs";

const wall = "#ebe6de", floor = "#8c7b68", dark = "#2b2a29", wood = "#5c3f2c", top = "#d4cdc3";
const parts = [
  { name: "Floor", size: [20, 0.1, 14], position: [0, -0.05, 0], color: floor, roughness: 0.6 },
  { name: "Wall_Back", size: [20, 4, 0.2], position: [0, 2, -7], color: wall },
  { name: "Wall_Left", size: [0.2, 4, 14], position: [-10, 2, 0], color: wall },
  { name: "Wall_Right", size: [0.2, 4, 14], position: [10, 2, 0], color: wall },
  { name: "Wall_Front_Left", size: [8.5, 4, 0.2], position: [-5.75, 2, 7], color: wall },
  { name: "Wall_Front_Right", size: [8.5, 4, 0.2], position: [5.75, 2, 7], color: wall },
  { name: "Entrance_Lintel", size: [3, 1, 0.2], position: [0, 3.5, 7], color: wall },
  { name: "Entrance_Mat", size: [3, 0.02, 1.5], position: [0, 0.01, 6], color: "#3d4a5c" },
  { name: "Stage", size: [8, 0.8, 3.5], position: [0, 0.4, -5.1], color: dark },
  { name: "Stage_Backdrop", size: [8, 3, 0.1], position: [0, 2.3, -6.85], color: "#7a2e3a" },
  { name: "Speaker_Left", size: [0.6, 1.4, 0.6], position: [-4.6, 0.7, -5.6], color: "#1c1c1c" },
  { name: "Speaker_Right", size: [0.6, 1.4, 0.6], position: [4.6, 0.7, -5.6], color: "#1c1c1c" },
  { name: "Bar_Counter", size: [1, 1.1, 6], position: [-8.6, 0.55, 0], color: wood },
  { name: "Bar_Top", size: [1.3, 0.08, 6.2], position: [-8.6, 1.14, 0], color: top, roughness: 0.3 },
  { name: "Bar_Shelf", size: [0.4, 2, 5], position: [-9.7, 1.6, 0], color: wood },
];
[-2, -0.7, 0.6, 1.9].forEach((z, index) => {
  parts.push({ name: `Bar_Stool_${index + 1}`, size: [0.4, 0.75, 0.4], position: [-7.6, 0.375, z], color: dark });
});
let table = 0;
for (const x of [-3, 1, 5]) {
  for (const z of [-0.5, 3]) {
    table += 1;
    parts.push(
      { name: `Table_${table}_Top`, size: [1.2, 0.06, 1.2], position: [x, 0.75, z], color: top },
      { name: `Table_${table}_Base`, size: [0.15, 0.72, 0.15], position: [x, 0.36, z], color: dark },
    );
  }
}

writeBoxModel(fileURLToPath(new URL("../public/venue.glb", import.meta.url)), parts);
console.log(`Wrote public/venue.glb (${parts.length} parts)`);
