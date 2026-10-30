import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import AccountNav from '../../layouts/AccountNav';
import { ProductImage } from '../../components/ProductArt';
import EmptyState from '../../components/EmptyState';
import DemoNote from '../../components/DemoNote';
import Modal from '../../components/Modal';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { ORDER_STEPS, orderStatus, canCancel } from '../../lib/orders';
import { money, date } from '../../lib/format';

function Timeline({ status }) {
  if (status === 'Cancelled') return <p className="inline-flex items-center gap-2 rounded-full bg-terra-light/60 px-3 py-1 text-sm text-terra"><X size={14} aria-hidden="true" />Cancelled</p>;
  const idx = ORDER_STEPS.indexOf(status);
  return (
    <ol className="flex items-center" aria-label={`Status: ${status}`}>
      {ORDER_STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 items-center last:flex-none">
          <span className="flex flex-col items-center gap-1">
            <span className={`grid h-7 w-7 place-items-center rounded-full ${i <= idx ? 'bg-sage-deep text-ivory' : 'border border-linen bg-ivory text-graphite'}`}>{i <= idx ? <Check size={14} aria-hidden="true" /> : null}</span>
            <span className={`text-[11px] sm:text-xs ${i === idx ? 'font-semibold' : 'text-graphite'}`}>{s}</span>
          </span>
          {i < ORDER_STEPS.length - 1 && <span className={`mx-1 mb-5 h-0.5 flex-1 ${i < idx ? 'bg-sage-deep' : 'bg-linen'}`} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

export default function Orders() {
  const { orders, getProduct, cancelOrder, addToCart } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const reorder = (o) => {
    let added = 0;
    o.items.forEach((it) => { const r = addToCart(it.id, it.size, it.qty); if (r.ok) added++; });
    if (added) { toast(`${added} item${added > 1 ? 's' : ''} added to your cart.`); navigate('/cart'); }
    else toast('Those pieces are no longer available.', 'error');
  };

  return (
    <div className="container-x pt-10">
      <h1 className="text-hero">My orders</h1>
      <p className="mb-6 mt-3 text-graphite">Includes sample demo orders and any you place through checkout.</p>
      <AccountNav />
      {orders.length === 0 ? (
        <EmptyState art="duffel" title="No orders yet" body="When you place a demo order it’ll show up here with its status." cta="Start shopping" to="/shop" />
      ) : (
        <ul className="space-y-6">
          {orders.map((o) => {
            const st = orderStatus(o);
            const isOpen = open === o.id;
            return (
              <li key={o.id} className="rounded-[32px] border border-linen bg-white/40 p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-extrabold tracking-tight">{o.id}</p>
                    <p className="text-sm text-graphite">{date(o.createdAt)}, {o.items.reduce((n, i) => n + i.qty, 0)} items, {money(o.totals.total)}</p>
                    {o.seed && <DemoNote className="mt-2">Sample order</DemoNote>}
                  </div>
                  <div className="flex -space-x-3">
                    {o.items.slice(0, 4).map((it) => { const p = getProduct(it.id); return <span key={it.id + it.size} className="h-16 w-14 overflow-hidden rounded-xl border-2 border-ivory">{p && <ProductImage product={p} />}</span>; })}
                  </div>
                </div>
                <div className="mt-6 max-w-xl"><Timeline status={st} /></div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setOpen(isOpen ? null : o.id)} className="btn-ghost btn-sm" aria-expanded={isOpen}>{isOpen ? 'Hide details' : 'View details'}</button>
                  <button type="button" onClick={() => reorder(o)} className="btn-ghost btn-sm">Reorder</button>
                  {canCancel(o) && <button type="button" onClick={() => setConfirm(o.id)} className="btn btn-sm text-terra hover:bg-terra-light/40">Cancel order</button>}
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-6 grid gap-6 border-t border-linen pt-6 md:grid-cols-2">
                        <ul className="space-y-2 text-sm">
                          {o.items.map((it) => { const p = getProduct(it.id); return <li key={it.id + it.size} className="flex justify-between gap-3"><span>{p?.name || 'Item'} (Size {it.size}) ×{it.qty}</span><span>{money(it.price * it.qty)}</span></li>; })}
                          <li className="flex justify-between border-t border-linen pt-2"><span className="text-graphite">Discount</span><span>−{money(o.totals.discount)}</span></li>
                          <li className="flex justify-between"><span className="text-graphite">Shipping</span><span>{o.totals.shipping ? money(o.totals.shipping) : 'Free'}</span></li>
                          <li className="flex justify-between font-semibold"><span>Total</span><span>{money(o.totals.total)}</span></li>
                        </ul>
                        <div className="text-sm">
                          <p className="font-semibold">Delivery address</p>
                          <p className="text-graphite">{o.address.name}, {o.address.line}, {o.address.city}, {o.address.state} {o.address.postal}</p>
                          <p className="mt-3 font-semibold">Payment</p>
                          <p className="text-graphite">{o.payment}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      )}
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Cancel this demo order?">
        <p className="text-graphite">Order {confirm} will be marked as cancelled. You can reorder the items later if they’re still available.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirm(null)} className="btn-ghost btn-sm">Keep order</button>
          <button type="button" onClick={() => { cancelOrder(confirm); toast(`Order ${confirm} cancelled.`, 'info'); setConfirm(null); }} className="btn-terra btn-sm">Cancel order</button>
        </div>
      </Modal>
    </div>
  );
}
