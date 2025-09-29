import * as THREE from 'three';
import { scene } from '../core/scene.js';

// Key light (simulated glow cast from CRT screen)
const monitorKey = new THREE.SpotLight(0x6cc8ff, 2.8, 8, Math.PI/3.1, 0.5, 1);
monitorKey.position.set(-0.25, 1.15, 1.0); // slightly in front & above screen center
monitorKey.target.position.set(-0.25, 0.95, 0.15); // aim toward CRT screen middle
monitorKey.castShadow = true;
scene.add(monitorKey, monitorKey.target);

// Warm desk lamp accent (placeholder position)
const warmLamp = new THREE.PointLight(0xffb46b, 0.9, 8, 2);
warmLamp.position.set(-1.2, 1.7, 1.2);
warmLamp.castShadow = true;
scene.add(warmLamp);

// Fill / ambient
scene.add(new THREE.AmbientLight(0x8895a7, 0.25));

// Rim light from behind to outline objects
const rim = new THREE.DirectionalLight(0x4f6dff, 0.5);
rim.position.set(3, 4, 5);
rim.castShadow = true;
scene.add(rim);
