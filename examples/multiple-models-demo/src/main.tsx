import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@liveroom-tech/react-immersive/styles.css";
import App from "./App";
import "./demo.css";

const licenseKey = import.meta.env.VITE_LICENSE_KEY?.trim();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {licenseKey ? (
      <App licenseKey={licenseKey} />
    ) : (
      <main className="setup">
        <h1>Multiple Models</h1>
        <p>Set <code>VITE_LICENSE_KEY</code> and restart the dev server to open the viewer.</p>
        <p><a href="https://react-immersive.liveroom.dev/console">Create a React Immersive key</a></p>
      </main>
    )}
  </StrictMode>,
);
