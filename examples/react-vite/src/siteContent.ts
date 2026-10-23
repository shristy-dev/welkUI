export const siteUrl = "https://ui.welkdock.com";
export const repository = "https://github.com/welkdock/welkUI";
export const organizationUrl = "https://www.welkdock.com";

export const faqs = [
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
] as const;
