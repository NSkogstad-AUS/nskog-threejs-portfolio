import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { Colors, basic, emissive } from './materials/Palette.js';
import { onTick } from '../core/loop.js';

// Retro box computer (CRT + base + tower + mouse) approximated with primitive geometry
// Positioned relative to desk surface (Desk.js sets desk surface ~ y = 0.04)
const DESK_Y = 0.04;
const group = new THREE.Group();
group.name = 'BoxComputer';
scene.add(group);

group.position.set(-0.25, DESK_Y, -0.05); // slight left shift to allow tower on right

// Base under CRT (floppy drive style stack)
const baseStack = new THREE.Group();
const baseHeight = 0.12;
const base1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.55), basic(Colors.plasticDark));
base1.position.y = 0.025; base1.castShadow = true; baseStack.add(base1);
const base2 = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.04, 0.53), basic(Colors.plasticLight));
base2.position.y = 0.05 + 0.02; base2.castShadow = true; baseStack.add(base2);
baseStack.position.y = baseHeight/2;
group.add(baseStack);

// CRT outer shell
const crtOuter = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 0.85), basic(Colors.monitorFrame));
crtOuter.name = 'CRTOuter';
crtOuter.position.y = baseHeight + 0.85/2;
crtOuter.castShadow = true;
crtOuter.receiveShadow = true;
group.add(crtOuter);

// Bevel effect via scaled inner box (cutout look)
const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.77, 0.2), basic(0xdddddd));
bezel.name = 'CRTBezel';
bezel.position.set(0, 0.02, 0.28); // front inset area
crtOuter.add(bezel);

// Flat screen plane placed in front of CRT box
const screenWidth = 0.95;
const screenHeight = 0.62;
const screen = new THREE.Mesh(new THREE.PlaneGeometry(screenWidth, screenHeight), emissive(Colors.monitorGlow, 1.0));
screen.name = 'CRTScreen';
screen.position.set(0, baseHeight + 0.43, 0.47); // slight forward from previous curved screen
screen.userData.interactive = true;
group.add(screen);

// Animated subtle scanline / brightness pulse
onTick((dt, now)=>{ screen.material.emissiveIntensity = 0.75 + Math.sin(now*0.002)*0.05; });

// Tower (case) to right
const tower = new THREE.Group();
const towerBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.2, 0.55), basic(0xe6e6e6));
towerBody.name = 'TowerBody';
towerBody.castShadow = true; towerBody.receiveShadow = true;

// Simple drive bays & panel lines
const panelMat = basic(0xd0d0d0);
function driveBay(y){
  const bay = new THREE.Mesh(new THREE.BoxGeometry(0.5,0.08,0.01), panelMat.clone());
  bay.position.set(0, y, 0.28+0.001);
  towerBody.add(bay);
}
for(let i=0;i<3;i++) driveBay(0.35 + i*0.11);

// Power button (emissive accent)
const pwr = new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.01,20), emissive(Colors.accentPurple, 1.5));
pwr.rotation.x = Math.PI/2;
pwr.position.set(0.18, -0.25, 0.28+0.006);
towerBody.add(pwr);

tower.add(towerBody);
tower.position.set(0.9, 0.6, -0.05);
group.add(tower);

// Mouse (simple pill)
const mouse = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.08, 8, 16), basic(Colors.plasticLight));
mouse.position.set(0.9, 0.07, 0.35);
mouse.castShadow = true;
group.add(mouse);

// Keyboard reposition (reuse existing keyboard if desired). For now we assume the existing Keyboard component places itself globally.
// Optional: could later refactor to nest inside this group.

export { group as boxComputerGroup };
