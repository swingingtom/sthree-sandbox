export default {
    /**
     * Optional : can be removed
     * At this time, threejs base world and controls are built
     * And can access their resulting properties from the global scope
     *
     *      properties : scene, camera, renderer, controls
     */
    onWorldInit: function() {
        // ie:
        // scene.background = new THREE.Color(0xff9900);
    },

    /**
     * When all resources are loaded, this sandbox can be initialized
     * @param {{gltfs: {}, textures: {}, fonts: {}, datas: {}}} resources
     */
    init: (resources) => {

    },

    /**
     * Optional : can be removed
     * Perform frame update on things
     * @param {number} dt in seconds
     */
    update: (dt) => {
        // ie:
        // cube.rotation.y += dt*0.2;
    }

};