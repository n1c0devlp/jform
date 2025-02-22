# JForm - Gestion des Groupes d'Élèves

Application web de gestion des groupes d'élèves pour une école de musique, basée sur leurs disponibilités.

## Fonctionnalités

- **Espace Élèves** :
  - Saisie des disponibilités hebdomadaires
  - Informations personnelles (instrument, niveau, etc.)
  - Visualisation du calendrier des disponibilités

- **Espace Professeurs** :
  - Tableau de bord complet
  - Gestion des groupes
  - Vue des disponibilités des élèves
  - Suggestions automatiques de groupes
  - Gestion des élèves
  - Analytics (pour les super administrateurs)

## Technologies Utilisées

- Next.js 14
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- TailwindCSS
- FullCalendar

## Installation

1. Cloner le projet :
```bash
git clone https://github.com/n1c0devlp/jform.git
cd jform
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Puis modifier les variables dans le fichier `.env`

4. Initialiser la base de données :
```bash
npx prisma db push
npx prisma db seed
```

5. Lancer le serveur de développement :
```bash
npm run dev
```

## Structure du Projet

- `/src/app` - Routes et API routes (Next.js App Router)
- `/src/components` - Composants React réutilisables
- `/src/lib` - Utilitaires et constantes
- `/prisma` - Schéma de base de données et seeds

## Authentification

L'application utilise NextAuth.js pour l'authentification avec les rôles suivants :
- STUDENT (Élève)
- TEACHER (Professeur)
- ADMIN (Administrateur)
- SUPER_ADMIN (Super Administrateur)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request. 