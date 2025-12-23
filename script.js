const region = "eu";
const playerName = "Bleurtz";
const playerTag = "oops";

async function getValorantRank() {
  const rankEl = document.getElementById("rank-text");
  const iconEl = document.getElementById("rank-icon");

  try {
    const url = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${encodeURIComponent(playerName)}/${encodeURIComponent(playerTag)}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!json || json.status !== 200 || !json.data) {
      rankEl.textContent = "Rank introuvable";
      return;
    }

    rankEl.textContent = `${json.data.currenttierpatched} - ${json.data.ranking_in_tier} RR`;
    iconEl.src = json.data.images.large;

  } catch (e) {
    rankEl.textContent = "Erreur API";
  }
}

window.addEventListener("load", () => {
  getValorantRank();
  setInterval(getValorantRank, 60000);
});