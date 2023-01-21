import { info } from "./init"
import { analyse } from "./analyse";

const { solved, possibles, initial } = info;
const analysis = analyse(info.possibles);

console.log(analysis);

interface StringMap {
  [key: string]: any;
}

const singles: StringMap = {};
analysis.solvable.forEach((i: any)=>{
  if(!singles[i.square]){
    singles[i.square] = [];
  }
  singles[i.square].push(i);
});

analysis.clusterRemovers.singles.forEach((i: any) => {
  if (!singles[i.square]) {
    singles[i.square] = [];
  }
  singles[i.square].push(i);
});

console.log(singles);

interface SudoData {
  solved: Map<number, number>;
  possibles: Map<number, Set<number>>;
  analysis: any; // define type
  initial: Map<number, number>;
  singles: StringMap;
}

export const initVals: SudoData = {
  solved,
  possibles,
  analysis,
  initial,
  singles
};