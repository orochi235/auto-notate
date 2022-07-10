import * as RoughNotation from "rough-notation";
import $ from "jquery";
import { RoughAnnotation, RoughAnnotationConfig } from "rough-notation/lib/model";
import { AttribParserParams, EventTriggerType, Options } from "./types";
import {
    getDefaultsForEffect,
    getEffectsFromClassList,
} from "./effects";
import { config } from "./config";

type EventHandler = {
    event: EventTriggerType;
    bind: (element: HTMLElement, options: Options) => EventWatcher;
    updateWatcher?: (frame: EventWatcher, ...data: any) => void;
    advanceState?: (frame: EventWatcher, ...data: any) => void;
};
type EventMapping<T> = {
    [event in EventTriggerType]?: T;
}

type WatchMechanismForAppear = {
    observer?: IntersectionObserver;
    latest?: IntersectionObserverEntry;
}

type AnnotationState = "ready" | "played" | "done";
type WatchMechanism = JQuery<HTMLElement> | WatchMechanismForAppear;
type EventWatcher = {
    element: HTMLElement;
    trigger: EventTriggerType;
    state: AnnotationState;
    anno: RoughAnnotation;
    mechanism?: WatchMechanism;
    options?: Options;
};

type EventWatcherRegistry = {
    [type in EventTriggerType]?: EventWatcher[]
};

let _watchedElements: EventWatcherRegistry = {
    appear: [],
    hover: [],
    load: [],
};
// let _watchedElements: EventWatcher[] = [];

const appearWatcher = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            const frame = getWatchersForElement(entry.target, "appear")[0];
            updateWatcher(frame, entry, observer);
            advanceState(frame, entry, observer);
        });
        // entries.forEach(entry => updateWatchedElementForAppear(entry));
    }, {
        threshold: .8
    });

function getWatchersForElement(el: Element, type: EventTriggerType = null): EventWatcher[] {
    const source = type ? _watchedElements[type] : [
        ..._watchedElements.appear,
        ..._watchedElements.hover,
        ..._watchedElements.load,
    ];

    return source.filter(item => item.element === el);
}

function updateWatcher(frame: EventWatcher, ...data: any) {
    const callback = eventHandlers[frame.trigger].updateWatcher;
    callback.apply(null, [frame, ...data]);

    // advanceWatcherState([frame], data);
}

function advanceState(frame: EventWatcher, ...data: any) {
    const callback = eventHandlers[frame.trigger].advanceState;
    callback.apply(null, [frame, ...data]);
}

function initWatcher(element: HTMLElement,
                     trigger: EventTriggerType,
                     options: Options,
                     delay: number = 0,
                     mechanism?: WatchMechanism): EventWatcher {
    const effect = getEffectsFromClassList(element)[0];
    const builtOptions = Object.assign({}, getDefaultsForEffect(effect), options)
    const anno = RoughNotation.annotate(element, builtOptions);
    const out: EventWatcher = {
        element, trigger, anno, mechanism,
        options: builtOptions,
        state: "ready",
    };
    _watchedElements[trigger].push(out);
    return out;
}

function playEffect(effect: EventWatcher) {
    if (effect.state !== "ready") {
        console.warn("trying to play a watched effect that isn't in ready state");
        return;
    }

    console.debug("playing effect", effect)
    effect.anno.show();
    effect.state = "played";
}

function stopEffect(effect: EventWatcher) {
    if (effect.state !== "played") {
        console.warn("trying to stop a watched effect that isn't in played state");
        return;
    }

    console.debug("stopping effect", effect)
    if (effect.options._repeat) {
        effect.anno.hide();
        effect.state = "ready";
    } else {
        effect.state = "done";
    }
}

const eventHandlers: EventMapping<EventHandler> = {
    appear: {
        // triggers when an element scrolls into view. if the element is already in view, triggers immediately
        event: "appear",
        // TODO: MIKE: this should be the default behavior for anything with no trigger specified (other than links)
        bind: (element, options) => {
            appearWatcher.observe(element);
            return initWatcher(element, "appear", options, options._delay ?? 0, { observer: appearWatcher });
        },
        updateWatcher: (frame, entry: IntersectionObserverEntry) => {
            (frame.mechanism as WatchMechanismForAppear).latest = entry;
        },
        advanceState: (frame, entry: IntersectionObserverEntry) => {
            if (frame.state === "done") return;

            const mechanism = frame.mechanism as WatchMechanismForAppear;
            if (frame.state === "ready" && mechanism.latest.isIntersecting) {
                playEffect(frame);
            }
            if (frame.state === "played" && !mechanism.latest.isIntersecting) {
                stopEffect(frame);
            }
        }
    },
    hover: {
        event: "hover",
        bind: (element, options) => {
            const frame = initWatcher(element, "hover", options, options._delay ?? 0);
            frame.mechanism = $(element).on("mouseenter", (ev) => {
                playEffect(frame);
                $(element).one("mouseleave", (ev) => {
                    stopEffect(frame);
                })
            });
            return frame;
        }
    },
    // load: {
    //     event: "load",
    //     bind: element => {
    //
    //         // TODO: MIKE:
    //     }
    // },

};

export const EventAttributeParsers: { [param: string]: AttribParserParams } = {
    // n.b. also uses delay from the base set
    repeat: ["repeat", "_repeat", (attrib, el, options) => {
        return !["false", "0"].includes(attrib);
    }],
    trigger: ["trigger", "_trigger", (attrib: EventTriggerType, el, options) => {
        if (options._repeat === undefined) {
            options._repeat = config.events[attrib].repeat as boolean;
        }
        return eventHandlers[attrib as EventTriggerType].bind(el, options);
    }],
};
