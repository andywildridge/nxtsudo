import { groupIndeces } from "./indexTransforms";
import Removables from "./Removable";

export const getSegementDeletors = (
  possibles: ReadonlyMap<number, Set<number>>,
  segments: Map<string, boolean>
) => {
  const rems = new Removables();

  for (let [key] of segments) {
    let [idx, num] = key.split("."); // sort type idx, num and quantity?

    //neigbours linear
    let third = +idx % 3; // segment index 1-3
    let neighbours = [0, 1, 2]
      .filter((i) => i !== third)
      .map((i) => +idx + (i - third));
    let z = [false, false];
    if (
      !segments.has(`${[neighbours[0]]}.${num}`) &&
      !segments.has(`${[neighbours[1]]}.${num}`)
    ) {
      z[0] = true;
    }

    //neigbours box
    let x = Math.floor((+idx % 9) / 3);
    let neighboursBox = [0, 1, 2]
      .filter((i) => i !== x)
      .map((i) => +idx + (i - x) * 3);
    if (
      !segments.has(`${[neighboursBox[0]]}.${num}`) &&
      !segments.has(`${[neighboursBox[1]]}.${num}`)
    ) {
      z[1] = true;
    }

    //is it a skewer?
    if (z[0] !== z[1]) {
      //its a skewer
      //console.log(key, third, neighbours, z[0]);
      //console.log(key, x, neighboursBox, z[1]);
      //console.log('skewered!');
      if (!z[0]) {
        // check neighbours for deletes linear
        let idx = neighbours.flatMap((i) =>
          groupIndeces.segment(i).filter((idx) => possibles.get(idx)?.has(+num))
        );
        //console.log(idx);
        rems.add({
          because: `neighbour linear skewer seg ${key}`,
          deletable: idx.map((s) => ({ square: s, number: +num })),
          related: [1],
          contained: [1],
        });
      } else {
        // check neighboursbox for deletes box
        let idx = neighboursBox.flatMap((i) =>
          groupIndeces.segment(i).filter((idx) => possibles.get(idx)?.has(+num))
        );
        rems.add({
          because: `neighbour box skewer seg ${key}`,
          deletable: idx.map((s) => ({ square: s, number: +num })),
          related: [1],
          contained: [1],
        });
      }
    }
  }

  return rems;
};
