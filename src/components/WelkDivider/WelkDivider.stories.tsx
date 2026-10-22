import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkDivider } from "./WelkDivider";

const meta = {
  title: "Components/WelkDivider",
  component: WelkDivider,
  args: { orientation: "horizontal", variant: "plain", thickness: 2 },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: ["plain", "dotted", "dashed"] },
    thickness: { control: { type: "number", min: 0.5, step: 0.5 } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300, padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WelkDivider>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Plain: Story = {};
export const Dotted: Story = { args: { variant: "dotted", thickness: 3 } };
export const Dashed: Story = { args: { variant: "dashed", thickness: 4 } };
export const Vertical: Story = {
  args: { orientation: "vertical", style: { height: 100 } },
};
