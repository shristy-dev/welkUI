import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const serverDir = join(dist, ".server");
const { render, getSeo, getSeoTags, seoRoutes, siteUrl } = await import(
  pathToFileURL(join(serverDir, "entry-server.js")).href
);
const template = await readFile(join(dist, "index.html"), "utf8");

const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

function head(seo) {
  return getSeoTags(seo)
    .map(({ tag, attributes, content }) => {
      const attrs = Object.entries(attributes)
        .map(([key, value]) => ` ${key}="${escape(value)}"`)
        .join("");
      if (tag === "script")
        return `<script${attrs} data-seo>${content.replaceAll("<", "\\u003c")}</script>`;
      return `<${tag}${attrs} data-seo />`;
    })
    .join("\n    ");
}

function page(path) {
  const seo = getSeo(path);
  return template
    .replace(/<title>.*?<\/title>/s, `<title>${escape(seo.title)}</title>`)
    .replace("<!--app-head-->", head(seo))
    .replace(
      '<div id="root"><!--app-html--></div>',
      `<div id="root" data-prerendered-path="${escape(path)}">${render(path)}</div>`,
    );
}

for (const path of seoRoutes) {
  const file = join(dist, path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(path));
}
await writeFile(join(dist, "404.html"), page("/404/"));

const lastmod = new Date().toISOString().slice(0, 10);
await writeFile(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seoRoutes
  .map(
    (path) =>
      `  <url><loc>${new URL(path, siteUrl).href}</loc><lastmod>${lastmod}</lastmod></url>`,
  )
  .join("\n")}
</urlset>
`,
);
await writeFile(
  join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
// GitHub Pages custom domain.
await writeFile(join(dist, "CNAME"), `${new URL(siteUrl).host}\n`);
await writeFile(join(dist, ".nojekyll"), "");
await rm(serverDir, { recursive: true, force: true });

console.log(
  `Pre-rendered ${seoRoutes.length} pages, 404.html, sitemap.xml, robots.txt and CNAME.`,
);
