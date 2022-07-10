// @ts-ignore
import $ from "jquery";
import * as RoughNotation from "rough-notation";
import { RoughAnnotationConfig } from "rough-notation/lib/model";
import { config } from "./config";
import { Options } from "./types";

// TODO: MIKE: parse page meta tags for things like this? (and maybe selectors to use?)

export let _boundLinks: Element[] = [];

const LinkStyles: { [style: string]: Options } = config.links?.styles;

export function bindLinkHover(el: Element, preset = config.links.defaultStyle) {
    if (el.hasAttribute("data-link-hover-bound")) return;
    el.setAttribute("data-link-hover-bound", null);
    $(el).on("mouseenter",(ev) => {
        const anno = RoughNotation.annotate(ev.currentTarget as HTMLElement, config.links.styles[preset] as RoughAnnotationConfig);
        anno.show();
        ($(ev.target).one("mouseleave", () => {
            anno.hide();
        }))
    })
    _boundLinks.push(el);
}

function getLinkElements(): HTMLElement[] {
    const out: HTMLElement[] = [];

    const baseSelector = config.links.detect ? "a" : "a.rn-effect-link-hover";
    const ignoreWhen = config.links.ignoreWhen ?? (() => false);
    for (const el of $(baseSelector)) {
        if (ignoreWhen(el)) continue;
        if (isTextualLink(el)) out.push(el);
    }
    return out;
}

export function hasAncestor(el: HTMLElement, selector: string): boolean {
    if (el.matches(selector)) return true;
    if (el.parentElement === null) return false;
    return hasAncestor(el.parentElement, selector);
}

export function isTextualLink(node: Node, isChildQuery = false): boolean {
    const ELEMENT_WHITELIST = ["a", "b", "i", "u", "strong", "em", "span"];

    // TODO: MIKE: clean this logic up
    // TODO: MIKE: support "opt-out" data attribute?

    if (!isChildQuery) {
        // ensure the root element we've been passed is <a>
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        if ((node as HTMLElement).tagName !== "A") return false;
    }

    if (isChildQuery && node.nodeType === Node.TEXT_NODE) return true;

    // TODO: MIKE: potential things to check: inline[-block]?, element height,
    // if (node.childNodes.length === 1 && node.firstChild.nodeType === Node.TEXT_NODE) return true; // contains just a text node
    if (![Node.ELEMENT_NODE, Node.TEXT_NODE, Node.COMMENT_NODE].includes(node.nodeType)) return false;

    // disallow elements that aren't in the whitelist:
    if (node.nodeType === Node.ELEMENT_NODE && !ELEMENT_WHITELIST.includes((node as HTMLElement).tagName.toLowerCase())) return false;

    return Array.from(node.childNodes).map(node => isTextualLink(node, true)).every(x => !!x);
}

export function bindAllLinkHovers() {
    const links = getLinkElements();
    for (const el of links) {
        bindLinkHover(el, el.getAttribute("data-effect-link-style") ?? undefined);
    }
}

export function unbindAll() {
    for (const el of _boundLinks) {
        $(el).off();
    }
    _boundLinks = [];
}

export default {
    LinkStyles,
    bindLinkHover,
    bindAllLinkHovers,
};
