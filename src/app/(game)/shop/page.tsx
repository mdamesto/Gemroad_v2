"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/stores/toast-store";
import { GlowButton } from "@/components/ui/glow-button";
import { GlassCard } from "@/components/ui/glass-card";

import { LoadingState } from "@/components/ui/skeleton-loader";
import { theme, alpha } from "@/lib/theme";
import { fadeInUp } from "@/lib/animations";
import { formatPrice, formatGems } from "@/lib/utils";
import { useCurrency } from "@/hooks/use-currency";
import type { BoosterType } from "@/types/cards";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  animation: ${fadeInUp} 0.5s ease-out 0.2s both;
`;

const ProductCard = styled(GlassCard)`
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  padding: 32px;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 4px 16px rgba(var(--shadow-base), 0.35),
      0 0 24px ${alpha(theme.colors.accent, 0.09)};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  border-radius: ${theme.radii.full};
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: white;
  background: ${theme.gradients.primary};
  border: none;
`;

const ProductImage = styled.img`
  width: 100px;
  height: 133px;
  margin: 0 auto 20px;
  display: block;
  filter: drop-shadow(0 4px 16px rgba(var(--shadow-base), 0.5));
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${theme.colors.text};
`;

const ProductDesc = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 0.85rem;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${theme.colors.accent};
  margin-bottom: 8px;
`;

const GemPrice = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.textMuted};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const DevBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  border-radius: ${theme.radii.md};
  background: ${alpha(theme.colors.danger, 0.08)};
  border: 1px dashed ${alpha(theme.colors.danger, 0.3)};
`;

const DevLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.danger};
`;

const CartIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

function getBoosterImage(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("légend") || lower.includes("legend")) return "/images/ui/booster-legendary.svg";
  if (lower.includes("premi") || lower.includes("premium")) return "/images/ui/booster-premium.svg";
  return "/images/ui/booster-standard.svg";
}

export default function ShopPage() {
  const { user, loading: userLoading } = useUser();
  const { refresh: refreshBalance } = useCurrency(user?.id);
  const addToast = useToastStore((s) => s.addToast);
  const [boosters, setBoosters] = useState<BoosterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [addingGems, setAddingGems] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase
        .from("booster_types")
        .select("*")
        .eq("is_active", true)
        .not("price_cents", "is", null)
        .order("price_cents");

      setBoosters((data as BoosterType[]) || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleBuy = async (boosterTypeId: string) => {
    if (!user) return;
    setPurchasing(boosterTypeId);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boosterTypeId, quantity: 1 }),
    });

    if (res.ok) {
      const { url } = await res.json();
      if (url) {
        addToast("Redirection vers le paiement...", "info");
        window.location.href = url;
      }
    } else {
      addToast("Erreur lors de la création du paiement", "error");
    }

    setPurchasing(null);
  };

  const handleAddGems = async () => {
    setAddingGems(true);
    try {
      const res = await fetch("/api/dev/add-gems", { method: "POST" });
      if (res.ok) {
        const { added, balance } = await res.json();
        addToast(`+${formatGems(added)} gemmes ajoutées ! (Total : ${formatGems(balance)})`, "success");
        refreshBalance();
      } else {
        addToast("Erreur lors de l'ajout", "error");
      }
    } catch {
      addToast("Erreur réseau", "error");
    }
    setAddingGems(false);
  };

  if (loading || userLoading) return <LoadingState />;

  return (
    <Page>
      {user && (
        <DevBar>
          <DevLabel>DEV</DevLabel>
          <GlowButton
            $variant="danger"
            onClick={handleAddGems}
            disabled={addingGems}
            loading={addingGems}
          >
            +10 000 gemmes gratuites
          </GlowButton>
        </DevBar>
      )}

      <Grid>
        {boosters.map((bt, i) => (
          <ProductCard key={bt.id}>
            {i === 1 && <PopularBadge>POPULAIRE</PopularBadge>}
            <ProductImage
              src={getBoosterImage(bt.name)}
              alt={bt.name}
            />
            <ProductName>{bt.name}</ProductName>
            <ProductDesc>
              {bt.description} &middot; {bt.cards_count} cartes
            </ProductDesc>
            <PriceTag>
              {bt.price_cents ? formatPrice(bt.price_cents) : "Gratuit"}
            </PriceTag>
            <GemPrice>
              <span style={{ color: theme.colors.accent }}>&#9670;</span>
              ou {formatGems(bt.price_gems)} gems
            </GemPrice>
            <GlowButton
              $variant="accent"
              $fullWidth
              onClick={() => handleBuy(bt.id)}
              disabled={!user || purchasing === bt.id}
              loading={purchasing === bt.id}
              icon={CartIcon}
            >
              {!user
                ? "Connectez-vous"
                : "Acheter"}
            </GlowButton>
          </ProductCard>
        ))}
      </Grid>
    </Page>
  );
}
