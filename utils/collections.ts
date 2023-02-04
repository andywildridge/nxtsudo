export type GroupType = "row" | "col" | "box" | "segment";

//BASE class defn
class CollectionsBase<CollectionType> {
  protected data: Map<string, CollectionType>;
  constructor() {
    this.data = new Map();
  }

  get values() {
    return this.data;
  }
}

export class GroupMapNumberSet extends CollectionsBase<Set<number>> {
  constructor() {
    super();
  }
  add = (key: string, value: number): void => {
    // setter
    if (!this.data.has(key)) {
      this.data.set(key, new Set());
    }
    this.data.get(key)?.add(value);
  };
}

type GroupIndex = {
  type: GroupType;
  index: number;
};

interface CollectionNumberParams extends GroupIndex {
  number: number;
}
interface CollectionNumberData extends CollectionNumberParams {
  possibles: Set<number>;
}
export class CollectionsNumbers extends CollectionsBase<CollectionNumberData> {
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

interface GroupParams extends GroupIndex {
  value: number;
  positions: Array<number>;
}

export interface GroupData extends GroupIndex {
  positionCluster: Array<number>;
  canContainNumbers: Set<number>;
}

export class CollectionsGroup extends CollectionsBase<Map<string, GroupData>> {
  constructor() {
    super();
  }
  add = (params: GroupParams): void => {
    // setter
    const { type, index, value, positions } = params;
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

interface ClusterParams extends GroupIndex {
  positions: Array<number>;
}
export interface ClusterData extends ClusterParams {
  contains: Set<number>;
}
export class CollectionsClusters extends CollectionsBase<ClusterData> {
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
