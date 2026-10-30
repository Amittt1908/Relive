import { ProductArt } from './ProductArt';
import Magnetic from './Magnetic';

export default function EmptyState({ art = 'tee', color = '#9AAA8A', title, body, cta, to, onClick, children }) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <div className="animate-floaty relative mb-6 h-44 w-36" style={{ '--r': '-4deg' }}>
        <ProductArt type={art} color={color} bg={false} className="h-full w-full" label="" />
      </div>
      <h2 className="text-3xl tracking-tight">{title}</h2>
      {body && <p className="mt-3 max-w-md text-graphite">{body}</p>}
      {cta && (
        <div className="mt-7">
          <Magnetic to={to} onClick={onClick}>{cta}</Magnetic>
        </div>
      )}
      {children}
    </div>
  );
}
