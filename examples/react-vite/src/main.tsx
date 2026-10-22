import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  WelkAccordion,
  WelkButton,
  WelkCheckBox,
  WelkInput,
  WelkAvatar,
  WelkDialog,
  WelkRadio,
  WelkRadioGroup,
  WelkImage,
  WelkCard,
  WelkIconButton,
  WelkTooltip,
  WelkDatePicker,
  WelkDateInput,
  WelkOTPInput,
  WelkDivider,
  WelkSticker,
  WelkRangeSlider,
  WelkTimePicker,
  WelkDropDown,
  WelkStickerCard,
  WelkSnackBar,
  WelkAttachment,
  WelkBreadCrumbs,
  WelkBadge,
  WelkSwitch,
  WelkDrawer,
} from "@welkui/react";
import type { WelkSnackBarPosition, WelkDrawerPosition } from "@welkui/react";
import "@welkui/react/styles.css";
import human from "../../../assets/icons/person/human.png";
import comic from "../../../assets/images/comic_bg_04.jpg";
import superman from "../../../assets/images/superman.png";
import batman from "../../../assets/images/batman.png";

function App() {
  const [count, setCount] = useState(0);
  const [hero, setHero] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] =
    useState<WelkDrawerPosition>("right");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    position: WelkSnackBarPosition;
    open: boolean;
    sequence: number;
  }>({ position: "bottom-middle", open: false, sequence: 0 });
  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "1rem" }}>
      <h1>welkUI + React</h1>
      <WelkBreadCrumbs
        items={[
          { label: "Home", href: "#home" },
          { label: "Components", href: "#components" },
          { label: "Comic showcase" },
        ]}
      />
      <h2>Badges</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <WelkBadge>NEW!</WelkBadge>
        <WelkBadge variant="info">Info</WelkBadge>
        <WelkBadge variant="success">Ready</WelkBadge>
        <WelkBadge variant="warning">Careful!</WelkBadge>
        <WelkBadge variant="error">Oops!</WelkBadge>
      </div>
      <h2>Switch</h2>
      <WelkSwitch label="Activate hero mode" />
      <h2>Drawers</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {(["left", "right", "top", "bottom"] as const).map((position) => (
          <WelkButton
            key={position}
            onClick={() => {
              setDrawerPosition(position);
              setDrawerOpen(true);
            }}
          >
            Open {position} drawer
          </WelkButton>
        ))}
      </div>
      <WelkDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position={drawerPosition}
        title="Your next adventure"
        closeOnTapOutside
      >
        <p>
          Choose your next mission, update your gear, or take a heroic break.
        </p>
        <WelkSwitch label="Enable mission alerts" />
      </WelkDrawer>
      <hr />
      <WelkButton onClick={() => setCount((value) => value + 1)}>
        Clicked {count} times
      </WelkButton>
      <h2>Attachments</h2>
      <WelkAttachment
        label="Attach your mission files"
        maxFiles={3}
        maxFileSize={5 * 1024 * 1024}
        accept="image/*,.pdf"
        name="attachments"
      />
      <h2>Snackbar</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {(
          [
            "top-left",
            "top-middle",
            "top-right",
            "bottom-left",
            "bottom-middle",
            "bottom-right",
          ] as const
        ).map((position) => (
          <WelkButton
            key={position}
            onClick={() =>
              setSnackbar((current) => ({
                position,
                open: true,
                sequence: current.sequence + 1,
              }))
            }
          >
            {position}
          </WelkButton>
        ))}
      </div>
      <WelkSnackBar
        key={snackbar.sequence}
        open={snackbar.open}
        position={snackbar.position}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        message="POW! Your changes are saved."
        autoHideDuration={5000}
      />
      <h2>Dropdown</h2>
      <WelkDropDown
        label="Choose your hero"
        searchable
        options={[
          { value: "superman", label: "Superman" },
          { value: "batman", label: "Batman" },
          { value: "wonder-woman", label: "Wonder Woman" },
        ]}
      />
      <h2>Time picker</h2>
      <WelkTimePicker
        label="Adventure time"
        defaultValue="14:30:15"
        showSeconds
      />
      <h2>Range slider</h2>
      <WelkRangeSlider label="Hero power" defaultValue={60} />
      <h2>Stickers</h2>
      <WelkStickerCard
        title="A super adventure"
        subtitle="Your next mission starts here."
        sticker={{ src: superman, alt: "", fallbackSrc: comic }}
        onClick={() => setDialogOpen(true)}
      />
      <WelkSticker
        src={superman}
        alt="Superman sticker"
        fallbackSrc={comic}
        width={160}
        height={160}
      />
      <WelkSticker
        src={batman}
        alt="Batman sticker"
        fallbackSrc={comic}
        width={160}
        height={160}
      />
      <h2>Button variants</h2>
      <WelkButton onClick={() => setDialogOpen(true)}>
        Open confirmation dialog
      </WelkButton>
      <br />
      <WelkDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Continue your adventure?"
        variant="info"
        type="confirmation"
        closeOnTapOutside
      >
        Choose Yes or No, press Escape, or tap outside to close.
      </WelkDialog>
      <br />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <WelkButton>Primary</WelkButton>
        <WelkButton variant="error">Error</WelkButton>
        <WelkButton variant="warning">Warning</WelkButton>
        <WelkButton variant="ghost">Ghost</WelkButton>
        <WelkButton variant="info">Info</WelkButton>
        <WelkButton variant="success">Success</WelkButton>
      </div>
      <h2>Dividers</h2>
      <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
        <WelkDivider aria-label="Plain divider" />
        <WelkDivider
          variant="dotted"
          thickness={3}
          aria-label="Dotted divider"
        />
        <WelkDivider
          variant="dashed"
          thickness={4}
          aria-label="Dashed divider"
        />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Left</span>
          <WelkDivider
            orientation="vertical"
            thickness={3}
            style={{ height: 48 }}
            aria-label="Vertical divider"
          />
          <span>Right</span>
        </div>
      </div>
      <h2>OTP input</h2>
      <WelkOTPInput label="Verification code" name="otp" />
      <h2>Date picker</h2>
      <WelkDateInput label="Choose a date" defaultValue="2026-10-22" />
      <WelkDatePicker
        label="Pick your adventure date"
        defaultValue="2026-10-22"
        name="adventureDate"
      />
      <h2>Tooltips</h2>
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <WelkTooltip content="A brilliant idea is brewing...">
          <WelkButton>Thinking bubble</WelkButton>
        </WelkTooltip>
        <WelkTooltip variant="speech" content="Let's start the adventure!">
          <WelkButton>Speech bubble</WelkButton>
        </WelkTooltip>
      </div>
      <h2>Icon buttons</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <WelkIconButton
          label="Open dialog"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M12 4v16M4 12h16" />
            </svg>
          }
          onClick={() => setDialogOpen(true)}
        />
        <WelkIconButton
          variant="text"
          label="Add hero"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M12 4v16M4 12h16" />
            </svg>
          }
          onClick={() => setDialogOpen(true)}
        />
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
      <h2>Cards</h2>
      <WelkCard
        title="Your next adventure"
        subtitle="Click to open the confirmation dialog."
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        }
        onClick={() => setDialogOpen(true)}
        style={{ marginBottom: "2rem" }}
      />
      <h2>Images</h2>
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <WelkImage
          variant="asset"
          src={comic}
          alt="Comic artwork from a local asset"
          width={480}
          height={240}
        />
        <WelkImage
          variant="network"
          src="/missing-network-image.jpg"
          alt="Default comic fallback for a failed network image"
          width={480}
          height={240}
        />
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
      <h2>Radio buttons</h2>
      <p>
        <WelkRadio label="Join the adventure" name="adventure" value="join" />
      </p>
      <WelkRadioGroup
        label="Choose your role"
        name="role"
        defaultValue="hero"
        options={[
          { label: "Hero", value: "hero" },
          { label: "Sidekick", value: "sidekick" },
          { label: "Villain", value: "villain", disabled: true },
        ]}
      />
      <h2>Accordions</h2>
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <WelkAccordion title="Built for your application" closeOnOutsideClick>
          Import components and the package stylesheet to get started.
        </WelkAccordion>
        <WelkAccordion
          variant="horizontal"
          title="Horizontal"
          fixedWidth={480}
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
