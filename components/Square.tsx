interface S {
  solved: number | undefined;
  squarePossibles: number[];
}

export default function Square({ solved, squarePossibles }: S) {
  return (
    <div>
      {solved ?? null}
      {squarePossibles.map((possible: number, idx: number) => (
        <div className="text-xs inline-block text-red-600" key={idx}>
          {possible}
        </div>
      ))}
    </div>
  );
}
