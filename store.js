"use strict";

const PRODUCTS_KEY = "shop_products";
const defaultProducts = [
  { id: "p1", name: "The Sunday Linen Dress", category: "Women", price: 2490, originalPrice: 3200, sizes: ["S", "M", "L"], image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85", description: "An effortless linen dress.", inStock: true },
  { id: "p2", name: "The Everyday Oxford", category: "Men", price: 1890, originalPrice: 2400, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=85", description: "Timeless cotton Oxford shirt.", inStock: true },
  { id: "p3", name: "Saffron Handloom Kurta", category: "Traditional / Ethnic", price: 2790, originalPrice: 3500, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85", description: "Handloom-inspired classic.", inStock: true }
];

let products = [];
const cart = new Map();
let activeFilter = "All";

function loadProducts() {
  const saved = localStorage.getItem(PRODUCTS_KEY);
  if (!saved) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(saved);
}

function showToast(msg) {
  const toast = document.querySelector(".toast");
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

function renderProducts() {
  const grid = document.querySelector(".product-grid");
  const query = (document.querySelector("#product-search").value || "").toLowerCase();
  
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

  document.querySelector(".result-count").textContent = `${filtered.length} items`;
  document.querySelector(".empty-results").hidden = filtered.length !== 0;
}

function renderCart() {
  const container = document.querySelector(".cart-items");
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

  document.querySelector(".cart-count").textContent = totalQty;
  document.querySelector(".drawer-item-count").textContent = `(${totalQty})`;
  document.querySelector(".cart-subtotal strong").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  document.querySelector(".cart-empty").style.display = cart.size === 0 ? "block" : "none";
}

document.querySelector(".product-grid").addEventListener("click", e => {
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

document.querySelector(".cart-items").addEventListener("click", e => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  cart.delete(btn.dataset.remove);
  renderCart();
});

document.querySelector(".cart-toggle").addEventListener("click", () => document.body.classList.add("cart-open"));
document.querySelector(".drawer-close").addEventListener("click", () => document.body.classList.remove("cart-open"));
document.querySelector(".drawer-backdrop").addEventListener("click", () => document.body.classList.remove("cart-open"));
document.querySelector("#product-search").addEventListener("input", renderProducts);

document.querySelectorAll(".filter-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});

document.querySelectorAll("[data-filter-link]").forEach(card => {
  card.addEventListener("click", () => {
    const cat = card.dataset.filterLink;
    activeFilter = cat;
    document.querySelectorAll(".filter-button").forEach(b => b.classList.toggle("active", b.dataset.filter === cat));
    renderProducts();
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  });
});

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.toggle("is-open");
  });
}

// Storage sync with admin page
window.addEventListener("storage", e => {
  if (e.key === PRODUCTS_KEY) {
    products = loadProducts();
    renderProducts();
  }
});

// Initial load
products = loadProducts();
renderProducts();
renderCart();