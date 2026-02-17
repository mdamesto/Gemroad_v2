# GemRoad - TCG Post-Apocalyptique

Un jeu de cartes a collectionner web. Ouvrez des boosters, collectionnez des cartes, completez des series pour gagner des pierres precieuses reelles.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Supabase** (PostgreSQL, Auth, Realtime)
- **Stripe** (Paiements)
- **styled-components** (Styling)
- **Zustand** (State management)

## Demarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Variables d'environnement

Copier `.env.example` en `.env.local` et renseigner les valeurs :

```bash
cp .env.example .env.local
```

Variables requises :
- `NEXT_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Cle anonyme Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Cle service role (serveur uniquement)
- `STRIPE_SECRET_KEY` - Cle secrete Stripe
- `STRIPE_WEBHOOK_SECRET` - Secret webhook Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Cle publique Stripe

### 3. Base de donnees

#### Avec Supabase local :

```bash
npx supabase start
npx supabase db reset  # Applique migrations + seed
```

#### Avec Supabase cloud :

Executer les fichiers SQL dans l'ordre :
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed.sql`

### 4. Lancer le serveur

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
├── app/                    # Pages et API routes (App Router)
│   ├── (auth)/             # Pages authentification
│   ├── (game)/             # Pages du jeu
│   └── api/                # API routes serveur
├── components/             # Composants React
│   ├── cards/              # Composants cartes
│   ├── layout/             # Navbar, Sidebar, Footer
│   ├── shared/             # Composants partages
│   └── ui/                 # Composants de base (Button, Input)
├── hooks/                  # React hooks custom
├── lib/                    # Configuration et utilitaires
├── stores/                 # Zustand stores
└── types/                  # Types TypeScript
```

## Fonctionnalites

- Inscription / Connexion (Supabase Auth)
- Ouverture de boosters avec animation de revelation
- Collection de cartes avec 5 raretes
- 3 series thematiques a completer
- Systeme d'achievements avec recompenses
- Boutique avec paiement Stripe
- Profil joueur avec statistiques et historique
- Systeme de niveaux et XP
- Interface responsive (mobile + desktop)
