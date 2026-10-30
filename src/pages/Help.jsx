import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AccordionItem } from '../components/Accordion';
import DemoNote from '../components/DemoNote';
import { helpFaqs } from '../data/content';

export default function Help() {
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();
  const sections = helpFaqs
    .map((s) => ({ ...s, items: s.items.filter(([qq, a]) => !term || `${qq} ${a}`.toLowerCase().includes(term)) }))
    .filter((s) => s.items.length);
  const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-');
  return (
    <div className="container-x pt-12">
      <h1 className="text-mega max-w-[9ch]">Help center</h1>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-lg">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-graphite" aria-hidden="true" />
          <label htmlFor="help-q" className="sr-only">Search help</label>
          <input id="help-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="field rounded-full pl-11" />
        </div>
        <DemoNote>Demo features are described as simulated</DemoNote>
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Help topics" className="hidden lg:block">
          <ul className="sticky top-24 space-y-2 text-sm">{helpFaqs.map((s) => <li key={s.section}><a href={`#${slug(s.section)}`} className="link-u text-graphite hover:text-ink">{s.section}</a></li>)}</ul>
        </nav>
        <div>
          {sections.length === 0 && <p className="text-graphite">No answers match “{q}”. Try another word or <Link to="/contact" className="underline">contact us</Link>.</p>}
          {sections.map((s) => (
            <section key={s.section} id={slug(s.section)} className="mb-12 scroll-mt-28" aria-labelledby={`${slug(s.section)}-h`}>
              <h2 id={`${slug(s.section)}-h`} className="mb-2 text-2xl">{s.section}</h2>
              {s.items.map(([qq, a]) => <AccordionItem key={qq} q={qq} defaultOpen={!!term}>{a}</AccordionItem>)}
            </section>
          ))}
          <div className="rounded-[32px] bg-cream/70 p-8">
            <h2 className="text-2xl">Still stuck?</h2>
            <p className="mt-2 text-graphite">Send a message through the demo contact form.</p>
            <Link to="/contact" className="btn-primary mt-5">Contact us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
