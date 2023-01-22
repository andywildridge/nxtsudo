// import { indexToRow, indexToCol, indexToBox, indexToSegH, indexToSegV, groupIndeces } from './indexTransforms'
// import { Collections, CollectionsGroup } from './collections';
import { sortPossibles } from './sortPossibles';
import { getSegementDeletors } from './segmentSkewers';
import { getGroupClusters } from './getGroupClusters';
import { findSquareSolvable } from './findSolvable';

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
    const { groups, segments } = sortPossibles(possibles);

    const solvable = findSquareSolvable(possibles);

    const segmentRemovers = getSegementDeletors(possibles, segments);

    const clusterRemovers = getGroupClusters(possibles, groups);

    /*clusterRemovers.singles.forEach(i=>{
        solvable.push({
            key: i.index,
            item: new Set(i.canContainNumbers)
        });
    });*/

    interface StringMap {
        [key: string]: any;
    }

    const singles: StringMap = {};

    solvable.forEach((i: any)=>{
        if(!singles[i.square]){
        singles[i.square] = [];
        }
        singles[i.square].push(i);
    });

    clusterRemovers.singles.forEach((i: any) => {
        if (!singles[i.square]) {
        singles[i.square] = [];
        }
        singles[i.square].push(i);
    });

    console.log(singles);

    return {
        solvable: singles,
        removable: undefined
    }

}