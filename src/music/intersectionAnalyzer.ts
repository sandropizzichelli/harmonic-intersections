import { pitchClassListNames, pitchClassSet, type PitchClass } from "./pitchClass";
import type { SpellingPreference } from "../data/noteNames";
import type { Arpeggio } from "./arpeggioGenerator";

export type MaterialComparison = {
  a: PitchClass[];
  b: PitchClass[];
  common: PitchClass[];
  onlyA: PitchClass[];
  onlyB: PitchClass[];
  commonCount: number;
  overlapPercent: number;
};

export type ArpeggioMatrixRow = MaterialComparison & {
  id: string;
  arpeggioA: Arpeggio;
  arpeggioB: Arpeggio;
  relation: string;
  commonNames: string[];
  onlyANames: string[];
  onlyBNames: string[];
};

export const RELATION_THRESHOLDS = {
  primary: 3,
  equivalence: 4
};

export const relationLabel = (commonCount: number): string => {
  if (commonCount === 4) return "equivalenza completa";
  if (commonCount === 3) return "relazione primaria";
  if (commonCount === 2) return "relazione affine";
  if (commonCount === 1) return "relazione debole";
  return "nessuna intersezione";
};

export const compareMaterials = (a: PitchClass[], b: PitchClass[]): MaterialComparison => {
  const aSet = pitchClassSet(a);
  const bSet = pitchClassSet(b);
  const common = [...aSet].filter((note) => bSet.has(note));
  const onlyA = [...aSet].filter((note) => !bSet.has(note));
  const onlyB = [...bSet].filter((note) => !aSet.has(note));
  const denominator = Math.max(aSet.size, bSet.size, 1);

  return {
    a: [...aSet],
    b: [...bSet],
    common,
    onlyA,
    onlyB,
    commonCount: common.length,
    overlapPercent: Math.round((common.length / denominator) * 100)
  };
};

export const buildArpeggioMatrix = (
  arpeggiosA: Arpeggio[],
  arpeggiosB: Arpeggio[],
  spelling: SpellingPreference
): ArpeggioMatrixRow[] =>
  arpeggiosA.flatMap((arpeggioA) =>
    arpeggiosB.map((arpeggioB) => {
      const comparison = compareMaterials(arpeggioA.notes, arpeggioB.notes);
      return {
        ...comparison,
        id: `${arpeggioA.id}-${arpeggioB.id}`,
        arpeggioA,
        arpeggioB,
        relation: relationLabel(comparison.commonCount),
        commonNames: pitchClassListNames(comparison.common, spelling),
        onlyANames: pitchClassListNames(comparison.onlyA, spelling),
        onlyBNames: pitchClassListNames(comparison.onlyB, spelling)
      };
    })
  );
