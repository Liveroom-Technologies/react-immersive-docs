import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  AssetDiagnosticsPanel,
  ModelViewer,
  inspectAsset,
  useViewerCamera,
  type AssetDiagnosticsReport,
  type ModelFormat,
  type ViewerReadyState,
  type ViewerRuntimeStats,
} from "@liveroom-tech/react-immersive";

type Asset = { url: string; name: string; format: ModelFormat; bytes?: number };
const sample: Asset = {
  url: "/mounting-bracket.glb",
  name: "mounting-bracket.glb",
  format: "glb",
};
const formats: ModelFormat[] = ["glb", "gltf", "obj", "fbx", "usdz", "stl", "ply"];

export default function App({ licenseKey }: { licenseKey: string }) {
  const [localAsset, setLocalAsset] = useState<Asset | null>(null);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const asset = localAsset ?? sample;

  useEffect(() => () => { requestId.current += 1; }, []);
  useEffect(() => () => {
    if (localAsset) URL.revokeObjectURL(localAsset.url);
  }, [localAsset]);

  async function openFile(files: FileList) {
    if (!files.length) return;
    const request = ++requestId.current;
    setError("");
    try {
      if (files.length !== 1) throw new Error("Open one standalone model at a time.");
      const file = files[0];
      const format = formats.find((type) => file.name.toLowerCase().endsWith(`.${type}`));
      if (!format || !file.size) throw new Error("Choose a supported model file that contains geometry.");
      if (format === "gltf") {
        const data = JSON.parse(await file.text()) as { buffers?: { uri?: string }[]; images?: { uri?: string }[] };
        if ([...(data.buffers ?? []), ...(data.images ?? [])].some(({ uri }) => uri && !uri.startsWith("data:"))) {
          throw new Error("This glTF references other files. Export a self-contained GLB to inspect it.");
        }
      }
      if (request === requestId.current) {
        setLocalAsset({ name: file.name, format, url: URL.createObjectURL(file), bytes: file.size });
      }
    } catch (error) {
      if (request === requestId.current) setError(error instanceof Error ? error.message : "Could not open this model.");
    }
  }

  function onDrop(event: DragEvent<HTMLElement>) {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    void openFile(event.dataTransfer.files);
  }

  return (
    <main onDrop={onDrop} onDragOver={(event) => {
      if (event.dataTransfer.types.includes("Files")) event.preventDefault();
    }}>
      <h1>Asset QA</h1>
      <p>Drop a standalone model or choose a file. Local files stay in your browser.</p>
      <div className="controls">
        <label>Model file{" "}
          <input type="file" accept={formats.map((format) => `.${format}`).join(",")}
            onChange={(event) => {
              if (event.currentTarget.files) void openFile(event.currentTarget.files);
              event.currentTarget.value = "";
            }} />
        </label>
        <button onClick={() => {
          requestId.current += 1;
          setLocalAsset(null);
          setError("");
        }}>Load sample</button>
      </div>
      {error && <p role="alert">{error}</p>}
      <Inspection key={asset.url} asset={asset} licenseKey={licenseKey} />
    </main>
  );
}

function Inspection({ asset, licenseKey }: { asset: Asset; licenseKey: string }) {
  const [report, setReport] = useState<AssetDiagnosticsReport | null>(null);
  const [stats, setStats] = useState<ViewerRuntimeStats | null>(null);
  const viewer = useRef<ViewerReadyState | null>(null);
  const { handleViewerReady, focusObject } = useViewerCamera();

  function showReport(next: AssetDiagnosticsReport) {
    setReport({
      ...next,
      source: { ...next.source, name: asset.name, sourceBytes: next.source.sourceBytes ?? asset.bytes ?? null },
    });
  }

  function selectObject(name: string) {
    const bindings = viewer.current?.objectBindings ?? {};
    const entry = Object.entries(bindings).find(([key, binding]) => key === name || binding.modelObjectId === name);
    if (entry) void focusObject(entry[0]);
  }

  return (
    <>
      <h2>{asset.name}</h2>
      <div className="inspection">
        <div className="viewer">
          <ModelViewer modelUrl={asset.url} modelFormat={asset.format} licenseKey={licenseKey}
            objectBindings="auto" preset="minimal" onAssetDiagnostics={showReport}
            onRuntimeStats={setStats} runtimeStatsIntervalMs={1000}
            onViewerReady={(ready) => { viewer.current = ready; handleViewerReady(ready); }} />
        </div>
        <section aria-label="Diagnostics">
          <AssetDiagnosticsPanel report={report} runtimeStats={stats} onSelectObject={selectObject}
            onRefresh={() => {
              const scene = viewer.current?.raw.scene;
              if (scene && report) showReport(inspectAsset(scene, { source: report.source }));
            }} />
        </section>
      </div>
    </>
  );
}
