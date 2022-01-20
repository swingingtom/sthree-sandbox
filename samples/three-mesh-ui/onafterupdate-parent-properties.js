import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import ThreeMeshUIGuiMixin from "sthree-sandbox/extras/threemeshui/GUIMixin"
import Orbit from "sthree-sandbox/three/controls/orbit";

let container, count = 0;
function main(resources){

    ThreeMeshUI.FontLibrary.addFont(
        "defaultFontFamily", // name of the added font
        resources.fonts["Roboto"].json,
        resources.fonts["Roboto"].texture
    );

    container = new ThreeMeshUI.Block({
        width: 2.5,
        height : 1.5,
        fontFamily: "defaultFontFamily",
        fontTexture: "defaultFontFamily",
        justifyContent: "center",
        alignContent: "center",
        fontColor: new THREE.Color(0xffffff),
        backgroundColor: new THREE.Color(0x000000),
        backgroundOpacity: 0.3,
    });

    container.position.set(0, 1, -1.8);
    container.rotation.x = -0.55;
    scene.add(container);

    //
    const titleCounter = new ThreeMeshUI.Text({
        content: "_",
    });

    const titleDisplayer = new ThreeMeshUI.Text({
        content: "OnAfterUpdate "+count,
    });

    titleCounter.onAfterUpdate = function(){

        count++;
        console.log("afterYpdate", +count);

    }

    container.add(titleCounter,titleDisplayer);


}

/**
 *
 * @param {number} dt in seconds
 */
function update(dt){
    // Don't forget, ThreeMeshUI must be updated manually.
    // This has been introduced in version 3.0.0 in order
    // to improve performance
    ThreeMeshUI.update();
}

function gui(GUI){
    GUI.inspectBlockComponent("container", container).open();
}

export default {
    main,
    update,
    gui,
    assets:{
        fonts: [
            { id: "Roboto", file: "Roboto-Regular-msdf" }
        ],
        textures:[
            { id: "snake", file: "spiny_bush_viper.jpg" }
        ],
    },
    template:{
        controls: Orbit,
    },
    mixins: {
        gui:[ ThreeMeshUIGuiMixin ],
    },
    infos:{
        title:"three-mesh-ui : onAfterUpdate from parent properties",
        description : "Illustrate that onAfterUpdate is triggered on children elements when parent properties changed",
        credits :
            `<a href="https://threejs.org" target="_blank" rel="noopener">threejs</a> - High dynamic range (RGBE) Image-based Lighting (IBL)
            using run-time generated pre-filtered roughness mipmaps (PMREM)<br/>
            Created by Prashant Sharma and <a href="http://clara.io/" target="_blank" rel="noopener">Ben Houston</a>`,
        git : "https://github.com/felixmariotto/three-mesh-ui/blob/master/examples/nested_blocks.js",
    }
}
