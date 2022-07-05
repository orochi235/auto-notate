import { bindAllLinkHovers, _boundLinks, isTextualLink } from "./links";
import $ from "jquery";

const TEST_DOM = `
<div>
    <a href="#">leave me alone</a>
    <a href="#" class="rn-effect-link-hover">oh hi mr.</a>
    <a href="#" class="rn-effect-link-hover" data-effect-link-style="angry">choke me daddy</a>
</div>
`;

$(TEST_DOM).appendTo(document.body);

function buildFragment(fragment: string) {
  return $(fragment)[0];
}

describe("link hovers", () => {
  it("jquery works", () => {
    expect(
      window.document.querySelectorAll("a.rn-effect-link-hover").length
    ).toEqual(2);
    expect(
      $("a.rn-effect-link-hover").length
    ).toEqual(2);
  });

  it("binds to marked links", () => {
    bindAllLinkHovers();
    expect(_boundLinks.length).toEqual(2);
  });
});

describe("textual link detection", () => {
  it("supports <a>text</a>", () => {
    expect(isTextualLink(buildFragment("<a>text</a>"))).toEqual(true);
  });

  it("supports nested whitelisted elements", () => {
    expect(isTextualLink(buildFragment("<a>acclaimed novel <i>twilight: breaking dawn</i></a>"))).toEqual(true);
    expect(isTextualLink(buildFragment("<a>i <i>really, <b>really</b>, <strong>really</strong></i> mean it <em>this</em> time!</em></a>"))).toEqual(true);
  });

  it("rejects things that aren't links", () => {
    expect(isTextualLink(buildFragment("<div>want to buy some nft's?</div>"))).toEqual(false);
  })

  it("rejects links that contain non-whitelisted child elements", () => {
    expect(isTextualLink(buildFragment("<a><img /></a>"))).toEqual(false);
  })
})
