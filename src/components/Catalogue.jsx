import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';
import SearchBox from './SearchBox';
import { products, CONDITIONS, BRANDS, COLORS, discountPct } from '../data/products';
import { categories } from '../data/content';
import { money } from '../lib/format';

const PAGE = 12;
const MAX_PRICE = Math.ceil(Math.max(...products.map((p) => p.price)) / 500) * 500;
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'One Size'];
const SORTS = [
  ['newest', 'Newest'],
  ['popular', 'Most popular'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['discount', 'Biggest discount'],
];
const GENDERS = [['women', 'Women'], ['men', 'Men'], ['unisex', 'Unisex']];
const EMPTY = { cats: [], gender: [], sizes: [], conds: [], brands: [], colors: [], min: 0, max: MAX_PRICE };

function Group({ title, children, open: initial = true }) {
  const [open, setOpen] = useState(initial);
  return (
    <fieldset className="border-b border-linen py-4">
      <legend className="sr-only">{title}</legend>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-sm font-semibold" aria-expanded={open}>
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </fieldset>
  );
}

function Toggle({ active, onClick, children, label }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} aria-label={label} className={`chip ${active ? 'chip-active' : ''}`}>{children}</button>
  );
}

export default function Catalogue({ base = null, hideCategory = false }) {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [f, setF] = useState(() => {
    const cat = params.get('category');
    return { ...EMPTY, cats: cat ? [cat] : [] };
  });
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');
  const [shown, setShown] = useState(PAGE);
  const [panel, setPanel] = useState(false);

  useEffect(() => { setShown(PAGE); }, [f, sort, q, base]);
  useEffect(() => { document.body.style.overflow = panel ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [panel]);

  const toggle = (key, val) => setF((x) => ({ ...x, [key]: x[key].includes(val) ? x[key].filter((v) => v !== val) : [...x[key], val] }));
  const setQuery = (val) => {
    const next = new URLSearchParams(params);
    if (val) next.set('q', val); else next.delete('q');
    setParams(next, { replace: true });
  };

  const pool = useMemo(() => (base ? products.filter(base) : products), [base]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = pool.filter((p) => {
      if (term && !`${p.name} ${p.brand} ${p.color.name} ${p.material} ${p.tags.join(' ')} ${p.condition}`.toLowerCase().includes(term)) return false;
      if (f.cats.length && !f.cats.some((c) => categories.find((x) => x.slug === c)?.filter(p))) return false;
      if (f.gender.length && !f.gender.includes(p.gender)) return false;
      if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s))) return false;
      if (f.conds.length && !f.conds.includes(p.condition)) return false;
      if (f.brands.length && !f.brands.includes(p.brand)) return false;
      if (f.colors.length && !f.colors.includes(p.color.name)) return false;
      if (p.price < f.min || p.price > f.max) return false;
      return true;
    });
    const by = {
      newest: (a, b) => new Date(b.addedAt) - new Date(a.addedAt),
      popular: (a, b) => b.popularity - a.popularity,
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      discount: (a, b) => discountPct(b) - discountPct(a),
    }[sort];
    list = [...list].sort(by);
    return list;
  }, [pool, q, f, sort]);

  const sizes = useMemo(() => SIZE_ORDER.filter((s) => pool.some((p) => p.sizes.includes(s))), [pool]);
  const brands = useMemo(() => BRANDS.filter((b) => pool.some((p) => p.brand === b)), [pool]);
  const colors = useMemo(() => COLORS.filter((c) => pool.some((p) => p.color.name === c.name)), [pool]);

  const chips = [
    ...(q ? [{ label: `“${q}”`, clear: () => setQuery('') }] : []),
    ...f.cats.map((c) => ({ label: categories.find((x) => x.slug === c)?.name || c, clear: () => toggle('cats', c) })),
    ...f.gender.map((g) => ({ label: GENDERS.find((x) => x[0] === g)[1], clear: () => toggle('gender', g) })),
    ...f.sizes.map((s) => ({ label: `Size ${s}`, clear: () => toggle('sizes', s) })),
    ...f.conds.map((s) => ({ label: s, clear: () => toggle('conds', s) })),
    ...f.brands.map((s) => ({ label: s, clear: () => toggle('brands', s) })),
    ...f.colors.map((s) => ({ label: s, clear: () => toggle('colors', s) })),
    ...(f.min > 0 || f.max < MAX_PRICE ? [{ label: `${money(f.min)}–${money(f.max)}`, clear: () => setF((x) => ({ ...x, min: 0, max: MAX_PRICE })) }] : []),
  ];
  const clearAll = () => { setF(EMPTY); setQuery(''); };

  const filters = (
    <div>
      {!hideCategory && (
        <Group title="Category">
          <div className="flex flex-wrap gap-2">{categories.slice(0, 7).map((c) => <Toggle key={c.slug} active={f.cats.includes(c.slug)} onClick={() => toggle('cats', c.slug)}>{c.name}</Toggle>)}</div>
        </Group>
      )}
      <Group title="Gender / style">
        <div className="flex flex-wrap gap-2">{GENDERS.map(([v, l]) => <Toggle key={v} active={f.gender.includes(v)} onClick={() => toggle('gender', v)}>{l}</Toggle>)}</div>
      </Group>
      <Group title="Size">
        <div className="flex flex-wrap gap-2">{sizes.map((s) => <Toggle key={s} active={f.sizes.includes(s)} onClick={() => toggle('sizes', s)}>{s}</Toggle>)}</div>
      </Group>
      <Group title="Condition">
        <div className="flex flex-wrap gap-2">{CONDITIONS.map((s) => <Toggle key={s} active={f.conds.includes(s)} onClick={() => toggle('conds', s)}>{s}</Toggle>)}</div>
      </Group>
      <Group title="Price">
        <div className="space-y-3">
          <p className="text-sm text-graphite">{money(f.min)} to {money(f.max)}</p>
          <label className="block text-xs text-graphite">Minimum
            <input type="range" min="0" max={MAX_PRICE} step="50" value={f.min} onChange={(e) => setF((x) => ({ ...x, min: Math.min(Number(e.target.value), x.max) }))} className="mt-1 w-full accent-[#4F5E47]" />
          </label>
          <label className="block text-xs text-graphite">Maximum
            <input type="range" min="0" max={MAX_PRICE} step="50" value={f.max} onChange={(e) => setF((x) => ({ ...x, max: Math.max(Number(e.target.value), x.min) }))} className="mt-1 w-full accent-[#4F5E47]" />
          </label>
        </div>
      </Group>
      <Group title="Colour">
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button key={c.name} type="button" onClick={() => toggle('colors', c.name)} aria-pressed={f.colors.includes(c.name)} aria-label={c.name} title={c.name}
              className={`grid h-9 w-9 place-items-center rounded-full border-2 ${f.colors.includes(c.name) ? 'border-ink' : 'border-transparent'}`}>
              <span className="h-7 w-7 rounded-full border border-ink/10" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </Group>
      <Group title="Brand" open={false}>
        <div className="flex flex-col gap-2">
          {brands.map((b) => (
            <label key={b} className="flex min-h-[32px] items-center gap-3 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-[#4F5E47]" checked={f.brands.includes(b)} onChange={() => toggle('brands', b)} />{b}
            </label>
          ))}
        </div>
      </Group>
    </div>
  );

  return (
    <div className="container-x">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="md:max-w-md md:flex-1"><SearchBox key={q} initial={q} onSearch={setQuery} /></div>
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:justify-end">
          <button type="button" onClick={() => setPanel(true)} className="chip shrink-0 lg:hidden"><SlidersHorizontal size={16} aria-hidden="true" />Filters{chips.length ? ` (${chips.length})` : ''}</button>
          <label className="flex min-w-0 flex-1 items-center gap-2 text-sm md:flex-none">
            <span className="hidden sm:inline text-graphite">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 w-full min-w-0 rounded-full border border-linen bg-white/70 px-3 text-sm focus:border-ink focus:outline-none" aria-label="Sort products">
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <div className="flex shrink-0 rounded-full border border-linen p-1" role="group" aria-label="Layout">
            <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} className={`grid h-9 w-9 place-items-center rounded-full ${view === 'grid' ? 'bg-ink text-ivory' : ''}`} aria-label="Grid view"><LayoutGrid size={16} /></button>
            <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} className={`grid h-9 w-9 place-items-center rounded-full ${view === 'list' ? 'bg-ink text-ivory' : ''}`} aria-label="List view"><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2" aria-live="polite">
        <p className="mr-2 text-sm font-medium">{results.length} {results.length === 1 ? 'item' : 'items'}</p>
        {chips.map((c) => (
          <button key={c.label} type="button" onClick={c.clear} className="chip chip-active !min-h-[32px] !px-3 text-xs" aria-label={`Remove filter ${c.label}`}>{c.label}<X size={13} aria-hidden="true" /></button>
        ))}
        {chips.length > 0 && <button type="button" onClick={clearAll} className="link-u ml-1 text-sm text-terra">Clear all</button>}
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>
        <div>
          {results.length === 0 ? (
            <EmptyState art="scarf" color="#B85C3C" title="Nothing on this rail yet" body="No pieces match those filters. Remove a filter or search for something broader." cta="Clear all filters" onClick={clearAll} />
          ) : view === 'grid' ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
              {results.slice(0, shown).map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
            </ul>
          ) : (
            <ul>{results.slice(0, shown).map((p) => <li key={p.id}><ProductCard product={p} layout="list" /></li>)}</ul>
          )}
          {shown < results.length && (
            <div className="mt-12 flex flex-col items-center gap-2">
              <p className="text-sm text-graphite">Showing {shown} of {results.length}</p>
              <button type="button" onClick={() => setShown((s) => s + PAGE)} className="btn-ghost">Load more</button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {panel && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-ink/40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-[32px] bg-ivory px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-4 lg:hidden" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 34 }}>
              <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-linen" />
              <div className="flex items-center justify-between"><h2 className="text-2xl">Filters</h2><button onClick={() => setPanel(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-cream" aria-label="Close filters"><X size={20} /></button></div>
              {filters}
              <div className="sticky bottom-0 mt-4 flex gap-3 bg-ivory pt-3">
                <button type="button" onClick={clearAll} className="btn-ghost flex-1">Clear all</button>
                <button type="button" onClick={() => setPanel(false)} className="btn-primary flex-1">Show {results.length}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
