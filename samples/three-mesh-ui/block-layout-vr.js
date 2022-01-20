import * as THREE from "three";
import ThreeMeshUI from "three-mesh-ui";
import ThreeMeshUIGuiMixin from "sthree-sandbox/extras/threemeshui/GUIMixin"
import Orbit from "sthree-sandbox/three/controls/orbit";

let container, contentContainer,rightSubBlock,subSubBlock1,subSubBlock2;
function main(resources){

    ThreeMeshUI.FontLibrary.addFont(
        "defaultFontFamily", // name of the added font
        resources.fonts["Roboto"].json,
        resources.fonts["Roboto"].texture
    );

    container = new ThreeMeshUI.Block({
        ref: "container",
        padding: 0.025,
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

    const title = new ThreeMeshUI.Block({
        height: 0.2,
        width: 1.5,
        margin: 0.025,
        justifyContent: "center",
        fontSize: 0.09,
    });

    title.add(
        new ThreeMeshUI.Text({
            content: "spiny bush viper",
        })
    );

    container.add(title);

    //

    const leftSubBlock = new ThreeMeshUI.Block({
        height: 0.95,
        width: 1.0,
        margin: 0.025,
        padding: 0.025,
        alignContent: "left",
        justifyContent: "end",
        backgroundTexture: resources.textures.snake
    });

    const caption = new ThreeMeshUI.Block({
        height: 0.07,
        width: 0.37,
        alignContent: "center",
        justifyContent: "center",
    });

    caption.add(
        new ThreeMeshUI.Text({
            content: "Mind your fingers",
            fontSize: 0.04,
        })
    );

    leftSubBlock.add(caption);

    //

    rightSubBlock = new ThreeMeshUI.Block({
        margin: 0.025,
    });

    subSubBlock1 = new ThreeMeshUI.Block({
        height: 0.35,
        width: 0.5,
        margin: 0.025,
        padding: 0.02,
        fontSize: 0.04,
        justifyContent: "center",
        backgroundOpacity: 0,
    }).add(
        new ThreeMeshUI.Text({
            content: "Known for its extremely keeled dorsal scales that give it a ",
        }),

        new ThreeMeshUI.Text({
            content: "bristly",
            fontColor: new THREE.Color(0x92e66c),
        }),

        new ThreeMeshUI.Text({
            content: " appearance.",
        })
    );

    subSubBlock2 = new ThreeMeshUI.Block({
        height: 0.53,
        width: 0.5,
        margin: 0.01,
        padding: 0.02,
        fontSize: 0.025,
        alignContent: "left",
        backgroundOpacity: 0,
    }).add(
        new ThreeMeshUI.Text({
            content:
                "The males of this species grow to maximum total length of 73 cm (29 in): body 58 cm (23 in), tail 15 cm (5.9 in). Females grow to a maximum total length of 58 cm (23 in). The males are surprisingly long and slender compared to the females.\nThe head has a short snout, more so in males than in females.\nThe eyes are large and surrounded by 9-16 circumorbital scales. The orbits (eyes) are separated by 7-9 scales.",
        })
    );

    rightSubBlock.add(subSubBlock1, subSubBlock2);

    //

    contentContainer = new ThreeMeshUI.Block({
        contentDirection: "row",
        padding: 0.02,
        margin: 0.025,
        backgroundOpacity: 0,
    });

    contentContainer.add(leftSubBlock, rightSubBlock);
    container.add(contentContainer);
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


    GUI.inspectBlockComponent("container", container, ["width","height","contentDirection","justifyContent","alignContent","backgroundColor","backgroundOpacity"])
        .open();
    GUI.inspectBlockComponent("contentContainer", contentContainer, ["contentDirection","justifyContent","alignContent"])
    GUI.inspectBlockComponent("rightSubBlock", rightSubBlock, ["width","height"],{"width":[
        0.2,5,0.1,(v)=>{

                console.log("transformer");

                subSubBlock1.set({width:v});
                subSubBlock2.set({width:v});
                return v;
            }
        ]});

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
    mixins:{
        gui: [ ThreeMeshUIGuiMixin ]
    }
}
