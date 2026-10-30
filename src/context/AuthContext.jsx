import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { read, write, remove, isObject } from '../lib/storage';

// Simulated, frontend-only authentication for the demo.
// Passwords are compared in memory and never written to storage.
export const DEMO_CREDENTIALS = {
  username: 'Alka Jat',
  email: 'alkajat99gmail.com', // supplied demo text, intentionally kept as-is
  password: 'alkajat',
};

export const DEFAULT_PROFILE = {
  name: 'Alka Jat',
  email: 'alkajat99gmail.com',
  username: 'alkajat',
  phone: '',
  addresses: [{ id: 'addr-1', label: 'Home', line: 'Demo address, Flat 4B, Example Lane', city: 'Demo City', state: 'Maharashtra', postal: '400001' }],
  sizes: { top: 'M', bottom: 'M', shoe: 'UK 6' },
  favorites: ['women', 'vintage'],
  prefs: { newsletter: true, donationReminders: true, ecoPackaging: true },
};

const AuthCtx = createContext(null);

const validSession = (s) => isObject(s) && s.active === true;
const validProfile = (p) => isObject(p) && typeof p.name === 'string' && typeof p.email === 'string';

function loadSession() {
  return read('session', null, validSession) || read('session', null, validSession, 'session');
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [profile, setProfile] = useState(() => {
    const p = read('profile', null, validProfile);
    return p ? { ...DEFAULT_PROFILE, ...p } : DEFAULT_PROFILE;
  });

  useEffect(() => {
    write('profile', profile);
  }, [profile]);

  const startSession = useCallback((remember) => {
    const s = { active: true, startedAt: new Date().toISOString(), remember: !!remember };
    remove('session');
    remove('session', 'session');
    write('session', s, remember ? 'local' : 'session');
    setSession(s);
  }, []);

  const login = useCallback(
    (identifier, password, remember) => {
      const id = String(identifier || '').trim();
      if (!id && !password) return { ok: false, field: 'both', error: 'Enter your username or email and your password.' };
      if (!id) return { ok: false, field: 'identifier', error: 'Enter your username or email.' };
      if (!password) return { ok: false, field: 'password', error: 'Enter your password.' };
      const known =
        id.toLowerCase() === DEMO_CREDENTIALS.username.toLowerCase() ||
        id.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase();
      if (!known) return { ok: false, field: 'identifier', error: 'That username or email doesn’t match the demo account.' };
      if (password !== DEMO_CREDENTIALS.password) return { ok: false, field: 'password', error: 'Incorrect password for the demo account.' };
      startSession(remember);
      return { ok: true };
    },
    [startSession]
  );

  const signup = useCallback(
    ({ name, email, username }) => {
      setProfile((p) => ({ ...p, name, email, username }));
      startSession(true);
    },
    [startSession]
  );

  const logout = useCallback(() => {
    remove('session');
    remove('session', 'session');
    setSession(null);
  }, []);

  const updateProfile = useCallback((patch) => setProfile((p) => ({ ...p, ...patch })), []);

  const value = useMemo(
    () => ({ isAuthed: !!session, session, profile, login, signup, logout, updateProfile }),
    [session, profile, login, signup, logout, updateProfile]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
