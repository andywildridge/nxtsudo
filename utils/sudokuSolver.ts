//import * as transforms from "./indexTransforms";
import { info } from "./init"

export const solver = {
  info,
  get sudo() {
    const aggregate = [];
    for(let i=0; i<81; i++) {
      aggregate.push(info.solved.get(i) || 0);
    }
    return aggregate;
  }
}