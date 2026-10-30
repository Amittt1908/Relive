import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trash2, LogOut, KeyRound, Check } from 'lucide-react';
import AccountNav from '../../layouts/AccountNav';
import { Field, PasswordField, Checkbox } from '../../components/Field';
import Modal from '../../components/Modal';
import DemoNote from '../../components/DemoNote';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { categories } from '../../data/content';
import { STATES } from '../Checkout';
import { validPhone } from '../../lib/format';

const TONES = ['#4F5E47', '#B85C3C', '#6E6B3B', '#22211F', '#7E97B3'];

function PasswordModal({ open, onClose }) {
  const { toast } = useToast();
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [e, setE] = useState({});
  const submit = (ev) => {
    ev.preventDefault();
    const er = {};
    if (!f.current) er.current = 'Enter your current password.';
    if (f.next.length < 6) er.next = 'Use at least 6 characters.';
    if (f.next !== f.confirm) er.confirm = 'Passwords don’t match.';
    setE(er);
    if (Object.keys(er).length) return;
    setF({ current: '', next: '', confirm: '' });
    onClose();
    toast('Password change simulated. Nothing was saved, and the demo password is unchanged.', 'info');
  };
  return (
    <Modal open={open} onClose={onClose} title="Change password">
      <form onSubmit={submit} noValidate className="space-y-4">
        <PasswordField label="Current password" value={f.current} onChange={(x) => setF({ ...f, current: x.target.value })} error={e.current} autoComplete="current-password" />
        <PasswordField label="New password" value={f.next} onChange={(x) => setF({ ...f, next: x.target.value })} error={e.next} autoComplete="new-password" />
        <PasswordField label="Confirm new password" value={f.confirm} onChange={(x) => setF({ ...f, confirm: x.target.value })} error={e.confirm} autoComplete="new-password" />
        <p className="text-xs text-graphite">Demo only. Passwords are never stored.</p>
        <button className="btn-primary w-full">Update password</button>
      </form>
    </Modal>
  );
}

export default function Profile() {
  const { profile, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [errors, setErrors] = useState({});
  const [pw, setPw] = useState(false);
  const tone = draft.tone || TONES[0];
  const data = editing ? draft : profile;
  const initials = data.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'R';

  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const setAddr = (i, k) => (e) => setDraft((d) => ({ ...d, addresses: d.addresses.map((a, j) => (j === i ? { ...a, [k]: e.target.value } : a)) }));
  const toggleFav = (slug) => setDraft((d) => ({ ...d, favorites: d.favorites.includes(slug) ? d.favorites.filter((x) => x !== slug) : [...d.favorites, slug] }));

  const save = () => {
    const er = {};
    if (draft.name.trim().length < 2) er.name = 'Enter your name.';
    if (!draft.email.trim()) er.email = 'Enter an email.';
    if (!draft.username.trim()) er.username = 'Enter a username.';
    if (draft.phone && !validPhone(draft.phone)) er.phone = 'Enter a 10-digit mobile number.';
    draft.addresses.forEach((a, i) => { if (a.postal && !/^\d{6}$/.test(a.postal)) er[`postal${i}`] = 'Enter a 6-digit PIN code.'; });
    setErrors(er);
    if (Object.keys(er).length) return;
    updateProfile({ ...draft, name: draft.name.trim() });
    setEditing(false);
    toast('Profile saved in this browser.');
  };

  const doLogout = () => { logout(); toast('You’re signed out of the demo.', 'info'); navigate('/login'); };

  return (
    <div className="container-x pt-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <span className="grid h-24 w-24 place-items-center rounded-full font-display text-4xl font-extrabold text-ivory sm:h-28 sm:w-28" style={{ background: data.tone || TONES[0] }} aria-hidden="true">{initials}</span>
          <div>
            <h1 className="text-title">{data.name}</h1>
            <p className="break-all text-graphite">@{data.username}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {editing ? (
            <>
              <button type="button" onClick={() => { setDraft(profile); setEditing(false); setErrors({}); }} className="btn-ghost">Cancel</button>
              <button type="button" onClick={save} className="btn-sage"><Check size={17} aria-hidden="true" />Save Changes</button>
            </>
          ) : (
            <button type="button" onClick={() => { setDraft(profile); setEditing(true); }} className="btn-primary"><Pencil size={16} aria-hidden="true" />Edit Profile</button>
          )}
        </div>
      </div>
      <div className="mt-8"><AccountNav /></div>

      <div className="grid gap-14 lg:grid-cols-2">
        <section aria-labelledby="pi-h">
          <h2 id="pi-h" className="mb-5 text-2xl">Personal details</h2>
          {editing && (
            <fieldset className="mb-5">
              <legend className="field-label">Avatar colour</legend>
              <div className="flex gap-2">{TONES.map((t) => <button key={t} type="button" onClick={() => setDraft((d) => ({ ...d, tone: t }))} aria-pressed={tone === t} aria-label={`Avatar colour ${t}`} className={`h-10 w-10 rounded-full border-4 ${tone === t ? 'border-ivory ring-2 ring-ink' : 'border-transparent'}`} style={{ background: t }} />)}</div>
            </fieldset>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" value={data.name} onChange={set('name')} disabled={!editing} error={errors.name} />
            <Field label="Username" value={data.username} onChange={set('username')} disabled={!editing} error={errors.username} />
            <Field label="Email" value={data.email} onChange={set('email')} disabled={!editing} error={errors.email} hint="Demo text, not verified." />
            <Field label="Phone number" type="tel" value={data.phone} onChange={set('phone')} disabled={!editing} error={errors.phone} placeholder="Not added" />
          </div>

          <h2 className="mb-4 mt-12 text-2xl">Preferred sizes</h2>
          <div className="grid grid-cols-3 gap-4">
            {[['top', 'Tops', ['XS', 'S', 'M', 'L', 'XL']], ['bottom', 'Bottoms', ['XS', 'S', 'M', 'L', 'XL']], ['shoe', 'Shoes', ['UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10']]].map(([k, l, opts]) => (
              <Field key={k} as="select" label={l} value={data.sizes?.[k] || ''} disabled={!editing} onChange={(e) => setDraft((d) => ({ ...d, sizes: { ...d.sizes, [k]: e.target.value } }))}>{opts.map((o) => <option key={o}>{o}</option>)}</Field>
            ))}
          </div>

          <h2 className="mb-4 mt-12 text-2xl">Favourite categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 7).map((c) => (
              <button key={c.slug} type="button" disabled={!editing} onClick={() => toggleFav(c.slug)} aria-pressed={data.favorites.includes(c.slug)} className={`chip disabled:cursor-default ${data.favorites.includes(c.slug) ? 'chip-active' : ''}`}>{c.name}</button>
            ))}
          </div>
        </section>

        <section aria-labelledby="ad-h">
          <div className="mb-5 flex items-center justify-between">
            <h2 id="ad-h" className="text-2xl">Saved addresses</h2>
            {editing && <button type="button" onClick={() => setDraft((d) => ({ ...d, addresses: [...d.addresses, { id: `addr-${Date.now()}`, label: 'Other', line: '', city: '', state: '', postal: '' }] }))} className="chip"><Plus size={15} aria-hidden="true" />Add</button>}
          </div>
          {data.addresses.length === 0 && <p className="text-graphite">No saved addresses.</p>}
          <ul className="space-y-4">
            {data.addresses.map((a, i) => (
              <li key={a.id} className="rounded-[24px] border border-linen p-5">
                {editing ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Label" value={a.label} onChange={setAddr(i, 'label')} />
                    <Field label="PIN code" value={a.postal} onChange={setAddr(i, 'postal')} error={errors[`postal${i}`]} inputMode="numeric" maxLength={6} />
                    <Field className="sm:col-span-2" label="Address" value={a.line} onChange={setAddr(i, 'line')} placeholder="Use fictional details" />
                    <Field label="City" value={a.city} onChange={setAddr(i, 'city')} />
                    <Field as="select" label="State" value={a.state} onChange={setAddr(i, 'state')}><option value="">Choose</option>{STATES.map((s) => <option key={s}>{s}</option>)}</Field>
                    <button type="button" onClick={() => setDraft((d) => ({ ...d, addresses: d.addresses.filter((_, j) => j !== i) }))} className="flex items-center gap-2 text-sm text-terra"><Trash2 size={15} aria-hidden="true" />Remove address</button>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold">{a.label}{i === 0 && <span className="ml-2 rounded-full bg-sage-light px-2 py-0.5 text-xs font-normal text-sage-deep">Default</span>}</p>
                    <p className="text-sm text-graphite">{[a.line, a.city, a.state, a.postal].filter(Boolean).join(', ') || 'Incomplete address'}</p>
                  </>
                )}
              </li>
            ))}
          </ul>

          <h2 className="mb-4 mt-12 text-2xl">Account preferences</h2>
          <div className="space-y-3">
            {[['newsletter', 'Weekly drop emails (simulated)'], ['donationReminders', 'Seasonal donation reminders'], ['ecoPackaging', 'Prefer reused packaging']].map(([k, l]) => (
              <Checkbox key={k} label={l} checked={!!data.prefs?.[k]} onChange={(v) => { if (!editing) { updateProfile({ prefs: { ...profile.prefs, [k]: v } }); toast('Preference saved.'); } else setDraft((d) => ({ ...d, prefs: { ...d.prefs, [k]: v } })); }} />
            ))}
          </div>

          <h2 className="mb-4 mt-12 text-2xl">Security</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setPw(true)} className="btn-ghost"><KeyRound size={16} aria-hidden="true" />Change password</button>
            <button type="button" onClick={doLogout} className="btn border border-terra text-terra hover:bg-terra hover:text-ivory"><LogOut size={16} aria-hidden="true" />Logout</button>
          </div>
          <DemoNote className="mt-6">Profile data is stored only in this browser; passwords are never stored</DemoNote>
        </section>
      </div>
      <PasswordModal open={pw} onClose={() => setPw(false)} />
    </div>
  );
}
