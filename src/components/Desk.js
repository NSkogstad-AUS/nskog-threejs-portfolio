import * as THREE from 'three';
import { scene } from '../core/scene.js';
import { Colors, basic } from './materials/Palette.js';

// Desk surface
const deskWidth = 2.4;
const deskDepth = 1.2;
const deskThickness = 0.08;

const topGeo = new THREE.BoxGeometry(deskWidth, deskThickness, deskDepth);
const topMat = basic(Colors.deskTop);
const deskTop = new THREE.Mesh(topGeo, topMat);
deskTop.receiveShadow = true;
deskTop.position.set(0, 0, 0);
scene.add(deskTop);

// Edge / lip (front)
const lipGeo = new THREE.BoxGeometry(deskWidth, 0.05, 0.04);
const lip = new THREE.Mesh(lipGeo, basic(Colors.deskEdge));
lip.position.set(0, -deskThickness/2 + 0.025, deskDepth/2 - 0.02);
deskTop.add(lip);

// Back wall & side wall forming a corner
const wallMat = basic(Colors.wall);
wallMat.roughness = 1;

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMat);
backWall.position.set(0, 2, -deskDepth/2 - 0.001);
backWall.receiveShadow = true;
scene.add(backWall);

const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), wallMat);
sideWall.rotation.y = Math.PI/2;
sideWall.position.set(-deskWidth/2 - 0.001, 2, 0);
sideWall.receiveShadow = true;
scene.add(sideWall);

// Slight floor plane for shadow catch (extends beyond desk)
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: 0.35 }));
floor.rotation.x = -Math.PI/2;
floor.position.y = -deskThickness/2 - 0.0001;
floor.receiveShadow = true;
scene.add(floor);
