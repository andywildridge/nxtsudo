import Head from 'next/head'
// import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { solver } from '../utils/sudokuSolver'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
            Sudoku! <div>{solver.a.idx}</div>
          </h1>
        </div>
        <div className="w-[400px] m-auto ">
          <div className="[&>*:nth-child(odd)]:bg-blue-500 container m-auto grid grid-cols-9">
            {solver.sudo.map((i:number, idx:number)=><div key={idx}>{i}</div>)}
          </div>
        </div>
      </main>
    </>
  )
}
