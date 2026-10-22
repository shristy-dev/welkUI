# Changelog

## 0.1.0 - Unreleased

- Add vertical (default), horizontal and nested accordion layouts with opt-in
  `closeOnOutsideClick` dismissal for mouse, touch and pen interactions.

- Add opt-in `growOnHover` avatar scaling with reduced-motion support.

- Add a customizable avatar background via the `color` prop and Storybook color control.

- Add WelkAvatar with four bundled user/admin portraits, custom images/icons,
  accessible names, three sizes and comic-themed framing.

- Add optional custom end-icon actions to WelkInput with accessible labels,
  keyboard activation and disabled support.

- Add WelkInput with comic-themed styling, accessible labels, native text input
  behavior, focus/disabled/read-only/invalid states, tests and Storybook examples.

- Add error, warning, ghost, info and success button variants with themed hover
  states. Keep primary as the default and retain secondary for compatibility.

- Apply the bundled Short Stack font globally through the package stylesheet,
  including its SIL Open Font License in the build.

- Scaffold the `@welkui/react` ESM package with Vite, TypeScript declarations,
  external React peers and preserved Next.js client boundaries.
- Add WelkButton, WelkCheckBox and WelkAccordion with CSS Modules, theme tokens,
  native accessible interactions, tests and stories.
- Add React/Vite and Next.js App Router consumers, CI, package verification and
  trusted npm publishing configuration.
