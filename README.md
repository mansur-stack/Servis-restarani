# Savoria: Restaurant Website

A responsive restaurant site built with **HTML5, CSS3 and vanilla JavaScript (ES6+)**. No frameworks, no build step, no backend.

## Features
- Sticky navigation with mobile menu and live cart count
- Hero, guest favorites, and a full menu with category filters, search and price sorting
- Cart drawer: add, remove, change quantity (1 to 20), subtotal and total, saved in `localStorage`
- Checkout form (delivery or pickup) with validation and confirmation screen
- Table reservation form that blocks past dates and times
- Favorites, testimonials, contact form, toast messages, back-to-top button, scroll reveal animations
- Accessible: skip link, labelled inputs, visible focus, Escape and click-outside to close dialogs, `prefers-reduced-motion` respected
- Images lazy-load below the fold and fall back to a local placeholder if a URL fails

## Folder structure
```
Servis-restarani/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── images/
│   └── icons/favicon.svg
├── README.md
└── .gitignore
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```
Then visit http://localhost:8000.

## Deploy to GitHub Pages
1. Push the project to the `main` branch.
2. On GitHub: **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Your site appears at `https://mansur-stack.github.io/Servis-restarani/`.

## Frontend-only limitations
- **Orders and reservations are demonstrations.** They are saved in the visitor's own browser (`localStorage`) and are never sent to a restaurant.
- There are no real payments, accounts, authentication or server-side processing. `localStorage` is not secure and is not shared between devices or users.
- Do not enter payment details or passwords. Order records keep only items, total and order type; reservations keep name, date, time, guests and notes. Phone numbers and addresses are validated but not stored.
- Address, phone and opening hours are **placeholders**; replace them before going live.
- Dish photos load from Unsplash. Swap in your own files under `assets/images/` for production.
