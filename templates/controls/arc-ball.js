/* global camera,renderer,scene */

import {ArcballControls} from 'three/examples/jsm/controls/ArcballControls.js';
import DEFAULTS from 'sthree-sandbox/defaults';

let controls;

function init() {
    controls = new ArcballControls(camera, renderer.domElement, scene);
    controls.target.copy( DEFAULTS.CAMERA.TARGET );
    return {controls};
}

function update(dt) {
    controls.update(dt)
}

function gui(GUI, properties = null) {

    properties = properties || [
        'enabled',
        'enableGrid',
        'enableRotate',
        'enablePan',
        'enableZoom',
        'cursorZoom',
        'adjustNearFar',
        'scaleFactor',
        'minDistance',
        'maxDistance',
        'minZoom',
        'maxZoom',
        'gizmoVisible',
        'reset',

        // animations properties
        'enableAnimations',
        'dampingFactor',
        'wMax'
    ];

    const propertiesConfig = {
        scaleFactor: [1.1, 10, 0.1],
        minDistance: [0, 50, 0.5],
        maxDistance: [0, 50, 0.5],
        minZoom: [0, 50, 0.5],
        maxZoom: [0, 50, 0.5],
    }

    const animationProperties = [
        'enableAnimations',
        'dampingFactor',
        'wMax'
    ];

    const animationPropertiesConfig = {
        dampingFactor: [0, 100, 1],
        wMax: [0, 100, 1]
    }


    const folder = GUI.addFolder("ArcBallControls");

    // remove animations properties
    for (let i = animationProperties.length - 1; i >= 0; i--) {
        const animationProperty = animationProperties[i];

        const existingIndex = properties.indexOf(animationProperty);
        if (existingIndex !== -1) {
            properties.splice(existingIndex, 1);
        } else {
            animationProperties.splice(i, 1);
            if (animationPropertiesConfig[animationProperty]) {
                delete animationPropertiesConfig[animationProperty];
            }
        }
    }

    if( animationProperties.length > 0){
        const animationFolder = folder.addFolder("Animations");
        GUI.inspectProperties(animationFolder,controls,animationProperties,animationPropertiesConfig);
    }

    if( properties.length > 0 ){
        //special case : gizmoVisible
        const gizmoIndex = properties.indexOf("gizmoVisible");
        if( gizmoIndex !== -1 ){
            properties.splice(gizmoIndex,1);

            const p = {gizmoVisible:controls.enableGizmos};
            folder.add( p, 'gizmoVisible').onChange( function(){
                controls.setGizmosVisible(p.gizmoVisible);
            });
        }

        GUI.inspectProperties(folder,controls,properties,propertiesConfig);
    }

}

export default {init, update, gui}