import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Newsletter({ dark = false }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter an email like name@example.com.');
    setError('');
    setDone(true);
  };
  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-lg" role="status">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-sage text-ivory"><Check size={18} /></span>
          You’re on the list. (Demo only — no emails will be sent.)
        </motion.p>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate className="w-full max-w-md">
          <label htmlFor="nl-email" className={`mb-2 block text-sm ${dark ? 'text-ivory/70' : 'text-graphite'}`}>Get first pick of new drops</label>
          <div className="flex gap-2">
            <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`field flex-1 ${dark ? 'border-white/20 bg-white/10 text-ivory placeholder:text-ivory/40 focus:bg-white/15' : ''}`} aria-invalid={!!error} aria-describedby={error ? 'nl-err' : undefined} />
            <button className={dark ? 'btn-light' : 'btn-primary'} type="submit">Subscribe</button>
          </div>
          {error && <p id="nl-err" className={`mt-2 text-sm ${dark ? 'text-terra-light' : 'text-terra'}`} role="alert">{error}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
