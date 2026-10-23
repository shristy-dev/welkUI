import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelkMenu } from "./WelkMenu";

const meta = {
  title: "Components/WelkMenu",
  component: WelkMenu,
  args: {
    items: [
      { title: "Home", route: "#home" },
      {
        title: "Heroes",
        route: "#heroes",
        children: [
          { title: "Superman", route: "#superman" },
          {
            title: "Batman",
            route: "#batman",
            children: [{ title: "Gotham", route: "#gotham" }],
          },
        ],
      },
      { title: "About", route: "#about" },
    ],
  },
} satisfies Meta<typeof WelkMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Nested: Story = { args: { variant: "nested" } };
export const Collapsible: Story = {
  args: { collapsible: true, variant: "nested" },
};
export const ActiveRoute: Story = { args: { activeRoute: "#home" } };
