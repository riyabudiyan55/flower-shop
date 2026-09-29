/* ============================================================
   script.js
   All interactive behaviour for Bloom & Blossom.
   Organised into small modules:
     1. Storage helpers (cart, wishlist, users)
     2. Formatting helpers
     3. Navigation (hamburger, search, badges)
     4. Page initialisers (home, shop, product, cart, checkout,
        contact, login) — only the relevant one runs on each page,
        chosen via the body[data-page] attribute.
   ============================================================ */

/* ---------- 1. STORAGE HELPERS -------------------------------- */

const STORAGE = {
  cart: "bb_cart",
  wishlist: "bb_wishlist",
  users: "bb_users",
  currentUser: "bb_currentUser",
  coupon: "bb_coupon"
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  return readJSON(STORAGE.cart, []); // [{id, qty}]
}

function setCart(cart) {
  writeJSON(STORAGE.cart, cart);
  updateCartBadge();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  setCart(cart);
  showToast("Added to cart");
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  setCart(cart);
}

function updateCartQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, qty);
  setCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getWishlist() {
  return readJSON(STORAGE.wishlist, []);
}

function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) {
    list = list.filter((x) => x !== id);
  } else {
    list.push(id);
  }
  writeJSON(STORAGE.wishlist, list);
  return list.includes(id);
}

function getUsers() {
  return readJSON(STORAGE.users, []);
}

function getCurrentUser() {
  return readJSON(STORAGE.currentUser, null);
}

function setCurrentUser(user) {
  writeJSON(STORAGE.currentUser, user);
}

function logoutUser() {
  localStorage.removeItem(STORAGE.currentUser);
  window.location.href = "index.html";
}

/* ---------- 2. FORMATTING HELPERS ------------------------------ */

function formatINR(amount) {
  return "\u20B9" + Number(amount).toLocaleString("en-IN");
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) html += "\u2605";
  if (half) html += "\u00BD";
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) html += "\u2606";
  return `<span class="stars" aria-label="Rating ${rating} out of 5">${html}</span> <span class="rating-num">(${rating})</span>`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showToast(message) {
  let toast = document.getElementById("bb-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "bb-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- 3. NAVIGATION (runs on every page) ------------------ */

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = cartCount();
  });
}

function updateAuthLink() {
  const user = getCurrentUser();
  document.querySelectorAll(".auth-link").forEach((el) => {
    if (user) {
      el.textContent = "Hi, " + user.name.split(" ")[0];
      el.setAttribute("href", "login.html");
    } else {
      el.textContent = "Login";
      el.setAttribute("href", "login.html");
    }
  });
}

function initNavCommon() {
  // Hamburger toggle for mobile nav
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      hamburger.classList.toggle("active");
    });
  }

  // Search bar toggle (mobile icon reveals input)
  const searchToggle = document.querySelector(".search-toggle");
  const searchForm = document.querySelector(".nav-search");
  if (searchToggle && searchForm) {
    searchToggle.addEventListener("click", () => {
      searchForm.classList.toggle("open");
      const input = searchForm.querySelector("input");
      if (searchForm.classList.contains("open") && input) input.focus();
    });
  }

  // Global nav search: pressing enter sends user to shop.html?search=
  const navSearchForm = document.querySelector(".nav-search");
  if (navSearchForm) {
    navSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = navSearchForm.querySelector("input").value.trim();
      window.location.href = "shop.html" + (q ? "?search=" + encodeURIComponent(q) : "");
    });
  }

  updateCartBadge();
  updateAuthLink();
}

/* ---------- 4a. HOME PAGE --------------------------------------- */

function initHome() {
  const bestSellersEl = document.getElementById("best-sellers-grid");
  if (bestSellersEl) {
    const bestSellers = PRODUCTS.filter((p) => p.badge === "Best Seller").slice(0, 8);
    bestSellersEl.innerHTML = bestSellers.map(productCardHTML).join("");
    attachProductCardEvents(bestSellersEl);
  }

  // Newsletter form (demo only — stores email locally)
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector("input[type=email]").value.trim();
      const msg = document.getElementById("newsletter-msg");
      if (!validateEmail(email)) {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "form-msg error";
        return;
      }
      msg.textContent = "Thanks for subscribing! Watch your inbox for fresh offers.";
      msg.className = "form-msg success";
      newsletterForm.reset();
    });
  }

  // Category cards navigate to shop filtered by category
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const cat = card.dataset.category;
      window.location.href = "shop.html?category=" + encodeURIComponent(cat);
    });
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") card.click();
    });
  });
}

/* ---------- Shared product card builder ------------------------- */

function productCardHTML(p) {
  const wishlisted = getWishlist().includes(p.id);
  const priceHTML = p.discountPrice
    ? `<span class="price-old">${formatINR(p.price)}</span> <span class="price-new">${formatINR(p.discountPrice)}</span>`
    : `<span class="price-new">${formatINR(p.price)}</span>`;
  return `
    <article class="product-card" data-id="${p.id}">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      <button class="wishlist-btn ${wishlisted ? "active" : ""}" data-id="${p.id}" aria-label="Toggle wishlist for ${p.name}">
        ${wishlisted ? "\u2764" : "\u2661"}
      </button>
      <a href="product.html?id=${p.id}" class="product-image-link">
        <img src="${p.thumb}" alt="${p.name}" loading="lazy" class="product-image">
      </a>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
        ${renderStars(p.rating)}
        <div class="product-price">${priceHTML}</div>
        <div class="product-actions">
          <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
          <a href="product.html?id=${p.id}" class="btn btn-outline">View Details</a>
        </div>
      </div>
    </article>`;
}

function attachProductCardEvents(container) {
  container.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id), 1));
  });
  container.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const active = toggleWishlist(Number(btn.dataset.id));
      btn.classList.toggle("active", active);
      btn.textContent = active ? "\u2764" : "\u2661";
    });
  });
}

/* ---------- 4b. SHOP PAGE ---------------------------------------- */

function initShop() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;

  const searchInput = document.getElementById("shop-search");
  const categorySelect = document.getElementById("filter-category");
  const priceSelect = document.getElementById("filter-price");
  const sortSelect = document.getElementById("sort-select");
  const resultsCount = document.getElementById("results-count");
  const noResults = document.getElementById("no-results");

  // Pre-fill from URL query params (?search=, ?category=)
  const qSearch = getQueryParam("search");
  const qCategory = getQueryParam("category");
  if (qSearch) searchInput.value = qSearch;
  if (qCategory) categorySelect.value = qCategory;

  function applyFilters() {
    let list = [...PRODUCTS];
    const term = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const priceRange = priceSelect.value;
    const sort = sortSelect.value;

    if (term) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }
    if (category && category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (priceRange && priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      list = list.filter((p) => {
        const price = p.discountPrice || p.price;
        return price >= min && (max ? price <= max : true);
      });
    }
    if (sort === "price-asc") {
      list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sort === "price-desc") {
      list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sort === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "rating-desc") {
      list.sort((a, b) => b.rating - a.rating);
    }

    grid.innerHTML = list.map(productCardHTML).join("");
    attachProductCardEvents(grid);
    resultsCount.textContent = `${list.length} product${list.length !== 1 ? "s" : ""} found`;
    noResults.style.display = list.length === 0 ? "block" : "none";
  }

  [searchInput, categorySelect, priceSelect, sortSelect].forEach((el) => {
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  });

  applyFilters();
}

/* ---------- 4c. PRODUCT DETAILS PAGE ------------------------------ */

function initProductDetails() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const id = Number(getQueryParam("id"));
  const product = findProduct(id);

  if (!product) {
    container.innerHTML = `<p>Sorry, we couldn't find that product. <a href="shop.html">Back to shop</a></p>`;
    return;
  }

  document.title = product.name + " | Bloom & Blossom";

  const wishlisted = getWishlist().includes(product.id);
  const priceHTML = product.discountPrice
    ? `<span class="price-old">${formatINR(product.price)}</span> <span class="price-new">${formatINR(product.discountPrice)}</span>`
    : `<span class="price-new">${formatINR(product.price)}</span>`;

  container.innerHTML = `
    <div class="detail-image">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="detail-info">
      <span class="product-category">${product.category}</span>
      <h1>${product.name}</h1>
      ${renderStars(product.rating)} <span class="review-count">${product.reviews} reviews</span>
      <div class="product-price large">${priceHTML}</div>
      <p class="detail-description">${product.description}</p>

      <div class="detail-row">
        <span class="detail-label">Available colors:</span>
        <div class="color-swatches">
          ${product.colors.map((c) => `<span class="swatch">${c}</span>`).join("")}
        </div>
      </div>

      <div class="detail-row">
        <span class="detail-label">Quantity:</span>
        <div class="qty-selector">
          <button type="button" id="qty-minus" aria-label="Decrease quantity">\u2212</button>
          <input type="number" id="qty-input" value="1" min="1" max="20" aria-label="Quantity">
          <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn btn-primary" id="detail-add-cart">Add to Cart</button>
        <button class="btn btn-secondary" id="detail-buy-now">Buy Now</button>
        <button class="wishlist-btn detail-wishlist ${wishlisted ? "active" : ""}" id="detail-wishlist" aria-label="Toggle wishlist">
          ${wishlisted ? "\u2764 Wishlisted" : "\u2661 Add to Wishlist"}
        </button>
      </div>

      <div class="delivery-info">
        <p>\u{1F69A} Free delivery on orders above ${formatINR(FREE_DELIVERY_THRESHOLD)}</p>
        <p>\u{1F4C5} Order today, delivered within 24-48 hours</p>
        <p>\u21A9 Easy replacement if flowers arrive damaged</p>
      </div>
    </div>
  `;

  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    qtyInput.value = Math.min(20, Number(qtyInput.value) + 1);
  });
  document.getElementById("detail-add-cart").addEventListener("click", () => {
    addToCart(product.id, Number(qtyInput.value));
  });
  document.getElementById("detail-buy-now").addEventListener("click", () => {
    addToCart(product.id, Number(qtyInput.value));
    window.location.href = "checkout.html";
  });
  document.getElementById("detail-wishlist").addEventListener("click", (e) => {
    const active = toggleWishlist(product.id);
    e.target.classList.toggle("active", active);
    e.target.textContent = active ? "\u2764 Wishlisted" : "\u2661 Add to Wishlist";
  });

  // Related products: same category, excluding current
  const relatedGrid = document.getElementById("related-grid");
  if (relatedGrid) {
    const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    relatedGrid.innerHTML = related.map(productCardHTML).join("");
    attachProductCardEvents(relatedGrid);
  }
}

/* ---------- 4d. CART PAGE ----------------------------------------- */

function computeTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    const p = findProduct(item.id);
    if (!p) return sum;
    return sum + (p.discountPrice || p.price) * item.qty;
  }, 0);

  const couponCode = readJSON(STORAGE.coupon, null);
  let discount = 0;
  if (couponCode && COUPONS[couponCode] !== undefined) {
    discount =
      couponCode === "WELCOME50" ? 50 : Math.round(subtotal * COUPONS[couponCode]);
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const delivery = afterDiscount === 0 || afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = afterDiscount + delivery;

  return { subtotal, discount, delivery, total, couponCode };
}

function initCart() {
  const cartTableBody = document.getElementById("cart-items");
  if (!cartTableBody) return;

  function render() {
    const cart = getCart();
    const emptyMsg = document.getElementById("empty-cart-msg");
    const cartTable = document.getElementById("cart-table");
    const summary = document.getElementById("cart-summary");

    if (cart.length === 0) {
      cartTable.style.display = "none";
      summary.style.display = "none";
      emptyMsg.style.display = "block";
      return;
    }
    emptyMsg.style.display = "none";
    cartTable.style.display = "table";
    summary.style.display = "block";

    cartTableBody.innerHTML = cart
      .map((item) => {
        const p = findProduct(item.id);
        if (!p) return "";
        const price = p.discountPrice || p.price;
        return `
        <tr data-id="${p.id}">
          <td class="cart-product-cell">
            <img src="${p.thumb}" alt="${p.name}" class="cart-thumb">
            <div>
              <a href="product.html?id=${p.id}">${p.name}</a>
              <div class="cart-category">${p.category}</div>
            </div>
          </td>
          <td>${formatINR(price)}</td>
          <td>
            <div class="qty-selector small">
              <button type="button" class="cart-qty-minus" aria-label="Decrease quantity">\u2212</button>
              <input type="number" class="cart-qty-input" value="${item.qty}" min="1" max="20" aria-label="Quantity for ${p.name}">
              <button type="button" class="cart-qty-plus" aria-label="Increase quantity">+</button>
            </div>
          </td>
          <td>${formatINR(price * item.qty)}</td>
          <td><button class="remove-item-btn" aria-label="Remove ${p.name} from cart">\u2715</button></td>
        </tr>`;
      })
      .join("");

    const totals = computeTotals();
    document.getElementById("sum-subtotal").textContent = formatINR(totals.subtotal);
    document.getElementById("sum-discount").textContent = "-" + formatINR(totals.discount);
    document.getElementById("sum-delivery").textContent = totals.delivery === 0 ? "FREE" : formatINR(totals.delivery);
    document.getElementById("sum-total").textContent = formatINR(totals.total);

    const couponMsg = document.getElementById("coupon-msg");
    if (totals.couponCode) {
      couponMsg.textContent = `Coupon "${totals.couponCode}" applied!`;
      couponMsg.className = "form-msg success";
    }

    // Row-level event listeners
    cartTableBody.querySelectorAll("tr").forEach((row) => {
      const id = Number(row.dataset.id);
      row.querySelector(".cart-qty-minus").addEventListener("click", () => {
        const input = row.querySelector(".cart-qty-input");
        updateCartQty(id, Number(input.value) - 1);
        render();
      });
      row.querySelector(".cart-qty-plus").addEventListener("click", () => {
        const input = row.querySelector(".cart-qty-input");
        updateCartQty(id, Number(input.value) + 1);
        render();
      });
      row.querySelector(".cart-qty-input").addEventListener("change", (e) => {
        updateCartQty(id, Number(e.target.value));
        render();
      });
      row.querySelector(".remove-item-btn").addEventListener("click", () => {
        removeFromCart(id);
        render();
      });
    });
  }

  document.getElementById("apply-coupon-btn").addEventListener("click", () => {
    const codeInput = document.getElementById("coupon-input");
    const code = codeInput.value.trim().toUpperCase();
    const couponMsg = document.getElementById("coupon-msg");
    if (!code) return;
    if (COUPONS[code] !== undefined) {
      writeJSON(STORAGE.coupon, code);
      render();
    } else {
      couponMsg.textContent = "Invalid coupon code.";
      couponMsg.className = "form-msg error";
    }
  });

  render();
}

/* ---------- 4e. CHECKOUT PAGE -------------------------------------- */

function initCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  const cart = getCart();
  const summaryEl = document.getElementById("checkout-summary");
  const emptyNotice = document.getElementById("checkout-empty");

  if (cart.length === 0) {
    form.style.display = "none";
    summaryEl.style.display = "none";
    emptyNotice.style.display = "block";
    return;
  }

  const totals = computeTotals();
  summaryEl.innerHTML =
    cart
      .map((item) => {
        const p = findProduct(item.id);
        if (!p) return "";
        const price = p.discountPrice || p.price;
        return `<div class="summary-line"><span>${p.name} × ${item.qty}</span><span>${formatINR(price * item.qty)}</span></div>`;
      })
      .join("") +
    `
    <div class="summary-line"><span>Subtotal</span><span>${formatINR(totals.subtotal)}</span></div>
    <div class="summary-line"><span>Discount</span><span>-${formatINR(totals.discount)}</span></div>
    <div class="summary-line"><span>Delivery</span><span>${totals.delivery === 0 ? "FREE" : formatINR(totals.delivery)}</span></div>
    <div class="summary-line total"><span>Total</span><span>${formatINR(totals.total)}</span></div>
  `;

  // Set minimum delivery date to tomorrow
  const dateInput = document.getElementById("delivery-date");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split("T")[0];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCheckoutForm(form)) return;

    const orderId = "BB" + Date.now().toString().slice(-8);
    setCart([]);
    localStorage.removeItem(STORAGE.coupon);

    form.style.display = "none";
    summaryEl.style.display = "none";
    document.querySelector(".checkout-form-section h2")?.remove();

    document.getElementById("order-success").innerHTML = `
      <div class="success-box">
        <div class="success-icon">\u2713</div>
        <h2>Order Successfully Placed!</h2>
        <p>Thank you for shopping with Bloom &amp; Blossom. Your fresh flowers are on their way.</p>
        <p class="order-id">Order ID: <strong>${orderId}</strong></p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
        <a href="index.html" class="btn btn-outline">Back to Home</a>
      </div>`;
    document.getElementById("order-success").style.display = "block";
  });
}

function validateCheckoutForm(form) {
  let valid = true;
  const fields = [
    { id: "full-name", test: (v) => v.trim().length >= 2, msg: "Please enter your full name." },
    { id: "email", test: validateEmail, msg: "Please enter a valid email address." },
    { id: "phone", test: (v) => /^[0-9]{10}$/.test(v.trim()), msg: "Enter a valid 10-digit phone number." },
    { id: "address", test: (v) => v.trim().length >= 5, msg: "Please enter your full address." },
    { id: "city", test: (v) => v.trim().length >= 2, msg: "Please enter your city." },
    { id: "state", test: (v) => v.trim().length >= 2, msg: "Please enter your state." },
    { id: "pincode", test: (v) => /^[0-9]{6}$/.test(v.trim()), msg: "Enter a valid 6-digit PIN code." },
    { id: "delivery-date", test: (v) => v !== "", msg: "Please choose a delivery date." }
  ];

  fields.forEach(({ id, test, msg }) => {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(id + "-error");
    if (!test(input.value)) {
      if (errorEl) errorEl.textContent = msg;
      input.classList.add("invalid");
      valid = false;
    } else {
      if (errorEl) errorEl.textContent = "";
      input.classList.remove("invalid");
    }
  });

  const paymentChecked = form.querySelector('input[name="payment"]:checked');
  const paymentError = document.getElementById("payment-error");
  if (!paymentChecked) {
    paymentError.textContent = "Please select a payment method.";
    valid = false;
  } else {
    paymentError.textContent = "";
  }

  return valid;
}

/* ---------- 4f. CONTACT PAGE ---------------------------------------- */

function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById("contact-name");
    const email = document.getElementById("contact-email");
    const message = document.getElementById("contact-message");

    if (name.value.trim().length < 2) {
      document.getElementById("contact-name-error").textContent = "Please enter your name.";
      valid = false;
    } else {
      document.getElementById("contact-name-error").textContent = "";
    }

    if (!validateEmail(email.value)) {
      document.getElementById("contact-email-error").textContent = "Please enter a valid email.";
      valid = false;
    } else {
      document.getElementById("contact-email-error").textContent = "";
    }

    if (message.value.trim().length < 10) {
      document.getElementById("contact-message-error").textContent = "Message should be at least 10 characters.";
      valid = false;
    } else {
      document.getElementById("contact-message-error").textContent = "";
    }

    const successMsg = document.getElementById("contact-success");
    if (valid) {
      successMsg.textContent = "Thanks for reaching out! Our team will get back to you within 24 hours.";
      successMsg.className = "form-msg success";
      form.reset();
    } else {
      successMsg.textContent = "";
    }
  });
}

/* ---------- 4g. LOGIN / SIGNUP PAGE ----------------------------------- */

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(pw) {
  // At least 6 characters, one letter, one number
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(pw);
}

function initLogin() {
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  if (!loginForm && !signupForm) return;

  if (tabLogin && tabSignup) {
    tabLogin.addEventListener("click", () => switchAuthTab("login"));
    tabSignup.addEventListener("click", () => switchAuthTab("signup"));
  }

  function switchAuthTab(which) {
    const isLogin = which === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabSignup.classList.toggle("active", !isLogin);
    loginForm.classList.toggle("active", isLogin);
    signupForm.classList.toggle("active", !isLogin);
  }

  // Show/hide password toggles
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "Hide" : "Show";
      btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });
  });

  // Signup handling
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name");
      const email = document.getElementById("signup-email");
      const password = document.getElementById("signup-password");
      const msg = document.getElementById("signup-msg");
      let valid = true;

      if (name.value.trim().length < 2) {
        document.getElementById("signup-name-error").textContent = "Please enter your name.";
        valid = false;
      } else {
        document.getElementById("signup-name-error").textContent = "";
      }

      if (!validateEmail(email.value)) {
        document.getElementById("signup-email-error").textContent = "Please enter a valid email.";
        valid = false;
      } else if (getUsers().some((u) => u.email === email.value.trim().toLowerCase())) {
        document.getElementById("signup-email-error").textContent = "An account with this email already exists.";
        valid = false;
      } else {
        document.getElementById("signup-email-error").textContent = "";
      }

      if (!validatePassword(password.value)) {
        document.getElementById("signup-password-error").textContent =
          "Password must be at least 6 characters and include a letter and a number.";
        valid = false;
      } else {
        document.getElementById("signup-password-error").textContent = "";
      }

      if (!valid) {
        msg.textContent = "";
        return;
      }

      const users = getUsers();
      const newUser = {
        name: name.value.trim(),
        email: email.value.trim().toLowerCase(),
        password: password.value
      };
      users.push(newUser);
      writeJSON(STORAGE.users, users);
      setCurrentUser({ name: newUser.name, email: newUser.email });

      msg.textContent = "Account created! Redirecting to home...";
      msg.className = "form-msg success";
      setTimeout(() => (window.location.href = "index.html"), 1200);
    });
  }

  // Login handling
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email");
      const password = document.getElementById("login-password");
      const msg = document.getElementById("login-msg");
      let valid = true;

      if (!validateEmail(email.value)) {
        document.getElementById("login-email-error").textContent = "Please enter a valid email.";
        valid = false;
      } else {
        document.getElementById("login-email-error").textContent = "";
      }

      if (password.value.length === 0) {
        document.getElementById("login-password-error").textContent = "Please enter your password.";
        valid = false;
      } else {
        document.getElementById("login-password-error").textContent = "";
      }

      if (!valid) return;

      const users = getUsers();
      const match = users.find(
        (u) => u.email === email.value.trim().toLowerCase() && u.password === password.value
      );

      if (!match) {
        msg.textContent = "Incorrect email or password. New here? Try Sign Up instead.";
        msg.className = "form-msg error";
        return;
      }

      setCurrentUser({ name: match.name, email: match.email });
      msg.textContent = "Login successful! Redirecting...";
      msg.className = "form-msg success";
      setTimeout(() => (window.location.href = "index.html"), 1000);
    });
  }
}

/* ---------- BOOTSTRAP ------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  initNavCommon();

  const page = document.body.dataset.page;
  switch (page) {
    case "home":
      initHome();
      break;
    case "shop":
      initShop();
      break;
    case "product":
      initProductDetails();
      break;
    case "cart":
      initCart();
      break;
    case "checkout":
      initCheckout();
      break;
    case "contact":
      initContact();
      break;
    case "login":
      initLogin();
      break;
  }
});
