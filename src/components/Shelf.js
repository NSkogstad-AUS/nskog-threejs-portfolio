import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { Colors, basic } from './materials/Palette.js';

const group = new THREE.Group();
scene.add(group);

group.position.set(0.2, 3.2, -1.2);

const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 0.4), basic(Colors.shelf));
shelf.castShadow = true;
GroupAdd(shelf);

// Books (varying heights)
for(let i=0;i<10;i++){
  const h = 0.5 + Math.random()*0.5;
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 0.24), basic(0xffffff*Math.random()));
  book.position.set(-1.4 + i*0.28, h/2, 0);
  book.rotation.y = (Math.random()-0.5)*0.2;
  book.castShadow = true;
  group.add(book);
}

function GroupAdd(mesh){ group.add(mesh); }
