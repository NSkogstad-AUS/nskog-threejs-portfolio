import * as THREE from 'three';

// Centralized color palette to keep style cohesive.
export const Colors = {
  deskTop: 0x2a2f3a,
  deskEdge: 0x1f242c,
  plasticDark: 0x4a5564,
  plasticLight: 0x9ba7b4,
  monitorFrame: 0xf2f2f2,
  monitorGlow: 0x4fb4ff,
  noteYellow: 0xffe278,
  noteGreen: 0xb6e9a3,
  noteBlue: 0x9cc9ff,
  notePink: 0xf9a5c2,
  wall: 0x1d2531,
  shelf: 0x262e3a,
  cactusPot: 0xc99763,
  cactusBody: 0x4caf50,
  calendar: 0xffffff,
  accentPurple: 0x9b6bff,
};

export function basic(color){
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0 });
}

export function emissive(color, intensity = 1){
  return new THREE.MeshStandardMaterial({ color: 0x111111, emissive: new THREE.Color(color), emissiveIntensity: intensity, roughness: 0.4 });
}
