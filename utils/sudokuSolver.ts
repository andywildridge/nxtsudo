import { info } from "./init"
import { analyse } from "./analyse";

const { solved, possibles, initial } = info;
const analysis = analyse(info.possibles);

interface SudoData {
  solved: Map<number, number>;
  possibles: Map<number, Set<number>>;
  analysis: any; // define type
  initial: Map<number, number>;
}

export const initVals: SudoData = {
  solved,
  possibles,
  analysis,
  initial
};