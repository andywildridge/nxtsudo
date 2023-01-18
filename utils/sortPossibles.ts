import { indexToRow, indexToCol, indexToBox, indexToSegH, indexToSegV } from './indexTransforms'
import { Collections } from './collections';

export const sortPossibles = (pss: ReadonlyMap<number, Set<number>>) => {
    let groups = new Collections();
    let segments = new Map();
    for (let [idx, poss] of pss) {
        let r = indexToRow(idx);
        let c = indexToCol(idx);
        let b = indexToBox(idx);
        let h = indexToSegH(idx);
        let v = indexToSegV(idx);
        [...poss].forEach((number)=>{
            groups.add(`row:${r.idx}.num:${number}`,r.pos);
            groups.add(`col:${c.idx}.num:${number}`,c.pos);
            groups.add(`box:${b.idx}.num:${number}`,b.pos);
            segments.set(`${h}.${number}`,true);
            segments.set(`${v + 27}.${number}`,true);
        })
    }
    return {
        groups,
        segments
    }
}