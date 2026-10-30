import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, Loader2 } from 'lucide-react';
import AuthShell from './AuthShell';
import { Field } from '../../components/Field';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState('idle');
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Enter the email linked to your account.');
    setError('');
    setState('loading');
    setTimeout(() => setState('sent'), 700);
  };
  return (
    <AuthShell title="Reset your password" intro="This is a simulated reset. No email will actually be sent.">
      {state === 'sent' ? (
        <div className="rounded-3xl bg-sage-light/50 p-6" role="status">
          <MailCheck size={30} className="text-sage-deep" aria-hidden="true" />
          <h2 className="mt-3 text-2xl">Reset link simulated</h2>
          <p className="mt-2 text-graphite">In a live product, a link would go to <strong className="break-all text-ink">{email}</strong>. For this demo, sign in with the demo credentials.</p>
          <Link to="/login" className="btn-primary mt-5">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} autoComplete="email" />
          <button className="btn-primary w-full" disabled={state === 'loading'}>
            {state === 'loading' ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…</> : 'Send reset link'}
          </button>
          <Link to="/login" className="link-u text-sm">Back to sign in</Link>
        </form>
      )}
    </AuthShell>
  );
}
