type GroupType = "row" | "col" | "box";
//BASE class defn
interface CollectionsBaseInterface<CollectionType> {
  values: Map<string, CollectionType>;
}
class CollectionsBase<CollectionType>
  implements CollectionsBaseInterface<CollectionType>
{
  protected data: Map<string, CollectionType>;
  constructor() {
    this.data = new Map();
  }

  get values() {
    return this.data;
  }
}

interface GroupAddParams {
  type: GroupType;
  index: number;
}
interface IsGroupPossibles {
  add({ type, index }: GroupAddParams, value: number): void;
} /* For example the numbers a, b, c are in row x */

class GroupPossibles
  extends CollectionsBase<Set<number>>
  implements IsGroupPossibles
{
  constructor() {
    super();
  }
  add = ({ type, index }: GroupAddParams, value: number): void => {
    // setter
    const key = `${type}.${index}`;
    if (!this.data.has(key)) {
      this.data.set(key, new Set());
    }
    this.data.get(key)?.add(value);
  };
}

interface CollectionNumberParams extends GroupAddParams {
  number: number;
}
interface CollectionNumberData extends CollectionNumberParams {
  possibles: Set<number>;
} /* For example number n can appear in row x in positions a, b, c */
class CollectionsNumbers extends CollectionsBase<CollectionNumberData> {
  constructor() {
    super();
  }
  add = (params: CollectionNumberParams, value: number): void => {
    const { type, index, number } = params;
    const key = `${type}.${index}:${number}`;
    if (!this.data.has(key)) {
      this.data.set(key, {
        ...params,
        possibles: new Set(),
      });
    }
    this.data.get(key)?.possibles.add(value);
  };
}

interface GroupParams extends GroupAddParams {
  positions: Array<number>;
}

export interface GroupData extends GroupAddParams {
  positionCluster: Array<number>;
  canContainNumbers: Set<number>;
}

/* For example numbers a, b, c can appear positions aa, bb, cc  */
class CollectionsGroup extends CollectionsBase<Map<string, GroupData>> {
  constructor() {
    super();
  }
  add = (params: GroupParams, value: number): void => {
    // setter
    const { type, index, positions } = params;
    const keyType = `${type}.${index}`;
    const keyPositions = positions.join();
    if (!this.data.has(keyType)) {
      this.data.set(keyType, new Map());
    }
    if (!this.data.get(keyType)?.has(keyPositions)) {
      this.data.get(keyType)?.set(keyPositions, {
        type,
        index,
        positionCluster: positions,
        canContainNumbers: new Set(),
      });
    }
    this.data.get(keyType)?.get(keyPositions)?.canContainNumbers.add(value);
  };
}

interface ClusterParams extends GroupAddParams {
  positions: Array<number>;
}
interface ClusterData extends ClusterParams {
  contains: Set<number>;
}

interface Cluster {
  type: GroupType;
  contains: number[];
  positions: number[];
  index: number;
}
interface IsCollectionClusters {
  add(params: ClusterParams, value: number): void;
  singles: Cluster[];
  groups: Cluster[];
}
class CollectionsClusters
  extends CollectionsBase<ClusterData>
  implements IsCollectionClusters
{
  constructor() {
    super();
  }
  add = (params: ClusterParams, value: number): void => {
    const { type, index, positions } = params;
    const key = `${type}.${index}[${positions.join()}]`;
    if (!this.data.has(key)) {
      this.data.set(key, {
        ...params,
        contains: new Set(),
      });
    }
    this.data.get(key)?.contains.add(value);
  };

  private getCluster = (range: (n: number) => boolean) => {
    const cluster = [];
    for (let [_key, item] of this.data) {
      if (
        range(item.contains.size) &&
        item.contains.size === item.positions.length
      ) {
        cluster.push({
          ...item,
          type: item.type as GroupType,
          contains: [...item.contains],
        });
      }
    }
    return cluster;
  };

  get singles() {
    return this.getCluster((n: number) => n === 1);
  }

  get groups() {
    return this.getCluster((n: number) => n > 1);
  }
}

export {
  type GroupType,
  type ClusterData,
  CollectionsNumbers,
  GroupPossibles,
  CollectionsClusters,
  CollectionsGroup,
};
