import { TestEnvironment } from "jest-environment-jsdom";
import { readFileSync } from "node:fs";
import * as jsdom from "jsdom";
import jq from "jquery";

// Custom test environment copied from https://github.com/jsdom/jsdom/issues/2524
// in order to add TextEncoder to jsdom. TextEncoder is expected by jose.

const { JSDOM } = jsdom;
const SAMPLE_DOM = readFileSync("./src/tests/template.html");

//destructure window object from JSDOM
const { window } = new JSDOM(SAMPLE_DOM, {
    contentType: "text/html",
    includeNodeLocations: true,
    resources: "usable",
    storageQuota: 10000000,
    runScripts: "dangerously"
});
const $ = jq(window);
class CustomTestEnvironment extends TestEnvironment {
    async setup() {
        await super.setup();
        if (typeof this.global.TextEncoder === "undefined") {
            const { TextEncoder, TextDecoder } = require("util");
            this.global.TextEncoder = TextEncoder;
            this.global.TextDecoder = TextDecoder;
            this.global.ArrayBuffer = ArrayBuffer;
            this.global.Uint8Array = Uint8Array;
        }
        this.global.$ = $;
        this.global.jQuery = $;
    }
}

export default CustomTestEnvironment;
