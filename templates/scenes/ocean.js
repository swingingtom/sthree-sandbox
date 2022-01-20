//

import * as THREE from "three";

import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

import DEFAULTS from 'sthree-sandbox/defaults';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let camera, scene, renderer;
let water, sunPosition, mesh;

/**
 * Init Three js setup
 */
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = new THREE.PerspectiveCamera(DEFAULTS.CAMERA.FOV, WIDTH / HEIGHT, DEFAULTS.CAMERA.NEAR, DEFAULTS.CAMERA.FAR);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);


    camera.position.copy( DEFAULTS.CAMERA.POSITION );

    sunPosition = new THREE.Vector3();

    // Water

    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'https://threejs.org/examples/textures/waternormals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;

    scene.add( water );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 4;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    const sun = {
        elevation: 2,
        azimuth: 180
    };

    sun.update = () =>{

        const phi = THREE.MathUtils.degToRad( 90 - sun.elevation );
        const theta = THREE.MathUtils.degToRad( sun.azimuth );

        sunPosition.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sunPosition );
        water.material.uniforms[ 'sunDirection' ].value.copy( sunPosition ).normalize();

        scene.environment = pmremGenerator.fromScene( sky ).texture;

    }
    sun.update();

    window.addEventListener("resize", onWindowResize);

    return {scene,camera,renderer,sky,sun,water};
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * @param {number} dt in seconds
 */
function update(dt) {
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
}

/**
 * @param {number} dt in seconds
 */
function render(dt){
    renderer.render(scene, camera);
}

export default { init, update, render };