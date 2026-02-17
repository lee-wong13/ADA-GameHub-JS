let AllGames = [];
const fallbackImage = "https://via.placeholder.com/300x170?text=No+Image";
const detailContainer = document.getElementById("game-detail");

//Functions
async function fetchGames() {
  const url = "https://v2.api.noroff.dev/gamehub";

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const response = await fetch(`${url}/${id}`);
    const result = await response.json();
    const game = result.data;

    console.log(game);

    renderProductDetails(game);
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

function renderProductDetails(game) {
  console.log("render game");
  detailContainer.innerHTML = `
    <div class="game-container">
      <nav class="breadcrumb">Games &gt; ${game.genre} &gt; ${game.title}</nav>
      <div class="game-details-layout">
        <div class="main-image">
          <img src="${game.image.url}" alt="${game.image.alt}">
        </div>

        <div class="game-details">
          <h1>${game.title}</h1>
          <div class="price-tag">$${game.price}</div>

          <div class="specs">
            <div class="spec"><strong>Genre :</strong> ${game.genre}</div>
            <div class="spec"><strong>Release :</strong> ${game.released}</div>
          </div>

          <p class="description">${game.description}</p>

          <button class="add-to-cart-btn">Add to Cart</button>
          <p class="stock-status">In Stock</p>
        </div>
      </div>
    </div>
    
  `;
}

fetchGames();
