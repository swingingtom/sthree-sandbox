/* global camera,renderer,scene */

import {FlyControls} from 'three/examples/jsm/controls/FlyControls.js';


let controls;

function init() {
    controls = new FlyControls(camera, renderer.domElement);

    controls.movementSpeed = 1000;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;

    return {controls};
}

function update(dt) {
    controls.update(dt);
}

function gui(GUI, properties) {

    properties = properties || [
        "movementSpeed",
        "rollSpeed",
        "dragToLook",
        "autoForward",
    ];

    const folder = GUI.inspect("FlyControls", controls, properties );
}

export default {init, update, gui};