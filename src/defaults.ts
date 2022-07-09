import { AutoNotateOptions } from "./config";

const out: AutoNotateOptions = {
    links: {
        detect: false,
        ignoreWhen: (el) => false,
        defaultStyle: "double",
        styles: {
            double: { // TODO: MIKE: support arrays here containing multiple effects
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
    },
    effects: {
        box: {},
        bracket: {},
        circle: {
            animationDuration: 3000,
        },
        "crossed-off": {
            animationDuration: 400,
        },
        highlight: {
            color: "rgba(255, 207, 11, .4)",
            multiline: true,
        },
        "strike-through": {},
        underline: {},
    }
}

export default out;
