import { indexToRow, indexToCol, indexToBox, indexToSegH, indexToSegV } from './indexTransforms'
import { Collections } from './collections';

export const sortPossibles = (pss: ReadonlyMap<number, Set<number>>) => {
    let outs = new Collections();
    let segs = new Map();
    for (let [idx, poss] of pss) {
        let r = indexToRow(idx);
        let c = indexToCol(idx);
        let b = indexToBox(idx);
        let h = indexToSegH(idx);
        let v = indexToSegV(idx);
        [...poss].forEach((number)=>{
            outs.add(`row:${r.idx}.num:${number}`,r.pos);
            outs.add(`col:${c.idx}.num:${number}`,c.pos);
            outs.add(`box:${b.idx}.num:${number}`,b.pos);
            segs.set(`${h}.${number}`,true);
            segs.set(`${v + 27}.${number}`,true);
        })
    }
    return {
        outs,
        segs
    }
}