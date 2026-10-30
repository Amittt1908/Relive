import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, Bookmark, Tag, Truck, ArrowRight } from 'lucide-react';
import { ProductImage } from '../components/ProductArt';
import ProductCard from '../components/ProductCard';
import QtyStepper from '../components/QtyStepper';
import EmptyState from '../components/EmptyState';
import DemoNote from '../components/DemoNote';
import { useStore, maxQtyFor } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { computeTotals, validatePromo } from '../lib/pricing';
import { products } from '../data/products';
import { FREE_SHIPPING_THRESHOLD } from '../data/content';
import { money } from '../lib/format';

export function SummaryRows({ t }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between"><dt className="text-graphite">Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-graphite">Discount{t.promoApplied ? ` (${t.promoApplied})` : ''}</dt><dd className={t.discount ? 'text-sage-deep' : ''}>{t.discount ? `−${money(t.discount)}` : money(0)}</dd></div>
      <div className="flex justify-between"><dt className="text-graphite">Shipping ({t.method.name})</dt><dd>{t.shipping ? money(t.shipping) : 'Free'}</dd></div>
      <div className="flex justify-between border-t border-linen pt-3 text-base font-semibold"><dt>Total</dt><dd className="font-display text-2xl font-extrabold">{money(t.total)}</dd></div>
    </dl>
  );
}

export default function Cart() {
  const { cartLines, savedLines, updateQty, removeFromCart, saveForLater, moveSavedToCart, removeSaved, promo, setPromo } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState(promo);
  const [promoMsg, setPromoMsg] = useState(null);
  const t = computeTotals(cartLines, promo, 'standard');
  const progress = Math.min(100, (t.subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const inCart = new Set(cartLines.map((l) => l.id));
  const addons = products.filter((p) => p.price <= 450 && !inCart.has(p.id) && p.stock !== 'Sold out').slice(0, 4);

  const apply = (e) => {
    e.preventDefault();
    const r = validatePromo(code, t.subtotal);
    setPromoMsg(r);
    if (r.ok) { setPromo(r.code); toast(r.message); }
  };

  if (cartLines.length === 0) {
    return (
      <div className="container-x pt-10">
        <h1 className="text-hero">Cart</h1>
        <EmptyState art="duffel" color="#CDBE9E" title="Your cart is empty" body="Pieces you add will wait here, even if you refresh." cta="Continue shopping" to="/shop" />
        {savedLines.length > 0 && <SavedList lines={savedLines} move={moveSavedToCart} remove={removeSaved} />}
      </div>
    );
  }

  return (
    <div className="container-x pt-10">
      <h1 className="text-hero">Cart</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-6 rounded-3xl bg-sage-light/40 p-4" aria-live="polite">
            <p className="flex items-center gap-2 text-sm"><Truck size={16} aria-hidden="true" />{t.toFreeShipping > 0 ? <>Add <strong>{money(t.toFreeShipping)}</strong> more for free standard shipping.</> : 'You’ve unlocked free standard shipping.'}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ivory" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free shipping">
              <motion.div className="h-full rounded-full bg-sage-deep" initial={false} animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
            </div>
          </div>
          <ul>
            <AnimatePresence initial={false}>
              {cartLines.map((l) => (
                <motion.li key={l.key} layout exit={{ opacity: 0, x: -30, height: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-[96px_1fr] gap-4 border-b border-linen py-5 sm:grid-cols-[120px_1fr_auto]">
                  <Link to={`/product/${l.id}`} className="aspect-[5/6] overflow-hidden rounded-2xl"><ProductImage product={l.product} /></Link>
                  <div className="min-w-0">
                    <p className="text-sm text-graphite">{l.product.brand}</p>
                    <h2 className="font-sans text-base font-medium"><Link to={`/product/${l.id}`} className="link-u">{l.product.name}</Link></h2>
                    <p className="mt-1 text-sm text-graphite">Size {l.size}, {l.product.condition}</p>
                    <p className="mt-2 font-semibold sm:hidden">{money(l.price * l.qty)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <QtyStepper value={l.qty} max={maxQtyFor(l.product)} onChange={(q) => updateQty(l.key, q)} label={`Quantity for ${l.product.name}`} />
                      <button type="button" onClick={() => { saveForLater(l.key); toast('Saved for later.', 'info'); }} className="chip !min-h-[40px]"><Bookmark size={14} aria-hidden="true" />Save for later</button>
                      <button type="button" onClick={() => { removeFromCart(l.key); toast(`Removed ${l.product.name}.`, 'info'); }} className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream" aria-label={`Remove ${l.product.name}`}><Trash2 size={17} /></button>
                    </div>
                    {maxQtyFor(l.product) === 1 && <p className="mt-2 text-xs text-graphite">One-off piece: only one available.</p>}
                  </div>
                  <p className="hidden text-right font-display text-xl font-extrabold sm:block">{money(l.price * l.qty)}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <Link to="/shop" className="link-u mt-6 inline-block text-sm">Continue shopping</Link>
          {savedLines.length > 0 && <SavedList lines={savedLines} move={moveSavedToCart} remove={removeSaved} />}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[32px] bg-cream/70 p-6">
            <h2 className="text-2xl">Summary</h2>
            <form onSubmit={apply} className="mt-5" noValidate>
              <label htmlFor="promo" className="field-label flex items-center gap-2"><Tag size={14} aria-hidden="true" />Promo code</label>
              <div className="flex gap-2">
                <input id="promo" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="field !min-h-[44px] uppercase" placeholder="RELIVE10" aria-describedby="promo-msg" />
                <button className="btn-primary btn-sm !min-h-[44px]">Apply</button>
              </div>
              <p id="promo-msg" className={`mt-2 text-xs ${promoMsg && !promoMsg.ok ? 'text-terra' : 'text-graphite'}`} role={promoMsg ? 'status' : undefined}>
                {promoMsg ? promoMsg.message : 'Demo codes: RELIVE10, THRIFT200, FREESHIP'}
              </p>
              {promo && <button type="button" onClick={() => { setPromo(''); setCode(''); setPromoMsg(null); }} className="link-u mt-1 text-xs">Remove {promo}</button>}
              {promo && !t.promoApplied && <p className="mt-1 text-xs text-terra">{promo} no longer applies to this subtotal.</p>}
            </form>
            <div className="mt-6"><SummaryRows t={t} /></div>
            <button type="button" onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full">Proceed to checkout <ArrowRight size={17} aria-hidden="true" /></button>
            <DemoNote className="mt-4">Demo cart, no real payment</DemoNote>
          </div>
        </aside>
      </div>

      <section className="mt-24">
        <h2 className="mb-8 text-title">Small add-ons</h2>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{addons.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}</ul>
      </section>
    </div>
  );
}

function SavedList({ lines, move, remove }) {
  return (
    <section className="mt-14" aria-labelledby="saved-h">
      <h2 id="saved-h" className="text-2xl">Saved for later ({lines.length})</h2>
      <ul className="mt-4 space-y-3">
        {lines.map((l) => (
          <li key={l.key} className="flex items-center gap-4 rounded-3xl border border-linen p-3">
            <span className="h-16 w-14 shrink-0 overflow-hidden rounded-xl"><ProductImage product={l.product} /></span>
            <span className="min-w-0 flex-1"><span className="block truncate font-medium">{l.product.name}</span><span className="text-sm text-graphite">Size {l.size}, {money(l.price)}</span></span>
            <button type="button" onClick={() => move(l.key)} className="btn-ghost btn-sm">Move to cart</button>
            <button type="button" onClick={() => remove(l.key)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-cream" aria-label={`Remove ${l.product.name} from saved`}><Trash2 size={16} /></button>
          </li>
        ))}
      </ul>
    </section>
  );
}
