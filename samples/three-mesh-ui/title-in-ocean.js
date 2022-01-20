import ThreeMeshUI from "three-mesh-ui";
import Ocean from "sthree-sandbox/three/templates/ocean";
import ArcBall from "sthree-sandbox/three/controls/arc-ball";
import ThreeMeshUIGuiMixin from "sthree-sandbox/extras/threemeshui/GUIMixin";

let container;

/**
 * When all resources are loaded, this sandbox can be initialized
 * @param {{gltfs: {}, textures: {}, fonts: {}, jsons: {}}} resources
 */
function main(resources) {

    ThreeMeshUI.FontLibrary.addFont(
        "defaultFontFamily", // name of the font
        resources.fonts["Roboto"].json,
        resources.fonts["Roboto"].texture
    );

    container = new ThreeMeshUI.Block({
        width: 2.55,
        height: 1.25,
        fontSize: 0.55,
        fontFamily: "defaultFontFamily",
        fontTexture: "defaultFontFamily",
    });

    container.position.set(0, 1, -1.8);
    container.rotation.x = -0.55;

    container.add(
        new ThreeMeshUI.Text({
            content: "Title on ocean",
        })
    );

    scene.add(container);
}

/**
 * Perform frame update on things
 * @param {number} dt in seconds
 */
function update(dt) {
    // Don't forget, ThreeMeshUI must be updated manually.
    // This has been introduced in version 3.0.0 in order
    // to improve performance
    ThreeMeshUI.update();
}

/**
 *
 * @param GUI
 */
function gui(GUI) {

    // ArcBall.gui(GUI);

    GUI.inspectBlockComponent("Block", container);

}

/**
 * Optional : can be removed
 * At this time, threejs template and controls are built
 * And can access their resulting properties from the global scope
 *
 *      properties : scene, camera, renderer, controls, + depending on template
 */
function alterTemplate() {
    // ie:
    // scene.background = new THREE.Color(0xff9900);

}

export default {
    main,
    update,
    gui,
    alterTemplate,
    template: {
        scene: Ocean,
        controls: ArcBall
    },
    mixins: {
        gui: [ThreeMeshUIGuiMixin]
    },
    assets: {
        fonts: [
            {id: "Roboto", file: "Roboto-Black-msdf"}
        ]
    },


};
