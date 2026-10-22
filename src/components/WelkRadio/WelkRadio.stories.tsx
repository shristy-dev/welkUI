import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkRadio } from "./WelkRadio";

const meta = {
  title: "Components/WelkRadio",
  component: WelkRadio,
  args: { label: "Be a hero" },
} satisfies Meta<typeof WelkRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledSelected: Story = {
  args: { disabled: true, defaultChecked: true },
};
