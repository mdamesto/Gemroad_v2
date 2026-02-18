"use client";

import styled from "styled-components";
import { theme, alpha } from "@/lib/theme";

export const GlassCard = styled.div<{
  $glowColor?: string;
  $padding?: string;
  $interactive?: boolean;
}>`
  background: ${theme.colors.glassBg};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: none;
  border-radius: 20px;
  padding: ${({ $padding }) => $padding || "20px"};
  position: relative;
  overflow: hidden;
  box-shadow:
    0 2px 8px rgba(var(--shadow-base), 0.25),
    0 6px 20px rgba(var(--shadow-base), 0.15);

  ${({ $interactive, $glowColor }) =>
    $interactive &&
    `
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow:
        0 4px 16px rgba(var(--shadow-base), 0.35),
        0 0 24px ${alpha($glowColor || theme.colors.primary, 0.09)},
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
  `}
`;
