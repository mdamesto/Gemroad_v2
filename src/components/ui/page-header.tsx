"use client";

import styled from "styled-components";
import { theme } from "@/lib/theme";
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
    background: ${theme.gradients.mesh};
    pointer-events: none;
  }
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: ${theme.colors.text};
  margin-bottom: 8px;
  position: relative;
  letter-spacing: 1px;

  background: linear-gradient(135deg, ${theme.colors.text}, ${theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 1rem;
  position: relative;
  max-width: 500px;
  margin: 0 auto;
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
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children && <ChildrenRow>{children}</ChildrenRow>}
    </HeaderWrapper>
  );
}
