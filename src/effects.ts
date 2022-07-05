import $ from "jquery";
import * as RoughNotation from "rough-notation";
import { RoughAnnotationConfig, RoughAnnotationType } from "rough-notation/lib/model";
import { NativeEffects, Options } from "./types";
import { parseAttributesForElement } from "./attribs";
import { register as registerAsGroupMember, init as initGroupEffects } from './groups';

const _allEffects = [];

export const VirtualEffectNames = [
    "link-hover",
];

const NativeEffectNames = [];
for (const effect in NativeEffects) NativeEffectNames.push(effect);

export const AllEffectNames = [
    ...NativeEffectNames,
    ...VirtualEffectNames,
]

export const DefaultEffectOptions: { [style: string]: Options } = {
    highlight: {
        type: "highlight",
        color: "rgba(255, 207, 11, .4)"
    },
};


const buildSelector = (type: string) => `.rn-effect-${type}`;

const buildOptions = (effect: RoughAnnotationType, el: HTMLElement): Options => {
    const defaults = DefaultEffectOptions[effect] || {} as Options;
    const out = parseAttributesForElement(el, defaults);
    out.type = effect;
    return out;
};

export const initEffects = () => {
    for (const effectName in NativeEffects) {
        const e = $(buildSelector(effectName));
        for (const el of e) {
            const options = buildOptions(effectName as RoughAnnotationType, el);
            console.log('element', el, options);
            if (!options._groupName) runEffect(el, options);
            else registerAsGroupMember(el, options);
        }
    }
    initGroupEffects();
};

export const runEffect = (el: HTMLElement, options: Options) => {
    const anno = RoughNotation.annotate(el, options as RoughAnnotationConfig);
    if (options._delay) {
        setTimeout(() => {
            anno.show();
        }, options._delay * 1000);
    } else {
        anno.show();
    }
    _allEffects.push(anno);
};
