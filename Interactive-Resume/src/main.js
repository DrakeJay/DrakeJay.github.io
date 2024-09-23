// Import the Three.js and Cannon.js libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';

import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';


// Create the Three.js scene
const scene = new THREE.Scene();

// Set up the camera (field of view, aspect ratio, near and far planes)
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(0, 1.6, 2); // Position the camera slightly above the table

// Create the renderer and add it to the document
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add basic lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Stronger directional light
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Add a basic floor to represent the ground or table surface
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to lay flat
scene.add(floor);

// Create the Cannon.js physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Set gravity downwards on the Y-axis

// Create the ground physics body
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({
  mass: 0, // Static object (no movement)
});
groundBody.addShape(groundShape);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to match the Three.js floor orientation
world.addBody(groundBody);

// Create a physics-enabled box
// Three.js mesh (visual object)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.position.set(0, 0.5, 0);
scene.add(boxMesh);

// Cannon.js physics body
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const boxBody = new CANNON.Body({
  mass: 1, // Dynamic object (affected by forces)
  position: new CANNON.Vec3(0, 0.5, 0),
  shape: boxShape,
});
world.addBody(boxBody);

// Create the resume (textured plane)
const textureLoader = new THREE.TextureLoader();
const resumeTexture = textureLoader.load(
  './images/Drake Resume.png', // Path to your resume image
  () => console.log('Resume texture loaded successfully'),
  undefined,
  (error) => console.error('Error loading resume texture:', error)
);

const resumeGeometry = new THREE.PlaneGeometry(2, 2.5);
const resumeMaterial = new THREE.MeshStandardMaterial({
  map: resumeTexture,
  side: THREE.DoubleSide,
});
const resumeMesh = new THREE.Mesh(resumeGeometry, resumeMaterial);
resumeMesh.position.set(0, 0.02, 0);
resumeMesh.rotation.x = -Math.PI / 2;
scene.add(resumeMesh);

// Create decorative objects (mug)
const mugGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
const mugMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
const mug = new THREE.Mesh(mugGeometry, mugMaterial);
mug.position.set(1, 0.25, 0);
scene.add(mug);

// Update function to sync the Three.js mesh with the Cannon.js physics body
function updatePhysics() {
  // Step the physics world forward in time
  world.step(1 / 60); // Step the world forward at 60 FPS

  // Copy position and rotation from the Cannon.js body to the Three.js mesh
  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
}

// Animation loop to render the scene continuously
function animate() {
  requestAnimationFrame(animate);

  // Update physics
  updatePhysics();

  // Render the scene
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
