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

  const singles = [...solvableSquare, ...solvedSingles];

  console.log("all solved", singles);

  const solvable: Record<number, solvableSquare> = {};

  //square solvable
  singles.forEach((i: solvableSquare) => {
    solvable[i.square] = i;
  });

  const removable: Array<{ idx: number; num: number; because: string }> = [];

  console.log("solvable", solvable);
  console.log("removable", removable);

  return {
    solvable,
    removable, //clusterRemovers,
    groupRemovers,
  };
};
