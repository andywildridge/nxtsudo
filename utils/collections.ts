//TYPES
type clusterType = {
  type: string;
  index: number;
  positionCluster: Array<number>;
  canContainNumbers: Set<number>;
  canRemoveInner?: any;
};

type groupType = {
  positions: Set<number>;
  type: string;
  number: number;
};

type ClusterParams = {
  value: number;
  type: string;
  index: number;
  positions: Array<number>;
};

//COLLECTION CLASSES
//BASE defn
class CollectionsBase<KeyType, CollectionType> {
  protected data: Map<KeyType, CollectionType>;
  constructor() {
    this.data = new Map();
  }

  get values() {
    return this.data;
  }
}

//Generic collection type (combination string keys)
export class Collections extends CollectionsBase<string, Set<number>> {
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

enum GroupType {
  row = "row",
  col = "col",
  box = "box",
  segment = "segment",
}

interface GroupByBumber {
  possibles: Set<number>;
  type: GroupType;
  index: number;
  number: number;
}
export class CollectionGroupByNumber extends CollectionsBase<
  string,
  GroupByBumber
> {
  constructor() {
    super();
  }
  add = ({ type, index, number }: GroupByBumber, position: number): void => {
    // setter
    const key = `${type}.${type}:${number}`;
    if (!this.data.has(key)) {
      this.data.set(key, {
        type,
        index,
        number,
        possibles: new Set(),
      });
    }
    this.data.get(key)?.possibles.add(position);
  };
}

export class CollectionsGrouping extends CollectionsBase<string, groupType> {
  constructor() {
    super();
  }
  add = (key: string, value: number): void => {
    // setter
    if (!this.data.has(key)) {
      this.data.set(key, {
        type: "type",
        number: 1,
        positions: new Set(),
      });
    }
    this.data.get(key)?.positions.add(value);
  };
}

export class CollectionsGroup extends CollectionsBase<
  string,
  Map<string, clusterType>
> {
  constructor() {
    super();
  }
  add = (params: ClusterParams): void => {
    // setter
    const { value, type, index, positions } = params;
    const key = `${type}.${index}`;
    const key2 = positions.join();
    if (!this.data.has(key)) {
      this.data.set(key, new Map());
    }
    if (!this.data.get(key)?.has(key2)) {
      this.data.get(key)?.set(key2, {
        type,
        index,
        positionCluster: positions,
        canContainNumbers: new Set(),
      });
    }
    this.data.get(key)?.get(key2)?.canContainNumbers.add(value);
  };
}
