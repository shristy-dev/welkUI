import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkButton } from "./WelkButton";

const meta = {
  title: "Components/WelkButton",
  component: WelkButton,
  args: { children: "Make it happen" },
} satisfies Meta<typeof WelkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { disabled: true } };
