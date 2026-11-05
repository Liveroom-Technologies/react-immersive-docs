"use client";

import dynamic from "next/dynamic";

// The viewer needs the browser (WebGL, window), so it renders on the client only.
const Configurator = dynamic(() => import("./Configurator"), {
  ssr: false,
  loading: () => <p className="loading">Loading the configurator…</p>,
});

export default function ConfiguratorLoader() {
  return <Configurator />;
}
