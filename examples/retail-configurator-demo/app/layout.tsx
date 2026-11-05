import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@liveroom-tech/react-immersive/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harbour sofa configurator",
  description: "A React Immersive retail configurator starter.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
