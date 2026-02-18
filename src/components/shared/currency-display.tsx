"use client";

import styled from "styled-components";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { theme, alpha } from "@/lib/theme";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: ${theme.colors.bgHover};
  border: 1px solid ${alpha(theme.colors.accent, 0.25)};
  border-radius: 9999px;
  font-weight: 600;
  color: ${theme.colors.accent};
  font-size: 0.9rem;
  position: relative;

  &:hover .currency-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

const GemSvg = styled.span`
  display: inline-flex;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;
    filter: drop-shadow(0 0 3px ${alpha(theme.colors.accent, 0.38)});
  }
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: ${theme.colors.bgHover};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.75rem;
  color: ${theme.colors.text};
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  z-index: 10;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${theme.colors.bgHover};
  }
`;

export function CurrencyDisplay({ amount }: { amount: number }) {
  return (
    <Container>
      <GemSvg>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 9l10 13L22 9 12 2z" fill="url(#gem-currency)" />
          <path d="M2 9h20M12 2l-4 7m4-7l4 7M8 9l4 13m0 0l4-13" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <defs>
            <linearGradient id="gem-currency" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor={theme.colors.accent} />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </GemSvg>
      <AnimatedCounter value={amount} color={theme.colors.accent} />
      <Tooltip className="currency-tooltip">Vos Gems</Tooltip>
    </Container>
  );
}
