"use client";

import styled, { keyframes } from "styled-components";

const drift1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -20px) scale(1.1); }
  50% { transform: translate(-10px, -40px) scale(0.9); }
  75% { transform: translate(-30px, -10px) scale(1.05); }
`;

const drift2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-20px, 30px) scale(0.95); }
  50% { transform: translate(30px, 10px) scale(1.1); }
  75% { transform: translate(10px, -20px) scale(1); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const Orb = styled.div<{ $color: string; $size: number; $x: string; $y: string; $delay: number; $variant: 1 | 2 }>`
  position: absolute;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: radial-gradient(circle, ${(p) => p.$color}12 0%, transparent 70%);
  left: ${(p) => p.$x};
  top: ${(p) => p.$y};
  animation: ${(p) => (p.$variant === 1 ? drift1 : drift2)} ${(p) => 20 + p.$delay * 5}s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay}s;
  will-change: transform;
`;

const orbs = [
  { color: "#38BDF8", size: 300, x: "10%", y: "20%", delay: 0, variant: 1 as const },
  { color: "#A78BFA", size: 250, x: "70%", y: "10%", delay: 3, variant: 2 as const },
  { color: "#DBB45D", size: 200, x: "50%", y: "60%", delay: 6, variant: 1 as const },
  { color: "#2A9D8F", size: 180, x: "20%", y: "70%", delay: 9, variant: 2 as const },
  { color: "#38BDF8", size: 150, x: "80%", y: "80%", delay: 4, variant: 1 as const },
];

export function AmbientBackground() {
  return (
    <Container>
      {orbs.map((orb, i) => (
        <Orb
          key={i}
          $color={orb.color}
          $size={orb.size}
          $x={orb.x}
          $y={orb.y}
          $delay={orb.delay}
          $variant={orb.variant}
        />
      ))}
    </Container>
  );
}
