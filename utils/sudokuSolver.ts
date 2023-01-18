//import * as transforms from "./indexTransforms";
import { info } from "./init"

export const solver = {
  info,
  get sudo() {
    const aggregate = [];
    for(let i=0; i<81; i++) {
      aggregate.push({
        solved: info.solved.get(i) || 0,
        possibles: info.pss.get(i) ? [...info.pss.get(i)] : []
      });
    }
    return aggregate;
  }
}