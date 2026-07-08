import type { DocsThemeConfig } from "nextra-theme-docs";

const DOCS_REPO_URL =
  "https://github.com/liveroom-technologies/react-immersive-docs";
const DOCS_ISSUES_URL = `${DOCS_REPO_URL}/issues`;

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
  docsRepositoryBase: `${DOCS_REPO_URL}/blob/main`,
  footer: {
    text: <span>{new Date().getFullYear()} © Liveroom. </span>,
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
