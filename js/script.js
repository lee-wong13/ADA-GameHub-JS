//STATE

let AllGames = [];
const fallbackImage = "https://via.placeholder.com/300x170?text=No+Image";

//FUnctions
async function fetchGames() {
  const url = "https://v2.api.noroff.dev/gamehub";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
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

  games.forEach(function (game) {
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
    gameImage.style.background =
      "center / cover no-repeat url('" + imageUrl + "')";

    const gameInfo = document.createElement("div");
    gameInfo.classList.add("game-info");

    const title = document.createElement("h3");
    title.textContent = game.title || "Untitled Game";

    const price = document.createElement("p");
    let gamePriceText = game.price;
    if (gamePriceText === null || gamePriceText === undefined) {
      gamePriceText = "0.00";
    }
    price.textContent = "$" + gamePriceText;

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

// Filter functions
function isWithinPriceRange(price, rangeValue) {
  if (!rangeValue) return true;

  if (rangeValue === "100+") {
    return price >= 100;
  }

  const rangeParts = rangeValue.split("-");
  const minPrice = Number(rangeParts[0]);
  const maxPrice = Number(rangeParts[1]);

  return price >= minPrice && price <= maxPrice;
}

function applyFilters() {
  const genreSelect = document.getElementById("genre-filter");
  const releaseSelect = document.getElementById("release-filter");
  const ageSelect = document.getElementById("age-filter");
  const priceSelect = document.getElementById("price-filter");

  if (!genreSelect || !releaseSelect || !ageSelect || !priceSelect) {
    displayGames(AllGames);
    return;
  }

  const selectedGenre = genreSelect.value.toLowerCase();
  const selectedRelease = releaseSelect.value;
  const selectedAge = ageSelect.value;
  const selectedPrice = priceSelect.value;

  const filteredGames = AllGames.filter(function (game) {
    const gameGenre = game.genre ? game.genre.toLowerCase() : "";
    const gameRelease = game.released ? String(game.released) : "";
    const gameAge = game.ageRating ? String(game.ageRating) : "";
    const gamePrice = Number(game.price || 0);

    if (selectedGenre !== "" && gameGenre !== selectedGenre) {
      return false;
    }

    if (selectedRelease !== "" && gameRelease !== selectedRelease) {
      return false;
    }

    if (selectedAge !== "" && gameAge !== selectedAge) {
      return false;
    }

    if (!isWithinPriceRange(gamePrice, selectedPrice)) {
      return false;
    }

    return true;
  });

  displayGames(filteredGames);
}

function setupFilters() {
  const filterButton = document.getElementById("apply-filters-btn");
  if (!filterButton) return;

  filterButton.addEventListener("click", applyFilters);
}

fetchGames().then(function () {
  displayGames(AllGames);
  setupFilters();
});
