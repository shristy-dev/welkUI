import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkInput } from "./WelkInput";
import { useState } from "react";

const meta = {
  title: "Components/WelkInput",
  component: WelkInput,
  args: { label: "Your name", placeholder: "A comic book hero..." },
} satisfies Meta<typeof WelkInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithEndAction: Story = {
  render: function EndActionStory(args) {
    const [value, setValue] = useState("");
    return (
      <WelkInput
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        endAction={{
          icon: (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ),
          label: "Clear name",
          onClick: () => setValue(""),
        }}
      />
    );
  },
};
export const WithValue: Story = { args: { defaultValue: "Captain Welk" } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Captain Welk" },
};
export const Password: Story = {
  args: {
    label: "Secret identity",
    type: "password",
    placeholder: "Your secret...",
  },
};
export const Invalid: Story = {
  render: (args) => (
    <div>
      <WelkInput {...args} aria-invalid="true" aria-describedby="name-error" />
      <p id="name-error">Please enter your hero name.</p>
    </div>
  ),
};
