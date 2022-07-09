import { RoughAnnotationConfig } from "rough-notation/lib/model";
import { NativeEffects } from "./types";
import Defaults from "./defaults";

type EffectMapping<T> = { [key in NativeEffects | string]?: T };

export type ElementFilter = (el: HTMLElement) => boolean;

export type AutoNotateLinkOptions = {
    detect?: boolean;
    ignoreWhen?: ElementFilter;
    defaultStyle?: keyof AutoNotateLinkOptions["styles"] & string;
    styles?: {
        [style: string]: Partial<RoughAnnotationConfig>;
    };
};

export type AutoNotateOptions = {
    links?: AutoNotateLinkOptions;
    effects?: Partial<EffectDefaults>;
} & OptionsHash;

export type EffectDefaults = EffectMapping<Partial<RoughAnnotationConfig> & OptionsHash>;

type OptionsPrimitive = string | number | null | boolean | Function;
export type OptionsHash = {
    [key: string]: OptionsPrimitive | OptionsHash;
};

let _globalOptions: OptionsHash & AutoNotateOptions = {};

function generateGlobalEffectDefaults(userDefaults: EffectDefaults = {}): EffectDefaults {
    const out: EffectDefaults = {};
    for (const key in Defaults.effects) {
        out[key] = Object.assign(
            {},
            Defaults.effects[key] ?? {} as RoughAnnotationConfig,
            userDefaults[key] ?? {} as RoughAnnotationConfig
        ) as RoughAnnotationConfig & OptionsHash;
    }
    return out;
}

function generateGlobalLinkDefaults(userDefaults: AutoNotateLinkOptions): AutoNotateLinkOptions {
    const out: AutoNotateLinkOptions = Object.assign({}, Defaults.links, userDefaults);
    out.styles = Object.assign({}, Defaults.links.styles ?? {}, userDefaults.styles ?? {});
    return out;
}

function generateGlobalOptions(userOptions: AutoNotateOptions): OptionsHash {
    return {
        effects: generateGlobalEffectDefaults(userOptions.effects),
        links: generateGlobalLinkDefaults(userOptions.links ?? {}) as OptionsHash,
    }
}

function get(path: string = null, context: OptionsHash = _globalOptions): OptionsHash {
    if (path) {
        const pattern = /^([^.]+)\.?(.*)?$/;
        const tokens = pattern.exec(path);
        return get(tokens[2], context[tokens[1]] as OptionsHash);
    }
    else return context;
}

function init(userOptions: OptionsHash): OptionsHash {
    _globalOptions = generateGlobalOptions(userOptions);
    return _globalOptions;
}

function initExport() {
    return {
        get all() {
            return _globalOptions;
        },
        get effects(): EffectDefaults {
            return _globalOptions.effects;
        },
        get(path: string = null, context: OptionsHash = _globalOptions): OptionsHash {
            return get(path, context);
        },
        init(userOptions: OptionsHash): OptionsHash {
            return init(userOptions);
        },
        get links(): AutoNotateLinkOptions {
            return _globalOptions.links;
        }
    };
}

export const config = initExport();
export default config;
