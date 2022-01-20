import {Color, Texture} from "three";

const blockComponentProperties = [
    "width",
    "height",
    "padding",
    "fontFamily",
    "fontSize",
    "fontKerning",
    "fontColor",
    "fontOpacity",
    "letterSpacing",
    "interLine",
    "margin",
    "contentDirection",
    "justifyContent",
    "alignContent",
    "offset",
    "backgroundColor",
    "backgroundOpacity",
    "backgroundTexture",
    "backgroundSize",
    "borderRadius",
    "borderWidth",
    "borderColor",
    "borderOpacity",
    "hiddenOverflow"
];
const textComponentProperties = [
    "fontFamily",
    "fontSize",
    "fontKerning",
    "fontColor",
    "fontOpacity",
    "letterSpacing",
    "interLine",
    "content"
];

// those properties won't be automatically generated
const ignoredProperties = ["fontFamily", "fontTexture"];

let gui, availableFonts, loadedFonts;

export default function (GUI) {

    return {
        ...GUI,

        /**
         * Alter the previous initialization
         * @param loadedResources
         * @returns {GUI}
         */
        init: (loadedResources) => {
            gui = GUI.init(loadedResources);

            // stores available font and textures
            loadedFonts = loadedResources.fonts;

            // making them a listing of string:string
            availableFonts = {};
            for (const fontFamily in loadedFonts) {
                availableFonts[fontFamily] = fontFamily;
            }

            return gui;
        },

        /**
         * Inspect a ThreeMeshUI.Block element
         * @param {string} name the name to display
         * @param {ThreeMeshUI.Block} component the ThreeMeshUI.Block element
         * @param {Array<string>} properties a list of properties to inspect
         * @returns {GUI}
         */
        inspectBlockComponent: (name, component, properties = blockComponentProperties, propertiesConfig = {}) => {
            const folder = GUI.addFolder(name);
            _buildTMUFontController(folder, component, properties);
            GUI.inspectProperties(folder, component, properties, propertiesConfig);

            return folder;
        },
        /**
         * Inspect a ThreeMeshUI.Text element
         * @param {string} name the name to display
         * @param {ThreeMeshUI.Text} component the ThreeMeshUI.Text element
         * @param {Array<string>} properties a list of properties to inspect
         * @returns {GUI}
         */
        inspectTextComponent:(name, component, properties = textComponentProperties) => {
            const folder = GUI.addFolder(name);

            _buildTMUFontController(folder, component, properties);

            _removeIgnoredProperties(properties);


            //@TODO: Some properties might already been configured
            const propertiesConfig = {};
            GUI.inspectProperties(folder, component, properties, propertiesConfig);

            return folder;
        },

        retrieveValue: (component, property) => {
            if (component._getProperty) {
                return component._getProperty(property);
            }
            return GUI.retrieveValue(component, property)
        },

        deductNumeric:(component, property) => {

            // @TODO: Might be restricted with component.isText | component instanceOf ThreeMeshUI
            let min, max, step, transformer;
            ( {min,max,step,transformer} = _deductNumeric(component, property) );
            if (min || max || step || transformer) {
                return {min, max, step, transformer};
            }

            // or fallback
            return GUI.deductNumeric(component, property);
        },
        deductString:(component, property) => {
            let options, transformer;
            ( {options,transformer} = _deductString(component, property));

            if (options || transformer) {
                return {options, transformer};
            }

            //or fallback
            return GUI.deductNumeric(component, property);
        },
        blockComponentProperties,
        textComponentProperties,
    }

}

function _buildTMUFontController(folder, component, properties) {
    if (properties.indexOf("fontFamily") !== -1) {
        let elementFont = component.getFontFamily();
        let p = {};
        for (let fontFamily in loadedFonts) {
            if (elementFont === loadedFonts[fontFamily].json) {
                p.fontFamily = fontFamily;
            }
        }

        folder.add(p, "fontFamily", availableFonts).onChange((v) => {
            component.set({
                fontFamily: v,
                fontTexture: v
            });
        });
    }
}


function _deductString(component, property) {
    let options = null;
    let transformer = null;

    // try to deduct configuration
    switch (property) {
        case "fontKerning":
            options = {
                normal: "normal",
                none: "none"
            };
            break;

        case "contentDirection":
            options = {
                row: "row",
                "row-reverse": "row-reverse",
                column: "column",
                "column-reverse": "column-reverse"
            };
            break;

        case "alignContent":
            options = {
                top: "top",
                bottom: "bottom",
                center: "center",
                left: "left",
                right: "right"
            };
            break;

        case "justifyContent":
            options = {
                start: "start",
                center: "center",
                end: "end"
            };
            break;

        case "backgroundSize":
            options = {
                contain: "contain",
                cover: "cover",
                stretch: "stretch"
            };
            break;

        default:
    }

    return {options, transformer};
}

function _deductNumeric(component, property) {
    let min = undefined;
    let max = undefined;
    let step = undefined;

    // try to deduct configuration
    if (property.toLowerCase().indexOf("opacity") !== -1) {
        min = 0;
        max = 1;
    } else {


        switch (property) {
            case "fontSize":
                min = 0.001;
                max = 4;
                break;

            case "letterSpacing":
                step = 0.05;
                break;

            case "borderRadius":
                min = 0;
                max = 1.0;
                step = 0.05;
                break;

            case "borderWidth":
                min = 0;
                max = 2;
                step = 0.05;
                break;

            default:
        }
    }

    return {min, max, step};

}

function _removeIgnoredProperties(properties) {

    for (let i = properties.length - 1; i >= 0; i--) {
        const property = properties[i];

        if (ignoredProperties.indexOf(property) !== -1) {
            properties.splice(i, 1);
        }
    }
}