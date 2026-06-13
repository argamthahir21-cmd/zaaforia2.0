"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function FloatingFabric() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#FADADD" />
      <pointLight position={[-5, -5, -5]} intensity={1} color="#D4AF37" />
      <Sparkles count={120} scale={8} size={2} speed={0.3} color="#E39FB0" opacity={0.6} />
      <mesh ref={mesh} castShadow>
        <torusKnotGeometry args={[1.8, 0.35, 128, 24, 2, 3]} />
        <MeshDistortMaterial
          color="#B76E79"
          distort={0.5}
          speed={2}
          metalness={0.2}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Decorative Golden Thread */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.04, 32, 100]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          metalness={1}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>
    </>
  );
}

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const title = "ZAAFORIA".split("");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(30px)" }}
          transition={{ duration: 1.6, ease: "easeOut" as any }}
          className="fixed inset-0 z-[100] overflow-hidden flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg, #FDF6F7 0%, #FCE8EB 50%, #FDF0F4 100%)" }}
        >
          {/* 3D Canvas Background */}
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
              <FloatingFabric />
            </Canvas>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(253,246,247,0.7)_100%)]" />

          {/* Logo Text */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: "easeOut" }}
              className="flex items-center"
            >
              <h1 className="font-playfair text-6xl md:text-8xl lg:text-[10rem] tracking-[0.2em] md:tracking-[0.3em] font-bold flex drop-shadow-2xl">
                {title.map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: "blur(12px)", y: 25 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.4 + index * 0.14,
                      ease: "easeOut" as any,
                    }}
                    className={letter === "A" ? "text-[#C68E17]" : "text-[#2B1B24]"}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 1.4, ease: "easeOut" as any }}
              className="font-poppins text-sm md:text-base tracking-[0.5em] uppercase text-[#2B1B24] mt-8 font-medium"
            >
              Unveiling Feminine Elegance
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.5, delay: 0.3, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="mt-10 w-48 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
