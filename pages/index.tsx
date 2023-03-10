import Head from "next/head";
// import Image from 'next/image'
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Grid from "../components/Grid";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Sudoku</title>
        <meta name="description" content="Sudoku" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="m-auto">
        <div className={styles.description}>
          <h1 className="text-3xl font-bold underline">Sudoku!</h1>
        </div>
        <div className="w-[400px] m-auto ">
          <Grid />
        </div>
      </main>
    </>
  );
}
