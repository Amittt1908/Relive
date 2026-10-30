import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import Scene3D from '../../components/Scene3D';
import { HeroFallback } from '../Landing';

export default function AuthShell({ title, intro, children, aside = 'Wear it again. Love it longer.' }) {
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-cream lg:block">
        <div className="grain absolute inset-0" />
        <Scene3D name="hero" className="absolute inset-0" fallback={<HeroFallback />} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-[12ch] font-display text-[clamp(2.4rem,4.4vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">{aside}</p>
        </div>
        <div className="absolute left-12 top-10"><Logo /></div>
      </div>
      <div className="flex flex-col px-5 pb-10 pt-[calc(1.5rem+env(safe-area-inset-top,0px))] sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <span className="lg:hidden"><Logo /></span>
          <Link to="/home" className="link-u text-sm">Browse as guest</Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-title">{title}</h1>
          {intro && <p className="mt-3 text-graphite">{intro}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
