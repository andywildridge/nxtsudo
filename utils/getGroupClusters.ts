import { CollectionTypeIndexNumber, CollectionsGroup } from "./collections";
import { getBlockingClusters } from "./getBlockingClusters";
import { groupIndeces, GroupType } from "./indexTransforms";

export const getGroupClusters = (
  possibles: ReadonlyMap<number, Set<number>>,
  groupings: CollectionTypeIndexNumber
) => {
  //function find group clusters
  //fold groups into row 0, clusters boxes (in lines)?
  //fold groups into rows/cols, , number n, clusters
  // func clusters = getClusters(groupings)
  // reverses position and possibles
  //console.log(groupings);
  const clustersGroups = new CollectionsGroup();
  const clustersNumbers = new CollectionsGroup();
  for (let [key, group] of groupings.values) {
    //type,index number/possible clusters
    console.log("group", group);
    clustersGroups.add({
      value: group.number,
      type: group.type,
      index: group.index,
      positions: [...group.possibles],
    });

    //type,number index/possible clusters
    clustersNumbers.add({
      // add is the params, creates a record of 2 sets/arrays possible positions/possible numbers in group
      value: group.index,
      type: group.type,
      index: group.number,
      positions: [...group.possibles],
    });
  }
  // clusters now a map of uniquie possible sets as keys and position distribution as values;

  const groups: unknown = [];
  const singles: unknown = [];

  type GroupType = "row" | "col" | "box";

  interface cluster {
    type: GroupType;
    canContain: number[];
    positionCluster: number[];
    index: number;
  }

  let b: cluster[] = getBlockingClusters(clustersGroups, 1) as cluster[];
  let x: cluster[] = getBlockingClusters(clustersNumbers, 2) as cluster[];

  console.log(b);
  console.log(x);

  const clusterRemovables: {}[] = [];

  // get related squares x wing and blocked squares
  function getContainedSquaresXwing(cluster: {
    type: GroupType;
    canContain: number[];
    positionCluster: number[];
    index: number;
  }) {
    return cluster.canContain.map((idx: number) => [
      ...groupIndeces[cluster.type](idx).filter((n, idx) =>
        cluster.positionCluster.includes(idx)
      ),
    ]);
  }

  function getRelatedSquaresXwing(cluster: {
    type: GroupType;
    canContain: number[];
    positionCluster: number[];
    index: number;
  }) {
    if (cluster.type === "box") {
      return [];
    }
    const oppositeType = cluster.type === "row" ? "col" : "row";
    return cluster.positionCluster.map((idx: number) => [
      ...groupIndeces[oppositeType](idx),
    ]);
  }

  x.forEach(
    (cluster: {
      type: GroupType;
      canContain: number[];
      positionCluster: number[];
      index: number;
    }) => {
      let a = getContainedSquaresXwing(cluster).flat();
      let b = getRelatedSquaresXwing(cluster).flat();
      let c = b.filter((c) => !a.includes(c));
      console.log(a, b, c);
      let d = c.filter((e) => possibles.get(e)?.has(cluster.index));
      console.log(d);
      clusterRemovables.push({
        group: a,
        related: b,
        canRemove: { square: d, num: cluster.index },
        because: "because xwing",
      });
    }
  );

  function getContainedSquaresGroup(cluster: {
    type: GroupType;
    canContain: number[];
    positionCluster: number[];
    index: number;
  }) {
    return [
      ...groupIndeces[cluster.type](cluster.index).filter((n, idx) =>
        cluster.positionCluster.includes(idx)
      ),
    ];
  }

  function getRelatedSquaresGroup(cluster: {
    type: GroupType;
    canContain: number[];
    positionCluster: number[];
    index: number;
  }) {
    return [...groupIndeces[cluster.type](cluster.index)];
  }

  b.forEach(
    (cluster: {
      type: GroupType;
      canContain: number[];
      positionCluster: number[];
      index: number;
    }) => {
      let a = getContainedSquaresGroup(cluster);
      const canRemove: unknown[] = [];
      if (cluster.canContain.length === 1) {
        //singles.push()
        console.log("single", cluster, a);
      } else {
        let c = getRelatedSquaresGroup(cluster).filter((c) => !a.includes(c));
        c.forEach((square) => {
          cluster.canContain.forEach((num) => {
            if (possibles.get(square)?.has(num)) {
              canRemove.push({ num, square });
            }
          });
        });
        a.forEach((square) => {
          const p = [...(possibles.get(square) ?? [])];
          p.forEach((num) => {
            if (!cluster.canContain.includes(num)) {
              canRemove.push({ num, square });
            }
          });
        });
        console.log(a, c, canRemove);
        // push can removes cluster, a, c, can remove, can contain
        clusterRemovables.push({
          group: a,
          related: c,
          canRemove,
          because: "because group",
        });
      }
    }
  );

  console.log(clusterRemovables);

  /*for (let [_key, item] of clusters.values) {
    //item = possible clusterBlock
    for (let [_key, obj] of item) {
      //obj =
      // only process groups not number groupss here where > 1
      if (obj.isNumberCluster && obj.positionCluster.length === 1) {
        continue;
      } // skip single num as picked up elswheres

      if (obj.positionCluster.length !== obj.canContainNumbers.size) {
        continue;
      }

      if (obj.positionCluster.length === 1) {
        singles.push({
          square: groupIndeces[obj.type as GroupType](obj.index)[
            obj.positionCluster[0]
          ],
          type: obj.type,
          number: [...obj.canContainNumbers][0],
          because: `only place this number can go on this ${obj.type}`,
        });
      }

      //xwing
      if (obj.positionCluster.length > 1 && obj.isNumberCluster) {
        if (obj.type === "box") {
          continue;
        }
        const oppositeType = obj.type === "row" ? "col" : "row";
        const canDelete = [];
        obj.positionCluster.forEach((opp) => {
          const canRemoveOuter = groupIndeces[oppositeType](opp)
            .filter(
              (i, idx) =>
                !obj.canContainNumbers.has(idx) &&
                [...(possibles.get(i) || [])].includes(obj.index)
            )
            .map((i) => ({ idx: i, vals: [obj.index] }));
          //console.log(canRemoveOuter);
          if (canRemoveOuter.length) {
            groups.push({ ...obj, canRemoveOuter, because: "xwing" });
          }
        });
      }

      //grouping
      if (obj.positionCluster.length > 1 && !obj.isNumberCluster) {
        let related = groupIndeces[obj.type as GroupType](obj.index).map(
          (idx: number) => ({
            idx,
            vals: possibles.get(idx),
          })
        );
        let canRemoveInnerFind = related.filter(
          (i: { idx: number; vals: Set<number> | undefined }, idx: number) => {
            if (i.vals && obj.positionCluster.includes(idx)) {
              let trim = [...i.vals].filter((i) =>
                [...obj.canContainNumbers].includes(i)
              );
              if (i.vals && trim.length) {
                return true;
              }
            }
          }
        ) as Array<{ idx: number; vals: Set<number> }>;
        let canRemoveInner = canRemoveInnerFind.map(
          (i: { idx: number; vals: Set<number> }) => ({
            idx: i.idx,
            vals: [...i.vals].filter(
              (i) => ![...obj.canContainNumbers].includes(i)
            ),
          })
        );
        let canRemoveOuter = related
          .filter(
            (
              i: { idx: number; vals: Set<number> | undefined },
              idx: number
            ) => {
              if (i.vals && !obj.positionCluster.includes(idx)) {
                let trim = [...i.vals].filter((i) =>
                  [...obj.canContainNumbers].includes(i)
                );
                if (trim.length) {
                  return true;
                }
              }
            }
          )
          .map((i) => ({ ...i, vals: [...(i.vals ?? [])] }));
        groups.push({
          ...obj,
          related,
          canRemoveOuter: [...canRemoveOuter, ...canRemoveInner],
          because: `group ${obj.type} ${obj.index} ${obj?.canContainNumbers}`,
        });
      }
    }
  }*/

  console.log("clusters", clustersGroups);
  console.log("clusters", clustersNumbers);

  return {
    groups,
    singles,
  };
};
