const playerName = "Bleurtz";
const playerTag  = "oops";

// on teste plusieurs régions au cas où
const regions = ["eu", "na", "ap", "kr", "latam", "br"];

async function getJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json().catch(() => null);
  return json;
}

async function findWorkingRegion() {
  for (const r of regions) {
    const mmrUrl = `https://api.henrikdev.xyz/valorant/v1/mmr/${r}/${encodeURIComponent(playerName)}/${encodeURIComponent(playerTag)}`;
    const mmr = await getJson(mmrUrl);
    if (mmr && mmr.status === 200 && mmr.data) return { region: r, mmr };
  }
  return null;
}

async function run() {
  const rankEl = document.getElementById("rank-text");
  const subEl  = document.getElementById("sub-text");
  const iconEl = document.getElementById("rank-icon");

  rankEl.textContent = "Chargement...";
  subEl.textContent  = "";

  // 1) vérifier si le compte existe (peu importe la région)
  const accUrl = `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(playerName)}/${encodeURIComponent(playerTag)}`;
  const acc = await getJson(accUrl);

  if (!acc || acc.status !== 200 || !acc.data) {
    rankEl.textContent = "Compte introuvable";
    subEl.textContent = "Vérifie le tag EXACT (#...) dans Valorant";
    iconEl.src = "";
    return;
  }

  // 2) trouver une région qui donne le MMR
  const found = await findWorkingRegion();
  if (!found) {
    rankEl.textContent = "Rank indisponible";
    subEl.textContent = "Compte trouvé, mais pas de MMR (unranked / pas de ranked)";
    iconEl.src = "";
    return;
  }

  const { region, mmr } = found;

  rankEl.textContent = mmr.data.currenttierpatched;
  subEl.textContent  = `${mmr.data.ranking_in_tier} RR • ${region.toUpperCase()}`;
  iconEl.src         = mmr.data.images?.large || "";
}

window.addEventListener("load", () => {
  run();
  setInterval(run, 60000);
});