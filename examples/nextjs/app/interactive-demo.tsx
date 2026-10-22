"use client";

import { useState } from "react";
import { WelkButton, WelkCheckBox } from "@welkui/react";

export function InteractiveDemo() {
  const [count, setCount] = useState(0);
  return (
    <>
      <WelkButton onClick={() => setCount((value) => value + 1)}>
        Clicked {count} times
      </WelkButton>
      <p>
        <WelkCheckBox label="Keep it playful" />
      </p>
    </>
  );
}
