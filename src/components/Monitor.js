import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { Colors, basic, emissive } from './materials/Palette.js';
import { onTick } from '../core/loop.js';

// ------------------------------------------------------------
// Monitor Assembly (re-built so it properly sits on the desk):
//   Coordinate baseline: desk top surface ≈ y = 0.04 (desk thickness/2)
//   We offset group so foot sits flush on desk visually.
// ------------------------------------------------------------

const DESK_SURFACE_Y = 0.04; // matches Desk.js top surface

const group = new THREE.Group();
group.position.set(0, DESK_SURFACE_Y, -0.15);
scene.add(group);

// Foot (base)
const footThickness = 0.04;
const foot = new THREE.Mesh(new THREE.BoxGeometry(0.55, footThickness, 0.22), basic(Colors.plasticDark));
foot.position.y = footThickness / 2; // sit on desk surface
foot.castShadow = true;
foot.receiveShadow = true;
group.add(foot);

// Vertical stand
const standHeight = 0.38;
const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, standHeight, 24), basic(Colors.plasticDark));
stand.position.y = footThickness + standHeight / 2;
stand.castShadow = true;
group.add(stand);

// Panel frame
const panelWidth = 1.4;
const panelHeight = 0.9;
const frameDepth = 0.04;
const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(panelWidth, panelHeight, frameDepth), basic(Colors.monitorFrame));
frameOuter.position.y = footThickness + standHeight + panelHeight / 2; // stack above stand
frameOuter.castShadow = true;
group.add(frameOuter);

// Screen surface (emissive) inset slightly forward
const screen = new THREE.Mesh(new THREE.PlaneGeometry(panelWidth * 0.92, panelHeight * 0.82), emissive(Colors.monitorGlow, 0.9));
screen.position.z = frameDepth / 2 + 0.0005;
screen.userData.interactive = true;
frameOuter.add(screen);

// Simple animated gradient overlay (placeholder for actual content)
const gradGeo = new THREE.PlaneGeometry(panelWidth * 0.92, panelHeight * 0.82, 24, 24);
const cols = [];
for (let i = 0; i < gradGeo.attributes.position.count; i++) {
  const y = gradGeo.attributes.position.getY(i);
  const v = (y / (panelHeight * 0.82)) + 0.5;
  const c = new THREE.Color().setHSL(0.55 + 0.08 * v, 0.65, 0.45 + 0.12 * v);
  cols.push(c.r, c.g, c.b);
}
gradGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
const gradMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.65 });
const gradientOverlay = new THREE.Mesh(gradGeo, gradMat);
gradientOverlay.position.z = 0.001;
screen.add(gradientOverlay);

onTick((dt, now) => {
  gradMat.opacity = 0.6 + Math.sin(now * 0.0005) * 0.05;
});

// Export group in case future components (like a webcam or stickers) need reference
export { group as monitorGroup };
