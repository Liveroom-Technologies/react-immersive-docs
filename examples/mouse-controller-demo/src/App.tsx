import { useState } from "react";
import { ModelViewer } from "@liveroom-tech/react-immersive";
import { DemoPageHeader, ViewerWindow } from "./DemoLayout";
import { objectBindings } from "./objectBindings";

type MouseControllerPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "center"
  | "center-bottom"
  | "center-top";

const positions: { label: string; value: MouseControllerPosition }[] = [
  { label: "Bottom left", value: "bottom-left" },
  { label: "Top left", value: "top-left" },
  { label: "Top right", value: "top-right" },
  { label: "Center top", value: "center-top" },
  { label: "Center", value: "center" },
  { label: "Center bottom", value: "center-bottom" },
  { label: "Bottom right", value: "bottom-right" },
];

export default function App() {
  const licenseKey = import.meta.env.VITE_LICENSE_KEY ?? "";
  const [moveSensitivity, setMoveSensitivity] = useState(0.1);
  const [opacity, setOpacity] = useState(0.9);
  const [position, setPosition] =
    useState<MouseControllerPosition>("center-bottom");

  return (
    <main className="demo-page">
      <DemoPageHeader
        title="Mouse Controller"
        description="Navigate a 3D scene with the viewer's on-screen controller. Tune movement sensitivity, opacity, and placement to fit a touchscreen, kiosk, or guided product experience."
        features={[
          "On-screen movement controls",
          "Move sensitivity",
          "Opacity control",
          "Position presets",
        ]}
      />
      {!licenseKey ? (
        <p className="demo-license-warning">
          Set <code>VITE_LICENSE_KEY</code> before running this example.
        </p>
      ) : null}
      <ViewerWindow>
        <div className="mouse-controller-demo">
          <ModelViewer
            modelUrl="/apartment.glb"
            licenseKey={licenseKey}
            objectBindings={objectBindings}
            backgroundColor="#080b12"
            shadows
            showObjectBindingDataPanel={false}
            showSceneObjectsPanel={false}
            showDownloadButton={false}
            showMouseController
            mouseControllerPosition={position}
            mouseControllerOpacity={opacity}
            moveSensitivity={moveSensitivity}
            showResetButton
            refitOnResize={false}
          />
          <section className="mouse-controller-settings" aria-label="Controller settings">
            <div className="mouse-controller-settings__heading">
              <span>Controller settings</span>
              <span className="mouse-controller-settings__status">Active</span>
            </div>
            <label>
              Movement sensitivity
              <div className="mouse-controller-settings__buttons">
                {[0.01, 0.05, 0.1, 0.5].map((value) => (
                  <button
                    className={moveSensitivity === value ? "is-active" : undefined}
                    key={value}
                    type="button"
                    onClick={() => setMoveSensitivity(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </label>
            <label>
              Controller opacity <output>{Math.round(opacity * 100)}%</output>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(event) => setOpacity(Number(event.target.value))}
              />
            </label>
            <fieldset>
              <legend>Position</legend>
              <div className="mouse-controller-settings__positions">
                {positions.map(({ label, value }) => (
                  <button
                    className={position === value ? "is-active" : undefined}
                    key={value}
                    type="button"
                    onClick={() => setPosition(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
        </div>
      </ViewerWindow>
    </main>
  );
}
