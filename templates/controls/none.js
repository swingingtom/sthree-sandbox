/* global camera,renderer,scene */

import DEFAULTS from "sthree-sandbox/defaults";

let controls = null;

function init() {

    const defaultTarget = DEFAULTS.CAMERA.TARGET;
    camera.lookAt( defaultTarget.x , defaultTarget.y, defaultTarget.z );

    return{controls}
};


/**
 * @param {number} dt in seconds
 */
function update(dt) {};

export default {init,update};