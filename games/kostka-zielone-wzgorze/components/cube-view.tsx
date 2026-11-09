"use client";
import { useEffect, useRef, useState } from "react";
import {
  COLORS,
  DEFAULT_CENTERS,
  NORMALS,
  stickerGeometry,
  type Centers,
  type Face,
} from "../lib/cube";
type Props = {
  state: string;
  centers: Centers;
  view: Face;
  animation: string | null;
  nonce: number;
  onEnd: () => void;
};
export default function CubeView(props: Props) {
  const host = useRef<HTMLDivElement>(null),
    api = useRef<{ show: (p: Props) => void } | null>(null),
    latest = useRef(props);
  latest.current = props;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false,
      cleanup = () => {};
    async function setup() {
      try {
        const T = await import("three");
        const { OrbitControls } = await import(
          "three/addons/controls/OrbitControls.js"
        );
        if (disposed || !host.current) return;
        const container = host.current,
          scene = new T.Scene(),
          camera = new T.PerspectiveCamera(33, 1, 0.1, 50),
          renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 5;
        controls.maxDistance = 10;
        controls.target.set(0, 0, 0);
        scene.add(new T.AmbientLight(0xffffff, 2.5));
        const light = new T.DirectionalLight(0xffffff, 3);
        light.position.set(3, 6, 5);
        scene.add(light);
        const root = new T.Group();
        scene.add(root);
        const bodyGeometry = new T.BoxGeometry(0.94, 0.94, 0.94),
          tileGeometry = new T.PlaneGeometry(0.8, 0.8),
          bodyMaterial = new T.MeshStandardMaterial({
            color: "#38443c",
            roughness: 0.85,
          });
        const materials = Object.fromEntries(
          Object.entries(COLORS).map(([c, v]) => [
            c,
            new T.MeshBasicMaterial({ color: v.hex }),
          ]),
        );
        let turn: InstanceType<typeof T.Group> | null = null,
          start: number | null = null,
          angle = 0,
          axis = new T.Vector3(),
          callback = () => {},
          frame = 0;
        const positions: Record<Face, [number, number, number]> = {
          U: [4, 6.5, 5],
          R: [7, 3, 4],
          F: [4.5, 3.5, 7],
          D: [4, -6, 5],
          L: [-7, 3, 4],
          B: [-4, 3, -7],
        };
        function show(p: Props) {
          root.clear();
          turn = null;
          start = null;
          const cubes = new Map<string, InstanceType<typeof T.Group>>();
          for (let x = -1; x <= 1; x++)
            for (let y = -1; y <= 1; y++)
              for (let z = -1; z <= 1; z++) {
                const cubie = new T.Group();
                cubie.position.set(x, y, z);
                cubie.add(new T.Mesh(bodyGeometry, bodyMaterial));
                root.add(cubie);
                cubes.set([x, y, z].join(), cubie);
              }
          for (const s of stickerGeometry()) {
            const color =
                p.centers[p.state[s.index] as Face] ?? DEFAULT_CENTERS[s.face],
              tile = new T.Mesh(tileGeometry, materials[color]);
            const n = new T.Vector3(...s.normal);
            tile.position.copy(n.clone().multiplyScalar(0.476));
            tile.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), n);
            cubes.get(s.position.join())!.add(tile);
          }
          camera.position.set(...positions[p.view]);
          camera.lookAt(0, 0, 0);
          controls.update();
          if (p.animation) {
            const face = p.animation[0] as Face;
            axis = new T.Vector3(...NORMALS[face]);
            turn = new T.Group();
            root.add(turn);
            for (const cubie of cubes.values())
              if (cubie.position.dot(axis) > 0.99) turn.add(cubie);
            angle =
              (-Math.PI / 2) *
              (p.animation.endsWith("2")
                ? 2
                : p.animation.endsWith("'")
                  ? -1
                  : 1);
            start = performance.now();
            callback = p.onEnd;
          }
        }
        api.current = { show };
        const resize = () => {
          const w = container.clientWidth,
            h = container.clientHeight;
          renderer.setSize(w, h);
          camera.aspect = w / Math.max(1, h);
          camera.updateProjectionMatrix();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(container);
        resize();
        show(latest.current);
        const draw = () => {
          if (disposed) return;
          frame = requestAnimationFrame(draw);
          if (turn && start !== null) {
            const duration = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
              ).matches
                ? 1
                : 1100,
              t = Math.min(1, (performance.now() - start) / duration),
              e = t * t * (3 - 2 * t);
            turn.quaternion.setFromAxisAngle(axis, angle * e);
            if (t === 1) {
              start = null;
              callback();
            }
          }
          controls.update();
          renderer.render(scene, camera);
        };
        draw();
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          controls.dispose();
          bodyGeometry.dispose();
          tileGeometry.dispose();
          bodyMaterial.dispose();
          Object.values(materials).forEach((m) => m.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
          api.current = null;
        };
      } catch {
        if (!disposed) {
          setFailed(true);
          if (latest.current.animation) latest.current.onEnd();
        }
      }
    }
    void setup();
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  useEffect(() => {
    api.current?.show(props);
  }, [props.state, props.centers, props.view, props.animation, props.nonce]);
  useEffect(() => {
    if (failed && props.animation) props.onEnd();
  }, [failed, props.animation, props.nonce]);
  return (
    <div
      className="cube-canvas"
      ref={host}
      role="img"
      aria-label="Obracany model Twojej kostki 3×3"
    >
      {failed && (
        <div className="webgl-fallback">
          Model 3D jest niedostępny w tej przeglądarce.
          <br />
          Wskazówki i siatka „Przed / Po” poniżej nadal działają.
        </div>
      )}
    </div>
  );
}
