// @ts-ignore
import $ from "jquery";
import { RoughAnnotationConfig } from "rough-notation/lib/model";
import { initEffects } from "./effects";
import { bindAllLinkHovers } from "./links";
import { NativeEffects } from "./types";
import { AutoNotateOptions, init as initConfig } from "./config";

export function run(params: AutoNotateOptions = {}) {

    $(() => {
        const options = initConfig(params);
        console.log("merged options", options);
        initEffects();
        bindAllLinkHovers();
    });
}
