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
    // const sportsGames = result.data.filter(game => game.genre === "Sports")

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

  games.forEach((games) => {
    const html = `
      <div class"game-card">
        <a href="/product/index.html?id=${games.id}">
          <div class="game-img" style=" background: url(${games.image.url}) center center / cover no-repeat; " ></div>
        </a>
        <div class="game-info">
          <h3>${games.title}</h3>
          <p>$ ${games.price}</p>
          <button class="buy-btn">Buy Now</button>
        </div>
      </div>
    `;
    gamesContainer.insertAdjacentHTML("beforeend", html);
  });
}

// Filter functions

function setupFilters() {
  console.log("welcome to setupFilters");

  // อ้างตำแหน่ง select แต่ละตัว
  const genreSelect = document.getElementById("genre-filter");
  const releaseSelect = document.getElementById("release-filter");
  const ageSelect = document.getElementById("age-filter");
  const priceSelect = document.getElementById("price-filter");

  // ปุ่ม Apply Filters
  const filterButton = document.getElementById("apply-filters-btn");

  // ฟังก์ชันตรวจสอบช่วงราคา
  function priceRange(price, rangeValue) {
    if (!rangeValue) return true;

    if (rangeValue === "100+") {
      return price >= 100;
    }

    const [min, max] = rangeValue.split("-");
    return price >= Number(min) && price <= Number(max);
  }

  // ฟังก์ชันกรองเกม
  function applyFilters() {
    const selectedGenre = genreSelect.value;
    const selectedRelease = releaseSelect.value;
    const selectedAge = ageSelect.value;
    const selectedPrice = priceSelect.value;

    // กรองจาก array ของเกม (สมมติว่ามีตัวแปร gamesData.data)
    const filteredGames = AllGames.filter((game) => {
      // Genre
      if (selectedGenre !== "" && game.genre !== selectedGenre) {
        return false;
      }
      // Release
      if (selectedRelease !== "" && game.released !== selectedRelease) {
        return false;
      }

      if (selectedAge !== "" && game.ageRating !== selectedAge) {
        return false;
      }
      // Price
      if (!priceRange(game.price, selectedPrice)) {
        return false;
      }

      return true;
    });

    // แสดงผล
    displayGames(filteredGames);
  }

  // เมื่อกดปุ่ม Apply Filters → เรียก applyFilters
  filterButton.addEventListener("click", applyFilters);
}
fetchGames();

//Comments are for learning purposes only, and will be removed in the final version.
