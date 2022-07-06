import { RoughAnnotationConfig } from "rough-notation/lib/model";

export interface Options extends Partial<RoughAnnotationConfig> {
    [key: string]: any,
    _groupIndex?: number,
    _groupName?: string,
    _delay?: number,
}

export enum NativeEffects {
    underline = "underline",
    box = "box",
    circle = "circle",
    highlight = "highlight",
    "strike-through" = "strike-through",
    "crossed-off" = "crossed-off",
    bracket = "bracket"
}

export enum VirtualEffects {
    linkHover = "link-hover",
}

export type AttributeMapperResult = any;
export type AttributeParserCallbackResult = [string, string | void] | void;
export type AttribParserCallback =
    (attrib: string, el: HTMLElement, options: Options) => AttributeParserCallbackResult
        | any;
export type AttribParserParams = [string, string | undefined, AttribParserCallback];
export type AttributeMapper = (el: HTMLElement, options: Options) => AttributeMapperResult;
export type EffectGroup = Array<{ el: HTMLElement, options: Options }>;
export type EffectGroups = {
    [groupName: string]: EffectGroup;
}
export type ParserMap = {
    [prop: string]: AttributeMapper;
}
