import { CollectionsGroup } from "./collections";
// find clusters where possible positions are equal to possible numbers
export function getBlockingClusters(
  clusters: CollectionsGroup,
  minSize: number
) {
  const blockingCluster: {
    positionCluster: Array<number>;
    canContainNumbers: Set<number>;
    canContain: number[];
  }[] = []; //import type?
  clusters.values.forEach((cluster) => {
    cluster.forEach((clusterObj) => {
      if (
        clusterObj.canContainNumbers.size >= minSize &&
        clusterObj.canContainNumbers.size === clusterObj.positionCluster.length
      ) {
        blockingCluster.push({
          ...clusterObj,
          canContain: [...clusterObj.canContainNumbers],
        });
      }
    });
  });
  return blockingCluster;
}
