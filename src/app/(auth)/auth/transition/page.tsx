"use client";

import { Suspense, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";

const epicFlash = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const epicTextIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.05); }
`;

const TransitionOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at 50% 30%,
    rgba(15, 23, 42, 0.9),
    #020617
  );
`;

const TransitionVideo = styled.video<{ $letterbox?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: ${({ $letterbox }) => ($letterbox ? "contain" : "cover")};
  background: black;
`;

const EpicOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const EpicFlash = styled.div`
  position: absolute;
  inset: 0;
  background: white;
  animation: ${epicFlash} 0.6s ease-out forwards;
`;

const EpicText = styled.h2`
  font-family: var(--font-cinzel), "Cinzel", serif;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-align: center;

  background: linear-gradient(
    90deg,
    #c5ccd5 0%,
    #ffffff 45%,
    #f8f3da 58%,
    #dbb45d 100%
  );
  -webkit-background-clip: text;
  color: transparent;

  filter:
    drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))
    drop-shadow(0 0 20px rgba(219, 180, 93, 0.3));

  animation: ${epicTextIn} 2.3s ease-in-out forwards;
`;

const SoundToggleButton = styled.button`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 80;
  border: none;
  border-radius: 999px;
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  background: rgba(15, 23, 42, 0.7);
  color: #e5e7eb;
  font-size: 0.8rem;
  cursor: pointer;

  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.7);

  transition:
    background 0.15s ease,
    transform 0.12s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: rgba(15, 23, 42, 0.9);
    transform: translateY(-1px);
  }

  span.icon { font-size: 1rem; }
`;

function TransitionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = searchParams.get("signup") === "true";

  const [currentPhase, setCurrentPhase] = useState<
    "transition" | "lore" | "epic"
  >("transition");
  const [isMuted, setIsMuted] = useState(true);

  const startEpicReveal = () => {
    setCurrentPhase("epic");
    setTimeout(() => {
      router.push("/collection");
    }, 2500);
  };

  const handleTransitionEnd = () => {
    if (isSignup) {
      const loreSeen = localStorage.getItem("gemroad_lore_seen");
      if (loreSeen) {
        startEpicReveal();
      } else {
        setCurrentPhase("lore");
      }
    } else {
      startEpicReveal();
    }
  };

  const handleLoreEnd = () => {
    localStorage.setItem("gemroad_lore_seen", "true");
    startEpicReveal();
  };

  // Fallback: if something goes wrong, redirect after 30s
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/collection");
    }, 30000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <>
      {currentPhase === "transition" && (
        <TransitionOverlay>
          <TransitionVideo
            src="/videos/login_transition.mp4"
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleTransitionEnd}
            onError={() => router.push("/collection")}
          />
        </TransitionOverlay>
      )}

      {currentPhase === "lore" && (
        <TransitionOverlay>
          <TransitionVideo
            src="/videos/intro_lore.mp4"
            $letterbox
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleLoreEnd}
            onError={() => {
              localStorage.setItem("gemroad_lore_seen", "true");
              router.push("/collection");
            }}
          />
        </TransitionOverlay>
      )}

      {currentPhase === "epic" && (
        <EpicOverlay>
          <EpicFlash />
          <EpicText>Bienvenue, Survivant</EpicText>
        </EpicOverlay>
      )}

      <SoundToggleButton
        type="button"
        onClick={() => setIsMuted((prev) => !prev)}
      >
        <span className="icon">{isMuted ? "\u{1F507}" : "\u{1F50A}"}</span>
        <span>{isMuted ? "Son coupé" : "Son activé"}</span>
      </SoundToggleButton>
    </>
  );
}

export default function AuthTransitionPage() {
  return (
    <Suspense fallback={<TransitionOverlay><div /></TransitionOverlay>}>
      <TransitionContent />
    </Suspense>
  );
}
