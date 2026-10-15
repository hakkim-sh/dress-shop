const products = {
  "linen-dress": { name: "The Sunday Linen Dress", category: "Women · Dresses", price: 2490, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85" },
  "everyday-shirt": { name: "The Everyday Oxford", category: "Men · Shirts", price: 1890, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85" },
  "saffron-kurta": { name: "Saffron Handloom Kurta", category: "Ethnic · Handloom", price: 2790, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85" },
  "coast-trousers": { name: "Coastline Relaxed Trousers", category: "Men · Bottoms", price: 2190, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85" },
  "rose-saree": { name: "Rose Garden Chanderi Saree", category: "Ethnic · Sarees", price: 4290, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85" },
  "woven-tote": { name: "The Woven Everyday Tote", category: "Accessories · Bags", price: 1590, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85" },
  "daisy-top": { name: "Daisy Daydream Top", category: "Women · Tops", price: 1490, image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=85" },
  "gold-hoops": { name: "Golden Hour Hoops", category: "Accessories · Jewellery", price: 890, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85" }
};

const cart = new Map();
const wishlist = new Set();
const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;
const cartCount = document.querySelector(".cart-count");
const wishlistCount = document.querySelector(".wishlist-count");
const drawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector(".cart-items");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function renderCart() {
  const quantity = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = [...cart.values()].reduce((sum, item) => sum + item.quantity * item.price, 0);
  cartCount.textContent = quantity;
  document.querySelector(".drawer-item-count").textContent = `(${quantity})`;
  document.querySelector(".cart-subtotal strong").textContent = formatPrice(subtotal);
  drawer.classList.toggle("is-empty", cart.size === 0);
  cartItems.innerHTML = [...cart.entries()].map(([id, item]) => `
    <div class="cart-row">
      <img src="${item.image}" alt="">
      <div class="cart-row-info">
        <strong>${item.name}</strong>
        <small>${item.category}</small>
        <div class="quantity-control" aria-label="Quantity for ${item.name}">
          <button data-quantity="${id}" data-change="-1" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button data-quantity="${id}" data-change="1" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <span class="cart-row-price">${formatPrice(item.price * item.quantity)}</span>
    </div>`).join("");
}

function setCartOpen(open) {
  document.body.classList.toggle("cart-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  document.querySelector(".drawer-backdrop").setAttribute("aria-hidden", String(!open));
  if (open) document.querySelector(".drawer-close").focus();
}

function addToCart(id) {
  const product = products[id];
  if (!product) return;
  const current = cart.get(id);
  cart.set(id, { ...product, quantity: current ? current.quantity + 1 : 1 });
  renderCart();
  showToast(`${product.name} added to your bag`);
}

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => addToCart(button.dataset.add));
});

document.querySelector(".cart-toggle").addEventListener("click", () => setCartOpen(true));
document.querySelector(".drawer-close").addEventListener("click", () => setCartOpen(false));
document.querySelector(".drawer-backdrop").addEventListener("click", () => setCartOpen(false));
document.querySelector(".continue-shopping").addEventListener("click", () => setCartOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setCartOpen(false);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const id = button.dataset.quantity;
  const item = cart.get(id);
  if (!item) return;
  item.quantity += Number(button.dataset.change);
  if (item.quantity <= 0) cart.delete(id);
  renderCart();
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  if (!cart.size) return;
  showToast("Checkout is coming soon — your bag is saved!");
});

document.querySelectorAll(".product-heart").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const id = card.dataset.id;
    if (wishlist.has(id)) {
      wishlist.delete(id);
      button.classList.remove("is-wishlisted");
      button.textContent = "♡";
      button.setAttribute("aria-pressed", "false");
    } else {
      wishlist.add(id);
      button.classList.add("is-wishlisted");
      button.textContent = "♥";
      button.setAttribute("aria-pressed", "true");
    }
    wishlistCount.textContent = wishlist.size;
  });
});

document.querySelector(".wishlist-header").addEventListener("click", () => {
  if (!wishlist.size) {
    showToast("Your wishlist is waiting for something lovely");
    return;
  }
  document.querySelectorAll(".product-card").forEach((card) => {
    card.hidden = !wishlist.has(card.dataset.id);
  });
  document.querySelectorAll(".filter-button").forEach((button) => button.classList.remove("active"));
  document.querySelector(".result-count").textContent = `${wishlist.size} saved`;
  document.querySelector(".empty-results").hidden = true;
  document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
});

let activeFilter = "All";
const searchInput = document.querySelector("#product-search");
function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll(".product-card").forEach((card) => {
    const categoryMatches = activeFilter === "All" || card.dataset.category === activeFilter;
    const searchMatches = card.dataset.title.toLowerCase().includes(query);
    const isVisible = categoryMatches && searchMatches;
    card.hidden = !isVisible;
    if (isVisible) visible += 1;
  });
  document.querySelector(".result-count").textContent = `${visible} ${visible === 1 ? "piece" : "pieces"}`;
  document.querySelector(".empty-results").hidden = visible !== 0;
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filter) => filter.classList.toggle("active", filter === button));
    filterProducts();
  });
});
searchInput.addEventListener("input", filterProducts);
document.querySelectorAll("[data-filter-link]").forEach((link) => {
  link.addEventListener("click", () => {
    activeFilter = link.dataset.filterLink;
    const matchingButton = [...document.querySelectorAll(".filter-button")].find((button) => button.dataset.filter === activeFilter);
    if (matchingButton) {
      document.querySelectorAll(".filter-button").forEach((button) => button.classList.toggle("active", button === matchingButton));
      filterProducts();
    }
  });
});
document.querySelector("#show-all").addEventListener("click", (event) => {
  event.preventDefault();
  activeFilter = "All";
  searchInput.value = "";
  document.querySelectorAll(".filter-button").forEach((button) => button.classList.toggle("active", button.dataset.filter === "All"));
  filterProducts();
});

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const isOpen = document.querySelector(".main-nav").classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});
document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const reviewTrack = document.querySelector(".testimonial-track");
document.querySelector("#review-prev").addEventListener("click", () => reviewTrack.scrollBy({ left: -reviewTrack.clientWidth / 2, behavior: "smooth" }));
document.querySelector("#review-next").addEventListener("click", () => reviewTrack.scrollBy({ left: reviewTrack.clientWidth / 2, behavior: "smooth" }));

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletter-email");
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  document.querySelector(".newsletter-message").textContent = "You're on the list! Keep an eye on your inbox for your 10% off code.";
  email.value = "";
});

renderCart();
filterProducts();
