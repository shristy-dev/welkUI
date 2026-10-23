import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkTabs } from "./WelkTabs";

const meta = {
  title: "Components/WelkTabs",
  component: WelkTabs,
  args: {
    label: "Mission information",
    items: [
      {
        label: "Overview",
        value: "overview",
        content: "A quick overview of your next mission.",
      },
      {
        label: "Objectives",
        value: "objectives",
        content: "Complete the mission and return safely.",
      },
      {
        label: "Disabled",
        value: "disabled",
        content: "This tab is not currently available.",
        disabled: true,
      },
    ],
  },
} satisfies Meta<typeof WelkTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBg: Story = { args: { variant: "withBg" } };
export const WithBgVertical: Story = {
  args: { variant: "withBg", orientation: "vertical" },
};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const Selected: Story = { args: { defaultValue: "objectives" } };
