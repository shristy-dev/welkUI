# welkUI

A standalone React + TypeScript component library for React and Next.js.
The npm package is **`@welkui/react`**. The current GitHub repository remains
`welkdock/welkUI`; renaming it to `welkui-react` is optional and requires updating
the repository URL in [package.json](./package.json).

## Installation

Once the first release is published:

```bash
npm install @welkui/react
```

```tsx
import { WelkButton, WelkCheckBox, WelkAccordion } from "@welkui/react";
import "@welkui/react/styles.css";

export function Example() {
  return (
    <>
      <WelkButton>Make it happen</WelkButton>
      <WelkCheckBox label="Count me in" />
      <WelkAccordion title="Learn more">A little playful detail.</WelkAccordion>
    </>
  );
}
```

The ESM-only package supports React 18.2+ and React 19. React and React DOM are
peer dependencies and are never bundled. Components are independently exported
and tree-shakeable. Import the stylesheet once; component CSS Modules and theme
tokens are extracted into this single file. There is no global CSS reset.

### Next.js App Router

Import the stylesheet in your root layout. Components retain `"use client"`
boundaries in the published JavaScript, so they can be rendered from Server
Components. Put event handlers and application state inside your own Client
Component; do not pass event handlers from a Server Component.

See the [Next.js example](./examples/nextjs) and [React + Vite example](./examples/react-vite).

## Components

| Component       | API                                                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WelkButton`    | Native button props/ref; `variant="primary" \| "secondary"` and `size="sm" \| "md" \| "lg"`. Defaults to `type="button"` to avoid accidental submission.                                       |
| `WelkCheckBox`  | Native checkbox props/ref with a required `label`; supports `checked`/`onChange` or `defaultChecked`, form names, disabled state, and generated accessible IDs. `className` targets the input. |
| `WelkAccordion` | Native `details` props/ref with a required `title` rendered as the summary. Supports native keyboard disclosure, `open`, and `onToggle`. `className` targets the details element.              |

The accordion is a single native disclosure, not a managed multi-item accordion.
Use non-interactive content for its summary title. Its `open` and `onToggle`
follow native details/React semantics; there is no separate `defaultOpen` prop.

## Theme

Override the namespaced CSS variables after importing the stylesheet:

```css
:root {
  --welk-color-accent: #ffda57;
  --welk-color-paper: #fffdf5;
  --welk-color-ink: #242424;
  --welk-font-family: "Comic Sans MS", cursive, sans-serif;
}
```

Tokens, typography and reduced-motion-aware transitions live in
[src/theme](./src/theme). No web fonts are downloaded or bundled by default.
The original [assets](./assets) remain untouched; only include assets with
verified redistribution rights in the published package.

## Development

Use Node.js 22.12+ (Node 24 recommended) and pnpm 10.20.0.
If pnpm is unavailable, use `npx pnpm@10.20.0` in place of `pnpm`.

```bash
pnpm install
pnpm check             # ESLint, TypeScript, component tests
pnpm build             # Vite library build + TypeScript declarations
pnpm verify:package    # npm contents, CSS, externals and client boundaries
pnpm storybook         # interactive component documentation on port 6006
pnpm build-storybook
pnpm build:examples    # build the library first
pnpm --filter @welkui/example-react-vite dev
pnpm --filter @welkui/example-nextjs dev
```

The examples consume the built package through workspace links, not source aliases.
Rebuild the library after changing its source. Generated output is not committed.
Shared interaction primitives and hooks have reserved entry points; extract them
when components actually need shared behavior.

## Layout

- [src/components](./src/components): colocated implementation, types, CSS, tests and stories
- [src/styles](./src/styles): package stylesheet entry
- [src/assets](./src/assets): reserved fonts, icons and illustrations
- [src/utils](./src/utils), [src/hooks](./src/hooks), [src/primitives](./src/primitives), [src/types](./src/types): shared foundations
- [.storybook](./.storybook): component documentation
- [examples](./examples): real React and Next.js consumers
- [scripts](./scripts): release preparation and package checks
- [.github/workflows](./.github/workflows): CI and publishing

## Publishing

The package is configured but has not been published by this scaffold.

1. Ensure you control the `@welkui` npm organization and can publish `@welkui/react`.
2. For the first release, run `pnpm check`, `pnpm build`, `pnpm verify:package`,
   `pnpm build:examples` and `pnpm build-storybook`, then authenticate to npm and run
   `npm publish --access public` locally.
3. Configure an npm **trusted publisher** for this GitHub repository, the
   `publish.yml` workflow, and the `npm` GitHub environment. Configure that environment
   with any desired reviewer/tag protections. CI uses OIDC, not a stored npm token.
4. For subsequent releases, start from a clean worktree and run
   `pnpm release 0.2.0`. Review the version/lockfile changes and update
   [CHANGELOG.md](./CHANGELOG.md), then commit and push a matching `v0.2.0` tag.

The publish workflow verifies the tag/version match, validates the library and
consumer builds, and publishes with provenance. `npm pack` and `npm publish`
also rebuild and verify the package through `prepack`.

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [LICENSE](./LICENSE).
