"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "@/lib/theme";

const CounterSpan = styled.span<{ $color?: string }>`
  display: inline-block;
  font-variant-numeric: tabular-nums;
  color: ${({ $color }) => $color || theme.colors.text};
  transition: transform 0.3s ease, color 0.3s ease;

  &.bump {
    transform: scale(1.15);
    color: ${theme.colors.accent};
  }
`;

export function AnimatedCounter({
  value,
  color,
  duration = 600,
  prefix = "",
  suffix = "",
}: {
  value: number;
  color?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(value);
  const [bumping, setBumping] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;

    const start = prevValue.current;
    const diff = value - start;
    const startTime = performance.now();

    setBumping(true);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = value;
        setBumping(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <CounterSpan $color={color} className={bumping ? "bump" : ""}>
      {prefix}{display.toLocaleString("fr-FR")}{suffix}
    </CounterSpan>
  );
}
