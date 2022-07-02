import $ from "jquery";
import { initEffects } from "./effects";
import { bindAllLinkHovers } from "./links";

export function run() {
    $(() => {
        initEffects();
        bindAllLinkHovers();
    });
}
