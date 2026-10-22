import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkButton } from "./WelkButton";

const meta = {
  title: "Components/WelkButton",
  component: WelkButton,
  args: { children: "Make it happen" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "error",
        "warning",
        "ghost",
        "info",
        "success",
        "secondary",
      ],
    },
  },
} satisfies Meta<typeof WelkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Error: Story = { args: { variant: "error" } };
export const Warning: Story = { args: { variant: "warning" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Info: Story = { args: { variant: "info" } };
export const Success: Story = { args: { variant: "success" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Disabled: Story = { args: { disabled: true } };
