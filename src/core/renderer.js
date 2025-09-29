import * as THREE from 'three';
import { camera } from './camera.js';
import { scene } from './scene.js';
// Post-processing imports (outline effect)
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// --- Post Processing Setup ---
export const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

export const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeStrength = 2.2;      // intensity of outline
outlinePass.edgeGlow = 0.4;          // soft halo
outlinePass.edgeThickness = 1.0;     // thickness baseline
outlinePass.pulsePeriod = 0;         // disable pulsing
outlinePass.visibleEdgeColor.set('#55aaff');
outlinePass.hiddenEdgeColor.set('#0d1a26');
outlinePass.clear = true;
composer.addPass(outlinePass);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);
