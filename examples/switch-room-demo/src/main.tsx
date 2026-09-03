import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@liveroom-tech/react-immersive/styles.css";
import App from "./App";
import "./demo.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
