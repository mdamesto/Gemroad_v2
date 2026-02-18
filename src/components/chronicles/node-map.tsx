"use client";

import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { StoryModal } from "./story-modal";
import type { StoryChapterWithNodes, StoryNodeWithStatus } from "@/types/game";

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 8px ${alpha(theme.colors.accent, 0.4)}, 0 0 16px ${alpha(theme.colors.accent, 0.2)}; }
  50% { box-shadow: 0 0 16px ${alpha(theme.colors.accent, 0.6)}, 0 0 32px ${alpha(theme.colors.accent, 0.3)}; }
`;

const MapContainer = styled.div`
  animation: ${fadeInUp} 0.5s ease-out;
`;

const ChapterSection = styled.div`
  margin-bottom: 40px;
`;

const ChapterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${alpha(theme.colors.primary, 0.1)};
`;

const ChapterName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  color: ${theme.colors.text};
`;

const ChapterProgress = styled.span`
  font-size: 0.8rem;
  font-family: ${theme.fonts.mono};
  color: ${theme.colors.textMuted};
`;

const NodesGrid = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px 0;
`;

const NodeWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ConnectorLine = styled.div`
  position: absolute;
  top: 50%;
  right: 100%;
  width: 16px;
  height: 2px;
  background: ${alpha(theme.colors.primary, 0.2)};
  transform: translateY(-50%);
`;

const NodeCircle = styled.button<{ $state: "locked" | "unlockable" | "completed" }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid ${({ $state }) => {
    switch ($state) {
      case "completed": return theme.colors.success;
      case "unlockable": return theme.colors.accent;
      default: return alpha(theme.colors.textMuted, 0.3);
    }
  }};
  background: ${({ $state }) => {
    switch ($state) {
      case "completed": return alpha(theme.colors.success, 0.12);
      case "unlockable": return alpha(theme.colors.accent, 0.08);
      default: return alpha(theme.colors.textMuted, 0.05);
    }
  }};
  cursor: ${({ $state }) => ($state === "locked" ? "default" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  position: relative;

  ${({ $state }) => $state === "unlockable" && `
    animation: ${glowPulse} 2s ease-in-out infinite;
  `}

  &:hover {
    ${({ $state }) => $state !== "locked" && `
      transform: scale(1.1);
    `}
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${({ $state }) => {
      switch ($state) {
        case "completed": return theme.colors.success;
        case "unlockable": return theme.colors.accent;
        default: return alpha(theme.colors.textMuted, 0.4);
      }
    }};
  }
`;

const ChoiceBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: white;
`;

const NodeLabel = styled.div<{ $state: "locked" | "unlockable" | "completed" }>`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ $state }) => {
    switch ($state) {
      case "completed": return theme.colors.text;
      case "unlockable": return theme.colors.accent;
      default: return alpha(theme.colors.textMuted, 0.5);
    }
  }};
  text-align: center;
  max-width: 90px;
  line-height: 1.3;
`;

const RewardHint = styled.div`
  font-size: 0.65rem;
  color: ${theme.colors.accent};
  font-weight: 600;
`;

const ChoiceGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const ChoiceRow = styled.div`
  display: flex;
  gap: 20px;
`;

const BranchLine = styled.div<{ $side: "top" | "bottom" }>`
  position: absolute;
  left: -10px;
  ${({ $side }) => $side === "top" ? "bottom: 50%;" : "top: 50%;"}
  width: 10px;
  height: 20px;
  border: 2px solid ${alpha(theme.colors.primary, 0.15)};
  border-right: none;
  ${({ $side }) => $side === "top" ? "border-bottom: none; border-radius: 8px 0 0 0;" : "border-top: none; border-radius: 0 0 0 8px;"}
`;

// Icons
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

interface NodeMapProps {
  chapters: StoryChapterWithNodes[];
  onCompleteNode: (nodeId: string) => Promise<{ gems: number; xp: number; codexEntry?: string } | null>;
}

export function NodeMap({ chapters, onCompleteNode }: NodeMapProps) {
  const [selectedNode, setSelectedNode] = useState<StoryNodeWithStatus | null>(null);

  const getNodeState = (node: StoryNodeWithStatus): "locked" | "unlockable" | "completed" => {
    if (node.completed) return "completed";
    if (node.canUnlock) return "unlockable";
    return "locked";
  };

  const handleNodeClick = (node: StoryNodeWithStatus) => {
    const state = getNodeState(node);
    if (state !== "locked") {
      setSelectedNode(node);
    }
  };

  const renderNode = (node: StoryNodeWithStatus, showConnector: boolean) => {
    const state = getNodeState(node);
    const hasReward = (node.reward_gems > 0 || node.reward_xp > 0);

    return (
      <NodeWrapper key={node.id}>
        {showConnector && <ConnectorLine />}
        <NodeCircle $state={state} onClick={() => handleNodeClick(node)}>
          {state === "locked" && <LockIcon />}
          {state === "completed" && <CheckIcon />}
          {state === "unlockable" && <StarIcon />}
          {node.is_choice && <ChoiceBadge>?</ChoiceBadge>}
        </NodeCircle>
        <NodeLabel $state={state}>{node.title}</NodeLabel>
        {hasReward && state !== "locked" && (
          <RewardHint>{node.reward_gems > 0 ? `${node.reward_gems}g` : ""} {node.reward_xp > 0 ? `${node.reward_xp}xp` : ""}</RewardHint>
        )}
      </NodeWrapper>
    );
  };

  return (
    <MapContainer>
      {chapters.map((chapter) => {
        // Organize nodes: find root nodes, choice pairs, etc.
        const rootNodes = chapter.nodes.filter((n) => !n.parent_node_id || !chapter.nodes.find((cn) => cn.id === n.parent_node_id));
        const choiceGroups = new Map<string, StoryNodeWithStatus[]>();
        const nonChoiceNodes: StoryNodeWithStatus[] = [];

        for (const node of chapter.nodes) {
          if (node.is_choice && node.parent_node_id) {
            const group = choiceGroups.get(node.parent_node_id) || [];
            group.push(node);
            choiceGroups.set(node.parent_node_id, group);
          }
        }

        // Build sequential flow
        const orderedNodes: (StoryNodeWithStatus | StoryNodeWithStatus[])[] = [];
        const processed = new Set<string>();

        const addNode = (node: StoryNodeWithStatus) => {
          if (processed.has(node.id)) return;
          processed.add(node.id);

          // Check if this node has choice children
          const choices = choiceGroups.get(node.id);
          orderedNodes.push(node);

          if (choices) {
            orderedNodes.push(choices);
            choices.forEach((c) => processed.add(c.id));

            // Find convergence node (child of one of the choices that isn't a choice)
            const convergence = chapter.nodes.find(
              (n) => !n.is_choice && n.parent_node_id && choices.some((c) => c.id === n.parent_node_id)
            );
            if (convergence) {
              addNode(convergence);
            }
          } else {
            // Find next sequential node
            const next = chapter.nodes.find(
              (n) => n.parent_node_id === node.id && !n.is_choice
            );
            if (next) addNode(next);
          }
        };

        // Start from root nodes
        for (const root of rootNodes) {
          if (!processed.has(root.id)) {
            addNode(root);
          }
        }

        // Add any remaining nodes not yet processed
        for (const node of chapter.nodes) {
          if (!processed.has(node.id)) {
            orderedNodes.push(node);
            processed.add(node.id);
          }
        }

        return (
          <ChapterSection key={chapter.id}>
            <ChapterHeader>
              <ChapterName>{chapter.name}</ChapterName>
              <ChapterProgress>{chapter.completedCount}/{chapter.totalCount}</ChapterProgress>
            </ChapterHeader>
            <NodesGrid>
              {orderedNodes.map((item, idx) => {
                if (Array.isArray(item)) {
                  // Choice group
                  return (
                    <ChoiceGroup key={`choice-${idx}`}>
                      <ChoiceRow>
                        {item.map((choiceNode, ci) => (
                          <div key={choiceNode.id} style={{ position: "relative" }}>
                            {ci === 0 && <BranchLine $side="top" />}
                            {ci === 1 && <BranchLine $side="bottom" />}
                            {renderNode(choiceNode, false)}
                          </div>
                        ))}
                      </ChoiceRow>
                    </ChoiceGroup>
                  );
                }
                return renderNode(item, idx > 0);
              })}
            </NodesGrid>
          </ChapterSection>
        );
      })}

      {selectedNode && (
        <StoryModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onComplete={async (nodeId) => {
            const result = await onCompleteNode(nodeId);
            if (result) {
              setSelectedNode(null);
            }
            return result;
          }}
        />
      )}
    </MapContainer>
  );
}
