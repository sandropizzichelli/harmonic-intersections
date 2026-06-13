import { describe, expect, it } from "vitest";
import { fretPositionVisualState } from "../music/fretboardVisibility";

const allLayers = { notesA: true, notesB: true, common: true };
const cShape = { shape: "C" as const, start: 0, end: 4 };
const aShape = { shape: "A" as const, start: 3, end: 7 };
const commonC = {
  pitchClass: 0,
  pitchClassesA: new Set([0]),
  pitchClassesB: new Set([0]),
  rootA: 0,
  rootB: 0,
  layers: allLayers,
  cagedPositionA: cShape,
  cagedPositionB: aShape
};

describe("fretboard CAGED visibility", () => {
  it("marks a common pitch as common only where both physical positions overlap", () => {
    expect(fretPositionVisualState({ ...commonC, fret: 3 })).toMatchObject({
      isCommon: true,
      isOnlyA: false,
      isOnlyB: false
    });
    expect(fretPositionVisualState({ ...commonC, fret: 1 })).toMatchObject({
      isCommon: false,
      isOnlyA: true,
      isOnlyB: false
    });
    expect(fretPositionVisualState({ ...commonC, fret: 6 })).toMatchObject({
      isCommon: false,
      isOnlyA: false,
      isOnlyB: true
    });
  });

  it("hides a note outside both selected positions", () => {
    expect(fretPositionVisualState({ ...commonC, fret: 8 }).isVisible).toBe(false);
  });

  it("keeps common-only visibility position-aware", () => {
    const commonOnly = { ...allLayers, notesA: false, notesB: false };
    expect(fretPositionVisualState({ ...commonC, fret: 3, layers: commonOnly }).isCommon).toBe(true);
    expect(fretPositionVisualState({ ...commonC, fret: 1, layers: commonOnly }).isVisible).toBe(false);
  });
});
