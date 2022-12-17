import { Instance, Instances, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import vertexShader from "scene.vert";
import fragmentShader from "scene.frag";

const TOP = 100;

const uv = new THREE.Vector2();
const kaleid = (x: number, y: number) => {
  uv.x = x;
  uv.y = y;

  const KA = Math.PI / 6.0;
  // get the angle in radians of the current coords relative to origin (i.e. center of screen)
  let angle = Math.atan2(uv.y, uv.x) + 2 * Math.PI;
  // repeat image over evenly divided rotations around the center
  angle = angle % (2.0 * KA);
  // reflect the image within each subdivision to create a tilelable appearance
  angle = Math.abs(angle - KA);
  angle += Math.PI / 2.0;
  // get the distance of the coords from the uv origin (i.e. center of the screen)
  const d = uv.length();
  // map the calculated angle to the uv coordinate system at the given distance
  uv.x = Math.cos(angle);
  uv.y = Math.sin(angle);
  uv.multiplyScalar(d);

  return [uv.x, uv.y];
};

const shader = { vertexShader, fragmentShader, uniforms: {} };

type InstancedMesh = Omit<
  THREE.InstancedMesh,
  "instanceMatrix" | "instanceColor"
> & {
  instanceMatrix: THREE.InstancedBufferAttribute;
  instanceColor: THREE.InstancedBufferAttribute;
};

const count = 300;
const points = [
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
  new Float32Array(count * 2),
];
points.forEach((a) => {
  for (let i = 0; i < a.length; i += 2) {
    const [x, y] = kaleid(Math.random() * 2 - 1, Math.random() * 2 - 1);
    a[i] = x;
    a[i + 1] = y;
  }
});

const Snowflake = () => {
  const ref = useRef<any>(null);
  const position: [number, number, number] = [
    100 * Math.random() - 50,
    50 * Math.random(),
    100 * Math.random() - 50,
  ];
  const speed = Math.random() * 20 + 4;
  const xSin = Math.random() * 5;
  const zSin = Math.random() * 5;
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    // ref.current.rotation.set(
    //   Math.cos(t / 4) / 2,
    //   Math.sin(t / 4) / 2,
    //   Math.cos(t / 1.5) / 2
    // );
    const instance = ref.current!;
    instance.position.y = TOP - ((position[1] + t) % TOP);
    instance.position.x = position[0] + Math.sin(t / 10) * xSin;
    instance.position.z = position[2] + Math.sin(t / 10) * zSin;
  });
  return (
    <Instance
      ref={ref}
      scale={Math.random() * 10}
      position={position}
      rotation={[
        Math.PI * 2 * Math.random(),
        Math.PI * 2 * Math.random(),
        Math.PI * 2 * Math.random(),
      ]}
    />
  );
};

const Snow = () => {
  const geomRef = useRef<InstancedMesh>(null);

  const snowflakes = new Array(count)
    .fill(undefined)
    .map((_, i) => <Snowflake key={i} />);

  useEffect(() => {
    const geom = geomRef.current!.geometry;
    points.forEach((p, i) => {
      geom.setAttribute(`ap${i + 1}`, new THREE.InstancedBufferAttribute(p, 2));
    });
  }, []);

  return (
    <Instances ref={geomRef} limit={count}>
      <planeGeometry />
      <shaderMaterial args={[shader]} />
      {snowflakes}
    </Instances>
  );
};

export default function HTTFPage() {
  return (
    <div style={{ width: 1000, height: 1000 }}>
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 2000], far: 10000 }}
      >
        <OrbitControls />
        <Snow />
      </Canvas>
    </div>
  );
}
