type Position = {
  idx: number;
  pos: number;
};

export const indexToRow = (idx: number): Position => ({
  idx: Math.floor(idx / 9),
  pos: idx % 9,
});

export const indexToCol = (idx: number): Position => ({
  idx: idx % 9,
  pos: Math.floor(idx / 9),
});

export const indexToBox = (idx: number): Position => ({
  idx: Math.floor((idx % 9) / 3) + Math.floor(idx / 27) * 3,
  pos: 3 * Math.floor((idx % 27) / 9) + (idx % 3),
});

export const indexToSegH = (idx: number): number => Math.floor(idx / 3);

export const indexToSegV = (idx: number): number =>
  (idx % 9) * 3 + Math.floor(idx / 27);

const rowIndeces = (idx: number): Array<number> => {
  const indeces = [];
  for (let i = 0; i < 9; i++) {
    indeces.push(idx * 9 + i);
  }
  return indeces;
};

const colIndeces = (idx: number): Array<number> => {
  const indeces = [];
  for (let i = 0; i < 9; i++) {
    indeces.push((idx % 9) + i * 9);
  }
  return indeces;
};

const boxIndeces = (idx: number): Array<number> => {
  const indeces = [];
  const startIndex = (idx % 3) * 3 + Math.floor(idx / 3) * 27;
  for (let i = 0; i < 9; i++) {
    indeces.push(startIndex + (i % 3) + Math.floor(i / 3) * 9);
  }
  return indeces; //indeces;
};

const segmentIndeces = (idx: number): Array<number> => {
  let start: number;
  let step: number;
  if (idx < 27) {
    start = idx * 3;
    step = 1;
  } else {
    idx = idx - 27;
    start = Math.floor(idx / 3) + (idx % 3) * 27;
    step = 9;
  }
  return [0, 1, 2].map((i) => start + i * step);
};

export enum GroupType {
  row = "row",
  col = "col",
  box = "box",
  segment = "segment",
}

export const groupIndeces: Record<GroupType, (idx: number) => Array<number>> = {
  row: rowIndeces,
  col: colIndeces,
  box: boxIndeces,
  segment: segmentIndeces,
};

export const getRelatedSquares = (idx: number): number[] => {
  return [
    ...new Set([
      ...groupIndeces["row"](indexToRow(idx).idx),
      ...groupIndeces["col"](indexToCol(idx).idx),
      ...groupIndeces["box"](indexToBox(idx).idx),
    ]),
  ];
};
