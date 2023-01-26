import { Collections, CollectionsGroup } from "./collections";
import { groupIndeces, GroupType } from "./indexTransforms";

export const getGroupClusters = (
  possibles: ReadonlyMap<number, Set<number>>,
  groupings: Collections
) => {
  //function find group clusters
  //fold groups into row 0, clusters boxes (in lines)?
  //fold groups into rows/cols, , number n, clusters
  // func clusters = getClusters(groupings)
  // reverses position and possibles
  //console.log(groupings);
  const clusters = new CollectionsGroup();
  for (let [key, positions] of groupings.values) {
    //type,index number/possible clusters
    clusters.add({
      value: ~~key.split(".")[1].split(":")[1],
      type: key.split(".")[0].split(":")[0],
      index: ~~key.split(".")[0].split(":")[1],
      positions: [...positions],
    });

    //type,number index/possible clusters
    clusters.add({
      value: ~~key.split(".")[0].split(":")[1],
      type: `${key.split(".")[0].split(":")[0]}.num`,
      index: ~~key.split(".")[1].split(":")[1],
      positions: [...positions],
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
      if (obj.type.indexOf("num") > -1 && obj.positionCluster.length === 1) {
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

      if (obj.positionCluster.length > 1 && obj.type.indexOf("num") > -1) {
        console.log(obj);
        const type = obj.type.split(".")[0];
        if (type === "box") {
          continue;
        }
        const oppositeType = type === "row" ? "col" : "row";
        const canDelete = [];
        obj.positionCluster.forEach((opp) => {
          const canRemoveOuter = groupIndeces[oppositeType](opp).filter(
            (i, idx) =>
              !obj.canContainNumbers.has(idx) &&
              [...(possibles.get(i) || [])].includes(obj.index)
          );
          console.log(canRemoveOuter);
          if (canRemoveOuter.length) {
            groups.push({ ...obj, canRemoveOuter, because: "xwing" });
          }
        });
      }

      if (obj.positionCluster.length > 1 && obj.type.indexOf("num") === -1) {
        let type = obj.type.split(".")[0];
        let related = groupIndeces[type as GroupType](obj.index).map(
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
        groups.push({ ...obj, related, canRemoveInner, canRemoveOuter });
      }
    }
  }

  //func canReject/omit = getBlocked(groups);
  let deletors: StringMap = {};
  let deletorsAll: Array<{
    idx: number;
    nums: Array<number>;
    because: string;
  }> = [];
  // groups
  /*clusters.values.forEach(i=>{
        if(i.numbers.size >= 1) {
            console.log(i, i.canRemoveInner);
            i.canRemoveInner && i.canRemoveInner.forEach((ii:StringMap)=>{
                //if(deletors[i.idx]){ console.log('dupe', i, deletors[i.idx]) }
                //deletors[i.idx] = i.vals;
                if(i.type.indexOf('.num') === -1) {
                    deletorsAll.push({ idx: ii.idx, nums: ii.vals, because: `because ${i.type} idx:${i.index} pos:${i.positions} num:${[...i.numbers]}`});
                }
            });
        }
    });*/
  //console.log(clusters.values);
  return {
    groups,
    singles,
  };
};
