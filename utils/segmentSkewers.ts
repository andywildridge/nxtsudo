import { groupIndeces } from './indexTransforms'

export const getSegementDeletors = (pss: ReadonlyMap<number, Set<number>>, segs: Map<string, Set<number>>) => {

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

    return segDeletors

}