import { info } from "./init"
import { analyse } from "./analyse";

const { solved, possibles } = info;
const analysis = analyse(info.possibles);

export const initVals = {
  solved,
  possibles,
  analysis
};