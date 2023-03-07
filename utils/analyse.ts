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
  const { removables, solvedSingles } = getGroupClusters(
    possibles,
    groups,
    segmentRemovers
  );

  const singles = [...solvableSquare, ...solvedSingles];
  const solvable: Record<number, solvableSquare> = {};

  singles.forEach((i: solvableSquare) => {
    solvable[i.square] = i;
  });

  //console.log("remo", removables);

  return {
    solvable,
    removables,
  };
};
