import { CollectionsNumbers, CollectionsGroup } from "./collections";

describe("CollectionsNumbers", () => {
  const a = new CollectionsNumbers();
  a.add({ type: "box", index: 1, number: 4 }, 7);
  a.add({ type: "box", index: 1, number: 4 }, 5);

  const row = {
    "box.1:4": { index: 1, number: 4, type: "box", possibles: new Set([7, 5]) },
  };
  const map = new Map(Object.entries(row));
  test("a", () => {
    expect(a.values).toStrictEqual(map);
  });
});

describe("CollectionsGroup", () => {
  const a = new CollectionsGroup();
  a.add({ type: "box", index: 1, positions: [1, 2, 3], value: 7 });
  a.add({ type: "box", index: 1, positions: [1, 2, 3], value: 8 });
  a.add({ type: "box", index: 1, positions: [1, 2, 3], value: 4 });

  const r = {
    "1,2,3": {
      index: 1,
      type: "box",
      positionCluster: [1, 2, 3],
      canContainNumbers: new Set([7, 8, 4]),
    },
  };
  const row = {
    "box.1": new Map(Object.entries(r)),
  };
  const map = new Map(Object.entries(row));
  test("a", () => {
    expect(a.values).toStrictEqual(map);
  });
});
