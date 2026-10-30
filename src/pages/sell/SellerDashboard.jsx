import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Heart, Pencil, Pause, Play, Trash2, BadgeCheck, Plus, AlertTriangle } from 'lucide-react';
import AccountNav from '../../layouts/AccountNav';
import { ProductImage } from '../../components/ProductArt';
import EmptyState from '../../components/EmptyState';
import DemoNote from '../../components/DemoNote';
import Modal from '../../components/Modal';
import { useStore, listingToProduct } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { money, date } from '../../lib/format';

function SalesChart({ sold }) {
  const weeks = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 8 }).map((_, i) => {
      const end = now - (7 - i) * 7 * 86400000;
      const start = end - 7 * 86400000;
      const total = sold.filter((l) => { const t = new Date(l.soldAt).getTime(); return t > start && t <= end; }).reduce((s, l) => s + Number(l.price), 0);
      return { label: date(new Date(end).toISOString()).split(' ').slice(0, 2).join(' '), total };
    });
  }, [sold]);
  const max = Math.max(1, ...weeks.map((w) => w.total));
  return (
    <figure>
      <div className="flex h-48 items-end gap-2 sm:gap-3" role="img" aria-label={`Demo earnings per week for the last 8 weeks: ${weeks.map((w) => `${w.label} ${money(w.total)}`).join(', ')}`}>
        {weeks.map((w, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end">
            <span className="mb-1 text-center text-[10px] text-graphite">{w.total ? money(w.total) : ''}</span>
            <motion.div initial={{ height: 0 }} animate={{ height: `${(w.total / max) * 82 + 2}%` }} transition={{ delay: i * 0.05, type: 'spring', stiffness: 120, damping: 18 }} className={`rounded-t-xl ${w.total ? 'bg-sage-deep' : 'bg-linen'}`} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">{weeks.map((w, i) => <span key={i} className="flex-1 text-center text-[10px] text-graphite">{w.label}</span>)}</div>
      <figcaption className="mt-3 text-xs text-graphite">Weekly demo earnings from listings marked as sold.</figcaption>
    </figure>
  );
}

export default function SellerDashboard() {
  const { listings, setListingStatus, deleteListing, loadSampleListings, storageWarning } = useStore();
  const { toast } = useToast();
  const { state } = useLocation();
  const [tab, setTab] = useState('all');
  const [del, setDel] = useState(null);

  const active = listings.filter((l) => l.status === 'active');
  const sold = listings.filter((l) => l.status === 'sold');
  const earnings = sold.reduce((s, l) => s + Number(l.price), 0);
  const views = listings.reduce((s, l) => s + (l.views || 0), 0);
  const wishes = listings.reduce((s, l) => s + (l.wishlists || 0), 0);
  const shown = tab === 'all' ? listings : listings.filter((l) => l.status === tab);
  const recentSales = [...sold].sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt)).slice(0, 5);

  const header = (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero">Seller dashboard</h1>
        <Link to="/sell/create" className="btn-primary"><Plus size={18} aria-hidden="true" />New listing</Link>
      </div>
      <p className="mb-6 mt-3 text-graphite">Every number here is calculated from the demo listings stored in this browser.</p>
      <AccountNav />
    </>
  );

  if (listings.length === 0) {
    return (
      <div className="container-x pt-10">
        {header}
        <EmptyState art="hoodie" color="#6E7D5E" title="Your rail is empty" body="Create your first demo listing, or load a few sample listings to see how the dashboard works." cta="Create a listing" to="/sell/create">
          <button type="button" onClick={() => { loadSampleListings(); toast('Loaded six sample demo listings.'); }} className="link-u mt-4 text-sm font-medium">Load sample listings</button>
        </EmptyState>
      </div>
    );
  }

  const metrics = [
    ['Active listings', active.length],
    ['Sold items', sold.length],
    ['Demo earnings', money(earnings)],
    ['Views', views],
    ['Wishlist saves', wishes],
  ];

  return (
    <div className="container-x pt-10">
      {header}
      {storageWarning && <p className="mb-6 flex items-center gap-2 rounded-2xl bg-terra-light/50 p-3 text-sm" role="alert"><AlertTriangle size={16} aria-hidden="true" />Browser storage is full, so recent listing changes may not persist. Remove some photos or listings.</p>}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-linen py-8 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map(([k, v]) => (
          <div key={k}><dt className="text-sm text-graphite">{k}</dt><dd className="mt-1 font-display text-4xl font-extrabold tracking-tight">{v}</dd></div>
        ))}
      </dl>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="chart-h"><h2 id="chart-h" className="mb-6 text-2xl">Sales activity</h2><SalesChart sold={sold} /></section>
        <section aria-labelledby="ro-h">
          <h2 id="ro-h" className="mb-4 text-2xl">Recent orders</h2>
          {recentSales.length === 0 ? <p className="text-graphite">No sales yet. Mark a listing as sold to simulate one.</p> : (
            <ul className="divide-y divide-linen">
              {recentSales.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0"><span className="block truncate font-medium">{l.title}</span><span className="text-graphite">{l.buyer || 'Demo buyer'}, {date(l.soldAt)}</span></span>
                  <span className="font-semibold">{money(l.price)}</span>
                </li>
              ))}
            </ul>
          )}
          <DemoNote className="mt-4">Buyers and sales are simulated</DemoNote>
        </section>
      </div>

      <section className="mt-16" aria-labelledby="lm-h">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="lm-h" className="text-2xl">Manage listings</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter listings">
            {[['all', 'All'], ['active', 'Active'], ['paused', 'Paused'], ['sold', 'Sold']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setTab(v)} aria-pressed={tab === v} className={`chip ${tab === v ? 'chip-active' : ''}`}>{l} ({v === 'all' ? listings.length : listings.filter((x) => x.status === v).length})</button>
            ))}
          </div>
        </div>
        {shown.length === 0 ? <p className="py-10 text-center text-graphite">No {tab} listings.</p> : (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {shown.map((l) => {
                const p = listingToProduct(l);
                return (
                  <motion.li key={l.id} layout exit={{ opacity: 0, height: 0 }} className={`grid grid-cols-[72px_1fr] items-center gap-4 rounded-[24px] border p-3 sm:grid-cols-[80px_1fr_auto] ${state?.highlight === l.id ? 'border-sage-deep bg-sage-light/30' : 'border-linen'}`}>
                    <Link to={`/product/${l.id}`} className="aspect-[5/6] overflow-hidden rounded-xl"><ProductImage product={p} /></Link>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-sans font-medium"><Link to={`/product/${l.id}`} className="link-u">{l.title}</Link></h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${l.status === 'active' ? 'bg-sage-light text-sage-deep' : l.status === 'sold' ? 'bg-ink text-ivory' : 'bg-cream text-graphite'}`}>{l.status}</span>
                      </div>
                      <p className="text-sm text-graphite">{money(l.price)}, size {l.size}, listed {date(l.createdAt)}</p>
                      <p className="mt-1 flex gap-4 text-xs text-graphite"><span className="flex items-center gap-1"><Eye size={13} aria-hidden="true" />{l.views || 0} views</span><span className="flex items-center gap-1"><Heart size={13} aria-hidden="true" />{l.wishlists || 0} saves</span></p>
                    </div>
                    <div className="col-span-2 flex flex-wrap gap-1 sm:col-span-1">
                      {l.status !== 'sold' && <Link to={`/sell/create?edit=${l.id}`} className="chip !min-h-[38px]"><Pencil size={14} aria-hidden="true" />Edit</Link>}
                      {l.status === 'active' && <button type="button" onClick={() => { setListingStatus(l.id, 'paused'); toast('Listing paused.', 'info'); }} className="chip !min-h-[38px]"><Pause size={14} aria-hidden="true" />Pause</button>}
                      {l.status === 'paused' && <button type="button" onClick={() => { setListingStatus(l.id, 'active'); toast('Listing resumed.'); }} className="chip !min-h-[38px]"><Play size={14} aria-hidden="true" />Resume</button>}
                      {l.status === 'active' && <button type="button" onClick={() => { setListingStatus(l.id, 'sold'); toast('Marked as sold (demo).'); }} className="chip !min-h-[38px]"><BadgeCheck size={14} aria-hidden="true" />Mark sold</button>}
                      <button type="button" onClick={() => setDel(l)} className="grid h-[38px] w-[38px] place-items-center rounded-full text-terra hover:bg-terra-light/40" aria-label={`Delete ${l.title}`}><Trash2 size={16} /></button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <Modal open={!!del} onClose={() => setDel(null)} title="Delete this listing?">
        <p className="text-graphite">“{del?.title}” will be removed from this browser. This can’t be undone.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => setDel(null)} className="btn-ghost btn-sm">Keep it</button>
          <button type="button" onClick={() => { deleteListing(del.id); toast('Listing deleted.', 'info'); setDel(null); }} className="btn-terra btn-sm">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
