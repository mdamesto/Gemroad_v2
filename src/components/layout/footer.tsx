"use client";

import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 24px;
  text-align: center;
  color: #8888aa;
  font-size: 0.8rem;
  border-top: 1px solid #2a2a35;
  margin-top: auto;
`;

export function Footer() {
  return (
    <FooterWrapper>
      GemRoad &copy; {new Date().getFullYear()} — Collectionnez, survivez.
    </FooterWrapper>
  );
}
