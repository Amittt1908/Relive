import { Link } from 'react-router-dom';
import { ProductArt } from '../components/ProductArt';

export default function NotFound({ title = 'This page went to the thrift store', body = 'The link may be old, or the page has found a new home. Let’s get you back to the rail.' }) {
  return (
    <section className="container-x grid min-h-[70vh] items-center gap-10 py-16 md:grid-cols-[1fr_1fr]">
      <div className="relative h-[320px] md:h-[440px]" aria-hidden="true">
        <div className="animate-floaty absolute left-[8%] top-[6%] h-52 w-44" style={{ '--r': '-12deg' }}><ProductArt type="tee" color="#7E8F72" bg={false} className="h-full w-full drop-shadow-xl" label="" /></div>
        <div className="animate-floaty absolute right-[6%] top-[18%] h-48 w-40" style={{ '--r': '10deg', animationDelay: '1s' }}><ProductArt type="sneaker" color="#B85C3C" bg={false} className="h-full w-full drop-shadow-xl" label="" /></div>
        <div className="animate-floaty absolute bottom-0 left-[30%] h-44 w-36" style={{ '--r': '4deg', animationDelay: '2s' }}><ProductArt type="cap" color="#6E6B3B" bg={false} className="h-full w-full drop-shadow-xl" label="" /></div>
        <p className="absolute bottom-8 right-0 font-display text-[clamp(4rem,10vw,6rem)] font-extrabold leading-none text-ink/10">404</p>
      </div>
      <div>
        <h1 className="text-hero max-w-[12ch]">{title}</h1>
        <p className="mt-4 max-w-md text-lg text-graphite">{body}</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/" className="btn-primary">Back to home</Link><Link to="/shop" className="btn-ghost">Shop all</Link></div>
      </div>
    </section>
  );
}
