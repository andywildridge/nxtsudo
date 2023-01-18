import { useState } from 'react';
import Head from 'next/head'
// import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { initVals } from '../utils/sudokuSolver'

const inter = Inter({ subsets: ['latin'] })

const grid: ReadonlyArray<undefined> = new Array(81).fill(undefined);

// solved and solvable, analysis = removable/deletable

export default function Home() {
  const [ sudoState, setSudoState ] = useState(initVals);

  const solveSquare = ((idx: number, number: number)=>{
    const { initial, solved, possibles, analysis } = sudoState;
    solved.set(0, 1);
    possibles.delete(0);
    console.log(analysis);
    setSudoState({
      initial,
      solved,
      possibles,
      analysis
    });
    return true;
  })

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="m-auto">
        <div className={styles.description}>
          <h1 className="text-3xl font-bold underline">
            Sudoku! {grid.length}
          </h1>
        </div>
        <div className="w-[400px] m-auto ">
          <div className="[&>*:nth-child(odd)]:border-dashed [&>*:nth-child(odd)]:border-2 [&>*:nth-child(odd)]:border-indigo-600 bcontainer m-auto grid grid-cols-9">
            {
              grid.map((i:undefined, idx: number) => {
                const solved = sudoState.solved.get(idx);
                const possibles = [...(sudoState.possibles.get(idx) || [])];  // handle destrucure undefined 
                const squareStyle = `${sudoState.initial.get(idx) ? 'font-bold' : ''} ${idx === 0 ?  'bg-red-500' : ''}`;
                return <div className={squareStyle} key={idx}>{solved && solved}{
                  possibles.map((possible: number, idx: number) => (
                    <div className="text-xs inline-block text-red-600" key={idx}>{possible}</div>
                  ))
                }</div>
              })}
          </div>
        </div>
        <div onClick={()=>solveSquare(0,1)}>SET</div>
      </main>
    </>
  )
}
