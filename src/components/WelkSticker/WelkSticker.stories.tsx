import type { Meta, StoryObj } from "@storybook/react-vite";
import superman from "../../../assets/images/superman.png";
import batman from "../../../assets/images/batman.png";
import comic from "../../../assets/images/comic_bg_02.jpg";
import { WelkSticker } from "./WelkSticker";

const meta = {
  title: "Components/WelkSticker",
  component: WelkSticker,
  args: {
    src: superman,
    alt: "Superman sticker",
    fallbackSrc: comic,
    width: 160,
    height: 160,
    outlineThickness: 6,
    outlineColor: "white",
  },
  argTypes: {
    outlineThickness: { control: { type: "number", min: 0, step: 1 } },
    outlineColor: { control: "color" },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "3rem", background: "#82caff" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WelkSticker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ElevateOnHover: Story = { args: { elevateOnHover: true } };
export const CustomOutline: Story = {
  args: { outlineThickness: 10, outlineColor: "#ffda57" },
};
export const Batman: Story = { args: { src: batman, alt: "Batman sticker" } };
export const Small: Story = { args: { width: 80, height: 80 } };
export const ComicFallback: Story = {
  args: { src: "/missing-sticker.png", alt: "Comic background fallback" },
};
export const BrokenImage: Story = {
  args: { src: "/missing-sticker.png", fallbackSrc: undefined },
};
