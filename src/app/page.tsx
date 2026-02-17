"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 128px);
  text-align: center;
  padding: 40px 20px;
  background: radial-gradient(ellipse at center, #1a0a0f 0%, #0a0a0f 70%);
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 16px;
  letter-spacing: -2px;

  span {
    color: #e63946;
  }

  em {
    color: #f4a261;
    font-style: normal;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #8888aa;
  max-width: 600px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const CTAGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled(Link)`
  padding: 16px 40px;
  background: #e63946;
  color: white;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: #c62d38;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link)`
  padding: 16px 40px;
  background: transparent;
  color: #e5e5e5;
  border: 1px solid #2a2a35;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: #f4a261;
    transform: translateY(-2px);
  }
`;

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 60px 24px;
  max-width: 1100px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: #12121a;
  border: 1px solid #2a2a35;
  border-radius: 16px;
  padding: 32px;
  transition: border-color 0.3s;

  &:hover {
    border-color: #e6394640;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #e5e5e5;
`;

const FeatureDesc = styled.p`
  font-size: 0.9rem;
  color: #8888aa;
  line-height: 1.5;
`;

const GlowDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e63946;
  animation: ${pulse} 2s infinite;
  margin: 0 auto 24px;
`;

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Hero>
        <GlowDot />
        <Title>
          <span>Gem</span><em>Road</em>
        </Title>
        <Subtitle>
          Dans un monde en ruines, les cartes sont la nouvelle monnaie.
          Collectionnez, complétez des séries et gagnez de véritables pierres
          précieuses.
        </Subtitle>
        <CTAGroup>
          {user ? (
            <>
              <PrimaryButton href="/boosters">Ouvrir des Boosters</PrimaryButton>
              <SecondaryButton href="/collection">Ma Collection</SecondaryButton>
            </>
          ) : (
            <>
              <PrimaryButton href="/register">Commencer l&apos;aventure</PrimaryButton>
              <SecondaryButton href="/login">Se connecter</SecondaryButton>
            </>
          )}
        </CTAGroup>
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureIcon>&#9876;</FeatureIcon>
          <FeatureTitle>Collectionnez des cartes</FeatureTitle>
          <FeatureDesc>
            Ouvrez des boosters pour découvrir des cartes de 5 raretés
            différentes, des communes aux légendaires.
          </FeatureDesc>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>&#9670;</FeatureIcon>
          <FeatureTitle>Gagnez des pierres précieuses</FeatureTitle>
          <FeatureDesc>
            Complétez des séries thématiques pour remporter de véritables
            gemmes : rubis, émeraudes, saphirs.
          </FeatureDesc>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>&#9733;</FeatureIcon>
          <FeatureTitle>Débloquez des achievements</FeatureTitle>
          <FeatureDesc>
            Atteignez des objectifs pour gagner de la monnaie in-game et monter
            en niveau.
          </FeatureDesc>
        </FeatureCard>
      </Features>
    </>
  );
}
