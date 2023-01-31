interface Removable {
  because: string;
  related: number[];
  contained: number[];
  deletable: { number: number; square: number }[];
}

interface Rem {
  data: Removable;
  deletable: number[];
}

export default class Removables {
  private removables: Removable[] = [];
  add(item: Removable) {
    this.removables.push(item);
  }
  get data() {
    return this.removables;
  }
  get indeces() {
    return this.removables.reduce(
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
}
