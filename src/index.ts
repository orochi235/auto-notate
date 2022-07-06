// @ts-ignore
import $ from "jquery";
import { defaults } from "lodash";
import { initEffects } from "./effects";
import { bindAllLinkHovers } from "./links";
import { NativeEffects } from "./types";
import { RoughAnnotationConfig } from "rough-notation/lib/model";

type AutoNotateSelector = string;
type EffectMapping<T> = { [key in NativeEffects]: T };

type AutoNotateSelectors = {
    [key in keyof NativeEffects]?: AutoNotateSelector;
};

type AutoNotateEffect = {
    name: keyof NativeEffects;
    defaults?: RoughAnnotationConfig;
    selectors?: AutoNotateSelector[];
}

type AutoNotateEffectParams = {
    [key in keyof NativeEffects]?: AutoNotateSelector;

}

type EffectDefaults = EffectMapping<RoughAnnotationConfig>;

export type AutoNotateOptions = {
    detectTextLinks?: boolean;
    defaults?: Partial<EffectDefaults>;
};

const DEFAULT_OPTIONS: AutoNotateOptions = {
    detectTextLinks: false,
    defaults: {
        highlight: {
            type: "highlight",
            color: "rgba(255, 207, 11, .4)"
        },
    }
}

function generateOptions(userOptions: AutoNotateOptions): AutoNotateOptions {
    return defaults(userOptions, DEFAULT_OPTIONS);
}

export function run(params: AutoNotateOptions = {}) {
    const options = generateOptions(params);
    console.log("merged options", options);
    $(() => {
        initEffects();
        bindAllLinkHovers();
    });
}
