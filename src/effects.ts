import $ from "jquery";
import * as RoughNotation from "rough-notation";
import { RoughAnnotation, RoughAnnotationConfig, RoughAnnotationType } from "rough-notation/lib/model";
import { NativeEffects, Options } from "./types";
import { parseAttributesForElement } from "./attribs";
import { register as registerAsGroupMember, init as initGroupEffects } from './groups';
import { config, OptionsHash } from "./config";

const _allEffects = [];

const NativeEffectNames = [];
for (const effect in NativeEffects) NativeEffectNames.push(effect);

const buildSelector = (type: string) => `.rn-effect-${type}`;

const buildOptions = (effect: RoughAnnotationType, el: HTMLElement): Options => {
    const out = parseAttributesForElement(el, config.effects[effect] ?? {});
    out.type = effect;
    return out;
};

/**
 * Wrapper for buildOptions that additionally infers the effect type from an attached class name.
 * @param el The element to be wrapped
 */
const buildOptionsForElement = (el: HTMLElement): Options => {
    const effect = getEffectsFromClassList(el)[0] || "";
    return buildOptions(effect as RoughAnnotationType, el);
};

export const initEffects = () => {
    for (const effectName in NativeEffects) {
        const e = $(buildSelector(effectName));
        for (const el of e) {
            const options = buildOptions(effectName as RoughAnnotationType, el);
            if (options._groupName) registerAsGroupMember(el, options);
            else {
                if (!el.hasAttribute("data-effect-trigger")) runEffect(el, options);
            }
        }
    }
    initGroupEffects();
};

const initEffect = (el: HTMLElement, options: Options = {}): RoughAnnotation => {
    // TODO: MIKE: integrate defaults
    // TODO: MIKE: build options hash here
    console.log("initEffect options", buildOptionsForElement(el));
    return RoughNotation.annotate(el, options as RoughAnnotationConfig);
}

export const runEffect = (el: HTMLElement, options: Options = {}): RoughAnnotation => {
    // TODO: MIKE: do init outside of here
    const anno = initEffect(el, options);
    if (options._delay) {
        setTimeout(() => {
            anno.show();
        }, options._delay * 1000);
    } else {
        anno.show();
    }
    _allEffects.push(anno);
    return anno;
};

export function getDefaultsForEffect(effect: RoughAnnotationType): OptionsHash {
    return config.effects[effect] ?? {};
}

export const getEffectsFromClassList = (el: Element): NativeEffects[] => {
    const prefix = "rn-effect-"
    const classes = Array.from(el.classList).filter(cl => cl.substr(0, prefix.length) === prefix);
    const pattern = /^rn-effect-(.+)$/;
    return classes.map(cl => pattern.exec(cl)[1] as NativeEffects);
}
