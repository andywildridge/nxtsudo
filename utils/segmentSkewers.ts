import { groupIndeces } from "./indexTransforms";
import Removables from "./Removable";

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

function getRemovables(
  idx: number,
  num: number,
  type: "linear" | "box",
  possibles: ReadonlyMap<number, Set<number>>
) {
  let indeces = getNeighbourIds(idx, type).flatMap((i) =>
    groupIndeces.segment(i).filter((idx) => possibles.get(idx)?.has(num))
  );
  return {
    because: `neighbour ${type} skewer seg ${idx}:${num}`,
    deletable: indeces.map((s) => ({ square: s, number: num })),
    related: [1],
    contained: [1],
  };
}

export const getSegementDeletors = (
  possibles: ReadonlyMap<number, Set<number>>,
  segments: Map<string, boolean>
) => {
  const removables = new Removables();

  for (let [key] of segments) {
    const [idx, num] = key.split(".").map((i) => Number(i));
    const { hasLinearNeighbours, hasBoxNeighbours } = getBoxAndLinearNeighbours(
      idx,
      num,
      segments
    );
    if (hasLinearNeighbours === hasBoxNeighbours) {
      //skip this segment as cannot delete neighbours
      continue;
    }
    removables.add(
      getRemovables(idx, num, hasLinearNeighbours ? "linear" : "box", possibles)
    );
  }

  return removables;
};
