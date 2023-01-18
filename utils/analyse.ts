// import { indexToRow, indexToCol, indexToBox, indexToSegH, indexToSegV, groupIndeces } from './indexTransforms'
// import { Collections, CollectionsGroup } from './collections';
import { sortPossibles } from './sortPossibles';
import { getSegementDeletors } from './segmentSkewers';
import { getGroupClusters } from './getGroupClusters';
import { findSolvable } from './findSolvable';

 export const analyse = (possibles: ReadonlyMap<number, Set<number>>) => {
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
    const { outs, segs} = sortPossibles(possibles);

    const segDeletors = getSegementDeletors(possibles, segs);

    const groupClusters = getGroupClusters(outs);

    const setters = findSolvable(possibles);

/*

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