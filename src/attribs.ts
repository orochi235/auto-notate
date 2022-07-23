import { AttribParserCallback, AttribParserParams, AttributeMapper, AttributeParserCallbackResult } from "./types";
import { Options, ParserMap } from "./types";
import { EventAttributeParsers } from "./events";
import { GroupAttributeParsers } from "./groups";

const PARSERS: ParserMap = {
    animate: mapAttribToProperty("animate", "animate", (a) => !(a.toLowerCase() === "false")),
    brackets: mapAttribToProperty("brackets", "brackets", a => a.split(',').map(b => b.trim())),
    color: mapAttribToProperty("color"),
    delay: mapAttribToProperty("delay", "_delay", a => parseFloat(a) * 1000),
    duration: mapAttribToProperty("duration", "animationDuration", a => parseFloat(a) * 1000),
    iterations: mapAttribToProperty("iterations", "iterations", parseFloat),
    // "link-style": handled externally
    multiline: mapAttribToProperty("multiline", "multiline", (a) => a !== undefined),
    padding: mapAttribToProperty("padding", "padding", parseFloat),
    strokeWidth: mapAttribToProperty("stroke-width", "strokeWidth"),
    rtl: mapAttribToProperty("reverse", "rtl", (a) => a !== undefined),
    ...buildParsers(GroupAttributeParsers),
    ...buildParsers(EventAttributeParsers),
    params: mapAttribToProperty("params", null, parseJsonParams),   // TODO: MIKE: this blows to use. remove?
};

function buildParsers(params: {[paramName: string]: AttribParserParams}) {
    const out: ParserMap = {};
    for (const paramName in params) {
        out[paramName] = mapAttribToProperty.apply(null, params[paramName]);
    }
    return out;
}

export function mapAttribToProperty(attribName: string,
                                    propName: string = attribName,
                                    fn: AttribParserCallback = (a) => a,
): AttributeMapper {
    return (el, options) => {
        if (el.hasAttribute(`data-effect-${attribName}`)) {
            const attrib = el.getAttribute(`data-effect-${attribName}`);
            return [propName, fn(attrib, el, options)];
        }
    };
}

function parseJsonParams(value: string) {
    return JSON.parse(value);
}

export function parseAttributesForElement(el: HTMLElement, options: Options = {}): Options {
    options = { ...options };

    for (const prop of Object.keys(PARSERS)) {
        const result: AttributeParserCallbackResult = PARSERS[prop](el, options);
        if (result) {
            options[result[0]] = result[1];
        }
    }

    return options;
}
