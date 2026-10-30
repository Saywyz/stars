# Stars

Une sélection de repos GitHub, rangés par thème : **https://saywyz.github.io/stars/**

## Comment ça marche

- `data/themes.json` : la sélection. Seuls les repos listés ici apparaissent sur la page.
- `data/stars.json` : étoiles, langage et description des repos sélectionnés.

Les deux fichiers sont écrits par mon artefact d'admin dans Claude : il liste toutes mes stars, je choisis lesquelles afficher et dans quel thème, puis « Publier sur le site » fait un commit ici.

On peut aussi éditer `data/themes.json` à la main :

```json
{ "repo": "owner/nom", "note": "Ce que fait le repo, en une phrase." }
```

## En local

```bash
node scripts/sync-stars.mjs --new   # liste les stars qui ne sont pas encore sur le site
python -m http.server 8000          # puis http://localhost:8000
```
