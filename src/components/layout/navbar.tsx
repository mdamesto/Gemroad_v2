"use client";

import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { useGameStore } from "@/stores/game-store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { theme, alpha } from "@/lib/theme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNotifications } from "@/hooks/use-notifications";

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background: ${alpha(theme.colors.bg, 0.85)};
  border-bottom: none;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${theme.gradients.separator};
    box-shadow: 0 1px 8px ${alpha(theme.colors.primary, 0.1)};
  }
`;

const Logo = styled(Link)`
  font-family: ${theme.fonts.heading};
  font-size: 1.4rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 8px;

  background: var(--logo-gradient);
  -webkit-background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.15));
`;

const GemIcon = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1rem;

  svg {
    width: 22px;
    height: 22px;
    filter: drop-shadow(0 0 4px ${alpha(theme.colors.accent, 0.38)});
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  position: relative;
  padding: 8px 14px;
  color: ${({ $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
    opacity: ${({ $active }) => ($active ? 1 : 0.6)};
    transition: opacity 0.2s;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ $active }) => ($active ? "60%" : "0")};
    height: 2px;
    background: ${theme.gradients.primary};
    border-radius: 1px;
    transition: width 0.3s ease;
    box-shadow: ${({ $active }) => ($active ? `0 0 8px ${alpha(theme.colors.primary, 0.38)}` : "none")};
  }

  &:hover {
    color: ${theme.colors.text};

    svg { opacity: 1; }

    &::after {
      width: 40%;
    }
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const AuthButton = styled(Link)`
  padding: 8px 20px;
  background: ${theme.gradients.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    box-shadow: ${theme.shadows.glow(theme.colors.primary)};
  }
`;

const LogoutButton = styled.button`
  padding: 8px 14px;
  background: none;
  border: none;
  color: ${theme.colors.textMuted};
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s, box-shadow 0.2s;
  box-shadow: inset 0 0 0 1px var(--white-alpha-006);

  &:hover {
    color: ${theme.colors.text};
    box-shadow: inset 0 0 0 1px var(--white-alpha-012);
  }
`;

const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.accent};
  }
`;

const Avatar = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${theme.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  border: 2px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;

  ${ProfileLink}:hover & {
    border-color: ${alpha(theme.colors.primary, 0.5)};
    box-shadow: 0 0 10px ${alpha(theme.colors.primary, 0.25)};
  }
`;

const NavNotifDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #EF4444;
  position: absolute;
  top: 4px;
  right: 4px;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
`;

const navItems = [
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
  { href: "/progression", label: "Progression", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )},
  { href: "/missions", label: "Missions", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  )},
  { href: "/fusion", label: "Fusion", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 12l4-4 4 4" /><path d="M12 16V8" />
    </svg>
  )},
  { href: "/leaderboard", label: "Classement", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )},
  { href: "/shop", label: "Boutique", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )},
];

export function Navbar() {
  const { user, profile, loading } = useUser();
  const { balance } = useCurrency(user?.id);
  const toggleSidebar = useGameStore((s) => s.toggleSidebar);
  const router = useRouter();
  const pathname = usePathname();
  const { badgeMap } = useNotifications();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Nav>
      <Logo href="/">
        <GemIcon>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 9l10 13L22 9 12 2z" fill="url(#gem-grad)" />
            <path d="M2 9h20M12 2l-4 7m4-7l4 7M8 9l4 13m0 0l4-13" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <defs>
              <linearGradient id="gem-grad" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stopColor={theme.colors.accent} />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </GemIcon>
        GemRoad
      </Logo>

      {user && (
        <NavLinks>
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              $active={pathname === item.href || pathname.startsWith(item.href + "/")}
              prefetch={false}
              style={{ position: "relative" }}
            >
              {item.icon}
              {item.label}
              {badgeMap[item.href] && <NavNotifDot />}
            </NavLink>
          ))}
        </NavLinks>
      )}

      <NavRight>
        <ThemeToggle />
        {loading ? null : user ? (
          <>
            <CurrencyDisplay amount={balance} />
            <ProfileLink href="/profile">
              <Avatar>
                {profile?.username?.charAt(0) || "?"}
              </Avatar>
              <span className="desktop-only" style={{ display: "inline" }}>
                {profile?.username}
              </span>
            </ProfileLink>
            <LogoutButton onClick={handleLogout}>Déconnexion</LogoutButton>
            <MenuButton onClick={toggleSidebar}>&#9776;</MenuButton>
          </>
        ) : (
          <AuthButton href="/">Connexion</AuthButton>
        )}
      </NavRight>
    </Nav>
  );
}
