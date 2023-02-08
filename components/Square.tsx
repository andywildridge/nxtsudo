interface SquareProps {
  solved: number | undefined;
  squarePossibles: number[];
  deletable: number[];
}

export default function Square({
  solved,
  squarePossibles,
  deletable,
}: SquareProps) {
  return (
    <>
      {solved ?? null}
      {squarePossibles.map((possible: number, idx: number) => (
        <div className="text-xs inline-block text-red-600" key={idx}>
          <span>
            {deletable && deletable.includes(possible) && "["}
            {possible}
            {deletable && deletable.includes(possible) && "]"}
          </span>
        </div>
      ))}
    </>
  );
}
