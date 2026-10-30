const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const money = (n) => inr.format(Math.max(0, Math.round(Number(n) || 0)));
export const date = (iso) => {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return ''; }
};
export const addDays = (iso, n) => { const d = new Date(iso); d.setDate(d.getDate() + n); return d.toISOString(); };
export const makeId = (prefix) => `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`;
export const cx = (...c) => c.filter(Boolean).join(' ');
export const validPhone = (v) => {
  const digits = String(v || '').replace(/\D/g, '');
  const ten = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(ten);
};
