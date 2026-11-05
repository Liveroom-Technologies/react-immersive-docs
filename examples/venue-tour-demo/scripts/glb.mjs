// A tiny glTF 2.0 binary writer for box-built models, with no dependencies.
// Each part becomes one named node, so object bindings can target it by name.
import { writeFileSync } from "node:fs";

/**
 * @typedef {{ name: string, size: [number, number, number], position: [number, number, number],
 *   color: string, roughness?: number, metalness?: number }} BoxPart
 */

// A unit cube centred on the origin: 6 faces x 4 corners, with flat normals.
function unitCube() {
  const faces = [
    [[1, 0, 0], [[0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]]],
    [[-1, 0, 0], [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]]],
    [[0, 1, 0], [[-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5]]],
    [[0, -1, 0], [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5]]],
    [[0, 0, 1], [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]]],
    [[0, 0, -1], [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]]],
  ];
  const positions = [], normals = [], indices = [];
  faces.forEach(([normal, corners], face) => {
    for (const corner of corners) { positions.push(...corner); normals.push(...normal); }
    const base = face * 4;
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  });
  return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
}

function linear(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 255, value & 255].map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
}

const pad4 = (length) => (length + 3) & ~3;

/** Writes `parts` as a GLB file at `file`. */
export function writeBoxModel(file, parts) {
  const cube = unitCube();
  const chunks = [cube.positions, cube.normals, cube.indices];
  const bufferViews = [];
  let offset = 0;
  for (const [index, chunk] of chunks.entries()) {
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: chunk.byteLength, target: index === 2 ? 34963 : 34962 });
    offset += pad4(chunk.byteLength);
  }
  const binary = Buffer.alloc(offset);
  chunks.forEach((chunk, index) => Buffer.from(chunk.buffer).copy(binary, bufferViews[index].byteOffset));

  // One material and mesh per distinct look, shared by every part that uses it.
  const looks = new Map();
  for (const part of parts) {
    const key = `${part.color}/${part.roughness ?? 0.8}/${part.metalness ?? 0}`;
    if (!looks.has(key)) looks.set(key, { index: looks.size, part });
  }
  const gltf = {
    asset: { version: "2.0", generator: "react-immersive example generator" },
    scene: 0,
    scenes: [{ nodes: parts.map((_, index) => index) }],
    nodes: parts.map((part) => ({
      name: part.name,
      mesh: looks.get(`${part.color}/${part.roughness ?? 0.8}/${part.metalness ?? 0}`).index,
      translation: part.position,
      scale: part.size,
    })),
    meshes: [...looks.values()].map(({ index }) => ({
      primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: index }],
    })),
    materials: [...looks.values()].map(({ part }) => ({
      name: part.color,
      pbrMetallicRoughness: {
        baseColorFactor: [...linear(part.color), 1],
        roughnessFactor: part.roughness ?? 0.8,
        metallicFactor: part.metalness ?? 0,
      },
    })),
    accessors: [
      { bufferView: 0, componentType: 5126, count: 24, type: "VEC3", min: [-0.5, -0.5, -0.5], max: [0.5, 0.5, 0.5] },
      { bufferView: 1, componentType: 5126, count: 24, type: "VEC3" },
      { bufferView: 2, componentType: 5123, count: 36, type: "SCALAR" },
    ],
    bufferViews,
    buffers: [{ byteLength: binary.length }],
  };

  let json = Buffer.from(JSON.stringify(gltf));
  json = Buffer.concat([json, Buffer.alloc(pad4(json.length) - json.length, 0x20)]);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + json.length + 8 + binary.length, 8);
  const chunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32LE(data.length, 0);
    head.writeUInt32LE(type, 4);
    return Buffer.concat([head, data]);
  };
  writeFileSync(file, Buffer.concat([header, chunk(0x4e4f534a, json), chunk(0x004e4942, binary)]));
}
