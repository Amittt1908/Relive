import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function SectionHead({ title, intro, link, linkLabel = 'See all', className = '' }) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="max-w-2xl">
        <h2 className="text-title text-balance">{title}</h2>
        {intro && <p className="mt-3 max-w-xl text-graphite">{intro}</p>}
      </div>
      {link && (
        <Link to={link} className="link-u inline-flex items-center gap-1 text-sm font-medium">
          {linkLabel} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
