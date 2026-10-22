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
import {
  WelkButton,
  WelkCheckBox,
  WelkAccordion,
  WelkInput,
} from "@welkui/react";
import "@welkui/react/styles.css";

export function Example() {
  return (
    <>
      <WelkButton>Make it happen</WelkButton>
      <WelkCheckBox label="Count me in" />
      <WelkInput label="Hero name" placeholder="Your name..." />
      <WelkAccordion title="Learn more">A little playful detail.</WelkAccordion>
    </>
  );
}
```

The ESM-only package supports React 18.2+ and React 19. React and React DOM are
peer dependencies and are never bundled. Components are independently exported
and tree-shakeable. Import the stylesheet once; component CSS Modules and theme
tokens are extracted into this single file. Importing it applies Short Stack
globally, including headings, body text and form controls. There is no global CSS reset.

### Next.js App Router

Import the stylesheet in your root layout. Components retain `"use client"`
boundaries in the published JavaScript, so they can be rendered from Server
Components. Put event handlers and application state inside your own Client
Component; do not pass event handlers from a Server Component.

See the [Next.js example](./examples/nextjs) and [React + Vite example](./examples/react-vite).

## Components

### WelkAvatar

Comic-themed circular avatars support four bundled profile images, a custom image,
or a custom icon. `user` is the default and aliases `male-user`.

```tsx
import { WelkAvatar } from "@welkui/react";

<WelkAvatar variant="male-user" alt="Male user" />
<WelkAvatar variant="female-user" alt="Female user" />
<WelkAvatar variant="male-admin" alt="Male admin" />
<WelkAvatar variant="female-admin" alt="Female admin" />
<WelkAvatar src="/photos/hero.jpg" alt="Captain Welk" size="lg" />
<WelkAvatar icon={<StarIcon />} alt="Favorite profile" />
<WelkAvatar variant="female-user" alt="Profile" color="#82caff" />
```

The required `alt` provides the avatar's accessible name. `src` takes priority
over `icon`, which takes priority over the variant portrait. Sizes are `sm`
(32px), `md` (48px, default), and `lg` (64px). Native span attributes and refs are
forwarded; `className` targets the outer frame. Icons should be non-interactive.
The avatar itself is not a button. Custom image failures use normal browser
image behavior; no automatic fallback is applied.

Set `growOnHover={true}` to scale the avatar up by 10% on hover without moving
surrounding content. It defaults to `false` and respects reduced-motion preferences.

Use `color` to set the avatar background to any CSS color (including CSS
variables). It defaults to the theme's paper color when omitted. An explicit
`style.backgroundColor` overrides `color`. Opaque custom images may cover the background.

### WelkInput

Add an optional clickable custom icon inside the end of `WelkInput` with
`endAction`. Pass an icon (not a nested button/link), an accessible action label,
and a click handler:

```tsx
<WelkInput
  label="Search"
  endAction={{
    icon: <SearchIcon />,
    label: "Run search",
    onClick: () => runSearch(),
  }}
/>
```

The action is a keyboard-accessible `type="button"` and never implicitly submits
the form. It follows the input's `disabled` state, or can be independently
disabled with `endAction.disabled`. It stays usable on read-only inputs.

`WelkInput` is a comic-themed text field with a required `label`, native input
props/ref, and `type="text"` by default. It also supports `email`, `password`,
`search`, `tel`, and `url`. Use `value`/`onChange` for controlled inputs or
`defaultValue` for uncontrolled inputs. Native `required`, `disabled`, `readOnly`,
`name`, and autocomplete attributes are forwarded; `className` targets the input.
Connect helper/error text with `aria-describedby` and mark invalid fields with
`aria-invalid="true"`. Labels receive a generated ID association unless you supply `id`.

| Component       | API                                                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WelkButton`    | Native button props/ref; `variant="primary" \| "error" \| "warning" \| "ghost" \| "info" \| "success"` and `size="sm" \| "md" \| "lg"`. Defaults to `variant="primary"` and `type="button"`.   |
| `WelkCheckBox`  | Native checkbox props/ref with a required `label`; supports `checked`/`onChange` or `defaultChecked`, form names, disabled state, and generated accessible IDs. `className` targets the input. |
| `WelkAccordion` | Native `details` props/ref with a required `title` rendered as the summary. Supports native keyboard disclosure, `open`, and `onToggle`. `className` targets the details element.              |

The accordion is a single native disclosure, not a managed multi-item accordion.
Its `variant` can be `vertical` (default), `horizontal` (content beside the title),
or `nested` (a compact, inset-style disclosure for placement inside another accordion).
Compose nested accordions as children:

```tsx
<WelkAccordion title="Parent" closeOnOutsideClick>
  <WelkAccordion title="Child" variant="nested" closeOnOutsideClick>
    Child content
  </WelkAccordion>
</WelkAccordion>
```

`closeOnOutsideClick` defaults to `false`. When enabled, mouse/touch/pen presses
outside that accordion close it and trigger the native `onToggle` event.
Child interactions count as inside the parent; tapping elsewhere in the parent
can close a child without closing the parent. Each instance opts in independently.
If application state tracks `open`, synchronize it in `onToggle` using
`event.currentTarget.open`. Horizontal layout uses the native `::details-content`
pseudo-element in modern browsers.

Use non-interactive content for its summary title. Its `open` and `onToggle`
follow native details/React semantics; there is no separate `defaultOpen` prop.

Button variants: primary uses the theme accent, error is red, warning is yellow,
ghost has a transparent background with an outline, info is blue, and success is
green. The original paper-colored `secondary` variant remains supported for
backward compatibility. Semantic colors and their hover states can be customized
with `--welk-color-error`, `--welk-color-error-hover`, and the corresponding
`warning`, `info`, and `success` tokens.

## Theme

Override the namespaced CSS variables after importing the stylesheet:

```css
:root {
  --welk-color-accent: #ffda57;
  --welk-color-paper: #fffdf5;
  --welk-color-ink: #242424;
  --welk-font-family: "Short Stack", cursive, sans-serif;
}
```

Tokens, typography and reduced-motion-aware transitions live in
[src/theme](./src/theme). Short Stack is loaded from
[assets/font/short_stack](./assets/font/short_stack) and embedded in the built
stylesheet, so no external font service or separate font import is required.
Its SIL Open Font License is included in the package as `dist/fonts/ShortStack-OFL.txt`.
Override `--welk-font-family` to change the global font. The font contains only
a regular face; browsers synthesize bold text where requested.

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
