# Moka Joy — Programme de fidélité

Application web de fidélité pour le café **Moka Joy** (Jet Sakan, Agadir) : carte digitale, scan en caisse, panneau d’admin, personnalisation des polices et couleurs.

Inspiré de [Fidelix](https://fidelix.ma), conçu pour un seul point de vente.

## Prérequis

- Node.js 20+
- npm
- Une base **PostgreSQL** (Neon recommandé — gratuit avec Vercel)

## Déploiement Vercel (GitHub)

Le repo est connecté à Vercel. Pour que l’app fonctionne vraiment :

### 1. Base de données Neon

1. Ouvrez le projet sur [vercel.com](https://vercel.com)
2. **Storage** → **Create Database** → **Neon** (Postgres)
3. Reliez-la au projet — Vercel injecte `DATABASE_URL` automatiquement

### 2. Variables d’environnement

Dans **Settings → Environment Variables**, ajoutez (Production + Preview) :

| Variable | Exemple |
|----------|---------|
| `AUTH_SECRET` | longue chaîne aléatoire |
| `ADMIN_PASSWORD` | mot de passe du compte owner |
| `NEXT_PUBLIC_APP_URL` | `https://votre-projet.vercel.app` |

`DATABASE_URL` vient de Neon. Puis **Redeploy**.

### 3. NFC

Programmez la carte avec :

```
https://votre-projet.vercel.app/join?src=nfc
```

## Installation locale

1. Créez une DB Neon (ou Postgres local) et copiez l’URL.
2. Copiez `.env.example` → `.env` et remplissez les valeurs.
3. Puis :

```bash
npm install
npm run db:setup
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Propriétaire | `admin@mokajoy.ma` | valeur de `ADMIN_PASSWORD` |
| Serveur | `staff@mokajoy.ma` | `staff123` |

## Parcours

1. **Client** : NFC / QR → `/join` → carte `/c/MJ-XXXXXXXX`
2. **Caisse** : `/scan` → +1 tampon ou échange
3. **Admin** : `/admin` → clients, récompenses, marque & polices, équipe

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement |
| `npm run build` | Build (+ db push + seed) |
| `npm run db:setup` | Schéma + seed |
| `npm run db:seed` | Re-seed admin / settings |

## Stack

Next.js 15 · TypeScript · Tailwind · Prisma · PostgreSQL (Neon) · jose

## Liens boutique

- Instagram : [mokajoycafe](https://www.instagram.com/mokajoycafe/)
- Maps : [Moka Joy, Agadir](https://www.google.com/maps/place/moka+joy/data=!4m2!3m1!1s0xdb3b7be6340dcbf:0x5e35730ef7bb1876)
