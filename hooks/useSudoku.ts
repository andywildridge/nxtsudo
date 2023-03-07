import { Removable } from "./../utils/Removable";
import { useState, useMemo } from "react";
import { ISolver, Solver } from "@/solver/Solver";
import { solvableSquare } from "@/utils/analyse";

interface UseSudokuOutput {
  state: {
    solved: Map<number, number>;
    initial: Map<number, number>;
    solvable: Record<number, solvableSquare>;
    possibles: Map<number, Set<number>>;
    removables: Removable[];
    removableIds: Record<number, Record<number, Removable[]>>;
  };
  setSquare({ idx, value }: { idx: number; value: number }): void;
}

function useSudoku(puzzle: string): UseSudokuOutput {
  const [sudoState, setSudoState] = useState<UseSudokuOutput["state"]>({
    solved: new Map(),
    initial: new Map(),
    solvable: {},
    possibles: new Map(),
    removables: [],
    removableIds: {},
  });
  const start = performance.now();
  const sudoku: ISolver = useMemo(() => {
    const sudoku = new Solver(puzzle);
    setSudoState(sudoku.state);
    console.log(sudoku.state.removableIds);
    return sudoku;
  }, []);

  const setSquare = ({ idx, value }: { idx: number; value: number }) => {
    sudoku.setSquare({ idx, value });
    setSudoState(sudoku.state);
    console.log(sudoku.state.removableIds);
  };

  return {
    state: {
      solved: new Map(sudoState.solved),
      initial: new Map(sudoState.initial),
      solvable: { ...sudoState.solvable },
      possibles: new Map(sudoState.possibles),
      removables: sudoState.removables,
      removableIds: sudoState.removableIds,
    },
    setSquare,
  };
}

export { useSudoku };
