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
  new THREE.Vector3(2, 1, 3), // Center point for the first light
  new THREE.Vector3(1, 1, 2), // Center point for the second light
  new THREE.Vector3(2, 1, 3)  // Center point for the third light
];

// Set up each light with color, unique radius, speed, and center position
colors.forEach((color, index) => {
  const light = new THREE.PointLight(color, 1.5, 10);
  scene.add(light);

  lights.push({
    light,
    radius: 0.5 + Math.random() * 0.5, // Random radius between 0.5 and 1.0
    speed: 0.002 + Math.random() * 0.002, // Random speed between 0.002 and 0.004
    center: centers[index], // Different orbit center for each light
    flickerOffset: Math.random() * Math.PI // Random offset for flicker effect
  });

  const helper = new THREE.PointLightHelper(light, 0.2); // Smaller helper size
  scene.add(helper);
  helpers.push(helper);
});

// Update each light to orbit around its defined center and add up/down motion
function animateFire() {
  lights.forEach((obj, index) => {
    const time = performance.now() * obj.speed;
    
    // Orbit around the defined center
    obj.light.position.x = obj.center.x + obj.radius * Math.cos(time);
    
    // Add up/down flicker effect using a sine wave
    obj.light.position.y = obj.center.y + Math.sin(time + obj.flickerOffset) * 0.2; // Flicker range of ±0.2
    
    obj.light.position.z = obj.center.z + obj.radius * Math.sin(time);

    // Update the helper to follow each light's position
    helpers[index].update();
  });
}

// Main animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update orbit controls
  controls.update();

  // Animate lights with individual orbit centers and effects
  animateFire();

  renderer.render(scene, camera);
}

animate();
