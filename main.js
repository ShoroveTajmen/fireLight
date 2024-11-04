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
let time = 0;
let flickerSpeed = 0.02; // Start with a very slow speed
let speedStage = 1; // Tracks the current stage of speed

function animateFire(deltaTime) {
    // Increase flickering speed in stages
    if (time > 5 && speedStage === 1) {
        flickerSpeed = 0.05; // Medium speed after 5 seconds
        speedStage = 2;
    } else if (time > 10 && speedStage === 2) {
        flickerSpeed = 0.07; // Faster speed after 10 seconds
        speedStage = 3;
    } 
    else if (time > 15 && speedStage === 3) {
        flickerSpeed = 0.2; // Fastest speed after 15 seconds
        speedStage = 4;
    }

    time += deltaTime * flickerSpeed; // Increment time with dynamic speed

    // // Adjust intensity to simulate flicker
    // pointLight.intensity = 1.2 + Math.random() * 1.0; // Range: 1.2 to 2.2

    // // Mix between two colors for a flickering effect
    // const color1 = new THREE.Color(0xb72f17); // Color for fire
    // const color2 = new THREE.Color(0xffcc00); // A contrasting color for variation
    // const life = (Math.sin(time) + 1) / 2; // Normalize sine wave to [0, 1]
    // pointLight.color.copy(color1.clone().lerp(color2, life)); // Mix colors based on life
    
    // // Optional: Add some slight hue variation
    // const hueVariation = Math.random() * 0.05;
    // pointLight.color.offsetHSL(hueVariation, 0, 0); // Apply hue variation
    pointLight.intensity = 1.8 + Math.random() * 0.5; // Range: 1.8 to 2.3

    // Define a range of fire colors from hottest (white) to cooler (red and grey)
    const fireColors = [
        new THREE.Color(0xffffff), // White, hottest part of the flame
        new THREE.Color(0xffd700), // Golden yellow
        new THREE.Color(0xffa500), // Orange
        new THREE.Color(0xff4500), // Red-orange
        new THREE.Color(0x8b4513), // Brownish red (coolest, outer flame color)
        new THREE.Color(0x555555)  // Grey (smoke color, cool part of the fire)
    ];

    // Use a smooth wave pattern to transition colors naturally
    const transitionSpeed = 0.3; // Control how quickly colors transition
    const wave = (Math.sin(time * transitionSpeed) + 1) / 2; // Normalized wave for smooth transition

    // Blend colors across the fireColors array based on the wave value
    const colorIndex = Math.floor(wave * (fireColors.length - 1));
    const nextColorIndex = (colorIndex + 1) % fireColors.length; // Loop to the next color

    // Interpolate between the current color and the next for a smooth transition
    const currentColor = fireColors[colorIndex];
    const nextColor = fireColors[nextColorIndex];
    const colorBlendFactor = wave * (fireColors.length - 1) - colorIndex;

    // Blend between the two selected colors
    pointLight.color.copy(currentColor.clone().lerp(nextColor, colorBlendFactor));

    // Subtle hue variation to add randomness
    const hueVariation = (Math.random() - 0.5) * 0.03; // Small random hue offset
    pointLight.color.offsetHSL(hueVariation, 0, 0);
}

// Animate
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = renderer.info.render.frame * 0.016; // Estimate time per frame (assuming ~60fps)

    // Update orbit controls
    controls.update();
    animateFire(deltaTime); // Apply the fire effect with varying speed
    
    renderer.render(scene, camera);
}

animate();
