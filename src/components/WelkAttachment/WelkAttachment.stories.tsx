import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkAttachment } from "./WelkAttachment";

const meta = {
  title: "Components/WelkAttachment",
  component: WelkAttachment,
  args: { label: "Attach your mission files" },
} satisfies Meta<typeof WelkAttachment>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const MediaPreviews: Story = {
  args: { accept: "image/*,video/*,audio/*" },
};
export const Limited: Story = {
  args: { maxFiles: 3, maxFileSize: 5 * 1024 * 1024, accept: "image/*,.pdf" },
};
export const SingleFile: Story = { args: { multiple: false } };
export const Disabled: Story = { args: { disabled: true } };
export const Required: Story = {
  args: { required: true, name: "attachments" },
};
