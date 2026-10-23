import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { getSeo, getSeoTags, seoRoutes } from "./seo";
import { siteUrl } from "./siteContent";

export { getSeo, getSeoTags, seoRoutes, siteUrl };

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
