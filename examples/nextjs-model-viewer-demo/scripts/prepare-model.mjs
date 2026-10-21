import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
const source = fileURLToPath(new URL("../../../public/red_room.glb", import.meta.url));
const directory = fileURLToPath(new URL("../public/", import.meta.url));
const destination = fileURLToPath(new URL("../public/red_room.glb", import.meta.url));
if (!existsSync(destination)) {
  if (!existsSync(source)) throw new Error("Download https://react-immersive.liveroom.dev/red_room.glb into public/red_room.glb first. Model credit: Red Room by LaisLH, CC BY 4.0, https://skfb.ly/6VBJR");
  mkdirSync(directory, { recursive: true });
  copyFileSync(source, destination);
}
