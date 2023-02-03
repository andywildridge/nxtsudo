//TYPES
type clusterType = {
  type: string;
  index: number;
  positionCluster: Array<number>;
  canContainNumbers: Set<number>;
  canRemoveInner?: any;
};

type ClusterType = {
  type: string;
  index: number;
  positions: Array<number>;
  contains: Set<number>;
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

type ClusterParams2 = {
  type: string;
  index: number;
  positions: Array<number>;
};

const equalsOne = (n: number) => n === 1;
const greaterThanOne = (n: number) => n > 1;

//COLLECTION CLASSES
//BASE defn
class CollectionsBase<CollectionType> {
  protected data: Map<string, CollectionType>;
  constructor() {
    this.data = new Map();
  }

  get values() {
    return this.data;
  }
}

//Generic collection type (combination string keys)
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

type GroupType = "row" | "col" | "box" | "segment";

interface CollectionTypeIndexNumberInputs {
  type: GroupType;
  index: number;
  number: number;
}
interface CollectionTypeIndexNumberProperties
  extends CollectionTypeIndexNumberInputs {
  possibles: Set<number>;
}

export class CollectionsGroup extends CollectionsBase<
  Map<string, clusterType>
> {
  constructor() {
    super();
  }
  add = (params: ClusterParams): void => {
    // setter
    const { value, type, index, positions } = params;
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

export class CollectionsGroup2 extends CollectionsBase<ClusterType> {
  constructor() {
    super();
  }
  add = (params: ClusterParams2, value: number): void => {
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
    const singles = [];
    for (let [_key, item] of this.data) {
      if (
        range(item.contains.size) &&
        item.contains.size === item.positions.length
      ) {
        singles.push({
          ...item,
          type: item.type as GroupType,
          contains: [...item.contains],
        });
      }
    }
    return singles;
  };

  get singles() {
    return this.getCluster(equalsOne);
  }

  get groups() {
    return this.getCluster(greaterThanOne);
  }
}

export class CollectionsGroup3 extends CollectionsBase<CollectionTypeIndexNumberProperties> {
  constructor() {
    super();
  }
  add = (params: CollectionTypeIndexNumberInputs, value: number): void => {
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
