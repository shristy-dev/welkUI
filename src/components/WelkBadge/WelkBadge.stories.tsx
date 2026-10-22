import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkBadge } from "./WelkBadge";

const meta = {
  title: "Components/WelkBadge",
  component: WelkBadge,
  args: { children: "NEW!" },
} satisfies Meta<typeof WelkBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {(["default", "info", "success", "warning", "error"] as const).map(
        (variant) => (
          <WelkBadge {...args} key={variant} variant={variant}>
            {variant}
          </WelkBadge>
        ),
      )}
    </div>
  ),
};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <WelkBadge {...args} key={size} size={size} />
      ))}
    </div>
  ),
};
export const Count: Story = {
  args: { children: 12, "aria-label": "12 unread messages" },
};
