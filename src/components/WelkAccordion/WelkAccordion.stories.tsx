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
export const Vertical: Story = { args: { variant: "vertical" } };
export const Horizontal: Story = { args: { variant: "horizontal" } };
export const Nested: Story = {
  render: (args) => (
    <WelkAccordion {...args} title="Parent accordion">
      <WelkAccordion
        variant="nested"
        title="Child accordion"
        closeOnOutsideClick={args.closeOnOutsideClick}
      >
        Nested content with independent disclosure behavior.
      </WelkAccordion>
    </WelkAccordion>
  ),
};
export const CloseOnOutsideClick: Story = {
  args: { closeOnOutsideClick: true },
  render: (args) => (
    <div style={{ padding: "2rem" }}>
      <p>Open the accordion, then tap here to close it.</p>
      <WelkAccordion {...args} />
    </div>
  ),
};
