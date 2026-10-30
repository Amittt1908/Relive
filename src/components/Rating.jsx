import { Star } from 'lucide-react';

export default function Rating({ value = 0, count, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-graphite" aria-label={`Rated ${value} out of 5${count ? ` from ${count} demo reviews` : ''}`}>
      <Star size={size} className="fill-olive text-olive" aria-hidden="true" />
      <span className="font-medium text-ink">{value.toFixed(1)}</span>
      {count != null && <span>({count})</span>}
    </span>
  );
}
