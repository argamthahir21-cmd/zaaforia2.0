"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface CinemaIntro3DProps {
  isOpen: boolean;
  onOpenedComplete: () => void;
  isEntered: boolean;
  onEnteredComplete: () => void;
}

// Controller component to manage camera, lighting sweeps, and animations
function SceneController({
  isOpen,
  onOpenedComplete,
  isEntered,
  onEnteredComplete,
  outerFrameRef,
  topBarRef,
  diagBarRef,
  botBarRef,
  accentsRef,
  innerLightRef,
  sparklesState,
}: {
  isOpen: boolean;
  onOpenedComplete: () => void;
  isEntered: boolean;
  onEnteredComplete: () => void;
  outerFrameRef: React.RefObject<THREE.Group | null>;
  topBarRef: React.RefObject<THREE.Mesh | null>;
  diagBarRef: React.RefObject<THREE.Mesh | null>;
  botBarRef: React.RefObject<THREE.Mesh | null>;
  accentsRef: React.RefObject<THREE.Group | null>;
  innerLightRef: React.RefObject<THREE.PointLight | null>;
  sparklesState: React.MutableRefObject<{ opacity: number }>;
}) {
  const { camera } = useThree();
  const hasOpened = useRef(false);
  const hasEntered = useRef(false);

  useEffect(() => {
    // Set initial camera view centered on the monogram
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Handle Logo Drawing / Assembly Animation
  useEffect(() => {
    if (isOpen && !hasOpened.current) {
      hasOpened.current = true;

      // Set initial state for assembly animation
      if (outerFrameRef.current) outerFrameRef.current.scale.set(0, 0, 0);
      if (topBarRef.current) {
        topBarRef.current.position.x = -2.5;
        topBarRef.current.scale.set(0, 1, 1);
      }
      if (botBarRef.current) {
        botBarRef.current.position.x = 2.5;
        botBarRef.current.scale.set(0, 1, 1);
      }
      if (diagBarRef.current) {
        diagBarRef.current.scale.set(1, 0, 1);
      }
      if (accentsRef.current) {
        accentsRef.current.scale.set(0, 0, 0);
      }

      const tl = gsap.timeline({
        onComplete: onOpenedComplete,
      });

      // 1. Outer Frame scales and spins in
      if (outerFrameRef.current) {
        tl.to(
          outerFrameRef.current.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.5,
            ease: "elastic.out(1.0, 0.75)",
          },
          0
        );
        tl.to(
          outerFrameRef.current.rotation,
          {
            z: -Math.PI * 0.5,
            duration: 1.8,
            ease: "power2.out",
          },
          0
        );
      }

      // 2. Diagonal Bar draws out from the center
      if (diagBarRef.current) {
        tl.to(
          diagBarRef.current.scale,
          {
            y: 1,
            duration: 1.2,
            ease: "power3.inOut",
          },
          0.3
        );
      }

      // 3. Top and Bottom Bars slide into place
      if (topBarRef.current) {
        tl.to(
          topBarRef.current.position,
          {
            x: 0,
            duration: 1.2,
            ease: "back.out(1.2)",
          },
          0.6
        );
        tl.to(
          topBarRef.current.scale,
          {
            x: 1,
            duration: 1.0,
            ease: "power2.out",
          },
          0.6
        );
      }

      if (botBarRef.current) {
        tl.to(
          botBarRef.current.position,
          {
            x: 0,
            duration: 1.2,
            ease: "back.out(1.2)",
          },
          0.6
        );
        tl.to(
          botBarRef.current.scale,
          {
            x: 1,
            duration: 1.0,
            ease: "power2.out",
          },
          0.6
        );
      }

      // 4. Accent Diamonds scale in
      if (accentsRef.current) {
        tl.to(
          accentsRef.current.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.8,
            ease: "back.out(1.5)",
          },
          1.0
        );
      }

      // 5. Inner light flash & Sparkles fade in
      if (innerLightRef.current) {
        tl.to(
          innerLightRef.current,
          {
            intensity: 30,
            duration: 0.8,
            ease: "power2.out",
          },
          1.1
        );
        tl.to(
          innerLightRef.current,
          {
            intensity: 10,
            duration: 1.0,
            ease: "power2.inOut",
          },
          1.9
        );
      }

      tl.to(
        sparklesState.current,
        {
          opacity: 0.85,
          duration: 1.2,
        },
        1.1
      );

      // 6. Camera shifts slightly forward
      tl.to(
        camera.position,
        {
          z: 4.2,
          duration: 2.2,
          ease: "power2.out",
        },
        0.5
      );
    }
  }, [isOpen, onOpenedComplete, outerFrameRef, topBarRef, diagBarRef, botBarRef, accentsRef, innerLightRef, sparklesState, camera]);

  // Handle Camera Zoom into/through the Monogram (Site Entry)
  useEffect(() => {
    if (isEntered && !hasEntered.current) {
      hasEntered.current = true;

      // Kill any running camera tweens
      gsap.killTweensOf(camera.position);

      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 0.15, // Zoom completely through the monogram frame
        duration: 1.3,
        ease: "power3.inOut",
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        },
        onComplete: onEnteredComplete,
      });
    }
  }, [isEntered, onEnteredComplete, camera]);

  return null;
}

// Scene content containing lights, reflective environment, and monogram structure
function SceneContent({
  outerFrameRef,
  topBarRef,
  diagBarRef,
  botBarRef,
  accentsRef,
  innerLightRef,
  sparklesState,
  sparklesRef,
  spotLightRef,
}: {
  outerFrameRef: React.RefObject<THREE.Group | null>;
  topBarRef: React.RefObject<THREE.Mesh | null>;
  diagBarRef: React.RefObject<THREE.Mesh | null>;
  botBarRef: React.RefObject<THREE.Mesh | null>;
  accentsRef: React.RefObject<THREE.Group | null>;
  innerLightRef: React.RefObject<THREE.PointLight | null>;
  sparklesState: React.MutableRefObject<{ opacity: number }>;
  sparklesRef: React.RefObject<any>;
  spotLightRef: React.RefObject<THREE.SpotLight | null>;
}) {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Slow idle drift and bobbing once assembled
    if (outerFrameRef.current && outerFrameRef.current.scale.x > 0.5) {
      // Gentle horizontal rotation
      outerFrameRef.current.rotation.y = Math.sin(time * 0.4) * 0.15;
      outerFrameRef.current.rotation.x = Math.cos(time * 0.3) * 0.1;
      
      // Floating motion
      outerFrameRef.current.position.y = Math.sin(time * 1.2) * 0.08;
    }

    // 2. Slow spotlight sweep to animate metallic reflections
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(time * 1.5) * 4;
      spotLightRef.current.position.y = Math.cos(time * 1.5) * 4 + 4;
    }

    // 3. Update sparkles opacity
    if (sparklesRef.current) {
      sparklesRef.current.opacity = sparklesState.current.opacity;
    }
  });

  return (
    <>
      {/* --- Ambient & Studio Lighting --- */}
      <ambientLight intensity={0.4} />
      
      {/* High-end key lights */}
      <directionalLight position={[4, 5, 4]} intensity={2.5} color="#FAFAF7" castShadow />
      <directionalLight position={[-4, 3, 2]} intensity={1.2} color="#D4B88A" />
      <directionalLight position={[0, -4, 3]} intensity={0.6} color="#FFFFFF" />

      {/* Main spotlight sweeping for premium sheen reflections */}
      <spotLight
        ref={spotLightRef}
        position={[0, 5, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={25}
        castShadow
        color="#FAFAF7"
        shadow-mapSize={[1024, 1024]}
      />

      {/* Volumetric Point Light at center of Monogram */}
      <pointLight
        ref={innerLightRef}
        position={[0, 0, 0]}
        intensity={0}
        distance={5}
        color="#D4B88A"
      />

      {/* --- Assembled Z-Monogram Group --- */}
      <group ref={outerFrameRef} position={[0, 0, 0]}>
        
        {/* Outer Circular Frame */}
        <mesh>
          <torusGeometry args={[1.2, 0.035, 16, 120]} />
          <meshPhysicalMaterial
            color="#B8945F"
            metalness={1.0}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Inner Diamond Frame */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[1.0, 0.02, 16, 80]} />
          <meshPhysicalMaterial
            color="#D4B88A"
            metalness={1.0}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* --- Stylized "Z" Letters --- */}
        {/* Top Bar of Z */}
        <RoundedBox
          ref={topBarRef}
          args={[0.85, 0.1, 0.1]}
          radius={0.025}
          smoothness={4}
          position={[0, 0.42, 0]}
        >
          <meshPhysicalMaterial
            color="#D4B88A"
            metalness={1.0}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </RoundedBox>

        {/* Diagonal Bar of Z (Drawn vertically, rotated 45deg) */}
        <RoundedBox
          ref={diagBarRef}
          args={[1.18, 0.1, 0.1]}
          radius={0.025}
          smoothness={4}
          rotation={[0, 0, -Math.PI / 4]}
          position={[0, 0, 0]}
        >
          <meshPhysicalMaterial
            color="#B8945F"
            metalness={1.0}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
          />
        </RoundedBox>

        {/* Bottom Bar of Z */}
        <RoundedBox
          ref={botBarRef}
          args={[0.85, 0.1, 0.1]}
          radius={0.025}
          smoothness={4}
          position={[0, -0.42, 0]}
        >
          <meshPhysicalMaterial
            color="#D4B88A"
            metalness={1.0}
            roughness={0.08}
            clearcoat={1.0}
            clearcoatRoughness={0.05}
          />
        </RoundedBox>

        {/* --- Diamond Accents --- */}
        <group ref={accentsRef}>
          {/* Top-Left Gem */}
          <mesh position={[-0.42, 0.42, 0.06]}>
            <icosahedronGeometry args={[0.075, 1]} />
            <meshPhysicalMaterial
              color="#FAFAF7"
              transmission={0.95}
              ior={2.4}
              thickness={0.8}
              roughness={0.0}
              metalness={0.1}
              clearcoat={1.0}
            />
          </mesh>

          {/* Bottom-Right Gem */}
          <mesh position={[0.42, -0.42, 0.06]}>
            <icosahedronGeometry args={[0.075, 1]} />
            <meshPhysicalMaterial
              color="#FAFAF7"
              transmission={0.95}
              ior={2.4}
              thickness={0.8}
              roughness={0.0}
              metalness={0.1}
              clearcoat={1.0}
            />
          </mesh>
        </group>

      </group>

      {/* Floating Sparkles around the monogram */}
      <Sparkles
        ref={sparklesRef}
        count={50}
        scale={[2.2, 2.2, 2.2]}
        position={[0, 0, 0]}
        size={2.0}
        speed={0.3}
        color="#D4B88A"
      />
    </>
  );
}

export default function CinemaIntro3D({
  isOpen,
  onOpenedComplete,
  isEntered,
  onEnteredComplete,
}: CinemaIntro3DProps) {
  const outerFrameRef = useRef<THREE.Group>(null);
  const topBarRef = useRef<THREE.Mesh>(null);
  const diagBarRef = useRef<THREE.Mesh>(null);
  const botBarRef = useRef<THREE.Mesh>(null);
  const accentsRef = useRef<THREE.Group>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const sparklesRef = useRef<any>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  // Custom non-state ref to avoid re-rendering R3F canvas on every update frame
  const sparklesState = useRef({ opacity: 0 });

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ fov: 45, near: 0.05, far: 20 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#0d0d0d"]} />
        <SceneController
          isOpen={isOpen}
          onOpenedComplete={onOpenedComplete}
          isEntered={isEntered}
          onEnteredComplete={onEnteredComplete}
          outerFrameRef={outerFrameRef}
          topBarRef={topBarRef}
          diagBarRef={diagBarRef}
          botBarRef={botBarRef}
          accentsRef={accentsRef}
          innerLightRef={innerLightRef}
          sparklesState={sparklesState}
        />
        <SceneContent
          outerFrameRef={outerFrameRef}
          topBarRef={topBarRef}
          diagBarRef={diagBarRef}
          botBarRef={botBarRef}
          accentsRef={accentsRef}
          innerLightRef={innerLightRef}
          sparklesState={sparklesState}
          sparklesRef={sparklesRef}
          spotLightRef={spotLightRef}
        />
      </Canvas>
    </div>
  );
}
