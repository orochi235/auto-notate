import * as RoughNotation from "rough-notation";
import $ from "jquery";
import { RoughAnnotation, RoughAnnotationConfig } from "rough-notation/lib/model";
import { AttribParserParams, Options } from "./types";
import {
    getDefaultsForEffect,
    getEffectsFromClassList,
} from "./effects";

type EventTriggerType = "hover" | "appear" | "load";

type EventHandler = {
    event: EventTriggerType;
    bind: (element: HTMLElement, options: {}) => void;
};
type EventMapping<T> = {
    [event in EventTriggerType]?: T;
}

type AnnotationState = "ready" | "played";

// TODO: MIKE: state machine?
type WatchedEventTrigger = {
    element: HTMLElement;
    event: EventTriggerType;
    state: AnnotationState;
    anno: RoughAnnotation;
    options?: Options;
};

let _watchedElements: WatchedEventTrigger[] = [];

function getWatchedElement(el: Element, list: WatchedEventTrigger[] = _watchedElements): WatchedEventTrigger {
    return list.find(item => item.element === el);
}

function updateWatchedElement(entry: IntersectionObserverEntry) {

    console.log("WATCHED ELEMENTS", _watchedElements);
    console.log("ENTRY", entry);

    const frame = getWatchedElement(entry.target); // TODO: MIKE: any reason not to support multiples?
    if(!frame) throw new Error("couldn't find effect frame for element " + entry.target);
    if (frame.state === "ready" && entry.isIntersecting) {
        playEffect(frame);
    }
    if (frame.state === "played" && !entry.isIntersecting) {
        stopEffect(frame);
    }
}

function watchElement(element: HTMLElement, event: EventTriggerType, options: Options): WatchedEventTrigger {
    const effect = getEffectsFromClassList(element)[0];
    const builtOptions = Object.assign({}, getDefaultsForEffect(effect), options)

    const anno = RoughNotation.annotate(element, options as RoughAnnotationConfig);
    const out: WatchedEventTrigger = {
        element, event, anno,
        options: builtOptions,
        state: "ready",
    };
    _watchedElements.push(out);
    return out;
}

function playEffect(effect: WatchedEventTrigger) {
    if (effect.state !== "ready") {
        console.warn("trying to play a watched effect that isn't in ready state");
        return;
    }
    effect.anno.show();
    effect.state = "played";
}
function stopEffect(effect: WatchedEventTrigger) {
    if (effect.state !== "played") {
        console.warn("trying to stop a watched effect that isn't in played state");
        return;
    }
    effect.anno.hide();
    effect.state = "ready";
}

const appearWatcher = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => updateWatchedElement(entry));
    }, {
        threshold: .8
    });

const eventHandlers: EventMapping<EventHandler> = {
    appear: {
        // triggers when an element scrolls into view. if the element is already in view, triggers immediately
        event: "appear",
        bind: (element, options) => {
            appearWatcher.observe(element);
            watchElement(element, "appear", options);
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
    },
    load: {
        event: "load",
        bind: element => {

            // TODO: MIKE:
        }
    },

};

export const EventAttributeParsers: { [param: string]: AttribParserParams } = {
    trigger: ["trigger", "_trigger", (attrib: EventTriggerType, el, options) => {
        console.log("parsing trigger attrib", attrib, el, options)
        return eventHandlers[attrib as EventTriggerType].bind(el, options);
    }],
};

export const init = (type: EventTriggerType) => {
    // const selector = `[data-effect-trigger${type && "=" + type}`;
    // const sel = $(selector);
    // console.log("SELECTED EVENT ELEMENTS", sel);
    // for (const el of sel) {
    //     const options = buildOptionsForElement(el);
    //     watchElement(el, type, options);
    // }
}


