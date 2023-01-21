
export const findSquareSolvable = (pss: ReadonlyMap<number, Set<number>>) => {
    const setters = [];
    //square singles
    for(let [key, item] of pss) {
        if(item.size === 1){
            setters.push({key, item});
        }
    }

   return setters;
}