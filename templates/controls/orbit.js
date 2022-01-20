/* global camera,renderer,scene */

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import DEFAULTS from "sthree-sandbox/defaults";


let controls;
function init() {
    // controls

    controls = new OrbitControls( camera, renderer.domElement );

    controls.target = DEFAULTS.CAMERA.TARGET;

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 0.01;
    controls.maxDistance = 500;

    //controls.maxPolarAngle = Math.PI / 2;

    return { controls }
}


/**
 * @param {number} dt in seconds
 */
function update (dt) {
    controls.update();
}

/**
 * Show
 * @param GUI
 */
function gui(GUI, properties= null){

    properties = properties || [
        "enableDamping",
        "dampingFactor",
        "enableZoom",
        "zoomSpeed",
        "enableRotate",
        "rotateSpeed",
        "enablePan",
        "panSpeed",
        "screenSpacePanning"
    ];

    const folder = GUI.inspect("OrbitControls",controls,properties);


}

export default {init,update,gui};