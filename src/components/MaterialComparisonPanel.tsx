import type { SpellingPreference } from "../data/noteNames";
import type { MaterialComparison } from "../music/intersectionAnalyzer";
import { pitchClassListNames, type PitchClass } from "../music/pitchClass";
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
};

export function MaterialComparisonPanel({ materialA, materialB, comparison, spelling }: Props) {
  const denominator = Math.max(materialA.notes.length, materialB.notes.length, 1);

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
          <NoteChips notes={materialA.noteNames} />
        </div>
        <div>
          <h3>{materialB.label}</h3>
          <NoteChips notes={materialB.noteNames} />
        </div>
      </div>
      <div className="result-grid">
        <NoteChips label="Note comuni" notes={pitchClassListNames(comparison.common, spelling)} tone="common" />
        <NoteChips label="Solo Sistema A" notes={pitchClassListNames(comparison.onlyA, spelling)} tone="only-a" />
        <NoteChips label="Solo Sistema B" notes={pitchClassListNames(comparison.onlyB, spelling)} tone="only-b" />
      </div>
      <p className="inline-summary">Sovrapposizione: {comparison.overlapPercent}%</p>
    </section>
  );
}
