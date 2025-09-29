import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { Colors, basic } from './materials/Palette.js';

const group = new THREE.Group();
scene.add(group);

group.position.set(0.1, 0.045, 0.45); // slightly right & forward

const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.36), basic(Colors.plasticDark));
base.castShadow = true;
base.receiveShadow = true;
base.userData.interactive = true;
group.add(base);

// Create grid of keycaps (simplified)
const rows = 5;
const cols = 14;
const keyW = 0.07, keyH = 0.028, keyD = 0.07;
for(let r=0;r<rows;r++){
  for(let c=0;c<cols;c++){
    if(Math.random()<0.05) continue; // sparse gaps for visual variety
    const key = new THREE.Mesh(new THREE.BoxGeometry(keyW, keyH, keyD), basic(Colors.plasticLight));
    key.position.set(-0.55 + c*0.085, 0.035, -0.15 + r*0.08);
    key.castShadow = true;
    key.userData.interactive = c===0 && r===0 && Math.random()<0.2; // a few interactive ones maybe later
    base.add(key);
  }
}
