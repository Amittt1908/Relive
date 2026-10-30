import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { Field, Checkbox } from '../../components/Field';
import DemoNote from '../../components/DemoNote';
import { STATES } from '../Checkout';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DONATION_CATEGORIES } from '../../data/content';
import { date, validPhone } from '../../lib/format';

const CONDITIONS = ['Like new', 'Good', 'Fair (wearable)'];

export default function DonateSchedule() {
  const { addDonation } = useStore();
  const { profile } = useAuth();
  const { toast } = useToast();
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [f, setF] = useState({ name: profile.name || '', phone: profile.phone || '', categories: [], items: '', condition: '', method: '', line: '', city: '', state: '', postal: '', date: '', notes: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const toggleCat = (c) => setF((x) => ({ ...x, categories: x.categories.includes(c) ? x.categories.filter((y) => y !== c) : [...x.categories, c] }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name.';
    if (!validPhone(f.phone)) er.phone = 'Enter a 10-digit mobile number.';
    if (!f.categories.length) er.categories = 'Choose at least one category.';
    const n = Number(f.items);
    if (!Number.isInteger(n) || n < 1 || n > 200) er.items = 'Enter a number between 1 and 200.';
    if (!f.condition) er.condition = 'Choose the overall condition.';
    if (!f.method) er.method = 'Choose pickup or drop-off.';
    if (f.method === 'Pickup') {
      if (f.line.trim().length < 6) er.line = 'Enter a pickup address.';
      if (!f.city.trim()) er.city = 'Enter a city.';
      if (!f.state) er.state = 'Choose a state.';
      if (!/^\d{6}$/.test(f.postal)) er.postal = 'Enter a 6-digit PIN code.';
    }
    if (!f.date || f.date < minDate) er.date = 'Choose a date from tomorrow onwards.';
    if (!consent) er.consent = 'Confirm the items are clean and you agree to the demo terms.';
    setErrors(er);
    if (Object.keys(er).length) { document.querySelector('[aria-invalid="true"], [role="alert"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setBusy(true);
    setTimeout(() => {
      const d = addDonation({ name: f.name.trim(), categories: f.categories, items: n, condition: f.condition, method: f.method, date: f.date, notes: f.notes.trim(), city: f.method === 'Pickup' ? f.city.trim() : undefined });
      setBusy(false);
      setDone(d);
      toast(`Donation ${d.id} saved (demo).`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  if (done) {
    return (
      <div className="container-x pt-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl text-center" role="status">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sage text-ivory"><Check size={36} aria-hidden="true" /></span>
          <h1 className="mt-6 text-hero">Thank you, {done.name.split(' ')[0]}.</h1>
          <p className="mt-4 text-lg text-graphite">Demo reference <strong className="text-ink">{done.id}</strong>: {done.items} items, {done.method.toLowerCase()} on {date(done.date)}.</p>
          <p className="mt-3 rounded-2xl bg-terra-light/40 p-3 text-sm">This is a demonstration. No real pickup or drop-off has been scheduled and no one will contact you.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/account/donations" className="btn-primary">View my donations</Link>
            <Link to="/reuse" className="btn-ghost">Explore reuse ideas</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-x pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero">Schedule a donation</h1>
        <DemoNote>No real pickup is scheduled</DemoNote>
      </div>
      <form onSubmit={submit} noValidate className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        <Field label="Donor name" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field label="Contact number" type="tel" inputMode="numeric" value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
        <fieldset className="sm:col-span-2">
          <legend className="field-label">Clothing categories</legend>
          <div className="flex flex-wrap gap-2">{DONATION_CATEGORIES.map((c) => <button key={c} type="button" aria-pressed={f.categories.includes(c)} onClick={() => toggleCat(c)} className={`chip ${f.categories.includes(c) ? 'chip-active' : ''}`}>{c}</button>)}</div>
          {errors.categories && <p className="field-error" role="alert">{errors.categories}</p>}
        </fieldset>
        <Field label="Approximate number of items" type="number" min="1" max="200" inputMode="numeric" value={f.items} onChange={set('items')} error={errors.items} />
        <Field as="select" label="Overall condition" value={f.condition} onChange={set('condition')} error={errors.condition}><option value="">Choose</option>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</Field>
        <fieldset className="sm:col-span-2">
          <legend className="field-label">Pickup or drop-off</legend>
          <div className="flex flex-wrap gap-2">{['Pickup', 'Drop-off'].map((m) => <button key={m} type="button" aria-pressed={f.method === m} onClick={() => setF((x) => ({ ...x, method: m }))} className={`chip ${f.method === m ? 'chip-active' : ''}`}>{m}</button>)}</div>
          {errors.method && <p className="field-error" role="alert">{errors.method}</p>}
          {f.method === 'Drop-off' && <p className="mt-2 text-sm text-graphite">In a live version you’d choose a partner drop point. For the demo, we’ll just record your preferred date.</p>}
        </fieldset>
        {f.method === 'Pickup' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid gap-6 sm:col-span-2 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Pickup address" value={f.line} onChange={set('line')} error={errors.line} placeholder="Use a fictional address for the demo" />
            <Field label="City" value={f.city} onChange={set('city')} error={errors.city} />
            <Field as="select" label="State" value={f.state} onChange={set('state')} error={errors.state}><option value="">Choose a state</option>{STATES.map((s) => <option key={s}>{s}</option>)}</Field>
            <Field label="PIN code" inputMode="numeric" maxLength={6} value={f.postal} onChange={set('postal')} error={errors.postal} />
          </motion.div>
        )}
        <Field label="Preferred date" type="date" min={minDate} value={f.date} onChange={set('date')} error={errors.date} />
        <Field className="sm:col-span-2" as="textarea" label="Notes (optional)" value={f.notes} onChange={set('notes')} placeholder="Gate code, bag count, anything helpful." maxLength={300} />
        <div className="sm:col-span-2"><Checkbox checked={consent} onChange={setConsent} error={errors.consent} label="My items are clean and wearable, and I understand this is a demo with no real pickup." /></div>
        <div className="sm:col-span-2">
          <button className="btn-sage" disabled={busy}>{busy ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" />Submitting…</> : 'Submit donation request'}</button>
        </div>
      </form>
    </div>
  );
}
