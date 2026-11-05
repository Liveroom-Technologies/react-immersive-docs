// Generates public/sofa.glb: an original, box-built three-seat sofa, 2.2 m wide,
// in metres. Node names are what src/product.ts binds to.
import { fileURLToPath } from "node:url";
import { writeBoxModel } from "./glb.mjs";

const wood = "#3b2a1e", frame = "#6b6f5e", cushion = "#c8b9a0";
const parts = [];
for (const [x, z, id] of [[-1, 0.38, "FL"], [1, 0.38, "FR"], [-1, -0.38, "BL"], [1, -0.38, "BR"]]) {
  parts.push({ name: `Leg_${id}`, size: [0.06, 0.12, 0.06], position: [x, 0.06, z], color: wood, roughness: 0.5 });
}
parts.push(
  { name: "Frame_Base", size: [2.2, 0.2, 0.95], position: [0, 0.22, 0], color: frame },
  { name: "Frame_Arm_Left", size: [0.18, 0.38, 0.95], position: [-1.01, 0.51, 0], color: frame },
  { name: "Frame_Arm_Right", size: [0.18, 0.38, 0.95], position: [1.01, 0.51, 0], color: frame },
  { name: "Frame_Back", size: [1.84, 0.5, 0.18], position: [0, 0.57, -0.385], color: frame },
  { name: "Seat_Cushion_Left", size: [0.9, 0.16, 0.72], position: [-0.46, 0.4, 0.09], color: cushion, roughness: 0.95 },
  { name: "Seat_Cushion_Right", size: [0.9, 0.16, 0.72], position: [0.46, 0.4, 0.09], color: cushion, roughness: 0.95 },
  { name: "Back_Cushion_Left", size: [0.9, 0.42, 0.16], position: [-0.46, 0.69, -0.21], color: cushion, roughness: 0.95 },
  { name: "Back_Cushion_Right", size: [0.9, 0.42, 0.16], position: [0.46, 0.69, -0.21], color: cushion, roughness: 0.95 },
);

writeBoxModel(fileURLToPath(new URL("../public/sofa.glb", import.meta.url)), parts);
console.log(`Wrote public/sofa.glb (${parts.length} parts)`);
