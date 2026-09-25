import React from "react";
import ReactDOM from "react-dom/client";
import "@liveroom-tech/react-immersive/binding-builder.css";

import App from "./App";
import "./demo.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
