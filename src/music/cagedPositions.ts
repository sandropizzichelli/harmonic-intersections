import { normalizePitchClass, type PitchClass } from "./pitchClass";

export type CagedShape = "all" | "C" | "A" | "G" | "E" | "D";

export type CagedPosition = {
  shape: Exclude<CagedShape, "all">;
  start: number;
  end: number;
};

export const CAGED_SHAPE_OPTIONS: { id: CagedShape; label: string }[] = [
  { id: "all", label: "All" },
  { id: "C", label: "C" },
  { id: "A", label: "A" },
  { id: "G", label: "G" },
  { id: "E", label: "E" },
  { id: "D", label: "D" }
];

const CAGED_START_FRETS_FOR_C: Record<Exclude<CagedShape, "all">, number> = {
  C: 0,
  A: 3,
  G: 5,
  E: 8,
  D: 10
};

const CAGED_POSITION_WIDTH = 4;

export const cagedPositionFor = (root: PitchClass, shape: CagedShape): CagedPosition | null => {
  if (shape === "all") {
    return null;
  }

  const start = normalizePitchClass(CAGED_START_FRETS_FOR_C[shape] + root);
  return {
    shape,
    start,
    end: start + CAGED_POSITION_WIDTH
  };
};

export const isFretInCagedPosition = (fret: number, position: CagedPosition | null): boolean =>
  position === null || (fret >= position.start && fret <= position.end);
