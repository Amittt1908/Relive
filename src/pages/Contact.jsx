import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube, Check, Loader2 } from 'lucide-react';
import { Field } from '../components/Field';
import DemoNote from '../components/DemoNote';

const TOPICS = ['Orders and delivery', 'Selling', 'Donations', 'Account', 'Something else'];

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', topic: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) er.email = 'Enter an email like name@example.com.';
    if (!f.topic) er.topic = 'Choose what this is about.';
    if (f.subject.trim().length < 3) er.subject = 'Add a short subject.';
    if (f.message.trim().length < 15) er.message = 'Tell us a little more (at least 15 characters).';
    setErrors(er);
    if (Object.keys(er).length) return;
    setState('sending');
    setTimeout(() => setState('sent'), 800);
  };

  return (
    <div className="container-x pt-12">
      <h1 className="text-mega max-w-[9ch]">Say hello.</h1>
      <div className="mt-12 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
        <div>
          {state === 'sent' ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] bg-sage-light/50 p-8" role="status">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-deep text-ivory"><Check size={26} aria-hidden="true" /></span>
              <h2 className="mt-4 text-3xl">Message received (demo).</h2>
              <p className="mt-2 text-graphite">Thanks, {f.name.split(' ')[0]}. In a live product, the support team would reply to {f.email}. Here, nothing was sent.</p>
              <button type="button" onClick={() => { setF({ name: '', email: '', topic: '', subject: '', message: '' }); setState('idle'); }} className="btn-ghost mt-6">Send another message</button>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <Field label="Email" type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              <fieldset className="sm:col-span-2">
                <legend className="field-label">Support category</legend>
                <div className="flex flex-wrap gap-2">{TOPICS.map((t) => <button type="button" key={t} aria-pressed={f.topic === t} onClick={() => setF((x) => ({ ...x, topic: t }))} className={`chip ${f.topic === t ? 'chip-active' : ''}`}>{t}</button>)}</div>
                {errors.topic && <p className="field-error" role="alert">{errors.topic}</p>}
              </fieldset>
              <Field className="sm:col-span-2" label="Subject" value={f.subject} onChange={set('subject')} error={errors.subject} />
              <Field className="sm:col-span-2" as="textarea" label="Message" value={f.message} onChange={set('message')} error={errors.message} maxLength={1000} />
              <div className="sm:col-span-2"><button className="btn-primary" disabled={state === 'sending'}>{state === 'sending' ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" />Sending…</> : 'Send message'}</button></div>
            </form>
          )}
        </div>
        <aside>
          <DemoNote>Placeholder contact details</DemoNote>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4"><Mail className="mt-1 shrink-0 text-sage-deep" size={20} aria-hidden="true" /><div><p className="font-semibold">Email</p><p className="text-graphite">support@relive.example</p></div></li>
            <li className="flex gap-4"><Phone className="mt-1 shrink-0 text-sage-deep" size={20} aria-hidden="true" /><div><p className="font-semibold">Phone</p><p className="text-graphite">+91 00000 00000 (placeholder)</p></div></li>
            <li className="flex gap-4"><MapPin className="mt-1 shrink-0 text-sage-deep" size={20} aria-hidden="true" /><div><p className="font-semibold">Studio</p><p className="text-graphite">Demo Studio, Example Street (not a real address)</p></div></li>
          </ul>
          <h2 className="mb-3 mt-10 text-xl">Quick answers</h2>
          <ul className="space-y-2">
            {[['Which promo codes work?', '/help'], ['Is my payment real?', '/help'], ['How do I list an item?', '/sell'], ['How do donations work?', '/donate']].map(([q, to]) => <li key={q}><Link to={to} className="link-u">{q}</Link></li>)}
          </ul>
          <div className="mt-10 flex gap-1">
            {[[Instagram, 'Instagram'], [Twitter, 'X / Twitter'], [Facebook, 'Facebook'], [Youtube, 'YouTube']].map(([Icon, l]) => (
              <a key={l} href="#" onClick={(e) => e.preventDefault()} className="grid h-11 w-11 place-items-center rounded-full border border-linen hover:bg-cream" aria-label={`${l} (demo link)`}><Icon size={18} /></a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
