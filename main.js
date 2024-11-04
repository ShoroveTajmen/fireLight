import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background to white

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let loader = new GLTFLoader();
let model;
loader.load("10_14_base_AbrarHair_JonHead_5a.glb", async function (gltf) {
  model = gltf.scene.children[0];
  model.scale.set(0.06, 0.06, 0.06);
  model.position.set(0,-1, 0);
  scene.add(model);
});

// Apple (Sphere)
const appleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const appleMaterial = new THREE.MeshStandardMaterial({ color: 0xffe31a });
const apple = new THREE.Mesh(appleGeometry, appleMaterial);
apple.castShadow = true; // Enable shadow casting for the apple
// scene.add(apple);

// Table (Plane)
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
plane.position.y = -0.5;
plane.receiveShadow = true; // Enable shadow reception for the plane
// scene.add(plane);

// Point Light (Firelight)
const pointLight = new THREE.PointLight(0xe22822, 20, 10); // Initial color and intensity
pointLight.position.set(1, 1, 2); // Position it in front and slightly to the right
pointLight.castShadow = true; // Enable shadow casting for the light
scene.add(pointLight);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xFFF5E1, 0.5); // Soft ambient light
scene.add(ambientLight);

// Add a PointLightHelper to visualize the light position
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2); // Smaller helper size
scene.add(pointLightHelper);

// Fire Flicker Effect
let time = 0;
let flickerSpeed = 0.1;
let flickerDirection = 1;

function animateFire(deltaTime) {
  // Adjust flickering speed in a loop pattern
  if (flickerDirection === 1 && flickerSpeed < 0.06) {
    flickerSpeed += 0.0004; // Gradually increase speed
  } else if (flickerDirection === 1 && flickerSpeed >= 0.06) {
    flickerDirection = -1; // Start slowing down
  } else if (flickerDirection === -1 && flickerSpeed > 0.01) {
    flickerSpeed -= 0.0005; // Gradually decrease speed
  } else if (flickerDirection === -1 && flickerSpeed <= 0.01) {
    flickerDirection = 1; // Reset to start increasing speed
  }

  time += deltaTime * flickerSpeed;

  // Set a base intensity and vary it slightly for flicker effect
  pointLight.intensity = 5 + Math.random() * 0.5;

  // Fire color transitions with a blend factor and random variation
  const fireColors = [
    new THREE.Color(0xffd700), // Golden yellow
    new THREE.Color(0xffa500), // Orange
    new THREE.Color(0xff4500), // Red-orange
    new THREE.Color(0x8b4513), // Brownish red
  ];
  const blendFactor = (Math.sin(time * 0.8) + 1) / 2; // Sine-based smooth blend
  const colorIndex = Math.floor(blendFactor * (fireColors.length - 1));
  const nextColorIndex = (colorIndex + 1) % fireColors.length;
  const currentColor = fireColors[colorIndex];
  const nextColor = fireColors[nextColorIndex];
  const colorBlendFactor = blendFactor * (fireColors.length - 1) - colorIndex;

  // Blend between colors
  pointLight.color.copy(currentColor.clone().lerp(nextColor, colorBlendFactor));

  // Slight random position change to simulate flicker movement
  pointLight.position.x = 1 + (Math.random() - 0.5) * 0.2;
  pointLight.position.y = 0.5 + (Math.random() - 0.5) * 0.1;
  pointLight.position.z = 2 + (Math.random() - 0.5) * 0.1;
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  const deltaTime = renderer.info.render.frame * 0.016; // Estimate time per frame

  // Update orbit controls
  controls.update();
  animateFire(deltaTime); // Apply fire effect with dynamic position and speed

  renderer.render(scene, camera);
}

animate();
