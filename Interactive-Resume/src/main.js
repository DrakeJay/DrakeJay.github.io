// Import the Three.js library
import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();

// Set up the camera (field of view, aspect ratio, near and far planes)
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);

// Position the camera slightly above the table to simulate first-person view
camera.position.set(0, 1.6, 2); // Adjust position as needed

// Create the renderer and add it to the document
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add basic lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Stronger directional light
directionalLight.position.set(5, 10, 7.5); // Adjust as needed
scene.add(directionalLight);

// Add a basic floor to represent the ground or table surface
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to lay flat
scene.add(floor);

// Animation loop to render the scene continuously
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resize to adjust the scene properly
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Create geometry (shape)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // Width, height, depth

// Create material (appearance)
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color

// Combine geometry and material to create a mesh
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// Set position if needed
box.position.set(0, 0.5, 0); // Move it up so it's on the table

// Add the box to the scene
scene.add(box);
