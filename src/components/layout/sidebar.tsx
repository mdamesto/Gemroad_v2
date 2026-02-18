"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useUser } from "@/hooks/use-user";
import { theme, alpha } from "@/lib/theme";
import { fadeIn } from "@/lib/animations";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNotifications } from "@/hooks/use-notifications";

const Overlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${(p) => (p.$open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 60;
    animation: ${fadeIn} 0.2s ease;
  }
`;

const Panel = styled.aside<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100%;
    background: ${theme.colors.glassBg};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-left: none;
    box-shadow: -4px 0 20px ${alpha(theme.colors.primary, 0.08)}, -1px 0 0 ${alpha(theme.colors.primary, 0.1)};
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
  color: ${theme.colors.textMuted};
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.text};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  margin-bottom: 8px;
  border-bottom: none;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1rem;
  text-transform: uppercase;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  color: ${theme.colors.text};
  font-weight: 600;
  font-size: 0.95rem;
`;

const UserLevel = styled.span`
  color: ${theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 500;
`;

const ThemeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 0;
  margin-bottom: 4px;
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
`;

const SidebarNav = styled.nav`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SidebarLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${({ $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  text-decoration: none;
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? alpha(theme.colors.primary, 0.08) : "transparent")};
  border-left: 3px solid ${({ $active }) => ($active ? theme.colors.primary : "transparent")};

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${theme.colors.bgHover};
    color: ${theme.colors.text};
  }
`;

const NotifDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #EF4444;
  position: absolute;
  top: 10px;
  right: 10px;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
`;

const sidebarItems = [
  { href: "/dashboard", label: "Accueil", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )},
  { href: "/collection", label: "Collection", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )},
  { href: "/boosters", label: "Boosters", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )},
  { href: "/daily-reward", label: "Quotidien", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )},
  { href: "/missions", label: "Missions", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /><line x1="9" y1="11" x2="13" y2="11" />
    </svg>
  )},
  { href: "/chronicles", label: "Chroniques", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /><path d="M12 7l0 0" /><circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )},
  { href: "/world-map", label: "Carte du Monde", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )},
  { href: "/factions", label: "Factions", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )},
  { href: "/events", label: "Événements", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )},
  { href: "/fusion", label: "Fusion", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 12l4-4 4 4" /><path d="M12 16V8" />
    </svg>
  )},
  { href: "/series", label: "Séries", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )},
  { href: "/achievements", label: "Trophées", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V9" /><path d="M14 22V9" /><rect x="6" y="2" width="12" height="7" rx="1" />
    </svg>
  )},
  { href: "/leaderboard", label: "Classement", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )},
  { href: "/progression", label: "Progression", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )},
  { href: "/shop", label: "Boutique", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )},
  { href: "/profile", label: "Profil", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )},
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useGameStore();
  const { profile } = useUser();
  const pathname = usePathname();
  const { badgeMap } = useNotifications();

  const close = () => setSidebarOpen(false);

  return (
    <>
      <Overlay $open={sidebarOpen} onClick={close} />
      <Panel $open={sidebarOpen}>
        <CloseButton onClick={close}>&times;</CloseButton>

        {profile && (
          <UserSection>
            <UserAvatar>{profile.username?.charAt(0) || "?"}</UserAvatar>
            <UserInfo>
              <UserName>{profile.username}</UserName>
              <UserLevel>Niveau {profile.level || 1}</UserLevel>
            </UserInfo>
          </UserSection>
        )}

        <ThemeRow>
          <ThemeToggle />
          <span>Changer le thème</span>
        </ThemeRow>

        <SidebarNav>
          {sidebarItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              $active={pathname === item.href || pathname.startsWith(item.href + "/")}
              prefetch={false}
              onClick={close}
              style={{ position: "relative" }}
            >
              {item.icon}
              {item.label}
              {badgeMap[item.href] && <NotifDot />}
            </SidebarLink>
          ))}
        </SidebarNav>
      </Panel>
    </>
  );
}
