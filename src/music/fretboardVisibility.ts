import type { CagedPosition } from "./cagedPositions";
import { isFretInCagedPosition } from "./cagedPositions";
import type { PitchClass } from "./pitchClass";

export type FretboardVisibilityLayers = {
  notesA: boolean;
  notesB: boolean;
  common: boolean;
};

export type FretPositionVisualState = {
  isCommon: boolean;
  isOnlyA: boolean;
  isOnlyB: boolean;
  visibleToA: boolean;
  visibleToB: boolean;
  isVisible: boolean;
  isRootA: boolean;
  isRootB: boolean;
};

type FretPositionVisualStateInput = {
  pitchClass: PitchClass;
  fret: number;
  pitchClassesA: Set<PitchClass>;
  pitchClassesB: Set<PitchClass>;
  rootA: PitchClass;
  rootB: PitchClass;
  layers: FretboardVisibilityLayers;
  cagedPositionA: CagedPosition | null;
  cagedPositionB: CagedPosition | null;
};

export const fretPositionVisualState = ({
  pitchClass,
  fret,
  pitchClassesA,
  pitchClassesB,
  rootA,
  rootB,
  layers,
  cagedPositionA,
  cagedPositionB
}: FretPositionVisualStateInput): FretPositionVisualState => {
  const belongsToA =
    pitchClassesA.has(pitchClass) && isFretInCagedPosition(fret, cagedPositionA);
  const belongsToB =
    pitchClassesB.has(pitchClass) && isFretInCagedPosition(fret, cagedPositionB);
  const showCommon = layers.common || (layers.notesA && layers.notesB);
  const isCommon = showCommon && belongsToA && belongsToB;
  const isOnlyA = layers.notesA && belongsToA && !isCommon;
  const isOnlyB = layers.notesB && belongsToB && !isCommon;
  const visibleToA = isCommon || isOnlyA;
  const visibleToB = isCommon || isOnlyB;

  return {
    isCommon,
    isOnlyA,
    isOnlyB,
    visibleToA,
    visibleToB,
    isVisible: visibleToA || visibleToB,
    isRootA: visibleToA && pitchClass === rootA,
    isRootB: visibleToB && pitchClass === rootB
  };
};
