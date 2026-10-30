// Met à jour data/stars.json (étoiles, langage, description) pour les seuls repos listés dans data/themes.json.
// Usage :
//   node scripts/sync-stars.mjs          rafraîchit les infos des repos choisis
//   node scripts/sync-stars.mjs --new    liste tes stars qui ne sont dans aucun thème (rien n'est publié)
// GITHUB_TOKEN optionnel (sans lui, l'API limite à 60 requêtes par heure).
import { readFile, writeFile } from "node:fs/promises";

const headers = { Accept: "application/vnd.github+json", "User-Agent": "stars-sync" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const api = async (path) => {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} sur ${path}`);
  return res.json();
};

const themes = JSON.parse(await readFile(new URL("../data/themes.json", import.meta.url), "utf8"));
const chosen = themes.themes.flatMap((t) => t.repos.map((r) => r.repo));

if (process.argv.includes("--new")) {
  const user = process.env.STARS_USER || "Saywyz";
  const known = new Set(chosen.map((r) => r.toLowerCase()));
  for (let page = 1; ; page++) {
    const batch = await api(`/users/${user}/starred?per_page=100&page=${page}`);
    for (const r of batch) if (!known.has(r.full_name.toLowerCase())) console.log(`${r.full_name}  —  ${r.description || ""}`);
    if (batch.length < 100) break;
  }
  process.exit(0);
}

const out = [];
for (const repo of chosen) {
  try {
    const r = await api(`/repos/${repo}`);
    out.push({ repo: r.full_name, description: r.description, language: r.language, stars: r.stargazers_count, archived: r.archived });
  } catch (e) {
    console.warn(`Ignoré : ${repo} (${e.message})`);
  }
}

await writeFile(new URL("../data/stars.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`${out.length} repos écrits dans data/stars.json`);
