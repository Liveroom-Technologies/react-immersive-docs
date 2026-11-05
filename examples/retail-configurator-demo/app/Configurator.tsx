"use client";

import { useEffect, useRef, useState } from "react";
import {
  ModelViewer,
  useProductConfigurator,
  useViewerCamera,
  type ObjectBinding,
  type ProductSelections,
} from "@liveroom-tech/react-immersive";
import {
  decodeProductSelections,
  encodeProductSelections,
  formatProductPrice,
} from "@liveroom-tech/react-immersive/utils";
import { objectBindings, product } from "./product";

const LICENSE_KEY = process.env.NEXT_PUBLIC_LICENSE_KEY ?? "";

/** The share link keeps every choice in the URL hash, e.g. #seat:sage,back:oat,... */
function selectionsFromUrl(): ProductSelections {
  return decodeProductSelections(window.location.hash.slice(1), product);
}

export default function Configurator() {
  const [selections, setSelections] =
    useState<ProductSelections>(selectionsFromUrl);
  const [selectedPart, setSelectedPart] = useState<ObjectBinding | null>(null);
  const [copied, setCopied] = useState(false);
  const groups = useRef<Record<string, HTMLFieldSetElement | null>>({});

  const configurator = useProductConfigurator({
    product,
    objectBindings,
    selections,
    onSelectionsChange: setSelections,
  });
  // A three-quarter view of the sofa at seat height; resetView returns here.
  const camera = useViewerCamera({
    initialPosition: [2.4, 1.5, 3.6],
    initialTarget: [0, 0.45, 0],
  });

  // Keep the address bar shareable without adding a history entry per click.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.hash = encodeProductSelections(selections);
    window.history.replaceState(null, "", url);
    setCopied(false);
  }, [selections]);

  // A link pasted into this tab, or back/forward, restores those choices.
  useEffect(() => {
    const restore = () => setSelections(selectionsFromUrl());
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, []);

  // Clicking a part of the sofa moves focus to the choices for that part.
  function handlePartSelect(binding: ObjectBinding | null) {
    setSelectedPart(binding);
    const fieldset = binding?.group ? groups.current[binding.group] : null;
    if (!fieldset) return;
    fieldset.scrollIntoView({ block: "nearest", behavior: "smooth" });
    fieldset
      .querySelector<HTMLInputElement>("input:checked")
      ?.focus({ preventScroll: true });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const price = configurator.price;

  return (
    <main className="page">
      <section className="viewer" aria-label="Interactive 3D sofa">
        {!LICENSE_KEY && (
          <p className="notice" role="note">
            Set <code>NEXT_PUBLIC_LICENSE_KEY</code> in <code>.env.local</code>{" "}
            and restart. Create a free development key in the{" "}
            <a href="https://react-immersive.liveroom.dev/console">console</a>.
          </p>
        )}
        <ModelViewer
          modelUrl="/sofa.glb"
          licenseKey={LICENSE_KEY}
          {...configurator.viewerProps}
          preset="minimal"
          backgroundColor="#f3f0ea"
          selectedObject={selectedPart}
          onObjectSelect={handlePartSelect}
          // Keep the whole sofa in view when a shopper clicks a part.
          zoomOnSelected={false}
          onViewerReady={camera.handleViewerReady}
          onCameraChange={camera.handleCameraChange}
          cameraLimits={{ minDistance: 2.4, maxDistance: 8, maxPolarAngle: 88 }}
          xr={{ enabled: true, arHandoff: true, scaleMode: "real-world" }}
        />
      </section>

      <aside className="panel">
        <header>
          <p className="eyebrow">Made to order</p>
          <h1>{product.label}</h1>
          {price && (
            <p className="price">
              {formatProductPrice(price.amountMinor, price.currency)}
            </p>
          )}
          <p className="hint">
            {selectedPart
              ? `Selected: ${selectedPart.label}. Choose a finish below.`
              : "Click a cushion, the frame or a leg to jump to its choices."}
          </p>
        </header>

        {product.groups.map((group) => (
          <fieldset
            key={group.id}
            ref={(element) => {
              groups.current[group.id] = element;
            }}
            className={
              selectedPart?.group === group.id ? "group is-active" : "group"
            }
          >
            <legend>{group.label}</legend>
            <div className="swatches">
              {group.options.map((option) => {
                const state = configurator.optionStates.find(
                  (entry) =>
                    entry.groupId === group.id && entry.optionId === option.id,
                );
                const id = `${group.id}-${option.id}`;
                return (
                  <label key={option.id} htmlFor={id} className="swatch">
                    <input
                      id={id}
                      type="radio"
                      name={group.id}
                      checked={state?.selected ?? false}
                      disabled={state ? !state.available : false}
                      onChange={() =>
                        configurator.selectOption(group.id, option.id)
                      }
                    />
                    <span
                      className="chip"
                      style={{ background: option.swatch }}
                      aria-hidden="true"
                    />
                    <span className="name">{option.label}</span>
                    {option.priceDeltaMinor ? (
                      <span className="delta">
                        {formatProductPrice(
                          option.priceDeltaMinor,
                          product.pricing!.currency,
                          true,
                        )}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="actions">
          <button type="button" onClick={copyLink}>
            {copied ? "Link copied" : "Copy share link"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={configurator.reset}
          >
            Reset choices
          </button>
        </div>
        <p className="hint">
          <strong>AR handoff</strong> in the viewer opens this exact
          configuration on a phone, to place it in a room. The phone needs to
          reach the page over HTTPS; see the README.
        </p>
      </aside>
    </main>
  );
}
