import React from "react";
import type { DocsThemeConfig } from "nextra-theme-docs";

const DOCS_REPO_URL =
  "https://github.com/liveroom-technologies/react-immersive-docs";
const DOCS_ISSUES_URL = `${DOCS_REPO_URL}/issues`;
const DOCS_DISCUSSIONS_URL = `${DOCS_REPO_URL}/discussions`;
const PRIVATE_SUPPORT_URL =
  "mailto:developers@liveroom.xyz?subject=React%20Immersive%20Support";

const config: DocsThemeConfig = {
  logo: (
    <>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.75rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        <img
          src="/react-immersive.svg"
          alt=""
          width="24"
          height="24"
          style={{ display: "block" }}
        />
        <span>React Immersive</span>
      </span>
    </>
  ),
  project: {
    link: DOCS_REPO_URL,
  },
  feedback: {
    content: "Report an issue",
    labels: "feedback",
    useLink: () => DOCS_ISSUES_URL,
  },
  editLink: {
    text: "Edit this page on GitHub",
  },
  docsRepositoryBase: `${DOCS_REPO_URL}/blob/main/pages`,
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} © Liveroom.{" "}
        <a href={DOCS_ISSUES_URL} target="_blank" rel="noreferrer">
          Report an issue
        </a>{" "}
        ·{" "}
        <a href={DOCS_DISCUSSIONS_URL} target="_blank" rel="noreferrer">
          Discussions
        </a>{" "}
        · <a href={PRIVATE_SUPPORT_URL}>Private support</a>
      </span>
    ),
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – React Immersive Docs",
    };
  },
  head: (
    <>
      <meta
        name="description"
        content="Public docs, issues, and discussions for the closed-source React Immersive package."
      />
      <meta property="og:site_name" content="React Immersive Docs" />
      <meta
        property="og:description"
        content="Public docs, issues, and discussions for the closed-source React Immersive package."
      />
      <meta property="og:type" content="website" />
    </>
  ),
};

export default config;
