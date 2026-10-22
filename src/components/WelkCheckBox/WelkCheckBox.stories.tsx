import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkCheckBox } from "./WelkCheckBox";

const meta = {
  title: "Components/WelkCheckBox",
  component: WelkCheckBox,
  args: { label: "Count me in" },
} satisfies Meta<typeof WelkCheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
