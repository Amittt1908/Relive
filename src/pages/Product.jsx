import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Share2, Truck, ShieldCheck, Box, RotateCcw, Ruler, Info } from 'lucide-react';
import { ProductImage, ProductArt } from '../components/ProductArt';
import ProductCard, { WishButton, PriceTag } from '../components/ProductCard';
import QtyStepper from '../components/QtyStepper';
import Rating from '../components/Rating';
import Scene3D from '../components/Scene3D';
import DemoNote from '../components/DemoNote';
import SectionHead from '../components/SectionHead';
import { CONDITION_NOTES, products, discountPct } from '../data/products';
import { sellerById, productReviews, categoryBySlug } from '../data/content';
import { useStore, maxQtyFor } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { money, addDays, date } from '../lib/format';
import NotFound from './NotFound';

function Gallery({ p }) {
  const [i, setI] = useState(0);
  const views = p.images.length ? p.images : ['front'];
  const tabs = [...views.map((_, k) => k), '3d'];
  useEffect(() => setI(0), [p.id]);
  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-[5/6] overflow-hidden rounded-[32px] bg-cream">
        <AnimatePresence mode="wait">
          <motion.div key={String(i)} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
            {i === '3d' ? (
              <div className="h-full w-full" style={{ background: 'radial-gradient(circle at 50% 40%, #F6F2EA, #E9E1D3)' }}>
                <Scene3D name="product" art={p.art} color={p.color.hex} force className="h-full w-full" fallback={
                  <div className="grid h-full place-items-center p-10 text-center text-sm text-graphite"><div><ProductArt type={p.art} color={p.color.hex} bg={false} className="mx-auto h-60 w-48" label={p.name} /><p className="mt-3">3D preview isn’t available on this device.</p></div></div>
                } />
                <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ivory/80 px-3 py-1 text-xs backdrop-blur">Drag to rotate. Stylised 3D preview.</p>
              </div>
            ) : (
              <div className="group h-full w-full overflow-hidden"><ProductImage product={p} index={i} className="transition-transform duration-700 group-hover:scale-110" /></div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex gap-3" role="tablist" aria-label="Product images">
        {tabs.map((t) => (
          <button key={String(t)} type="button" role="tab" aria-selected={i === t} onClick={() => setI(t)} className={`relative h-20 w-16 overflow-hidden rounded-2xl border-2 ${i === t ? 'border-ink' : 'border-transparent'}`} aria-label={t === '3d' ? '3D preview' : `Image ${t + 1}`}>
            {t === '3d' ? <span className="grid h-full w-full place-items-center bg-ink text-ivory"><Box size={20} aria-hidden="true" /><span className="sr-only">3D</span></span> : <ProductImage product={p} index={t} />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, addToCart, trackView, recent } = useStore();
  const { toast } = useToast();
  const p = getProduct(id);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    if (!p) return;
    trackView(p.id);
    setSize(p.requiresSize ? '' : p.sizes[0]);
    setQty(1);
    setSizeError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const related = useMemo(() => (p ? products.filter((x) => x.id !== p.id && x.tags.some((t) => p.tags.includes(t))).sort((a, b) => b.popularity - a.popularity).slice(0, 4) : []), [p]);
  const sameSeller = useMemo(() => (p && !p.isListing ? products.filter((x) => x.id !== p.id && x.seller === p.seller).slice(0, 4) : []), [p]);
  const recentItems = recent.filter((r) => r !== id).map(getProduct).filter(Boolean).slice(0, 4);

  if (!p) return <NotFound title="This piece has moved on" body="It may have sold, or the link is wrong. There’s plenty more on the rail." />;

  const seller = p.isListing ? null : sellerById(p.seller);
  const max = maxQtyFor(p);
  const soldOut = max === 0;
  const off = discountPct(p);
  const cat = categoryBySlug(p.category);
  const canBuy = !soldOut && !p.isListing && (!p.requiresSize || !!size);
  const today = new Date().toISOString();

  const tryAdd = () => {
    if (p.requiresSize && !size) { setSizeError(true); return null; }
    const r = addToCart(p.id, size, qty);
    toast(r.message, r.ok ? 'success' : 'error');
    return r;
  };
  const buyNow = () => { const r = tryAdd(); if (r?.ok) navigate('/checkout'); };
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: p.name, text: `${p.name} on RELIVE (demo)`, url }); return; }
      await navigator.clipboard.writeText(url);
      toast('Link copied to clipboard.');
    } catch (e) {
      if (e?.name !== 'AbortError') toast('Sharing isn’t supported here. Copy the address bar link instead.', 'info');
    }
  };

  return (
    <div className="pt-8">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-graphite">
          <Link to="/shop" className="link-u">Shop</Link> <span aria-hidden="true">/</span>{' '}
          {cat && <><Link to={`/category/${cat.slug}`} className="link-u">{cat.name}</Link> <span aria-hidden="true">/</span>{' '}</>}
          <span className="text-ink">{p.name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Gallery p={p} />
          <div>
            <p className="text-graphite">{p.brand}</p>
            <h1 className="mt-1 text-title">{p.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <PriceTag price={p.price} originalPrice={p.originalPrice} className="!py-2 text-lg" />
              {off > 0 && <span className="rounded-full bg-terra-light/60 px-3 py-1 text-sm font-semibold text-terra">{off}% below original retail</span>}
            </div>
            <p className="mt-2 text-sm text-graphite">Original retail {money(p.originalPrice)} (demo figure)</p>
            {!p.isListing && <div className="mt-3"><Rating value={p.rating} count={p.reviews} /></div>}

            <div className="mt-6 rounded-3xl bg-cream/70 p-4">
              <p className="text-sm"><span className="font-semibold">{p.condition}.</span> <span className="text-graphite">{CONDITION_NOTES[p.condition]}</span></p>
              {(p.condition === 'Vintage' || p.brand !== 'Unbranded') && (
                <p className="mt-2 flex gap-2 text-xs text-graphite"><ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden="true" />Brands here are fictional and authenticity is not verified. In a live marketplace, branded items would be checked before dispatch.</p>
              )}
            </div>

            <fieldset className="mt-7">
              <legend className="mb-3 flex w-full items-center justify-between text-sm font-semibold">
                <span>Size{p.requiresSize && <span className="font-normal text-graphite"> (required)</span>}</span>
                <span className="flex items-center gap-1 font-normal text-graphite"><Ruler size={14} aria-hidden="true" />Measured by the seller</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => { setSize(s); setSizeError(false); }} aria-pressed={size === s} className={`chip min-w-[56px] justify-center ${size === s ? 'chip-active' : ''}`}>{s}</button>
                ))}
              </div>
              {sizeError && <p className="field-error" role="alert">Choose a size to continue.</p>}
            </fieldset>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-graphite">Colour</dt><dd className="mt-1 flex items-center gap-2"><span className="h-4 w-4 rounded-full border border-ink/10" style={{ background: p.color.hex }} />{p.color.name}</dd></div>
              <div><dt className="text-graphite">Material</dt><dd className="mt-1">{p.material}</dd></div>
              <div><dt className="text-graphite">Availability</dt><dd className={`mt-1 ${p.stock === 'Only 1 left' ? 'text-terra' : ''}`}>{p.isListing ? 'Your demo listing' : p.stock}</dd></div>
              {max > 1 && <div><dt className="text-graphite">Quantity</dt><dd className="mt-1"><QtyStepper value={qty} max={max} onChange={setQty} /></dd></div>}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={tryAdd} disabled={!canBuy} className="btn-primary flex-1 sm:flex-none sm:px-10">{soldOut ? 'Sold out' : 'Add to Cart'}</button>
              <button type="button" onClick={buyNow} disabled={!canBuy} className="btn-terra flex-1 sm:flex-none">Buy Now</button>
              <WishButton id={p.id} name={p.name} className="border border-linen" />
              <button type="button" onClick={share} className="grid h-11 w-11 place-items-center rounded-full border border-linen hover:bg-cream" aria-label="Share this product"><Share2 size={18} /></button>
            </div>
            {p.requiresSize && !size && !soldOut && !p.isListing && <p className="mt-3 text-sm text-graphite">Select a size to enable purchase.</p>}
            {p.isListing && <p className="mt-3 flex gap-2 text-sm text-graphite"><Info size={16} aria-hidden="true" />This is your own demo listing. Manage it from the <Link to="/seller/dashboard" className="underline">seller dashboard</Link>.</p>}

            <div className="mt-8 space-y-3 border-y border-linen py-6 text-sm">
              <p className="flex gap-3"><Truck size={18} className="shrink-0 text-sage-deep" aria-hidden="true" />Estimated delivery {date(addDays(today, 4))} to {date(addDays(today, 6))} with standard shipping. Illustrative only.</p>
              <p className="flex gap-3"><RotateCcw size={18} className="shrink-0 text-sage-deep" aria-hidden="true" />See the <Link to="/policies/returns" className="underline">demo returns policy</Link>.</p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl">About this piece</h2>
              <p className="mt-2 leading-relaxed text-graphite">{p.description}</p>
            </div>

            <div className="mt-8 flex items-center gap-4 rounded-full border border-linen p-2 pr-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-xl font-extrabold text-ivory" style={{ background: seller?.tone || '#4F5E47' }}>{(seller?.name || p.sellerName || 'Y')[0]}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{seller?.name || 'You (demo listing)'}</p>
                <p className="truncate text-sm text-graphite">{seller ? `${seller.city}, ${seller.sales} demo sales` : 'Listed from your seller dashboard'}</p>
              </div>
              {seller && <Rating value={seller.rating} />}
            </div>

            <DemoNote className="mt-6">Product, seller and review details are demo data</DemoNote>

            {!p.isListing && (
              <div className="mt-10">
                <h2 className="text-xl">Demo reviews for this seller</h2>
                <ul className="mt-4 space-y-4">
                  {productReviews.map((r) => (
                    <li key={r.name} className="border-b border-linen pb-4">
                      <div className="flex items-center justify-between"><span className="text-sm font-medium">{r.name}</span><Rating value={r.rating} /></div>
                      <p className="mt-1 text-sm text-graphite">{r.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {sameSeller.length > 0 && (
        <section className="container-x mt-24"><SectionHead title={`More from ${seller.name}`} />
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{sameSeller.map((x) => <li key={x.id}><ProductCard product={x} /></li>)}</ul>
        </section>
      )}
      {related.length > 0 && (
        <section className="container-x mt-24"><SectionHead title="You might also like" link={cat ? `/category/${cat.slug}` : '/shop'} />
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{related.map((x) => <li key={x.id}><ProductCard product={x} /></li>)}</ul>
        </section>
      )}
      {recentItems.length > 0 && (
        <section className="container-x mt-24"><SectionHead title="Recently viewed" />
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">{recentItems.map((x) => <li key={x.id}><ProductCard product={x} /></li>)}</ul>
        </section>
      )}
    </div>
  );
}
