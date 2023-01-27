import { CollectionTypeIndexNumber, CollectionsGroup } from "./collections";
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
  const clusters = new CollectionsGroup();
  for (let [key, group] of groupings.values) {
    //type,index number/possible clusters
    console.log("group", group);
    clusters.add({
      value: group.number,
      type: group.type,
      isNumberCluster: false,
      index: group.index,
      positions: [...group.possibles],
    });

    //type,number index/possible clusters
    clusters.add({
      value: group.index,
      type: group.type,
      isNumberCluster: true,
      index: group.number,
      positions: [...group.possibles],
    });
  }
  // clusters now a map of uniquie possible sets as keys and position distribution as values;

  interface StringMap {
    [key: string]: any;
  }

  const groups = [];
  const singles = [];

  for (let [_key, item] of clusters.values) {
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
          const canRemoveOuter = groupIndeces[oppositeType](opp).filter(
            (i, idx) =>
              !obj.canContainNumbers.has(idx) &&
              [...(possibles.get(i) || [])].includes(obj.index)
          );
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
        let canRemoveOuter = related.filter(
          (i: { idx: number; vals: Set<number> | undefined }, idx: number) => {
            if (i.vals && !obj.positionCluster.includes(idx)) {
              let trim = [...i.vals].filter((i) =>
                [...obj.canContainNumbers].includes(i)
              );
              if (trim.length) {
                return true;
              }
            }
          }
        );
        groups.push({
          ...obj,
          related,
          canRemoveInner,
          canRemoveOuter,
          because: `group ${obj.type} ${obj.index} ${obj?.canContainNumbers}`,
        });
      }
    }
  }

  console.log("clusters", clusters);

  return {
    groups,
    singles,
  };
};
