import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@welkui/react/styles.css";
import "./showcase.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
