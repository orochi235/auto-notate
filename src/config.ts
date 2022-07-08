import { NativeEffects } from "./types";
import { RoughAnnotationConfig } from "rough-notation/lib/model";

type AutoNotateSelector = string;
type EffectMapping<T> = { [key in NativeEffects | string]: T };

export type AutoNotateOptions = {
    detectTextLinks?: boolean;
    defaults?: Partial<EffectDefaults>;
} & OptionsHash;


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

type OptionsPrimitive = string | number | null | boolean;
type OptionsField = OptionsPrimitive | OptionsHash | Array<OptionsField>;
type OptionsHash = {
    [key: string]: OptionsField;
}


let _globalOptions: OptionsHash & AutoNotateOptions = {};


const DEFAULT_OPTIONS: AutoNotateOptions = {
    detectTextLinks: true,
    defaults: {
        highlight: {
            type: "highlight",
            color: "rgba(255, 207, 11, .4)",
            multiline: true,
        },
    }
}

function generateOptions(userOptions: AutoNotateOptions): OptionsHash {
    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
}

export function get(path: string = null, context: OptionsHash = _globalOptions): OptionsHash {
    if (path) {
        const pattern = /^([^.]+)\.?(.*)?$/;
        const tokens = pattern.exec(path);
        return get(tokens[2], context[tokens[1]] as OptionsHash);
    }
    else return context;
}

export function init(userOptions: OptionsHash): OptionsHash {
    _globalOptions = generateOptions(userOptions);
    return _globalOptions;
}

/**
 * nuke all active settings. intended mainly for testing.
 */
export function reset() {
    _globalOptions = {};
}
