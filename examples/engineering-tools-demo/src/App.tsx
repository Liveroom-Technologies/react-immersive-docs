import { useState } from "react";
import {
  DEFAULT_SCENE_CONFIG,
  ModelViewer,
  calibrateMeasurements,
  measurementResult,
  measurementsToCsv,
  useViewerIsolation,
  type MeasurementSettings,
  type SavedMeasurement,
  type SceneConfig,
} from "@liveroom-tech/react-immersive";
import { objectBindings } from "./objectBindings";

const MODEL_URL = "/cartoon_car.glb";

export default function App({ licenseKey }: { licenseKey: string }) {
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(DEFAULT_SCENE_CONFIG);
  const { isolation, handleIsolationChange } = useViewerIsolation();
  const [measurements, setMeasurements] = useState<SavedMeasurement[]>([]);
  const [settings, setSettings] = useState<MeasurementSettings>({ sourceUnit: "m", displayUnit: "cm" });
  const [knownLength, setKnownLength] = useState("");
  const [error, setError] = useState("");
  const distance = measurements.filter((measurement) => measurement.tool === "distance").at(-1);

  function calibrate() {
    if (!distance) return;
    const length = Number(knownLength);
    if (!Number.isFinite(length) || length <= 0) {
      setError("Enter a positive reference length in metres.");
      return;
    }
    try {
      const { rawValue } = measurementResult(distance, settings);
      if (rawValue === null) throw new Error("Measure between two distinct points to calibrate.");
      setSettings(calibrateMeasurements(rawValue, length, "m", settings));
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not calibrate this distance.");
    }
  }

  function exportCsv() {
    const csv = measurementsToCsv(
      { settings, items: measurements },
      measurements.map((item) => measurementResult(item, settings)),
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "measurements.csv" }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  return (
    <main>
      <h1>Engineering Tools</h1>
      <p>Use the viewer toolbar to explode, section, isolate and measure the assembly.</p>
      <div className="viewer">
        <ModelViewer
          modelUrl={MODEL_URL}
          licenseKey={licenseKey}
          objectBindings={objectBindings}
          sceneConfig={sceneConfig}
          onSceneConfigChange={setSceneConfig}
          isolation={isolation}
          onIsolationChange={handleIsolationChange}
          measurements={measurements}
          onMeasurementsChange={setMeasurements}
          measurementSettings={settings}
          onMeasurementSettingsChange={setSettings}
          showExplodeControls
          showSectionTools
          showIsolateControls
          showObjectNavigator
          showMeasureTools
        />
      </div>
      <form className="controls" onSubmit={(event) => { event.preventDefault(); calibrate(); }}>
        <label>Last measured distance (m){" "}
          <input type="number" min="0" step="any" value={knownLength} onChange={(event) => setKnownLength(event.target.value)} required />
        </label>
        <button disabled={!distance}>Calibrate</button>
        <button type="button" disabled={!measurements.length} onClick={exportCsv}>Download CSV</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <p className="credit"><a href="https://skfb.ly/ouxVu">Cartoon Car</a> by wallon · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
    </main>
  );
}
