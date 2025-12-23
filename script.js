const region = "eu";
const playerName = "Bleurtz";
const playerTag = "oops";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json().catch(() => null);
  return { res, json };
}

async function getValorantRank() {
  const rankEl = document.getElementById("rank-text");
  const subEl = document.getElementById("sub-text");
  const iconEl = document.getElementById("rank-icon");

  rankEl.textContent = "Chargement...";
  subEl.textContent = "";

  try {
    const mmrUrl = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${encodeURIComponent(playerName)}/${encodeURIComponent(playerTag)}`;
    const { json: mmr } = await fetchJson(mmrUrl);

    // Si l'API renvoie bien des datas
    if (mmr && mmr.status === 200 && mmr.data) {
      rankEl.textContent = `${mmr.data.currenttierpatched}`;
      subEl.textContent = `${mmr.data.ranking_in_tier} RR`;
      iconEl.src = mmr.data.images?.large || "";
      return;
    }

    // Fallback : vérifier que le profil existe (utile pour debug)
    const accUrl = `https://api.henrikdev.xyz/valorant/v1/account/${encodeURIComponent(playerName)}/${encodeURIComponent(playerTag)}`;
    const { json: acc } = await fetchJson(accUrl);

    if (acc && acc.status === 200 && acc.data) {
      // Compte existe, mais MMR introuvable (pas de ranked, saison, etc.)
      rankEl.textContent = "MMR indisponible";
      subEl.textContent = "Le compte existe mais pas de rank récupérable (ranked ?)";
      iconEl.src = "";
      return;
    }

    // Si même le compte est introuvable
    rankEl.textContent = "Compte introuvable";
    subEl.textContent = "Vérifie pseudo/tag et la région";
    iconEl.src = "";

  } catch (e) {
    rankEl.textContent = "Erreur API";
    subEl.textContent = "Impossible de contacter l’API";
    iconEl.src = "";
  }
}

window.addEventListener("load", () => {
  getValorantRank();
  setInterval(getValorantRank, 60000);
});