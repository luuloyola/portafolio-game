import * as THREE from 'three';
import Stats from 'stats.js';
import { Cat } from './cat.js';
import { Controls } from './controls.js';

// Stats
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // clave para performance en mobile
document.body.appendChild(renderer.domElement);

// Escena
const scene = new THREE.Scene();

// Modelos
const cat = new Cat();
const controls = new Controls();

await cat.load('/models/gato.glb');
scene.add(cat.mesh);

// Cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  150
);
const cameraPosIn = new THREE.Vector3(-19.8, 1.6, -7.9);
camera.position.copy(cameraPosIn);
camera.lookAt(-18.8, 1.6, -7.9);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



// Loop de animación
const timer = new Timer();

function animate(timestamp) {
  stats.begin();

  timer.update(timestamp);
  const deltaTime = timer.getDelta();

  const moveVector = controls.getMoveVector();
  cat.update(deltaTime, moveVector, camera);

  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);