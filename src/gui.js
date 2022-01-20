import GUI from "lil-gui";
import {Color, Texture} from "three";

let availableTextures, loadedTextures, gui;

/**
 * Initialize the gui
 * @param loadedResources
 */
function init(loadedResources) {

    availableTextures = {none: "none"};
    for (const textureId in loadedTextures) {
        availableTextures[textureId] = textureId;
    }

    gui = new GUI();

    return gui;
}

/**
 * Get a gui folder
 * @param name
 * @returns {GUI}
 */
function addFolder(name , open = false) {
    return gui.addFolder(name).open(open);
}

function inspectElement(name, component, properties){
    const folder = globalGUI.addFolder(name);
    _buildAnyOthersController(folder, component, properties);

    return folder;
}

function inspectProperties(folder, component, properties, propertiesConfig){
    _buildAnyOthersController(folder,component,properties,propertiesConfig);
}

/**
 * Build gui controllers for all provided properties of a component
 * @param folder
 * @param component
 * @param properties
 * @private
 */
function _buildAnyOthersController(folder, component, properties, propertiesConfig = {}) {
    const props = {};

    for (let i = 0; i < properties.length; ++i) {
        const property = properties[i];

        props[property] = globalGUI.retrieveValue(component,property);

        if (props[property] instanceof Color) {
            _buildColorController(folder, component, props, property, propertiesConfig[property]);
        } else if (_isNumeric(props[property])) {
            _buildNumericController(folder,component,props,property, propertiesConfig[property]);
        } else if ( _isString(props[property]) ) {
            _buildStringController(folder,component,props,property, propertiesConfig[property]);
        } else if (props[property] instanceof Texture) {
            _buildTextureController(folder, component, props, property, propertiesConfig[property]);
        }else if( typeof props[property] == "boolean"){
            folder.add(props, property).onChange(_closureSetter(component,property));
        } else if( typeof props[property] == "function"){
            folder.add(props, property);
        }

    }
}

/***********************************************************************************************************************
 * CONTROLLER TYPES
 **********************************************************************************************************************/

function _buildNumericController(folder, component,props,property,propertyConfig){
    let min = undefined;
    let max = undefined;
    let step = undefined;
    let transformer = null;

    // if configuration provided
    if( propertyConfig ){
        min = propertyConfig.length > 0 ? propertyConfig[0] : undefined;
        max = propertyConfig.length > 1 ? propertyConfig[1] : undefined;
        step = propertyConfig.length > 2 ? propertyConfig[2] : undefined
        transformer = propertyConfig.length > 3 ? propertyConfig[3] : null;
    }else {
        ({min,max,step,transformer} = globalGUI.deductNumeric(component,property));
    }

    folder.add(props, property, min, max, step).onChange(_closureSetter(component,property,transformer));
}

function _buildStringController(folder,component,props,property,propertyConfig){
    let options = undefined;
    let transformer = null;

    if( propertyConfig && propertyConfig.length > 0 ){
        options = propertyConfig[0];
    }else {
        ({options,transformer} = globalGUI.deductString(component,property));
    }

    folder.add(props, property, options).onChange(_closureSetter(component,property,transformer));
}


function _buildColorController(folder, component, props, property, propertyConfig) {
    folder.addColor(props, property).onChange(_closureSetter(component,property));
}

function _buildTextureController(folder, component, props, property, propertyConfig) {
    for (let textureId in loadedTextures) {
        if (props[property] === loadedTextures[textureId]) {
            props[property] = textureId;
        }
    }

    if (props[property] instanceof Texture) {
        props[property] = "none";
    }

    folder.add(props, property, availableTextures).onChange(_closureSetter(component,property,_textureFromId));
}

/***********************************************************************************************************************
 * DEDUCTORS
 **********************************************************************************************************************/

function retrieveValue(component,property){
    return component[property];
}

function deductString(component){
    let options = null;
    let transformer = null;

    return {options, transformer};
}

function deductNumeric(component){
    let min = undefined;
    let max = undefined;
    let step = undefined;
    let transformer = null;
    return {min,max,step, transformer};
}

/***********************************************************************************************************************
 * HELPERS
 **********************************************************************************************************************/

function _closureSetter(component,property,transformer){
    return function (v){

        if( transformer ){
            v = transformer(v);
        }


        // @TODO: Component.set comes from three-mesh-ui, put that in its mixin
        if( component.set ){
            component.set({
                [property]: v
            });
        }else{
            component[property] = v;
        }
    }
}

function _textureFromId( textureId ){
    let newTexture = null;
    if (textureId !== "none") {
        newTexture = loadedTextures[textureId];
    }
    return newTexture;
}

function _isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function _isString(s) {
    return typeof s === "string" || s instanceof String;
}

export {init, inspectElement, inspectProperties, addFolder, retrieveValue, deductString, deductNumeric};
