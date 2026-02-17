"use client";

import styled, { css } from "styled-components";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants = {
  primary: css`
    background: #e63946;
    color: white;
    border: none;
    &:hover:not(:disabled) {
      background: #c62d38;
    }
  `,
  secondary: css`
    background: #1a1a25;
    color: #e5e5e5;
    border: 1px solid #2a2a35;
    &:hover:not(:disabled) {
      background: #2a2a35;
    }
  `,
  ghost: css`
    background: transparent;
    color: #8888aa;
    border: none;
    &:hover:not(:disabled) {
      color: #e5e5e5;
      background: #1a1a25;
    }
  `,
  danger: css`
    background: transparent;
    color: #e63946;
    border: 1px solid #e6394640;
    &:hover:not(:disabled) {
      background: #e6394620;
    }
  `,
};

const sizes = {
  sm: css`
    padding: 6px 14px;
    font-size: 0.8rem;
  `,
  md: css`
    padding: 10px 20px;
    font-size: 0.9rem;
  `,
  lg: css`
    padding: 14px 28px;
    font-size: 1rem;
  `,
};

export const Button = styled.button<{
  $variant?: Variant;
  $size?: Size;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  ${(p) => variants[p.$variant || "primary"]}
  ${(p) => sizes[p.$size || "md"]}
  ${(p) => p.$fullWidth && "width: 100%;"}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
