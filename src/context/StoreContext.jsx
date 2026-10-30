import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { products as catalogue } from '../data/products';
import { seedOrders, seedDonations, sellers } from '../data/content';
import { read, write, isArray } from '../lib/storage';
import { makeId } from '../lib/format';

const StoreCtx = createContext(null);

const LISTING_ART = {
  women: 'dress', men: 'shirt', streetwear: 'hoodie', vintage: 'jacket', shoes: 'sneaker', bags: 'tote', accessories: 'cap',
};

export const maxQtyFor = (p) => (!p || p.stock === 'Sold out' ? 0 : p.stock === 'Only 1 left' ? 1 : p.isListing ? 1 : 3);

// Turn a user's demo listing into the same shape as a catalogue product.
export function listingToProduct(l, profileName = 'You') {
  return {
    id: l.id,
    name: l.title,
    art: LISTING_ART[l.category] || 'tee',
    brand: l.brand || 'Unbranded',
    price: Number(l.price),
    originalPrice: Number(l.originalPrice),
    sizes: [l.size],
    color: { name: l.color, hex: '#9AAA8A' },
    material: l.material,
    condition: l.condition,
    gender: 'unisex',
    tags: [l.category],
    category: l.category,
    seller: 'me',
    sellerName: profileName,
    rating: 0,
    reviews: 0,
    stock: l.status === 'sold' ? 'Sold out' : 'Only 1 left',
    popularity: l.views || 0,
    addedAt: l.createdAt,
    description: l.description,
    images: l.photos?.length ? l.photos : ['front', 'back', 'detail'],
    photos: l.photos || [],
    requiresSize: l.size !== 'One Size',
    isListing: true,
    status: l.status,
  };
}

const persisted = (key, fallback) => read(key, fallback, isArray);

export function StoreProvider({ children }) {
  const [clothingPhotos, setClothingPhotos] = useState({ men: [], women: [] });
  const [clothingPhotosStatus, setClothingPhotosStatus] = useState('loading');
  const [clothingPhotosError, setClothingPhotosError] = useState('');
  const [cart, setCart] = useState(() => persisted('cart', []).filter((l) => l && l.id && l.qty > 0));
  const [wishlist, setWishlist] = useState(() => persisted('wishlist', []).filter((x) => typeof x === 'string'));
  const [saved, setSaved] = useState(() => persisted('saved', []));
  const [recent, setRecent] = useState(() => persisted('recent', []).filter((x) => typeof x === 'string'));
  const [orders, setOrders] = useState(() => persisted('orders', seedOrders));
  const [listings, setListings] = useState(() => persisted('listings', []));
  const [donations, setDonations] = useState(() => persisted('donations', seedDonations));
  const [promo, setPromo] = useState(() => read('promo', '', (v) => typeof v === 'string'));
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const categories = [
      ['men', 'mens-shirts'],
      ['women', 'tops'],
      ['women', 'womens-dresses'],
    ];

    Promise.all(categories.map(async ([group, category]) => {
      const response = await fetch(`https://dummyjson.com/products/category/${category}?limit=0`, { signal: controller.signal });
      if (!response.ok) throw new Error(`Clothing photo service returned ${response.status}.`);
      const data = await response.json();
      if (!Array.isArray(data.products)) throw new Error('Clothing photo service returned an unexpected response.');
      return {
        group,
        products: data.products.filter((product) => Array.isArray(product.images) && product.images.length > 0),
      };
    }))
      .then((groups) => {
        const photos = groups.reduce((result, { group, products }) => {
          result[group].push(...products);
          return result;
        }, { men: [], women: [] });
        setClothingPhotos(photos);
        setClothingPhotosStatus('ready');
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setClothingPhotosError(error.message || 'Could not load clothing photos.');
        setClothingPhotosStatus('error');
      });

    return () => controller.abort();
  }, []);

  useEffect(() => { write('cart', cart); }, [cart]);
  useEffect(() => { write('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { write('saved', saved); }, [saved]);
  useEffect(() => { write('recent', recent); }, [recent]);
  useEffect(() => { write('orders', orders); }, [orders]);
  useEffect(() => { write('donations', donations); }, [donations]);
  useEffect(() => { write('promo', promo); }, [promo]);
  useEffect(() => { setStorageWarning(!write('listings', listings)); }, [listings]);

  const listingProducts = useMemo(() => listings.map((l) => listingToProduct(l)), [listings]);

  const getProduct = useCallback(
    (id) => catalogue.find((p) => p.id === id) || listingProducts.find((p) => p.id === id) || null,
    [listingProducts]
  );

  /* ---------- Cart ---------- */
  const addToCart = useCallback(
    (id, size, qty = 1) => {
      const p = getProduct(id);
      if (!p) return { ok: false, message: 'This item is no longer available.' };
      if (p.isListing) return { ok: false, message: 'This is your own demo listing, so it can’t be bought.' };
      const max = maxQtyFor(p);
      if (max === 0) return { ok: false, message: `${p.name} is sold out.` };
      if (p.requiresSize && !size) return { ok: false, message: 'Choose a size first.' };
      const s = size || p.sizes[0];
      const key = `${id}__${s}`;
      const existing = cart.find((l) => l.key === key);
      const capped = !!existing && existing.qty >= max;
      setCart((c) => {
        const found = c.find((l) => l.key === key);
        if (found) return c.map((l) => (l.key === key ? { ...l, qty: Math.min(max, found.qty + qty) } : l));
        return [...c, { key, id, size: s, qty: Math.min(max, qty) }];
      });
      return capped
        ? { ok: true, message: `Only ${max} available, already in your cart.` }
        : { ok: true, message: `${p.name} added to cart.` };
    },
    [getProduct, cart]
  );

  const updateQty = useCallback(
    (key, qty) => {
      setCart((c) =>
        c.map((l) => {
          if (l.key !== key) return l;
          const max = maxQtyFor(getProduct(l.id)) || 1;
          return { ...l, qty: Math.max(1, Math.min(max, qty)) };
        })
      );
    },
    [getProduct]
  );

  const removeFromCart = useCallback((key) => setCart((c) => c.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => { setCart([]); setPromo(''); }, []);

  const saveForLater = useCallback((key) => {
    setCart((c) => {
      const line = c.find((l) => l.key === key);
      if (line) setSaved((s) => [line, ...s.filter((x) => x.key !== key)]);
      return c.filter((l) => l.key !== key);
    });
  }, []);

  const moveSavedToCart = useCallback((key) => {
    setSaved((s) => {
      const line = s.find((l) => l.key === key);
      if (line) setCart((c) => (c.some((x) => x.key === key) ? c : [...c, line]));
      return s.filter((l) => l.key !== key);
    });
  }, []);

  const removeSaved = useCallback((key) => setSaved((s) => s.filter((l) => l.key !== key)), []);

  const cartLines = useMemo(
    () =>
      cart
        .map((l) => {
          const p = getProduct(l.id);
          return p ? { ...l, product: p, price: p.price } : null;
        })
        .filter(Boolean),
    [cart, getProduct]
  );

  const savedLines = useMemo(
    () => saved.map((l) => { const p = getProduct(l.id); return p ? { ...l, product: p, price: p.price } : null; }).filter(Boolean),
    [saved, getProduct]
  );

  const cartCount = cartLines.reduce((n, l) => n + l.qty, 0);

  /* ---------- Wishlist ---------- */
  const isWished = useCallback((id) => wishlist.includes(id), [wishlist]);
  const toggleWish = useCallback(
    (id) => {
      const added = !wishlist.includes(id);
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [id, ...w]));
      if (added) setListings((ls) => ls.map((l) => (l.id === id ? { ...l, wishlists: (l.wishlists || 0) + 1 } : l)));
      return added;
    },
    [wishlist]
  );
  const removeWish = useCallback((id) => setWishlist((w) => w.filter((x) => x !== id)), []);

  /* ---------- Recently viewed ---------- */
  const trackView = useCallback((id) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12));
    setListings((ls) => ls.map((l) => (l.id === id ? { ...l, views: (l.views || 0) + 1 } : l)));
  }, []);

  /* ---------- Orders ---------- */
  const placeOrder = useCallback(({ lines, totals, address, payment, shipping }) => {
    const order = {
      id: makeId('RLV'),
      createdAt: new Date().toISOString(),
      status: 'Placed',
      items: lines.map((l) => ({ id: l.id, size: l.size, qty: l.qty, price: l.price })),
      totals: { subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total, promo: totals.promoApplied },
      address,
      payment,
      shipping,
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    setPromo('');
    return order;
  }, []);

  const cancelOrder = useCallback((id) => {
    setOrders((o) => o.map((x) => (x.id === id && ['Placed', 'Confirmed'].includes(x.status) ? { ...x, status: 'Cancelled' } : x)));
  }, []);

  /* ---------- Listings ---------- */
  const saveListing = useCallback((data) => {
    let id = data.id;
    setListings((ls) => {
      if (id && ls.some((l) => l.id === id)) return ls.map((l) => (l.id === id ? { ...l, ...data, updatedAt: new Date().toISOString() } : l));
      id = makeId('LST');
      return [{ ...data, id, status: 'active', views: 0, wishlists: 0, createdAt: new Date().toISOString() }, ...ls];
    });
    return id;
  }, []);

  const setListingStatus = useCallback((id, status) => {
    setListings((ls) => ls.map((l) => (l.id === id ? { ...l, status, soldAt: status === 'sold' ? new Date().toISOString() : l.soldAt } : l)));
  }, []);

  const deleteListing = useCallback((id) => {
    setListings((ls) => ls.filter((l) => l.id !== id));
    setWishlist((w) => w.filter((x) => x !== id));
  }, []);

  const loadSampleListings = useCallback(() => {
    const now = Date.now();
    const daysAgo = (n) => new Date(now - n * 86400000).toISOString();
    const buyers = ['Demo buyer R.', 'Demo buyer T.', 'Demo buyer S.', 'Demo buyer M.'];
    const sample = [
      ['Mustard Corduroy Jacket', 'vintage', 'Unbranded', 'M', 'Mustard', 'Corduroy', 'Vintage', 2499, 1199, 'sold', 3, 41, 9],
      ['Black Wide-Leg Trousers', 'women', 'Field & Fold', 'S', 'Black', 'Crepe', 'Like New', 2199, 899, 'sold', 10, 28, 4],
      ['Canvas High-Tops', 'shoes', 'Teal Street', 'UK 7', 'Ecru', 'Canvas', 'Gently Used', 2999, 999, 'sold', 19, 35, 6],
      ['Striped Breton Tee', 'women', 'Loomwell', 'M', 'Navy stripe', 'Cotton', 'Like New', 1299, 499, 'active', 2, 18, 3],
      ['Quilted Crossbody Bag', 'bags', 'Old Banyan', 'One Size', 'Olive', 'Nylon', 'Gently Used', 1899, 749, 'active', 6, 22, 5],
      ['Graphic Hoodie', 'streetwear', 'Northloom', 'L', 'Grey', 'Cotton fleece', 'Gently Used', 2499, 899, 'paused', 30, 12, 1],
    ].map(([title, category, brand, size, color, material, condition, originalPrice, price, status, ago, views, wishlists], i) => ({
      id: makeId('LST'), title, category, brand, size, color, material, condition, originalPrice, price, status, views, wishlists,
      description: `Demo listing: ${title.toLowerCase()} in ${condition.toLowerCase()} condition.`,
      photos: [], pickup: { method: 'Doorstep pickup', area: 'Demo Area', slot: 'Weekday mornings' },
      createdAt: daysAgo(ago + 7), soldAt: status === 'sold' ? daysAgo(ago) : undefined,
      buyer: status === 'sold' ? buyers[i % buyers.length] : undefined,
    }));
    setListings((ls) => [...sample, ...ls]);
  }, []);

  /* ---------- Donations ---------- */
  const addDonation = useCallback((data) => {
    const d = { ...data, id: makeId('DON'), createdAt: new Date().toISOString(), status: 'Scheduled (demo)' };
    setDonations((x) => [d, ...x]);
    return d;
  }, []);

  const value = useMemo(
    () => ({
      catalogue, sellers, getProduct, listingProducts,
      clothingPhotos, clothingPhotosStatus, clothingPhotosError,
      cart, cartLines, cartCount, addToCart, updateQty, removeFromCart, clearCart,
      saved, savedLines, saveForLater, moveSavedToCart, removeSaved,
      promo, setPromo,
      wishlist, isWished, toggleWish, removeWish,
      recent, trackView,
      orders, placeOrder, cancelOrder,
      listings, saveListing, setListingStatus, deleteListing, loadSampleListings, storageWarning,
      donations, addDonation,
    }),
    [getProduct, listingProducts, clothingPhotos, clothingPhotosStatus, clothingPhotosError, cart, cartLines, cartCount, addToCart, updateQty, removeFromCart, clearCart, saved, savedLines, saveForLater, moveSavedToCart, removeSaved, promo, wishlist, isWished, toggleWish, removeWish, recent, trackView, orders, placeOrder, cancelOrder, listings, saveListing, setListingStatus, deleteListing, loadSampleListings, storageWarning, donations, addDonation]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);
