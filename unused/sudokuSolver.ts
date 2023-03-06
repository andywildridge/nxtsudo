import { analyse } from "./analyse";
import { getPossiblesAndSolved } from "./initFns";
import { setSquare } from "@/unused/interactions/setSquare";

export function initPuzzle(puzzle: string) {
  const sudo: number[] = [...puzzle.replace(/\s/g, "")].map((i) => ~~i);

  const { possibles, solved } = getPossiblesAndSolved(sudo);
  const { solvable, removables } = analyse(possibles);

  console.log(solved, solvable, removables);
  if (Object.keys(solvable).length) {
    Object.keys(solvable).forEach((key: string) => {
      //solved.set(Number(key), solvable[Number(key)].number);
    });
  }

  return {
    possibles,
    initialClues: [...solved.keys()],
    solved,
    solvable,
    removables,
  };
}
