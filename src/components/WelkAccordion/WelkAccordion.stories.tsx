import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkAccordion } from "./WelkAccordion";

const meta = {
  title: "Components/WelkAccordion",
  component: WelkAccordion,
  args: {
    title: "What is welkUI?",
    children: "A playful component library built on native HTML interactions.",
  },
} satisfies Meta<typeof WelkAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { open: true } };
