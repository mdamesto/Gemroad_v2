"use client";

import styled from "styled-components";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";

const HeaderWrapper = styled.div`
  position: relative;
  padding: 40px 20px 30px;
  text-align: center;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(var(--c-primary), 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(167, 139, 250, 0.10) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(var(--c-accent), 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: ${theme.colors.text};
  margin-bottom: 8px;
  position: relative;
  letter-spacing: 0.02em;
  display: inline-block;

  background: linear-gradient(135deg, ${theme.colors.text}, ${theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  &::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 10%;
    right: 10%;
    height: 2px;
    border-radius: 1px;
    background: linear-gradient(90deg, transparent, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.primary}, transparent);
  }
`;

const DecoLine = styled.div`
  width: 40px;
  height: 2px;
  margin: 20px auto 0;
  border-radius: 1px;
  background: linear-gradient(90deg, ${alpha(theme.colors.primary, 0.38)}, ${alpha(theme.colors.accent, 0.38)});
  opacity: 0.5;
`;

const Subtitle = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 1rem;
  position: relative;
  max-width: 500px;
  margin: 16px auto 0;
`;

const ChildrenRow = styled.div`
  position: relative;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <HeaderWrapper>
      <Title>{title}</Title>
      <DecoLine />
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children && <ChildrenRow>{children}</ChildrenRow>}
    </HeaderWrapper>
  );
}
