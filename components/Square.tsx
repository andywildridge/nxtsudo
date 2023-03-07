interface SquareProps {
  solved: number | undefined;
  squarePossibles: number[];
  deletable: number[];
  solvable: number | undefined;
}

export default function Square({
  solved,
  squarePossibles,
  deletable,
  solvable,
}: SquareProps) {
  return (
    <>
      {solved ?? null}
      {squarePossibles.map((possible: number, idx: number) => (
        <div
          className="poss text-xs inline-block text-red-600 opacity-30"
          key={idx}
        >
          <span>
            {solvable && solvable === possible && "["}
            {deletable && deletable.includes(possible) && "["}
            {possible}
            {deletable && deletable.includes(possible) && "]"}
            {solvable && solvable === possible && "]"}
          </span>
        </div>
      ))}
    </>
  );
}
