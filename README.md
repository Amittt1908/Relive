# RELIVE — Give Fashion Another Life

A frontend-only demo of a sustainable fashion marketplace: buy pre-loved clothes, sell your own, donate, and learn to reuse and recycle. There is **no backend, database, real authentication or payment gateway**. Everything is simulated in the browser and persisted to `localStorage`.

## Quick start

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview    # serves dist/ at http://localhost:4173
```

When deploying `dist/` to a static host, configure a single-page-app fallback so every path serves `index.html` (for example a `_redirects` rule on Netlify or a rewrite on Vercel), because the app uses real URL routes.

## Demo credentials

| Field    | Value                |
| -------- | -------------------- |
| Username | `Alka Jat`           |
| Email    | `alkajat99gmail.com` |
| Password | `alkajat`            |

Sign in with either the username or the email. The email is the exact demo text supplied in the brief. The login form is prefilled, and **Fill demo credentials** switches it to the email form.

The password is compared in memory only and is never stored. Only a session flag and a display profile are saved. **Remember me** keeps the session in `localStorage`; unticked, it lasts for the browser tab session. The sign-up page creates a local demo profile and signs you in; because passwords aren’t stored, signing in again later uses the demo credentials.

## Demo promo codes

| Code        | Effect                                  |
| ----------- | --------------------------------------- |
| `RELIVE10`  | 10% off the subtotal                    |
| `THRIFT200` | ₹200 off orders of ₹1,499 or more       |
| `FREESHIP`  | Free standard shipping                  |

Standard shipping is free over ₹999 (otherwise ₹79), express is ₹149, and the eco pickup point is free. Cart, checkout and order totals all come from one function, `computeTotals` in `src/lib/pricing.js`.

## Routes

Public: `/`, `/login`, `/signup`, `/forgot-password`, `/home`, `/shop`, `/category/:slug` (women, men, streetwear, vintage, shoes, bags, accessories, new-with-tags, under-499), `/product/:id`, `/wishlist`, `/cart`, `/sell`, `/donate`, `/reuse`, `/about`, `/contact`, `/help`, `/policies/privacy|terms|returns|shipping`, and a branded 404 for anything else.

Sign-in required (redirects to login, then back): `/checkout`, `/order-success`, `/account/profile`, `/account/orders`, `/account/donations`, `/sell/create`, `/seller/dashboard`, `/donate/schedule`.

## Project structure

```
src/
  App.jsx                 routes (lazy-loaded pages, protected routes)
  main.jsx                providers and router
  index.css               design tokens, components, utilities
  context/
    AuthContext.jsx       simulated session and editable profile
    StoreContext.jsx      cart, wishlist, saved, recently viewed, orders, listings, donations
    ToastContext.jsx      notifications
  data/
    products.js           30 fictional products
    content.js            sellers, categories, promo codes, seed orders/donations, FAQs, copy
  lib/                    storage (safe localStorage), pricing, formatting, order status
  layouts/                main layout, auth-free layout, route guard, account nav
  components/
    three/                React Three Fiber scenes (hero, product preview, donation)
    Scene3D.jsx           lazy-loads 3D with 2D fallbacks
    ProductArt.jsx        built-in SVG garment illustrations
    Navbar, Footer, ProductCard, Catalogue, SearchBox, Field, Modal, …
  pages/                  one file per page, grouped by area
```

## Notes on the demo

- **Imagery.** Product images are drawn in SVG by `ProductArt.jsx` (front, back and close-up views), so there are no remote image links to break. Photos uploaded in the listing wizard are resized in the browser and stored locally; failed images fall back to the illustration.
- **3D.** The hero, product preview and donation scenes are built from extruded garment silhouettes with React Three Fiber. They load only when scrolled near, and fall back to 2D illustrations when WebGL is unavailable, an error occurs, or the visitor prefers reduced motion.
- **Data persistence.** Saved under `relive:*` keys in `localStorage`. Invalid or corrupted values are ignored and replaced with defaults. To reset the demo, clear site data in your browser.
- **Seller dashboard.** Starts empty. Use **Load sample listings** to see sold items, earnings and the sales chart, or create your own listing. All metrics are calculated from the stored listings.
- **Orders.** Two sample orders are seeded. New orders start as *Placed*, show as *Confirmed* after two minutes, and can be cancelled while Placed or Confirmed.
- **Honesty labels.** Sellers, reviews, partners, team members, statistics and policies are fictional and labelled as demo content. No real email, pickup, payment or delivery ever happens.

## Tech

React 18, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion 11, Three.js with React Three Fiber 8, Lucide icons. Fonts: Bricolage Grotesque (headings) and DM Sans (body) from Google Fonts, with system fallbacks.
# Relive
