import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Frame } from "@/components/ui/frame";
import type { Paths } from "@/utils/frame";
import { twMerge } from "tailwind-merge";

const PANEL_FRAME_PATHS: Paths = [
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-1-stroke)",
      fill: "var(--color-frame-1-fill)",
    },
    path: [
      ["M", "20", "0"],
      ["L", "100% - 24", "0"],
      ["L", "100%", "24"],
      ["L", "100%", "100% - 28"],
      ["L", "100% - 24", "100%"],
      ["L", "24", "100%"],
      ["L", "0", "100% - 32"],
      ["L", "0", "24"],
      ["L", "20", "0"],
    ],
  },
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-2-stroke)",
      fill: "var(--color-frame-2-fill)",
    },
    path: [
      ["M", "10", "100% - 12"],
      ["L", "100% - 10", "100% - 12"],
      ["L", "100% - 18", "100%"],
      ["L", "18", "100%"],
      ["L", "10", "100% - 12"],
    ],
  },
];

const VIEWER_FRAME_PATHS: Paths = [
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-1-stroke)",
      fill: "var(--color-frame-1-fill)",
    },
    path: [
      ["M", "32", "0"],
      ["L", "100% - 36", "0"],
      ["L", "100%", "40"],
      ["L", "100%", "100% - 36"],
      ["L", "100% - 36", "100%"],
      ["L", "36", "100%"],
      ["L", "0", "100% - 40"],
      ["L", "0", "36"],
      ["L", "32", "0"],
    ],
  },
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-2-stroke)",
      fill: "var(--color-frame-2-fill)",
    },
    path: [
      ["M", "26", "100% - 18"],
      ["L", "100% - 28", "100% - 18"],
      ["L", "100% - 42", "100%"],
      ["L", "42", "100%"],
      ["L", "26", "100% - 18"],
    ],
  },
];

const OVERLAY_FRAME_PATHS: Paths = [
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-1-stroke)",
      fill: "var(--color-frame-1-fill)",
    },
    path: [
      ["M", "14", "0"],
      ["L", "100% - 18", "0"],
      ["L", "100%", "28"],
      ["L", "100%", "100% - 24"],
      ["L", "100% - 18", "100%"],
      ["L", "18", "100%"],
      ["L", "0", "100% - 28"],
      ["L", "0", "22"],
      ["L", "14", "0"],
    ],
  },
  {
    show: true,
    style: {
      strokeWidth: "1",
      stroke: "var(--color-frame-2-stroke)",
      fill: "var(--color-frame-2-fill)",
    },
    path: [
      ["M", "8", "100% - 12"],
      ["L", "100% - 12", "100% - 12"],
      ["L", "100% - 18", "100%"],
      ["L", "14", "100%"],
      ["L", "8", "100% - 12"],
    ],
  },
];

type MoleculeData = {
  atoms: {
    element: string;
    x: number;
    y: number;
    z: number;
    color: number;
  }[];
  bonds: [number, number][];
  geometry: string;
  bondAngle: string;
  polarity: string;
  dipole: string;
  polarityVector?: { x: number; y: number; z: number };
  metadata: {
    label: string;
    value: string;
  }[];
};

const MOLECULES: Record<string, MoleculeData> = {
  "4-bromo-2-5-dimethoxyphenylethylamine": {
    atoms: [
      { element: "Br", x: 3.5303, y: -1.3547, z: -0.8059, color: 0xa52a2a },
      { element: "O", x: -1.6027, y: -1.9546, z: -0.0908, color: 0x96ceb4 },
      { element: "O", x: 2.6493, y: 1.5578, z: -0.1173, color: 0x96ceb4 },
      { element: "N", x: -4.1874, y: 1.7812, z: -0.3936, color: 0x45b7d1 },
      { element: "C", x: -0.7502, y: 0.2679, z: 0.1903, color: 0x4ecdc4 },
      { element: "C", x: -2.112, y: 0.7922, z: 0.5068, color: 0x4ecdc4 },
      { element: "C", x: -0.555, y: -1.0834, z: -0.0955, color: 0x4ecdc4 },
      { element: "C", x: -2.8885, y: 1.2622, z: -0.7286, color: 0x4ecdc4 },
      { element: "C", x: 0.3331, y: 1.1464, z: 0.1809, color: 0x4ecdc4 },
      { element: "C", x: 1.6118, y: 0.6736, z: -0.1145, color: 0x4ecdc4 },
      { element: "C", x: 0.7237, y: -1.5561, z: -0.3907, color: 0x4ecdc4 },
      { element: "C", x: 1.807, y: -0.6776, z: -0.4002, color: 0x4ecdc4 },
      { element: "C", x: -1.9022, y: -2.6009, z: 1.1446, color: 0x4ecdc4 },
      { element: "C", x: 3.3427, y: 1.7458, z: 1.1144, color: 0x4ecdc4 },
      { element: "H", x: -2.0139, y: 1.6295, z: 1.2123, color: 0xff6b6b },
      { element: "H", x: -2.7013, y: 0.0457, z: 1.0511, color: 0xff6b6b },
      { element: "H", x: -2.3196, y: 2.0367, z: -1.256, color: 0xff6b6b },
      { element: "H", x: -3.0065, y: 0.4313, z: -1.4338, color: 0xff6b6b },
      { element: "H", x: 0.1868, y: 2.2017, z: 0.3993, color: 0xff6b6b },
      { element: "H", x: 0.8646, y: -2.6114, z: -0.6129, color: 0xff6b6b },
      { element: "H", x: -4.094, y: 2.5576, z: 0.2603, color: 0xff6b6b },
      { element: "H", x: -4.7309, y: 1.0706, z: 0.0948, color: 0xff6b6b },
      { element: "H", x: -1.199, y: -3.4235, z: 1.308, color: 0xff6b6b },
      { element: "H", x: -2.9131, y: -3.0125, z: 1.0803, color: 0xff6b6b },
      { element: "H", x: -1.8579, y: -1.9074, z: 1.9904, color: 0xff6b6b },
      { element: "H", x: 3.6707, y: 0.7923, z: 1.5395, color: 0xff6b6b },
      { element: "H", x: 2.7008, y: 2.2695, z: 1.8299, color: 0xff6b6b },
      { element: "H", x: 4.224, y: 2.3633, z: 0.9202, color: 0xff6b6b },
    ],
    bonds: [
      [0, 11],
      [1, 6],
      [1, 12],
      [2, 9],
      [2, 13],
      [3, 7],
      [3, 20],
      [3, 21],
      [4, 5],
      [4, 6],
      [4, 8],
      [5, 7],
      [5, 14],
      [5, 15],
      [6, 10],
      [7, 16],
      [7, 17],
      [8, 9],
      [8, 18],
      [9, 11],
      [10, 11],
      [10, 19],
      [12, 22],
      [12, 23],
      [12, 24],
      [13, 25],
      [13, 26],
      [13, 27],
    ],
    geometry: "Complex (Aromatic + Tetrahedral)",
    bondAngle: "120° (ring), ~109.5° (tetrahedral)",
    polarity: "Polar",
    dipole: "~2.5 D",
    polarityVector: { x: 0.74, y: -2.39, z: 0.57 },
    metadata: [
      { label: "Molecular Formula", value: "C₁₀H₁₄BrNO₂" },
      { label: "Molecular Weight", value: "260.13 g/mol" },
      { label: "Geometry", value: "Complex Aromatic" },
      { label: "Bond Angle", value: "120° (ring)" },
      { label: "Polarity", value: "Polar" },
      { label: "Dipole Moment", value: "~2.5 D" },
      { label: "PubChem CID", value: "98527" },
      { label: "Classification", value: "Psychoactive" },
    ],
  },
};

const DOUBLE_BOND_PAIRS: [number, number][] = [
  [4, 8],
  [6, 10],
  [8, 9],
  [9, 11],
];

const LEGEND_ITEMS = [
  { label: "Carbon", color: "#4ecdc4" },
  { label: "Hydrogen", color: "#ff6b6b" },
  { label: "Bromine", color: "#a52a2a" },
  { label: "Oxygen", color: "#96ceb4" },
  { label: "Nitrogen", color: "#45b7d1" },
  { label: "Bonds", color: "#cccccc" },
];

function createCanvasLabel(element: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  if (context) {
    context.font = "bold 86px Orbitron, sans-serif";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(element, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Home() {
  const [showBonds, setShowBonds] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showElectronClouds, setShowElectronClouds] = useState(false);
  const [showPolarity, setShowPolarity] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [isVibrating, setIsVibrating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const moleculeGroupRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);
  const isRotatingRef = useRef(isRotating);
  const isVibratingRef = useRef(isVibrating);

  const doubleBonds = useMemo(() => {
    return new Set(
      DOUBLE_BOND_PAIRS.map(([a, b]) => JSON.stringify([a, b].sort()))
    );
  }, []);

  const molecule = MOLECULES["4-bromo-2-5-dimethoxyphenylethylamine"];

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    isVibratingRef.current = isVibrating;
  }, [isVibrating]);

  const rebuildMolecule = useCallback(() => {
    const group = moleculeGroupRef.current;
    if (!group) return;

    // Dispose previous children
    while (group.children.length) {
      const child = group.children[0];
      group.remove(child);

      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: THREE.Material) => mat.dispose());
        } else {
          child.material.dispose();
        }
      } else if (child instanceof THREE.Sprite) {
        if (child.material.map) {
          child.material.map.dispose();
        }
        child.material.dispose();
      } else if (child.type === "ArrowHelper") {
        const arrow = child as THREE.ArrowHelper;
        arrow.cone.geometry.dispose();
        (arrow.cone.material as THREE.Material).dispose();
        arrow.line.geometry.dispose();
        (arrow.line.material as THREE.Material).dispose();
      }
    }

    molecule.atoms.forEach((atom, index) => {
      const radius = atom.element === "H" ? 0.3 : atom.element === "Br" ? 0.7 : 0.5;
      const atomGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const atomMaterial = new THREE.MeshPhongMaterial({
        color: atom.color,
        shininess: 120,
        transparent: true,
        opacity: 0.96,
      });

      const atomMesh = new THREE.Mesh(atomGeometry, atomMaterial);
      atomMesh.position.set(atom.x, atom.y, atom.z);
      atomMesh.castShadow = true;
      atomMesh.receiveShadow = true;
      atomMesh.userData = {
        type: "atom",
        index,
        basePosition: new THREE.Vector3(atom.x, atom.y, atom.z),
      };
      group.add(atomMesh);

      if (showElectronClouds) {
        const cloudGeometry = new THREE.SphereGeometry(radius * 1.9, 20, 20);
        const cloudMaterial = new THREE.MeshBasicMaterial({
          color: atom.color,
          transparent: true,
          opacity: 0.16,
          wireframe: true,
        });
        const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloudMesh.position.copy(atomMesh.position);
        cloudMesh.userData = { type: "electron-cloud", index };
        group.add(cloudMesh);
      }

      if (showLabels) {
        const texture = createCanvasLabel(atom.element);
        const labelMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false,
        });
        const sprite = new THREE.Sprite(labelMaterial);
        const offset = atom.element === "H" ? 0.7 : 0.95;
        sprite.position.set(atom.x, atom.y + offset, atom.z);
        sprite.scale.set(0.8, 0.8, 0.8);
        sprite.userData = { type: "label", index };
        group.add(sprite);
      }
    });

    if (showBonds) {
      molecule.bonds.forEach(([i, j]) => {
        const atom1 = molecule.atoms[i];
        const atom2 = molecule.atoms[j];
        const bondKey = JSON.stringify([i, j].sort());
        const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
        const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const direction = new THREE.Vector3().subVectors(end, start);
        const distance = direction.length();
        direction.normalize();

        if (doubleBonds.has(bondKey)) {
          const perp = new THREE.Vector3(1, 0, 0).cross(direction);
          if (perp.length() < 0.01) {
            perp.set(0, 1, 0).cross(direction);
          }
          perp.normalize().multiplyScalar(0.12);

          for (const side of [1, -1]) {
            const bondGeometry = new THREE.CylinderGeometry(0.06, 0.06, distance, 20);
            const bondMaterial = new THREE.MeshPhongMaterial({
              color: 0xffcc00,
              shininess: 60,
            });
            const bondMesh = new THREE.Mesh(bondGeometry, bondMaterial);
            bondMesh.position.copy(midpoint).add(perp.clone().multiplyScalar(side));
            bondMesh.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              direction
            );
            bondMesh.userData = { type: "bond" };
            group.add(bondMesh);
          }
        } else {
          const bondGeometry = new THREE.CylinderGeometry(0.07, 0.07, distance, 18);
          const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
          const bondMesh = new THREE.Mesh(bondGeometry, bondMaterial);
          bondMesh.position.copy(midpoint);
          bondMesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction
          );
          bondMesh.userData = { type: "bond" };
          group.add(bondMesh);
        }
      });
    }

    if (showPolarity && molecule.polarityVector) {
      const origin = new THREE.Vector3(0, 0, 0);
      const direction = new THREE.Vector3(
        molecule.polarityVector.x,
        molecule.polarityVector.y,
        molecule.polarityVector.z
      ).normalize();
      const arrow = new THREE.ArrowHelper(direction, origin, 3.2, 0xff3366, 0.5, 0.3);
      arrow.userData = { type: "polarity" };
      group.add(arrow);
    }

    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);

    setIsLoading(false);
  }, [doubleBonds, molecule, showBonds, showElectronClouds, showLabels, showPolarity]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071a2e);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 60);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const moleculeGroup = new THREE.Group();
    scene.add(moleculeGroup);

    const ambientLight = new THREE.AmbientLight(0x3c4a6b, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
    mainLight.position.set(6, 12, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0x4ecdc4, 0.6);
    rimLight.position.set(-6, -8, -6);
    scene.add(rimLight);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    moleculeGroupRef.current = moleculeGroup;

    rebuildMolecule();

    const isDragging = { current: false };
    const previous = { x: 0, y: 0 };

    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";

    const handlePointerDown = (event: PointerEvent) => {
      isDragging.current = true;
      previous.x = event.clientX;
      previous.y = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current) return;
      const group = moleculeGroupRef.current;
      if (!group) return;

      const deltaX = event.clientX - previous.x;
      const deltaY = event.clientY - previous.y;
      previous.x = event.clientX;
      previous.y = event.clientY;

      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(deltaY * 0.4),
          THREE.MathUtils.degToRad(deltaX * 0.4),
          0,
          "XYZ"
        )
      );

      group.quaternion.multiplyQuaternions(quaternion, group.quaternion);
    };

    const handlePointerUp = (event: PointerEvent) => {
      isDragging.current = false;
      canvas.releasePointerCapture(event.pointerId);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const cameraInstance = cameraRef.current;
      if (!cameraInstance) return;
      cameraInstance.position.z = THREE.MathUtils.clamp(
        cameraInstance.position.z + event.deltaY * 0.01,
        5,
        28
      );
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    const handleResize = () => {
      const target = containerRef.current;
      const cam = cameraRef.current;
      const render = rendererRef.current;
      if (!target || !cam || !render) return;
      const newWidth = target.clientWidth;
      const newHeight = target.clientHeight;
      cam.aspect = newWidth / newHeight;
      cam.updateProjectionMatrix();
      render.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      const rendererInstance = rendererRef.current;
      const cameraInstance = cameraRef.current;
      const sceneInstance = sceneRef.current;
      const group = moleculeGroupRef.current;
      if (!rendererInstance || !cameraInstance || !sceneInstance || !group) {
        return;
      }

      if (isRotatingRef.current) {
        group.rotation.y += 0.0025;
      }

      if (isVibratingRef.current) {
        const time = performance.now() * 0.0025;
        group.position.y = Math.sin(time) * 0.12;
        group.position.x = Math.cos(time * 0.9) * 0.08;
      } else {
        group.position.x *= 0.9;
        group.position.y *= 0.9;
      }

      rendererInstance.render(sceneInstance, cameraInstance);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
      canvas.removeEventListener("wheel", handleWheel);
      container.removeChild(canvas);

      renderer.dispose();
      renderer.forceContextLoss();
      scene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: THREE.Material) => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [rebuildMolecule]);

  useEffect(() => {
    rebuildMolecule();
  }, [rebuildMolecule]);

  const handleResetView = () => {
    const camera = cameraRef.current;
    const group = moleculeGroupRef.current;
    if (camera && group) {
      camera.position.set(0, 0, 15);
      group.rotation.set(0, 0, 0);
      group.position.set(0, 0, 0);
    }
  };

  return (
    <div className="space-y-24">
      <section className="flex flex-col items-center text-center gap-6">
        <span className="px-6 py-2 text-xs tracking-[0.35em] uppercase bg-primary/15 text-primary-foreground rounded-full">
          Molecular Geometry Visualizer
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-shadow-lg text-shadow-primary max-w-4xl">
          4-Bromo-2,5-dimethoxyphenylethylamine — explore its geometry in Cosmic fidelity
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-foreground/80">
          Inspect bonds, electron clouds, and polarity vectors for the psychedelic phenethylamine better known as 2C-B.
          Cosmic UI frames and particles deliver the cinematic sci-fi experience while Three.js renders the molecular truth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button
            type="button"
            className="w-64 sm:w-auto"
            onClick={() => {
              document.getElementById("visualizer")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Launch Live Model
          </Button>
          <Button
            type="button"
            variant="accent"
            className="w-64 sm:w-auto"
            onClick={() => window.open("https://pubchem.ncbi.nlm.nih.gov/compound/98527", "_blank")}
          >
            PubChem Reference
          </Button>
        </div>
      </section>

      <section
        id="visualizer"
        className="grid gap-10 xl:grid-cols-[360px,1fr] items-start"
      >
        <div className="space-y-8">
          <CosmicPanel title="Visualization Controls">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ToggleButton
                active={showBonds}
                label="Bonds"
                onClick={() => setShowBonds((prev) => !prev)}
              />
              <ToggleButton
                active={showLabels}
                label="Atom Labels"
                onClick={() => setShowLabels((prev) => !prev)}
              />
              <ToggleButton
                active={showElectronClouds}
                label="Electron Clouds"
                onClick={() => setShowElectronClouds((prev) => !prev)}
              />
              <ToggleButton
                active={showPolarity}
                label="Polarity Vector"
                onClick={() => setShowPolarity((prev) => !prev)}
              />
            </div>
          </CosmicPanel>

          <CosmicPanel title="Animation">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ToggleButton
                active={isRotating}
                label="Auto Rotation"
                onClick={() => setIsRotating((prev) => !prev)}
              />
              <ToggleButton
                active={isVibrating}
                label="Vibration"
                onClick={() => setIsVibrating((prev) => !prev)}
              />
              <Button
                type="button"
                variant="secondary"
                className="sm:col-span-2 w-full"
                onClick={handleResetView}
              >
                Reset View
              </Button>
            </div>
          </CosmicPanel>

          <CosmicPanel title="Molecular Properties">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-left">
              {molecule.metadata.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs uppercase tracking-[0.35em] text-foreground/60">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-base text-shadow-lg text-shadow-primary/30">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CosmicPanel>
        </div>

        <div className="relative">
          <div
            className={twMerge(
              "relative backdrop-blur-xl",
              "[--color-frame-1-stroke:var(--color-primary)]/70",
              "[--color-frame-1-fill:var(--color-primary)]/12",
              "[--color-frame-2-stroke:var(--color-accent)]/35",
              "[--color-frame-2-fill:transparent]"
            )}
          >
            <Frame
              enableBackdropBlur
              className="drop-shadow-2xl drop-shadow-primary/40"
              paths={VIEWER_FRAME_PATHS}
            />
            <div className="relative p-8">
              <div
                ref={containerRef}
                className="relative h-[600px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-black/60 via-primary/5 to-transparent"
              >
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-lg text-primary">
                    <span className="animate-pulse tracking-[0.4em] uppercase text-xs text-foreground/60">
                      Initializing renderer
                    </span>
                    <span className="text-xl font-semibold text-shadow-lg text-shadow-primary">
                      Loading 2C-B Molecule…
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-6 left-6">
                <OverlayPanel title="Atom Legend">
                  <div className="grid grid-cols-2 gap-3">
                    {LEGEND_ITEMS.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 text-xs">
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </OverlayPanel>
              </div>

              <div className="absolute right-6 top-6 max-w-xs">
                <OverlayPanel title="Interaction Guide">
                  <ul className="space-y-2 text-xs leading-relaxed">
                    <li>Click and drag to rotate the molecule.</li>
                    <li>Scroll to zoom between macro and micro scales.</li>
                    <li>Toggle overlays from the control deck.</li>
                    <li>Double bonds glow amber for rapid identification.</li>
                    <li>Enable vibration to feel atomic resonance.</li>
                  </ul>
                </OverlayPanel>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="insights" className="grid gap-8 lg:grid-cols-3">
        <InsightCard
          title="Aromatic Core"
          highlight="Six-carbon ring"
          description="Witness conjugated pi systems with alternating single and double bonds, the hallmark of 2C-B's phenethylamine scaffold."
        />
        <InsightCard
          title="Polar Hotspots"
          highlight="Methoxy & amine"
          description="Activate polarity vectors to visualize electron-rich oxygen and nitrogen sites responsible for binding affinity."
        />
        <InsightCard
          title="Dynamic Perspective"
          highlight="Realtime rotation"
          description="Harness Cosmic UI motion with Three.js to interrogate steric hindrance, torsion, and accessible conformers."
        />
      </section>
    </div>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "accent" : "secondary"}
      className="w-full"
      onClick={onClick}
    >
      <span className="flex w-full items-center justify-between text-xs uppercase tracking-[0.35em]">
        <span>{label}</span>
        <span className="text-[0.625rem] font-semibold text-foreground/70">
          {active ? "ON" : "OFF"}
        </span>
      </span>
    </Button>
  );
}

function CosmicPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "relative backdrop-blur-xl",
        "[--color-frame-1-stroke:var(--color-primary)]/70",
        "[--color-frame-1-fill:var(--color-primary)]/12",
        "[--color-frame-2-stroke:var(--color-accent)]/30",
        "[--color-frame-2-fill:transparent]"
      )}
    >
      <Frame
        enableBackdropBlur
        className="drop-shadow-2xl drop-shadow-primary/40"
        paths={PANEL_FRAME_PATHS}
      />
      <div className="relative px-8 py-9 space-y-6">
        <div className="text-sm uppercase tracking-[0.35em] text-foreground/60">
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

function OverlayPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "relative backdrop-blur-xl",
        "[--color-frame-1-stroke:var(--color-primary)]/70",
        "[--color-frame-1-fill:var(--color-primary)]/12",
        "[--color-frame-2-stroke:var(--color-accent)]/30",
        "[--color-frame-2-fill:transparent]"
      )}
    >
      <Frame
        enableBackdropBlur
        className="drop-shadow-xl drop-shadow-primary/40"
        paths={OVERLAY_FRAME_PATHS}
      />
      <div className="relative px-6 py-6 space-y-4 text-left">
        <div className="text-[0.65rem] uppercase tracking-[0.35em] text-foreground/60">
          {title}
        </div>
        {children}
      </div>
    </div>
  );
}

function InsightCard({
  title,
  highlight,
  description,
}: {
  title: string;
  highlight: string;
  description: string;
}) {
  return (
    <div
      className={twMerge(
        "relative backdrop-blur-xl",
        "[--color-frame-1-stroke:var(--color-primary)]/60",
        "[--color-frame-1-fill:var(--color-primary)]/10",
        "[--color-frame-2-stroke:var(--color-accent)]/25",
        "[--color-frame-2-fill:transparent]"
      )}
    >
      <Frame
        enableBackdropBlur
        className="drop-shadow-xl drop-shadow-primary/30"
        paths={PANEL_FRAME_PATHS}
      />
      <div className="relative px-7 py-8 space-y-4">
        <div className="text-xs uppercase tracking-[0.4em] text-foreground/60">
          {title}
        </div>
        <div className="text-2xl font-semibold text-shadow-lg text-shadow-primary">
          {highlight}
        </div>
        <p className="text-sm leading-relaxed text-foreground/75">{description}</p>
      </div>
    </div>
  );
}

export default Home;
