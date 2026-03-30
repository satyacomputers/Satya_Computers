'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StatusGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.z += 0.002;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial 
          color="#F97316" 
          speed={3} 
          distort={0.2} 
          radius={1} 
          wireframe
          opacity={0.15}
          transparent
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 500 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.001;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#F97316"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

export default function OperationalIntegrity3D() {
  return (
    <div className="w-full h-full min-h-[300px] relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <StatusGlobe />
        <Particles count={800} />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center space-y-1">
            <p className="text-[10px] font-black tracking-[0.3em] text-[#F97316] uppercase">Core Engine</p>
            <p className="text-2xl font-heading font-black text-white">LIVE-SYNC</p>
         </div>
      </div>
    </div>
  );
}
