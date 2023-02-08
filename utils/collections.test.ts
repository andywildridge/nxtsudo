import {
  GroupMapNumberSet,
  CollectionsNumbers,
  CollectionsGroup,
  CollectionsClusters,
} from "./collections";

describe("GroupMapNumberSet", () => {
  const a = new GroupMapNumberSet();
  a.add("box.1", 7);
  a.add("box.1", 5);

  const row = {
    "box.1": new Set([7, 5]),
  };
  const map = new Map(Object.entries(row));
  test("a", () => {
    expect(a.values).toStrictEqual(map);
  });
});

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
  a.add({ type: "box", index: 1, positions: [1, 2, 3] }, 7);
  a.add({ type: "box", index: 1, positions: [1, 2, 3] }, 8);
  a.add({ type: "box", index: 1, positions: [1, 2, 3] }, 4);

  test("a", () => {
    const nestedRows = {
      "1,2,3": {
        index: 1,
        type: "box",
        positionCluster: [1, 2, 3],
        canContainNumbers: new Set([7, 8, 4]),
      },
    };
    const row = {
      "box.1": new Map(Object.entries(nestedRows)),
    };
    const map = new Map(Object.entries(row));
    expect(a.values).toStrictEqual(map);
  });

  const b = new CollectionsGroup();
  b.add({ type: "box", index: 1, positions: [1, 2, 3] }, 7);
  b.add({ type: "box", index: 1, positions: [1, 2, 3] }, 8);
  b.add({ type: "box", index: 1, positions: [1, 2, 3] }, 4);
  b.add({ type: "box", index: 1, positions: [1, 5, 6] }, 2);

  test("b", () => {
    const nestedRows = {
      "1,2,3": {
        index: 1,
        type: "box",
        positionCluster: [1, 2, 3],
        canContainNumbers: new Set([7, 8, 4]),
      },
      "1,5,6": {
        index: 1,
        type: "box",
        positionCluster: [1, 5, 6],
        canContainNumbers: new Set([2]),
      },
    };
    const row = {
      "box.1": new Map(Object.entries(nestedRows)),
    };
    const map = new Map(Object.entries(row));
    expect(b.values).toStrictEqual(map);
  });
});

describe("CollectionsClusters", () => {
  test("a", () => {
    const a = new CollectionsClusters();
    expect(a.values).toStrictEqual(new Map());
    a.add({ type: "row", index: 1, positions: [1, 2, 3] }, 7);
    const row = {
      "row.1[1,2,3]": {
        contains: new Set([7]),
        index: 1,
        positions: [1, 2, 3],
        type: "row",
      },
    };
    const map = new Map(Object.entries(row));
    expect(a.values).toStrictEqual(map);
  });
});
