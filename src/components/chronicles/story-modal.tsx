"use client";

import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { theme, alpha } from "@/lib/theme";
import { fadeIn, scaleIn } from "@/lib/animations";
import { GlowButton } from "@/components/ui/glow-button";
import { formatGems } from "@/lib/utils";
import type { StoryNodeWithStatus } from "@/types/game";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

const Modal = styled.div`
  background: ${theme.colors.glassBg};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  max-width: 560px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  animation: ${scaleIn} 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: ${theme.colors.text}; }
`;

const NodeTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.4rem;
  color: ${theme.colors.text};
  margin-bottom: 20px;
`;

const typewriter = keyframes`
  from { max-height: 0; }
  to { max-height: 600px; }
`;

const NarrativeText = styled.div`
  font-size: 0.95rem;
  color: ${theme.colors.textMuted};
  line-height: 1.7;
  margin-bottom: 24px;
  overflow: hidden;
  animation: ${typewriter} 1.5s ease-out;
`;

const CardsRequired = styled.div`
  margin-bottom: 20px;
`;

const CardsLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.textMuted};
  margin-bottom: 8px;
`;

const CardChip = styled.span<{ $owned: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 6px;
  margin-bottom: 6px;
  background: ${({ $owned }) => $owned ? alpha(theme.colors.success, 0.12) : alpha(theme.colors.danger, 0.12)};
  color: ${({ $owned }) => $owned ? theme.colors.success : theme.colors.danger};
`;

const codexReveal = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CodexSection = styled.div`
  background: ${alpha(theme.colors.accent, 0.06)};
  border-left: 3px solid ${theme.colors.accent};
  border-radius: 0 12px 12px 0;
  padding: 16px;
  margin-bottom: 20px;
  animation: ${codexReveal} 0.5s ease-out 1s both;
`;

const CodexLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.accent};
  margin-bottom: 6px;
`;

const CodexText = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  line-height: 1.6;
  font-style: italic;
`;

const rewardPop = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const RewardsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  animation: ${rewardPop} 0.4s ease-out 0.8s both;
`;

const RewardBadge = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;
  background: ${({ $color }) => alpha($color, 0.1)};
  color: ${({ $color }) => $color};
  font-weight: 700;
  font-size: 0.9rem;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CloseAction = styled.button`
  padding: 10px 20px;
  border: 1px solid ${alpha(theme.colors.textMuted, 0.2)};
  border-radius: ${theme.radii.md};
  background: transparent;
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${alpha(theme.colors.textMuted, 0.08)};
    color: ${theme.colors.text};
  }
`;

interface StoryModalProps {
  node: StoryNodeWithStatus;
  onClose: () => void;
  onComplete: (nodeId: string) => Promise<{ gems: number; xp: number; codexEntry?: string } | null>;
}

export function StoryModal({ node, onClose, onComplete }: StoryModalProps) {
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState<{ gems: number; xp: number; codexEntry?: string } | null>(null);

  const handleComplete = async () => {
    setCompleting(true);
    const res = await onComplete(node.id);
    if (res) {
      setResult(res);
    }
    setCompleting(false);
  };

  const showRewards = result && (result.gems > 0 || result.xp > 0);
  const showCodex = result?.codexEntry || (node.completed && node.codex_entry);
  const codexText = result?.codexEntry || node.codex_entry;

  return (
    <Overlay onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal>
        <CloseBtn onClick={onClose}>&times;</CloseBtn>
        <NodeTitle>{node.title}</NodeTitle>
        <NarrativeText>{node.narrative_text}</NarrativeText>

        {(node.requiredCardNames.length > 0 || node.requiredAnyCardNames.length > 0) && (
          <CardsRequired>
            {node.requiredCardNames.length > 0 && (
              <>
                <CardsLabel>Cartes requises</CardsLabel>
                {node.requiredCardNames.map((name, i) => (
                  <CardChip key={i} $owned={node.canUnlock || node.completed}>
                    {name}
                  </CardChip>
                ))}
              </>
            )}
            {node.requiredAnyCardNames.length > 0 && (
              <>
                <CardsLabel>Au moins une de ces cartes</CardsLabel>
                {node.requiredAnyCardNames.map((name, i) => (
                  <CardChip key={i} $owned={node.canUnlock || node.completed}>
                    {name}
                  </CardChip>
                ))}
              </>
            )}
          </CardsRequired>
        )}

        {showCodex && (
          <CodexSection>
            <CodexLabel>Fragment de Lore Découvert</CodexLabel>
            <CodexText>{codexText}</CodexText>
          </CodexSection>
        )}

        {showRewards && (
          <RewardsRow>
            {result.gems > 0 && (
              <RewardBadge $color={theme.colors.accent}>
                +{formatGems(result.gems)} gemmes
              </RewardBadge>
            )}
            {result.xp > 0 && (
              <RewardBadge $color={theme.colors.primary}>
                +{result.xp} XP
              </RewardBadge>
            )}
          </RewardsRow>
        )}

        <ActionRow>
          {!node.completed && node.canUnlock && !result && (
            <GlowButton
              onClick={handleComplete}
              loading={completing}
              disabled={completing}
            >
              Continuer l&apos;aventure
            </GlowButton>
          )}
          {(node.completed || result) && (
            <CloseAction onClick={onClose}>
              Fermer
            </CloseAction>
          )}
        </ActionRow>
      </Modal>
    </Overlay>
  );
}
