import type { AnnotationMarker, ViewerCameraPreset } from "@liveroom-tech/react-immersive";

type Vec3 = [number, number, number];

/** One tour stop as your content store keeps it. */
export type TourStop = {
  id: number;
  title: string;
  description: string;
  /** Where the hotspot sits in the model, in scene units. */
  position: Vec3;
  /** Where the camera goes for this stop. */
  view: { position: Vec3; target: Vec3; fov?: number };
};
export type Tour = { version: 1; stops: TourStop[] };

/**
 * Loads the published tour. This starter serves it as a static file; in your
 * site, point this at your CMS or API so edits appear without a rebuild.
 */
export async function loadTour(): Promise<Tour> {
  const response = await fetch("/tour.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load the tour (${response.status}).`);
  return (await response.json()) as Tour;
}

/**
 * Publishes edits made in editor mode. This starter downloads the new
 * tour.json so you can see the exact data; replace the body with an
 * authenticated request to your own API, for example:
 *
 *   await fetch("/api/tour", { method: "PUT", body: JSON.stringify(tour),
 *     headers: { "Content-Type": "application/json" }, credentials: "include" });
 *
 * Validate the data on the server. Never put database credentials in the browser.
 */
export async function publishTour(tour: Tour): Promise<void> {
  const blob = new Blob([`${JSON.stringify(tour, null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tour.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

/** Hotspots for the viewer. A marker's cameraView is where clicking it flies to. */
export function toAnnotations(tour: Tour): AnnotationMarker[] {
  return tour.stops.map((stop) => ({
    id: stop.id,
    title: stop.title,
    description: stop.description,
    worldPosition: stop.position,
    localPosition: stop.position,
    cameraView: stop.view,
  }));
}

/** Named camera views, so navigation buttons can call camera.goToPreset(id). */
export function toPresets(tour: Tour): Record<string, ViewerCameraPreset> {
  return Object.fromEntries(tour.stops.map((stop) => [String(stop.id), stop.view]));
}
