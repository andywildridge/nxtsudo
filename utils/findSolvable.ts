
export const findSquareSolvable = (pss: ReadonlyMap<number, Set<number>>) => {
    const setters = [];
    //square singles
    for(let [key, item] of pss) {
        if(item.size === 1){
            setters.push({ square: key, number: [...item][0], because: 'only number that can go on this square'});
        }
    }

   return setters;
}