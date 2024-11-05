import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background to black

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
  model.position.set(0, -1, 0);
  scene.add(model);
});

const colors = [0xff4500, 0xffa500, 0xffd700];
const lights = [];
const helpers = [];

// Define custom center points for each light's orbit
const centers = [
  new THREE.Vector3(2, 1, 3),
  new THREE.Vector3(1, 1, 2),
  new THREE.Vector3(2, 1, 3)
];

// Set up each light with color, unique radius, and initial speed
colors.forEach((color, index) => {
  const light = new THREE.PointLight(color, 1.5, 10);
  scene.add(light);

  lights.push({
    light,
    baseRadius: 0.1 + Math.random() * 0.5,       // Base radius for orbit
    radiusVariation: Math.random() * 0.3,        // Random variation in radius
    baseSpeed: 0.002 + Math.random() * 0.002,    // Base speed
    speedVariation: 0.00015 + Math.random() * 0.0001, // Speed change range
    center: centers[index],                      // Different orbit center
    // flickerOffset: Math.random() * Math.PI       // Offset for flicker effect
  });

  const helper = new THREE.PointLightHelper(light, 0.2); // Smaller helper size
  scene.add(helper);
  helpers.push(helper);
});

// Update each light to orbit around its defined center with gradual speed changes
function animateFire() {
  lights.forEach((obj, index) => {
    // Smoothly vary speed using a sine function and offset for uniqueness
    const time = performance.now() * 0.0001;
    const dynamicSpeed = obj.baseSpeed + Math.sin(time + index) * obj.speedVariation;

    // Orbit radius variation
    const dynamicRadius = obj.baseRadius + Math.sin(time * 0.5 + index) * obj.radiusVariation;

    // Calculate position with gradually changing speed and radius
    const positionTime = performance.now() * dynamicSpeed;
    obj.light.position.x = obj.center.x + dynamicRadius * Math.cos(positionTime);
    obj.light.position.y = obj.center.y + dynamicRadius * Math.cos(positionTime)/2;
    obj.light.position.z = obj.center.z + dynamicRadius * Math.sin(positionTime);

    // // Up and down flicker effect
    // obj.light.position.y = obj.center.y + Math.sin(positionTime + obj.flickerOffset) * 0.2;

    // Update the helper to follow each light's position
    helpers[index].update();
  });
}

// Main animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update orbit controls
  controls.update();

  // Animate lights with individual orbit centers and dynamic properties
  animateFire();

  renderer.render(scene, camera);
}

animate();
