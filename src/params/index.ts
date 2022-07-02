// export * from "./groupName";

import {mapAttribToProperty} from "../util";
import {Options} from "../index";

type AttributeMapperResult = [string, string];
type AttributeMapper = (el: HTMLElement, options: Options) => AttributeMapperResult;

type ParserMap = {
    [prop: string]: AttributeMapper;
}


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
    // TODO: MIKE: moving group won't work as-is because it depends on a closure in index.ts
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

export default PARSERS;
