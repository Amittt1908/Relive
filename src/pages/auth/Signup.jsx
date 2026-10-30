import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthShell from './AuthShell';
import { Field, PasswordField, Checkbox } from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Signup() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', username: '', password: '', confirm: '' });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (f.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter an email like name@example.com.';
    if (!/^[a-z0-9_.]{3,20}$/i.test(f.username.trim())) e.username = 'Use 3–20 letters, numbers, dots or underscores.';
    if (f.password.length < 6) e.password = 'Use at least 6 characters.';
    if (f.confirm !== f.password || !f.confirm) e.confirm = 'Passwords don’t match.';
    if (!terms) e.terms = 'Accept the demo terms to continue.';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      signup({ name: f.name.trim(), email: f.email.trim(), username: f.username.trim() });
      toast(`Demo profile created. Welcome, ${f.name.trim().split(' ')[0]}.`);
      navigate('/home', { replace: true });
    }, 700);
  };

  return (
    <AuthShell title="Join RELIVE" intro="Create a local demo profile. No account is created on a server and your password isn’t saved." aside="Your wardrobe has more stories to tell.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Full name" value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Field label="Username" value={f.username} onChange={set('username')} error={errors.username} autoComplete="username" />
        </div>
        <PasswordField value={f.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
        <PasswordField label="Confirm password" value={f.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
        <Checkbox checked={terms} onChange={setTerms} error={errors.terms} label={<>I accept the <Link to="/policies/terms" className="underline">demo terms</Link> and <Link to="/policies/privacy" className="underline">privacy notice</Link>.</>} />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Creating profile…</> : 'Create demo account'}
        </button>
        <p className="text-xs text-graphite">Because passwords aren’t stored, signing in again later uses the demo credentials on the login page.</p>
      </form>
      <p className="mt-6 text-sm">Already have an account? <Link to="/login" className="link-u font-medium">Sign in</Link></p>
    </AuthShell>
  );
}
