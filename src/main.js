import * as THREE from 'three';
import Stats from 'stats.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { Cat } from './cat.js';
import { Controls } from './controls.js';

//  Stats 
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//  Renderer 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

//  Escena 
const scene = new THREE.Scene();

//  Cámara 
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  150
);
camera.position.set(-19.8, 4, -12); // detrás y arriba del gato, tercera persona
const cameraOffset = new THREE.Vector3(0, 3, 5); // distancia relativa al gato

//  Luces 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;
scene.add(sunLight);

//  Resize 
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//  Instancias del gato y los controles 
const cat = new Cat();
const controls = new Controls();

await cat.load('/models/gato.glb');
cat.mesh.position.set(-19.8, 0, -7.9);
scene.add(cat.mesh);

//  Timer y loop 
const timer = new Timer();

function updateCamera() {
  // La cámara sigue al gato desde atrás, tipo "cámara de tercera persona"
  const desiredPos = cat.mesh.position.clone().add(cameraOffset);
  camera.position.lerp(desiredPos, 0.1); // suaviza el seguimiento
  camera.lookAt(cat.mesh.position);
}

function animate(timestamp) {
  stats.begin();

  timer.update(timestamp);
  const deltaTime = timer.getDelta();

  const moveVector = controls.getMoveVector();
  cat.update(deltaTime, moveVector, camera);
  updateCamera();

  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);