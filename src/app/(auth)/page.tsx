"use client";

import { FormEvent, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Animations ────────────────────────────────────────────────────

const energyPulse = keyframes`
  0% {
    box-shadow:
      0 0 20px rgba(56, 189, 248, 0.7),
      0 0 0 1px rgba(248, 250, 252, 0.95) inset;
  }
  50% {
    box-shadow:
      0 0 32px rgba(56, 189, 248, 1),
      0 0 0 1px rgba(248, 250, 252, 1) inset;
  }
  100% {
    box-shadow:
      0 0 20px rgba(56, 189, 248, 0.7),
      0 0 0 1px rgba(248, 250, 252, 0.95) inset;
  }
`;

const auraPulse = keyframes`
  0% { opacity: 0.35; transform: scaleX(1) scaleY(1); }
  50% { opacity: 0.7; transform: scaleX(1.05) scaleY(1.12); }
  100% { opacity: 0.35; transform: scaleX(1) scaleY(1); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-280%); opacity: 0; }
  20% { opacity: 0.2; }
  50% { opacity: 0.3; }
  80% { opacity: 0.2; }
  100% { transform: translateX(180%); opacity: 0; }
`;

const epicFlash = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const epicTextIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.05); }
`;

// ─── Styled Components ────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5e7eb;
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  transform: translate(-50%, -50%);
  z-index: -2;
  opacity: 1;
  filter: brightness(0.9) saturate(1.1);
  pointer-events: none;
`;

const CardContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 520px;
  padding: 0 1.5rem;
`;

const GlassCard = styled.div<{ $hidden?: boolean }>`
  position: relative;
  margin: 0 auto;
  max-width: 430px;
  padding: 2.6rem 2.4rem 2.1rem;
  border-radius: 15px;

  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px) saturate(80%);
  -webkit-backdrop-filter: blur(2px) saturate(80%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 0 40px rgba(255, 255, 255, 0.08),
    0 0 70px rgba(0, 0, 0, 0.35);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.65),
      rgba(255, 255, 255, 0.15)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: ${({ $hidden }) =>
    $hidden ? "scale(0.97) translateY(8px)" : "scale(1) translateY(0)"};
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
`;

const GemroadTitle = styled.h1`
  font-family: var(--font-cinzel), "Cinzel", serif;
  font-size: 3.2rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  text-align: center;

  background: linear-gradient(
    90deg,
    #c5ccd5 0%,
    #e7edf5 22%,
    #ffffff 45%,
    #f8f3da 58%,
    #f0d07e 78%,
    #dbb45d 100%
  );
  -webkit-background-clip: text;
  color: transparent;

  text-shadow:
    0px 0px 2px rgba(255, 255, 255, 0.55),
    0px 0px 2px rgba(255, 255, 255, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.35);

  filter:
    drop-shadow(0 0 6px rgba(255, 255, 255, 0.25))
    drop-shadow(0 0 12px rgba(255, 255, 255, 0.15));
`;

const Subtitle = styled.p`
  font-family: var(--font-cinzel), "Cinzel", serif;
  text-align: center;
  font-size: 0.9rem;
  margin-bottom: 2rem;

  background: linear-gradient(
    90deg,
    #c5ccd5 0%,
    #e7edf5 22%,
    #ffffff 45%,
    #f8f3da 58%,
    #f0d07e 78%,
    #dbb45d 100%
  );
  -webkit-background-clip: text;
  color: transparent;

  filter:
    drop-shadow(0 0 6px rgba(255, 255, 255, 0.25))
    drop-shadow(0 0 12px rgba(255, 255, 255, 0.15));
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;

const InputWrapper = styled.div`
  border-radius: 16px;
  padding: 2px;
  background: white;
  box-shadow:
    0 0 10px rgba(148, 197, 255, 0.4),
    0 0 0 1px rgba(15, 23, 42, 0.9);
  transition:
    box-shadow 0.2s ease,
    transform 0.12s ease;

  &:focus-within {
    box-shadow:
      0 0 16px rgba(148, 197, 255, 0.85),
      0 0 0 1px rgba(15, 23, 42, 0.9);
    transform: translateY(-0.5px);
  }
`;

const Input = styled.input`
  width: 100%;
  border-radius: 14px;
  border: none;
  padding: 0.8rem 1rem;
  background-color: #031734 !important;
  background-image: none !important;
  color: #e5edff !important;
  font-size: 0.95rem;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::placeholder { color: #9fb2d8; }

  &:focus {
    background-color: #031734 !important;
    background-image: none !important;
    box-shadow: 0 0 0 1px rgba(148, 197, 255, 0.7);
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: #e5edff !important;
    caret-color: #e5edff;
    -webkit-box-shadow: 0 0 0px 1000px #050b17 inset !important;
    box-shadow: 0 0 0px 1000px #050b17 inset !important;
    background-color: #050b17 !important;
  }
`;

const ErrorBox = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #fecaca;
  background: rgba(127, 29, 29, 0.6);
  border: 1px solid rgba(248, 113, 113, 0.7);
  border-radius: 0.75rem;
  padding: 0.55rem 0.75rem;
`;

const PrimaryButtonWrapper = styled.div`
  position: relative;
  margin-top: 0.8rem;
`;

const ButtonUnderGlow = styled.div`
  position: absolute;
  inset: 12px 8px 0;
  border-radius: 999px;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(56, 189, 248, 0.8),
    transparent 60%
  );
  filter: blur(16px);
  opacity: 0.85;
  pointer-events: none;
`;

const PrimaryButton = styled.button`
  font-family: var(--font-cinzel), "Cinzel", serif;
  position: relative;
  width: 100%;
  border-radius: 999px;
  padding: 0.95rem 1.2rem;
  border: 1px solid rgba(191, 219, 254, 0.95);

  background:
    radial-gradient(circle at 20% 0%, #707592, transparent 55%),
    radial-gradient(circle at 80% 100%, #031734, transparent 55%),
    radial-gradient(circle at 50% 50%, #09123eff, #020617 70%);

  font-size: 0.98rem;
  font-weight: 600;
  color: #e5f2ff;
  cursor: pointer;
  overflow: hidden;

  box-shadow:
    0 0 26px rgba(56, 189, 248, 0.9),
    0 0 0 1px rgba(248, 250, 252, 0.95) inset;

  animation: ${energyPulse} 2.4s ease-in-out infinite;

  transition:
    transform 0.12s ease,
    filter 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.08);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    filter: brightness(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
    animation: none;
  }

  &::before {
    content: "";
    position: absolute;
    inset: -20%;
    border-radius: inherit;
    background: radial-gradient(
      ellipse at 50% 50%,
      rgba(56, 189, 248, 0.5),
      transparent 60%
    );
    opacity: 0.45;
    z-index: 0;
    animation: ${auraPulse} 3s ease-in-out infinite;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: -40%;
    bottom: -40%;
    width: 70%;
    border-radius: 999px;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.9) 45%,
      rgba(224, 231, 255, 0.9) 55%,
      transparent 100%
    );
    transform: translateX(-130%);
    opacity: 0;
    pointer-events: none;
  }

  &:hover::after {
    animation: ${shimmer} 1.2s linear infinite;
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const SocialSeparator = styled.div`
  margin-top: 1.4rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(148, 163, 184, 0.6);
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  border-radius: 999px;
  padding: 0.75rem 1.2rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  background: #ffffff;
  color: #111827;
  border: 1px solid rgba(148, 163, 184, 0.7);

  transition:
    transform 0.1s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.97);
    box-shadow: 0 0 18px rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const FooterArea = styled.div`
  margin-top: 1.6rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: center;
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit;
  color: #cbd5f5;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #e5e7eb;
  }
`;

const TransitionOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at 50% 30%,
    rgba(15, 23, 42, 0.9),
    #020617
  );
`;

const TransitionVideo = styled.video<{ $letterbox?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: ${({ $letterbox }) => ($letterbox ? "contain" : "cover")};
  background: black;
`;

const EpicOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const EpicFlash = styled.div`
  position: absolute;
  inset: 0;
  background: white;
  animation: ${epicFlash} 0.6s ease-out forwards;
`;

const EpicText = styled.h2`
  font-family: var(--font-cinzel), "Cinzel", serif;
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-align: center;

  background: linear-gradient(
    90deg,
    #c5ccd5 0%,
    #ffffff 45%,
    #f8f3da 58%,
    #dbb45d 100%
  );
  -webkit-background-clip: text;
  color: transparent;

  filter:
    drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))
    drop-shadow(0 0 20px rgba(219, 180, 93, 0.3));

  animation: ${epicTextIn} 2.3s ease-in-out forwards;
`;

const SoundToggleButton = styled.button`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 80;
  border: none;
  border-radius: 999px;
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  background: rgba(15, 23, 42, 0.7);
  color: #e5e7eb;
  font-size: 0.8rem;
  cursor: pointer;

  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.7);

  transition:
    background 0.15s ease,
    transform 0.12s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: rgba(15, 23, 42, 0.9);
    transform: translateY(-1px);
    box-shadow: 0 0 16px rgba(15, 23, 42, 0.9);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 0 10px rgba(15, 23, 42, 0.8);
  }

  span.icon { font-size: 1rem; }
`;

// ─── Page Component ────────────────────────────────────────────────

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    "idle" | "transition" | "lore" | "epic"
  >("idle");
  const [isMuted, setIsMuted] = useState(true);
  const [isSignup, setIsSignup] = useState(false);

  const bgVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${mode === "register" ? "?signup=true" : ""}`,
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "register") {
      if (username.length < 3) {
        setError("Le nom d'utilisateur doit faire au moins 3 caractères");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }

      setIsSignup(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setError(error.message);
        return;
      }

      setIsSignup(false);
    }

    // Success → start transition
    setIsTransitioning(true);

    setTimeout(() => {
      if (bgVideoRef.current) {
        bgVideoRef.current.pause();
      }
      setCurrentPhase("transition");
    }, 400);
  };

  const startEpicReveal = () => {
    setCurrentPhase("epic");
    setTimeout(() => {
      router.push("/collection");
    }, 2500);
  };

  const handleTransitionEnd = () => {
    if (isSignup) {
      // Signup: check if lore already seen
      const loreSeen = localStorage.getItem("gemroad_lore_seen");
      if (loreSeen) {
        startEpicReveal();
      } else {
        setCurrentPhase("lore");
      }
    } else {
      // Login: skip lore, go to epic
      startEpicReveal();
    }
  };

  const handleLoreEnd = () => {
    localStorage.setItem("gemroad_lore_seen", "true");
    startEpicReveal();
  };

  return (
    <PageWrapper>
      {/* Transition Video */}
      {currentPhase === "transition" && (
        <TransitionOverlay>
          <TransitionVideo
            src="/videos/login_transition.mov"
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleTransitionEnd}
            onError={() => {
              console.error("Erreur vidéo de transition");
              router.push("/collection");
            }}
          />
        </TransitionOverlay>
      )}

      {/* Lore Video (signup only, played once) */}
      {currentPhase === "lore" && (
        <TransitionOverlay>
          <TransitionVideo
            src="/videos/intro_lore.mp4"
            $letterbox
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleLoreEnd}
            onError={() => {
              console.error("Erreur vidéo lore");
              localStorage.setItem("gemroad_lore_seen", "true");
              router.push("/collection");
            }}
          />
        </TransitionOverlay>
      )}

      {/* Epic Reveal */}
      {currentPhase === "epic" && (
        <EpicOverlay>
          <EpicFlash />
          <EpicText>Bienvenue, Survivant</EpicText>
        </EpicOverlay>
      )}

      {/* Background Video */}
      <BackgroundVideo
        ref={bgVideoRef}
        src="/videos/background_login.mov"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        preload="auto"
      />

      {/* Auth Form */}
      <CardContainer>
        <GlassCard $hidden={isTransitioning}>
          <GemroadTitle>GemRoad</GemroadTitle>
          <Subtitle>
            {mode === "login"
              ? "Rejoignez l\u2019aventure et entrez dans le monde des pierres."
              : "Rejoignez les survivants et commencez votre collection."}
          </Subtitle>

          <Form onSubmit={handleSubmit}>
            {mode === "register" && (
              <InputWrapper>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  placeholder="Nom d'utilisateur"
                />
              </InputWrapper>
            )}

            <InputWrapper>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </InputWrapper>

            <InputWrapper>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "register" ? 6 : undefined}
                placeholder={
                  mode === "register"
                    ? "Mot de passe (min. 6 caractères)"
                    : "Mot de passe"
                }
              />
            </InputWrapper>

            {error && <ErrorBox>{error}</ErrorBox>}

            <PrimaryButtonWrapper>
              <ButtonUnderGlow />
              <PrimaryButton type="submit" disabled={loading}>
                <span>
                  {loading
                    ? mode === "login"
                      ? "Connexion..."
                      : "Création..."
                    : "Commencer l'aventure"}
                </span>
              </PrimaryButton>
            </PrimaryButtonWrapper>
          </Form>

          <SocialSeparator>ou</SocialSeparator>

          <GoogleButton type="button" onClick={handleGoogleSignIn} disabled={loading}>
            <svg viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </GoogleButton>

          <FooterArea>
            {mode === "login" ? (
              <p>
                Pas encore de compte ?{" "}
                <SwitchButton type="button" onClick={() => switchMode("register")}>
                  Créer un compte
                </SwitchButton>
              </p>
            ) : (
              <p>
                Déjà un compte ?{" "}
                <SwitchButton type="button" onClick={() => switchMode("login")}>
                  Se connecter
                </SwitchButton>
              </p>
            )}
          </FooterArea>
        </GlassCard>
      </CardContainer>

      {/* Sound Toggle */}
      <SoundToggleButton
        type="button"
        onClick={() => setIsMuted((prev) => !prev)}
      >
        <span className="icon">{isMuted ? "\u{1F507}" : "\u{1F50A}"}</span>
        <span>{isMuted ? "Son coupé" : "Son activé"}</span>
      </SoundToggleButton>
    </PageWrapper>
  );
}
