import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkBreadCrumbs } from "./WelkBreadCrumbs";

const meta = {
  title: "Components/WelkBreadCrumbs",
  component: WelkBreadCrumbs,
  args: {
    items: [
      { label: "Home", href: "#home" },
      { label: "Heroes", href: "#heroes" },
      { label: "Superman" },
    ],
  },
} satisfies Meta<typeof WelkBreadCrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const CustomSeparator: Story = { args: { separator: ">" } };
export const CurrentLink: Story = {
  args: {
    items: [
      { label: "Home", href: "#home" },
      { label: "Heroes", href: "#heroes" },
    ],
  },
};
export const LongLabels: Story = {
  args: {
    items: [
      { label: "Home", href: "#home" },
      { label: "The extraordinarily long superhero adventure archive" },
    ],
  },
};
