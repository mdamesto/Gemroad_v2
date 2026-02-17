"use client";

import styled from "styled-components";
import Link from "next/link";
import { useGameStore } from "@/stores/game-store";

const Overlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${(p) => (p.$open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 60;
  }
`;

const Panel = styled.aside<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100%;
    background: #12121a;
    border-left: 1px solid #2a2a35;
    z-index: 70;
    transform: translateX(${(p) => (p.$open ? "0" : "100%")});
    transition: transform 0.3s ease;
    padding: 24px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #8888aa;
  font-size: 1.5rem;
  cursor: pointer;
`;

const SidebarLink = styled(Link)`
  display: block;
  padding: 14px 16px;
  color: #e5e5e5;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #1a1a25;
  }
`;

const SidebarNav = styled.nav`
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useGameStore();

  const close = () => setSidebarOpen(false);

  return (
    <>
      <Overlay $open={sidebarOpen} onClick={close} />
      <Panel $open={sidebarOpen}>
        <CloseButton onClick={close}>&times;</CloseButton>
        <SidebarNav>
          <SidebarLink href="/collection" onClick={close}>
            Collection
          </SidebarLink>
          <SidebarLink href="/boosters" onClick={close}>
            Boosters
          </SidebarLink>
          <SidebarLink href="/series" onClick={close}>
            Séries
          </SidebarLink>
          <SidebarLink href="/achievements" onClick={close}>
            Achievements
          </SidebarLink>
          <SidebarLink href="/progression" onClick={close}>
            Progression
          </SidebarLink>
          <SidebarLink href="/shop" onClick={close}>
            Boutique
          </SidebarLink>
          <SidebarLink href="/profile" onClick={close}>
            Profil
          </SidebarLink>
        </SidebarNav>
      </Panel>
    </>
  );
}
