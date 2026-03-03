# ⚽ StrikeGreen — Football Jersey E-Commerce Frontend

A modern, green-themed football jersey e-commerce frontend built with React, SCSS Modules, and Redux Toolkit — inspired by the clean product layout of professional sportswear stores.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.jsx           # Sticky header with nav, search, cart
│   │   └── Header.module.scss
│   ├── Hero/
│   │   ├── Hero.jsx             # Full-width banner with gradient
│   │   └── Hero.module.scss
│   ├── FilterBar/
│   │   ├── FilterBar.jsx        # Brand pills, size pills, sort dropdown
│   │   └── FilterBar.module.scss
│   ├── ProductCard/
│   │   ├── ProductCard.jsx      # Individual product card with cart + wishlist
│   │   └── ProductCard.module.scss
│   ├── ProductGrid/
│   │   ├── ProductGrid.jsx      # Responsive 4-col grid layout
│   │   └── ProductGrid.module.scss
│   └── Footer/
│       ├── Footer.jsx           # Full footer with links + payment
│       └── Footer.module.scss
├── pages/
│   ├── Home.jsx                 # Main landing page
│   ├── Jerseys.jsx              # Jerseys listing page
│   └── Jerseys.module.scss
├── store/
│   ├── store.js                 # Redux store configuration
│   └── slices/
│       ├── productsSlice.js     # Filter, sort, search logic
│       └── cartSlice.js         # Cart CRUD + totals
├── data/
│   └── mockProducts.js          # 10 mock jersey products + filter data
├── styles/
│   ├── _variables.scss          # Design tokens, mixins, breakpoints
│   └── global.scss              # CSS reset + base styles
├── App.jsx
└── main.jsx
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `$primary-green` | `#1F6F50` |
| `$secondary-green` | `#2E8B57` |
| `$accent-green` | `#4CAF50` |
| `$background-light` | `#E8F5E9` |
| `$text-dark` | `#1B4332` |

**Fonts:** Barlow Condensed (headings/display) + DM Sans (body)

---

## ⚙️ Redux State

### `productsSlice`
- `allProducts` — full mock list
- `filteredProducts` — result after filters applied
- `selectedBrand`, `selectedSize`, `sortBy`, `searchQuery`
- Actions: `setBrandFilter`, `setSizeFilter`, `setSortBy`, `setSearchQuery`, `resetFilters`

### `cartSlice`
- `items[]` — `{ id, name, brand, price, image, selectedSize, quantity }`
- `isOpen` — drawer visibility
- Actions: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`, `toggleCart`
- Selectors: `selectCartCount`, `selectCartTotal`, `selectCartItems`, `selectCartIsOpen`

---

## 📱 Responsive Breakpoints

| Breakpoint | Grid Columns |
|------------|-------------|
| Desktop (>1024px) | 4 columns |
| Tablet (768–1024px) | 3 columns |
| Tablet small (576–768px) | 2 columns |
| Mobile (<576px) | 1 column |

---

## 🧩 Tech Stack

- **React 18** + **Vite 5**
- **Redux Toolkit 2** + **React-Redux 9**
- **SCSS Modules** with `className={classes["..."]}` pattern
- **No external UI libraries** — 100% custom components
- **Functional components** + hooks throughout
