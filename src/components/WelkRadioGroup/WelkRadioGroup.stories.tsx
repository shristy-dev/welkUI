import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkRadioGroup } from "./WelkRadioGroup";

const meta = {
  title: "Components/WelkRadioGroup",
  component: WelkRadioGroup,
  args: {
    label: "Choose your role",
    options: [
      { label: "Hero", value: "hero" },
      { label: "Sidekick", value: "sidekick" },
      { label: "Villain", value: "villain", disabled: true },
    ],
  },
} satisfies Meta<typeof WelkRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Preselected: Story = { args: { defaultValue: "hero" } };
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "hero" },
};
export const Required: Story = { args: { required: true } };
export const Controlled: Story = {
  render: function ControlledGroup(args) {
    const [value, setValue] = useState("hero");
    return <WelkRadioGroup {...args} value={value} onValueChange={setValue} />;
  },
};
