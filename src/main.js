// Entry point: assembles a stylized desk scene (monitor + keyboard + notes) similar
// to the provided reference image. All geometry is placeholder / blocky so you can
// iterate quickly before investing time in detailed modeling or GLTF imports.
//
// Folder structure (added):
// core/ -> renderer, scene, camera, loop
// components/ -> desk, monitor, keyboard, sticky notes, shelf, plant, calendar, lighting
// materials/ -> shared color palette & basic materials

import { scene } from './core/scene.js';
import { camera } from './core/camera.js';
import { renderer } from './core/renderer.js';
import { startLoop } from './core/loop.js';

// Components – each registers itself with the scene when constructed.
import './components/Lighting.js';
import './components/Desk.js';
// Replacing flat monitor with a retro box computer (CRT + tower)
import './components/BoxComputer.js';
import './components/Keyboard.js';
import './components/StickyNotes.js';
import './components/Shelf.js';
import './components/Calendar.js';

// Kick off render loop
startLoop();

// Basic raycaster hover placeholder (future: interactions on sticky notes / icons)
import * as THREE from 'three';
import { outlinePass } from './core/renderer.js';
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let outlined = [];

window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function updateOutline() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true)
    .filter(h => h.object.userData.interactive);
  const newObjects = hits.slice(0, 3).map(h => h.object); // limit count
  // Only update if changed to avoid allocation each frame
  if (newObjects.length !== outlined.length || newObjects.some(o => !outlined.includes(o))) {
    outlined = newObjects;
    outlinePass.selectedObjects = outlined;
  }
}

import { onTick } from './core/loop.js';
onTick(updateOutline);

// Resize handling is inside renderer module; we re-expose if needed.

// Dev helper: press 'g' to toggle simple grid helper on desk plane
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'g') {
    const existing = scene.getObjectByName('DeskGridHelper');
    if (existing) scene.remove(existing); else {
      const grid = new THREE.GridHelper(2.4, 24, 0x444444, 0x222222);
      grid.position.y = 0.001; // avoid z-fighting with desk surface
      grid.name = 'DeskGridHelper';
      scene.add(grid);
    }
  }
});

// Future: load higher fidelity models (GLTF) & replace placeholder geometry.

