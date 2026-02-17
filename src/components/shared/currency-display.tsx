"use client";

import styled from "styled-components";
import { formatGems } from "@/lib/utils";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #1a1a25;
  border: 1px solid #f4a26140;
  border-radius: 9999px;
  font-weight: 600;
  color: #f4a261;
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
