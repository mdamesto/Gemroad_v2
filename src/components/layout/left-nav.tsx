"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { theme, alpha } from "@/lib/theme";
import { useNotifications } from "@/hooks/use-notifications";

const Aside = styled.aside`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 220px;
  background: ${alpha(theme.colors.bg, 0.92)};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 40;
  overflow-y: auto;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  scrollbar-width: thin;
  scrollbar-color: ${alpha(theme.colors.primary, 0.15)} transparent;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: ${theme.gradients.separator};
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const GroupLabel = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textMuted};
  padding: 12px 12px 4px;
  opacity: 0.6;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: ${theme.radii.md};
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  background: ${({ $active }) => ($active ? alpha(theme.colors.primary, 0.1) : "transparent")};
  border-left: 2px solid ${({ $active }) => ($active ? theme.colors.primary : "transparent")};
  transition: all 0.2s;
  position: relative;

  svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0.55)};
    transition: opacity 0.2s;
  }

  &:hover {
    background: ${theme.colors.bgHover};
    color: ${theme.colors.text};
    svg { opacity: 1; }
  }
`;

const Badge = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #EF4444;
  position: absolute;
  top: 8px;
  right: 8px;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
`;

/* ── Icon defs (reused from navbar/sidebar) ── */

const icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  collection: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  boosters: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  series: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  daily: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  missions: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  achievements: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V9" /><path d="M14 22V9" /><rect x="6" y="2" width="12" height="7" rx="1" />
    </svg>
  ),
  progression: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  fusion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 12l4-4 4 4" /><path d="M12 16V8" />
    </svg>
  ),
  events: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  leaderboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

interface NavEntry {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const gameplayItems: NavEntry[] = [
  { href: "/dashboard", label: "Accueil", icon: icons.home },
  { href: "/collection", label: "Collection", icon: icons.collection },
  { href: "/boosters", label: "Boosters", icon: icons.boosters },
  { href: "/series", label: "Séries", icon: icons.series },
  { href: "/fusion", label: "Fusion", icon: icons.fusion },
  { href: "/shop", label: "Boutique", icon: icons.shop },
];

const progressItems: NavEntry[] = [
  { href: "/daily-reward", label: "Quotidien", icon: icons.daily },
  { href: "/missions", label: "Missions", icon: icons.missions },
  { href: "/events", label: "Événements", icon: icons.events },
  { href: "/achievements", label: "Trophées", icon: icons.achievements },
  { href: "/progression", label: "Progression", icon: icons.progression },
  { href: "/leaderboard", label: "Classement", icon: icons.leaderboard },
];

const accountItems: NavEntry[] = [
  { href: "/profile", label: "Profil", icon: icons.profile },
];

export function LeftNav() {
  const { user } = useUser();
  const pathname = usePathname();
  const { badgeMap } = useNotifications();

  if (!user) return null;

  const renderItems = (items: NavEntry[]) =>
    items.map((item) => (
      <NavItem
        key={item.href}
        href={item.href}
        $active={pathname === item.href || pathname.startsWith(item.href + "/")}
        prefetch={false}
      >
        {item.icon}
        {item.label}
        {badgeMap[item.href] && <Badge />}
      </NavItem>
    ));

  return (
    <Aside>
      <GroupLabel>Jeu</GroupLabel>
      {renderItems(gameplayItems)}
      <GroupLabel>Progression</GroupLabel>
      {renderItems(progressItems)}
      <GroupLabel>Compte</GroupLabel>
      {renderItems(accountItems)}
    </Aside>
  );
}
