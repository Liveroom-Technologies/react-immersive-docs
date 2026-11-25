import { DEFAULT_SCENE_CONFIG, ModelViewer, useViewerSequences } from "@liveroom-tech/react-immersive";
import { SEQUENCES } from "./sequences";

const MODEL_URL = "/bike.glb";
const sceneConfig = { ...DEFAULT_SCENE_CONFIG, sequences: SEQUENCES };

export default function App({ licenseKey }: { licenseKey: string }) {
  const { playback, handleSequencesReady, play, pause, seek, stop } = useViewerSequences();

  return (
    <main>
      <h1>Keyframe Sequences</h1>
      <p>Choose an authored sequence to animate the model and camera together.</p>
      <div className="viewer">
        <ModelViewer
          modelUrl={MODEL_URL}
          licenseKey={licenseKey}
          objectBindings="auto"
          sceneConfig={sceneConfig}
          onSequencesReady={handleSequencesReady}
          showSequenceControls={false}
          camera={{ position: [430, 200, -420], fov: 40 }}
        />
      </div>
      <div className="controls">
        {SEQUENCES.map(({ id, name }) => (
          <button key={id} disabled={!playback.ready} onClick={() => play(id)} aria-pressed={id === playback.sequenceId}>
            {name}
          </button>
        ))}
        {playback.status === "playing" ? (
          <button onClick={pause}>Pause</button>
        ) : (
          <button disabled={!playback.ready} onClick={() => play(playback.sequenceId ?? SEQUENCES[0].id)}>Play</button>
        )}
        <button disabled={!playback.sequenceId} onClick={stop}>Stop &amp; restore</button>
        <label>Timeline{" "}
          <input type="range" min={0} max={playback.duration || 1} step={0.01} value={playback.time}
            disabled={!playback.sequenceId} onChange={(event) => seek(Number(event.target.value))} />
        </label>
        <span>{playback.time.toFixed(1)} / {playback.duration.toFixed(1)} s</span>
      </div>
      {playback.issues.map((issue) => <p key={issue}>{issue}</p>)}
      <p className="credit"><a href="https://skfb.ly/6TJ8F">Three Cylinder Naked Street Bike</a> by Jamie Hamel-Smith · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
    </main>
  );
}
