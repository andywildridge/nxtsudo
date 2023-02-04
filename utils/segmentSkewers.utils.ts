export function getNeighbourIds(idx: number, type: "linear" | "box") {
  // segment index 1-3
  let filterType = type === "linear" ? idx % 3 : Math.floor((idx % 9) / 3);
  const mapFn = (idx: number, i: number): number =>
    type === "linear" ? idx + i - filterType : idx + (i - filterType) * 3;
  return [0, 1, 2].filter((i) => i !== filterType).map((i) => mapFn(idx, i));
}

export function hasSegments(
  indeces: number[],
  num: number,
  segments: Map<string, boolean>
) {
  return indeces.some((i) => segments.has(`${i}.${num}`));
}

export const getBoxAndLinearNeighbours = (
  idx: number,
  number: number,
  segments: Map<string, boolean>
) => {
  const linearNeighbours = getNeighbourIds(idx, "linear");
  const boxNeighbours = getNeighbourIds(idx, "box");
  const hasLinearNeighbours = hasSegments(linearNeighbours, number, segments);
  const hasBoxNeighbours = hasSegments(boxNeighbours, number, segments);
  return {
    hasLinearNeighbours,
    hasBoxNeighbours,
  };
};
