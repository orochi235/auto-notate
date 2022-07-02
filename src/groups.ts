import * as RoughNotation from "rough-notation";
import {
  RoughAnnotation,
  RoughAnnotationConfig,
  RoughAnnotationGroup,
} from "rough-notation/lib/model";
import { Options } from "./types";
import { mapAttribToProperty } from "./attribs";

export type Group = Array<{ el: HTMLElement; options: Options }> & {
  anno?: RoughAnnotationGroup;
  effects?: RoughAnnotation[];
};
export type Groups = {
  [groupName: string]: Group;
};

// internal registry of groups we've created
const _allGroups: Groups = {};

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

export function init(groups: Groups) {
  for (const groupName of Object.keys(groups)) {
    runGroup(groupName, groups[groupName]);
  }
}

export const GroupAttributeParsers = {
  groupName: mapAttribToProperty(
    "group",
    "_groupName",
    (attrib) => attrib.split("/")[0]
  ),
  groupIndex: mapAttribToProperty("group", "_groupIndex", (attrib) =>
    parseInt(attrib.split("/")[1], 10)
  ),
  group: mapAttribToProperty("group", "_group", (attrib, el, options) => {
    const [groupName] = attrib.split("/");
    let group = _allGroups[groupName];
    if (group === undefined) {
      _allGroups[groupName] = [];
      group = _allGroups[groupName];
    }
    group.push({ el, options });
    return undefined;
  }),
};
