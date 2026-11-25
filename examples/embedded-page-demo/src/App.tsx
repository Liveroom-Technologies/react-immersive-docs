import { useState } from "react";
import { ModelViewer, type ModelViewerProps } from "@liveroom-tech/react-immersive";

const models = {
  bike: { title: "Street Bike", author: "Jamie Hamel-Smith", credit: "https://skfb.ly/6TJ8F" },
  cartoon_car: { title: "Cartoon Car", author: "wallon", credit: "https://skfb.ly/ouxVu" },
  floor_lamp: { title: "Floor Lamp", author: "bilgehan.korkmaz", credit: "https://sketchfab.com/3d-models/floor-lamp-33eb258d9873435690254cfbb0ea46ec" },
};
type Model = keyof typeof models;

function ProductViewer({ model, ...props }: { model: Model } & Pick<ModelViewerProps, "licenseKey"> & Partial<ModelViewerProps>) {
  const { title, author, credit } = models[model];
  return (
    <article>
      <h2>{title}</h2>
      <div className="viewer">
        <ModelViewer
          modelUrl={`/${model}.glb`}
          poster={`/posters/${model}.jpg`}
          aria-label={`${title} 3D preview`}
          objectBindings="auto"
          preset="minimal"
          loading="lazy"
          showFullscreenButton
          {...props}
        />
      </div>
      <p className="credit"><a href={credit}>{title}</a> by {author} · <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a></p>
    </article>
  );
}

type Motion = NonNullable<ModelViewerProps["reducedMotion"]>;

export default function App({ licenseKey }: { licenseKey: string }) {
  const [motion, setMotion] = useState<Motion>("user");
  const [webgpu, setWebgpu] = useState(false);
  const [renderer, setRenderer] = useState("");

  return (
    <main className="catalogue">
      <h1>Embedded on a Page</h1>
      <p>The first model loads as you scroll to it. The other models show posters until you select View in 3D.</p>
      <div className="controls">
        <label>Reduced motion{" "}
          <select value={motion} onChange={(event) => setMotion(event.target.value as Motion)}>
            <option value="user">Follow device</option>
            <option value="always">Always reduce</option>
            <option value="never">Never reduce</option>
          </select>
        </label>
        <label><input type="checkbox" checked={webgpu} onChange={(event) => {
          setRenderer("");
          setWebgpu(event.target.checked);
        }} /> Prefer WebGPU</label>
        <span role="status">{renderer && `Renderer: ${renderer}`}</span>
      </div>
      <ProductViewer key={String(webgpu)} model="bike" licenseKey={licenseKey} autoRotate reducedMotion={motion}
        webgpu={webgpu} onViewerReady={(viewer) => setRenderer(viewer.rendererBackend ?? "")} />
      <section className="catalogue-range" aria-label="Product range">
        <ProductViewer model="cartoon_car" licenseKey={licenseKey} reveal="interaction" />
        <ProductViewer model="floor_lamp" licenseKey={licenseKey} reveal="interaction" />
      </section>
    </main>
  );
}
