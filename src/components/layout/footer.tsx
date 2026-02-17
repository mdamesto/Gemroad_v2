"use client";

import styled from "styled-components";

const FooterWrapper = styled.footer`
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
  border-top: 1px solid #1e293b;
  margin-top: auto;
`;

export function Footer() {
  return (
    <FooterWrapper>
      GemRoad &copy; {new Date().getFullYear()} — Collectionnez, survivez.
    </FooterWrapper>
  );
}
