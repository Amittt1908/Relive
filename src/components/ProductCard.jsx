import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { ProductImage } from './ProductArt';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { discountPct } from '../data/products';
import { sellerById } from '../data/content';
import { money } from '../lib/format';

export function WishButton({ id, name, className = '' }) {
  const { isWished, toggleWish } = useStore();
  const { toast } = useToast();
  const on = isWished(id);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWish(id);
        toast(added ? `Saved ${name} to your wishlist.` : `Removed ${name} from your wishlist.`, added ? 'success' : 'info');
      }}
      className={`grid h-11 w-11 place-items-center rounded-full bg-ivory/90 backdrop-blur transition-colors hover:bg-ivory ${className}`}
      aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      aria-pressed={on}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={on ? 'on' : 'off'} initial={{ scale: 0.4 }} animate={{ scale: 1 }} exit={{ scale: 0.4 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
          <Heart size={18} className={on ? 'fill-terra text-terra' : 'text-ink'} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export function PriceTag({ price, originalPrice, className = '' }) {
  const off = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  return (
    <span className={`hangtag inline-flex items-baseline gap-2 bg-ink py-1.5 pr-3 text-ivory shadow-tag ${className}`}>
      <span className="font-display text-base font-extrabold tracking-tight">{money(price)}</span>
      {off > 0 && <span className="text-xs text-ivory/60 line-through">{money(originalPrice)}</span>}
    </span>
  );
}

export default function ProductCard({ product: p, layout = 'grid', tilt = 0 }) {
  const off = discountPct(p);
  const seller = p.isListing ? { name: p.sellerName || 'You' } : sellerById(p.seller);
  const soldOut = p.stock === 'Sold out';

  if (layout === 'list') {
    return (
      <article className="group grid grid-cols-[112px_1fr] gap-4 border-b border-linen py-4 sm:grid-cols-[160px_1fr_auto] sm:gap-6">
        <Link to={`/product/${p.id}`} className="relative block aspect-[5/6] overflow-hidden rounded-2xl">
          <ProductImage product={p} className="transition-transform duration-700 group-hover:scale-105" />
        </Link>
        <div className="min-w-0 self-center">
          <p className="text-sm text-graphite">{p.brand}</p>
          <h3 className="mt-0.5 font-display text-xl font-semibold leading-tight tracking-tight">
            <Link to={`/product/${p.id}`} className="link-u">{p.name}</Link>
          </h3>
          <p className="mt-2 line-clamp-2 max-w-lg text-sm text-graphite">{p.description}</p>
          <p className="mt-2 text-sm text-graphite">{p.condition} <span aria-hidden="true">/</span> {p.sizes.join(', ')} <span aria-hidden="true">/</span> {seller?.name}</p>
          <div className="mt-3 sm:hidden"><PriceTag price={p.price} originalPrice={p.originalPrice} /></div>
        </div>
        <div className="hidden flex-col items-end justify-center gap-3 sm:flex">
          <PriceTag price={p.price} originalPrice={p.originalPrice} />
          {off > 0 && <span className="text-sm font-medium text-terra">{off}% below retail</span>}
          <WishButton id={p.id} name={p.name} className="border border-linen" />
        </div>
      </article>
    );
  }

  return (
    <article className="group relative" style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}>
      <Link to={`/product/${p.id}`} className="relative block aspect-[5/6] overflow-hidden rounded-[22px] bg-cream" aria-label={`${p.name} by ${p.brand}, ${money(p.price)}`}>
        <ProductImage product={p} className={`transition-transform duration-[900ms] ease-out group-hover:scale-[1.07] ${soldOut ? 'opacity-50 grayscale' : ''}`} />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-ivory/90 px-2.5 py-1 text-xs font-medium backdrop-blur">{p.condition}</span>
          {p.stock === 'Only 1 left' && <span className="rounded-full bg-terra px-2.5 py-1 text-xs font-medium text-ivory">1 left</span>}
          {soldOut && <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-medium text-ivory">Sold out</span>}
          {p.isListing && <span className="rounded-full bg-sage-deep px-2.5 py-1 text-xs font-medium text-ivory">Your demo listing</span>}
        </div>
        <PriceTag price={p.price} originalPrice={p.originalPrice} className="absolute bottom-3 left-0" />
        {off > 0 && <span className="absolute bottom-4 right-3 hidden text-xs font-semibold text-ink/70 sm:block">−{off}%</span>}
      </Link>
      <WishButton id={p.id} name={p.name} className="absolute right-3 top-3" />
      <div className="mt-3 px-1">
        <p className="text-sm text-graphite">{p.brand}</p>
        <h3 className="mt-0.5 font-sans text-[0.98rem] font-medium leading-snug">
          <Link to={`/product/${p.id}`} className="link-u">{p.name}</Link>
        </h3>
        <p className="mt-1 text-xs text-graphite/80">Sizes {p.sizes.join(', ')}</p>
      </div>
    </article>
  );
}
