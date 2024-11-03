import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
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
const appleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const apple = new THREE.Mesh(appleGeometry, appleMaterial);
apple.castShadow = true; // Enable shadow casting for the apple
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
const pointLight = new THREE.PointLight(0xffa500, 2, 10); // Orange light, intensity, and distance
pointLight.position.set(2, 1, -1); // Position it to the side for an interesting shadow effect
pointLight.castShadow = true; // Enable shadow casting for the light
scene.add(pointLight);

// Fire Object (Sphere)
// const fireGeometry = new THREE.SphereGeometry(0.2, 16, 16);
// const fireMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500, emissive: 0xff4500 }); // Bright orange color
// const fire = new THREE.Mesh(fireGeometry, fireMaterial);
// fire.position.set(2, 1, -1); // Same position as the light
// scene.add(fire);

// Fire Flicker Effect
function animateFire() {
    pointLight.intensity = 1.5 + Math.random() * 0.5;
    pointLight.color.setHSL(0.1, 1, 0.5 + Math.random() * 0.2);

    // Make the fire sphere flicker slightly
    // fire.scale.setScalar(0.9 + Math.random() * 0.2); // Slightly changes size to create a flickering effect
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
