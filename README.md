# Stars

Une sélection de repos GitHub, rangés par thème : **https://saywyz.github.io/stars/**

## Comment ça marche

- `data/themes.json` : la sélection. Seuls les repos listés ici apparaissent sur la page.
- `data/stars.json` : étoiles, langage et description des repos affichés.
- `data/starred.json` : la liste complète de mes stars, utilisée par l'artefact d'admin. Le site ne la lit pas.
- `data/refresh.json` : écrit par l'artefact quand je clique « Actualiser », ce qui lance l'action [Sync stars](.github/workflows/sync-stars.yml).

L'action tourne aussi chaque nuit. Elle met à jour `starred.json` et les compteurs de `stars.json`.

Dans l'artefact d'admin, je choisis quelles stars afficher et dans quel thème, puis « Publier sur le site » écrit `themes.json` et `stars.json` en un commit.

## En local

```bash
node scripts/sync-stars.mjs     # met à jour starred.json et stars.json
python -m http.server 8000      # puis http://localhost:8000
```
