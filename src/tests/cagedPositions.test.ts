import { describe, expect, it } from "vitest";
import { cagedPositionFor, isFretInCagedPosition } from "../music/cagedPositions";

describe("CAGED positions", () => {
  it("places the five CAGED forms for a C root", () => {
    expect(cagedPositionFor(0, "C")).toEqual({ shape: "C", start: 0, end: 4 });
    expect(cagedPositionFor(0, "A")).toEqual({ shape: "A", start: 3, end: 7 });
    expect(cagedPositionFor(0, "G")).toEqual({ shape: "G", start: 5, end: 9 });
    expect(cagedPositionFor(0, "E")).toEqual({ shape: "E", start: 8, end: 12 });
    expect(cagedPositionFor(0, "D")).toEqual({ shape: "D", start: 10, end: 14 });
  });

  it("transposes forms with the selected arpeggio root", () => {
    expect(cagedPositionFor(3, "C")).toEqual({ shape: "C", start: 3, end: 7 });
    expect(cagedPositionFor(3, "A")).toEqual({ shape: "A", start: 6, end: 10 });
    expect(cagedPositionFor(3, "G")).toEqual({ shape: "G", start: 8, end: 12 });
    expect(cagedPositionFor(3, "E")).toEqual({ shape: "E", start: 11, end: 15 });
    expect(cagedPositionFor(3, "D")).toEqual({ shape: "D", start: 1, end: 5 });
  });

  it("wraps positions into the visible octave", () => {
    expect(cagedPositionFor(2, "D")).toEqual({ shape: "D", start: 0, end: 4 });
  });

  it("allows every fret when all positions are selected", () => {
    expect(cagedPositionFor(0, "all")).toBeNull();
    expect(isFretInCagedPosition(12, null)).toBe(true);
    expect(isFretInCagedPosition(8, { shape: "C", start: 3, end: 7 })).toBe(false);
  });
});
