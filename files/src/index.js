// add or remove fonts to be available here
// files are located in `/assets/fonts/` folder
// be sure to have both png and json named the same when adding new font
import sandbox from "./sandbox";

const fontsToLoad = [
    // those fonts will be acessible by their id. file do not contains extensions
    { id: "CabinSketch", file: "CabinSketch-Bold-msdf" },
    { id: "ComforterBrush", file: "ComforterBrush-Regular-msdf" },
    { id: "Monoton", file: "Monoton-Regular-msdf" },
    { id: "PlayfairDisplay", file: "PlayfairDisplay-BlackItalic-msdf" },
    { id: "Roboto", file: "Roboto-Black-msdf" },
    { id: "Rye", file: "Rye-Regular-msdf" }
];

// add or remove texture to be available in this sample
// files are located in `/assets/textures/` folder
// be sure to have both png and json named the same when adding new font
const texturesToLoad = [
    // those textures will be accessible from their id
    { id: "uv_grid", file: "uv_grid.jpg" },
    { id: "snake", file: "spiny_bush_viper.jpg" }

    // And both fonts and textures support http(s) protocols
    //{ id: "crate", file: "https://threejs.org/examples/textures/crate.gif" }
];

sTHREESandbox.setup({fontsToLoad,texturesToLoad}).then( sandbox.init );