import { describe, expect, it } from "vitest";
import { buildDegreeLabels, combinedDegreeLabel, labelsForPitchClasses } from "../music/degreeLabels";

describe("degree labels", () => {
  const cIonian = buildDegreeLabels([0, 2, 4, 5, 7, 9, 11]);
  const abIonian = buildDegreeLabels([8, 10, 0, 1, 3, 5, 7]);

  it("labels pitch classes by their scale degree", () => {
    expect(labelsForPitchClasses([0, 5, 7], cIonian)).toEqual(["1", "4", "5"]);
  });

  it("includes modal alterations in degree labels", () => {
    const cDorian = buildDegreeLabels([0, 2, 3, 5, 7, 9, 10]);
    expect(labelsForPitchClasses([0, 2, 3, 5, 7, 9, 10], cDorian)).toEqual([
      "1",
      "2",
      "b3",
      "4",
      "5",
      "6",
      "b7"
    ]);
  });

  it("shows both degrees for a common note when they differ", () => {
    expect(combinedDegreeLabel(0, cIonian, abIonian, true, true)).toBe("1/3");
  });

  it("collapses equal common degrees into one label", () => {
    expect(combinedDegreeLabel(0, cIonian, cIonian, true, true)).toBe("1");
  });
});
