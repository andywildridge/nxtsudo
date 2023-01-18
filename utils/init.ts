import { indexToRow, indexToCol, indexToBox } from './indexTransforms'
import { Collections } from './collections';

const VALIDNUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const sudokuStr = `
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

const sudo = [...sudokuStr.replace(/\s/g, "")].map((i) => ~~i);

const rcb = (sudo: Array<number>): Map<string, Set<number>> => {
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

let rcbs = rcb(sudo);

const possibles = new Map();
const initial = new Map<number, number>();
const solved = new Map<number, number>();
for (let idx = 0; idx < 81; idx++) {
  if (sudo[idx] !== 0) {
    initial.set(idx, sudo[idx]);
    solved.set(idx, sudo[idx]);
  }
  let all = new Set([
    ...(rcbs.get(`row.${indexToRow(idx).idx}`) || []),
    ...(rcbs.get(`col.${indexToCol(idx).idx}`) || []),
    ...(rcbs.get(`box.${indexToBox(idx).idx}`) || []),
  ]);
  if (all.size && sudo[idx] === 0) {
    possibles.set(
      idx,
      new Set([...VALIDNUMBERS.filter((i) => ![...all].includes(i))])
    );
  }
}

export const info = {
  initial,
  possibles,
  solved
}