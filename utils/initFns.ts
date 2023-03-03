import { indexToRow, indexToCol, indexToBox } from "./indexTransforms";
import { GroupPossibles } from "./collections";

function getNumberGroupings(sudo: number[]) {
  return sudo.reduce((groups, val: number, idx: number) => {
    if (val > 0) {
      groups.add({ type: "row", index: indexToRow(idx).idx }, val);
      groups.add({ type: "col", index: indexToCol(idx).idx }, val);
      groups.add({ type: "box", index: indexToBox(idx).idx }, val);
    }
    return groups;
  }, new GroupPossibles());
}

const VALIDNUMBERS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getPossiblesAndSolved(puzzle: number[]) {
  // transform number array(81) to e.g. row 0 has 1,3,7, col 4 had 5,8,9
  //
  const numberGroupings = getNumberGroupings(puzzle).values;

  const possibles = new Map<number, Set<number>>();
  const solved = new Map<number, number>();

  for (let idx = 0; idx < 81; idx++) {
    // if square already had value set solved
    if (puzzle[idx] !== 0) {
      solved.set(idx, puzzle[idx]);
    } else {
      // get set of all solved for square and invert to get possibles
      const allSolvedRelativeToSquare = new Set([
        ...(numberGroupings.get(`row.${indexToRow(idx).idx}`) || []),
        ...(numberGroupings.get(`col.${indexToCol(idx).idx}`) || []),
        ...(numberGroupings.get(`box.${indexToBox(idx).idx}`) || []),
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
