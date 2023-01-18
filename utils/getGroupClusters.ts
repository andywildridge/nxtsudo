import { Collections, CollectionsGroup } from './collections';
 
 export const getGroupClusters = (outs: Collections) => {
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
    return clusters;
 }