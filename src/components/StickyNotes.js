import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { Colors, basic } from './materials/Palette.js';

const colors = [Colors.noteYellow, Colors.noteGreen, Colors.noteBlue, Colors.notePink];

function createNote(w = 0.11, h = 0.11) {
  const geo = new THREE.PlaneGeometry(w, h, 1, 1);
  const color = colors[Math.floor(Math.random() * colors.length)];
  const mat = basic(color);
  mat.side = THREE.DoubleSide;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.z = (Math.random() - 0.5) * 0.25;
  mesh.position.z = 0.002; // slightly above bezel
  mesh.castShadow = false;
  mesh.userData.interactive = true;
  return mesh;
}

// Target the outer CRT shell so notes appear clearly in front.
const crtOuter = scene.getObjectByName('CRTOuter');
if (crtOuter) {
  const box = new THREE.Box3().setFromObject(crtOuter);
  const size = new THREE.Vector3(); box.getSize(size);
  const min = box.min; const max = box.max;

  // Group anchored to front-left-top corner of CRT.
  const anchor = new THREE.Group();
  anchor.name = 'StickyNotesCRT';
  scene.add(anchor);

  // Compute front face Z (max z) and left (min x), top (max y)
  const frontZ = max.z + 0.01; // hover slightly off surface
  const leftX = min.x - 0.005;
  const topY = max.y - 0.05;

  // Place anchor at left/top/front corner
  anchor.position.set(leftX, topY, frontZ);

  // Create a vertical column and a staggered cluster
  for (let i = 0; i < 3; i++) {
    const n = createNote();
    n.position.set(0, -i * 0.16, 0);
    anchor.add(n);
  }
  for (let i = 0; i < 3; i++) {
    const n = createNote();
    n.position.set(0.18 + i * 0.16, - (Math.random()*0.06), (Math.random()-0.5)*0.01);
    anchor.add(n);
  }
}

// Additional wall cluster slightly higher & left (ensures visibility) - optional
if (crtOuter) {
  const box = new THREE.Box3().setFromObject(crtOuter);
  const min = box.min; const max = box.max;
  const wallGroup = new THREE.Group();
  wallGroup.name = 'StickyNotesWall';
  wallGroup.position.set(min.x - 0.9, max.y + 0.1, max.z - 0.45);
  scene.add(wallGroup);
  for (let i=0;i<3;i++){
    const n = createNote(0.1,0.1);
    n.position.set((Math.random()-0.5)*0.4,(Math.random()-0.5)*0.4,0);
    wallGroup.add(n);
  }
}
