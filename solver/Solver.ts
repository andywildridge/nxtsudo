import Removables, { Removable } from "./../utils/Removable";
import { getPossiblesAndSolved } from "@/utils/initFns";
import { analyse, solvableSquare } from "@/utils/analyse";
import { getRelatedSquares } from "@/utils/indexTransforms";

export interface ISolver {
  state: {
    initial: Map<number, number>;
    solved: Map<number, number>;
    possibles: Map<number, Set<number>>;
    solvable: Record<number, solvableSquare>;
    removables: Removable[];
    removableIds: Record<number, Record<number, Removable[]>>;
  };
  setSquare({ idx, value }: { idx: number; value: number }): void;
}

export class Solver implements ISolver {
  private sudoku: number[] = [];
  private _initial: Map<number, number>;
  private _solved: Map<number, number>;
  private _possibles: Map<number, Set<number>>;
  private _solvable: Record<number, solvableSquare> = {};
  private _removables: Removable[] = [];
  private _removableIds: Record<number, Record<number, Removable[]>> = {};
  private solution: Map<number, number> = new Map();

  constructor(puzzle: string) {
    this.sudoku = [...puzzle.replace(/\s/g, "")].map((i) => Number(i));
    // initial step
    const { possibles, solved } = getPossiblesAndSolved(this.sudoku);
    this._initial = new Map(solved);
    this._solved = solved;
    this._possibles = possibles;

    // can solve?
    const tempState = {
      _solved: new Map(solved),
      _possibles: new Map(possibles),
    };

    // deep copy possibles sets
    tempState._possibles.forEach((possibles: Set<number>, idx: number) => {
      tempState._possibles.set(idx, new Set([...possibles]));
    });

    this.canComplete();

    this._solved = tempState._solved;
    this._possibles = tempState._possibles;

    this.updateAnalysis();
  }

  get state() {
    return {
      initial: new Map(this._initial),
      solved: new Map(this._solved),
      possibles: new Map(this._possibles),
      solvable: { ...this._solvable },
      removables: [...this._removables],
      removableIds: { ...this._removableIds },
    };
  }

  setSquare({ idx, value }: { idx: number; value: number }) {
    this.write({ idx, value });
    this.updateAnalysis();
  }

  updateAnalysis() {
    const { solvable, removables } = analyse(this._possibles);
    this._solvable = solvable;
    this._removables = removables.data;
    this._removableIds = removables.indeces;
  }

  write({ idx, value }: { idx: number; value: number }) {
    this._solved.set(idx, value);
    this._possibles.delete(idx);
    const related = getRelatedSquares(idx);
    related.forEach((idx: number) => {
      this._possibles.get(idx)?.delete(value);
    });
  }

  writeAll() {
    while (Object.keys(this._solvable).length) {
      Object.entries(this._solvable).forEach(([_, { square, number }]) => {
        this.write({ idx: square, value: number });
      });
      this.updateAnalysis();
    }
    this.solution = new Map(this._solved);
  }

  canComplete() {
    this.updateAnalysis();
    this.writeAll();
    console.log("solution", this.solution);
  }

  /*removePossible(removable: { idx: number; value: number }[]) {
    removable.forEach((item: { idx: number; value: number }) => {});
  }*/
}
