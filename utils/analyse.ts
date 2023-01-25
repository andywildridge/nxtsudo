import { sortPossibles } from './sortPossibles';
import { getSegementDeletors } from './segmentSkewers';
import { getGroupClusters } from './getGroupClusters';
import { findSquareSolvable } from './findSolvable';

export const analyse = (possibles: ReadonlyMap<number, Set<number>>) => {

    const { groups, segments } = sortPossibles(possibles);
    const solvable = findSquareSolvable(possibles);
    const segmentRemovers = getSegementDeletors(possibles, segments);
    const clusterRemovers = getGroupClusters(possibles, groups);

    interface Single {
        square: number;
        number: number;
        because: string;        
    }

    const singles:Record<number, Single[]> = {};

    //square singles
    solvable.forEach((i: Single)=>{
        if(!singles[i.square]){
        singles[i.square] = [];
        }
        singles[i.square].push(i);
    });

    //group singles
    clusterRemovers.singles.forEach((i: Single) => {
        if (!singles[i.square]) {
        singles[i.square] = [];
        }
        singles[i.square].push(i);
    });

    console.log(clusterRemovers);

    return {
        solvable: singles,
        removable: clusterRemovers
    }

}