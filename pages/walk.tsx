import {
  ContactShadows,
  GradientTexture,
  Instance,
  Instances,
  OrbitControls,
  Plane,
  Sphere,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import vertexShader from "scene.vert";
import fragmentShader from "scene.frag";
import styles from "./scene.module.scss";
import { airtableList, Model } from "airtableApi";
import Link from "next/link";
import useIsMobile from "isMobile";

const TOP = 70;
const FLOOR = -30;

const shader = { vertexShader, fragmentShader, uniforms: {} };

type InstancedMesh = Omit<
  THREE.InstancedMesh,
  "instanceMatrix" | "instanceColor"
> & {
  instanceMatrix: THREE.InstancedBufferAttribute;
  instanceColor: THREE.InstancedBufferAttribute;
};

const count = 300;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

const Snowflake = () => {
  const ref = useRef<any>(null);

  const r = Math.sqrt(Math.random()) * 80;
  const theta = Math.random() * 2 * Math.PI;
  const position: [number, number, number] = [
    r * Math.cos(theta),
    rand(FLOOR, TOP),
    r * Math.sin(theta),
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
    instance.position.y = TOP - ((position[1] + t) % (TOP - FLOOR));
    instance.position.x = position[0] + Math.sin(t / 10) * xSin;
    instance.position.z = position[2] + Math.sin(t / 10) * zSin;
  });
  return (
    <Instance
      ref={ref}
      scale={rand(1, 7)}
      position={position}
      rotation={[
        Math.PI * 2 * Math.random(),
        Math.PI * 2 * Math.random(),
        Math.PI * 2 * Math.random(),
      ]}
    />
  );
};

const Snow = ({ fields }: { fields: Model[] }) => {
  const geomRef = useRef<InstancedMesh>(null);

  const snowflakes = new Array(count)
    .fill(undefined)
    .map((_, i) => <Snowflake key={i} />);

  useEffect(() => {
    const geom = geomRef.current!.geometry;
    const p = fields.map((f) => JSON.parse(f.points) as [number, number][]);

    for (let i = 0; i < 8; i++) {
      const a = new Float32Array(count * 2);

      for (let j = 0; j < a.length; j += 2) {
        const [x, y] = p[(j / 2) % p.length][i];
        a[j] = x;
        a[j + 1] = y;
      }

      geom.setAttribute(`ap${i + 1}`, new THREE.InstancedBufferAttribute(a, 2));
    }
  }, [fields]);

  return (
    <Instances ref={geomRef} limit={count}>
      <planeGeometry />
      <shaderMaterial args={[shader]} side={THREE.DoubleSide} />
      {snowflakes}
    </Instances>
  );
};

export const getServerSideProps = async () => ({
  props: { fields: (await airtableList()).map((r) => r.fields) },
});

export default function HTTFPage({ fields }: { fields: Model[] }) {
  const isMobile = useIsMobile();

  return (
    <>
    <div className={styles.scene}>
      <Canvas camera={{ position: [0, 0, 10], far: 1000 }}>
        <OrbitControls enablePan={false} maxDistance={100} />
        {/* <Stars /> */}
        <Snow fields={fields} />
        <ContactShadows
          position={[0, FLOOR, 0]}
          scale={160}
          far={(TOP - FLOOR) / 2}
            blur={3}
            color="gray"
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <Plane
          args={[1000, 1000]}
          position={[0, FLOOR - 0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial color="white" />
        </Plane>
        <Sphere args={[160]}>
            <meshBasicMaterial side={THREE.BackSide}>
              <GradientTexture
                stops={[0.4, 1]} // As many stops as you want
                colors={["#bdd9e9", "hotpink"]} // Colors need to match the number of stops
              />
            </meshBasicMaterial>
        </Sphere>
      </Canvas>
    </div>
      <div className={styles.links}>
        <Link href="/">back{isMobile ? "" : " to snowflake generator"} ⬅️</Link>
        <Link href="/gallery">back to gallery ⬅️</Link>
      </div>
    </>
  );
}
