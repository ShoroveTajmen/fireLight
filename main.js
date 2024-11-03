import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set background to white

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Apple (Sphere)
const appleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const appleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE31A });
const apple = new THREE.Mesh(appleGeometry, appleMaterial);
scene.add(apple);

// Table (Plane)
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2; // Rotate to make it horizontal
plane.position.y = -0.5;
plane.receiveShadow = true; // Enable shadow reception for the plane
scene.add(plane);

// Point Light (Firelight)
// Position the light to the right of the apple
const pointLight = new THREE.PointLight(0xe23822, 20, 10); // Orange light, intensity, and distance
pointLight.position.set(1, 0.5, 0); // Position it to the right of the apple (1, 0.5, 0)
pointLight.castShadow = true; // Enable shadow casting for the light
scene.add(pointLight);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft white light
scene.add(ambientLight);

// Add a PointLightHelper to visualize the light position
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5); // 0.5 is the size of the helper
scene.add(pointLightHelper);

// Fire Flicker Effect
function animateFire() {
    pointLight.intensity = 1.5 + Math.random() * 0.5;
    pointLight.color.setHSL(0.1, 1, 0.5 + Math.random() * 0.2);
}

// Animate
function animate() {
    requestAnimationFrame(animate);
    // Update orbit controls
    controls.update();
    animateFire(); // Apply the fire effect
    
    renderer.render(scene, camera);
}

animate();
