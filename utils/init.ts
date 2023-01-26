import { indexToRow, indexToCol, indexToBox } from "./indexTransforms";
import { Collections } from "./collections";

const VALIDNUMBERS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const sudokuStr: string = `
                        000 000 200
                        000 050 009
                        002 709 003

                        003 000 072
                        040 007 905
                        009 010 608

                        500 098 000
                        000 300 000
                        091 645 000
`;

const sudo: number[] = [...sudokuStr.replace(/\s/g, "")].map((i) => ~~i);

const getRowColBoxSolved: (sudo: Array<number>) => Map<string, Set<number>> = (
  sudo: Array<number>
): Map<string, Set<number>> => {
  //create collection of already solved numbers in groups row,col,box
  return sudo.reduce(
    (result: Collections, val: number, idx: number): Collections => {
      if (val > 0) {
        result.add(`row.${indexToRow(idx).idx}`, val);
        result.add(`col.${indexToCol(idx).idx}`, val);
        result.add(`box.${indexToBox(idx).idx}`, val);
      }
      return result;
    },
    new Collections()
  ).values;
};

let rowColBoxSolved: Map<string, Set<number>> = getRowColBoxSolved(sudo);

const possibles = new Map<number, Set<number>>();
const solved = new Map<number, number>();

for (let idx = 0; idx < 81; idx++) {
  // if square already had value set solved
  if (sudo[idx] !== 0) {
    solved.set(idx, sudo[idx]);
  } else {
    // get set of all solved for square and invert to get possibles
    const allSolvedRelativeToSquare = new Set([
      ...(rowColBoxSolved.get(`row.${indexToRow(idx).idx}`) || []),
      ...(rowColBoxSolved.get(`col.${indexToCol(idx).idx}`) || []),
      ...(rowColBoxSolved.get(`box.${indexToBox(idx).idx}`) || []),
    ]);

    possibles.set(
      idx,
      new Set([
        ...VALIDNUMBERS.filter((i) => !allSolvedRelativeToSquare.has(i)),
      ])
    );
  }
}

export const info = {
  solved,
  possibles,
};
