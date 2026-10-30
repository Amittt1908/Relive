import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Banknote, Smartphone, CreditCard, ShieldAlert } from 'lucide-react';
import { Field } from '../components/Field';
import { ProductImage } from '../components/ProductArt';
import EmptyState from '../components/EmptyState';
import DemoNote from '../components/DemoNote';
import { SummaryRows } from './Cart';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { computeTotals } from '../lib/pricing';
import { SHIPPING_METHODS } from '../data/content';
import { money, addDays, date } from '../lib/format';

export const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];
const STEPS = ['Delivery', 'Shipping', 'Review', 'Payment'];
const PAYMENTS = [
  { id: 'cod', name: 'Cash on Delivery (demo)', icon: Banknote, note: 'Simulated. No one will come to collect cash.' },
  { id: 'upi', name: 'Demo UPI payment', icon: Smartphone, note: 'Simulated approval. No UPI app opens and no ID is collected.' },
  { id: 'card', name: 'Demo card payment', icon: CreditCard, note: 'Simulated approval. No card number, expiry or CVV is collected.' },
];

export function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto scrollbar-none" aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s} className="flex shrink-0 items-center gap-2" aria-current={i === current ? 'step' : undefined}>
          <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold transition-colors ${i < current ? 'bg-sage-deep text-ivory' : i === current ? 'bg-ink text-ivory' : 'bg-cream text-graphite'}`}>
            {i < current ? <Check size={15} aria-hidden="true" /> : i + 1}
          </span>
          <span className={`text-sm ${i === current ? 'font-semibold' : 'text-graphite'}`}>{s}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-linen sm:w-10" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

export default function Checkout() {
  const { cartLines, promo, placeOrder } = useStore();
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const addr = profile.addresses?.[0] || {};
  const [step, setStep] = useState(0);
  const [d, setD] = useState({ name: profile.name || '', phone: profile.phone || '', line: addr.line || '', city: addr.city || '', state: addr.state || '', postal: addr.postal || '' });
  const [errors, setErrors] = useState({});
  const [method, setMethod] = useState('standard');
  const [payment, setPayment] = useState('');
  const [payErr, setPayErr] = useState('');
  const [placing, setPlacing] = useState(false);
  const t = computeTotals(cartLines, promo, method);
  const set = (k) => (e) => setD((x) => ({ ...x, [k]: e.target.value }));

  if (cartLines.length === 0 && !placing) {
    return <div className="container-x pt-10"><EmptyState art="tote" title="Nothing to check out" body="Add a piece to your cart first." cta="Browse the shop" to="/shop" /></div>;
  }

  const validate = () => {
    const e = {};
    if (d.name.trim().length < 2) e.name = 'Enter the recipient’s full name.';
    const digits = d.phone.replace(/\D/g, '');
    const ten = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (!/^[6-9]\d{9}$/.test(ten)) e.phone = 'Enter a 10-digit mobile number starting with 6–9.';
    if (d.line.trim().length < 6) e.line = 'Enter house number, street and area.';
    if (!d.city.trim()) e.city = 'Enter a city.';
    if (!d.state) e.state = 'Choose a state.';
    if (!/^\d{6}$/.test(d.postal.trim())) e.postal = 'Enter a 6-digit PIN code.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 0 && !validate()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const place = () => {
    if (!payment) { setPayErr('Choose a demo payment method.'); return; }
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        lines: cartLines,
        totals: t,
        address: { name: d.name.trim(), phone: d.phone.trim(), line: d.line.trim(), city: d.city.trim(), state: d.state, postal: d.postal.trim() },
        payment: PAYMENTS.find((p) => p.id === payment).name,
        shipping: method,
      });
      toast(`Demo order ${order.id} placed.`);
      navigate('/order-success', { replace: true, state: { orderId: order.id } });
    }, 1100);
  };

  const today = new Date().toISOString();
  const [lo, hi] = method === 'express' ? [1, 2] : method === 'pickup' ? [3, 5] : [4, 6];

  return (
    <div className="container-x pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero">Checkout</h1>
        <DemoNote>Simulated checkout. No payment is taken.</DemoNote>
      </div>
      <div className="mt-8"><Stepper steps={[...STEPS, 'Confirmation']} current={step} /></div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <section aria-labelledby="s0">
                  <h2 id="s0" className="mb-6 text-2xl">Delivery details</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" value={d.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                    <Field label="Phone number" type="tel" inputMode="numeric" value={d.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" placeholder="98765 43210" />
                    <Field className="sm:col-span-2" label="Address" value={d.line} onChange={set('line')} error={errors.line} autoComplete="street-address" placeholder="Flat, building, street, area" />
                    <Field label="City" value={d.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
                    <Field as="select" label="State" value={d.state} onChange={set('state')} error={errors.state}>
                      <option value="">Choose a state</option>
                      {STATES.map((s) => <option key={s}>{s}</option>)}
                    </Field>
                    <Field label="PIN code" inputMode="numeric" maxLength={6} value={d.postal} onChange={set('postal')} error={errors.postal} autoComplete="postal-code" />
                  </div>
                  <p className="mt-4 text-xs text-graphite">Use fictional details. This demo stores the order in your browser only.</p>
                </section>
              )}
              {step === 1 && (
                <section aria-labelledby="s1">
                  <h2 id="s1" className="mb-6 text-2xl">Shipping method</h2>
                  <div className="space-y-3" role="radiogroup" aria-label="Shipping method">
                    {SHIPPING_METHODS.map((m) => {
                      const cost = computeTotals(cartLines, promo, m.id).shipping;
                      return (
                        <label key={m.id} className={`flex cursor-pointer items-center gap-4 rounded-3xl border-2 p-5 transition-colors ${method === m.id ? 'border-ink bg-white/60' : 'border-linen'}`}>
                          <input type="radio" name="ship" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="h-5 w-5 accent-[#22211F]" />
                          <span className="flex-1"><span className="block font-semibold">{m.name}</span><span className="text-sm text-graphite">{m.eta}, illustrative</span></span>
                          <span className="font-semibold">{cost ? money(cost) : 'Free'}</span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              )}
              {step === 2 && (
                <section aria-labelledby="s2">
                  <h2 id="s2" className="mb-6 text-2xl">Review your order</h2>
                  <ul className="divide-y divide-linen">
                    {cartLines.map((l) => (
                      <li key={l.key} className="flex items-center gap-4 py-4">
                        <span className="h-20 w-16 shrink-0 overflow-hidden rounded-xl"><ProductImage product={l.product} /></span>
                        <span className="flex-1"><span className="block font-medium">{l.product.name}</span><span className="text-sm text-graphite">Size {l.size}, qty {l.qty}</span></span>
                        <span className="font-semibold">{money(l.price * l.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-cream/70 p-5 text-sm">
                      <p className="mb-1 font-semibold">Delivering to</p>
                      <p>{d.name}, {d.phone}</p><p className="text-graphite">{d.line}, {d.city}, {d.state} {d.postal}</p>
                      <button type="button" onClick={() => setStep(0)} className="link-u mt-2 text-sm font-medium">Edit</button>
                    </div>
                    <div className="rounded-3xl bg-cream/70 p-5 text-sm">
                      <p className="mb-1 font-semibold">{t.method.name} shipping</p>
                      <p className="text-graphite">Arrives {date(addDays(today, lo))} to {date(addDays(today, hi))} (illustrative)</p>
                      <button type="button" onClick={() => setStep(1)} className="link-u mt-2 text-sm font-medium">Change</button>
                    </div>
                  </div>
                </section>
              )}
              {step === 3 && (
                <section aria-labelledby="s3">
                  <h2 id="s3" className="mb-2 text-2xl">Payment method</h2>
                  <p className="mb-6 flex items-start gap-2 text-sm text-graphite"><ShieldAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />RELIVE never asks for card numbers, CVVs or bank details. Every option below is simulated.</p>
                  <div className="space-y-3" role="radiogroup" aria-label="Payment method">
                    {PAYMENTS.map((p) => (
                      <label key={p.id} className={`flex cursor-pointer items-center gap-4 rounded-3xl border-2 p-5 transition-colors ${payment === p.id ? 'border-ink bg-white/60' : 'border-linen'}`}>
                        <input type="radio" name="pay" value={p.id} checked={payment === p.id} onChange={() => { setPayment(p.id); setPayErr(''); }} className="h-5 w-5 accent-[#22211F]" />
                        <p.icon size={22} aria-hidden="true" />
                        <span><span className="block font-semibold">{p.name}</span><span className="text-sm text-graphite">{p.note}</span></span>
                      </label>
                    ))}
                  </div>
                  {payErr && <p className="field-error" role="alert">{payErr}</p>}
                </section>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-wrap justify-between gap-3">
            {step > 0 ? <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost">Back</button> : <Link to="/cart" className="btn-ghost">Back to cart</Link>}
            {step < 3 ? (
              <button type="button" onClick={next} className="btn-primary">Continue</button>
            ) : (
              <button type="button" onClick={place} disabled={placing} className="btn-terra">
                {placing ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" />Placing demo order…</> : `Place Demo Order, ${money(t.total)}`}
              </button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[32px] bg-cream/70 p-6">
            <h2 className="text-xl">Order summary</h2>
            <ul className="my-5 space-y-3">
              {cartLines.map((l) => (
                <li key={l.key} className="flex items-center gap-3 text-sm">
                  <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg"><ProductImage product={l.product} /></span>
                  <span className="flex-1 truncate">{l.product.name} <span className="text-graphite">×{l.qty}</span></span>
                  <span>{money(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <SummaryRows t={t} />
          </div>
        </aside>
      </div>
    </div>
  );
}
