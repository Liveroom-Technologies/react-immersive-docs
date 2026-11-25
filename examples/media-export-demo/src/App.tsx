import { useEffect, useRef, useState } from "react";
import {
  ModelViewer,
  useViewerCamera,
  type CaptureVideoOptions,
  type ViewerReadyState,
} from "@liveroom-tech/react-immersive";

const MODEL_URL = "/bike.glb";
const center: [number, number, number] = [0, 95, -10];
const home: [number, number, number] = [430, 200, -420];
const cinematic = {
  autoPlay: false,
  loop: true,
  waypoints: [
    { position: home, target: center },
    { position: [520, 70, -10] as [number, number, number], target: center },
    { position: [300, 170, 480] as [number, number, number], target: center },
    { position: [-480, 110, 60] as [number, number, number], target: center },
  ],
};

type Format = "webm" | "mp4" | "gif";
const formats: Format[] = ["webm", "mp4", "gif"];
const videoTypes = {
  webm: ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"],
  mp4: ["video/mp4;codecs=avc1.42E01E", "video/mp4"],
};

function supportsFormat(format: Format) {
  if (typeof HTMLCanvasElement.prototype.captureStream !== "function") return false;
  if (format === "gif") return true;
  return typeof MediaRecorder !== "undefined" && videoTypes[format].some((type) => MediaRecorder.isTypeSupported(type));
}

export default function App({ licenseKey }: { licenseKey: string }) {
  const [viewer, setViewer] = useState<ViewerReadyState | null>(null);
  const { handleViewerReady } = useViewerCamera({ initialTarget: center });
  const [supported] = useState(() => formats.filter(supportsFormat));
  const [format, setFormat] = useState(supported[0]);
  const [mode, setMode] = useState<NonNullable<CaptureVideoOptions["mode"]>>("turntable");
  const [duration, setDuration] = useState(4);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{ url: string; format: Format } | null>(null);
  const recordingController = useRef<AbortController | null>(null);

  useEffect(() => () => recordingController.current?.abort(), []);
  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  async function record() {
    if (!viewer || !format || recordingController.current) return;
    const controller = new AbortController();
    recordingController.current = controller;
    setRecording(true);
    setStatus("Recording the viewer…");
    try {
      const blob = await viewer.captureVideo({ mode, format, duration, signal: controller.signal });
      if (controller.signal.aborted) return;
      setResult({ url: URL.createObjectURL(blob), format });
      setStatus("Recording ready.");
    } catch (error) {
      setStatus(controller.signal.aborted ? "Recording cancelled." : error instanceof Error ? error.message : "Recording failed.");
    } finally {
      recordingController.current = null;
      setRecording(false);
    }
  }

  return (
    <main>
      <h1>Media Export</h1>
      <p>Record the 3D canvas as a turntable or a cinematic camera path.</p>
      <div className="viewer">
        <ModelViewer modelUrl={MODEL_URL} licenseKey={licenseKey} objectBindings="auto"
          cinematic={cinematic} camera={{ position: home, fov: 40 }}
          onViewerReady={(ready) => { handleViewerReady(ready); setViewer(ready); }} />
      </div>
      <div className="controls">
        <label>Camera{" "}
          <select value={mode} disabled={recording} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="turntable">Turntable</option><option value="cinematic">Cinematic</option>
          </select>
        </label>
        <label>Format{" "}
          <select value={format ?? ""} disabled={recording || !format} onChange={(event) => setFormat(event.target.value as Format)}>
            {formats.map((item) => <option key={item} disabled={!supported.includes(item)} value={item}>{item.toUpperCase()}</option>)}
          </select>
        </label>
        <label>Length{" "}
          <select value={duration} disabled={recording} onChange={(event) => setDuration(Number(event.target.value))}>
            <option value={4}>4 seconds</option><option value={8}>8 seconds</option>
          </select>
        </label>
        {recording
          ? <button onClick={() => recordingController.current?.abort()}>Cancel</button>
          : <button disabled={!viewer || !format} onClick={() => void record()}>Record</button>}
      </div>
      <p role="status">{status || (!format ? "This browser cannot record the viewer canvas." : "")}</p>
      {result && <section aria-label="Recording preview">
        {result.format === "gif"
          ? <img src={result.url} alt="Recorded motorbike camera path" style={{ maxWidth: "100%" }} />
          : <video src={result.url} controls playsInline aria-label="Recorded motorbike camera path" style={{ maxWidth: "100%" }} />}
        <p><a href={result.url} download={`motorbike.${result.format}`}>Download {result.format.toUpperCase()}</a></p>
      </section>}
      <p className="credit"><a href="https://skfb.ly/6TJ8F">Three Cylinder Naked Street Bike</a> by Jamie Hamel-Smith · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
    </main>
  );
}
