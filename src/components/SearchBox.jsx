import { useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, X } from 'lucide-react';
import { products } from '../data/products';
import { categories, trendingSearches } from '../data/content';
import { ProductArt } from './ProductArt';
import { money } from '../lib/format';

// Search input with live suggestions (products, categories, trending terms).
export default function SearchBox({ initial = '', onDone, autoFocus = false, size = 'md', onChangeLive, onSearch }) {
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef(null);

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return trendingSearches.slice(0, 5).map((t) => ({ kind: 'trend', label: t, to: `/shop?q=${encodeURIComponent(t)}` }));
    const cats = categories.filter((c) => c.name.toLowerCase().includes(term)).slice(0, 2).map((c) => ({ kind: 'cat', label: c.name, to: `/category/${c.slug}` }));
    const prods = products
      .filter((p) => `${p.name} ${p.brand} ${p.color.name} ${p.material}`.toLowerCase().includes(term))
      .slice(0, 5)
      .map((p) => ({ kind: 'product', label: p.name, product: p, to: `/product/${p.id}` }));
    return [...cats, ...prods];
  }, [q]);

  const go = (to) => {
    setOpen(false);
    navigate(to);
    onDone?.();
  };

  const submit = (e) => {
    e.preventDefault();
    if (active >= 0 && suggestions[active]) return go(suggestions[active].to);
    if (onSearch) { setOpen(false); return onSearch(q.trim()); }
    go(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop');
  };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(suggestions.length - 1, a + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
    if (e.key === 'Escape') { setOpen(false); setActive(-1); }
  };

  const big = size === 'lg';
  return (
    <form onSubmit={submit} role="search" className="relative w-full">
      <label htmlFor={`${listId}-in`} className="sr-only">Search pre-loved clothing</label>
      <Search size={big ? 22 : 18} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-graphite ${big ? 'left-5' : 'left-4'}`} aria-hidden="true" />
      <input
        ref={inputRef}
        id={`${listId}-in`}
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); onChangeLive?.(e.target.value); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKey}
        placeholder="Search denim, linen, boots, brands…"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        className={`w-full rounded-full border border-linen bg-white/80 text-ink placeholder:text-graphite/60 focus:border-ink focus:outline-none ${big ? 'h-16 pl-14 pr-14 text-lg' : 'h-12 pl-11 pr-11'}`}
      />
      {q && (
        <button type="button" onClick={() => { setQ(''); onChangeLive?.(''); inputRef.current?.focus(); }} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full hover:bg-cream" aria-label="Clear search">
          <X size={16} />
        </button>
      )}
      {open && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-3xl border border-linen bg-ivory p-2 shadow-lift">
          {!q.trim() && <li className="px-3 pb-1 pt-2 text-xs text-graphite" role="presentation">Trending searches</li>}
          {suggestions.map((s, i) => (
            <li key={s.to + i} id={`${listId}-${i}`} role="option" aria-selected={active === i}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(s.to)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm ${active === i ? 'bg-cream' : 'hover:bg-cream'}`}>
                {s.kind === 'product' ? (
                  <span className="h-11 w-9 shrink-0 overflow-hidden rounded-lg"><ProductArt type={s.product.art} color={s.product.color.hex} className="h-full w-full" label="" /></span>
                ) : (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream"><TrendingUp size={15} aria-hidden="true" /></span>
                )}
                <span className="flex-1">{s.label}{s.kind === 'cat' && <span className="text-graphite"> in categories</span>}</span>
                {s.kind === 'product' && <span className="text-graphite">{money(s.product.price)}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
