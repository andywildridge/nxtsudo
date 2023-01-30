import { info } from "./init";
import { analyse } from "./analyse";

const { possibles, solved } = info;
const { solvable, removable, remByIdx } = analyse(possibles);

console.log(remByIdx);

export const initVals = {
  possibles,
  initialClues: [...solved.keys()],
  solved,
  solvable,
  removable,
  remByIdx,
};
