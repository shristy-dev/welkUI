import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkRangeSlider } from "./WelkRangeSlider";

const meta = {
  title: "Components/WelkRangeSlider",
  component: WelkRangeSlider,
  args: { label: "Hero power", defaultValue: 50 },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WelkRangeSlider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Stepped: Story = {
  args: { min: 0, max: 10, step: 2, defaultValue: 4 },
};
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState(50);
    return (
      <WelkRangeSlider
        {...args}
        defaultValue={undefined}
        label={`Hero power: ${value}`}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};
