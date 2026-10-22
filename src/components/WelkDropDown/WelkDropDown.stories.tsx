import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkDropDown } from "./WelkDropDown";

const meta = {
  title: "Components/WelkDropDown",
  component: WelkDropDown,
  args: {
    label: "Choose your hero",
    options: [
      { value: "superman", label: "Superman" },
      { value: "batman", label: "Batman" },
      { value: "wonder-woman", label: "Wonder Woman" },
      { value: "flash", label: "Flash", disabled: true },
    ],
  },
} satisfies Meta<typeof WelkDropDown>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Searchable: Story = { args: { searchable: true } };
export const Selected: Story = {
  args: { searchable: true, defaultValue: "batman" },
};
export const Disabled: Story = { args: { disabled: true } };
