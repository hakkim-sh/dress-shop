"use strict";

const PRODUCTS_KEY = "shop_products";
const defaultProducts = [
  // --- Women's Wear ---
  {
    id: "p1",
    name: "The Sunday Linen Dress",
    category: "Women",
    price: 2490,
    originalPrice: 3200,
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85",
    description: "An effortless airy linen dress made for sunlit afternoons.",
    inStock: true
  },
  {
    id: "p2",
    name: "Floral Wrap Summer Midi",
    category: "Women",
    price: 1990,
    originalPrice: 2600,
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85",
    description: "Charming floral wrap dress with delicate ruffle trims.",
    inStock: true
  },
  {
    id: "p3",
    name: "Pastel Lavender Slip Dress",
    category: "Women",
    price: 2890,
    originalPrice: 3499,
    sizes: ["S", "M", "XL"],
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=85",
    description: "Sleek satin slip dress with adjustable straps.",
    inStock: true
  },

  // --- Men's Wear ---
  {
    id: "p4",
    name: "The Everyday Oxford Shirt",
    category: "Men",
    price: 1890,
    originalPrice: 2400,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85",
    description: "Timeless breathable cotton Oxford made for every day.",
    inStock: true
  },
  {
    id: "p5",
    name: "Coastline Relaxed Trousers",
    category: "Men",
    price: 2190,
    originalPrice: 2800,
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85",
    description: "Tailored comfortable trousers for smart off-duty days.",
    inStock: true
  },
  {
    id: "p6",
    name: "Classic Denim Overshirt",
    category: "Men",
    price: 2350,
    originalPrice: 2999,
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=85",
    description: "Rugged vintage wash denim jacket with chest pockets.",
    inStock: true
  },

  // --- Traditional / Ethnic Wear ---
  {
    id: "p7",
    name: "Saffron Handloom Kurta Set",
    category: "Traditional / Ethnic",
    price: 2790,
    originalPrice: 3500,
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
    description: "Pure handloom cotton kurta with minimal embroidery work.",
    inStock: true
  },
  {
    id: "p8",
    name: "Rose Garden Chanderi Saree",
    category: "Traditional / Ethnic",
    price: 4290,
    originalPrice: 5400,
    sizes: ["One Size"],
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85",
    description: "Heirloom-inspired soft Chanderi saree with gold borders.",
    inStock: true
  },
  {
    id: "p9",
    name: "Ivory Chikankari Anarkali",
    category: "Traditional / Ethnic",
    price: 3890,
    originalPrice: 4800,
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85",
    description: "Graceful handcrafted Lucknowi Chikankari flowing silhouette.",
    inStock: true
  },

  // --- Kids' Wear ---
  {
    id: "p10",
    name: "Cotton Dungaree & Tee Set",
    category: "Kids",
    price: 1290,
    originalPrice: 1699,
    sizes: ["XS", "S", "M"],
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=85",
    description: "Soft breathable organic cotton outfit designed for playtime.",
    inStock: true
  },
  {
    id: "p11",
    name: "Little Festive Kurta Pajama",
    category: "Kids",
    price: 1450,
    originalPrice: 1899,
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=85",
    description: "Comfortable ethnic festive wear for little boys and girls.",
    inStock: true
  },

  // --- Western Wear ---
  {
    id: "p12",
    name: "Daisy Daydream Crop Top",
    category: "Western",
    price: 1490,
    originalPrice: 1900,
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=85",
    description: "Lightweight and easy-to-style silhouette for sunny days.",
    inStock: true
  }
];

let products = [];
const cart = new Map();
let activeFilter = "All";

function loadProducts() {
  const saved = localStorage.getItem(PRODUCTS_KEY);
  // Storage empty ah irunthaalum sari, kuraivaana data irunthaalum fresh 12 items update aagum
  if (!saved || JSON.parse(saved).length < defaultProducts.length) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(saved);
}

function showToast(msg) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

function renderProducts() {
  const grid = document.querySelector(".product-grid");
  if (!grid) return;
  const searchInput = document.querySelector("#product-search");
  const query = (searchInput ? searchInput.value : "").toLowerCase();
  
  const filtered = products.filter(p => {
    const catMatch = activeFilter === "All" || p.category === activeFilter;
    const searchMatch = (p.name + " " + p.category).toLowerCase().includes(query);
    return catMatch && searchMatch;
  });

  grid.innerHTML = "";
  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${p.image || 'https://via.placeholder.com/400x500?text=Dress'}" alt="${p.name}" loading="lazy">
        <span class="product-label">${p.category}</span>
        ${!p.inStock ? '<span class="stock-label">OUT OF STOCK</span>' : ''}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="store-product-description">${p.description || ''}</p>
        <div class="product-bottom">
          <div class="price">₹${Number(p.price).toLocaleString("en-IN")} ${p.originalPrice ? `<del>₹${p.originalPrice}</del>` : ''}</div>
          <button class="add-button" data-add="${p.id}" ${!p.inStock ? 'disabled' : ''}>${p.inStock ? 'Add to cart +' : 'Sold Out'}</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  const countBadge = document.querySelector(".result-count");
  if (countBadge) countBadge.textContent = `${filtered.length} items`;
  const emptyMsg = document.querySelector(".empty-results");
  if (emptyMsg) emptyMsg.hidden = filtered.length !== 0;
}

function renderCart() {
  const container = document.querySelector(".cart-items");
  if (!container) return;
  container.innerHTML = "";
  let totalQty = 0;
  let subtotal = 0;

  cart.forEach((item, id) => {
    totalQty += item.quantity;
    subtotal += item.quantity * item.price;
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div class="cart-row-info">
        <strong>${item.name}</strong>
        <small>Qty: ${item.quantity} x ₹${item.price}</small>
      </div>
      <button class="remove-cart-btn" data-remove="${id}">Remove</button>
    `;
    container.appendChild(row);
  });

  const cartCount = document.querySelector(".cart-count");
  if (cartCount) cartCount.textContent = totalQty;
  const drawerCount = document.querySelector(".drawer-item-count");
  if (drawerCount) drawerCount.textContent = `(${totalQty})`;
  const subtotalEl = document.querySelector(".cart-subtotal strong");
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  const emptyBox = document.querySelector(".cart-empty");
  if (emptyBox) emptyBox.style.display = cart.size === 0 ? "block" : "none";
}

// Add to Cart
const gridElem = document.querySelector(".product-grid");
if (gridElem) {
  gridElem.addEventListener("click", e => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.dataset.add;
    const prod = products.find(p => p.id === id);
    if (!prod || !prod.inStock) return;
    const existing = cart.get(id);
    cart.set(id, { ...prod, quantity: existing ? existing.quantity + 1 : 1 });
    renderCart();
    showToast(`${prod.name} added to cart!`);
  });
}

// Remove from Cart
const cartItemsElem = document.querySelector(".cart-items");
if (cartItemsElem) {
  cartItemsElem.addEventListener("click", e => {
    const btn = e.target.closest("[data-remove]");
    if (!btn) return;
    cart.delete(btn.dataset.remove);
    renderCart();
  });
}

// Drawers & Search
const cartToggle = document.querySelector(".cart-toggle");
if (cartToggle) cartToggle.addEventListener("click", () => document.body.classList.add("cart-open"));

const drawerClose = document.querySelector(".drawer-close");
if (drawerClose) drawerClose.addEventListener("click", () => document.body.classList.remove("cart-open"));

const backdrop = document.querySelector(".drawer-backdrop");
if (backdrop) backdrop.addEventListener("click", () => document.body.classList.remove("cart-open"));

const searchBox = document.querySelector("#product-search");
if (searchBox) searchBox.addEventListener("input", renderProducts);

// Category Buttons Filter
document.querySelectorAll(".filter-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});

// Category Cards Filter Link
document.querySelectorAll("[data-filter-link]").forEach(card => {
  card.addEventListener("click", () => {
    const cat = card.dataset.filterLink;
    activeFilter = cat;
    document.querySelectorAll(".filter-button").forEach(b => b.classList.toggle("active", b.dataset.filter === cat));
    renderProducts();
    const prodSection = document.querySelector("#products");
    if (prodSection) prodSection.scrollIntoView({ behavior: "smooth" });
  });
});

// Hamburger Mobile Menu
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const nav = document.querySelector(".main-nav");
    if (nav) nav.classList.toggle("is-open");
  });
}

// Storage sync with admin page
window.addEventListener("storage", e => {
  if (e.key === PRODUCTS_KEY) {
    products = loadProducts();
    renderProducts();
  }
});

// Initialize
products = loadProducts();
renderProducts();
renderCart();