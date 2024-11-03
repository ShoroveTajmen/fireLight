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
const pointLight = new THREE.PointLight(0xe22822, 20, 10); // Orange light, intensity, and distance
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
let time = 0; // Create a time variable to control the flicker effect
function animateFire() {
    time += 0.1; // Increment time

    // Increase the range of intensity variation
    pointLight.intensity = 1.2 + Math.random() * 1.0; // Range: 1.2 to 2.2

    // Mix between two colors for a flickering effect
    const color1 = new THREE.Color(0xb72f17); // Color for fire
    const color2 = new THREE.Color(0xffcc00); // A contrasting color for variation
    const life = (Math.sin(time) + 1) / 2; // Normalize sine wave to [0, 1]
    pointLight.color.copy(color1.clone().lerp(color2, life)); // Mix colors based on life
    
    // Optional: Add some slight hue variation
    const hueVariation = Math.random() * 0.05;
    pointLight.color.offsetHSL(hueVariation, 0, 0); // Apply hue variation
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
