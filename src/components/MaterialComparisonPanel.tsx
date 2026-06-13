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
      <div className="panel-title-row comparison-header">
        <h2>Confronto</h2>
        <div className="overlap-summary">
          <strong>{comparison.overlapPercent}%</strong>
          <span>
            {comparison.commonCount} {displayMode === "degrees" ? "gradi" : "note"} comuni su {denominator}
          </span>
        </div>
      </div>
      <div className="comparison-materials">
        <div className="comparison-material system-a-material">
          <span className="comparison-system-label">Sistema A</span>
          <h3>{materialA.label}</h3>
          <NoteChips notes={labelsA} />
        </div>
        <div className="comparison-material system-b-material">
          <span className="comparison-system-label">Sistema B</span>
          <h3>{materialB.label}</h3>
          <NoteChips notes={labelsB} />
        </div>
      </div>
      <div className="comparison-breakdown">
        <div className="comparison-result common-result">
          <NoteChips label={displayMode === "degrees" ? "Gradi comuni A/B" : "Note comuni"} notes={commonLabels} tone="common" />
        </div>
        <div className="comparison-result only-a-result">
          <NoteChips label={displayMode === "degrees" ? "Solo gradi Sistema A" : "Solo Sistema A"} notes={onlyALabels} tone="only-a" />
        </div>
        <div className="comparison-result only-b-result">
          <NoteChips label={displayMode === "degrees" ? "Solo gradi Sistema B" : "Solo Sistema B"} notes={onlyBLabels} tone="only-b" />
        </div>
      </div>
    </section>
  );
}
