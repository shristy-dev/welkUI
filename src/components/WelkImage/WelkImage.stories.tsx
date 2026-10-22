import type { Meta, StoryObj } from "@storybook/react-vite";
import comic from "../../../assets/images/comic_bg_04.jpg";
import { WelkImage } from "./WelkImage";

const meta = {
  title: "Components/WelkImage",
  component: WelkImage,
  args: { src: comic, alt: "Comic artwork", width: 360, height: 240 },
  argTypes: { variant: { control: "select", options: ["network", "asset"] } },
} satisfies Meta<typeof WelkImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Asset: Story = { args: { variant: "asset" } };
export const Network: Story = {
  args: {
    variant: "network",
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=720",
    alt: "Concert lights",
  },
};
export const NetworkFallback: Story = {
  args: { variant: "network", src: "/missing-network-image.jpg" },
};
export const CustomFallback: Story = {
  args: {
    variant: "network",
    src: "/missing-network-image.jpg",
    fallbackSrc: comic,
  },
};
