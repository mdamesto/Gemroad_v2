"use client";

import styled from "styled-components";
import { theme, alpha } from "@/lib/theme";
import { floatY, fadeInUp } from "@/lib/animations";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  animation: ${fadeInUp} 0.5s ease-out;
`;

const IllustrationWrapper = styled.div`
  margin-bottom: 24px;
  animation: ${floatY} 3s ease-in-out infinite;

  svg {
    width: 120px;
    height: 120px;
    opacity: 0.6;
  }
`;

const Title = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.textMuted};
  line-height: 1.5;
  max-width: 360px;
  margin-bottom: 20px;
`;

const ChestSvg = () => (
  <svg viewBox="0 0 120 120" fill="none">
    <rect x="20" y="50" width="80" height="50" rx="8" fill={theme.colors.bgHover} stroke={theme.colors.border} strokeWidth="2" />
    <path d="M20 58a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v2H20v-2z" fill={theme.colors.border} />
    <rect x="52" y="65" width="16" height="12" rx="3" fill={alpha(theme.colors.accent, 0.25)} stroke={theme.colors.accent} strokeWidth="1.5" />
    <path d="M30 50 L40 30 L80 30 L90 50" stroke={theme.colors.border} strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="60" cy="30" r="4" fill={alpha(theme.colors.accent, 0.19)} stroke={theme.colors.accent} strokeWidth="1" />
  </svg>
);

const CardsSvg = () => (
  <svg viewBox="0 0 120 120" fill="none">
    <rect x="25" y="25" width="50" height="70" rx="6" fill={theme.colors.bgHover} stroke={theme.colors.border} strokeWidth="2" transform="rotate(-8 50 60)" />
    <rect x="35" y="20" width="50" height="70" rx="6" fill={theme.colors.bgCard} stroke={theme.colors.border} strokeWidth="2" transform="rotate(4 60 55)" />
    <circle cx="60" cy="50" r="10" fill="none" stroke={alpha(theme.colors.primary, 0.25)} strokeWidth="1.5" />
    <text x="60" y="55" textAnchor="middle" fill={theme.colors.textMuted} fontSize="12">?</text>
  </svg>
);

const illustrations: Record<string, React.ReactNode> = {
  chest: <ChestSvg />,
  cards: <CardsSvg />,
};

interface EmptyStateProps {
  illustration?: "chest" | "cards";
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ illustration = "chest", title, subtitle, action }: EmptyStateProps) {
  return (
    <Container>
      <IllustrationWrapper>
        {illustrations[illustration]}
      </IllustrationWrapper>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {action}
    </Container>
  );
}
