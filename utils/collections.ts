type clusterType = {
    type: string;
    index: number;
    positionCluster: Array<number>;
    canContainNumbers: Set<number>;
    canRemoveInner?: any;
}

type groupType = {
    positions: Set<number>;
    type: string;
    number: number;
}

type ClusterParams = {
    value: number;
    type: string;
    index: number;
    positions: Array<number>;
}

class CollectionsG<MapValType> {
    protected data: Map<string, MapValType>;
    constructor () {
        this.data = new Map();
    }

    get values() { return this.data; }
}

export class Collections extends CollectionsG<Set<number>> {
    constructor() {
        super();
    }
    add = (key: string, value: number):void => { // setter
        if(!this.data.has(key)){
            this.data.set(key, new Set());
        }
        this.data.get(key)?.add(value);
    }
}

export class CollectionsGrouping extends CollectionsG<groupType> {
    constructor() {
        super();
    }
    add = (key: string, value: number):void => { // setter
        if(!this.data.has(key)){
            this.data.set(key, { 
                type: 'type',
                number: 1,
                positions: new Set() 
            });
        }
        this.data.get(key)?.positions.add(value);
    }
}

export class CollectionsGroup extends CollectionsG<Map<string, clusterType>> {
    constructor() {
        super();
    }
    add = (params: ClusterParams):void => { // setter
        const { value, type, index, positions } = params;
        const key = `${type}.${index}`;
        const key2 = positions.join();
        if(!this.data.has(key)){
            this.data.set(key, new Map());
        }
        if(!this.data.get(key)?.has(key2)){
            this.data.get(key)?.set(key2, { 
                type, index, positionCluster: positions,
                canContainNumbers: new Set()} 
            );
        }
        this.data.get(key)?.get(key2)?.canContainNumbers.add(value);
    }
}