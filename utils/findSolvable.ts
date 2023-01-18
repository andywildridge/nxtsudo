
export const findSolvable = (pss: ReadonlyMap<number, Set<number>>) => {
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
    */
   return setters;
}