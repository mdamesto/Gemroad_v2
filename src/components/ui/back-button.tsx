"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { theme, alpha } from "@/lib/theme";

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: none;
  border-radius: ${theme.radii.md};
  color: ${theme.colors.textMuted};
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
  }

  &:hover {
    color: ${theme.colors.text};
    background: var(--white-alpha-004);
    box-shadow: 0 0 12px ${alpha(theme.colors.primary, 0.08)};

    svg {
      transform: translateX(-2px);
    }
  }
`;

export function BackButton({ label = "Retour" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {label}
    </Button>
  );
}
