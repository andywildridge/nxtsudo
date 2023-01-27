import { processPossibles } from "./processPossibles";
import { getSegementDeletors } from "./segmentSkewers";
import { getGroupClusters } from "./getGroupClusters";
import { findSquareSolvable } from "./findSolvable";

export interface solvableSquare {
  square: number;
  number: number;
  because: string;
}

export const analyse = (possibles: ReadonlyMap<number, Set<number>>) => {
  const { groups, segments } = processPossibles(possibles);
  const solvableSquare = findSquareSolvable(possibles);
  const segmentRemovers = getSegementDeletors(possibles, segments);
  const clusterRemovers = getGroupClusters(possibles, groups);

  console.log("segments", segments);
  console.log("segmentRemovers", segmentRemovers);
  console.log("clusterRemovers", clusterRemovers.groups);

  const solvable: Record<number, solvableSquare> = {};

  //group solvable
  clusterRemovers.singles.forEach((i: solvableSquare) => {
    solvable[i.square] = i;
  });

  //square solvable
  solvableSquare.forEach((i: solvableSquare) => {
    solvable[i.square] = i;
  });

  const removable: Array<{ idx: number; num: number; because: string }> = [];

  segmentRemovers.forEach((i) => {
    i.idx.forEach((j) => {
      removable.push({ idx: j, num: i.num, because: i.because });
    });
  });

  clusterRemovers.groups.forEach((i) => {
    i.canRemoveInner?.forEach((j) => {
      j.vals.forEach((k) => {
        removable.push({ idx: j.idx, num: k, because: i.because });
      });
    });
    /*i.canRemoveOuter?.forEach((j) => {
          removable.push({ idx: j, num: k, because: i.because });
      });*/
  });

  console.log("removable", removable);

  return {
    solvable,
    removable, //clusterRemovers,
  };
};
