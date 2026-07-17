import { useEffect, useRef, useState, type ReactNode } from "react";

interface DemoPageHeaderProps {
  title: string;
  description: string;
  features: string[];
}

/** Compact example context, without the product-branding row. */
export function DemoPageHeader({
  title,
  description,
  features,
}: DemoPageHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || expanded) return;

    const measure = () =>
      setTruncated(element.scrollHeight > element.clientHeight + 1);

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [description, expanded]);

  return (
    <header className="demo-page-header">
      <div className="demo-page-header__content">
        <h1>{title}</h1>
        <div>
          <p
            ref={descriptionRef}
            className={expanded ? "demo-description is-expanded" : "demo-description"}
          >
            {description}
          </p>
          {(truncated || expanded) && (
            <button
              type="button"
              className="demo-description__toggle"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Read less" : "Read more…"}
            </button>
          )}
        </div>
        <ul className="demo-page-header__features">
          {features.map((feature) => (
            <li key={feature} className="demo-badge demo-badge--outline">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/** Shared viewer frame for the standalone Vite demos. */
export function ViewerWindow({ children }: { children: ReactNode }) {
  return (
    <div className="demo-viewer-window-shell">
      <div className="demo-viewer-window">{children}</div>
    </div>
  );
}
