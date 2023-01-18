// import { indexToRow, indexToCol, indexToBox, indexToSegH, indexToSegV, groupIndeces } from './indexTransforms'
import { Collections, CollectionsGroup } from './collections';
import { sortPossibles } from './sortPossibles';
import { getSegementDeletors } from './segmentSkewers';

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

    //console.log(outs.values);
    //console.log(segs);
    //function find seg skewers
    const { outs, segs} = sortPossibles(pss);

    const segDeletors = getSegementDeletors(pss, segs);

    //function find group clusters
    //fold groups into row 0, clusters boxes (in lines)?
    //fold groups into rows/cols, , number n, clusters
    // func clusters = getClusters(outs)
    const clusters = new CollectionsGroup();
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