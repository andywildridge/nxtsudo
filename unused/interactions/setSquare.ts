import { getRelatedSquares } from "../../utils/indexTransforms";
import { solvableSquare } from "../../utils/analyse";
import { analyse } from "../../utils/analyse";

let removePoss = (
  // side effect
  idx: number,
  nums: Array<number>,
  possibles: Map<number, Set<number>>
) => {
  nums.forEach((n) => {
    possibles.get(idx)?.delete(n);
  });
};

export const setSquare = (
  idx: number,
  solvable: Record<number, solvableSquare>,
  solved: Map<number, number>,
  possibles: Map<number, Set<number>>
) => {
  if (!solvable[idx]) {
    return false;
  }
  const num = solvable[idx].number;
  solved.set(idx, num);
  possibles.delete(idx);

  const related = getRelatedSquares(idx);
  related.forEach((i: number) => removePoss(i, [num], possibles));

  return analyse(possibles);
};
