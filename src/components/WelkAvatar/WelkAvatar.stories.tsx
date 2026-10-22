import type { Meta, StoryObj } from "@storybook/react-vite";
import human from "../../../assets/icons/person/human.png";
import { WelkAvatar } from "./WelkAvatar";

const meta = {
  title: "Components/WelkAvatar",
  component: WelkAvatar,
  args: { alt: "User profile" },
  argTypes: { color: { control: "color" } },
} satisfies Meta<typeof WelkAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const User: Story = {};
export const MaleUser: Story = {
  args: { variant: "male-user", alt: "Male user" },
};
export const FemaleUser: Story = {
  args: { variant: "female-user", alt: "Female user" },
};
export const MaleAdmin: Story = {
  args: { variant: "male-admin", alt: "Male admin" },
};
export const FemaleAdmin: Story = {
  args: { variant: "female-admin", alt: "Female admin" },
};
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const CustomColor: Story = { args: { color: "#82caff" } };
export const GrowOnHover: Story = { args: { growOnHover: true } };
export const CustomImage: Story = {
  args: { src: human, alt: "Custom profile" },
};
export const CustomIcon: Story = {
  args: {
    alt: "Favorite profile",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="m12 2 3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z" />
      </svg>
    ),
  },
};
