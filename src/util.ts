import { RoughAnnotationConfig } from "rough-notation/lib/model";

export interface Options extends Partial<RoughAnnotationConfig> {
    // "link-style"?: string;
    _groupIndex?: number,
    _groupName?: string,
    _delay?: number,
}

export type AttributeMapperResult = any;
export type AttributeParserCallbackResult = [string, string | void] | void;
export type AttribParserCallback =
    (attrib: string, el: HTMLElement, options: Options) => AttributeParserCallbackResult
        | any;
export type AttributeMapper = (el: HTMLElement, options: Options) => AttributeMapperResult;

export function mapAttribToProperty(attribName: string,
                                    propName: string = undefined,
                                    fn: AttribParserCallback = () => {},
): AttributeMapper {
    if (propName === undefined) propName = attribName;
    return (el, options) => {
        if (el.hasAttribute(`data-effect-${attribName}`)) {
            const attrib = el.getAttribute(`data-effect-${attribName}`);
            return [propName, fn(attrib, el, options)];
        }
    };
}