import type { SpellingPreference } from "../data/noteNames";
import type { MaterialComparison } from "../music/intersectionAnalyzer";
import { pitchClassListNames, type PitchClass } from "../music/pitchClass";
import {
  combinedDegreeLabel,
  labelsForPitchClasses,
  type DegreeLabels
} from "../music/degreeLabels";
import type { DisplayMode } from "./DisplayModeSelector";
import { NoteChips } from "./NoteChips";

export type ActiveMaterialSummary = {
  label: string;
  notes: PitchClass[];
  noteNames: string[];
};

type Props = {
  materialA: ActiveMaterialSummary;
  materialB: ActiveMaterialSummary;
  comparison: MaterialComparison;
  spelling: SpellingPreference;
  displayMode: DisplayMode;
  degreeLabelsA: DegreeLabels;
  degreeLabelsB: DegreeLabels;
};

export function MaterialComparisonPanel({
  materialA,
  materialB,
  comparison,
  spelling,
  displayMode,
  degreeLabelsA,
  degreeLabelsB
}: Props) {
  const denominator = Math.max(materialA.notes.length, materialB.notes.length, 1);
  const labelsA =
    displayMode === "degrees" ? labelsForPitchClasses(materialA.notes, degreeLabelsA) : materialA.noteNames;
  const labelsB =
    displayMode === "degrees" ? labelsForPitchClasses(materialB.notes, degreeLabelsB) : materialB.noteNames;
  const commonLabels =
    displayMode === "degrees"
      ? comparison.common.map((pitchClass) =>
          combinedDegreeLabel(pitchClass, degreeLabelsA, degreeLabelsB, true, true)
        )
      : pitchClassListNames(comparison.common, spelling);
  const onlyALabels =
    displayMode === "degrees"
      ? labelsForPitchClasses(comparison.onlyA, degreeLabelsA)
      : pitchClassListNames(comparison.onlyA, spelling);
  const onlyBLabels =
    displayMode === "degrees"
      ? labelsForPitchClasses(comparison.onlyB, degreeLabelsB)
      : pitchClassListNames(comparison.onlyB, spelling);

  return (
    <section className="panel analysis-panel">
      <div className="panel-title-row">
        <h2>Confronto</h2>
        <span className="score-badge">
          {comparison.commonCount} note comuni su {denominator}
        </span>
      </div>
      <div className="comparison-columns">
        <div>
          <h3>{materialA.label}</h3>
          <NoteChips notes={labelsA} />
        </div>
        <div>
          <h3>{materialB.label}</h3>
          <NoteChips notes={labelsB} />
        </div>
      </div>
      <div className="result-grid">
        <NoteChips label={displayMode === "degrees" ? "Gradi comuni A/B" : "Note comuni"} notes={commonLabels} tone="common" />
        <NoteChips label={displayMode === "degrees" ? "Solo gradi Sistema A" : "Solo Sistema A"} notes={onlyALabels} tone="only-a" />
        <NoteChips label={displayMode === "degrees" ? "Solo gradi Sistema B" : "Solo Sistema B"} notes={onlyBLabels} tone="only-b" />
      </div>
      <p className="inline-summary">Sovrapposizione: {comparison.overlapPercent}%</p>
    </section>
  );
}
