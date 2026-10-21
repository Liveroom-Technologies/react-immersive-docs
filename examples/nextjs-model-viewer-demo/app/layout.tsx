import type { ReactNode } from "react";
import "@liveroom-tech/react-immersive/simple-model-viewer.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
