import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { WelkIconButton } from "./WelkIconButton";

const meta = {
  title: "Components/WelkIconButton",
  component: WelkIconButton,
  args: {
    label: "Add item",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M12 4v16M4 12h16" />
      </svg>
    ),
    onClick: fn(),
  },
  argTypes: { variant: { control: "select", options: ["default", "text"] } },
} satisfies Meta<typeof WelkIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Text: Story = { args: { variant: "text" } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledText: Story = {
  args: { disabled: true, variant: "text" },
};
