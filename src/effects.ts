import { Options } from "./index";

export const DefaultEffectOptions: { [style: string]: Options } = {
    highlight: {
        type: "highlight",
        color: "rgba(255, 207, 11, .4)"
    },
};

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
