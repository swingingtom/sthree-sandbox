import { EffectComposer, RenderPass } from "postprocessing";

let composer;

export default function( world ){

    return {
        ...world,
        init:()=>{
            const results = world.init();

            composer = new EffectComposer(results.renderer);
            composer.addPass(new RenderPass(results.scene, results.camera));

            results["composer"] = composer;

            return results;
        },

        render:(dt)=>{
            composer.render();
        },
    }
}