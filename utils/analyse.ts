import { indexToRow, indexToCol, indexToBox, indexToSegH, indexToSegV, groupIndeces } from './indexTransforms'

class Collections {
    private data: Map<string, Set<number>>;
    constructor() {
      this.data = new Map();
    }
  
    get values() {
      return this.data;
    }
  
    add = (key: string, value: number): void => {
      // setter
      if (!this.data.has(key)) {
        this.data.set(key, new Set());
      }
      this.data.get(key)?.add(value);
    };
}

type clusterType = {
    type: string;
    index: number;
    positions: Array<number>;
    numbers: Set<number>;
    canRemoveInner?: any;
}

type C3params = {
    value: number;
    type: string;
    index: number;
    positions: Array<number>;
}

class Collection3 {
    private data: Map<string, Map<string, clusterType>>;
    constructor () {
        this.data = new Map();
    }

    get values() { return this.data; }

    add = (params: C3params):void => { // setter
        const { value, type, index, positions } = params;
        const key = `${type}.${index}`;
        const key2 = positions.join();
        if(!this.data.has(key)){
            this.data.set(key, new Map());
        }
        if(!this.data.get(key)?.has(key2)){
            this.data.get(key)?.set(key2, { 
                type, index, positions,
                numbers: new Set()} 
            );
        }
        this.data.get(key)?.get(key2)?.numbers.add(value);
    }
}

 export const analyse = (pss: ReadonlyMap<number, Set<number>>) => {
    //pss.set(1, new Set([1]))
    /////////////////////////////////////////////////////////////////////////////////////////////

    //loop squares
    //function find group possibles
    // add to row, col, box, seg groups
    //group.add('row.1.num.2',3);
    //group.add('seg.1.num.2',3);
    // can filter singles/only number possible in col, square, box groups (but no need as grouping? - no only check doubles? tidier for highlighting removables)
    //function outs = getRCBs(pss) / segs = getSegs(pss)
    let outs = new Collections();
    let segs = new Map();
    for (let [idx, poss] of pss) {
        let r = indexToRow(idx);
        let c = indexToCol(idx);
        let b = indexToBox(idx);
        let h = indexToSegH(idx);
        let v = indexToSegV(idx);
        [...poss].forEach((number)=>{
            outs.add(`row:${r.idx}.num:${number}`,r.pos);
            outs.add(`col:${c.idx}.num:${number}`,c.pos);
            outs.add(`box:${b.idx}.num:${number}`,b.pos);
            segs.set(`${h}.${number}`,true);
            segs.set(`${v + 27}.${number}`,true);
        })
    }
    //console.log(outs.values);
    //console.log(segs);
    //function find seg skewers

    const segDeletors = [];

    for(let [key] of segs) {
        let [ idx, num ] = key.split('.');
        let third = +idx%3;
        let neighbours = [0,1,2].filter(i=>i!==third).map(i=>(+idx)+(i-third));
        let z = [ false, false ]
        if(!segs.has(`${[neighbours[0]]}.${num}`) && !segs.has(`${[neighbours[1]]}.${num}`)) {   
            z[0] = true;
        }
        let x = Math.floor((+idx%9)/3);
        let neighboursBox = [0,1,2].filter(i=>i!==x).map(i=>(+idx)+(((i-x)*3)));
        if(!segs.has(`${[neighboursBox[0]]}.${num}`) && !segs.has(`${[neighboursBox[1]]}.${num}`)) {
            z[1] = true;
        }
        if(z[0] !== z[1]){ 
            //console.log(key, third, neighbours, z[0]);
            //console.log(key, x, neighboursBox, z[1]);
            //console.log('skewered!');
            if(!z[0]) { // check neighbours for deletes
                let idx = neighbours.flatMap(i=> groupIndeces.segment(i).filter(idx=>pss.get(idx)?.has(+num)));
                //console.log(idx);
                segDeletors.push({ num: +num, idx, because: `neighbour linear skewer seg ${key}` });
            }else{ // check neighboursbox for deletes
                let idx = neighboursBox.flatMap(i=> groupIndeces.segment(i).filter(idx=>pss.get(idx)?.has(+num)));
                //console.log(idx);
                segDeletors.push({ num: +num, idx, because: `neighbour box skewer seg ${key}` });
            }
        }
    }

    

    //function find group clusters
    //fold groups into row 0, clusters boxes (in lines)?
    //fold groups into rows/cols, , number n, clusters
    // func clusters = getClusters(outs)
    const clusters = new Collection3();
    for (let [key, poss] of outs.values) {
        //type,index number/possible clusters
        clusters.add({
            value: ~~key.split('.')[1].split(':')[1],
            type: key.split('.')[0].split(':')[0],
            index: ~~key.split('.')[0].split(':')[1],
            positions: [...poss]
        });
        
        //type,number index/possible clusters
        clusters.add({
            value: ~~key.split('.')[0].split(':')[1],
            type: `${key.split('.')[0].split(':')[0]}.num`,
            index: ~~key.split('.')[1].split(':')[1],
            positions: [...poss]
        });
        
    }
    //console.log(clusters.values);





    //console.log('G',groups);
    // singles/cam_solve = cansolve(pss);
    const setters = [];
    //square singles
    for(let [key, item] of pss) {
        if(item.size === 1){
            //console.log(key, item);
            setters.push({key, item});
        }
    }

    /*
    //func groupsOf clusters = getGroups(clusters)
    const groups = [];
    // singles
    groups.forEach(i=>{
        if(i.numbers.size === 1) {
            console.log(i);
            setters.push({key: groupIndeces[i.type](i.index)[i.positions[0]], item: i.numbers});
        }
    });

    interface StringMap { [key: string]: any; }

    //func canReject/omit = getBlocked(groups);
    let deletors:StringMap = {};
    let deletorsAll: Array<{ idx: number, nums: Array<number>, because: string}> = [];
    // groups
    groups.forEach(i=>{
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
    })
    */

    //console.log(pss);
    //console.log(deletors);
    return {
        setters,
        //deletors,
        //deletorsAll,
        segDeletors
    }

}