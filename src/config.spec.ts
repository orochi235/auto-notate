import { config } from "./config";
import { NativeEffects } from "./types";

const DEFAULTS = {
    // TODO: MIKE: this isn't even valid because this isn't at all what that struct looks like
    stuff: {
        something: {
            type: "spiny",
            color: "orange"
        },
        otherThing: {
            type: "frilled",
            color: "green",
            proclivities: {
                morning: "sleep",
                night: "sleep",
                leapYear: "party",
            }
        }
    }
};

describe("config module", () => {
    describe("get()", () => {
        beforeEach(() => {
            config.init(DEFAULTS);
        });

        it("returns the global context when called without a path", () => {
            expect(Object.keys(config.get).includes("stuff"));
        });

        it("loads defaults (including but not limited to the `effects` field)", () => {
            expect(Object.keys(config.get).includes("effects"));
        });
    });
});