import { useState } from "react";
import type { ViewerCameraState } from "@liveroom-tech/react-immersive";
import type { Tour, TourStop } from "./tour";

type Props = {
  tour: Tour;
  onChange: (tour: Tour) => void;
  /** The camera right now, from useViewerCamera().cameraState. */
  currentView: ViewerCameraState | null;
  onPreview: (stopId: number) => void;
  onPublish: () => Promise<void>;
};

const round = (value: number) => Math.round(value * 100) / 100;

/** Editor mode: edit each stop's text and camera view, then publish the tour. */
export function TourEditor({ tour, onChange, currentView, onPreview, onPublish }: Props) {
  // Which stop the form edits. Kept apart from the open hotspot card, which
  // closes whenever the camera moves.
  const [editingId, setEditingId] = useState(tour.stops[0]?.id ?? 0);
  const [status, setStatus] = useState("");
  const stop = tour.stops.find((entry) => entry.id === editingId);

  function update(patch: Partial<TourStop>) {
    onChange({
      ...tour,
      stops: tour.stops.map((entry) => (entry.id === editingId ? { ...entry, ...patch } : entry)),
    });
    setStatus("Unpublished changes");
  }

  function captureView() {
    if (!currentView) return;
    update({
      view: {
        position: currentView.position.map(round) as TourStop["view"]["position"],
        target: currentView.target.map(round) as TourStop["view"]["target"],
        ...(currentView.fov ? { fov: round(currentView.fov) } : {}),
      },
    });
    setStatus("View captured. Preview it, then publish.");
  }

  async function publish() {
    try {
      await onPublish();
      setStatus("Published");
    } catch (error) {
      setStatus(`Publishing failed: ${(error as Error).message}`);
    }
  }

  if (!stop) return null;
  return (
    <aside className="editor" aria-label="Edit the tour">
      <h2>Edit the tour</h2>
      <div className="editor-tabs" role="group" aria-label="Stop to edit">
        {tour.stops.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={entry.id === editingId}
            onClick={() => setEditingId(entry.id)}
          >
            {entry.title || "Untitled"}
          </button>
        ))}
      </div>
      <label htmlFor="stop-title">Title</label>
      <input id="stop-title" value={stop.title} onChange={(event) => update({ title: event.target.value })} />
      <label htmlFor="stop-description">Description</label>
      <textarea
        id="stop-description"
        rows={4}
        value={stop.description}
        onChange={(event) => update({ description: event.target.value })}
      />
      <p className="help">
        Orbit, pan and zoom the viewer to frame this stop, then capture the view.
      </p>
      <div className="editor-actions">
        <button type="button" onClick={captureView} disabled={!currentView}>
          Use current view
        </button>
        <button type="button" onClick={() => onPreview(stop.id)}>
          Preview stop
        </button>
        <button type="button" className="primary" onClick={publish}>
          Publish tour
        </button>
      </div>
      <p className="help" role="status">{status}</p>
    </aside>
  );
}
