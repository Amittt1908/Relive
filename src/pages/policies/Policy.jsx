import { Link, NavLink, useParams } from 'react-router-dom';
import NotFound from '../NotFound';
import DemoNote from '../../components/DemoNote';

const POLICIES = {
  privacy: {
    title: 'Privacy policy',
    body: [
      ['What this demo stores', 'RELIVE runs entirely in your browser. Your cart, wishlist, orders, listings, donations and profile details are saved in localStorage on this device. Nothing is sent to a server.'],
      ['Passwords', 'Passwords are checked in memory against the demo credentials and are never written to storage.'],
      ['Photos you upload', 'Listing photos are resized and stored in your browser only. Deleting a listing removes its photos.'],
      ['Clearing your data', 'Log out to end the demo session. To remove everything, clear this site’s data in your browser settings.'],
    ],
  },
  terms: {
    title: 'Terms of use',
    body: [
      ['A demonstration', 'RELIVE is a frontend demo. No goods are sold, no payments are taken and no deliveries or pickups are arranged.'],
      ['Content', 'Products, brands, sellers, reviews, partners and figures are fictional and shown for illustration only.'],
      ['Acceptable use', 'Please don’t enter real payment information or sensitive personal data into any demo form.'],
    ],
  },
  returns: {
    title: 'Returns and cancellations',
    body: [
      ['Cancellations', 'Demo orders can be cancelled from My Orders while their status is Placed or Confirmed.'],
      ['Example returns policy', 'A live marketplace might allow returns within 7 days of delivery for items not as described. This text is an example only; no returns are processed.'],
      ['Refunds', 'Because no payment is taken, no refunds are issued.'],
    ],
  },
  shipping: {
    title: 'Shipping information',
    body: [
      ['Methods', 'Standard (4–6 days, ₹79, free over ₹999), Express (1–2 days, ₹149) and Eco pickup point (3–5 days, free). All are simulated.'],
      ['Delivery windows', 'Dates shown at checkout and on order pages are illustrative estimates, not commitments.'],
      ['Packaging', 'In a live version, sellers would be encouraged to reuse packaging.'],
    ],
  },
};

export default function Policy() {
  const { slug } = useParams();
  const p = POLICIES[slug];
  if (!p) return <NotFound />;
  return (
    <div className="container-x pt-12">
      <nav aria-label="Policies" className="mb-10 flex flex-wrap gap-2">
        {Object.entries(POLICIES).map(([k, v]) => <NavLink key={k} to={`/policies/${k}`} className={({ isActive }) => `chip ${isActive ? 'chip-active' : ''}`}>{v.title}</NavLink>)}
      </nav>
      <h1 className="text-hero">{p.title}</h1>
      <div className="mt-6 rounded-2xl bg-terra-light/40 p-4 text-sm">
        <DemoNote>Demo policy text</DemoNote>
        <p className="mt-2">This is placeholder text for a demo project. It has not been reviewed by a lawyer and is not legal advice.</p>
      </div>
      <article className="prose-relive mt-6 max-w-2xl">
        {p.body.map(([h, t]) => <section key={h}><h2>{h}</h2><p>{t}</p></section>)}
        <p className="text-sm">Questions? <Link to="/contact" className="underline">Contact us</Link>.</p>
      </article>
    </div>
  );
}
