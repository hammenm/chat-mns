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
npm run dev
```

## Reprendre le frontend de zéro

Supprimer les dossiers suivants :
- `src/app/_components`
- `src/app/auth`
- `src/app/conversations`
- `src/components`
- `src/styles`
- `src/types`
