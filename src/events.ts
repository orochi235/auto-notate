import * as RoughNotation from "rough-notation";
import $ from "jquery";
import {
    RoughAnnotation,
    RoughAnnotationConfig,
    RoughAnnotationGroup,
} from "rough-notation/lib/model";
import { AttribParserParams, Options } from "./types";
import { buildOptionsForElement, runEffect } from "./effects";
/*

PLANS:

data-bind-events-on: comma-delimited list of events that trigger the effect
data-bind-events-off: comma-delimited list of events that trigger the effect
limit to the number of times it'll go off (even if just support for once)?





 */

type EventTriggerType = "hover" | "appear";

type EventHandler = {
    event: EventTriggerType;
    bind: (element: HTMLElement, options: {}) => void;
};
type EventMapping<T> = {
    [event in EventTriggerType]?: T;
}

let _watchedElements: Element[] = [];

function triggerWatchedElement(element: HTMLElement) {
    // TODO: MIKE: also use this to reverse animations of things that used to be in scope but aren't anymore?
    if (!_watchedElements.includes(element)) throw new Error('tried to trigger an element that isn\'t being watched:' + element);
    runEffect(element, buildOptionsForElement(element));
    _watchedElements = _watchedElements.filter(item => item !== element);
}

const appearWatcher = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) triggerWatchedElement(entry.target as HTMLElement);
        // TODO: MIKE: reverse this when it goes offscreen so we can toggle it again?
    })
}, {
    threshold: .8
});

const eventHandlers: EventMapping<EventHandler> = {
    appear: {
        // triggers when an element scrolls into view. if the element is already in view, triggers immediately
        event: "appear",
        bind: (element) => {
            appearWatcher.observe(element);
            _watchedElements.push(element);
        }
    },
    hover: {
        event: "hover",
        bind: (element) => {
            console.log("binding", element, "on mouseenter");
            $(element).on("mouseenter", (ev) => {
                // TODO: MIKE: bind hover here
                $(element).one("mouseleave", (ev) => {
                    // TODO: MIKE: unbind hover here
                })
            });
        }
    }
};

export const EventAttributeParsers: {[param: string]: AttribParserParams} = {
    trigger: ["trigger", "_trigger", (attrib: EventTriggerType, el, options) => {
        console.log("parsing trigger attrib", attrib, el, options)
        eventHandlers[attrib as EventTriggerType].bind(el, options);
    }],
};
