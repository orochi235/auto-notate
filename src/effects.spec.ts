import $ from "jquery";
import { getEffectsFromClassList } from "./effects";

describe("getEffectsFromClassList()", () => {
    beforeEach(() => {
        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: (target: Element): void => null,
            unobserve: (target: Element): void => null,
            disconnect: (): void => null,
        });
        global.window.IntersectionObserver = mockIntersectionObserver as any;
    })

    it("correctly detects multiple effects", () => {
        const el = $(`<div class="rn-effect-highlight rn-effect-circle" />`)[0];
        const effects = getEffectsFromClassList(el);
        expect(effects).toContain("highlight");
        expect(effects).toContain("circle");
    });
});