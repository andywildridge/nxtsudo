//TYPES
type clusterType = {
  type: string;
  index: number;
  isNumberCluster: boolean;
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
  isNumberCluster: boolean;
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
export class CollectionNumberSet extends CollectionsBase<string, Set<number>> {
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
export class CollectionTypeIndexNumber extends CollectionsBase<
  string,
  CollectionTypeIndexNumberProperties
> {
  constructor() {
    super();
  }
  add = (
    { type, index, number }: CollectionTypeIndexNumberInputs,
    position: number
  ): void => {
    // setter
    const key = `${type}.${index}:${number}`;
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

export class CollectionsGroup extends CollectionsBase<
  string,
  Map<string, clusterType>
> {
  constructor() {
    super();
  }
  add = (params: ClusterParams): void => {
    // setter
    const { value, type, isNumberCluster, index, positions } = params;
    const keyType = `${type}.${index}`;
    const keyPositions = positions.join();
    if (!this.data.has(keyType)) {
      this.data.set(keyType, new Map());
    }
    if (!this.data.get(keyType)?.has(keyPositions)) {
      this.data.get(keyType)?.set(keyPositions, {
        type,
        index,
        isNumberCluster,
        positionCluster: positions,
        canContainNumbers: new Set(),
      });
    }
    this.data.get(keyType)?.get(keyPositions)?.canContainNumbers.add(value);
  };
}
