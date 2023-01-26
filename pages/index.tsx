import { useState } from "react";
import Head from "next/head";
// import Image from 'next/image'
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { initVals } from "../utils/sudokuSolver";
import { gridStyle } from "@/styles/styles";
import Grid from "../components/Grid";
import Square from "../components/Square";
import { setSquare } from "@/interactions/setSquare"; // side fx!

const inter = Inter({ subsets: ["latin"] });

// placeholder array for builing ui grid
const grid: ReadonlyArray<null> = new Array(81).fill(null);

export default function Home() {
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
      });
    }
  };

  return (
    <>
      <Head>
        <title>Sudoku</title>
        <meta name="description" content="Sudoku" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid grid={[...grid]} />
      <main className="m-auto">
        <div className={styles.description}>
          <h1 className="text-3xl font-bold underline">Sudoku!</h1>
        </div>
        <div className="w-[400px] m-auto ">
          <div className={gridStyle}>
            {grid.map((_: null, idx: number) => {
              const solved = sudoState.solved.get(idx);
              const squarePossibles = [...(sudoState.possibles.get(idx) || [])];
              const squareStyle = `${
                sudoState.initialClues?.includes(idx) ? "font-bold" : ""
              } ${sudoState.solvable[idx] ? "bg-red-100" : ""}`;
              return (
                <div
                  className={squareStyle}
                  key={idx}
                  onClick={() => solveSquare(idx)}
                >
                  <Square solved={solved} squarePossibles={squarePossibles} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
