// @ts-ignore
import $ from "jquery";
import * as RoughNotation from "rough-notation";
import { RoughAnnotationConfig } from "rough-notation/lib/model";
import { Options } from "./types";

const DEFAULT_LINK_STYLE = "double";

export const _boundLinks: Element[] = [];

export const LinkStyles: { [style: string]: Options } = {
    double: {
        type: "highlight",
        color: "rgba(255, 209, 59, .6)",
        animationDuration: 500,
        iterations: 2,
        multiline: true,
    },
    angry: {
        type: "highlight",
        color: "rgba(255, 100, 100, .1)",
        animationDuration: 4000,
        iterations: 33,
        multiline: true,
    },
    quick: {
        type: "highlight",
        color: "rgba(255, 209, 59, .8)",
        animationDuration: 100,
        iterations: 1,
        multiline: true,
    },
}

export function bindLinkHover(el: Element, preset = DEFAULT_LINK_STYLE) {
    if (el.hasAttribute("data-link-hover-bound")) return;
    el.setAttribute("data-link-hover-bound", null);
    $(el).on("mouseover",(ev) => {
        const anno = RoughNotation.annotate(ev.target as HTMLElement, LinkStyles[preset] as RoughAnnotationConfig);
        anno.show();
        ($(ev.target).one("mouseout", () => {
            anno.hide();
        }))
    })
    _boundLinks.push(el);
}

export function bindAllLinkHovers() {
    for (const el of $("a.rn-effect-link-hover")) {
        bindLinkHover(el, el.getAttribute("data-effect-link-style") ?? undefined);
    }
}

export default {
    LinkStyles,
    bindLinkHover,
    bindAllLinkHovers,
};
