"use client";

import { forwardRef } from "react";
import { DatePickerControl } from "../WelkDatePicker/WelkDatePicker";
import type { WelkDateInputProps } from "./WelkDateInput.types";

export const WelkDateInput = forwardRef<HTMLInputElement, WelkDateInputProps>(
  function WelkDateInput(props, ref) {
    return <DatePickerControl {...props} ref={ref} popup />;
  },
);
