"use client";

import styled from "styled-components";
import { formatGems } from "@/lib/utils";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #1e293b;
  border: 1px solid #dbb45d40;
  border-radius: 9999px;
  font-weight: 600;
  color: #dbb45d;
  font-size: 0.9rem;
`;

const GemIcon = styled.span`
  font-size: 1rem;
`;

export function CurrencyDisplay({ amount }: { amount: number }) {
  return (
    <Container>
      <GemIcon>&#9670;</GemIcon>
      {formatGems(amount)}
    </Container>
  );
}
