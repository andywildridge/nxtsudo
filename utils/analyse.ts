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
  //>>possibles [Number,Set]
  //groups
  const { groups, segments } = processPossibles(possibles);
  const solvableSquare = findSquareSolvable(possibles);
  const segmentRemovers = getSegementDeletors(possibles, segments);
  const { groupRemovers, solvedSingles } = getGroupClusters(
    possibles,
    groups,
    segmentRemovers
  );

  console.log("////////////////////");
  console.log("solvable squares", solvableSquare);
  console.log("segmentRemovers", segmentRemovers);
  console.log("GRP", groupRemovers);
  console.log(groupRemovers.indeces);
  console.log(groupRemovers.data);
  console.log("solvedSingles from groups", solvedSingles);
  const singles = [...solvableSquare, ...solvedSingles];

  console.log("all solved", singles);

  const solvable: Record<number, solvableSquare> = {};

  //square solvable
  singles.forEach((i: solvableSquare) => {
    solvable[i.square] = i;
  });

  const removable: Array<{ idx: number; num: number; because: string }> = [];

  /*segmentRemovers.forEach((i) => {
    i.idx.forEach((j) => {
      removable.push({ idx: j, num: i.num, because: i.because });
    });
  });

  const remByIdx = removable.reduce((acc: Record<number, boolean>, i) => {
    acc[i.idx] = true;
    return acc;
  }, {});*/

  console.log("solvable", solvable);
  console.log("removable", removable);

  return {
    solvable,
    removable, //clusterRemovers,
    groupRemovers,
  };
};
