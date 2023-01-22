import { info } from "./init"
import { analyse } from "./analyse";

const { possibles, solved } = info;
const { solvable, removable } = analyse(possibles);

export const initVals = {
  possibles,
  initialClues: [...solved.keys()],
  solved,
  solvable,
  removable
};