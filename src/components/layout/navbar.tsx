"use client";

import styled from "styled-components";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useCurrency } from "@/hooks/use-currency";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { useGameStore } from "@/stores/game-store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background: #020617ee;
  border-bottom: 1px solid #1e293b;
  backdrop-filter: blur(10px);
`;

const Logo = styled(Link)`
  font-family: var(--font-cinzel), "Cinzel", serif;
  font-size: 1.4rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.04em;

  background: linear-gradient(90deg, #c5ccd5, #ffffff 45%, #f8f3da 58%, #dbb45d);
  -webkit-background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.15));
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  padding: 8px 14px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: #e5e7eb;
    background: #1e293b;
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
  color: #e5e7eb;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const AuthButton = styled(Link)`
  padding: 8px 20px;
  background: #38BDF8;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #0EA5E9;
  }
`;

const LogoutButton = styled.button`
  padding: 8px 14px;
  background: none;
  border: 1px solid #1e293b;
  color: #94a3b8;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: #e5e7eb;
    border-color: #e5e7eb;
  }
`;

const Username = styled(Link)`
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover {
    color: #dbb45d;
  }
`;

export function Navbar() {
  const { user, profile, loading } = useUser();
  const { balance } = useCurrency(user?.id);
  const toggleSidebar = useGameStore((s) => s.toggleSidebar);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Nav>
      <Logo href="/">
        GemRoad
      </Logo>

      {user && (
        <NavLinks>
          <NavLink href="/collection" prefetch={false}>Collection</NavLink>
          <NavLink href="/boosters" prefetch={false}>Boosters</NavLink>
          <NavLink href="/series" prefetch={false}>Séries</NavLink>
          <NavLink href="/achievements" prefetch={false}>Achievements</NavLink>
          <NavLink href="/progression" prefetch={false}>Progression</NavLink>
          <NavLink href="/shop" prefetch={false}>Boutique</NavLink>
        </NavLinks>
      )}

      <NavRight>
        {loading ? null : user ? (
          <>
            <CurrencyDisplay amount={balance} />
            <Username href="/profile">{profile?.username}</Username>
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
