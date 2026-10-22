import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkStickerCard } from "./WelkStickerCard";
import superman from "../../../assets/images/superman.png";
import batman from "../../../assets/images/batman.png";

const meta = {
  title: "Components/WelkStickerCard",
  component: WelkStickerCard,
  args: {
    title: "A super adventure",
    subtitle: "Your next mission starts here.",
    sticker: { src: superman, alt: "" },
  },
} satisfies Meta<typeof WelkStickerCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Batman: Story = {
  args: { sticker: { src: batman, alt: "", outlineColor: "#ffe87b" } },
};
export const Disabled: Story = { args: { disabled: true } };
export const LongContent: Story = {
  args: { subtitle: "A longer adventure description. ".repeat(15) },
};
