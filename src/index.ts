// @ts-ignore
import $ from "jquery";
import { initEffects } from "./effects";
import { init as initEvents } from "./events";
import { bindAllLinkHovers } from "./links";
import { AutoNotateOptions, config } from "./config";

export function run(params: AutoNotateOptions = {}) {
    $(() => {
        config.init(params);
        initEffects();
        initEvents("appear");
        bindAllLinkHovers(); // TODO: MIKE: remove this once we can parse trigger attrib properly
    });
}
