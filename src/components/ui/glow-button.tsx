"use client";

import React, { useRef, useCallback } from "react";
import styled, { css, keyframes } from "styled-components";
import { theme } from "@/lib/theme";

type GlowVariant = "primary" | "accent" | "success" | "danger";

const variantColors: Record<GlowVariant, { bg: string; glow: string }> = {
  primary: { bg: theme.gradients.primary, glow: theme.colors.primary },
  accent: { bg: theme.gradients.accent, glow: theme.colors.accent },
  success: { bg: `linear-gradient(135deg, ${theme.colors.success}, #238577)`, glow: theme.colors.success },
  danger: { bg: `linear-gradient(135deg, ${theme.colors.danger}, #DC2626)`, glow: theme.colors.danger },
};

const rippleAnim = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledButton = styled.button<{
  $variant: GlowVariant;
  $size: "sm" | "md" | "lg";
  $fullWidth?: boolean;
  $loading?: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: ${theme.radii.md};
  font-family: ${theme.fonts.body};
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  color: white;
  background: ${({ $variant }) => variantColors[$variant].bg};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.02em;

  ${({ $size }) => {
    switch ($size) {
      case "sm": return css`
        padding: 6px 14px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      `;
      case "lg": return css`padding: 14px 28px; font-size: 16px;`;
      default: return css`padding: 10px 20px; font-size: 14px;`;
    }
  }}

  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  /* Inner highlight */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 100%
    );
    pointer-events: none;
    border-radius: ${theme.radii.md} ${theme.radii.md} 0 0;
  }

  /* Hover glow overlay */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ $variant }) => theme.shadows.glowStrong(variantColors[$variant].glow)};

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;

    &::before { opacity: 0; }
  }

  ${({ $loading }) => $loading && css`
    pointer-events: none;
    opacity: 0.8;
  `}

  /* Ripple container */
  .glow-btn-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
    transform: scale(0);
    animation: ${rippleAnim} 0.6s ease-out;
    pointer-events: none;
  }
`;

const Spinner = styled.svg`
  width: 16px;
  height: 16px;
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: GlowVariant;
  $size?: "sm" | "md" | "lg";
  $fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

export function GlowButton({
  $variant = "primary",
  $size = "md",
  $fullWidth,
  icon,
  iconRight,
  loading,
  children,
  disabled,
  onClick,
  ...rest
}: GlowButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;

      // Ripple effect
      const btn = btnRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement("span");
        ripple.className = "glow-btn-ripple";
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        btn.appendChild(ripple);

        ripple.addEventListener("animationend", () => ripple.remove());
      }

      onClick?.(e);
    },
    [loading, disabled, onClick]
  );

  return (
    <StyledButton
      ref={btnRef}
      $variant={$variant}
      $size={$size}
      $fullWidth={$fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <Spinner viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </Spinner>
      ) : icon ? (
        <IconWrapper>{icon}</IconWrapper>
      ) : null}
      <span>{children}</span>
      {iconRight && !loading && <IconWrapper>{iconRight}</IconWrapper>}
    </StyledButton>
  );
}
