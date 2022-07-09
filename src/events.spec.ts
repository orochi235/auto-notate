import $ from "jquery";

const TEST_DOM = ``;

function buildFragment(fragment: string) {
    return $(fragment)[0];
}

describe("events", () => {
    beforeEach(() => {
        $(TEST_DOM).appendTo(document.body);
    });

    afterEach(() => {
        $("body > *").remove();
    })
    //
    // it("binds to marked links", () => {
    //     bindAllLinkHovers();
    //     expect(_boundLinks.length).toEqual(2);
    // });

    describe("`appear` event", () => {
        it("works", () => {
            // TODO: MIKE: mock intersectionobserver
            // TODO: MIKE: fire mock event
            // TODO: MIKE: verify state changes?
        });
    })
});
