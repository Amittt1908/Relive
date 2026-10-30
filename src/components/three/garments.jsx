import { useMemo } from 'react';
import * as THREE from 'three';

// Simple extruded garment silhouettes. Coordinates are authored in the same
// 200 x 240 space as the SVG illustrations, then centred and scaled.
const POLYS = {
  tee: [[62, 48], [80, 40], [90, 47], [100, 50], [110, 47], [120, 40], [138, 48], [170, 80], [150, 100], [140, 90], [140, 206], [60, 206], [60, 90], [50, 100], [30, 80]],
  jacket: [[62, 48], [86, 38], [100, 52], [114, 38], [138, 48], [162, 92], [172, 170], [152, 174], [142, 104], [142, 196], [58, 196], [58, 104], [48, 174], [28, 170], [38, 92]],
  coat: [[60, 48], [86, 38], [100, 50], [114, 38], [140, 48], [160, 96], [168, 182], [150, 184], [144, 112], [146, 228], [54, 228], [56, 112], [50, 184], [32, 182], [40, 96]],
  dress: [[80, 44], [90, 40], [100, 58], [110, 40], [120, 44], [124, 96], [134, 140], [146, 186], [160, 228], [40, 228], [54, 186], [66, 140], [76, 96]],
  pants: [[62, 40], [138, 40], [146, 226], [108, 226], [100, 100], [92, 226], [54, 226]],
  sneaker: [[28, 160], [32, 136], [52, 120], [88, 104], [116, 118], [156, 132], [174, 146], [176, 164]],
  tag: [[70, 60], [130, 60], [150, 90], [150, 200], [50, 200], [50, 90]],
};

export const ART_TO_3D = {
  tee: 'tee', hoodie: 'tee', cardigan: 'jacket', kurta: 'coat', shirt: 'jacket', jacket: 'jacket', coat: 'coat', bomber: 'jacket',
  dress: 'dress', slipdress: 'dress', skirt: 'dress', jeans: 'pants', cargo: 'pants', sneaker: 'sneaker', boot: 'sneaker',
  tote: 'bag', shoulderbag: 'bag', duffel: 'bag', cap: 'cap', beanie: 'cap', sunglasses: 'tag', scarf: 'tag', belt: 'tag', earrings: 'tag',
};

function shapeFrom(points) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => {
    const px = (x - 100) / 55;
    const py = -(y - 130) / 55;
    if (i === 0) s.moveTo(px, py); else s.lineTo(px, py);
  });
  s.closePath();
  return s;
}

let fabricTex = null;
export function getFabricTexture() {
  if (fabricTex || typeof document === 'undefined') return fabricTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#808080';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 128; i += 2) {
    g.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.08})`;
    g.fillRect(0, i, 128, 1);
    g.fillStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.06})`;
    g.fillRect(i, 0, 1, 128);
  }
  fabricTex = new THREE.CanvasTexture(c);
  fabricTex.wrapS = fabricTex.wrapT = THREE.RepeatWrapping;
  fabricTex.repeat.set(3, 3);
  return fabricTex;
}

function FabricMaterial({ color, roughness = 0.88 }) {
  const tex = getFabricTexture();
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} bumpMap={tex} bumpScale={0.012} />;
}

export function Garment({ kind = 'tee', color = '#7E8F72', accent = '#B85C3C' }) {
  const geo = useMemo(() => {
    if (!POLYS[kind]) return null;
    return new THREE.ExtrudeGeometry(shapeFrom(POLYS[kind]), {
      depth: kind === 'sneaker' ? 0.7 : 0.14,
      bevelEnabled: true,
      bevelThickness: kind === 'sneaker' ? 0.12 : 0.07,
      bevelSize: 0.06,
      bevelSegments: 4,
      curveSegments: 6,
    }).center();
  }, [kind]);

  if (kind === 'bag') {
    return (
      <group>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[1.8, 1.7, 0.55, 2, 2, 2]} />
          <FabricMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <torusGeometry args={[0.55, 0.07, 12, 40, Math.PI]} />
          <meshStandardMaterial color={accent} roughness={0.5} />
        </mesh>
      </group>
    );
  }
  if (kind === 'cap') {
    return (
      <group rotation={[0.2, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <FabricMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.02, 0.85]} scale={[1, 0.08, 0.7]}>
          <cylinderGeometry args={[0.75, 0.75, 1, 32]} />
          <FabricMaterial color={accent} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
    );
  }
  if (kind === 'sneaker') {
    return (
      <group>
        <mesh geometry={geo}><FabricMaterial color={color} roughness={0.6} /></mesh>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[2.9, 0.28, 0.95]} />
          <meshStandardMaterial color="#F4F0E6" roughness={0.5} />
        </mesh>
      </group>
    );
  }
  return (
    <group>
      <mesh geometry={geo}><FabricMaterial color={color} /></mesh>
      {kind === 'tag' && (
        <mesh position={[0, 0.9, 0.12]}>
          <torusGeometry args={[0.12, 0.035, 10, 24]} />
          <meshStandardMaterial color="#B8BABD" metalness={0.8} roughness={0.3} />
        </mesh>
      )}
      {(kind === 'jacket' || kind === 'coat') && (
        <mesh position={[0, 0.2, 0.16]}>
          <boxGeometry args={[0.03, kind === 'coat' ? 2.6 : 2.2, 0.02]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      )}
    </group>
  );
}

// Soft blob shadow drawn once to a canvas.
let shadowTex = null;
export function ShadowBlob({ position = [0, -1.6, 0], scale = 2.2, opacity = 0.35 }) {
  if (!shadowTex && typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(34,33,31,0.55)');
    grad.addColorStop(1, 'rgba(34,33,31,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    shadowTex = new THREE.CanvasTexture(c);
  }
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale * 0.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={shadowTex} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}
