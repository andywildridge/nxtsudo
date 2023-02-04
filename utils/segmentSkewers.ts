import { groupIndeces } from "./indexTransforms";
import Removables from "./Removable";
import {
  getNeighbourIds,
  getBoxAndLinearNeighbours,
} from "./segmentSkewers.utils";

function getRemovables(
  idx: number,
  number: number,
  type: "linear" | "box",
  possibles: ReadonlyMap<number, Set<number>>
) {
  let indeces = getNeighbourIds(idx, type).flatMap((i) =>
    groupIndeces.segment(i).filter((idx) => possibles.get(idx)?.has(number))
  );
  const deletable = indeces.map((square) => ({ square, number }));
  const contained = groupIndeces
    .segment(idx)
    .filter((idx) => possibles.get(idx)?.has(number));
  return {
    because: `neighbour ${type} skewer seg ${contained}:${number} can delete ${indeces}\n`,
    deletable,
    related: groupIndeces.segment(idx),
    contained: contained,
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
