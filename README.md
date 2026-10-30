# Stars

Une sélection de repos GitHub, rangés par thème : **https://saywyz.github.io/stars/**

## Comment ça marche

- `data/themes.json` : la sélection. Seuls les repos listés ici apparaissent sur la page. C'est le seul fichier à éditer.
- `data/stars.json` : étoiles, langage et description des repos sélectionnés, rafraîchis chaque jour par l'action [Sync stars](.github/workflows/sync-stars.yml).

## Ajouter un repo

Dans `data/themes.json`, ajouter une ligne au thème voulu (ou créer un thème) :

```json
{ "repo": "owner/nom", "note": "Ce que fait le repo, en une phrase." }
```

Pour retrouver tes stars pas encore classées (rien n'est publié) :

```bash
node scripts/sync-stars.mjs --new
```

## En local

```bash
node scripts/sync-stars.mjs      # rafraîchit data/stars.json
python -m http.server 8000       # puis http://localhost:8000
```
