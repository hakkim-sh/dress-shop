"use strict";

const PRODUCTS_KEY = "shop_products";

function getProducts() {
  const saved = localStorage.getItem(PRODUCTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveProducts(prods) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
}

function showToast(msg) {
  const toast = document.querySelector(".toast");
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

function renderAdminTable() {
  const tbody = document.querySelector("#product-table-body");
  const prods = getProducts();
  tbody.innerHTML = "";

  if (prods.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No products added yet.</td></tr>`;
    return;
  }

  prods.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${p.image || 'https://via.placeholder.com/50'}" class="admin-thumb" alt=""></td>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>₹${p.price}</td>
      <td><span class="badge ${p.inStock ? 'badge-instock' : 'badge-out'}">${p.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
      <td>
        <button class="action-btn edit-btn" data-edit="${p.id}">Edit</button>
        <button class="action-btn delete-btn" data-del="${p.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

const form = document.querySelector("#product-form");
const imageFileInput = document.querySelector("#prod-image-file");
let uploadedImageData = "";

imageFileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = evt => {
      uploadedImageData = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const editId = document.querySelector("#edit-id").value;
  const prods = getProducts();
  const selectedSizes = [...document.querySelectorAll('input[name="sizes"]:checked')].map(cb => cb.value);

  const productData = {
    id: editId || "prod_" + Date.now(),
    name: document.querySelector("#prod-name").value.trim(),
    category: document.querySelector("#prod-category").value,
    price: Number(document.querySelector("#prod-price").value),
    originalPrice: Number(document.querySelector("#prod-original-price").value) || null,
    sizes: selectedSizes,
    image: uploadedImageData || document.querySelector("#prod-image-url").value.trim(),
    description: document.querySelector("#prod-desc").value.trim(),
    inStock: document.querySelector("#prod-stock").checked
  };

  if (editId) {
    const idx = prods.findIndex(p => p.id === editId);
    if (idx !== -1) {
      if (!productData.image) productData.image = prods[idx].image;
      prods[idx] = productData;
      showToast("Product updated successfully!");
    }
  } else {
    prods.unshift(productData);
    showToast("Product published successfully!");
  }

  saveProducts(prods);
  resetForm();
  renderAdminTable();
});

function resetForm() {
  form.reset();
  document.querySelector("#edit-id").value = "";
  uploadedImageData = "";
  document.querySelector("#form-title").textContent = "Add a New Product";
  document.querySelector("#submit-btn").textContent = "Publish Product";
  document.querySelector("#cancel-btn").style.display = "none";
}

document.querySelector("#cancel-btn").addEventListener("click", resetForm);

document.querySelector("#product-table-body").addEventListener("click", e => {
  const delBtn = e.target.closest("[data-del]");
  if (delBtn) {
    if (confirm("Delete this product?")) {
      const prods = getProducts().filter(p => p.id !== delBtn.dataset.del);
      saveProducts(prods);
      renderAdminTable();
      showToast("Product deleted!");
    }
    return;
  }

  const editBtn = e.target.closest("[data-edit]");
  if (editBtn) {
    const p = getProducts().find(item => item.id === editBtn.dataset.edit);
    if (!p) return;
    document.querySelector("#edit-id").value = p.id;
    document.querySelector("#prod-name").value = p.name;
    document.querySelector("#prod-category").value = p.category;
    document.querySelector("#prod-price").value = p.price;
    document.querySelector("#prod-original-price").value = p.originalPrice || "";
    document.querySelector("#prod-image-url").value = p.image || "";
    document.querySelector("#prod-desc").value = p.description || "";
    document.querySelector("#prod-stock").checked = p.inStock;

    document.querySelectorAll('input[name="sizes"]').forEach(cb => {
      cb.checked = (p.sizes || []).includes(cb.value);
    });

    document.querySelector("#form-title").textContent = "Edit Product";
    document.querySelector("#submit-btn").textContent = "Update Product";
    document.querySelector("#cancel-btn").style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

renderAdminTable();