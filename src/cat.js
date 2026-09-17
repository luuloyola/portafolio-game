import * as THREE from 'three';
import { loadModel } from './loaders.js';

export class Cat {
  constructor() {
    this.mesh = null;
    this.mixer = null;
    this.idleAction = null;
    this.walkAction = null;
    this.currentAction = null;
    this.speed = 2.5; // unidades por segundo
  }

  async load(path = '/models/gato.glb') {
    const gltf = await loadModel(path, { scale: 1 });
    this.mesh = gltf.scene;

    this.mixer = new THREE.AnimationMixer(this.mesh);

    // Ajustá los índices según cómo vengan nombradas tus animaciones en el .glb
    console.log('Animaciones cargadas:', gltf.animations.map(a => a.name));
    const idleClip = THREE.AnimationClip.findByName(gltf.animations, 'Idle') || gltf.animations[0];
    const walkClip = THREE.AnimationClip.findByName(gltf.animations, 'Walk') || gltf.animations[1];

    this.idleAction = this.mixer.clipAction(idleClip);
    this.walkAction = this.mixer.clipAction(walkClip);

    this._playAction(this.idleAction);

    return this.mesh;
  }

  _playAction(action) {
    if (this.currentAction === action) return;
    if (this.currentAction) this.currentAction.fadeOut(0.2);
    action.reset().fadeIn(0.2).play();
    this.currentAction = action;
  }

  // Llamar cada frame desde el loop principal
  update(deltaTime, moveVector, camera) {
    // Actualiza el mixer para que las animaciones avancen segun el tiempo transcurrido
    this.mixer.update(deltaTime);

    const isMoving = moveVector.lengthSq() > 0.01;
    this._playAction(isMoving ? this.walkAction : this.idleAction);

    if (isMoving) {
      // Movimiento relativo a cámara (mismo patrón de controls.js)
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      camDir.y = 0;
      camDir.normalize();

      const camRight = new THREE.Vector3().crossVectors(camDir, camera.up).normalize();

      const moveDir = new THREE.Vector3()
        .addScaledVector(camDir, moveVector.y)
        .addScaledVector(camRight, moveVector.x)
        .normalize();

      this.mesh.position.addScaledVector(moveDir, this.speed * deltaTime);

      // El gato rota suavemente hacia donde camina (evita giros bruscos)
      const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(moveDir, new THREE.Vector3(), this.mesh.up)
      );
      this.mesh.quaternion.slerp(targetQuaternion, 0.15);
    }
  }
}