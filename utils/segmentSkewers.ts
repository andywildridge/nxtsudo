import { groupIndeces } from "./indexTransforms";
import Removables from "./Removable";
import {
  getNeighbourIds,
  getBoxAndLinearNeighbours,
} from "./segmentSkewers.utils";

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
