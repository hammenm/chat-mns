# Chat-MNS

## Configuration du projet

### Mysql

Tout d'abord, configurez la partie MySQL avec :
- Une base de données
- Un utilisateur
- Les accès complets de l'utilisateur sur la base de données

Copier-coller le fichier `.env.example` vers le fichier `.env`.
Changer la valeur de `DATABASE_URL` pour correspondre à la configuration précédente.

### Lancer le projet

Pour démarrer le projet :

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Reprendre le frontend de zéro

Suivre les étapes suivantes
1. Supprimer les dossiers suivants :
   - `src/app/_components`
   - `src/app/auth`
   - `src/app/conversations`
   - `src/components`
   - `src/styles`
   - `src/types`
2. Supprimer les fichiers `.tsx` et `.module.css`
3. Renommer les fichiers `.jsx` :
   - `layout.example.jsx` en `layout.jsx`
   - `page.example.jsx` en `page.jsx`

## Utilisation de l'API

Les endpoints utilisés par l'application sont les suivants.
Les paramètres et les réponses sont donnés pour chaque endpoint.
Le format des paramètres et des réponses est en JSON.
- `POST /api/auth/login` : Connexion d'un utilisateur
  - Paramètres :
    - `email` : Email de l'utilisateur
    - `password` : Mot de passe de l'utilisateur 
  - Réponse :
    - `token` : Token d'authentification
    - `user` : Utilisateur connecté
- `POST /api/auth/signup` : Inscription d'un utilisateur
  - Paramètres :
    - `email` : Email de l'utilisateur
    - `password` : Mot de passe de l'utilisateur
  - Réponse :
    - `token` : Token d'authentification
    - `user` : Utilisateur connecté
- `GET /api/conversations` : Récupération des conversations de l'utilisateur
  - Headers :
    - `Authorization` : Token d'authentification au format `Bearer token`
  - Réponse :
    - `conversations` : Conversations de l'utilisateur ou conversations publiques si pas de token fourni
- `POST /api/conversations` : Création d'une conversation
  - Headers :
    - `Authorization` : Token d'authentification au format `Bearer token`
  - Paramètres :
    - `content` : Contenu du premier message
  - Réponse :
    - `conversation` : Conversation créée
- `GET /api/conversations/:id` : Récupération des messages d'une conversation
  - Headers :
    - `Authorization` : Token d'authentification
  - Réponse :
    - `conversation` : Conversation avec les champs `id` et `messages`
- `POST /api/conversations/:id/sendMessage` : Envoi d'un message dans une conversation
  - Headers :
    - `Authorization` : Token d'authentification
  - Paramètres :
    - `content` : Contenu du message
  - Réponse :
    - `conversation` : Deux derniers messages de la conversation
