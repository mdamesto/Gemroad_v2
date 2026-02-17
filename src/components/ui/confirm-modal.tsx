"use client";

import { useEffect, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { GlowButton } from "@/components/ui/glow-button";
import { theme } from "@/lib/theme";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Panel = styled.div`
  background: ${theme.colors.glassBg};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${theme.colors.glassBorder};
  border-radius: ${theme.radii.xl};
  padding: 32px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  animation: ${scaleIn} 0.25s ease-out;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.textMuted};
  line-height: 1.5;
  margin-bottom: 24px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  color: ${theme.colors.textMuted};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${theme.colors.text};
    border-color: ${theme.colors.text};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "accent" | "success" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "primary",
  loading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
      // Focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled])"
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [loading, onCancel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    // Focus first button
    const btn = panelRef.current?.querySelector<HTMLElement>("button");
    btn?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Overlay onClick={() => !loading && onCancel()}>
      <Panel ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <ButtonRow>
          <CancelButton onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </CancelButton>
          <GlowButton
            $variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </GlowButton>
        </ButtonRow>
      </Panel>
    </Overlay>
  );
}
