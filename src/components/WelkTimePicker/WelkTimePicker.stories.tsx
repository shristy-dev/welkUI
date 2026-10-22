import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkTimePicker } from "./WelkTimePicker";

const meta = {
  title: "Components/WelkTimePicker",
  component: WelkTimePicker,
  args: { label: "Adventure time", defaultValue: "14:30" },
} satisfies Meta<typeof WelkTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithSeconds: Story = {
  args: { showSeconds: true, defaultValue: "14:30:15" },
};
export const Empty: Story = { args: { defaultValue: "", required: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState("14:30");
    return <WelkTimePicker {...args} value={value} onValueChange={setValue} />;
  },
};
