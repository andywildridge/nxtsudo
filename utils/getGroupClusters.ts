import {
  CollectionsClusters,
  CollectionsNumbers,
  GroupType,
} from "./collections";
import { groupIndeces } from "./indexTransforms";
import Removables from "./Removable";

export const getGroupClusters = (
  possibles: ReadonlyMap<number, Set<number>>,
  groupings: CollectionsNumbers,
  removables: Removables
) => {
  const clustersNumbers = new CollectionsClusters();
  const clustersGroups = new CollectionsClusters();
  for (let [key, group] of groupings.values) {
    clustersGroups.add(
      {
        type: group.type,
        index: group.index,
        positions: [...group.possibles],
      },
      group.number
    );

    //type,number index/possible clusters
    clustersNumbers.add(
      {
        type: group.type,
        index: group.number,
        positions: [...group.possibles],
      },
      group.index
    );
  }

  interface Cluster {
    type: GroupType;
    contains: number[];
    positions: number[];
    index: number;
  }

  function getContainedSquaresXwing(cluster: Cluster): number[] {
    return cluster.contains
      .map((idx: number) => [
        ...groupIndeces[cluster.type](idx).filter((n, idx) =>
          cluster.positions.includes(idx)
        ),
      ])
      .flat();
  }

  function getRelatedSquaresXwing(cluster: Cluster): number[] {
    const oppositeType = cluster.type === "row" ? "col" : "row";
    return cluster.positions
      .map((idx: number) => [...groupIndeces[oppositeType](idx)])
      .flat(); //very testable!
  }

  clustersNumbers.groups.forEach((cluster: Cluster) => {
    if (cluster.type === "box") {
      return; // filter this idiomatic
    }
    let contained = getContainedSquaresXwing(cluster);
    let related = getRelatedSquaresXwing(cluster).filter(
      (i) => !contained.includes(i)
    );
    let deletable = related
      .filter((i) => possibles.get(i)?.has(cluster.index))
      .map((i) => ({ number: cluster.index, square: i }));

    removables.add({
      because: "xwing",
      deletable,
      related,
      contained,
    });
  });

  function getContainedSquaresGroup(cluster: Cluster): number[] {
    return [
      ...groupIndeces[cluster.type](cluster.index).filter((n, idx) =>
        cluster.positions.includes(idx)
      ),
    ];
  }

  function getRelatedSquaresGroup(cluster: Cluster): number[] {
    return [...groupIndeces[cluster.type](cluster.index)];
  }

  clustersGroups.groups.forEach((cluster: Cluster) => {
    let contained = getContainedSquaresGroup(cluster);
    const canRemove: { square: number; number: number }[] = [];
    let related = getRelatedSquaresGroup(cluster).filter(
      (c) => !contained.includes(c)
    );
    related.forEach((square) => {
      cluster.contains.forEach((number) => {
        if (possibles.get(square)?.has(number)) {
          canRemove.push({ number, square });
        }
      });
    });
    contained.forEach((square) => {
      const p = [...(possibles.get(square) ?? [])];
      p.forEach((number) => {
        if (!cluster.contains.includes(number)) {
          canRemove.push({ number, square });
        }
      });
    });

    removables.add({
      because: `group ${canRemove}`,
      deletable: canRemove,
      related,
      contained,
    });
  });

  const solvedSingles = clustersGroups.singles.map((single) => ({
    square: groupIndeces[single.type](single.index)[single.positions[0]],
    number: single.contains[0],
    because: `${single.contains[0]} can only appear in ${single.type} in this position`,
  }));

  return {
    removables,
    solvedSingles,
  };
};
