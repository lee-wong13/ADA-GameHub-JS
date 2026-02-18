const cartContainer = document.getElementById("cart-col");
const subTotalValue = document.getElementById("subtotal-value");
const taxValue = document.getElementById("tax-value");
const totalValue = document.getElementById("total-value");

function init() {
  updateCartCount();
  renderCart();
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  // console.log(cart)
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your basket is empty.</p>";
    totalValue.innerHTML = "$0.00";
    subTotalValue.innerHTML = "$0.00";
    taxValue.innerHTML = "$0.00";
    return;
  }

  cartContainer.innerHTML = "";

  let total = 0;
  let subtotal = 0;
  let tax = 0;

  cart.forEach((games, index) => {
    subtotal += games.price;

    const html = `
      <div class="cart-item-info">
        <div class="item-img">
          <img src="${games.image.url}">
            <div class="cart-title-detail">
              <h3>${games.title}</h3>
              <p>${games.genre}</p>
            </div>
          </div>
          <div class="item-price-del">
            <div class="cart-item-price">$${games.price}</div>
            <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
          </div>
      </div>
    `;
    cartContainer.insertAdjacentHTML("beforeend", html);
  });

  tax = (subtotal * 10) / 100;
  total = subtotal + tax;

  subTotalValue.innerHTML = `$${subtotal.toFixed(2)}`;
  taxValue.innerHTML = `$${tax.toFixed(2)}`;
  totalValue.innerHTML = `$${total.toFixed(2)}`;
}

window.removeFromCart = function (index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  updateCartCount();
};

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countElement = document.getElementById("cart-count");
  if (countElement) countElement.innerText = cart.length;
}

init();

document.getElementById("checkout-btn")?.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  window.location.href = "confirmation/index.html";
});
