import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { getPath, redirectLegacyHash } from "./router";
import "@welkui/react/styles.css";
import "./showcase.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
const redirected = redirectLegacyHash();
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Hydrate only when the pre-rendered HTML matches this URL (404.html serves many paths).
if (!redirected && root.dataset.prerenderedPath === getPath())
  hydrateRoot(root, app);
else {
  root.replaceChildren();
  createRoot(root).render(app);
}
