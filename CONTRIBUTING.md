# Contributing

Use Node 24 and pnpm 10.20.0. Run `pnpm install` at the repository root.

## Component changes

Keep implementation, props, CSS Module, tests and stories together under
`src/components/ComponentName`. Re-export the component and props through its
local barrel and `src/components/index.ts`. Preserve native HTML semantics,
keyboard interaction, refs and native attributes whenever possible.

Interactive component implementations must start with `"use client"`.
The build restores this directive on explicitly marked modules while leaving
barrels and unmarked modules unchanged. React and React DOM must remain external peer dependencies.
Style components with CSS Modules and reuse the namespaced theme tokens; avoid
global resets. Only add assets when their redistribution license is confirmed.

## Validation

```bash
pnpm format
pnpm check
pnpm build
pnpm verify:package
pnpm build:examples
pnpm build-storybook
npm pack --dry-run --ignore-scripts
```

Check visual changes in Storybook and both examples. Verify keyboard focus,
disabled states, form behavior and reduced motion. Add regression tests for
behavior changes. Update usage documentation and the changelog for public API changes.

See the [publishing instructions](./README.md#publishing) before preparing a release.
