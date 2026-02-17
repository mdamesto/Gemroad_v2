"use client";

import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input, Label, FormGroup, FormError } from "@/components/ui/input";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 128px);
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: #12121a;
  border: 1px solid #2a2a35;
  border-radius: 16px;
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #e5e5e5;
`;

const Subtitle = styled.p`
  color: #8888aa;
  margin-bottom: 32px;
  font-size: 0.9rem;
`;

const BottomLink = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: #8888aa;

  a {
    color: #e63946;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (username.length < 3) {
      setError("Le nom d'utilisateur doit faire au moins 3 caractères");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/collection");
  };

  return (
    <Container>
      <Card>
        <Title>Créer un compte</Title>
        <Subtitle>Rejoignez les survivants</Subtitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Nom d&apos;utilisateur</Label>
            <Input
              id="username"
              type="text"
              placeholder="Survivant42"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </FormGroup>

          {error && <FormError>{error}</FormError>}

          <Button type="submit" $fullWidth disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>

        <BottomLink>
          Déjà un compte ? <Link href="/login">Se connecter</Link>
        </BottomLink>
      </Card>
    </Container>
  );
}
