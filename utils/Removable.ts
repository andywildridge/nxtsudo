export interface Removable {
  because: string;
  related: number[];
  contained: number[];
  deletable: { number: number; square: number }[];
}

interface Rem {
  data: Removable;
  deletable: number[];
}

interface RemType {}

export default class Removables {
  private removables: Removable[] = [];
  private indecesCache:
    | Record<number, Record<number, Removable[]>>
    | undefined = undefined;
  private dmCache: Record<number, number[]> | undefined;

  add(item: Removable) {
    // reset cached lookups
    this.indecesCache = undefined;
    this.dmCache = undefined;
    this.removables.push(item);
  }
  get data() {
    return this.removables;
  }
  get indeces() {
    if (!this.indecesCache) {
      console.log("indy called");
      this.indecesCache = this.removables.reduce(
        (acc: Record<number, Record<number, Removable[]>>, removable) => {
          removable.deletable.forEach((idx) => {
            if (!acc[idx.square]) {
              acc[idx.square] = {};
            }
            if (!acc[idx.square][idx.number]) {
              acc[idx.square][idx.number] = [];
            }
            acc[idx.square][idx.number].push(removable);
          });
          return acc;
        },
        {}
      );
    }
    return this.indecesCache;
  }
  get deleteMap() {
    if (!this.dmCache) {
      console.log("dm cache");
      this.dmCache = this.removables.reduce(
        (acc: Record<number, number[]>, removable) => {
          removable.deletable.forEach((idx) => {
            if (!acc[idx.square]) {
              acc[idx.square] = [];
            }
            acc[idx.square] = [...new Set([...acc[idx.square], idx.number])];
          });
          return acc;
        },
        {}
      );
    }
    return this.dmCache;
  }
}
