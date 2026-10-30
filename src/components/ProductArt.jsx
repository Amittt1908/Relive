import { memo, useState } from 'react';
import { useStore } from '../context/StoreContext';

const CLOTHING_ART = new Set(['tee', 'shirt', 'kurta', 'jacket', 'coat', 'bomber', 'hoodie', 'cardigan', 'dress', 'slipdress', 'jeans', 'skirt', 'cargo', 'trousers']);

// Hand-drawn style garment illustrations so product imagery never breaks.
// viewBox 200 x 240. Each shape gets the garment colour plus derived shades.

export function shade(hex, amt) {
  const h = (hex || '#888888').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `rgb(${r},${g},${b})`;
}

const Hanger = ({ y = 40 }) => (
  <g fill="none" stroke="#6b5a45" strokeWidth="3" strokeLinecap="round">
    <path d={`M100 ${y - 22} q0 -10 8 -10 q8 0 8 8 q0 6 -8 9`} />
    <path d={`M100 ${y - 14} L100 ${y - 8}`} />
  </g>
);

const ClipBar = ({ y = 30 }) => (
  <g>
    <path d={`M100 ${y - 22} q0 -10 8 -10 q8 0 8 8`} fill="none" stroke="#7d7f82" strokeWidth="3" strokeLinecap="round" />
    <rect x="52" y={y - 10} width="96" height="5" rx="2.5" fill="#9fa2a6" />
    <rect x="60" y={y - 7} width="8" height="12" rx="1.5" fill="#7d7f82" />
    <rect x="132" y={y - 7} width="8" height="12" rx="1.5" fill="#7d7f82" />
  </g>
);

const Buttons = ({ x = 100, from = 70, to = 190, n = 5, c }) => (
  <g fill={c}>
    {Array.from({ length: n }).map((_, i) => (
      <circle key={i} cx={x} cy={from + ((to - from) / (n - 1)) * i} r="2.6" />
    ))}
  </g>
);

const Stitch = ({ d, c }) => <path d={d} fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="3 3" />;

function shapes(type, c, view) {
  const dark = shade(c, -0.28);
  const deep = shade(c, -0.45);
  const light = shade(c, 0.22);
  const back = view === 'back';

  switch (type) {
    case 'tee':
      return (
        <g>
          <Hanger y={44} />
          <path d="M62 48 L84 38 Q100 54 116 38 L138 48 L170 80 L150 100 L140 90 L140 206 L60 206 L60 90 L50 100 L30 80 Z" fill={c} />
          {!back && <path d="M84 38 Q100 58 116 38" fill="none" stroke={dark} strokeWidth="4" />}
          {!back && <g opacity=".75"><circle cx="100" cy="125" r="24" fill="none" stroke={light} strokeWidth="6" /><path d="M80 150 L120 100" stroke={dark} strokeWidth="5" /></g>}
          <Stitch d="M62 200 L138 200" c={dark} />
        </g>
      );
    case 'shirt':
    case 'kurta': {
      const bottom = type === 'kurta' ? 226 : 206;
      return (
        <g>
          <Hanger y={44} />
          <path d={`M62 48 L86 38 L100 50 L114 38 L138 48 L162 92 L172 156 L152 160 L142 104 L142 ${bottom} L58 ${bottom} L58 104 L48 160 L28 156 L38 92 Z`} fill={c} />
          {type === 'kurta' ? (
            !back && <><rect x="88" y="38" width="24" height="9" rx="3" fill={dark} /><path d="M100 47 L100 120" stroke={dark} strokeWidth="2" /><Buttons from={58} to={112} n={4} c={light} /></>
          ) : (
            <>
              <path d="M86 38 L100 62 L90 68 L80 46 Z M114 38 L100 62 L110 68 L120 46 Z" fill={dark} />
              {!back && <><path d="M100 62 L100 206" stroke={dark} strokeWidth="1.6" /><Buttons from={76} to={192} n={6} c={light} /><rect x="112" y="84" width="20" height="22" rx="2" fill="none" stroke={dark} strokeWidth="1.5" /></>}
            </>
          )}
          {type === 'kurta' && <g opacity=".55" fill={light}>{[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3].map((k) => <circle key={`${r}-${k}`} cx={70 + k * 20 + (r % 2) * 10} cy={140 + r * 18} r="3.4" />))}</g>}
          <Stitch d={`M150 152 L170 150`} c={dark} />
        </g>
      );
    }
    case 'jacket':
      return (
        <g>
          <Hanger y={44} />
          <path d="M60 48 L86 38 L100 52 L114 38 L140 48 L162 94 L170 168 L150 172 L142 110 L142 182 L58 182 L58 110 L50 172 L30 168 L38 94 Z" fill={c} />
          <rect x="58" y="172" width="84" height="14" rx="2" fill={dark} />
          <path d="M86 38 L100 60 L88 72 L76 48 Z M114 38 L100 60 L112 72 L124 48 Z" fill={dark} />
          {!back ? (
            <>
              <path d="M100 60 L100 186" stroke={deep} strokeWidth="2" />
              <rect x="68" y="84" width="22" height="24" rx="2" fill={dark} /><rect x="110" y="84" width="22" height="24" rx="2" fill={dark} />
              <Buttons from={74} to={178} n={5} c="#c08a4a" />
              <Stitch d="M60 120 L140 120" c={light} />
            </>
          ) : (
            <Stitch d="M62 100 L100 120 L138 100" c={light} />
          )}
        </g>
      );
    case 'coat':
      return (
        <g>
          <Hanger y={44} />
          <path d="M60 48 L86 38 L100 50 L114 38 L140 48 L160 96 L168 182 L150 184 L144 112 L146 228 L54 228 L56 112 L50 184 L32 182 L40 96 Z" fill={c} />
          <path d="M86 38 L100 104 L80 96 L72 56 Z M114 38 L100 104 L120 96 L128 56 Z" fill={dark} />
          {!back && <><Buttons x={108} from={130} to={170} n={2} c={light} /><path d="M70 160 L88 160 M112 160 L130 160" stroke={dark} strokeWidth="2" /></>}
          {back && <path d="M100 150 L100 228" stroke={dark} strokeWidth="2" />}
        </g>
      );
    case 'bomber':
      return (
        <g>
          <Hanger y={44} />
          <path d="M60 52 Q100 36 140 52 L164 98 L168 166 L150 170 L144 112 L146 178 Q100 186 54 178 L56 112 L50 170 L32 166 L36 98 Z" fill={c} />
          <path d="M36 98 L32 166 L50 170 L56 112 Z M164 98 L168 166 L150 170 L144 112 Z" fill="#EAE3D2" opacity=".9" />
          <path d="M54 172 Q100 182 146 172 L146 186 Q100 194 54 186 Z" fill={deep} />
          <path d="M56 178 Q100 186 144 178" stroke="#EAE3D2" strokeWidth="2" fill="none" />
          <path d="M80 44 Q100 54 120 44" stroke={deep} strokeWidth="7" fill="none" />
          {!back && <><path d="M100 52 L100 182" stroke={deep} strokeWidth="1.5" /><Buttons from={66} to={170} n={5} c="#EAE3D2" /></>}
        </g>
      );
    case 'hoodie':
      return (
        <g>
          <Hanger y={50} />
          <path d="M74 44 Q100 18 126 44 L120 64 Q100 74 80 64 Z" fill={dark} />
          <path d="M60 54 L82 46 Q100 64 118 46 L140 54 L164 100 L170 168 L150 172 L144 112 L144 200 L56 200 L56 112 L50 172 L30 168 L36 100 Z" fill={c} />
          <rect x="56" y="188" width="88" height="14" rx="3" fill={dark} />
          {!back && (
            <>
              <path d="M74 140 L126 140 L134 176 L66 176 Z" fill={dark} opacity=".55" />
              <path d="M92 62 L90 96 M108 62 L110 96" stroke={light} strokeWidth="2.4" strokeLinecap="round" />
            </>
          )}
        </g>
      );
    case 'cardigan':
      return (
        <g>
          <Hanger y={44} />
          <path d="M62 48 L84 40 L100 108 L116 40 L138 48 L162 96 L168 174 L150 176 L142 112 L142 192 L58 192 L58 112 L50 176 L32 174 L38 96 Z" fill={c} />
          <g stroke={dark} strokeWidth="1.2" opacity=".6">{Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${64 + i * 9} 112 L${64 + i * 9} 190`} />)}</g>
          <rect x="58" y="182" width="84" height="12" fill={dark} />
          {!back && <Buttons x={100} from={114} to={184} n={4} c="#f3ead9" />}
        </g>
      );
    case 'dress':
      return (
        <g>
          <Hanger y={42} />
          <path d="M80 44 L88 40 L100 58 L112 40 L120 44 L124 96 L76 96 Z" fill={c} />
          <path d="M76 96 L124 96 L134 140 L66 140 Z" fill={shade(c, 0.08)} />
          <path d="M66 140 L134 140 L146 186 L54 186 Z" fill={c} />
          <path d="M54 186 L146 186 L160 228 L40 228 Z" fill={shade(c, 0.08)} />
          <g fill={light} opacity=".6">{[[86, 70], [112, 82], [80, 120], [118, 128], [72, 166], [100, 156], [128, 172], [62, 208], [96, 214], [136, 206]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" />)}</g>
          {!back && <path d="M90 50 L100 66 L110 50" stroke={dark} strokeWidth="2" fill="none" />}
        </g>
      );
    case 'slipdress':
      return (
        <g>
          <Hanger y={40} />
          <path d="M82 40 L80 70 M118 40 L120 70" stroke={dark} strokeWidth="2" />
          <path d="M78 70 Q100 82 122 70 L126 120 Q140 180 150 228 L50 228 Q60 180 74 120 Z" fill={c} />
          <path d="M100 90 Q96 160 110 228" stroke={light} strokeWidth="3" fill="none" opacity=".6" />
          <path d="M82 120 Q78 170 70 228" stroke={dark} strokeWidth="1.5" fill="none" opacity=".5" />
        </g>
      );
    case 'skirt':
      return (
        <g>
          <ClipBar y={40} />
          <rect x="62" y="38" width="76" height="14" rx="3" fill={dark} />
          <path d="M62 52 L138 52 L162 196 L38 196 Z" fill={c} />
          <g stroke={dark} strokeWidth="1.3" opacity=".7">{Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M${66 + i * 8.5} 52 L${42 + i * 14.5} 196`} />)}</g>
        </g>
      );
    case 'jeans':
    case 'cargo': {
      const wide = type === 'cargo' ? 8 : 0;
      return (
        <g>
          <ClipBar y={40} />
          <rect x="62" y="38" width="76" height="14" rx="2" fill={dark} />
          <path d={`M62 52 L138 52 L${144 + wide} 226 L${108 - wide / 2} 226 L100 100 L${92 + wide / 2} 226 L${56 - wide} 226 Z`} fill={c} />
          {!back ? (
            <>
              <path d="M100 52 L100 100" stroke={deep} strokeWidth="1.6" />
              <path d="M66 54 Q76 72 90 56 M134 54 Q124 72 110 56" fill="none" stroke={dark} strokeWidth="1.6" />
            </>
          ) : (
            <><rect x="70" y="64" width="20" height="22" rx="2" fill="none" stroke={dark} strokeWidth="1.6" /><rect x="110" y="64" width="20" height="22" rx="2" fill="none" stroke={dark} strokeWidth="1.6" /></>
          )}
          {type === 'cargo' && <><rect x="52" y="132" width="20" height="28" rx="2" fill={dark} /><rect x="128" y="132" width="20" height="28" rx="2" fill={dark} /></>}
          <Stitch d={`M${58 - wide} 218 L${92 + wide / 2} 218 M${108 - wide / 2} 218 L${142 + wide} 218`} c={light} />
        </g>
      );
    }
    case 'sneaker':
      return (
        <g transform={back ? 'translate(200 0) scale(-1 1)' : undefined}>
          <ellipse cx="100" cy="186" rx="76" ry="7" fill="#22211F" opacity=".12" />
          <path d="M28 160 Q30 128 52 120 L88 104 Q104 112 116 118 L156 132 Q178 140 176 164 Z" fill={c} />
          <path d="M24 162 L178 162 Q180 178 168 180 L36 180 Q22 178 24 162 Z" fill="#F4F0E6" stroke={shade('#F4F0E6', -0.2)} />
          <path d="M70 132 Q104 128 134 150 L120 156 Q96 140 70 144 Z" fill="#B85C3C" opacity=".85" />
          <g stroke={dark} strokeWidth="2.2" strokeLinecap="round">{[0, 1, 2, 3].map((i) => <path key={i} d={`M${86 + i * 8} ${110 + i * 3} l8 8`} />)}</g>
          <path d="M28 150 Q40 128 58 122" stroke={dark} strokeWidth="2" fill="none" />
        </g>
      );
    case 'boot':
      return (
        <g transform={back ? 'translate(200 0) scale(-1 1)' : undefined}>
          <ellipse cx="100" cy="190" rx="70" ry="6" fill="#22211F" opacity=".12" />
          <path d="M56 46 L104 46 L106 130 Q150 136 166 160 L168 176 L44 176 L46 140 Q52 100 56 46 Z" fill={c} />
          <path d="M80 50 L100 50 L100 118 L86 118 Z" fill={dark} />
          <path d="M42 176 L170 176 L170 186 L42 186 Z" fill={deep} />
          <rect x="60" y="34" width="10" height="16" rx="3" fill={dark} />
        </g>
      );
    case 'tote':
      return (
        <g>
          <ellipse cx="100" cy="212" rx="68" ry="7" fill="#22211F" opacity=".12" />
          <path d="M70 92 Q70 40 100 40 Q130 40 130 92" fill="none" stroke={dark} strokeWidth="7" />
          <path d="M44 92 L156 92 L148 206 L52 206 Z" fill={c} />
          {!back && <><rect x="80" y="112" width="40" height="30" rx="3" fill={dark} opacity=".5" /><circle cx="100" cy="127" r="3.5" fill="#c9cbcf" /></>}
          {c === '#6A7FA0' && <g stroke={shade(c, 0.25)} strokeWidth="1.5" fill="none"><path d="M44 140 L156 150 M100 92 L96 206" /></g>}
          <Stitch d="M48 100 L152 100" c={light} />
        </g>
      );
    case 'shoulderbag':
      return (
        <g>
          <path d="M60 130 Q60 30 100 30 Q140 30 140 130" fill="none" stroke={dark} strokeWidth="4" />
          <path d="M50 120 L150 120 Q156 200 100 202 Q44 200 50 120 Z" fill={c} />
          <g stroke={light} strokeWidth="1.6" opacity=".7" fill="none">{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M54 ${132 + i * 14} Q100 ${138 + i * 14} 146 ${132 + i * 14}`} />)}</g>
          {!back && <><path d="M58 120 Q100 150 142 120" fill={dark} /><rect x="96" y="132" width="8" height="18" rx="4" fill="#a37b4f" /></>}
        </g>
      );
    case 'duffel':
      return (
        <g>
          <ellipse cx="100" cy="194" rx="80" ry="7" fill="#22211F" opacity=".12" />
          <path d="M66 110 Q66 74 100 74 Q134 74 134 110" fill="none" stroke="#7a4f30" strokeWidth="7" />
          <rect x="26" y="106" width="148" height="80" rx="38" fill={c} />
          <path d="M40 112 L160 112" stroke={dark} strokeWidth="3" strokeDasharray="5 4" />
          <rect x="56" y="104" width="12" height="82" fill="#7a4f30" opacity=".85" /><rect x="132" y="104" width="12" height="82" fill="#7a4f30" opacity=".85" />
        </g>
      );
    case 'cap':
      return (
        <g transform={back ? 'translate(200 0) scale(-1 1)' : undefined}>
          <ellipse cx="104" cy="176" rx="70" ry="6" fill="#22211F" opacity=".12" />
          <path d="M48 150 Q46 82 104 78 Q156 80 156 150 Z" fill={c} />
          <path d="M150 146 Q186 146 186 160 Q160 168 140 160 Z" fill={dark} />
          <path d="M48 150 L156 150" stroke={deep} strokeWidth="5" />
          <g stroke={dark} strokeWidth="1.5" fill="none" opacity=".7"><path d="M102 80 Q86 110 84 148" /><path d="M106 80 Q124 110 126 148" /></g>
          <circle cx="104" cy="79" r="4" fill={dark} />
        </g>
      );
    case 'beanie':
      return (
        <g>
          <ellipse cx="100" cy="184" rx="60" ry="6" fill="#22211F" opacity=".12" />
          <path d="M50 140 Q48 66 100 64 Q152 66 150 140 Z" fill={c} />
          <rect x="44" y="134" width="112" height="38" rx="8" fill={dark} />
          <g stroke={deep} strokeWidth="2">{Array.from({ length: 13 }).map((_, i) => <path key={i} d={`M${52 + i * 8} 138 L${52 + i * 8} 168`} />)}</g>
        </g>
      );
    case 'sunglasses':
      return (
        <g>
          <ellipse cx="100" cy="166" rx="74" ry="6" fill="#22211F" opacity=".1" />
          <path d="M40 108 L20 98 M160 108 L180 98" stroke={c} strokeWidth="6" strokeLinecap="round" />
          <circle cx="70" cy="122" r="30" fill="#2c2b29" stroke={c} strokeWidth="8" />
          <circle cx="130" cy="122" r="30" fill="#2c2b29" stroke={c} strokeWidth="8" />
          <path d="M92 112 Q100 104 108 112" stroke={c} strokeWidth="6" fill="none" />
          <path d="M56 108 Q64 102 72 104 M116 108 Q124 102 132 104" stroke="#ffffff" strokeWidth="3" opacity=".35" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'scarf':
      return (
        <g>
          <rect x="52" y="64" width="96" height="96" fill={c} transform="rotate(45 100 112)" />
          <rect x="62" y="74" width="76" height="76" fill="none" stroke="#efe6d4" strokeWidth="4" transform="rotate(45 100 112)" />
          <g fill="#efe6d4" opacity=".75">{[[100, 86], [100, 138], [74, 112], [126, 112], [100, 112]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" />)}</g>
          <path d="M100 180 L94 210 M100 180 L106 212" stroke={c} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case 'belt':
      return (
        <g>
          <path d="M30 150 Q60 80 110 100 Q160 120 170 70" fill="none" stroke={c} strokeWidth="18" strokeLinecap="round" />
          <path d="M30 150 Q60 80 110 100 Q160 120 170 70" fill="none" stroke={dark} strokeWidth="18" strokeDasharray="4 6" opacity=".5" />
          <rect x="150" y="50" width="34" height="30" rx="5" fill="none" stroke="#b8babd" strokeWidth="5" transform="rotate(-25 167 65)" />
        </g>
      );
    case 'earrings':
      return (
        <g>
          {[70, 130].map((x) => (
            <g key={x}>
              <path d={`M${x} 60 q0 -10 6 -10`} stroke="#b8babd" strokeWidth="2.5" fill="none" />
              <circle cx={x} cy="110" r="40" fill="none" stroke="#c8a052" strokeWidth="3" />
              {Array.from({ length: 9 }).map((_, i) => {
                const a = Math.PI * (0.15 + (i / 8) * 0.7);
                return <circle key={i} cx={x + Math.cos(a) * 40} cy={110 + Math.sin(a) * 40} r="5.5" fill={i % 2 ? c : '#efe6d4'} />;
              })}
            </g>
          ))}
        </g>
      );
    default:
      return <rect x="60" y="60" width="80" height="120" rx="12" fill={c} />;
  }
}

function ProductArtBase({ type, color = '#9AAA8A', view = 'front', className = '', label, rounded = true, bg = true }) {
  const tone = shade(color, 0.8);
  const ring = shade(color, 0.62);
  const zoom = view === 'detail';
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      role="img"
      aria-label={label || `${type} illustration`}
      preserveAspectRatio="xMidYMid slice"
    >
      {bg && (
        <>
          <rect width="200" height="240" fill={view === 'back' ? shade(color, 0.86) : tone} rx={rounded ? 0 : 0} />
          <circle cx={view === 'back' ? 60 : 140} cy={zoom ? 120 : 92} r={zoom ? 120 : 74} fill={ring} opacity=".55" />
        </>
      )}
      <g transform={zoom ? 'translate(100 120) scale(1.9) translate(-100 -112)' : undefined}>{shapes(type, color, view)}</g>
    </svg>
  );
}

export const ProductArt = memo(ProductArtBase);

// Renders an uploaded photo (data URL) or the built-in illustration, with a safe fallback.
export function ProductImage({ product, index = 0, className = '' }) {
  const img = product.images?.[index] ?? 'front';
  const [failed, setFailed] = useState(false);
  const { clothingPhotos } = useStore();
  const group = product.gender === 'women' ? 'women' : 'men';
  const photoProducts = clothingPhotos[group] || [];
  const productHash = Array.from(String(product.id)).reduce((hash, char) => hash + char.charCodeAt(0), 0);
  const photoProduct = photoProducts.length ? photoProducts[productHash % photoProducts.length] : null;
  const apiPhoto = product.isDemo && CLOTHING_ART.has(product.art) && photoProduct
    ? photoProduct.images[index % photoProduct.images.length]
    : null;
  const src = apiPhoto || img;
  const srcIsPhoto = typeof src === 'string' && (src.startsWith('data:') || src.startsWith('http') || src.startsWith('/'));
  if (srcIsPhoto && !failed) {
    return (
      <img
        src={src}
        alt={`${product.name}${index ? `, photo ${index + 1}` : ''}`}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  const view = srcIsPhoto ? 'front' : src;
  return (
    <ProductArt
      type={product.art}
      color={product.color?.hex}
      view={view}
      label={`${product.name}, ${product.color?.name || ''} ${view === 'front' ? 'front view' : view === 'back' ? 'back view' : 'close-up'}`}
      className={`h-full w-full ${className}`}
    />
  );
}
