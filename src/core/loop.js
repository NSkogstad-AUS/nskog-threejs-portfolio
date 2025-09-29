import { renderer, composer } from './renderer.js';
import { scene } from './scene.js';
import { camera } from './camera.js';
import * as THREE from 'three';

const tickHandlers = new Set();
export function onTick(fn){ tickHandlers.add(fn); }
export function offTick(fn){ tickHandlers.delete(fn); }

let last = performance.now();

// Camera is now fixed; no parallax animation.

export function startLoop(){
  function loop(){
    requestAnimationFrame(loop);
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;
  for(const fn of tickHandlers){ fn(dt, now); }

    // Post-processing pipeline (outline etc.)
    composer.render();
  }
  loop();
}
