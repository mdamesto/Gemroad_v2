"use client";

import styled from "styled-components";
import { theme } from "@/lib/theme";

const FooterWrapper = styled.footer`
  margin-top: auto;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(var(--c-primary), 0.4), rgba(var(--c-accent), 0.4), transparent);
    box-shadow: 0 0 12px rgba(var(--c-primary), 0.15);
  }

  position: relative;
`;

const Branding = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LogoText = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  color: ${theme.colors.textMuted};
  letter-spacing: 0.04em;
`;

const Tagline = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.textMuted};
  opacity: 0.6;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.8rem;
  color: ${theme.colors.textMuted};
  opacity: 0.6;
`;

export function Footer() {
  return (
    <FooterWrapper>
      <Branding>
        <LogoText>GemRoad</LogoText>
        <Tagline>Collectionnez, survivez.</Tagline>
      </Branding>
      <Links>
        <span>&copy; {new Date().getFullYear()}</span>
      </Links>
    </FooterWrapper>
  );
}
