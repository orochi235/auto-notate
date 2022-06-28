const effectNames = [
    "underline",
    "box",
    "circle",
    "highlight",
    "strike-through",
    "crossed-off",
    "bracket"
];

const PARSERS = {
    animate: mapAttribToProperty("animate", "animate", (a) => !a.toLowerCase() === "false"),
    brackets: mapAttribToProperty("brackets", "brackets", a => a.split(',').map(b => b.trim())),
    color: mapAttribToProperty("color"),
    delay: mapAttribToProperty("delay", "_delay", parseFloat),
    duration: mapAttribToProperty("duration", "animationDuration", a => parseFloat(a) * 1000),
    iterations: mapAttribToProperty("iterations", "iterations", parseFloat),
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

function mapAttribToProperty(attribName, propName, fn = (a) => a) {
    if (propName === undefined) propName = attribName;
    return (el, options) => {
        if (el.hasAttribute(`data-effect-${attribName}`)) {
            const attrib = el.getAttribute(`data-effect-${attribName}`);
            return [propName, fn(attrib, el, options)];
        }
    };
}

const buildSelector = (type) => `.rn-effect-${type}`;
const groups = {};
const ungrouped = [];

const effectOptions = {
    highlight: {
        type: "highlight",
        color: "rgba(255, 207, 11, .4)"
    }
};

const parseAttributes = (el, options = {}) => {
    options = {...options};

    for (const prop of Object.keys(PARSERS)) {
        const result = PARSERS[prop](el, options);
        if (result) {
            options[result[0]] = result[1];
        }
    }

    return options;
};

const buildOptions = (effect, el) => {
    const defaults = effectOptions[effect] || {};
    const out = parseAttributes(el, defaults);
    out.type = effect;
    return out;
};

const initEffects = () => {
    for (const effectName of effectNames) {
        const e = document.querySelectorAll(buildSelector(effectName));
        for (const el of e) {
            const options = buildOptions(effectName, el);
            if (!options._groupName) runEffect(el, options);
        }
    }
    runGroups();
};

const runEffect = (el, options) => {
    const anno = RoughNotation.annotate(el, options);
    if (options._delay) {
        setTimeout(() => {
            anno.show();
        }, options._delay * 1000);
    } else {
        anno.show();
    }
};

function runGroup(group) {
    const sortedGroup = [...group].sort((a, b) => a.options._groupIndex - b.options._groupIndex);
    const effects = [];

    for (const member of sortedGroup) {
        member.effect = RoughNotation.annotate(member.el, member.options);
        effects.push(member.effect);
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
});
