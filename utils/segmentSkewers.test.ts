import {
  getNeighbourIds,
  hasSegments,
  getBoxAndLinearNeighbours,
} from "./segmentSkewers.utils";

describe("getNeighbourIds", () => {
  test("linear neighbours of segment 1 should be [0, 2]", () => {
    expect(getNeighbourIds(1, "linear")).toStrictEqual([0, 2]);
  });
  test("linear neighbours of segment 6 should be [7, 8]", () => {
    expect(getNeighbourIds(6, "linear")).toStrictEqual([7, 8]);
  });
  test("box neighbours of segment 6 should be [0, 3]", () => {
    expect(getNeighbourIds(6, "box")).toStrictEqual([0, 3]);
  });
});

const segmentsData: Map<string, boolean> = new Map(
  Object.entries({
    "1.4": true,
    "4.4": true,
  })
);

describe("hasSegments", () => {
  test("segmentsData hasSegments [1, 2], 4", () => {
    expect(hasSegments([1, 2], 4, segmentsData)).toBe(true);
  });
  test("segmentsData hasSegments [5, 7], 4", () => {
    expect(hasSegments([5, 7], 4, segmentsData)).not.toBe(true);
  });
});

describe("compareBoxAndLinearNeighbours", () => {
  test("getBoxAndLinearNeighbours (1, 4)", () => {
    expect(getBoxAndLinearNeighbours(1, 4, segmentsData)).toEqual({
      hasLinearNeighbours: false,
      hasBoxNeighbours: true,
    });
  });
  test("getBoxAndLinearNeighbours (1, 5)", () => {
    expect(getBoxAndLinearNeighbours(1, 5, segmentsData)).toEqual({
      hasLinearNeighbours: false,
      hasBoxNeighbours: false,
    });
  });
});
