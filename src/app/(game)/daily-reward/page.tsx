"use client";

import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useDailyReward } from "@/hooks/use-daily-reward";
import { GlowButton } from "@/components/ui/glow-button";

import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/skeleton-loader";
import { useToastStore } from "@/stores/toast-store";
import { theme, alpha } from "@/lib/theme";
import { formatGems } from "@/lib/utils";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const StreakInfo = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
`;

const StreakValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StreakLabel = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
`;

const Countdown = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  text-align: right;
`;

const CountdownValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${theme.colors.primary};
  font-family: ${theme.fonts.mono};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DayCard = styled.div<{ $claimed: boolean; $current: boolean; $locked: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 16px;
  background: ${(p) =>
    p.$claimed
      ? alpha(theme.colors.success, 0.08)
      : p.$current
        ? alpha(theme.colors.accent, 0.08)
        : theme.colors.bgCard};
  border: 2px solid ${(p) =>
    p.$claimed
      ? alpha(theme.colors.success, 0.3)
      : p.$current
        ? alpha(theme.colors.accent, 0.3)
        : "transparent"};
  box-shadow: 0 2px 8px rgba(var(--shadow-base), 0.2);
  transition: all 0.3s;
  animation: ${fadeIn} 0.3s ease-out;

  ${(p) =>
    p.$current &&
    css`
      animation: ${pulse} 2s ease-in-out infinite;
    `}

  ${(p) =>
    p.$locked &&
    css`
      opacity: 0.5;
    `}
`;

const DayLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
`;

const DayIcon = styled.div<{ $claimed: boolean }>`
  font-size: 1.8rem;
  ${(p) =>
    p.$claimed &&
    css`
      filter: saturate(1.2);
    `}
`;

const DayGems = styled.div<{ $current: boolean }>`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(p) => (p.$current ? theme.colors.accent : theme.colors.text)};
`;

const CheckMark = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${theme.colors.success};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
`;

const ClaimSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
  background: ${theme.colors.bgCard};
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(var(--shadow-base), 0.25);
`;

const RewardPreview = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 8px;
`;

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function DailyRewardPage() {
  const { canClaim, currentStreak, nextReward, msUntilReset, schedule, loading, claiming, claim } = useDailyReward();
  const addToast = useToastStore((s) => s.addToast);
  const [countdown, setCountdown] = useState(msUntilReset);

  useEffect(() => {
    setCountdown(msUntilReset);
  }, [msUntilReset]);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleClaim = async () => {
    const result = await claim();
    if (result) {
      addToast(`+${formatGems(result.gemsEarned)} gemmes ! Série de ${result.streak} jour(s)`, "success");
    }
  };

  if (loading) return <LoadingState text="Chargement..." />;

  return (
    <Page>
      <StreakInfo>
        <div>
          <StreakValue>
            {currentStreak}
          </StreakValue>
          <StreakLabel>Jours consécutifs</StreakLabel>
        </div>
        <Countdown>
          <div>Prochaine récompense dans</div>
          <CountdownValue>{canClaim ? "Disponible !" : formatCountdown(countdown)}</CountdownValue>
        </Countdown>
      </StreakInfo>

      <Grid>
        {schedule.map((day) => (
          <DayCard
            key={day.day}
            $claimed={day.claimed}
            $current={day.current}
            $locked={!day.claimed && !day.current}
          >
            {day.claimed && <CheckMark>✓</CheckMark>}
            <DayLabel>Jour {day.day}</DayLabel>
            <DayIcon $claimed={day.claimed}>
              {day.claimed ? "✅" : day.current ? "🎁" : "📦"}
            </DayIcon>
            <DayGems $current={day.current}>
              {formatGems(day.gems)} ◆
            </DayGems>
          </DayCard>
        ))}
      </Grid>

      <ClaimSection>
        {canClaim ? (
          <>
            <RewardPreview>
              🎁 {formatGems(nextReward)} gemmes
            </RewardPreview>
            <GlowButton
              $variant="accent"
              $size="lg"
              onClick={handleClaim}
              loading={claiming}
              disabled={claiming}
            >
              Réclamer la récompense
            </GlowButton>
          </>
        ) : (
          <div style={{ color: theme.colors.textMuted, textAlign: "center" }}>
            <p style={{ fontSize: "1rem", fontWeight: 600 }}>
              Récompense déjà réclamée aujourd&apos;hui !
            </p>
            <p style={{ fontSize: "0.85rem", marginTop: 8 }}>
              Reviens demain pour continuer ta série.
            </p>
          </div>
        )}
      </ClaimSection>
    </Page>
  );
}
