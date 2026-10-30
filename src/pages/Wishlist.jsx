import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { ProductImage } from '../components/ProductArt';
import { PriceTag } from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { useStore, maxQtyFor } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

function WishItem({ p }) {
  const { removeWish, addToCart } = useStore();
  const { toast } = useToast();
  const [picking, setPicking] = useState(false);
  const soldOut = maxQtyFor(p) === 0;

  const move = (size) => {
    const r = addToCart(p.id, size, 1);
    toast(r.ok ? `${p.name} moved to your cart.` : r.message, r.ok ? 'success' : 'error');
    if (r.ok) removeWish(p.id);
    setPicking(false);
  };

  return (
    <motion.li layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="group">
      <div className="relative">
        <Link to={`/product/${p.id}`} className="block aspect-[5/6] overflow-hidden rounded-[24px]">
          <ProductImage product={p} className={`transition-transform duration-700 group-hover:scale-105 ${soldOut ? 'opacity-50 grayscale' : ''}`} />
        </Link>
        <button type="button" onClick={() => { removeWish(p.id); toast(`Removed ${p.name} from your wishlist.`, 'info'); }} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 hover:bg-ivory" aria-label={`Remove ${p.name} from wishlist`}><X size={17} /></button>
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${soldOut ? 'bg-ink text-ivory' : p.stock === 'Only 1 left' ? 'bg-terra text-ivory' : 'bg-sage-light text-sage-deep'}`}>{soldOut ? 'Sold out' : p.stock === 'Only 1 left' ? 'Only 1 left' : 'Available'}</span>
        <PriceTag price={p.price} originalPrice={p.originalPrice} className="absolute bottom-3 left-0" />
      </div>
      <p className="mt-3 text-sm text-graphite">{p.brand}</p>
      <h2 className="font-sans text-base font-medium"><Link to={`/product/${p.id}`} className="link-u">{p.name}</Link></h2>
      {picking ? (
        <div className="mt-3">
          <p className="mb-2 text-sm">Choose a size</p>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) => <button key={s} type="button" onClick={() => move(s)} className="chip !min-h-[34px]">{s}</button>)}
            <button type="button" onClick={() => setPicking(false)} className="link-u text-sm text-graphite">Cancel</button>
          </div>
        </div>
      ) : (
        <button type="button" disabled={soldOut || p.isListing} onClick={() => (p.requiresSize ? setPicking(true) : move(p.sizes[0]))} className="btn-ghost btn-sm mt-3 w-full">
          <ShoppingBag size={15} aria-hidden="true" />{soldOut ? 'Sold out' : 'Move to cart'}
        </button>
      )}
    </motion.li>
  );
}

export default function Wishlist() {
  const { wishlist, getProduct } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);
  return (
    <div className="container-x pt-10">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero">Wishlist</h1>
        <p className="text-graphite">{items.length} saved {items.length === 1 ? 'piece' : 'pieces'}. Saved in this browser.</p>
      </header>
      {items.length === 0 ? (
        <EmptyState art="tote" color="#B85C3C" title="Nothing saved yet" body="Tap the heart on any piece to keep it here while you decide." cta="Continue shopping" to="/shop" />
      ) : (
        <>
          <motion.ul layout className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>{items.map((p) => <WishItem key={p.id} p={p} />)}</AnimatePresence>
          </motion.ul>
          <div className="mt-16 text-center"><Link to="/shop" className="btn-ghost">Continue shopping</Link></div>
        </>
      )}
    </div>
  );
}
