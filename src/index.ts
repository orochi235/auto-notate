import * as RoughNotation from "rough-notation";
import * as $ from "jquery";
import { RoughAnnotation, RoughAnnotationConfig, RoughAnnotationType } from "rough-notation/lib/model";
import { DefaultEffectOptions, LinkStyles } from "./effects";
import { mapAttribToProperty } from "./util";

export interface Options extends Partial<RoughAnnotationConfig> {
    // "link-style"?: string;
    _groupIndex?: number,
    _groupName?: string,
    _delay?: number,
}

type AttributeMapperResult = any;
type AttributeParserCallbackResult = [string, string | void] | void;
// type AttributeParserCallbackResult = any;
type AttribParserCallback =
    (attrib: string, el: HTMLElement, options: Options) => AttributeParserCallbackResult
    | any;
type AttributeMapper = (el: HTMLElement, options: Options) => AttributeMapperResult;
type Group = Array<{ el: HTMLElement, options: Options }>;
type Groups = {
    [groupName: string]: Group;
}
type ParserMap = {
    [prop: string]: AttributeMapper;
}

const NATIVE_EFFECTS = [
    "underline",
    "box",
    "circle",
    "highlight",
    "strike-through",
    "crossed-off",
    "bracket",
];
// TODO: MIKE: scrape these from RoughAnnotationType?

const effectNames = [
    ...NATIVE_EFFECTS,
    "link-hover",
];

const DEFAULT_LINK_STYLE = "double";

const PARSERS: ParserMap = {
    animate: mapAttribToProperty("animate", "animate", (a) => !(a.toLowerCase() === "false")),
    brackets: mapAttribToProperty("brackets", "brackets", a => a.split(',').map(b => b.trim())),
    color: mapAttribToProperty("color"),
    delay: mapAttribToProperty("delay", "_delay", parseFloat),
    duration: mapAttribToProperty("duration", "animationDuration", a => parseFloat(a) * 1000),
    iterations: mapAttribToProperty("iterations", "iterations", parseFloat),
    // "link-style": handled externally
    multiline: mapAttribToProperty("multiline", "multiline", (a) => a !== undefined),
    padding: mapAttribToProperty("padding", "padding", parseFloat),
    strokeWidth: mapAttribToProperty("stroke-width", "strokeWidth"),
    rtl: mapAttribToProperty("reverse", "rtl", (a) => a !== undefined),
    groupName: mapAttribToProperty(
        "group",
        "_groupName",
        (attrib) => attrib.split("/")[0]
    ),
    groupIndex: mapAttribToProperty("group", "_groupIndex", (attrib) =>
        parseInt(attrib.split("/")[1], 10)
    ),
    group: mapAttribToProperty("group", "_group", (attrib, el, options) => {
        const [groupName] = attrib.split("/");
        let group = groups[groupName];
        if (group === undefined) {
            groups[groupName] = [];
            group = groups[groupName];
        }
        group.push({el, options});
        return undefined;
    })
};

const buildSelector = (type: string) => `.rn-effect-${type}`;
const groups: Groups = {};
const ungrouped = [];

const parseAttributes = (el: HTMLElement, options: Options = {}): Options => {
    options = {...options};

    for (const prop of Object.keys(PARSERS)) {
        const result: AttributeParserCallbackResult = PARSERS[prop](el, options);
        if (result) {
            options[result[0]] = result[1];
        }
    }

    return options;
};

function bindLinkHover(el: HTMLElement, preset = DEFAULT_LINK_STYLE) {
    if (el.hasAttribute("data-link-hover-bound")) return;
    el.setAttribute("data-link-hover-bound", null);
    $(el).on("mouseover",(ev) => {
        const anno = RoughNotation.annotate(ev.target as HTMLElement, LinkStyles[preset] as RoughAnnotationConfig);
        anno.show();
        ($(ev.target).one("mouseout", () => {
            anno.hide();
        }))
    })
}

function bindAllLinkHovers() {
    for (const el of $("a.rn-effect-link-hover")) {
        bindLinkHover(el, el.getAttribute("data-effect-link-style") ?? undefined);
    }
}

const buildOptions = (effect: RoughAnnotationType, el: HTMLElement): Options => {
    const defaults = DefaultEffectOptions[effect] || {} as Options;
    const out = parseAttributes(el, defaults);
    out.type = effect;
    return out;
};

const initEffects = () => {
    for (const effectName of NATIVE_EFFECTS) {
        const e = $(buildSelector(effectName));
        for (const el of e) {
            const options = buildOptions(effectName as RoughAnnotationType, el);
            if (!options._groupName) runEffect(el, options);
        }
    }
    runGroups();
};

const runEffect = (el: HTMLElement, options: Options) => {
    const anno = RoughNotation.annotate(el, options as RoughAnnotationConfig);
    if (options._delay) {
        setTimeout(() => {
            anno.show();
        }, options._delay * 1000);
    } else {
        anno.show();
    }
    ungrouped.push(anno);
};

function runGroup(group: Group) {
    const sortedGroup = [...group].sort((a, b) => a.options._groupIndex - b.options._groupIndex);
    const effects = [];

    for (const member of sortedGroup) {
        effects.push(RoughNotation.annotate(member.el, member.options as RoughAnnotationConfig));
        // member.effect = RoughNotation.annotate(member.el, member.options);
        // effects.push(member.effect);
    }
    const ag = RoughNotation.annotationGroup(effects);
    ag.show();
}

function runGroups() {
    for (const groupName of Object.keys(groups)) {
        runGroup(groups[groupName]);
    }
}

$(() => {
    initEffects();
    bindAllLinkHovers();
});
