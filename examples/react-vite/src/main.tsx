import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { WelkAccordion, WelkButton, WelkCheckBox } from "@welkui/react";
import "@welkui/react/styles.css";

function App() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "1rem" }}>
      <h1>welkUI + React</h1>
      <WelkButton onClick={() => setCount((value) => value + 1)}>
        Clicked {count} times
      </WelkButton>
      <p>
        <WelkCheckBox label="Keep it playful" />
      </p>
      <WelkAccordion title="Built for your application">
        Import components and the package stylesheet to get started.
      </WelkAccordion>
    </main>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
