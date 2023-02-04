import { analyse } from "./analyse";
import { getPossiblesAndSolved } from "./initFns";

export function initPuzzle(puzzle: string) {
  const sudo: number[] = [...puzzle.replace(/\s/g, "")].map((i) => ~~i);

  const { possibles, solved } = getPossiblesAndSolved(sudo);
  const { solvable, removables } = analyse(possibles);

  return {
    possibles,
    initialClues: [...solved.keys()],
    solved,
    solvable,
    removables,
  };
}
