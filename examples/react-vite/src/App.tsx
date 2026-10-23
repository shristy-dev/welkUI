import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  WelkAccordion,
  WelkAvatar,
  WelkBadge,
  WelkBreadCrumbs,
  WelkButton,
  WelkCard,
  WelkDivider,
  WelkIconButton,
  WelkMenu,
  WelkStickerCard,
  WelkSwitch,
} from "@welkui/react";
import { catalogue, ComponentDemo } from "./catalogue";
import { getComponentDocs } from "./componentDocs";
import { componentGuides } from "./componentGuides";
import { VariantGallery } from "./VariantGallery";
import reactLogo from "../../../assets/images/react.svg.webp";
import githubLogo from "../../../assets/images/github.svg";
import welkuiLogo from "../../../assets/images/welkui-logo.png";

const repository = "https://github.com/welkdock/welkUI";
const subscribe = (listener: () => void) => {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
};
const snapshot = () => window.location.hash || "#/";
const serverSnapshot = () => "#/";
const pages = [
  { title: "Home", route: "#/" },
  { title: "Components", route: "#/components" },
  { title: "FAQ", route: "#/faq" },
  { title: "Contributors", route: "#/contributors" },
];
const sorted = [...catalogue].sort((a, b) => a.name.localeCompare(b.name));
const faqs = [
  [
    "What is WelkUI?",
    "A playful React + TypeScript component library with comic-inspired shapes, colors, and motion.",
  ],
  [
    "Does it work with Next.js?",
    'Yes. Interactive components preserve "use client" boundaries. Import the stylesheet once in your application layout.',
  ],
  [
    "Can I use it before npm publishing?",
    "Yes. Run pnpm build, then pnpm pack in the library repository. Install the resulting .tgz in your app.",
  ],
  [
    "How do I style it?",
    "Import @welkui/react/styles.css once. Override --welk-* CSS tokens for colors and typography; use component className/style props where supported.",
  ],
  [
    "Is it keyboard accessible?",
    "Components use native controls where possible, labeled interactions, focus indicators, and reduced-motion support. Test accessibility in your own app too.",
  ],
  [
    "Does file attachment upload my files?",
    "No. Files and previews stay local. Use onFilesChange to send selected files through your own upload flow.",
  ],
  [
    "Where can I test more variants?",
    "Use the Components page for focused examples, or run pnpm storybook in the repository for the full set of stories.",
  ],
];

function Code({ children }: { children: string }) {
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "error"
  >("idle");

  async function copy() {
    if (!navigator.clipboard?.writeText) {
      setCopyState("error");
      return;
    }
    setCopyState("copying");
    try {
      await navigator.clipboard.writeText(children);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="codeBlock">
      <div className="codeToolbar">
        <span>React / TSX</span>
        <WelkIconButton
          label={copyState === "copied" ? "Copy code again" : "Copy code"}
          disabled={copyState === "copying"}
          onClick={copy}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {copyState === "copied" ? (
                <path d="m5 12 4 4L19 6" />
              ) : (
                <>
                  <rect x="8" y="8" width="12" height="13" rx="2" />
                  <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                </>
              )}
            </svg>
          }
        />
      </div>
      <pre className="code">
        <code>{children}</code>
      </pre>
      <p
        className="copyFeedback finePrint"
        role={copyState === "error" ? "alert" : "status"}
      >
        {copyState === "error"
          ? "Could not copy code. Allow clipboard access or select and copy the code manually."
          : copyState === "copied"
            ? "Code copied!"
            : ""}
      </p>
    </div>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <WelkBadge>UI WITH A PLOT TWIST</WelkBadge>
          <h1>
            Serious building.
            <br />
            <span>Playful interfaces.</span>
          </h1>
          <p className="lede">
            Meet WelkUI. An open-source React UI library for comical minds.
            Comic-inspired components for interfaces with a little more
            character.
          </p>
          <div className="row">
            <WelkButton
              onClick={() => {
                window.location.hash = "#/components";
              }}
            >
              Explore components
            </WelkButton>
            {/* <WelkBadge variant="warning">
              <span className="reactBrand">
                <img src={reactLogo} alt="React logo" width={28} height={25} />
                React + TypeScript
              </span>
            </WelkBadge> */}
            <a className="githubLink" href={repository}>
              <img src={githubLogo} alt="" width={24} height={24} />
              Open source on GitHub
            </a>
          </div>
        </div>
        <div className="heroArt">
          <WelkStickerCard
            title="Hello, hero."
            subtitle="Your next great interface starts here."
            sticker={{ src: reactLogo, alt: "" }}
            onClick={() => {
              window.location.hash = "#/components/WelkStickerCard";
            }}
          />
          <div className="row">
            <WelkBadge variant="success">
              {catalogue.length} components
            </WelkBadge>
            <WelkBadge>100% personality</WelkBadge>
          </div>
        </div>
      </section>
      <WelkDivider thickness={3} />
      <section className="section" aria-labelledby="features-title">
        <p className="eyebrow">SMALL DETAILS. BIG PERSONALITY.</p>
        <h2 id="features-title">Your interface, outside the box.</h2>
        <div className="featureGrid">
          <WelkCard
            title="Hand-drawn energy"
            subtitle="Uneven corners, bold outlines, cheerful colors. No bland defaults."
            onClick={() => {
              window.location.hash = "#/components/WelkBadge";
            }}
          />
          <WelkCard
            title="Built for React"
            icon={
              <img
                src={reactLogo}
                alt=""
                className="reactFeatureLogo"
                width={48}
                height={43}
              />
            }
            subtitle="Typed props, independent exports, and Next.js client boundaries."
            onClick={() => {
              window.location.hash = "#/faq";
            }}
          />
          <WelkCard
            title="Thoughtful interactions"
            subtitle="Native controls, keyboard focus, and respect for reduced motion."
            onClick={() => {
              window.location.hash = "#/components/WelkSwitch";
            }}
          />
        </div>
      </section>
      <section className="section" aria-labelledby="preview-title">
        <p className="eyebrow">TRY A LITTLE COMIC MAGIC</p>
        <h2 id="preview-title">Real components. Ready to play.</h2>
        <div className="previewGrid">
          <article className="surface">
            <WelkBadge>01 / ACTION</WelkBadge>
            <h3>A button worth pressing</h3>
            <ComponentDemo name="WelkButton" />
          </article>
          <article className="surface">
            <WelkBadge variant="info">02 / CONTROL</WelkBadge>
            <h3>Switch things up</h3>
            <WelkSwitch label="Hero mode" />
          </article>
          <article className="surface">
            <WelkBadge variant="success">03 / DISCOVER</WelkBadge>
            <h3>A little more to the story</h3>
            <WelkAccordion title="Open a new chapter">
              Built with WelkUI, not another UI kit.
            </WelkAccordion>
          </article>
        </div>
      </section>
      <section className="cta">
        <WelkBadge>THE STORY CONTINUES</WelkBadge>
        <h2>Find your next favorite component.</h2>
        <p>
          One component at a time. Live variants, detailed guides, and
          copy-ready examples.
        </p>
        <WelkButton
          size="lg"
          onClick={() => {
            window.location.hash = "#/components";
          }}
        >
          Show more / test components
        </WelkButton>
      </section>
    </>
  );
}

function Components({ name }: { name?: string }) {
  const entry = name ? sorted.find((item) => item.name === name) : sorted[0];
  const docs = entry ? getComponentDocs(entry.name) : undefined;
  return (
    <>
      <h1>Component field guide</h1>
      <p>
        Explore live variants, compare states, and learn every prop. Pick a
        component to start.
      </p>
      <div className="explorer">
        <aside className="componentNav">
          <WelkMenu
            aria-label="Component list"
            collapsible
            activeRoute={`#/components/${entry?.name ?? ""}`}
            items={sorted.map((item) => ({
              title: item.name,
              route: `#/components/${item.name}`,
            }))}
          />
        </aside>
        <section className="componentDetail" aria-labelledby="component-title">
          {entry && docs ? (
            <>
              <WelkBadge variant="info">LIVE COMPONENT</WelkBadge>
              <h2 id="component-title">{entry.name}</h2>
              <p>{docs.description}</p>
              <div
                className="surface demoSurface"
                aria-label={`${entry.name} preview`}
              >
                <ComponentDemo key={entry.name} name={entry.name} />
              </div>
              <h3>Usage</h3>
              <Code
                key={entry.name}
              >{`${entry.code.includes("useState") ? 'import { useState } from "react";\n' : ""}import { ${[...new Set(entry.code.match(/Welk[A-Za-z]+/g) ?? [entry.name])].join(", ")} } from "@welkui/react";\n${entry.code.includes("{superman}") || entry.code.includes("src: superman") ? 'import superman from "./superman.png";\n' : ""}${entry.code.includes("{comic}") ? 'import comic from "./comic.jpg";\n' : ""}\n${entry.code}`}</Code>
              <p className="finePrint">
                Import <code>@welkui/react/styles.css</code> once in your app.
                Stateful snippets belong inside a React component.
              </p>
              <h3>Variants and behavior</h3>
              <ul className="variantList">
                {docs.variants.map((variant) => (
                  <li key={variant}>{variant}</li>
                ))}
              </ul>
              <h3>Visual variant gallery</h3>
              <VariantGallery
                key={`variants-${entry.name}`}
                name={entry.name}
              />
              <h3>Usage notes and accessibility</h3>
              <ul className="variantList">
                {componentGuides[entry.name].map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
              <h3>Props</h3>
              <p className="finePrint">
                Required props are marked in the default column. Other props are
                optional. ReactNode accepts text or JSX.
              </p>
              <div
                className="propsScroll"
                role="region"
                aria-label={`${entry.name} props`}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Allows keyboard scrolling of the overflowing prop table.
                tabIndex={0}
              >
                <table className="propsTable">
                  <caption>{entry.name} prop reference</caption>
                  <thead>
                    <tr>
                      <th scope="col">Prop</th>
                      <th scope="col">Type</th>
                      <th scope="col">Default</th>
                      <th scope="col">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.props.map(
                      ([prop, type, defaultValue, description]) => (
                        <tr key={prop}>
                          <th scope="row">
                            <code>{prop}</code>
                          </th>
                          <td>
                            <code>{type}</code>
                          </td>
                          <td>{defaultValue}</td>
                          <td>{description}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
              {docs.native ? (
                <>
                  <h3>Native props and refs</h3>
                  <p>{docs.native}</p>
                </>
              ) : (
                <p className="finePrint">
                  This component supports the props listed above, not arbitrary
                  native HTML attributes.
                </p>
              )}
              <WelkAccordion
                title="Project setup, styling and Next.js"
                className="setupGuide"
              >
                <p>
                  Import <code>@welkui/react/styles.css</code> once in your app
                  entry or Next.js root layout. The previews use the default
                  theme; override <code>--welk-*</code> CSS tokens in your app
                  to customize it.
                </p>
                <p>
                  For Next.js, put hooks and event handlers in a component
                  beginning with <code>&quot;use client&quot;</code>. Keep state
                  local to the component using the control. The library
                  preserves its client boundaries and uses your installed React
                  version.
                </p>
                <p>
                  Use <code>defaultValue</code> or <code>defaultChecked</code>{" "}
                  for uncontrolled fields, or a state value and its change
                  callback for controlled fields. Do not switch between these
                  modes during the lifetime of a field.
                </p>
                <p>
                  Modal and notification examples start closed: use their Try
                  buttons to see them. Disabled examples are deliberately
                  non-interactive. Validate forms, uploads, authentication, and
                  server responses in your application; these components only
                  provide UI.
                </p>
              </WelkAccordion>
            </>
          ) : (
            <>
              <h2 id="component-title">Component not found</h2>
              <p>Choose a component from the menu.</p>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function Contributors() {
  return (
    <section className="section">
      <WelkBadge variant="success">BUILT TOGETHER</WelkBadge>
      <h1>The people behind the panels.</h1>
      <p>Thank you to the contributors shaping WelkUI.</p>
      <article className="surface contributor">
        <WelkAvatar
          alt="No0b-master"
          src="https://avatars.githubusercontent.com/u/62955737?v=4"
          size="md"
        />
        <div>
          <h2>
            <a href="https://github.com/No0b-master">No0b-master</a>
          </h2>
          <p>4 repository contributions</p>
          <WelkBadge>Contributor</WelkBadge>
        </div>
      </article>
      <p className="finePrint">
        Verified from GitHub on October 23, 2026. This is a snapshot, not a live
        ranking.{" "}
        <a href={`${repository}/graphs/contributors`}>
          See the latest contributors
        </a>
        .
      </p>
      <WelkDivider />
      <h2>Want to join the story?</h2>
      <p>
        Report an issue, suggest a component, or send a pull request. Small
        improvements count.
      </p>
      <p>
        <a href={`${repository}/blob/main/CONTRIBUTING.md`}>
          Read the contribution guide
        </a>{" "}
        / <a href={`${repository}/issues`}>Browse issues</a>
      </p>
    </section>
  );
}

export function App() {
  const hash = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [, page = "", name] = hash.replace(/^#/, "").split("/");
  const current = page || "home";
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const [routeNotice, setRouteNotice] = useState("");

  useEffect(() => {
    document.title = `${pages.find((item) => item.route === `#/${page}`)?.title ?? (page ? "Not found" : "Home")} | WelkUI`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [hash, page]);

  return (
    <div className="site">
      <header className="siteHeader">
        <a className="brand" href="#/" aria-label="WelkUI home">
          <img className="brandLogo" src={welkuiLogo} alt="" />
          Welk<span>UI</span>
          <span className="brandDot">!</span>
        </a>
        <nav className="row" aria-label="Site navigation">
          {pages.map((item) => (
            <WelkButton
              key={item.route}
              variant={
                hash === item.route ||
                (item.route !== "#/" && hash.startsWith(`${item.route}/`))
                  ? "primary"
                  : "ghost"
              }
              aria-current={
                current ===
                (item.title === "Home" ? "home" : item.title.toLowerCase())
                  ? "page"
                  : undefined
              }
              onClick={() => {
                window.location.hash = item.route;
              }}
            >
              {item.title}
            </WelkButton>
          ))}
        </nav>
        <WelkBadge size="sm">REACT EDITION</WelkBadge>
      </header>
      <WelkDivider thickness={3} />
      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="main"
        key={`${page}/${name ?? ""}`}
      >
        {current !== "home" && (
          <WelkBreadCrumbs
            items={[
              { label: "Home", href: "#/" },
              {
                label:
                  pages.find((item) => item.route === `#/${page}`)?.title ??
                  "Not found",
              },
            ]}
          />
        )}
        {current === "home" ? (
          <Home />
        ) : current === "components" ? (
          <Components name={name} />
        ) : current === "faq" ? (
          <section className="section faq">
            <WelkBadge>GOOD QUESTIONS</WelkBadge>
            <h1>A little less mystery.</h1>
            <p>Short answers. More time to build.</p>
            <div className="stack">
              {faqs.map(([title, answer]) => (
                <WelkAccordion key={title} title={title}>
                  {answer}
                </WelkAccordion>
              ))}
            </div>
          </section>
        ) : current === "contributors" ? (
          <Contributors />
        ) : (
          <section className="section">
            <h1>This panel is missing.</h1>
            <p>Head back to the beginning.</p>
            <WelkButton
              onClick={() => {
                window.location.hash = "#/";
              }}
            >
              Go home
            </WelkButton>
          </section>
        )}
      </main>
      <footer className="footer">
        <WelkDivider thickness={3} />
        <div className="footerRow">
          <p>
            <strong>WelkUI</strong> / A little comic relief for the web.
          </p>
          <a className="githubLink" href={repository}>
            <img src={githubLogo} alt="" width={24} height={24} />
            View source on GitHub
          </a>
        </div>
        <p className="finePrint">
          A Product of{" "}
          <a href="https://www.welkdock.com">WelkDock Technologies</a>
        </p>
        <WelkButton
          variant="ghost"
          size="sm"
          onClick={() => {
            setRouteNotice("Back to the top.");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          Back to top
        </WelkButton>
        <span role="status" className="finePrint">
          {routeNotice}
        </span>
      </footer>
    </div>
  );
}
