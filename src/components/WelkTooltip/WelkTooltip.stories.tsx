import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkButton } from "../WelkButton";
import { WelkTooltip } from "./WelkTooltip";

const meta = {
  title: "Components/WelkTooltip",
  component: WelkTooltip,
  args: {
    content: "A brilliant idea is brewing...",
    children: <WelkButton>Hover or focus me</WelkButton>,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "8rem 2rem 2rem" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: { variant: { control: "select", options: ["bubble", "speech"] } },
} satisfies Meta<typeof WelkTooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Bubble: Story = {};
export const Speech: Story = {
  args: { variant: "speech", content: "Let's start the adventure!" },
};
