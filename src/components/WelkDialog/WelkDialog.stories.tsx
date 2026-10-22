import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkDialog } from "./WelkDialog";
import { WelkButton } from "../WelkButton";

const meta = {
  title: "Components/WelkDialog",
  component: WelkDialog,
  args: {
    open: false,
    onClose: () => {},
    title: "A little heads-up!",
    children: "Your comic adventure continues here.",
  },
  render: function DialogStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <WelkButton onClick={() => setOpen(true)}>Open dialog</WelkButton>
        <WelkDialog
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose();
          }}
        />
      </>
    );
  },
} satisfies Meta<typeof WelkDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alert: Story = {};
export const Info: Story = { args: { variant: "info" } };
export const Warning: Story = { args: { variant: "warning" } };
export const Error: Story = { args: { variant: "error" } };
export const Success: Story = { args: { variant: "success" } };
export const Confirmation: Story = {
  args: { type: "confirmation", title: "Continue your adventure?" },
};
export const CustomLabels: Story = {
  args: { type: "confirmation", yesText: "Continue", noText: "Go back" },
};
export const OutsideDismissal: Story = { args: { closeOnTapOutside: true } };
