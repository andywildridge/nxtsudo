import { useState } from "react";
import { setSquare } from "@/interactions/setSquare"; // side fx!
import { initPuzzle } from "../utils/sudokuSolver";
import Square from "./Square";

// placeholder array for iterating 9*9 ui grid
const grid: ReadonlyArray<null> = new Array(81).fill(null);

export default function Grid({ puzzle }: { puzzle: string }) {
  const [sudoState, setSudoState] = useState(initPuzzle(puzzle));
  const [currentSquare, setCurrentSquare] = useState("");
  const [relatedSquares, setRelatedSquares] = useState<Record<number, boolean>>(
    {}
  );
  const [containedSquares, setContainedSquares] = useState<
    Record<number, boolean>
  >({});

  const solveSquare = (idx: number): void => {
    // custom hook?
    const { solved, possibles, solvable } = sudoState;
    const newanalysis = setSquare(idx, solvable, solved, possibles);

    if (newanalysis) {
      setSudoState({
        ...sudoState,
        possibles,
        solved,
        solvable: newanalysis.solvable,
        removables: newanalysis.removables,
      });
    }
  };

  const hoverSquare = (idx: number): void => {
    const removers = sudoState.removables.indeces[idx];
    let related: Record<number, boolean> = {};
    let contained: Record<number, boolean> = {};
    let because = "";
    if (removers) {
      Object.keys(removers).forEach((number: string) => {
        removers[Number(number)].forEach((reason) => {
          because += `remo=vable ${reason.because}\n`;
          reason.related.forEach((r) => (related[r] = true));
          reason.contained.forEach((r) => (contained[r] = true));
        });
      });
    } else if (sudoState.solvable[idx]) {
      because = sudoState.solvable[idx].because;
    }
    setCurrentSquare(`${because}`);
    setRelatedSquares(related);
    setContainedSquares(contained);
  };

  console.log(sudoState.removables.data);

  return (
    <>
      <div
        className="sudoku-grid bcontainer m-auto grid grid-cols-9"
        onMouseLeave={() => hoverSquare(-1)}
      >
        {grid.map((_: null, idx: number) => {
          const solved = sudoState.solved.get(idx);
          const squarePossibles = [...(sudoState.possibles.get(idx) || [])];
          const squareStyle = `${
            sudoState.initialClues?.includes(idx) ? "font-bold" : ""
          } 
          ${sudoState.solvable[idx] ? "bg-red-100" : ""} 
          ${sudoState.removables.indeces[idx] ? "bg-yellow-100" : ""}
          ${relatedSquares[idx] ? "bg-blue-100" : ""}
          ${containedSquares[idx] ? "bg-green-100" : ""}`;

          return (
            <div
              className={`square ${squareStyle}`}
              key={idx}
              onClick={() => solveSquare(idx)}
              onMouseEnter={() => hoverSquare(idx)}
            >
              <Square
                {...{
                  solved,
                  squarePossibles,
                  deletable: sudoState.removables.deleteMap[idx],
                  solvable: sudoState.solvable[idx]
                    ? sudoState.solvable[idx].number
                    : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div>
        {sudoState.removables.data.map((i) => (
          <div key={`${i.because}${i.contained}`}>{i.because}</div>
        ))}
      </div>
      <div>{currentSquare}</div>
    </>
  );
}
