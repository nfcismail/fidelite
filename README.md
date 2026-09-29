# Moka Joy — Programme de fidélité

Application web de fidélité pour le café **Moka Joy** (Jet Sakan, Agadir) : carte digitale, scan en caisse, panneau d’admin, personnalisation des polices et couleurs.

Inspiré de [Fidelix](https://fidelix.ma), conçu pour un seul point de vente.

## Prérequis

- Node.js 20+
- npm

## Installation

```bash
npm install
npm run db:setup
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Comptes par défaut

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Propriétaire | `admin@mokajoy.ma` | valeur de `ADMIN_PASSWORD` dans `.env` (défaut : `mokajoy2026`) |
| Serveur | `staff@mokajoy.ma` | `staff123` |

Copiez `.env.example` vers `.env` et changez `AUTH_SECRET` + `ADMIN_PASSWORD` avant la prod.

## Parcours

1. **Client** : tape la carte NFC / scanne le QR → `/join` → reçoit `/c/MJ-XXXXXXXX`
2. **Caisse** : `/scan` → scanne le QR client ou cherche par téléphone → **+1 tampon** (avec confirmation) ou **échange**
3. **Admin** : `/admin` → clients, récompenses, marque & polices, équipe

## Programmer la carte NFC

1. Déployez l’app (ou utilisez un tunnel type Cloudflare / ngrok en test).
2. Définissez `NEXT_PUBLIC_APP_URL` sur l’URL publique (ex. `https://fidelite.mokajoy.ma`).
3. Avec une app type **NFC Tools**, écrivez une URL NDEF sur la carte :

```
https://votre-domaine/join?src=nfc
```

ou simplement :

```
https://votre-domaine/join
```

Le même lien peut être imprimé en QR sur le comptoir.

La carte digitale du client contient un QR pointant vers `/c/{cardId}` — c’est ce QR que l’équipe scanne en caisse.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run start` | Lancer le build |
| `npm run db:setup` | Créer la base SQLite + seed |
| `npm run db:seed` | Re-seed (mots de passe admin inclus) |

## Stack

Next.js 15 · TypeScript · Tailwind · Prisma · SQLite · jose (sessions)

## Liens boutique

- Instagram : [mokajoycafe](https://www.instagram.com/mokajoycafe/)
- Maps : [Moka Joy, Agadir](https://www.google.com/maps/place/moka+joy/data=!4m2!3m1!1s0xdb3b7be6340dcbf:0x5e35730ef7bb1876)
