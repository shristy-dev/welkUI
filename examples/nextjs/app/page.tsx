import { WelkAccordion } from "@welkui/react";
import { InteractiveDemo } from "./interactive-demo";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "1rem" }}>
      <h1>welkUI + Next.js</h1>
      <InteractiveDemo />
      <WelkAccordion title="Rendered from a Server Component">
        The library preserves client boundaries so this page needs no use client
        directive.
      </WelkAccordion>
    </main>
  );
}
