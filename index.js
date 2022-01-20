/* global global,renderer */

import AssetsLoader from "./src/loader"
import * as GUI from "./src/gui";
import LoaderOverlay from "./src/display/html-loader-overlay";
import UIOverlay from "./src/display/html-ui-overlay";

import room from "./templates/scenes/room";
import none from "./templates/controls/none";

let lastTime;


const emptyUpdate = function (){};
let worldUpdate = emptyUpdate, worldRender = emptyUpdate, controlUpdate = emptyUpdate, sandboxUpdate = emptyUpdate;


const setup = function ( sandbox ) {

    if ( !(typeof global !== 'undefined') ){
        throw new Error("sTHREESandbox requires a global context");
    }

    if( !sandbox ){
        throw new Error("sTHREESandbox requires a sandbox parameter")
    }

    if( !sandbox['main'] || !(typeof sandbox['main'] === "function") ){
        throw new Error("sTHREESandbox requires a sandbox parameter with an `main` function")
    }

    const appDom = document.querySelector("#app");
    const app3d = appDom.querySelector(".stage-3d");
    const app2d = appDom.querySelector(".stage-2d");

    app2d.classList.add('sthree__2d');
    app3d.classList.add('sthree__3d');



    if( !sandbox.infos ){
        sandbox.infos = {};
    }


    if( sandbox.infos.title ) document.title = sandbox.infos.title;

    //@TODO : Register globals
    UIOverlay(app2d, sandbox.infos);

    LoaderOverlay.setup(app2d);

    if( !sandbox.template ) sandbox.template = {};

    //init three template if provided. default is room
    let sceneTemplate = sandbox.template.scene || room
    _mix( sceneTemplate, sandbox.template.sceneMixins );
    _registerGlobals( sceneTemplate.init() , ["scene","camera","renderer"] , 'template.scene')

    worldUpdate = sceneTemplate.update || emptyUpdate;
    worldRender = sceneTemplate.render || emptyUpdate;
    app3d.appendChild(renderer.domElement);


    let controlTemplate = sandbox.template.controls || none;
    _mix(controlTemplate, sandbox.template.controlsMixins );

    _registerGlobals( controlTemplate.init(), ['controls'], 'template.controls');
    controlUpdate = controlTemplate.update || emptyUpdate;




    // As soon a scene and controls are built, propose and alteration
    if( sandbox['alterTemplate'] && typeof sandbox['alterTemplate'] === 'function'){
        sandbox.alterTemplate();
    }


    // init rendering
    lastTime = new Date().getTime();
    requestAnimationFrame( _updateChildren );

    if( sandbox.gltfLoader ){
        global['GLTFLoader'] = sandbox.gltfLoader;
    }

    AssetsLoader.load(sandbox.assets, function (loadedResources) {

        sandbox.main(loadedResources);

        // init if required gui
        if( sandbox['gui'] && typeof sandbox['gui'] === 'function') {

            // gui mixers
            if( sandbox.guiMixins && sandbox.guiMixins.length > 0){
                GUI = sandbox.guiMixins[0](GUI);
            }
            global.globalGUI = GUI;

            globalGUI.init(loadedResources);
            sandbox.gui(globalGUI);
        }

        if( sandbox['update'] && typeof sandbox['update'] === 'function'){
            sandboxUpdate = sandbox.update;
        }
    });

}

/**
 * Mix a template with mixins
 * @param o
 * @param mixins
 * @private
 */
function _mix( o, mixins ){
    if (!mixins || mixins.length === 0) return;

    for (let i = 0; i < mixins.length; i++) {
        const mixin = mixins[i];
        o = mixin(o);
    }
}

/**
 * Main loop of the sandboxed project
 * @private
 */
function _updateChildren (){
    // dt
    const newTime = new Date().getTime();
    const dt = (newTime - lastTime)/1000;
    lastTime = newTime;

    worldUpdate(dt);

    controlUpdate(dt);

    sandboxUpdate(dt);

    worldRender(dt);

    requestAnimationFrame(_updateChildren);
}

function _registerGlobals(result,requiredKeys,type){
    for( const p in result ){
        if( result.hasOwnProperty(p)){
            // make it global vars
            global[p] = result[p];

            const keyIndex = requiredKeys.indexOf(p);
            if( keyIndex !== -1){
                requiredKeys.splice(keyIndex);
            }
        }
    }
    if( requiredKeys.length > 0){
        throw new Error("the provided `"+type+"` missed to return `"+requiredKeys.join(",")+ "` properties");
    }
}

const sTHREESandbox = setup;

if (typeof global !== 'undefined') global.sTHREESandbox = sTHREESandbox;

export default sTHREESandbox

