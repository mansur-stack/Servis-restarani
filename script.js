"use strict";
const u = (id, w = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const MENU = [
  {
    id: 1,
    name: "Margherita al Forno",
    cat: "Pizza",
    price: 78000,
    popular: true,
    img: u("1574071318508-1cdbab80d002"),
    desc: "Wood-fired crust, tomato, fior di latte, basil.",
  },
  {
    id: 2,
    name: "Spicy Salami Pizza",
    cat: "Pizza",
    price: 92000,
    img: u("1513104890138-7c749659a591"),
    desc: "Smoked salami, chili honey, mozzarella.",
  },
  {
    id: 3,
    name: "Smoked Beef Burger",
    cat: "Burgers",
    price: 85000,
    popular: true,
    img: u("1568901346375-23c9450c58cd"),
    desc: "Charred patty, cheddar, pickles, brioche bun.",
  },
  {
    id: 4,
    name: "Crispy Chicken Burger",
    cat: "Burgers",
    price: 69000,
    img: u("1606755962773-d324e0a13086"),
    desc: "Buttermilk chicken, slaw, garlic mayo.",
  },
  {
    id: 5,
    name: "Fire-Grilled Ribeye",
    cat: "Main Courses",
    price: 245000,
    popular: true,
    img: u("1544025162-d76694265947"),
    desc: "Dry-aged ribeye, roasted garlic, seasonal vegetables.",
  },
  {
    id: 6,
    name: "Lemon Herb Salmon",
    cat: "Main Courses",
    price: 168000,
    img: u("1467003909585-2f8a72700288"),
    desc: "Pan-seared salmon, lemon butter, new potatoes.",
  },
  {
    id: 7,
    name: "Harvest Grain Salad",
    cat: "Salads",
    price: 54000,
    img: u("1512621776951-a57141f2eefd"),
    desc: "Farro, roasted squash, feta, pomegranate.",
  },
  {
    id: 8,
    name: "Burrata & Tomato",
    cat: "Salads",
    price: 72000,
    img: u("1608897013039-887f21d8c804"),
    desc: "Creamy burrata, heirloom tomatoes, basil oil.",
  },
  {
    id: 9,
    name: "Chocolate Fondant",
    cat: "Desserts",
    price: 46000,
    popular: true,
    img: u("1624353365286-3f8d62daad51"),
    desc: "Warm molten center with vanilla cream.",
  },
  {
    id: 10,
    name: "Honey Cheesecake",
    cat: "Desserts",
    price: 42000,
    img: u("1533134242443-d4fd215305ad"),
    desc: "Baked cheesecake, wild honey, toasted walnuts.",
  },
  {
    id: 11,
    name: "Fresh Mint Lemonade",
    cat: "Drinks",
    price: 24000,
    img: u("1621263764928-df1444c5e859"),
    desc: "Pressed lemons, mint, sparkling water.",
  },
  {
    id: 12,
    name: "House Cardamom Tea",
    cat: "Drinks",
    price: 18000,
    img: u("1556679343-c7306c1976bc"),
    desc: "Black tea simmered with cardamom and orange peel.",
  },
];
const REVIEWS = [
  {
    name: "Dilnoza R.",
    stars: 5,
    text: "The ribeye was cooked exactly as I asked, and the staff never rushed us.",
    img: u("1494790108377-be9c29b29330", 120),
  },
  {
    name: "Jasur K.",
    stars: 5,
    text: "Best burger I have had this year. Pickup was ready on time.",
    img: u("1500648767791-00dcc994a43e", 120),
  },
  {
    name: "Malika T.",
    stars: 4,
    text: "Lovely room for a birthday dinner. The fondant is worth saving room for.",
    img: u("1438761681033-6461ffad8d80", 120),
  },
];
const CATEGORIES = ["All", ...new Set(MENU.map((d) => d.cat))];
const KEYS = {
  cart: "savoria_cart",
  favs: "savoria_favorites",
  orders: "savoria_orders",
  reservations: "savoria_reservations",
};
const MAX_QTY = 20;
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F2E9DC"/><circle cx="200" cy="150" r="60" fill="none" stroke="#B8472F" stroke-width="6"/><circle cx="200" cy="150" r="34" fill="none" stroke="#B8472F" stroke-width="3"/></svg>',
  );

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) =>
  new Intl.NumberFormat("en-US").format(n).replace(/,/g, " ") + " so'm";
const load = (k, fb) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? fb;
  } catch {
    return fb;
  }
};
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    toast("Browser storage is unavailable; changes will not be kept.", true);
  }
};
const byId = (id) => MENU.find((d) => d.id === id);

let cart = load(KEYS.cart, {});
let favs = load(KEYS.favs, []);
const view = { cat: "All", q: "", sort: "default" };

// Drop saved entries that no longer match the menu or have invalid quantities.
cart = Object.fromEntries(
  Object.entries(cart)
    .filter(([id, q]) => byId(+id) && Number.isInteger(q) && q > 0)
    .map(([id, q]) => [id, Math.min(q, MAX_QTY)]),
);

function toast(msg, isError = false) {
  const el = document.createElement("div");
  el.className = "toast" + (isError ? " err" : "");
  el.textContent = msg;
  $("#toasts").append(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---------- Rendering ---------- */
function dishCard(d) {
  const fav = favs.includes(d.id);
  return `<article class="card dish">
    <div class="dish-img"><img src="${d.img}" alt="${d.name}" loading="lazy" width="600" height="450"><span class="tag">${d.cat}</span>
      <button class="fav" data-action="fav" data-id="${d.id}" aria-pressed="${fav}" aria-label="${fav ? "Remove" : "Add"} ${d.name} ${fav ? "from" : "to"} favorites">${fav ? "&#9829;" : "&#9825;"}</button></div>
    <div class="dish-body"><h3>${d.name}</h3><p>${d.desc}</p>
      <div class="dish-foot"><span class="price">${money(d.price)}</span><button class="add" data-action="add" data-id="${d.id}">Add to cart</button></div></div>
  </article>`;
}
function renderPopular() {
  $("#popularGrid").innerHTML = MENU.filter((d) => d.popular)
    .map(dishCard)
    .join("");
}
function renderChips() {
  $("#categoryChips").innerHTML = CATEGORIES.map(
    (c) =>
      `<button class="chip" data-action="cat" data-cat="${c}" aria-pressed="${view.cat === c}">${c}</button>`,
  ).join("");
}
function renderMenu() {
  let list = MENU.filter(
    (d) =>
      (view.cat === "All" || d.cat === view.cat) &&
      d.name.toLowerCase().includes(view.q),
  );
  if (view.sort === "asc") list.sort((a, b) => a.price - b.price);
  if (view.sort === "desc") list.sort((a, b) => b.price - a.price);
  $("#menuGrid").innerHTML = list.map(dishCard).join("");
  $("#menuEmpty").hidden = list.length > 0;
}
function renderReviews() {
  $("#reviewGrid").innerHTML = REVIEWS.map(
    (r) => `<figure class="card review reveal">
    <div class="stars" role="img" aria-label="${r.stars} out of 5 stars">${"&#9733;".repeat(r.stars)}${"&#9734;".repeat(5 - r.stars)}</div>
    <blockquote>${r.text}</blockquote>
    <figcaption class="who"><img src="${r.img}" alt="Photo of ${r.name}" loading="lazy" width="44" height="44">${r.name}</figcaption></figure>`,
  ).join("");
  observeReveals();
}
const cartLines = () =>
  Object.entries(cart).map(([id, qty]) => ({ ...byId(+id), qty }));
const cartTotal = () => cartLines().reduce((s, l) => s + l.price * l.qty, 0);
const cartCount = () => cartLines().reduce((s, l) => s + l.qty, 0);

function renderCart() {
  const lines = cartLines();
  $("#cartCount").textContent = cartCount();
  $("#cartFoot").hidden = lines.length === 0;
  $("#cartItems").innerHTML = lines.length
    ? lines
        .map(
          (l) => `<div class="line">
      <img src="${l.img}" alt="${l.name}" width="64" height="64">
      <div><h4>${l.name}</h4><small>${money(l.price)}</small>
        <div class="qty"><button data-action="dec" data-id="${l.id}" aria-label="Decrease quantity of ${l.name}">&minus;</button><span aria-live="polite">${l.qty}</span><button data-action="inc" data-id="${l.id}" aria-label="Increase quantity of ${l.name}">+</button></div></div>
      <div><b>${money(l.price * l.qty)}</b><br><button class="rm" data-action="remove" data-id="${l.id}">Remove</button></div></div>`,
        )
        .join("")
    : `<div class="cart-empty"><div class="plate" aria-hidden="true">&#127869;</div><h3>Your cart is empty</h3><p>Pick something from the menu and it will show up here.</p><button class="btn btn-primary" data-action="close-menu">Browse menu</button></div>`;
  $("#cartSubtotal").textContent = $("#cartTotal").textContent =
    money(cartTotal());
}

/* ---------- Cart actions ---------- */
function setQty(id, qty) {
  if (qty <= 0) delete cart[id];
  else cart[id] = Math.min(qty, MAX_QTY);
  save(KEYS.cart, cart);
  renderCart();
}
function addToCart(id) {
  if ((cart[id] || 0) >= MAX_QTY)
    return toast(`Maximum ${MAX_QTY} per dish.`, true);
  setQty(id, (cart[id] || 0) + 1);
  toast(`${byId(id).name} added to cart`);
}
function toggleFav(id) {
  favs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  save(KEYS.favs, favs);
  renderPopular();
  renderMenu();
  toast(favs.includes(id) ? "Saved to favorites" : "Removed from favorites");
}

/* ---------- Overlays ---------- */
let lastFocus = null;
function openOverlay(el) {
  lastFocus = document.activeElement;
  el.hidden = false;
  document.body.style.overflow = "hidden";
  (el.querySelector("input:not([type=radio]),button.icon-btn") || el).focus();
}
function closeOverlays() {
  $$(".overlay").forEach((o) => (o.hidden = true));
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
function openCheckout() {
  if (!cartLines().length)
    return toast("Add something to your cart first.", true);
  $("#cartOverlay").hidden = true;
  $("#checkoutBody").hidden = false;
  $("#orderDone").hidden = true;
  renderSummary();
  toggleAddress();
  openOverlay($("#checkoutOverlay"));
}
function renderSummary() {
  $("#checkoutSummary").innerHTML =
    cartLines()
      .map(
        (l) =>
          `<div class="sum"><span>${l.qty} &times; ${l.name}</span><span>${money(l.price * l.qty)}</span></div>`,
      )
      .join("") +
    `<div class="sum"><b>Total</b><b>${money(cartTotal())}</b></div>`;
}
function toggleAddress() {
  const delivery = $("#checkoutForm").elements.type.value === "delivery";
  $("#addressField").hidden = !delivery;
}

/* ---------- Validation ---------- */
const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const RULES = {
  name: (v) =>
    v.trim().length < 2 ? "Enter your full name (at least 2 characters)." : "",
  phone: (v) =>
    /^\+?[0-9\s()-]{9,16}$/.test(v.trim())
      ? ""
      : "Enter a valid phone number, for example +998 90 123 45 67.",
  address: (v) => (v.trim().length < 6 ? "Enter your delivery address." : ""),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      ? ""
      : "Enter a valid email address.",
  message: (v) => (v.trim().length < 10 ? "Write at least 10 characters." : ""),
  guests: (v) =>
    +v >= 1 && +v <= 12 && Number.isInteger(+v)
      ? ""
      : "Choose between 1 and 12 guests.",
  date: (v) =>
    !v ? "Choose a date." : v < today() ? "Pick today or a future date." : "",
  time: (v, form) => {
    if (!v) return "Choose a time.";
    if (v < "11:00" || v > "22:00")
      return "We take bookings from 11:00 to 22:00.";
    if (form.elements.date.value === today()) {
      const n = new Date();
      if (
        v <=
        `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`
      )
        return "That time has already passed.";
    }
    return "";
  },
};
function validate(form) {
  let first = null;
  $$("input[name],textarea[name]", form).forEach((el) => {
    const field = el.closest(".field");
    const rule = RULES[el.name];
    if (!rule || field.hidden) return;
    const msg = rule(el.value, form);
    field.classList.toggle("invalid", !!msg);
    el.setAttribute("aria-invalid", !!msg);
    const err = $(".error", field);
    if (err) err.textContent = msg;
    if (msg && !first) first = el;
  });
  if (first) first.focus();
  return !first;
}

/* ---------- Forms ---------- */
const orderId = () => "SV-" + Date.now().toString(36).toUpperCase();
function submitCheckout(e) {
  e.preventDefault();
  const form = e.target;
  if (!validate(form)) return;
  const btn = $("#placeOrder");
  btn.disabled = true;
  btn.textContent = "Placing order...";
  setTimeout(() => {
    const id = orderId();
    const type = form.elements.type.value;
    // Only items, total and type are stored. Name, phone and address are not kept.
    const orders = load(KEYS.orders, []);
    orders.push({
      id,
      type,
      total: cartTotal(),
      items: cartLines().map((l) => ({ name: l.name, qty: l.qty })),
      placedAt: new Date().toISOString(),
    });
    save(KEYS.orders, orders);
    const name = form.elements.name.value.trim().split(" ")[0];
    $("#orderDoneText").textContent =
      `Thank you, ${name}. Demo order ${id} (${type}) for ${money(cartTotal())} was recorded in this browser only. No restaurant received it.`;
    cart = {};
    save(KEYS.cart, cart);
    renderCart();
    form.reset();
    toggleAddress();
    $("#checkoutBody").hidden = true;
    $("#orderDone").hidden = false;
    btn.disabled = false;
    btn.textContent = "Place order";
  }, 700);
}
function submitReservation(e) {
  e.preventDefault();
  const form = e.target;
  if (!validate(form)) return;
  const f = form.elements;
  const list = load(KEYS.reservations, []);
  // Phone number is validated but not stored.
  list.push({
    id: orderId(),
    name: f.name.value.trim(),
    date: f.date.value,
    time: f.time.value,
    guests: +f.guests.value,
    notes: f.notes.value.trim(),
  });
  save(KEYS.reservations, list);
  const msg = $("#reservationSaved");
  msg.textContent = `Table for ${f.guests.value} on ${f.date.value} at ${f.time.value} saved as a demo reservation. We have not contacted any restaurant.`;
  msg.hidden = false;
  toast("Reservation saved (demo)");
  form.reset();
  f.guests.value = 2;
}
function submitContact(e) {
  e.preventDefault();
  if (!validate(e.target)) return;
  toast("Thanks! This demo form does not send messages.");
  e.target.reset();
}

/* ---------- Effects ---------- */
let revealObserver;
function observeReveals() {
  if (!("IntersectionObserver" in window))
    return $$(".reveal").forEach((el) => el.classList.add("in"));
  revealObserver ??= new IntersectionObserver(
    (entries, obs) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        obs.unobserve(en.target);
        const c = en.target.querySelector("[data-count]");
        if (c) $$("[data-count]", en.target).forEach(countUp);
      }),
    { threshold: 0.15 },
  );
  $$(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
}
function countUp(el) {
  const target = +el.dataset.count;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce)
    return (el.textContent =
      new Intl.NumberFormat("en-US").format(target) + "+");
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / 1200, 1);
    el.textContent =
      new Intl.NumberFormat("en-US").format(Math.round(target * p)) +
      (p === 1 ? "+" : "");
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

/* ---------- Events ---------- */
const actions = {
  add: (id) => addToCart(id),
  fav: (id) => toggleFav(id),
  inc: (id) => setQty(id, (cart[id] || 0) + 1),
  dec: (id) => setQty(id, (cart[id] || 0) - 1),
  remove: (id) => setQty(id, 0),
  "open-cart": () => {
    renderCart();
    openOverlay($("#cartOverlay"));
  },
  checkout: () => openCheckout(),
  close: () => closeOverlays(),
  "close-menu": () => {
    closeOverlays();
    location.hash = "#menu";
  },
  cat: (_, el) => {
    view.cat = el.dataset.cat;
    renderChips();
    renderMenu();
  },
};
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (el) return actions[el.dataset.action]?.(+el.dataset.id, el);
  if (e.target.classList.contains("overlay")) closeOverlays();
  const link = e.target.closest("a[data-cat]");
  if (link) {
    view.cat = link.dataset.cat;
    renderChips();
    renderMenu();
  }
  if (e.target.closest("#nav a")) closeNav();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeOverlays();
    closeNav();
  }
});
// Replace any image that fails to load with a local placeholder.
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG" && e.target.src !== PLACEHOLDER)
      e.target.src = PLACEHOLDER;
  },
  true,
);

function closeNav() {
  $("#nav").classList.remove("open");
  $("#navToggle").setAttribute("aria-expanded", "false");
}

function init() {
  $("#year").textContent = new Date().getFullYear();
  $("#rDate").min = today();
  renderPopular();
  renderChips();
  renderMenu();
  renderReviews();
  renderCart();
  $("#searchInput").addEventListener("input", (e) => {
    view.q = e.target.value.trim().toLowerCase();
    renderMenu();
  });
  $("#sortSelect").addEventListener("change", (e) => {
    view.sort = e.target.value;
    renderMenu();
  });
  $("#navToggle").addEventListener("click", (e) => {
    const open = $("#nav").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  $("#checkoutForm").addEventListener("submit", submitCheckout);
  $("#checkoutForm").addEventListener("change", (e) => {
    if (e.target.name === "type") toggleAddress();
  });
  $("#reservationForm").addEventListener("submit", submitReservation);
  $("#contactForm").addEventListener("submit", submitContact);
  const top = $("#toTop");
  addEventListener(
    "scroll",
    () => {
      top.hidden = scrollY < 600;
    },
    { passive: true },
  );
  top.addEventListener("click", () => scrollTo({ top: 0 }));
  observeReveals();
}
document.addEventListener("DOMContentLoaded", init);
