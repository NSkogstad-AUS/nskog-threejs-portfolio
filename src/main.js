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
import { onTick } from './core/loop.js';
import { gsap } from 'gsap';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const SCREEN_NAME = 'CRTScreen';
let hoverScreen = false;
let zoomed = false;
let animating = false;
const baseCamPos = camera.position.clone();
const baseLookAt = new THREE.Vector3(0.05, 0.72, -0.2);
let currentLookAt = baseLookAt.clone();

window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
  if (!hoverScreen || animating) return;
  const screen = scene.getObjectByName(SCREEN_NAME);
  if (!screen) return;
  if (!zoomed) {
    zoomIntoScreen(screen);
  } else {
    resetCamera();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && zoomed && !animating) {
    resetCamera();
  }
});

function zoomIntoScreen(screen){
  // Compute a centered, straight-on camera position in front of the screen
  const box = new THREE.Box3().setFromObject(screen);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Screen normal (PlaneGeometry default faces +Z in local space)
  const worldQuat = screen.getWorldQuaternion(new THREE.Quaternion());
  const normal = new THREE.Vector3(0,0,1).applyQuaternion(worldQuat).normalize();

  // Distance so screen fits vertically within FOV with small margin
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  const desiredDist = (size.y * 0.5) / Math.tan(fovRad * 0.5) * 1.08; // 8% padding

  const targetPos = center.clone().add(normal.multiplyScalar(desiredDist));
  targetPos.y = center.y; // Keep centered vertically on screen
  const targetLook = center.clone();
  animateCamera(targetPos, targetLook, () => { zoomed = true; });
}

function resetCamera(){
  animateCamera(baseCamPos, baseLookAt, () => { zoomed = false; });
}

function animateCamera(targetPos, targetLook, onComplete){
  animating = true;
  gsap.to(camera.position, {
    x: targetPos.x, y: targetPos.y, z: targetPos.z,
    duration: 1.1, ease: 'power2.inOut',
    onUpdate: () => { camera.lookAt(currentLookAt); }
  });
  gsap.to(currentLookAt, {
    x: targetLook.x, y: targetLook.y, z: targetLook.z,
    duration: 1.1, ease: 'power2.inOut',
    onUpdate: () => { camera.lookAt(currentLookAt); },
    onComplete: () => { animating = false; onComplete && onComplete(); }
  });
}

function updateOutline(){
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  const screenHit = hits.find(h => h.object.name === SCREEN_NAME);
  const newHover = !!screenHit && !animating; // don't change hover while animating
  if (newHover !== hoverScreen){
    hoverScreen = newHover;
    if (hoverScreen){
      outlinePass.selectedObjects = [screenHit.object];
      outlinePass.edgeStrength = 1.4;
      outlinePass.edgeGlow = 0.15;
    } else {
      outlinePass.selectedObjects = [];
    }
  }
}
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

