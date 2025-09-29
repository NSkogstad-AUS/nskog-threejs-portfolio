import * as THREE from 'three';
import { scene } from './scene.js';

// Angled perspective so we can see the side wall (left wall at negative X)
// Move camera to the right (positive X) and rotate it slightly back toward center.
export const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 30);
// Lowered a bit for a more grounded viewpoint.
camera.position.set(1.9, 0.90, 3.45);
camera.lookAt(0.05, 0.60, -0.2);
scene.add(camera);

// Optional: lightweight keyboard nudge for quick in-browser framing adjustments.
// Arrow keys: adjust X/Z.  Q/E: adjust Y.  Shift modifies step size.
window.addEventListener('keydown', (e) => {
	const base = e.shiftKey ? 0.2 : 0.05;
	let moved = false;
	switch(e.key){
		case 'ArrowLeft': camera.position.x -= base; moved=true; break;
		case 'ArrowRight': camera.position.x += base; moved=true; break;
		case 'ArrowUp': camera.position.z -= base; moved=true; break;
		case 'ArrowDown': camera.position.z += base; moved=true; break;
		case 'q': case 'Q': camera.position.y += base; moved=true; break;
		case 'e': case 'E': camera.position.y -= base; moved=true; break;
	}
	if(moved){
		camera.lookAt(0.05, 0.72, -0.2);
	}
});
