import { processPossibles } from "./processPossibles";
import { getSegementDeletors } from "./segmentSkewers";
import { getGroupClusters } from "./getGroupClusters";
import { findSquareSolvable } from "./findSolvable";

export const analyse = (possibles: ReadonlyMap<number, Set<number>>) => {
  const { groups, segments } = processPossibles(possibles);
  const solvableSquare = findSquareSolvable(possibles);
  const segmentRemovers = getSegementDeletors(possibles, segments);
  const clusterRemovers = getGroupClusters(possibles, groups);

  interface solvableSquare {
    square: number;
    number: number;
    because: string;
  }

  const solvable: Record<number, solvableSquare> = {};

  //group solvable
  clusterRemovers.singles.forEach((i: solvableSquare) => {
    solvable[i.square] = i;
  });

  //square solvable
  solvableSquare.forEach((i: solvableSquare) => {
    solvable[i.square] = i;
  });

  return {
    solvable,
    removable: clusterRemovers,
  };
};
