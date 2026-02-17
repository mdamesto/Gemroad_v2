"use client";

import styled from "styled-components";
import { shimmer } from "@/lib/animations";
import { theme } from "@/lib/theme";

const SkeletonBase = styled.div<{ $width?: string; $height?: string; $radius?: string }>`
  background: linear-gradient(
    90deg,
    ${theme.colors.bgCard} 25%,
    ${theme.colors.bgHover} 50%,
    ${theme.colors.bgCard} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.8s ease-in-out infinite;
  border-radius: ${({ $radius }) => $radius || theme.radii.md};
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "20px"};
`;

export const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 280px;
  border-radius: ${theme.radii.lg};
`;

export const SkeletonText = styled(SkeletonBase)`
  height: 16px;
  margin-bottom: 8px;

  &:last-child {
    width: 60%;
  }
`;

export const SkeletonCircle = styled(SkeletonBase)`
  border-radius: 50%;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  padding: 20px;
`;

export function SkeletonCardGrid({ count = 8 }: { count?: number }) {
  return (
    <GridContainer>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </GridContainer>
  );
}

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 14px;
`;

export function LoadingState({ text = "Chargement..." }: { text?: string }) {
  return (
    <LoadingWrapper>
      <LoadingSpinner />
      <LoadingText>{text}</LoadingText>
    </LoadingWrapper>
  );
}
