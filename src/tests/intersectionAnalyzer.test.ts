import { describe, expect, it } from "vitest";
import { generateSeventhArpeggios } from "../music/arpeggioGenerator";
import { buildArpeggioMatrix } from "../music/intersectionAnalyzer";
import { transposePitchClass } from "../music/pitchClass";
import { generateScale } from "../music/scaleGenerator";

describe("arpeggio matrix", () => {
  it("builds and sorts a full 7 x 7 matrix for C Ionian / Ab Ionian", () => {
    const cIonian = generateScale(0, "ionian", "flats");
    const abIonian = generateScale(transposePitchClass(0, 8), "ionian", "flats");
    const matrix = buildArpeggioMatrix(
      generateSeventhArpeggios(cIonian, "flats", "A"),
      generateSeventhArpeggios(abIonian, "flats", "B"),
      "flats"
    );

    expect(matrix).toHaveLength(49);
    const sorted = [...matrix].sort((a, b) => b.commonCount - a.commonCount);
    const filtered = matrix.filter((row) => row.commonCount >= 2);

    expect(filtered.every((row) => row.commonCount >= 2)).toBe(true);
    expect(sorted[0].commonCount).toBeGreaterThanOrEqual(sorted[sorted.length - 1].commonCount);
  });
});
