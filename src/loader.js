/**
 * Internal File of three-mesh-ui sample
 *
 * This file comes with three-mesh-ui sample,
 * only for three-mesh-ui sample purpose,
 * it is not required for using three-mesh-ui,
 * and doesn't aim to provide production quality code.
 *
 */

import {FileLoader} from "three";
import {TextureLoader} from "three";
import LoaderOverlay from "./display/html-loader-overlay";

const FONT_PATH = "./assets/fonts/";
const TEXTURE_PATH = "./assets/textures/";
const JSON_PATH = "./assets/jsons/";
const GLTF_PATH = "./assets/gltfs/";

const availableLoadTypes = {"fonts":"Font","textures":"Texture","jsons":"Json","gltfs":"GLTF"};

let success;
let toLoad, loaded, loadingIndexes;
/**
 * Preloading fonts and additional textures for those samples
 * and not required for common three-mesh-ui use cases
 * @param {Function} callback
 */
function load( assets = {}, callback) {

    success = callback;

    toLoad = {};
    loaded = {};
    loadingIndexes = {};

    LoaderOverlay.init();

    for (const availableLoadType in availableLoadTypes) {

        if( assets[availableLoadType] && assets[availableLoadType].length ){
            toLoad[availableLoadType] = assets[availableLoadType];
            loadingIndexes[availableLoadType] = -1;
            switch (availableLoadType){
                case "fonts":
                    loadNextFont();
                    break;
                case "textures":
                    loadNextTexture();
                    break;
                case "jsons":
                    loadNextJson();
                   break;
                case "gltfs":
                    loadNextGLTF();
                   break;

                default:
                    throw new Error( "sTHREESandbox load type `"+availableLoadType+"` is not (yet?) implemented");
            }

        }
        loaded[availableLoadType] = {};
    }


    if( Object.keys(toLoad).length === 0){
        LoaderOverlay.remove();
        success(loaded);
    }

}


// FONTS -----------------------------------------------------
function loadNextFont() {
    loadingIndexes["fonts"]++;

    updateProgress();

    if (loadingIndexes["fonts"] >= toLoad.fonts.length) {
        checkCompletion();
    } else {
        loadFontJson();
        loadFontTexture();
    }
}

function loadFontJson() {
    const fontIndex = loadingIndexes["fonts"];
    const fontId = toLoad.fonts[fontIndex].id;
    const fontFile = toLoad.fonts[fontIndex].file;
    const jsonUrl = _getFileUrl(FONT_PATH, fontFile + ".json");
    const fileLoader = new FileLoader();
    fileLoader.load(
        jsonUrl,
        (text) => {
            const fontJson = JSON.parse(text);
            if (!loaded.fonts[fontId]) {
                loaded.fonts[fontId] = {};
            }
            loaded.fonts[fontId].json = fontJson;

            if (loaded.fonts[fontId].texture) {
                loadNextFont();
            }
        },
    );
}

function loadFontTexture() {
    const fontIndex = loadingIndexes["fonts"];
    const fontId = toLoad.fonts[fontIndex].id;
    const textureFile = toLoad.fonts[fontIndex].file;
    const textureUrl = _getFileUrl(FONT_PATH, textureFile + ".png");
    const textureLoader = new TextureLoader();
    textureLoader.load(
        textureUrl,
        (texture) => {
            if (!loaded.fonts[fontId]) {
                loaded.fonts[fontId] = {};
            }
            loaded.fonts[fontId].texture = texture;

            if (loaded.fonts[fontId].json) {
                loadNextFont();
            }
        }
    );
}

// TEXTURES -----------------------------------------------------
function loadNextTexture() {
    loadingIndexes["textures"]++;
    if ( loadingIndexes["textures"] >= toLoad.textures.length) {
        checkCompletion();
    } else {
        loadTexture();
    }

    updateProgress();
}

function loadTexture() {
    const textureIndex = loadingIndexes["textures"];
    const textureId = toLoad.textures[textureIndex].id;
    const textureFile = toLoad.textures[textureIndex].file;
    const textureUrl = _getFileUrl(TEXTURE_PATH, textureFile);
    const textureLoader = new TextureLoader();
    textureLoader.load(
        textureUrl,
        (texture) => {
            loaded.textures[textureId] = texture;
            loadNextTexture();
        }
    );
}

// JSONS -----------------------------------------------------
function loadNextJson() {
    loadingIndexes["jsons"]++;

    updateProgress();

    if (loadingIndexes["jsons"] >= toLoad.jsons.length) {
        checkCompletion();
    } else {
        loadJson();
    }
}

function loadJson() {
    const jsonIndex = loadingIndexes["jsons"];
    const jsonId = toLoad.jsons[jsonIndex].id;
    const jsonFile = toLoad.jsons[jsonIndex].file;
    const jsonUrl = _getFileUrl(FONT_PATH, jsonFile + ".json");
    const fileLoader = new FileLoader();
    fileLoader.load(
      jsonUrl,
      (text) => {
          loaded.jsons[jsonId] = JSON.parse(text);
      },
    );
}

// GLTFS -----------------------------------------------------
function loadNextGLTF() {
    loadingIndexes["gltfs"]++;

    updateProgress();

    if (loadingIndexes["gltfs"] >= toLoad.gltfs.length) {
        checkCompletion();
    } else {
        loadGLTF();
    }
}

function loadGLTF() {
    const gltfIndex = loadingIndexes["gltfs"];
    const gltfId = toLoad.gltfs[gltfIndex].id;
    const gltfFile = toLoad.gltfs[gltfIndex].file;
    const gltfUrl = _getFileUrl(GLTF_PATH, gltfFile);

    let gltfLoader;
    try {
        gltfLoader = GLTFLoader;
    }
    catch (e){
        throw new Error("In order to load GLTF, register it first during `sTHREESandbox.setup({gltfLoader:gltfLoaderInstance})`");
    }

    gltfLoader.load(
      gltfUrl,
      (gltf) => {
          loaded.gltfs[gltfId] = gltf;
          loadNextGLTF();
      },
    );
}

// INTERNAL -----------------------------------------------------
function updateProgress() {


    let total = 0;
    let divided = 0;
    let string = "";
    for (const loadType in toLoad ) {
        const loadIndex = loadingIndexes[loadType];
        const totalFiles = toLoad[loadType].length;
        total += loadIndex/totalFiles;
        divided++;

        string += availableLoadTypes[loadType]+":"+loadIndex+"/"+totalFiles+" ";
    }

    LoaderOverlay.update( total/divided );
    LoaderOverlay.updateDescription(string);
}

function checkCompletion() {

    let total = 0;
    let divided = 0;
    for (const loadType in toLoad) {
        const loadIndex = loadingIndexes[loadType];
        const totalFiles = toLoad[loadType].length;
        total += loadIndex/totalFiles;
        divided++;
    }

    if( total === divided ){
        // complete;
        LoaderOverlay.remove();
        success(loaded);
    }
}

// UTILS -----------------------------------------------------
/**
 * Check for a remote protocol on the filename to obtain an absolute url,
 * or prefix with the provided the local directory path
 * @param {string} localFolder
 * @param {string} file
 * @returns {string}
 */
function _getFileUrl(localFolder, file) {
    if (file.indexOf("http") === 0) {
        return file;
    }

    return localFolder + file;
}

export default {load};
