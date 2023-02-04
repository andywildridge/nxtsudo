import {
  indexToRow,
  indexToCol,
  indexToBox,
  indexToSegH,
  indexToSegV,
} from "./indexTransforms";
import { CollectionsNumbers } from "./collections";

export const processPossibles = (
  possibles: ReadonlyMap<number, Set<number>>
) => {
  let groups = new CollectionsNumbers();
  let segments = new Map<string, boolean>();
  for (let [idx, poss] of possibles) {
    let row = indexToRow(idx);
    let col = indexToCol(idx);
    let box = indexToBox(idx);
    let h = indexToSegH(idx);
    let v = indexToSegV(idx);
    [...poss].forEach((number) => {
      groups.add({ type: "row", index: row.idx, number }, row.pos);
      groups.add({ type: "col", index: col.idx, number }, col.pos);
      groups.add({ type: "box", index: box.idx, number }, box.pos);
      segments.set(`${h}.${number}`, true);
      segments.set(`${v + 27}.${number}`, true);
    });
  }
  return {
    groups,
    segments,
  };
};
