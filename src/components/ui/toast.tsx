"use client";

import styled, { keyframes } from "styled-components";
import { useToastStore, type ToastType } from "@/stores/toast-store";
import { theme } from "@/lib/theme";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const shrink = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: 380px;
  width: calc(100vw - 48px);

  @media (max-width: 480px) {
    bottom: 16px;
    right: 16px;
    left: 16px;
    width: auto;
    max-width: none;
  }
`;

const typeColors: Record<ToastType, string> = {
  success: theme.colors.success,
  error: theme.colors.danger,
  info: theme.colors.primary,
};

const ToastItem = styled.div<{ $type: ToastType; $duration: number }>`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: ${theme.colors.glassBg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${({ $type }) => typeColors[$type]}40;
  border-radius: ${theme.radii.lg};
  color: ${theme.colors.text};
  font-size: 0.88rem;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${({ $type }) => typeColors[$type]}15;
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    border-color: ${({ $type }) => typeColors[$type]}70;
  }
`;

const ProgressBar = styled.div<{ $type: ToastType; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${({ $type }) => typeColors[$type]};
  border-radius: 0 0 ${theme.radii.lg} ${theme.radii.lg};
  animation: ${shrink} ${({ $duration }) => $duration}ms linear forwards;
`;

const IconCircle = styled.div<{ $type: ToastType }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $type }) => typeColors[$type]}20;
  border: 1px solid ${({ $type }) => typeColors[$type]}40;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const icons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2A9D8F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <Container>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          $type={toast.type}
          $duration={toast.duration}
          onClick={() => removeToast(toast.id)}
        >
          <IconCircle $type={toast.type}>{icons[toast.type]}</IconCircle>
          {toast.message}
          <ProgressBar $type={toast.type} $duration={toast.duration} />
        </ToastItem>
      ))}
    </Container>
  );
}
