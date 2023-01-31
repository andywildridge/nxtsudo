import { useState } from "react";
import { setSquare } from "@/interactions/setSquare"; // side fx!
import { initVals } from "../utils/sudokuSolver";
import Square from "./Square";

// placeholder array for builing ui grid
const grid: ReadonlyArray<null> = new Array(81).fill(null);

export default function Grid() {
  const [sudoState, setSudoState] = useState(initVals);

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
  return (
    <>
      <div className="[&>*:nth-child(odd)]:border-dashed [&>*:nth-child(odd)]:border-2 [&>*:nth-child(odd)]:border-red bcontainer m-auto grid grid-cols-9">
        {grid.map((_: null, idx: number) => {
          const solved = sudoState.solved.get(idx);
          const squarePossibles = [...(sudoState.possibles.get(idx) || [])];
          const squareStyle = `${
            sudoState.initialClues?.includes(idx) ? "font-bold" : ""
          } ${sudoState.solvable[idx] ? "bg-red-100" : ""} ${
            sudoState.groupRemovers.indeces[idx] ? "bg-yellow-100" : ""
          }`;
          return (
            <div
              className={squareStyle}
              key={idx}
              onClick={() => solveSquare(idx)}
            >
              <Square {...{ solved, squarePossibles }} />
            </div>
          );
        })}
      </div>
      <div>
        {sudoState.groupRemovers.data.map((i) => (
          <div>{i.because}</div>
        ))}
      </div>
    </>
  );
}
