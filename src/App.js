import React, { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import EarthDayMap from "./assets/textures/8k_earth_daymap.jpg";
import EarthNightMap from "./assets/textures/8k_earth_nightmap.jpg";
import EarthCloudMap from "./assets/textures/8k_earth_clouds.jpg";
import EarthSpecularMap from "./assets/textures/8k_earth_specular_map.jpg";
import EarthNormalMap from "./assets/textures/8k_earth_normal_map.jpg";
import FontTexture from "./assets/textures/font.jpg";
import RobotoFont from "./assets/fonts/Roboto_Regular.json";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Stars, Text3D, Center, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import "./App.css";

function Earth({ onLoad }) {
  const [dayMap, nightMap, normalMap, specularMap, cloudMap, fontTexture] =
    useLoader(TextureLoader, [
      EarthDayMap,
      EarthNightMap,
      EarthNormalMap,
      EarthSpecularMap,
      EarthCloudMap,
      FontTexture,
    ]);
  const earthDayRef = useRef();
  const cloundsRef = useRef();
  const textRef = useRef();

  const [isMouseOver, setIsMouseOver] = useState(false);

  const onPointerDown = useCallback(() => {
    setIsMouseOver(true);
  }, []);

  const onPointerUp = useCallback(() => {
    setIsMouseOver(false);
  }, []);

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    if (a > 10 && a < 16) {
      textRef.current.opacity = (30 - a * 2) / 10;
    }
    if (!isMouseOver) {
      earthDayRef.current.rotation.y = earthDayRef.current.rotation.y + 0.001;
      cloundsRef.current.rotation.y = cloundsRef.current.rotation.y + 0.001;
    }
  });

  useEffect(() => {
    global.addEventListener("pointerdown", onPointerDown);
    global.addEventListener("pointerup", onPointerUp);

    return () => {
      global.removeEventListener("pointerdown", onPointerDown);
      global.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerDown, onPointerUp]);

  useEffect(onLoad, [onLoad]);

  return (
    <>
      <mesh position={[0, 0, 1.2]}>
        <Center center>
          <Text3D font={RobotoFont} scale={[0.1, 0.1, 0.01]}>
            {`You must be out there\n         somewhere`}
            <meshStandardMaterial
              color={"skyblue"}
              transparent={true}
              lightMap={fontTexture}
              opacity={1}
              ref={textRef}
            />
          </Text3D>
        </Center>
      </mesh>
      <Stars
        radius={100}
        depth={300}
        count={2000}
        factor={2}
        saturation={3}
        fade={false}
        speed={0.1}
      />
      <mesh ref={cloundsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.01, 32, 32]} />
        <meshPhongMaterial
          map={cloudMap}
          opacity={0.4}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <directionalLight color="#fff" position={[-5, 0, -1]} intensity={1} />

      <mesh ref={earthDayRef} position={[0, 0, 0]} rotation={[0, -2.5, 0]}>
        <sphereGeometry args={[1, 500, 500]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial
          map={dayMap}
          lightMap={nightMap}
          lightMapIntensity={2}
          normalMap={normalMap}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.6}
        minDistance={1.5}
        maxDistance={3}
        panSpeed={0.5}
        rotateSpeed={0.4}
      />
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  const onLoad = useCallback(() => {
    setIsLoading(false);

    setTimeout(() => {
      setIsLoaderVisible(false);
    }, 500);
  }, []);

  return (
    <>
      {isLoaderVisible && (
        <div className={`loaderView${isLoading ? "" : " loaderViewHidden"}`}>
          <span className="loader" />
        </div>
      )}
      <Canvas
        style={{ height: "100vh", backgroundColor: "black" }}
        camera={{ position: [0, 0, 2] }}
      >
        <Earth onLoad={onLoad} />
      </Canvas>
    </>
  );
}

export default App;
