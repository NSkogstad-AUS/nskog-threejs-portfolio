import * as THREE from 'three';

export const scene = new THREE.Scene();
scene.background = new THREE.Color('#1c2230'); // subtle bluish dark

// Slight fog for depth falloff (tweak to taste)
scene.fog = new THREE.Fog(scene.background, 6, 14);
