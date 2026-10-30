import { PROMO_CODES, SHIPPING_METHODS, FREE_SHIPPING_THRESHOLD } from '../data/content';

export function validatePromo(code, subtotal) {
  const key = String(code || '').trim().toUpperCase();
  if (!key) return { ok: false, message: 'Enter a promo code.' };
  const promo = PROMO_CODES[key];
  if (!promo) return { ok: false, message: `${key} isn’t a demo code. Try RELIVE10, THRIFT200 or FREESHIP.` };
  if (promo.min && subtotal < promo.min) return { ok: false, message: `${key} needs a subtotal of ₹${promo.min.toLocaleString('en-IN')} or more.` };
  return { ok: true, code: key, promo, message: `${key} applied: ${promo.label}.` };
}

// One function for every total shown in the app, so cart, checkout and orders always agree.
export function computeTotals(lines, promoCode, methodId = 'standard') {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const promoCheck = promoCode ? validatePromo(promoCode, subtotal) : null;
  const promo = promoCheck?.ok ? promoCheck.promo : null;

  let discount = 0;
  if (promo?.type === 'percent') discount = Math.round((subtotal * promo.value) / 100);
  if (promo?.type === 'flat') discount = promo.value;
  discount = Math.min(discount, subtotal);

  const method = SHIPPING_METHODS.find((m) => m.id === methodId) || SHIPPING_METHODS[0];
  let shipping = method.price;
  if (method.id === 'standard' && (subtotal >= FREE_SHIPPING_THRESHOLD || promo?.type === 'shipping')) shipping = 0;
  if (subtotal === 0) shipping = 0;

  return {
    subtotal,
    discount,
    shipping,
    total: subtotal - discount + shipping,
    promoApplied: promo ? promoCheck.code : null,
    method,
    toFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
}
