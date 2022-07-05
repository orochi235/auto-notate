import { bindAllLinkHovers, _boundLinks } from "./links";
import $ from "jquery";

const TEST_DOM = `
<div>
    <a href="#">leave me alone</a>
    <a href="#" class="rn-effect-link-hover">oh hi mr.</a>
    <a href="#" class="rn-effect-link-hover" data-effect-link-style="angry">choke me daddy</a>
</div>
`;

$(TEST_DOM).appendTo(document.body);

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
