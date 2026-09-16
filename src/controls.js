import * as THREE from 'three';

export class Controls {
  constructor() {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.moveVector = new THREE.Vector2(0, 0); // x: izq/der, y: adelante/atrás
    
    if (this.isTouch) {
      this._setupJoystick();
    } else {
      this._setupKeyboard();
    }
  }

  _setupKeyboard() {
    this.keys = {};
    window.addEventListener('keydown', (e) => this.keys[e.code] = true);
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);
  }

  _setupJoystick() {
    const zone = document.getElementById('joystick-zone');
    this.joystick = nipplejs.create({
      zone,
      mode: 'static',
      position: { left: '80px', bottom: '80px' },
      color: 'white',
      size: 100,
    });

    this.joystick.on('move', (evt, data) => {
      const angle = data.angle.radian;
      const force = Math.min(data.force, 1);
      this.moveVector.set(Math.cos(angle) * force, Math.sin(angle) * force);
    });

    this.joystick.on('end', () => {
      this.moveVector.set(0, 0);
    });
  }

  // Llamar cada frame, devuelve el vector de movimiento normalizado
  getMoveVector() {
    if (this.isTouch) {
      return this.moveVector;
    }
    const v = new THREE.Vector2(0, 0);
    if (this.keys['KeyW'] || this.keys['ArrowUp']) v.y += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) v.y -= 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) v.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) v.x += 1;
    return v.normalize();
  }
}