import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { WelkOTPInput } from "./WelkOTPInput";

const meta = {
  title: "Components/WelkOTPInput",
  component: WelkOTPInput,
  args: { label: "Verification code", onValueChange: fn(), onComplete: fn() },
} satisfies Meta<typeof WelkOTPInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const FourDigits: Story = { args: { length: 4 } };
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "123" },
};
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "123456" },
};
