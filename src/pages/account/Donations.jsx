import { Link } from 'react-router-dom';
import AccountNav from '../../layouts/AccountNav';
import EmptyState from '../../components/EmptyState';
import DemoNote from '../../components/DemoNote';
import { useStore } from '../../context/StoreContext';
import { date } from '../../lib/format';

export default function Donations() {
  const { donations } = useStore();
  const items = donations.reduce((n, d) => n + Number(d.items || 0), 0);
  const cats = new Set(donations.flatMap((d) => d.categories || []));
  return (
    <div className="container-x pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero">My donations</h1>
        <Link to="/donate/schedule" className="btn-sage">New donation</Link>
      </div>
      <p className="mb-6 mt-3 text-graphite">Sample records plus any donation forms you submit. Statuses are simulated.</p>
      <AccountNav />
      {donations.length === 0 ? (
        <EmptyState art="duffel" color="#7E8F72" title="No donations yet" body="Schedule a demo donation and it’ll appear here with a reference number." cta="Start a Donation" to="/donate/schedule" />
      ) : (
        <>
          <section className="mb-12 grid gap-6 rounded-[36px] bg-sage-deep p-8 text-ivory sm:grid-cols-3" aria-labelledby="impact-h">
            <h2 id="impact-h" className="sr-only">Donation impact summary</h2>
            <div><p className="font-display text-6xl font-extrabold">{items}</p><p className="text-ivory/70">items given a second life</p></div>
            <div><p className="font-display text-6xl font-extrabold">{donations.length}</p><p className="text-ivory/70">donation requests</p></div>
            <div><p className="font-display text-6xl font-extrabold">{cats.size}</p><p className="text-ivory/70">clothing categories</p></div>
            <p className="text-xs text-ivory/60 sm:col-span-3">Counts come from your demo records. They are not verified impact figures.</p>
          </section>
          <ul className="divide-y divide-linen border-y border-linen">
            {donations.map((d) => (
              <li key={d.id} className="grid gap-3 py-5 sm:grid-cols-[1fr_1.5fr_auto] sm:items-center">
                <div><p className="font-display text-xl font-extrabold">{d.id}</p><p className="text-sm text-graphite">{date(d.createdAt)}</p>{d.seed && <DemoNote className="mt-1">Sample record</DemoNote>}</div>
                <div className="text-sm"><p>{(d.categories || []).join(', ')}</p><p className="text-graphite">{d.items} items, {d.condition?.toLowerCase()}, {d.method?.toLowerCase()}{d.date ? ` on ${date(d.date)}` : ''}</p></div>
                <span className={`justify-self-start rounded-full px-3 py-1 text-sm sm:justify-self-end ${d.status === 'Distributed' ? 'bg-sage-light text-sage-deep' : 'bg-cream'}`}>{d.status}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
