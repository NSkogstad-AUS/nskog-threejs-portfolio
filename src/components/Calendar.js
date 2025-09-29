import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { Colors, basic } from './materials/Palette.js';
import { onTick } from '../core/loop.js';

const group = new THREE.Group();
scene.add(group);

group.position.set(-1.25,1.4,-0.6);
group.rotation.y = Math.PI/2;

const board = new THREE.Mesh(new THREE.PlaneGeometry(0.6,0.8), basic(Colors.calendar));
board.castShadow = true;
board.userData.interactive = true;
const mat = board.material;
mat.color.setHex(Colors.calendar);
group.add(board);

// Simple date squares (not dynamic now)
const dateGroup = new THREE.Group();
dateGroup.position.set(0, -0.1, 0.001);
board.add(dateGroup);

for(let r=0;r<4;r++){
  for(let c=0;c<7;c++){
    const sq = new THREE.Mesh(new THREE.PlaneGeometry(0.06,0.06), basic(0xffffff));
    sq.material.color.setHSL(0.6,0.05,0.9);
    sq.position.set((c-3)*0.07,(1.5-r)*0.07,0);
    dateGroup.add(sq);
  }
}

// Subtle pulsing highlight to suggest interactiveness
onTick((dt, now)=>{
  const pulse = 0.97 + Math.sin(now*0.001)*0.03;
  mat.color.setHSL(0,0, pulse*0.92);
});
