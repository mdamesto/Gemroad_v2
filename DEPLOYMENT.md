# Guide de Déploiement - GemRoad

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Vercel     │────▶│  Supabase        │     │  Stripe         │
│  (Frontend   │     │  (PostgreSQL +   │     │  (Paiements)    │
│   + API)     │◀────│   Auth + Realtime│     │                 │
│              │     │   + Storage)     │     │                 │
└──────┬───────┘     └──────────────────┘     └────────┬────────┘
       │                                               │
       └───────────── webhook ◀────────────────────────┘
```

- **Frontend + API** : Vercel (Next.js)
- **Base de données** : Supabase (PostgreSQL hébergé)
- **Auth** : Supabase Auth
- **Paiements** : Stripe
- **Temps réel** : Supabase Realtime

---

## Prérequis

- Compte [Vercel](https://vercel.com)
- Projet [Supabase](https://supabase.com) (plan Free ou Pro)
- Compte [Stripe](https://stripe.com) avec clés API
- [Node.js](https://nodejs.org) 18+
- Git

---

## Étape 1 : Configuration Supabase

### 1.1 Créer le projet

1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. "New Project" → choisir une région proche de vos utilisateurs (ex: `eu-west-1` pour la France)
3. Noter le **Project URL** et les clés dans **Settings > API**

### 1.2 Appliquer les migrations

```bash
# Installer la CLI Supabase
npm install -g supabase

# Se connecter
supabase login

# Lier au projet distant
supabase link --project-ref YOUR_PROJECT_REF

# Appliquer les migrations
supabase db push
```

Les migrations sont dans `supabase/migrations/` :
- `001_initial_schema.sql` — Tables principales
- `002_types_factions_talents.sql` — Types et talents
- `003_seed_data.sql` — Données initiales (cartes, séries, achievements)
- `004_free_daily_boosters.sql` — Système de boosters gratuits
- `005_seed_talent_trees.sql` — Arbres de talents

### 1.3 Appliquer le seed (optionnel)

```bash
supabase db seed
```

### 1.4 Configurer les Row Level Security (RLS)

Vérifier dans le dashboard Supabase que les politiques RLS sont actives sur toutes les tables. Les tables sensibles (`profiles`, `user_cards`, `user_achievements`, etc.) ne doivent être accessibles que par le propriétaire.

### 1.5 Configurer l'Auth

1. **Settings > Authentication > URL Configuration** :
   - Site URL : `https://gemroad.example.com`
   - Redirect URLs : `https://gemroad.example.com/**`

2. **Settings > Authentication > Email** :
   - Activer "Enable Email Signup"
   - Désactiver "Double Confirm Email Changes" si souhaité

---

## Étape 2 : Configuration Stripe

### 2.1 Clés API

1. Aller sur [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copier la **Publishable key** (`pk_live_...`) et la **Secret key** (`sk_live_...`)

### 2.2 Webhook

1. Aller sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. "Add endpoint" :
   - URL : `https://gemroad.example.com/api/stripe/webhook`
   - Events : `checkout.session.completed`
3. Copier le **Signing secret** (`whsec_...`)

### 2.3 Mode Live

Pour passer en production :
- Remplacer les clés `sk_test_` / `pk_test_` par `sk_live_` / `pk_live_`
- Créer un nouveau webhook endpoint avec l'URL de production
- Vérifier que le compte Stripe est activé (KYC complété)

---

## Étape 3 : Déploiement sur Vercel

### 3.1 Connexion du repo

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Importer le repository Git
3. Framework : **Next.js** (détecté automatiquement)

### 3.2 Variables d'environnement

Dans **Settings > Environment Variables**, ajouter :

| Variable | Valeur | Environnement |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (anon key) | Production, Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service role) | Production |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://gemroad.example.com` | Production |

**Important :**
- `SUPABASE_SERVICE_ROLE_KEY` ne doit **jamais** être dans les variables `NEXT_PUBLIC_*`
- Ne pas exposer les clés Stripe live dans Preview/Development
- Pour Preview, utiliser les clés Stripe test

### 3.3 Build Settings

Vercel détecte automatiquement Next.js. Vérifier :
- Build Command : `next build`
- Output Directory : `.next`
- Install Command : `npm install`
- Node.js Version : 18.x ou 20.x

### 3.4 Déployer

```bash
# Ou simplement push sur main
git push origin main
```

Vercel déploie automatiquement sur chaque push.

---

## Étape 4 : Domaine custom (optionnel)

### 4.1 Ajouter le domaine sur Vercel

1. **Settings > Domains** → "Add"
2. Entrer le domaine : `gemroad.example.com`

### 4.2 Configuration DNS

Chez votre registrar DNS, ajouter :

**Option A — Domaine apex (`example.com`) :**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Option B — Sous-domaine (`gemroad.example.com`) :**
```
Type: CNAME
Name: gemroad
Value: cname.vercel-dns.com
```

### 4.3 SSL

Vercel provisionne automatiquement un certificat SSL Let's Encrypt. Le HTTPS est forcé par défaut.

### 4.4 Mettre à jour les URLs

Après configuration du domaine :

1. **Vercel** : Mettre à jour `NEXT_PUBLIC_APP_URL` → `https://gemroad.example.com`
2. **Supabase** : Settings > Auth > Site URL → `https://gemroad.example.com`
3. **Stripe** : Mettre à jour l'URL du webhook → `https://gemroad.example.com/api/stripe/webhook`

---

## Étape 5 : Vérifications post-déploiement

### Checklist

- [ ] L'app se charge correctement sur l'URL de production
- [ ] L'inscription et la connexion fonctionnent
- [ ] Les boosters s'ouvrent correctement
- [ ] Le solde de gems se met à jour en temps réel
- [ ] Le paiement Stripe fonctionne (test avec `4242 4242 4242 4242`)
- [ ] Le webhook Stripe reçoit les événements (vérifier dans le dashboard Stripe)
- [ ] Les séries se complètent et les récompenses sont réclamables
- [ ] Les achievements se débloquent et se réclament
- [ ] L'arbre de talents fonctionne
- [ ] Les headers de sécurité sont présents (vérifier avec `curl -I`)
- [ ] Pas de clés secrètes exposées côté client (vérifier le source du navigateur)

### Test des headers de sécurité

```bash
curl -I https://gemroad.example.com
```

Vérifier la présence de :
```
x-frame-options: DENY
x-content-type-options: nosniff
strict-transport-security: max-age=63072000; includeSubDomains; preload
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=()
```

---

## Monitoring et Logs

### Vercel

- **Logs temps réel** : Dashboard > Projet > Logs
- **Analytics** : Dashboard > Projet > Analytics (plan Pro)
- **Functions** : Dashboard > Projet > Functions — voir les invocations API, durée, erreurs

### Supabase

- **Logs SQL** : Dashboard > Logs > Postgres
- **Auth logs** : Dashboard > Authentication > Users
- **Realtime** : Dashboard > Realtime Inspector
- **Database usage** : Dashboard > Reports

### Stripe

- **Événements** : Dashboard > Developers > Events
- **Webhooks** : Dashboard > Developers > Webhooks — voir les tentatives et erreurs
- **Logs API** : Dashboard > Developers > Logs

### Alertes recommandées

1. **Vercel** : Configurer les notifications d'échec de déploiement
2. **Supabase** : Activer les alertes d'usage (quota DB, Auth, Storage)
3. **Stripe** : Activer les notifications de paiement échoué

---

## Commandes utiles

```bash
# Build local de production
npm run build

# Lancer en mode production local
npm run build && npm run start

# Vérifier les types TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Voir les logs Vercel en temps réel
npx vercel logs --follow

# Appliquer une nouvelle migration Supabase
supabase db push

# Reset la base de données (ATTENTION: destructif)
supabase db reset
```

---

## Rollback

### Vercel
Chaque déploiement est immutable. Pour rollback :
1. Dashboard > Deployments
2. Cliquer sur un déploiement précédent
3. "Promote to Production"

### Supabase
Les migrations sont irréversibles par défaut. Pour les données :
- Activer les Point-in-Time Recovery (plan Pro)
- Ou faire des backups manuels réguliers via `pg_dump`

---

## Coûts estimés

| Service | Plan gratuit | Plan payant |
|---|---|---|
| **Vercel** | 100 GB bandwidth, builds illimités | Pro: $20/mois |
| **Supabase** | 500 MB DB, 50K auth users, 2 GB storage | Pro: $25/mois |
| **Stripe** | Pas de frais fixes | 1.4% + 0.25€ par transaction (EU) |

Le plan gratuit est suffisant pour un lancement. Passer en Pro quand le trafic augmente.
