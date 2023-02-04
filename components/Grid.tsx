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
  console.log(puzzle);

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
        removable: newanalysis.removable,
        groupRemovers: newanalysis.groupRemovers,
      });
    }
  };

  const hoverSquare = (idx: number): void => {
    const removers = sudoState.groupRemovers.indeces[idx];
    let related: Record<number, boolean> = {};
    let contained: Record<number, boolean> = {};
    let because = "";
    if (removers) {
      console.log(removers);
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
  return (
    <>
      <div
        className="[&>*:nth-child(odd)]:border-dashed [&>*:nth-child(odd)]:border-2 [&>*:nth-child(odd)]:border-red bcontainer m-auto grid grid-cols-9"
        onMouseLeave={() => hoverSquare(-1)}
      >
        {grid.map((_: null, idx: number) => {
          const solved = sudoState.solved.get(idx);
          const squarePossibles = [...(sudoState.possibles.get(idx) || [])];
          const squareStyle = `${
            sudoState.initialClues?.includes(idx) ? "font-bold" : ""
          } 
          ${sudoState.solvable[idx] ? "bg-red-100" : ""} 
          ${sudoState.groupRemovers.indeces[idx] ? "bg-yellow-100" : ""}
          ${relatedSquares[idx] ? "bg-blue-100" : ""}
          ${containedSquares[idx] ? "bg-green-100" : ""}`;
          return (
            <div
              className={squareStyle}
              key={idx}
              onClick={() => solveSquare(idx)}
              onMouseEnter={() => hoverSquare(idx)}
            >
              <Square {...{ solved, squarePossibles }} />
            </div>
          );
        })}
      </div>
      <div>
        {sudoState.groupRemovers.data.map((i) => (
          <div key={`${i.because}${i.contained}`}>{i.because}</div>
        ))}
      </div>
      <div>{currentSquare}</div>
    </>
  );
}
