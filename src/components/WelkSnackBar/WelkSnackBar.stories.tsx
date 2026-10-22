import { useArgs } from "storybook/preview-api";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkButton } from "../WelkButton";
import { WelkSnackBar } from "./WelkSnackBar";

const meta = {
  title: "Components/WelkSnackBar",
  component: WelkSnackBar,
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    onClose: () => {},
    message: "POW! Your changes are saved.",
    position: "bottom-middle",
  },
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-middle",
        "top-right",
        "bottom-left",
        "bottom-middle",
        "bottom-right",
      ],
    },
  },
  render: function SnackBarStory(args) {
    const [{ open }, updateArgs] = useArgs<typeof args>();
    return (
      <div style={{ padding: "1rem" }}>
        <WelkButton onClick={() => updateArgs({ open: true })}>
          Show snackbar
        </WelkButton>
        <WelkSnackBar
          {...args}
          open={open}
          onClose={() => {
            args.onClose();
            updateArgs({ open: false });
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof WelkSnackBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const TopLeft: Story = { args: { position: "top-left" } };
export const TopMiddle: Story = { args: { position: "top-middle" } };
export const TopRight: Story = { args: { position: "top-right" } };
export const BottomLeft: Story = { args: { position: "bottom-left" } };
export const BottomRight: Story = { args: { position: "bottom-right" } };
export const Success: Story = { args: { variant: "success" } };
export const Error: Story = {
  args: { variant: "error", message: "OOPS! Something went wrong." },
};
export const AutoHide: Story = { args: { autoHideDuration: 5000 } };
export const LongMessage: Story = {
  args: {
    message:
      "A comic notification with a longer message that wraps naturally on smaller screens. ".repeat(
        3,
      ),
  },
};
