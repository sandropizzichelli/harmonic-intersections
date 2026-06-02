import type { Arpeggio } from "../music/arpeggioGenerator";
import type { MaterialComparison } from "../music/intersectionAnalyzer";
import { pitchClassListNames } from "../music/pitchClass";
import type { SpellingPreference } from "../data/noteNames";
import { NoteChips } from "./NoteChips";

type Props = {
  arpeggiosA: Arpeggio[];
  arpeggiosB: Arpeggio[];
  selectedA: number;
  selectedB: number;
  comparison: MaterialComparison;
  spelling: SpellingPreference;
  onSelectedA: (value: number) => void;
  onSelectedB: (value: number) => void;
};

const optionLabel = (arpeggio: Arpeggio) =>
  `${arpeggio.roman} - ${arpeggio.chordName} - ${arpeggio.noteNames.join(" ")}`;

export function ArpeggioSelector({
  arpeggiosA,
  arpeggiosB,
  selectedA,
  selectedB,
  comparison,
  spelling,
  onSelectedA,
  onSelectedB
}: Props) {
  const arpeggioA = arpeggiosA[selectedA];
  const arpeggioB = arpeggiosB[selectedB];
  const denominator = Math.max(arpeggioA?.notes.length ?? 0, arpeggioB?.notes.length ?? 0, 1);

  return (
    <section className="panel analysis-panel">
      <div className="panel-title-row">
        <h2>Arpeggi</h2>
        <span className="score-badge">{comparison.commonCount} note comuni su {denominator}</span>
      </div>
      <div className="comparison-columns">
        <label className="field">
          <span>Sistema A</span>
          <select value={selectedA} onChange={(event) => onSelectedA(Number(event.target.value))}>
            {arpeggiosA.map((arpeggio, index) => (
              <option value={index} key={arpeggio.id}>{optionLabel(arpeggio)}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Sistema B</span>
          <select value={selectedB} onChange={(event) => onSelectedB(Number(event.target.value))}>
            {arpeggiosB.map((arpeggio, index) => (
              <option value={index} key={arpeggio.id}>{optionLabel(arpeggio)}</option>
            ))}
          </select>
        </label>
      </div>
      <h3>{arpeggioA.chordName} / {arpeggioB.chordName}</h3>
      <div className="result-grid">
        <NoteChips label="Note comuni" notes={pitchClassListNames(comparison.common, spelling)} tone="common" />
        <NoteChips label={`Solo ${arpeggioA.chordName}`} notes={pitchClassListNames(comparison.onlyA, spelling)} tone="only-a" />
        <NoteChips label={`Solo ${arpeggioB.chordName}`} notes={pitchClassListNames(comparison.onlyB, spelling)} tone="only-b" />
      </div>
    </section>
  );
}
