import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  WelkAccordion,
  WelkButton,
  WelkCheckBox,
  WelkInput,
  WelkAvatar,
} from "@welkui/react";
import "@welkui/react/styles.css";
import human from "../../../assets/icons/person/human.png";

function App() {
  const [count, setCount] = useState(0);
  const [hero, setHero] = useState("");
  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "1rem" }}>
      <h1>welkUI + React</h1>
      <WelkButton onClick={() => setCount((value) => value + 1)}>
        Clicked {count} times
      </WelkButton>
      <h2>Button variants</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <WelkButton>Primary</WelkButton>
        <WelkButton variant="error">Error</WelkButton>
        <WelkButton variant="warning">Warning</WelkButton>
        <WelkButton variant="ghost">Ghost</WelkButton>
        <WelkButton variant="info">Info</WelkButton>
        <WelkButton variant="success">Success</WelkButton>
      </div>
      <h2>Avatars</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <WelkAvatar
          variant="male-user"
          alt="Male user"
          color="#82caff"
          growOnHover
        />
        <WelkAvatar variant="female-user" alt="Female user" />
        <WelkAvatar variant="male-admin" alt="Male admin" />
        <WelkAvatar variant="female-admin" alt="Female admin" />
        <WelkAvatar src={human} alt="Custom profile" />
      </div>
      <h2>Text fields</h2>
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <WelkInput
          label="Hero name"
          placeholder="A comic book hero..."
          name="hero"
          value={hero}
          onChange={(event) => setHero(event.target.value)}
          endAction={{
            icon: (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            ),
            label: "Clear hero name",
            onClick: () => setHero(""),
          }}
        />
        <WelkInput
          label="Secret identity"
          type="password"
          placeholder="Your secret..."
        />
        <WelkInput
          label="Read-only field"
          defaultValue="Captain Welk"
          readOnly
        />
        <WelkInput
          label="Disabled field"
          placeholder="Taking a break..."
          disabled
        />
      </div>
      <p>
        <WelkCheckBox label="Keep it playful" />
      </p>
      <h2>Accordions</h2>
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <WelkAccordion title="Built for your application" closeOnOutsideClick>
          Import components and the package stylesheet to get started.
        </WelkAccordion>
        <WelkAccordion
          variant="horizontal"
          title="Horizontal"
          closeOnOutsideClick
        >
          This panel opens beside its title. Tap outside to close.
        </WelkAccordion>
        <WelkAccordion title="Nested accordions" closeOnOutsideClick>
          <WelkAccordion
            variant="nested"
            title="Nested child"
            closeOnOutsideClick
          >
            Each accordion can close independently when tapped outside.
          </WelkAccordion>
        </WelkAccordion>
      </div>
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
