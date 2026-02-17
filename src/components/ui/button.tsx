"use client";

import styled, { css } from "styled-components";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants = {
  primary: css`
    background: #38BDF8;
    color: white;
    border: none;
    &:hover:not(:disabled) {
      background: #0EA5E9;
    }
  `,
  secondary: css`
    background: #1e293b;
    color: #e5e7eb;
    border: 1px solid #1e293b;
    &:hover:not(:disabled) {
      background: #1e293b;
    }
  `,
  ghost: css`
    background: transparent;
    color: #94a3b8;
    border: none;
    &:hover:not(:disabled) {
      color: #e5e7eb;
      background: #1e293b;
    }
  `,
  danger: css`
    background: transparent;
    color: #38BDF8;
    border: 1px solid #38BDF840;
    &:hover:not(:disabled) {
      background: #38BDF820;
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
