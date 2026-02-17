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
  background: #0a0a0fee;
  border-bottom: 1px solid #2a2a35;
  backdrop-filter: blur(10px);
`;

const Logo = styled(Link)`
  font-size: 1.4rem;
  font-weight: 800;
  color: #e63946;
  text-decoration: none;
  letter-spacing: -0.5px;

  span {
    color: #f4a261;
  }
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
  color: #8888aa;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: #e5e5e5;
    background: #1a1a25;
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
  color: #e5e5e5;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const AuthButton = styled(Link)`
  padding: 8px 20px;
  background: #e63946;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #c62d38;
  }
`;

const LogoutButton = styled.button`
  padding: 8px 14px;
  background: none;
  border: 1px solid #2a2a35;
  color: #8888aa;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: #e5e5e5;
    border-color: #e5e5e5;
  }
`;

const Username = styled(Link)`
  color: #e5e5e5;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover {
    color: #f4a261;
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
        Gem<span>Road</span>
      </Logo>

      {user && (
        <NavLinks>
          <NavLink href="/collection">Collection</NavLink>
          <NavLink href="/boosters">Boosters</NavLink>
          <NavLink href="/series">Séries</NavLink>
          <NavLink href="/achievements">Achievements</NavLink>
          <NavLink href="/progression">Progression</NavLink>
          <NavLink href="/shop">Boutique</NavLink>
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
          <AuthButton href="/login">Connexion</AuthButton>
        )}
      </NavRight>
    </Nav>
  );
}
