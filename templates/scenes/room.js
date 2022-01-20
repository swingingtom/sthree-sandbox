import * as THREE from "three";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry.js";
import DEFAULTS from 'sthree-sandbox/defaults';


const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let scene, camera, renderer;

/**
 * Init Three js setup
 */
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = new THREE.PerspectiveCamera(DEFAULTS.CAMERA.FOV, WIDTH / HEIGHT, DEFAULTS.CAMERA.NEAR, DEFAULTS.CAMERA.FAR);


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);


    camera.position.copy(DEFAULTS.CAMERA.POSITION);

    // ROOM
    const room = new THREE.LineSegments(
        new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
        new THREE.LineBasicMaterial({ color: 0x808080 })
    );

    scene.add(room);

    window.addEventListener("resize", onWindowResize);

    return {scene,camera,renderer};
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

export default { init, render };