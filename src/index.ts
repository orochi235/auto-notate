// @ts-ignore
import $ from "jquery";
import { initEffects } from "./effects";
import { bindAllLinkHovers } from "./links";
import { AutoNotateOptions, config } from "./config";

export function run(params: AutoNotateOptions = {}) {
    $(() => {
        config.init(params);
        initEffects();
        // TODO: MIKE: find way to independently start event triggers here (they get picked up by attrib parser atm)
        bindAllLinkHovers(); // TODO: MIKE: remove this once we can parse trigger attrib properly?
    });
}
