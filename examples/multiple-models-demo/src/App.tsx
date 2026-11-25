import { useState } from "react";
import {
  ModelViewer,
  groundAsset,
  snapAssetToGrid,
  useViewerModels,
  type ModelViewerModelEntry,
  type ObjectBinding,
} from "@liveroom-tech/react-immersive";
import roomBindings from "./roomBindings.json";

const roomId = "room";
const initialModels: ModelViewerModelEntry[] = [
  { id: roomId, url: "/red_room.glb", label: "Red Room", objectBindings: roomBindings as Record<string, ObjectBinding> },
];
const lampBindings: Record<string, ObjectBinding> = {
  defaultMaterial: {
    id: "lamp", modelObjectId: "defaultMaterial", label: "Floor Lamp", type: "other",
    status: "normal", selectable: true, hoverable: true, visible: true, style: {}, metrics: {}, metadata: {},
  },
};
const slots = [1, 2, 3, 4, 5, 6];

export default function App({ licenseKey }: { licenseKey: string }) {
  const viewer = useViewerModels(initialModels);
  const [hidden, setHidden] = useState<string[]>([]);
  const [mode, setMode] = useState<"inspect" | "move" | "scale">("inspect");
  const [multiSelect, setMultiSelect] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const slot = slots.find((slot) => !viewer.models.some(({ id }) => id === `lamp-${slot}`));

  function activate(id: string) {
    viewer.onActiveModelChange(id);
    setSelected([]);
  }

  function addLamp() {
    if (slot === undefined) return;
    const transform = groundAsset(
      snapAssetToGrid({ position: [1.5, 0, 2 - (slot - 1) * 0.8], scale: [0.85, 0.85, 0.85] }, 0.5),
      { min: [-0.259, -1, -0.259], max: [0.259, 1, 0.259] },
    );
    activate(viewer.addModel({
      id: `lamp-${slot}`, url: "/floor_lamp.glb", label: `Floor Lamp ${slot}`,
      objectBindings: lampBindings, transform,
    }));
  }

  function selectPart(binding: ObjectBinding | null) {
    if (!binding) return;
    const key = binding.modelObjectId;
    setSelected((keys) => keys.includes(key) ? keys.filter((value) => value !== key) : [...keys, key]);
  }

  return (
    <main>
      <h1>Multiple Models</h1>
      <p>Add lamps to the room. Activate a model to select its parts and move or scale them.</p>
      <div className="viewer">
        <ModelViewer
          licenseKey={licenseKey}
          modelUrl={viewer.modelUrl}
          models={viewer.models.map((model) => hidden.includes(model.id ?? model.url) ? { ...model, visible: false } : model)}
          activeModelId={viewer.activeModelId}
          onActiveModelChange={activate}
          objectBindings={viewer.objectBindings}
          onObjectBindingsChange={viewer.onObjectBindingsChange}
          onObjectSelect={multiSelect ? selectPart : undefined}
          multiSelectedKeys={multiSelect ? selected : undefined}
          moveModeEnabled={mode === "move"}
          scaleModeEnabled={mode === "scale"}
          showViewGizmo
        />
      </div>
      <div className="controls">
        <button disabled={slot === undefined} onClick={addLamp}>Add floor lamp</button>
        <label>Mode{" "}
          <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="inspect">Inspect</option><option value="move">Move</option><option value="scale">Scale</option>
          </select>
        </label>
        <label><input type="checkbox" checked={multiSelect} onChange={(event) => {
          setMultiSelect(event.target.checked);
          setSelected([]);
        }} /> Select multiple parts</label>
      </div>
      <ul aria-label="Models">
        {viewer.models.map((model) => {
          const id = model.id ?? model.url;
          const isHidden = hidden.includes(id);
          return (
            <li key={id} className="controls">
              <button aria-pressed={viewer.activeModelId === id} disabled={isHidden} onClick={() => activate(id)}>{model.label}</button>
              {id !== roomId && <>
                <button onClick={() => {
                  const copyId = viewer.duplicateModel(id);
                  if (copyId) activate(copyId);
                }}>Duplicate</button>
                <button onClick={() => {
                  if (isHidden) setHidden((ids) => ids.filter((value) => value !== id));
                  else {
                    setHidden((ids) => [...ids, id]);
                    if (viewer.activeModelId === id) activate(roomId);
                  }
                }}>{isHidden ? "Show" : "Hide"}</button>
                <button onClick={() => {
                  if (viewer.activeModelId === id) activate(roomId);
                  setHidden((ids) => ids.filter((value) => value !== id));
                  viewer.removeModel(id);
                }}>Remove</button>
              </>}
            </li>
          );
        })}
      </ul>
      <p className="credit"><a href="https://skfb.ly/6VBJR">Red Room</a> by LaisLH and <a href="https://sketchfab.com/3d-models/floor-lamp-33eb258d9873435690254cfbb0ea46ec">Floor Lamp</a> by bilgehan.korkmaz · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
    </main>
  );
}
