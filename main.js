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
// Fire Flicker Effect with Natural Flickering and Subtle Color Variation
// let time = 0;
// let flickerSpeed = 0.05; // Set initial flicker speed
// // let intensityBase = 1.8; // Base intensity
// let flickerBaseSpeed = 0.05;
// let flickerIntensityBase = 1.8;
// let flickerIntensityVariance = 0.5;
// let flickerSpeedBase = 0.02;
let time = 0;
let flickerSpeed = 0.01; // Initial slow speed
let flickerDirection = 1; // Controls speed increase and decrease
function animateFire(deltaTime) {
    // // Update time with a randomized flicker speed, varying slightly for each frame
    // flickerSpeed = 0.04 + Math.random() * 0.02; // Random speed within a small range
    // time += deltaTime * flickerSpeed;

    // // Small, random pulsing to simulate intensity flicker
    // pointLight.intensity = intensityBase + Math.random() * 0.3; // Subtle random range
    // if (Math.random() > 0.9) {
    //     flickerBaseSpeed = 0.04 + Math.random() * 0.06; // Speed between 0.04 and 0.1
    // }
    // time += deltaTime * flickerBaseSpeed;

    // // Apply a Perlin or sine noise effect to vary intensity smoothly
    // const flickerNoise = Math.sin(time * 3 + Math.random() * 2); // Irregular pattern
    // pointLight.intensity = flickerIntensityBase + flickerNoise * flickerIntensityVariance
    // const baseSpeed = 0.5 + 0.5 * Math.sin(time * 0.1); // Smooth sine variation for base speed
    // const randomFactor = 0.5 + Math.random() * 0.5;     // Random speed multiplier

    // flickerSpeedBase = baseSpeed * randomFactor * 0.03; // Adjust final speed dynamically
    // time += deltaTime * flickerSpeedBase;
       // Adjust flickering speed in a loop pattern
       if (flickerDirection === 1 && flickerSpeed < 0.06) {
        flickerSpeed += 0.0005; // Gradually increase speed
    } else if (flickerDirection === 1 && flickerSpeed >= 0.06) {
        flickerDirection = -1; // Start slowing down
    } else if (flickerDirection === -1 && flickerSpeed > 0.01) {
        flickerSpeed -= 0.0005; // Gradually decrease speed
    } else if (flickerDirection === -1 && flickerSpeed <= 0.01) {
        flickerDirection = 1; // Reset to start increasing speed
    }

    time += deltaTime * flickerSpeed;
    pointLight.intensity = 1.8 + Math.random() * 0.5; // Range: 1.8 to 2.3
    // Fire color transitions: Blend colors gradually with Perlin/sine wave patterns
    const fireColors = [
        new THREE.Color(0xffffff), // White, hottest part
        new THREE.Color(0xffd700), // Golden yellow
        new THREE.Color(0xffa500), // Orange
        new THREE.Color(0xff4500), // Red-orange
        new THREE.Color(0x8b4513), // Brownish red
        new THREE.Color(0x555555)  // Grey, smoke-like
    ];


    const blendFactor = (Math.sin(time * 0.8) + 1) / 2; // Smoother sine-based blending
    const colorIndex = Math.floor(blendFactor * (fireColors.length - 1));
    const nextColorIndex = (colorIndex + 1) % fireColors.length;

    // Blend between two colors based on blendFactor
    const currentColor = fireColors[colorIndex];
    const nextColor = fireColors[nextColorIndex];
    const colorBlendFactor = blendFactor * (fireColors.length - 1) - colorIndex;
    pointLight.color.copy(currentColor.clone().lerp(nextColor, colorBlendFactor));

    // Add slight random hue variation for subtle realism
    const hueVariation = (Math.random() - 0.5) * 0.005; // Smaller hue shift for finer realism
    pointLight.color.offsetHSL(hueVariation, 0, 0);
    // // pointLight.intensity = 1.5 + Math.random() * 0.8;
    // // Define warm fire colors for subtle color flicker
    // const colorA = new THREE.Color(0xffd700); // Golden yellow (near hottest part of flame)
    // const colorB = new THREE.Color(0xff4500); // Red-orange

    // // Slightly vary color between colorA and colorB to mimic flame flicker
    // const colorBlendFactor = Math.random() * 0.5; // Random blend factor for subtle flicker
    // pointLight.color.copy(colorA.clone().lerp(colorB, colorBlendFactor));

    // // Optional: Apply minimal hue variation for randomness
    // const hueVariation = (Math.random() - 0.5) * 0.01; // Tiny hue shift for realism
    // pointLight.color.offsetHSL(hueVariation, 0, 0);
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
