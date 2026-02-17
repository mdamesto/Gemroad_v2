"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { formatPrice, formatGems } from "@/lib/utils";
import type { BoosterType } from "@/types/cards";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #8888aa;
  margin-bottom: 32px;
  font-size: 0.9rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const ProductCard = styled.div`
  background: #12121a;
  border: 1px solid #2a2a35;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;

  &:hover {
    border-color: #f4a26140;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 12px;
  right: -28px;
  background: #e63946;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 32px;
  transform: rotate(45deg);
`;

const ProductIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 20px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ProductDesc = styled.p`
  color: #8888aa;
  font-size: 0.85rem;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #f4a261;
  margin-bottom: 8px;
`;

const GemPrice = styled.div`
  font-size: 0.85rem;
  color: #8888aa;
  margin-bottom: 20px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 60px;
  color: #8888aa;
`;

export default function ShopPage() {
  const { user, loading: userLoading } = useUser();
  const [boosters, setBoosters] = useState<BoosterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

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
      if (url) window.location.href = url;
    }

    setPurchasing(null);
  };

  if (loading || userLoading) return <Loading>Chargement...</Loading>;

  return (
    <Page>
      <Title>Boutique</Title>
      <Subtitle>
        Achetez des boosters premium pour augmenter vos chances d&apos;obtenir
        des cartes rares.
      </Subtitle>

      <Grid>
        {boosters.map((bt, i) => (
          <ProductCard key={bt.id}>
            {i === 1 && <PopularBadge>POPULAIRE</PopularBadge>}
            <ProductIcon>&#127183;</ProductIcon>
            <ProductName>{bt.name}</ProductName>
            <ProductDesc>
              {bt.description} &middot; {bt.cards_count} cartes
            </ProductDesc>
            <PriceTag>
              {bt.price_cents ? formatPrice(bt.price_cents) : "Gratuit"}
            </PriceTag>
            <GemPrice>ou &#9670; {formatGems(bt.price_gems)} gems</GemPrice>
            <Button
              onClick={() => handleBuy(bt.id)}
              disabled={!user || purchasing === bt.id}
              $fullWidth
            >
              {!user
                ? "Connectez-vous"
                : purchasing === bt.id
                  ? "Redirection..."
                  : "Acheter"}
            </Button>
          </ProductCard>
        ))}
      </Grid>
    </Page>
  );
}
