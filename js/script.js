//STATE

let AllGames = [];
const fallbackImage = "https://via.placeholder.com/300x170?text=No+Image";

//Functions
async function fetchGames() {
  updateCartCount();

  const url = "https://v2.api.noroff.dev/gamehub";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    const result = await response.json();
    AllGames = result.data || [];

    displayGames(AllGames);
    setupFilters();
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

function displayGames(games) {
  const gamesContainer = document.getElementById("games-container");
  if (!gamesContainer) return;

  gamesContainer.innerHTML = ""; // Clear previous content

  games.forEach((games, index) => {
    const html = `
      <div class"game-card">
        <a href="../product/index.html?id=${games.id}">
          <div class="game-img" style=" background: url(${games.image.url}) center center / cover no-repeat; " ></div>
        </a>
        <div class="game-info">
          <h3>${games.title}</h3>
          <p>$ ${games.price}</p>
          <button class="buy-btn" data-index="${index}">Add to Cart</button>
        </div>
      </div>
    `;
    gamesContainer.insertAdjacentHTML("beforeend", html);
  });

  gamesContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("buy-btn")) {
      const index = e.target.getAttribute("data-index");
      const selectedGame = games[index];

      addToCart(selectedGame);
    }
  });
}

// Filter functions

function setupFilters() {
  const genreSelect = document.getElementById("genre-filter");
  const releaseSelect = document.getElementById("release-filter");
  const ageSelect = document.getElementById("age-filter");
  const priceSelect = document.getElementById("price-filter");

  const filterButton = document.getElementById("apply-filters-btn");

  function priceRange(price, rangeValue) {
    if (!rangeValue) return true;

    if (rangeValue === "100+") {
      return price >= 100;
    }

    const [min, max] = rangeValue.split("-");
    return price >= Number(min) && price <= Number(max);
  }

  function applyFilters() {
    const selectedGenre = genreSelect.value;
    const selectedRelease = releaseSelect.value;
    const selectedAge = ageSelect.value;
    const selectedPrice = priceSelect.value;

    const filteredGames = AllGames.filter((game) => {
      if (selectedGenre !== "" && game.genre !== selectedGenre) {
        return false;
      }
      if (selectedRelease !== "" && game.released !== selectedRelease) {
        return false;
      }
      if (selectedAge !== "" && game.ageRating !== selectedAge) {
        return false;
      }
      if (!priceRange(game.price, selectedPrice)) {
        return false;
      }
      return true;
    });

    displayGames(filteredGames);
  }

  filterButton.addEventListener("click", applyFilters);
}

function addToCart(game) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === game.id);
  if (!existing) {
    cart.push(game);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
    updateCartCount();
  } else {
    alert("Item is already in cart");
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countElement = document.getElementById("cart-count");
  if (countElement) countElement.innerText = cart.length;
}

fetchGames();
