import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkSwitch } from "./WelkSwitch";

const meta = {
  title: "Components/WelkSwitch",
  component: WelkSwitch,
  args: { label: "Activate hero mode" },
} satisfies Meta<typeof WelkSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [checked, setChecked] = useState(false);
    return (
      <WelkSwitch {...args} checked={checked} onCheckedChange={setChecked} />
    );
  },
};
