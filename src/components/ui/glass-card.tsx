"use client";

import styled from "styled-components";
import { theme } from "@/lib/theme";

export const GlassCard = styled.div<{
  $glowColor?: string;
  $padding?: string;
  $interactive?: boolean;
}>`
  background: ${theme.colors.glassBg};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ $glowColor }) => $glowColor ? `${$glowColor}30` : theme.colors.glassBorder};
  border-radius: ${theme.radii.lg};
  padding: ${({ $padding }) => $padding || "20px"};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.03) 0%,
      transparent 60%
    );
    pointer-events: none;
  }

  ${({ $interactive, $glowColor }) =>
    $interactive &&
    `
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: ${$glowColor || theme.colors.primary}50;
      box-shadow: ${theme.shadows.glow($glowColor || theme.colors.primary)};
    }
  `}
`;
