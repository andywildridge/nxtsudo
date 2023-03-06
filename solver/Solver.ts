import Removables from "./../utils/Removable";
import { getPossiblesAndSolved } from "@/utils/initFns";
import { analyse, solvableSquare } from "@/utils/analyse";
import { getRelatedSquares } from "@/utils/indexTransforms";

export interface ISolver {
  state: {
    initial: Map<number, number>;
    solved: Map<number, number>;
    possibles: Map<number, Set<number>>;
    solvable: Record<number, solvableSquare>;
    removable: Removables;
  };
  setSquare({ idx, value }: { idx: number; value: number }): void;
}

export class Solver implements ISolver {
  private sudoku: number[] = [];
  private _initial: Map<number, number>;
  private _solved: Map<number, number>;
  private _possibles: Map<number, Set<number>>;
  private _solvable: Record<number, solvableSquare> = {};
  private _removable: Removables = new Removables();
  private solution: Map<number, number> = new Map();

  constructor(puzzle: string) {
    this.sudoku = [...puzzle.replace(/\s/g, "")].map((i) => Number(i));
    // initial step
    const { possibles, solved } = getPossiblesAndSolved(this.sudoku);
    this._initial = new Map(solved);
    this._solved = solved;
    this._possibles = possibles;
    // next step
    // can solve?
    const tempState = {
      _solved: new Map(this._solved),
      _possibles: new Map(this._possibles),
    };
    //this.canComplete();

    this._solved = tempState._solved;
    this._possibles = tempState._possibles;
    this.updateAnalysis();
  }

  get state() {
    return {
      initial: this._initial,
      solved: this._solved,
      possibles: this._possibles,
      solvable: this._solvable,
      removable: this._removable,
    };
  }

  setSquare({ idx, value }: { idx: number; value: number }) {
    this.write({ idx, value });
    this.updateAnalysis();
  }

  updateAnalysis() {
    const { solvable, removables } = analyse(this._possibles);
    this._solvable = solvable;
    this._removable = removables;
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
    console.log("FINISHED", this._solved, this._solvable, this._possibles);
    this.solution = new Map(this._solved);
  }

  canComplete() {
    this.updateAnalysis();
    this.writeAll();
    console.log("solution", this.solution);
  }

  removePossible(removable: { idx: number; value: number }[]) {
    removable.forEach((item: { idx: number; value: number }) => {});
  }
}
