import { useMemo, useState } from "react";
import { ModelViewer, type ViewerEngagementEvent } from "@liveroom-tech/react-immersive";
import { objectBindings as carBindings } from "./carBindings";
import { objectBindings as galleryBindings } from "./galleryBindings";
import { sceneConfig as galleryConfig } from "./galleryConfig";
import { carPartKey, COPY } from "./copy";
import { LANGUAGES, VIEWER_LABELS, type LanguageCode } from "./labels";

type Scene = "car" | "gallery";
const eventLimit = 30;
const credits = {
  car: { link: "https://skfb.ly/ouxVu", title: "Cartoon Car", author: "wallon" },
  gallery: { link: "https://skfb.ly/oRXGx", title: "Art Gallery", author: "ALLrounder18" },
};

export default function App({ licenseKey }: { licenseKey: string }) {
  const [scene, setScene] = useState<Scene>("car");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [debug, setDebug] = useState(false);
  const [events, setEvents] = useState<ViewerEngagementEvent[]>([]);
  const [message, setMessage] = useState("");
  const copy = COPY[language];
  const credit = credits[scene];

  const translatedCar = useMemo(() => Object.fromEntries(
    Object.entries(carBindings).map(([key, binding]) => [
      key, { ...binding, label: copy.parts[carPartKey(binding.modelObjectId)] },
    ]),
  ), [copy]);
  const translatedTour = useMemo(() => ({
    ...galleryConfig,
    annotations: galleryConfig.annotations.map((stop) => ({ ...stop, ...copy.tour[stop.id] })),
  }), [copy]);

  async function copyEvents() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(events, null, 2));
      setMessage(`JSON ✓ (${events.length})`);
    } catch {
      setMessage(copy.copyFailed);
    }
  }

  return (
    <main lang={language}>
      <h1>Analytics &amp; Localisation</h1>
      <p>{copy.intro}</p>
      <div className="controls">
        <label>{copy.step1}{" "}
          <select value={scene} onChange={(event) => {
            setScene(event.target.value as Scene);
            setEvents([]);
            setMessage("");
          }}>
            <option value="car">{copy.scenes.car}</option>
            <option value="gallery">{copy.scenes.gallery}</option>
          </select>
        </label>
        <label>{copy.step4}{" "}
          <select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)}>
            {LANGUAGES.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
          </select>
        </label>
      </div>
      <div className="viewer">
        <ModelViewer
          key={scene}
          modelUrl={scene === "car" ? "/cartoon_car.glb" : "/art_gallery.glb"}
          licenseKey={licenseKey}
          objectBindings={scene === "car" ? translatedCar : galleryBindings}
          sceneConfig={scene === "gallery" ? translatedTour : undefined}
          labels={VIEWER_LABELS[language]}
          enableXR={scene === "car"}
          showAnnotationNavigation={scene === "gallery"}
          showSceneObjectsPanel={scene === "car"}
          onEngagement={(event) => setEvents((items) => [event, ...items].slice(0, eventLimit))}
          debugEngagement={debug}
        />
      </div>
      <div className="controls">
        <label><input type="checkbox" checked={debug} onChange={(event) => setDebug(event.target.checked)} /> {copy.console}</label>
        <button disabled={!events.length} onClick={() => { setEvents([]); setMessage(""); }}>{copy.clear}</button>
        <button disabled={!events.length} onClick={() => void copyEvents()}>Copy JSON</button>
        <span role="status">{message}</span>
      </div>
      {events.length ? (
        <ul aria-label="Engagement events">
          {events.map((event, index) => (
            <li key={`${event.timestamp}-${index}`}>
              <code>{event.type}</code> · {(event.elapsedMs / 1000).toFixed(1)}s · {event.sessionId}
              {event.type === "part-viewed" && ` · ${event.label ?? event.objectId}`}
            </li>
          ))}
        </ul>
      ) : <p>{copy.empty}</p>}
      <p className="credit"><a href={credit.link}>{credit.title}</a> by {credit.author} · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
    </main>
  );
}
