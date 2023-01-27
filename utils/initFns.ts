import { indexToRow, indexToCol, indexToBox } from "./indexTransforms";
import { CollectionNumberSet } from "./collections";

function getSolvedInGroups(sudo: number[]) {
  return sudo.reduce((accumulator, val: number, idx: number) => {
    if (val > 0) {
      accumulator.add(`row.${indexToRow(idx).idx}`, val);
      accumulator.add(`col.${indexToCol(idx).idx}`, val);
      accumulator.add(`box.${indexToBox(idx).idx}`, val);
    }
    return accumulator;
  }, new CollectionNumberSet()).values;
}

const VALIDNUMBERS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getPossiblesAndSolved(sudo: number[]) {
  // transform number array(81) to e.g. row 0 has 1,3,7, col 4 had 5,8,9
  //
  const solvedInGroups = getSolvedInGroups(sudo);

  const possibles = new Map<number, Set<number>>();
  const solved = new Map<number, number>();

  for (let idx = 0; idx < 81; idx++) {
    // if square already had value set solved
    if (sudo[idx] !== 0) {
      solved.set(idx, sudo[idx]);
    } else {
      // get set of all solved for square and invert to get possibles
      const allSolvedRelativeToSquare = new Set([
        ...(solvedInGroups.get(`row.${indexToRow(idx).idx}`) || []),
        ...(solvedInGroups.get(`col.${indexToCol(idx).idx}`) || []),
        ...(solvedInGroups.get(`box.${indexToBox(idx).idx}`) || []),
      ]);

      possibles.set(
        idx,
        new Set([
          ...VALIDNUMBERS.filter((i) => !allSolvedRelativeToSquare.has(i)),
        ])
      );
    }
  }

  return {
    solved,
    possibles,
  };
}
