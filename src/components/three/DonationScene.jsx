import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Garment, ShadowBlob } from './garments';

const DROPS = [
  { kind: 'tee', color: '#7E8F72' },
  { kind: 'dress', color: '#B85C3C' },
  { kind: 'jacket', color: '#7E97B3' },
  { kind: 'pants', color: '#6E6B3B' },
  { kind: 'cap', color: '#E6D29A' },
];

function Drop({ item, i, speed }) {
  const ref = useRef();
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.userData.t = ((g.userData.t ?? i / DROPS.length) + dt * 0.12 * speed.current) % 1;
    const t = g.userData.t;
    g.position.set(Math.sin(i * 2.1) * (1 - t) * 1.6, 3.2 - t * 4.2, Math.cos(i * 1.7) * 0.4);
    g.rotation.set(t * 1.2, t * 4 + i, Math.sin(i + t * 3) * 0.4);
    const s = t > 0.82 ? Math.max(0.001, (1 - t) / 0.18) * 0.45 : 0.45;
    g.scale.setScalar(s);
  });
  return <group ref={ref}><Garment kind={item.kind} color={item.color} accent="#22211F" /></group>;
}

function Ring({ speed }) {
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z -= dt * 0.4 * speed.current; });
  return (
    <group ref={ref} position={[0, 0.4, -1.4]}>
      <mesh><torusGeometry args={[2.3, 0.06, 12, 80, Math.PI * 0.85]} /><meshStandardMaterial color="#7E8F72" roughness={0.4} /></mesh>
      <mesh rotation={[0, 0, Math.PI]}><torusGeometry args={[2.3, 0.06, 12, 80, Math.PI * 0.85]} /><meshStandardMaterial color="#B85C3C" roughness={0.4} /></mesh>
    </group>
  );
}

function Box() {
  const mat = <meshStandardMaterial color="#C9A57A" roughness={0.9} side={THREE.DoubleSide} />;
  return (
    <group position={[0, -1.35, 0]}>
      <mesh position={[0, -0.6, 0]}><boxGeometry args={[2.2, 0.05, 1.6]} />{mat}</mesh>
      <mesh position={[0, 0, 0.8]}><boxGeometry args={[2.2, 1.2, 0.05]} />{mat}</mesh>
      <mesh position={[0, 0, -0.8]}><boxGeometry args={[2.2, 1.2, 0.05]} />{mat}</mesh>
      <mesh position={[1.1, 0, 0]}><boxGeometry args={[0.05, 1.2, 1.6]} />{mat}</mesh>
      <mesh position={[-1.1, 0, 0]}><boxGeometry args={[0.05, 1.2, 1.6]} />{mat}</mesh>
      <mesh position={[0, 0.6, 1.15]} rotation={[0.9, 0, 0]}><boxGeometry args={[2.2, 0.8, 0.04]} />{mat}</mesh>
      <mesh position={[0, 0.6, -1.15]} rotation={[-0.9, 0, 0]}><boxGeometry args={[2.2, 0.8, 0.04]} />{mat}</mesh>
      <mesh position={[0, 0.02, 0.83]}><planeGeometry args={[0.9, 0.3]} /><meshStandardMaterial color="#F6F2EA" /></mesh>
    </group>
  );
}

function Rig({ children }) {
  const ref = useRef();
  useFrame(({ pointer }) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, -0.35 + pointer.x * 0.5, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.25 - pointer.y * 0.15, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

export default function DonationScene() {
  const speed = useRef(1);
  const [, force] = useState(0);
  return (
    <div className="h-full w-full" onPointerEnter={() => { speed.current = 2.4; force((n) => n + 1); }} onPointerLeave={() => { speed.current = 1; }}>
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.6, 7], fov: 42 }} gl={{ alpha: true, antialias: true }} aria-hidden="true">
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 6, 5]} intensity={1.4} color="#fff4e2" />
        <directionalLight position={[-4, 0, 2]} intensity={0.4} color="#C9D2BE" />
        <Rig>
          <Ring speed={speed} />
          {DROPS.map((d, i) => <Drop key={i} item={d} i={i} speed={speed} />)}
          <Box />
          <ShadowBlob position={[0, -2.0, 0]} scale={3.2} opacity={0.3} />
        </Rig>
      </Canvas>
    </div>
  );
}
