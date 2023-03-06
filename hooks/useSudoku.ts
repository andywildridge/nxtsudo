import { setSquare } from "../unused/interactions/setSquare";
import Removables, { Removable } from "./../utils/Removable";
import { Dispatch, SetStateAction, useState, useMemo } from "react";
import { ISolver, Solver } from "@/solver/Solver";
import { solvableSquare } from "@/utils/analyse";

interface UseCounterOutput {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

function useCounter(initialValue?: number): UseCounterOutput {
  const [count, setCount] = useState(initialValue || 0);

  const z = useMemo(() => {
    console.log("render");
    return initialValue;
  }, [initialValue]);

  const increment = () => setCount((x) => x + 1);
  const decrement = () => setCount((x) => x - 1);
  const reset = () => setCount(initialValue || 0);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}

interface UseSudokuOutput {
  state: {
    solved: Map<number, number>;
    initial: Map<number, number>;
    solvable: Record<number, solvableSquare>;
    possibles: Map<number, Set<number>>;
    removable: Removables;
  };
  setSquare({ idx, value }: { idx: number; value: number }): void;
}

function useSudoku(puzzle: string): UseSudokuOutput {
  const [sudoState, setSudoState] = useState({
    solved: new Map(),
    initial: new Map(),
    solvable: {},
    possibles: new Map(),
    removable: new Removables(),
  });
  const start = performance.now();
  const sudoku: ISolver = useMemo(() => {
    const sudoku = new Solver(puzzle);
    setSudoState(sudoku.state);
    return sudoku;
  }, []);

  const setSquare = ({ idx, value }: { idx: number; value: number }) => {
    sudoku.setSquare({ idx, value });
    setSudoState(sudoku.state);
  };

  return {
    state: {
      solved: new Map(sudoState.solved),
      initial: new Map(sudoState.initial),
      solvable: { ...sudoState.solvable },
      possibles: new Map(sudoState.possibles),
      removable: sudoState.removable, // copy
    },
    setSquare,
  };
}

export { useCounter, useSudoku };
