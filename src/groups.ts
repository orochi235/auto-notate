import * as RoughNotation from "rough-notation";
import {
  RoughAnnotation,
  RoughAnnotationConfig,
  RoughAnnotationGroup,
} from "rough-notation/lib/model";
import { AttribParserParams, Options } from "./types";

export type Group = Array<{ el: HTMLElement; options: Options }> & {
  anno?: RoughAnnotationGroup;
  effects?: RoughAnnotation[];
};
export type Groups = {
  [groupName: string]: Group;
};
type PreGroupedElement = {
  el: HTMLElement,
  options: {},
};

const _rawGroupedElements: PreGroupedElement[] = []; // we dump everything that comes through register() into here
const _allGroups: Groups = {}; // internal registry of groups we've created

function runGroup(name: string, group: Group) {
  const sortedGroup = [...group].sort(
    (a, b) => a.options._groupIndex - b.options._groupIndex
  );
  const effects = [];

  for (const member of sortedGroup) {
    effects.push(
      RoughNotation.annotate(member.el, member.options as RoughAnnotationConfig)
    );
  }
  group.anno = RoughNotation.annotationGroup(effects);
  group.anno.show();
  group.effects = effects;

  _allGroups[name] = group;
}

export function init(groups: Groups = _allGroups) {
  for (const groupName of Object.keys(groups)) {
    runGroup(groupName, groups[groupName]);
  }
}

export function register(el: HTMLElement, options: {}) {
  _rawGroupedElements.push({el, options});
}

export const GroupAttributeParsers: {[param: string]: AttribParserParams} = {
  groupName: [
    "group",
    "_groupName",
    (attrib) => attrib.split("/")[0]
  ],
  groupIndex: ["group", "_groupIndex", (attrib) =>
    parseInt(attrib.split("/")[1], 10)
  ],
  group: ["group", "_group", (attrib, el, options) => {
    const [groupName] = attrib.split("/");
    let group = _allGroups[groupName];
    if (group === undefined) {
      _allGroups[groupName] = [];
      group = _allGroups[groupName];
    }
    group.push({ el, options });
    return undefined;
  }]
};
