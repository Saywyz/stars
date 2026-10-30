// Récupère toutes les stars et écrit :
//   data/starred.json  la liste complète, lue par l'artefact d'admin (jamais affichée sur le site)
//   data/stars.json    étoiles, langage et description à jour pour les repos affichés sur le site
// Lancé par l'action Sync stars (bouton « Actualiser » de l'artefact, ou chaque nuit).
// Usage : node scripts/sync-stars.mjs [utilisateur]   (GITHUB_TOKEN optionnel)
import { readFile, writeFile } from "node:fs/promises";

const user = process.argv[2] || process.env.STARS_USER || "Saywyz";
const file = (p) => new URL(`../${p}`, import.meta.url);
const readJson = async (p, fallback) => {
  try { return JSON.parse(await readFile(file(p), "utf8")); } catch { return fallback; }
};

const headers = { Accept: "application/vnd.github+json", "User-Agent": "stars-sync" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const raw = [];
for (let page = 1; ; page++) {
  const res = await fetch(`https://api.github.com/users/${user}/starred?per_page=100&page=${page}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const batch = await res.json();
  raw.push(...batch);
  if (batch.length < 100) break;
}

const stars = raw.map((r) => ({
  repo: r.full_name,
  description: r.description,
  language: r.language,
  stars: r.stargazers_count,
  archived: r.archived,
}));

// L'artefact compare ce numéro à celui qu'il a écrit dans data/refresh.json pour savoir que sa demande est traitée.
const request = (await readJson("data/refresh.json", {})).id ?? null;
await writeFile(file("data/starred.json"), JSON.stringify({ updatedAt: new Date().toISOString(), request, stars }, null, 2) + "\n");

const byRepo = new Map(stars.map((s) => [s.repo.toLowerCase(), s]));
const shown = await readJson("data/stars.json", []);
const updated = shown.map((s) => byRepo.get(s.repo.toLowerCase()) || s);
await writeFile(file("data/stars.json"), JSON.stringify(updated, null, 2) + "\n");

console.log(`${stars.length} stars dans data/starred.json, ${updated.length} repos affichés mis à jour`);
