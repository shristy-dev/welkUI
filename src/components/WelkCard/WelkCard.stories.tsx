import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { WelkCard } from "./WelkCard";

const meta = {
  title: "Components/WelkCard",
  component: WelkCard,
  args: {
    title: "Your next adventure",
    subtitle: "Every great story starts with a single click.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    ),
    onClick: fn(),
  },
} satisfies Meta<typeof WelkCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithoutHoverGrowth: Story = { args: { growOnHover: false } };
export const Disabled: Story = { args: { disabled: true } };
export const WithoutIcon: Story = { args: { icon: undefined } };
