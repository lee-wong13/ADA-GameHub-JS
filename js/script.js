//STATE

let AllGames = [];
const fallbackImage = "https://via.placeholder.com/300x170?text=No+Image";

//FUnctions
async function fetchGames() {
  const url = "https://v2.api.noroff.dev/gamehub";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    AllGames = result.data || [];
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

function displayGames(games) {
  const gamesContainer = document.getElementById("games-container");
  if (!gamesContainer) return;

  gamesContainer.innerHTML = ""; // Clear previous content

  games.forEach((game) => {
    let imageUrl = fallbackImage;

    if (game.image && typeof game.image === "object" && game.image.url) {
      imageUrl = game.image.url;
    } else if (game.image && typeof game.image === "string") {
      imageUrl = game.image;
    }

    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");

    const gameImage = document.createElement("div");
    gameImage.classList.add("game-img");
    gameImage.style.background = `center / cover no-repeat url('${imageUrl}')`;

    const gameInfo = document.createElement("div");
    gameInfo.classList.add("game-info");

    const title = document.createElement("h3");
    title.textContent = game.title || "Untitled Game";

    const price = document.createElement("p");
    price.textContent = `$${game.price ?? "0.00"}`;

    const buyButton = document.createElement("button");
    buyButton.classList.add("buy-btn");
    buyButton.textContent = "Buy Now";

    gameInfo.appendChild(title);
    gameInfo.appendChild(price);
    gameInfo.appendChild(buyButton);

    gameCard.appendChild(gameImage);
    gameCard.appendChild(gameInfo);
    gamesContainer.appendChild(gameCard);
  });
}

fetchGames().then(() => {
  displayGames(AllGames);
});
