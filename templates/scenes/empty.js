import * as THREE from "three";
import DEFAULTS from 'sthree-sandbox/defaults';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// threejs main elements
let scene, camera, renderer;

/**
 * Init Three js setup
 */
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = new THREE.PerspectiveCamera(DEFAULTS.CAMERA.FOV, WIDTH / HEIGHT, DEFAULTS.CAMERA.NEAR, DEFAULTS.CAMERA.FAR);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    camera.position.copy(DEFAULTS.CAMERA.POSITION);

    window.addEventListener('resize', onWindowResize);

    return {scene, camera, renderer};
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


/**
 * @param {number} dt in seconds
 */
function render(dt) {
    renderer.render(scene, camera);
}

export default {init, render}