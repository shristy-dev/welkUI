import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkDateInput } from "./WelkDateInput";

const meta = {
  title: "Components/WelkDateInput",
  component: WelkDateInput,
  args: { label: "Adventure date", defaultValue: "2026-10-22" },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 440 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WelkDateInput>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { defaultValue: "" } };
export const Disabled: Story = { args: { disabled: true } };
export const LimitedRange: Story = {
  args: { min: "2026-10-10", max: "2026-10-28" },
};
