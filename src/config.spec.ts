import { get, init, reset } from "./config";
import { NativeEffects } from "./types";

describe("config module", () => {
    describe("get()", () => {
        beforeEach(() => {
            init({
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
            });
        });

        afterEach(() => {
            reset();
        })

        it("returns the global context when called without a path", () => {
            expect(Object.keys(get() as any).includes("stuff"));
        });

        it("supports paths", () => {
            const stuff = get("stuff") as any;
            expect(stuff.something.color).toEqual("orange");
        });

        it("loads defaults (including but not limited to the `defaults` field)", () => {
            expect(Object.keys(get() as any).includes("defaults"));
        });
    });
});