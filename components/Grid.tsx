import { useState } from "react";
import Square from "./Square";
import { useSudoku } from "../hooks/useSudoku";

// placeholder array for iterating 9*9 ui grid
const grid: ReadonlyArray<null> = new Array(81).fill(null);

export default function Grid({ puzzle }: { puzzle: string }) {
  const [currentSquare, setCurrentSquare] = useState("");
  /*const [relatedSquares, setRelatedSquares] = useState<Record<number, boolean>>(
    {}
  );
  const [containedSquares, setContainedSquares] = useState<
    Record<number, boolean>
  >({});*/

  const { state, setSquare } = useSudoku(puzzle);

  const solveSquare = (idx: number): void => {
    setSquare({ idx, value: state.solvable[idx].number });
  };

  const hoverSquare = (idx: number): void => {
    /*const removers = false; //state.removable.indeces[idx];
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
    } else if (state.solvable[idx]) {
      because = state.solvable[idx].because;
    }
    setCurrentSquare(`${because}`);
    setRelatedSquares(related);
    setContainedSquares(contained);*/
  };

  return (
    <>
      <div
        className="sudoku-grid bcontainer m-auto grid grid-cols-9"
        onMouseLeave={() => hoverSquare(-1)}
      >
        {grid.map((_: null, idx: number) => {
          const solved = state.solved.get(idx);
          const squarePossibles = [...(state.possibles.get(idx) || [])];
          const squareStyle = `${state.initial.get(idx) ? "font-bold" : ""} 
          ${state.solvable[idx] ? "bg-red-100" : ""} 
          ${state.removableIds[idx] ? "bg-yellow-100" : ""}
          ${/*relatedSquares[idx]*/ 0 ? "bg-blue-100" : ""}
          ${/*containedSquares[idx]*/ 0 ? "bg-green-100" : ""}
          ${!solved ? "poss" : ""}
          `;

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
                  deletable: [], //state.removable.deleteMap[idx],
                  solvable: state.solvable[idx]
                    ? state.solvable[idx].number
                    : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div>
        {/*state.removable.data.map((i) => (
          <div key={`${i.because}${i.contained}`}>{i.because}</div>
        ))*/}
      </div>
      <div>{currentSquare}</div>
    </>
  );
}
