import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Info } from 'lucide-react';
import AuthShell from './AuthShell';
import { Field, PasswordField, Checkbox } from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const { login, isAuthed } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/home';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setTimeout(() => {
      const res = login(identifier, password, remember);
      setLoading(false);
      if (!res.ok) {
        setShake((s) => s + 1);
        if (res.field === 'both') setErrors({ identifier: 'Enter your username or email.', password: 'Enter your password.' });
        else setErrors({ [res.field]: res.error });
        return;
      }
      toast('Welcome back, Alka. You’re signed in to the demo.');
      navigate(from, { replace: true });
    }, 650);
  };

  if (isAuthed && !loading) return <Navigate to={from} replace />;

  return (
    <AuthShell title="Welcome back" intro="Sign in to see your orders, listings and donations.">
      {location.state?.gated && (
        <p className="mb-5 flex items-start gap-2 rounded-2xl bg-terra-light/50 p-3 text-sm" role="status"><Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />Sign in to continue to that page.</p>
      )}
      <motion.form key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.4 }} onSubmit={submit} noValidate className="space-y-5">
        <Field label="Username or email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} error={errors.identifier} autoComplete="username" />
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="current-password" />
        <div className="flex items-center justify-between gap-4">
          <Checkbox label="Remember me on this device" checked={remember} onChange={setRemember} />
          <Link to="/forgot-password" className="link-u shrink-0 text-sm">Forgot password?</Link>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Signing in…</> : 'Sign in'}
        </button>
      </motion.form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p>New here? <Link to="/signup" className="link-u font-medium">Create a demo account</Link></p>
        <Link to="/home" className="link-u text-graphite">Continue as guest</Link>
      </div>
    </AuthShell>
  );
}
