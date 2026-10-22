import { useArgs } from "storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkButton } from "../WelkButton";
import { WelkDrawer } from "./WelkDrawer";

const meta = {
  title: "Components/WelkDrawer",
  component: WelkDrawer,
  args: {
    open: false,
    onClose: () => {},
    title: "Your next adventure",
    children: "A comic panel for your settings, navigation or mission details.",
    position: "right",
  },
  render: function DrawerStory(args) {
    const [{ open }, updateArgs] = useArgs<typeof args>();
    return (
      <>
        <WelkButton onClick={() => updateArgs({ open: true })}>
          Open drawer
        </WelkButton>
        <WelkDrawer
          {...args}
          open={open}
          onClose={() => {
            args.onClose();
            updateArgs({ open: false });
          }}
        />
      </>
    );
  },
} satisfies Meta<typeof WelkDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Left: Story = { args: { position: "left" } };
export const Top: Story = { args: { position: "top" } };
export const Bottom: Story = { args: { position: "bottom" } };
export const BackdropDismiss: Story = { args: { closeOnTapOutside: true } };
export const LongContent: Story = {
  args: { children: <p>{"A heroic tale! ".repeat(300)}</p> },
};
