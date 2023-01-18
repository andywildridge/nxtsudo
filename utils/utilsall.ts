export {}

type CollectionType = {
    type: string;
    index: number;
    number: number;
    possibles: Set<number>;   
}

class Collections {
    private data: Map<string, Set<number>>;
    constructor () {
        this.data = new Map();
    }

    get values() { return this.data; }

    add = (key: string, value: number):void => { // setter
        if(!this.data.has(key)){
            this.data.set(key, new Set());
        }
        this.data.get(key)?.add(value);
    }
}



type clusterType = {
    type: string;
    index: number;
    positions: Array<number>;
    numbers: Set<number>;
    canRemoveInner?: any;
}

type C3params = {
    //key: string;
    //key2: string;
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

class CollectionsG<MapValType> {
    protected data: Map<string, MapValType>;
    constructor () {
        this.data = new Map();
    }

    get values() { return this.data; }
}

class Coll3 extends CollectionsG<Set<number>> {
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

class Coll3b extends CollectionsG<Map<string, clusterType>> {
    constructor() {
        super();
    }
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

type Position = {
    idx: number;
    pos: number;
}

const indexToRow = (idx: number): Position => ({ idx: Math.floor(idx/9), pos: idx%9 }); 
const indexToCol = (idx: number): Position => ({ idx: idx%9, pos: Math.floor(idx/9) }); 
const indexToBox = (idx: number): Position => ({ idx: Math.floor((idx % 9) / 3) + Math.floor(idx / 27) * 3 , pos: (3*Math.floor(idx%27/9) + (idx%3))});
const indexToSegH = (idx: number): number => (Math.floor(idx/3));
const indexToSegV = (idx: number): number => (idx%9*3+Math.floor(idx/27));

const rowIndeces = (idx:number): Array<number> => { 
    const indeces = []
    for(let i = 0; i<9; i++) { 
        indeces.push((idx*9) + i);
    }
    return indeces;
}

const colIndeces = (idx:number): Array<number> => { 
    const indeces = []
    for(let i = 0; i<9; i++) { 
        indeces.push((idx%9) + (i*9));
    }
    return indeces;
}

const boxIndeces = (idx:number): Array<number> => { 
    const indeces = [];
    const startIndex = (idx%3*3)+(Math.floor(idx/3)*27);
    for(let i = 0; i<9; i++) { 
        indeces.push(startIndex + i%3 + (Math.floor(i/3)*9));
    }
    return indeces;//indeces;
}

const segIndeces = (idx: number): Array<number> => { 
    let start: number;
    let step: number;
    if(idx < 27) {
        start = idx * 3;
        step = 1;
    }else {
        idx = idx - 27;
        start = Math.floor(idx / 3) + (idx % 3 * 27);
        step = 9;
    }
    return [0,1,2].map((i)=>start + (i*step));
}

interface StringMap { [key: string]: any; }

const groupIndeces:StringMap = {
    row: rowIndeces,
    col: colIndeces,
    box: boxIndeces
}

// not used?
// const setToKey = (set: Set<number>): string => [...set].join();

let sudokuStr =     `   000 070 300
                        900 050 400
                        038 902 510

                        084 029 630
                        569 080 241
                        320 000 900

                        093 005 824
                        840 230 000
                        000 894 063  `;

sudokuStr = `
                        003 000 907
                        050 090 030
                        000 053 206

                        060 900 040
                        001 000 000
                        040 500 060

                        000 019 305
                        070 030 090
                        002 000 604


`;

sudokuStr = `
                        000 000 000
                        000 000 000
                        000 000 000

                        000 000 000
                        000 000 000
                        000 000 000

                        000 000 000
                        000 000 000
                        000 000 000


`;

sudokuStr = `
                        000 000 200
                        000 050 009
                        002 709 003

                        003 000 072
                        040 007 905
                        009 010 608

                        500 098 000
                        000 300 000
                        091 645 000


`;

                        //box skewer 8 59 17 so can remove box 6 number 5 

let sudo = [...sudokuStr.replace(/\s/g, "")].map((i) => ~~i);

/////////////////////////////////////////////////////////////////////////////////////////////////

const rcb = (sudo: Array<number>): Map<string, Set<number>> => {
    //create collection of already solved numbers in groups row,col,box
    return sudo.reduce((result: Collections, val: number, idx: number): Collections => { 
        if(val>0){
            result.add(`row.${indexToRow(idx).idx}`,val);
            result.add(`col.${indexToCol(idx).idx}`,val);
            result.add(`box.${indexToBox(idx).idx}`,val);
        }
        return result;
    },  new Collections()).values;
}

///////////////////////////////////////////////////////////////////////////////////////////////

let rcbs = rcb(sudo);
console.log(rcbs);

const VALIDNUMBERS = [1,2,3,4,5,6,7,8,9];

const pss = new Map();
const solved = new Map<number, number>
for(let idx=0; idx<81; idx++) {
    if(sudo[idx] !== 0) { solved.set(idx, sudo[idx]) }
    let all = new Set([
        ...(rcbs.get(`row.${indexToRow(idx).idx}`) || []),
        ...(rcbs.get(`col.${indexToCol(idx).idx}`) || []),
        ...(rcbs.get(`box.${indexToBox(idx).idx}`) || [])
    ]);
    if(all.size && (sudo[idx] === 0)) {
        pss.set(idx, new Set([...(VALIDNUMBERS.filter(i=>!([...all].includes(i))))]));
    }  
}
//generics
function g<T>(val: T){
    return {
        val,
        isTrue: true
    }
}

console.log(g("1"));

const f = <T>(val: T) => ({
    val,
    isTrue: true
});

function a(arr: ReadonlyArray<number>){
    //arr.push(1);
    return arr;
}

console.log(a([1,2,3]));

console.log(f(1));
//generics

class C {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    method() {
        return "Hello, " + this.name;
    }
}

class D extends C {
    constructor(name: string) {
        super(name);
    }
    method() {
        return "yo, " + this.name;
    }
}

let cc = new C("andy");
let dd = new D("andy");

console.log(cc.method(), dd.method());

//initialise over
// we have poss/pss & solved
console.log(pss, solved);

const analyse = (pss: ReadonlyMap<number, Set<number>>) => {
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
                let idx = neighbours.flatMap(i=> segIndeces(i).filter(idx=>pss.get(idx)?.has(+num)));
                //console.log(idx);
                segDeletors.push({ num: +num, idx, because: `neighbour linear skewer seg ${key}` });
            }else{ // check neighboursbox for deletes
                let idx = neighboursBox.flatMap(i=> segIndeces(i).filter(idx=>pss.get(idx)?.has(+num)));
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

    //func groupsOf clusters = getGroups(clusters)
    const groups = [];

    for(let [_key, item] of clusters.values) {
        for(let [_key, obj] of item) {
            if(obj.type.indexOf('num')>-1 && obj.positions.length === 1) { continue; }
            if(obj.positions.length === obj.numbers.size) {
                let related = groupIndeces[obj.type.split('.')[0]](obj.index).map((idx: number)=> ({ idx, vals: pss.get(idx) })); 
                let canRemoveInner = related.filter((i: { idx:number, vals: Set<number> }, idx: number)=>{
                    if(i.vals && obj.positions.includes(idx)){
                        let trim = [...i.vals].filter(i=>[...obj.numbers].includes(i));
                        if(trim.length){
                            return true;
                        }
                    }
                }).map((i: { idx:number, vals: Set<number> })=>({
                    idx: i.idx,
                    vals: [...i.vals].filter(i=>![...obj.numbers].includes(i))
                }));
                let canRemoveOuter = related.filter((i: { idx:number, vals: Set<number> }, idx: number)=>{
                    if(i.vals && !obj.positions.includes(idx)){
                        let trim = [...i.vals].filter(i=>[...obj.numbers].includes(i));
                        if(trim.length){
                            return true;
                        }
                    }
                });
                if(obj.positions.length>1){
                    groups.push({ ...obj, related, canRemoveInner, canRemoveOuter });
                }else{
                    groups.push(obj);
                }
            }
        }
    }

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

    // singles
    groups.forEach(i=>{
        if(i.numbers.size === 1) {
            console.log(i);
            setters.push({key: groupIndeces[i.type](i.index)[i.positions[0]], item: i.numbers});
        }
    });

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

    //console.log(pss);
    //console.log(deletors);
    return {
        setters,
        deletors,
        deletorsAll,
        segDeletors
    }

}

let solve = (idx: number, num: number) => {
    console.log('solving:', idx, indexToRow(idx), num);
    if(!solved.get(idx)) {
        solved.set(idx, num);
        pss.delete(idx);
        // clear num from rcb
        groupIndeces['row'](indexToRow(idx).idx).forEach((i: number)=>removePss(i,[num]));
        groupIndeces['col'](indexToCol(idx).idx).forEach((i: number)=>removePss(i,[num]));
        groupIndeces['box'](indexToBox(idx).idx).forEach((i: number)=>removePss(i,[num]));
    }
}

let removePss = (idx: number, nums: Array<number>) => {
    nums.forEach(n=>{
        pss.get(idx)?.delete(n);
    })
}


let step = () => {
    let res = analyse(pss);
    console.log('###########################');
    console.log(res.setters);
    //console.log(res.deletors);
    console.log('dels', res.deletorsAll);
    console.log(res.segDeletors);
    
    res.setters.forEach(({ key, item })=>solve(key, [...item][0]));
    res.deletorsAll.forEach(({idx, nums})=> removePss(idx,nums));
    console.log(solved);
    console.log(pss);
}

step();
step();
step();
step();
step();
step();
step();
step();

step();
step();
//console.log(colIndicies(1));

//only map back to index if can act upon?

/* const fn = ({a}: {a:number}) => {
    console.log(a);
}

let o = {
    a: 1,
    b: "hello" 
}

fn(o); */

