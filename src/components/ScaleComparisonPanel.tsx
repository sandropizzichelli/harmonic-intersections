import { pitchClassListNames } from "../music/pitchClass";
import type { MaterialComparison } from "../music/intersectionAnalyzer";
import type { ScaleMaterial } from "../music/scaleGenerator";
import type { SpellingPreference } from "../data/noteNames";
import { NoteChips } from "./NoteChips";

type Props = {
  scaleA: ScaleMaterial;
  scaleB: ScaleMaterial;
  comparison: MaterialComparison;
  spelling: SpellingPreference;
};

export function ScaleComparisonPanel({ scaleA, scaleB, comparison, spelling }: Props) {
  return (
    <section className="panel analysis-panel">
      <div className="panel-title-row">
        <h2>Confronto scale</h2>
        <span className="score-badge">{comparison.commonCount} note comuni su {Math.max(scaleA.notes.length, scaleB.notes.length)}</span>
      </div>
      <div className="comparison-columns">
        <div>
          <h3>{scaleA.noteNames[0]} {scaleA.label}</h3>
          <NoteChips notes={scaleA.noteNames} />
        </div>
        <div>
          <h3>{scaleB.noteNames[0]} {scaleB.label}</h3>
          <NoteChips notes={scaleB.noteNames} />
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
