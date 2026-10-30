import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { ProductImage } from '../components/ProductArt';
import EmptyState from '../components/EmptyState';
import DemoNote from '../components/DemoNote';
import { money, addDays, date } from '../lib/format';
import { SHIPPING_METHODS } from '../data/content';

export default function OrderSuccess() {
  const { state } = useLocation();
  const { orders, getProduct } = useStore();
  const reduce = useReducedMotion();
  const order = orders.find((o) => o.id === state?.orderId) || orders.find((o) => !o.seed);
  if (!order) return <div className="container-x pt-10"><EmptyState title="No recent demo order" body="Place a demo order and its confirmation will appear here." cta="Go to shop" to="/shop" /></div>;
  const method = SHIPPING_METHODS.find((m) => m.id === order.shipping) || SHIPPING_METHODS[0];
  const [lo, hi] = method.id === 'express' ? [1, 2] : method.id === 'pickup' ? [3, 5] : [4, 6];

  return (
    <div className="container-x pt-12">
      <div className="mx-auto max-w-3xl text-center">
        <svg viewBox="0 0 120 120" className="mx-auto h-32 w-32" aria-hidden="true">
          <motion.circle cx="60" cy="60" r="52" fill="none" stroke="#7E8F72" strokeWidth="6" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
          <motion.path d="M38 62 L54 77 L84 45" fill="none" stroke="#22211F" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.5 }} />
        </svg>
        <motion.h1 initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6 text-hero">Your pieces have a new home.</motion.h1>
        <p className="mt-4 text-lg text-graphite">Demo order <strong className="text-ink">{order.id}</strong> is placed. Nothing was charged and nothing will ship.</p>
        <DemoNote className="mt-4">Simulated order</DemoNote>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-[1.3fr_1fr]">
        <section className="rounded-[32px] bg-cream/70 p-6" aria-labelledby="sum-h">
          <h2 id="sum-h" className="text-xl">Order summary</h2>
          <ul className="my-4 space-y-3">
            {order.items.map((it) => {
              const p = getProduct(it.id);
              return (
                <li key={it.id + it.size} className="flex items-center gap-3 text-sm">
                  <span className="h-14 w-12 shrink-0 overflow-hidden rounded-lg">{p && <ProductImage product={p} />}</span>
                  <span className="flex-1">{p?.name || 'Item'} <span className="text-graphite">(Size {it.size}) ×{it.qty}</span></span>
                  <span>{money(it.price * it.qty)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="space-y-1.5 border-t border-linen pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-graphite">Subtotal</dt><dd>{money(order.totals.subtotal)}</dd></div>
            {order.totals.discount > 0 && <div className="flex justify-between"><dt className="text-graphite">Discount</dt><dd>−{money(order.totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-graphite">Shipping</dt><dd>{order.totals.shipping ? money(order.totals.shipping) : 'Free'}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{money(order.totals.total)}</dd></div>
          </dl>
        </section>
        <section className="space-y-4">
          <div className="rounded-[32px] border border-linen p-6 text-sm">
            <h2 className="mb-2 text-xl">Delivering to</h2>
            <p>{order.address.name}</p>
            <p className="text-graphite">{order.address.line}, {order.address.city}, {order.address.state} {order.address.postal}</p>
          </div>
          <div className="rounded-[32px] border border-linen p-6 text-sm">
            <h2 className="mb-2 text-xl">Estimated delivery</h2>
            <p>{date(addDays(order.createdAt, lo))} to {date(addDays(order.createdAt, hi))}</p>
            <p className="text-graphite">Illustrative window for {method.name.toLowerCase()} shipping. Paid with: {order.payment}.</p>
          </div>
        </section>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link to="/account/orders" className="btn-primary">View My Orders</Link>
        <Link to="/shop" className="btn-ghost">Continue Shopping</Link>
      </div>
    </div>
  );
}
