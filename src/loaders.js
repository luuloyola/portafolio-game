import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadModel(path, { scale = 1, position = null, castShadow = true } = {}) {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = castShadow;
          }
        });
        gltf.scene.scale.setScalar(scale);
        if (position) gltf.scene.position.copy(position);
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
}