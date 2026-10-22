import { expectTypeOf, it } from "vitest";
import type { WelkInputProps } from "./WelkInput";
import type { WelkCheckBoxProps } from "./WelkCheckBox";
import type { WelkAvatarProps } from "./WelkAvatar";
import type { WelkAccordionProps } from "./WelkAccordion";
import type { WelkButtonProps } from "./WelkButton";
import type { WelkDialogProps } from "./WelkDialog";
import type { WelkRadioProps } from "./WelkRadio";
import type { WelkRadioGroupProps } from "./WelkRadioGroup";
import type { WelkImageProps } from "./WelkImage";
import type { WelkCardProps } from "./WelkCard";
import type { WelkIconButtonProps } from "./WelkIconButton";

type BorderOptions<T> = Extract<keyof T, "borderStyle" | "dottedBorder">;

it("does not expose border variant options on any component", () => {
  expectTypeOf<BorderOptions<WelkButtonProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkDialogProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkInputProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkCheckBoxProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkAvatarProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkAccordionProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkRadioProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkRadioGroupProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkImageProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkCardProps>>().toEqualTypeOf<never>();
  expectTypeOf<BorderOptions<WelkIconButtonProps>>().toEqualTypeOf<never>();
});
