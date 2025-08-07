// Product catalog
const products = [
  {
    id: 1,
    name: "Tie-Dye Lounge Set",
    price: 150,
    image: "./assets/photo-1432149877166-f75d49000351.jpg",
  },
  {
    id: 2,
    name: "Sunburst Tracksuit",
    price: 150,
    image: "./assets/photo-1515886657613-9f3515b0c78f.jpg",
  },
  {
    id: 3,
    name: "Retro Red Streetwear",
    price: 150,
    image: "./assets/photo-1529139574466-a303027c1d8b.jpg",
  },
  {
    id: 4,
    name: "Urban Sportwear Combo",
    price: 150,
    image: "./assets/photo-1632149877166-f75d49000351.jpg",
  },
  {
    id: 5,
    name: "Oversized Knit & Coat",
    price: 150,
    image: "./assets/photo-1608748010899-18f300247112.jpg",
  },
  {
    id: 6,
    name: "Chic Monochrome Blazer",
    price: 150,
    image: "./assets/photo-1588117260148-b47818741c74.jpg",
  },
];

// State
const selected = new Map();
const placeholders = document.querySelector(".selected-products");
const discountEl = document.getElementById("discount");
const subtotalEl = document.getElementById("subtotal");
const ctaBtn = document.getElementById("cta-btn");
const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (selected.size >= 3) return;

    const product = products[index];
    if (!selected.has(product.id)) {
      selected.set(product.id, { ...product, quantity: 1 });

      btn.innerHTML = `Added to Bundle <span>✔</span>`;
      btn.disabled = true;

      updateUI();
    }
  });
});

function updateUI() {
  renderPlaceholders();
  updateTotals();
  handleAddButtonState();
  updateProgress(); // <-- Add this
}


function renderPlaceholders() {
  placeholders.innerHTML = "";

  const values = Array.from(selected.values());

  for (let i = 0; i < 3; i++) {
    const imgSlot = document.createElement("div");
    imgSlot.classList.add("placeholder");

    const textSlot = document.createElement("div");
    textSlot.classList.add("placeholder");

    if (values[i]) {
      const { id, image, name, price, quantity } = values[i];

      imgSlot.innerHTML = `<img src="${image}" alt="${name}" class="placeholder-img" />`;

      textSlot.innerHTML = `
        <div class="placeholder-details">
          <p class="product-name">${name}</p>
          <p class="product-price">$${price.toFixed(2)}</p>
          <div class="qty-controls">
            <button onclick="updateQty(${id}, -1)">–</button>
            <span>${quantity}</span>
            <button onclick="updateQty(${id}, 1)">+</button>
          </div>
        </div>
      `;
    }

    placeholders.appendChild(imgSlot);
    placeholders.appendChild(textSlot);
  }
}
function updateProgress() {
  const progressFill = document.getElementById("progress-fill");
  const filledCount = selected.size; // 1, 2, or 3
  const percentage = Math.min((filledCount / 3) * 100, 100);
  progressFill.style.width = `${percentage}%`;
}


function updateQty(id, delta) {
  if (!selected.has(id)) return;

  const item = selected.get(id);
  item.quantity += delta;

  if (item.quantity <= 0) {
    selected.delete(id);

    const index = products.findIndex((p) => p.id === id);
    const btn = addButtons[index];
    btn.disabled = false;
    btn.innerHTML = `Add to Bundle <span>+</span>`;
  }

  updateUI();
}

function updateTotals() {
  const items = Array.from(selected.values());
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;

  if (itemCount > 0) {
    // Apply 30% discount always when item count > 0
    discount = total * 0.3;

    ctaBtn.disabled = false;
    ctaBtn.style.cursor = "pointer";

    if (itemCount < 3) {
      ctaBtn.textContent = `Add ${3 - itemCount} More to Save More`; // CTA encouragement
    } else {
      ctaBtn.textContent = "Add 3 Items to Cart"; // Final CTA
    }
  } else {
    ctaBtn.disabled = true;
    ctaBtn.textContent = `Add 3 Items to Proceed`;
    ctaBtn.style.cursor = "not-allowed";
  }

  discountEl.textContent = `- $${discount.toFixed(2)} (30%)`;
  subtotalEl.textContent = `$${(total - discount).toFixed(2)}`;
}


// Disable other buttons after 3 items
function handleAddButtonState() {
  if (selected.size >= 3) {
    addButtons.forEach((btn) => {
      if (!btn.disabled) {
        btn.disabled = true;
        btn.classList.add("disabled-btn");
      }
    });
  }
}

// On Proceed click
ctaBtn.addEventListener("click", () => {
  if (ctaBtn.disabled) return;

  ctaBtn.textContent = "Items Added to Cart";
  ctaBtn.disabled = true;
  ctaBtn.style.cursor = "not-allowed";
  ctaBtn.classList.add("disabled-btn");
});

