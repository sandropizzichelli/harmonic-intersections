import { INTERVAL_OPTIONS } from "../data/intervals";

type Props = {
  interval: number;
  onChange: (value: number) => void;
};

export function IntervalSelector({ interval, onChange }: Props) {
  const activeInterval = INTERVAL_OPTIONS[interval];

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Distanza</h2>
      </div>
      <label className="field">
        <span>Intervallo da A</span>
        <select value={interval} onChange={(event) => onChange(Number(event.target.value))}>
          {INTERVAL_OPTIONS.map((option) => (
            <option value={option.semitones} key={option.semitones}>
              +{option.semitones} semitoni / {option.label}
            </option>
          ))}
        </select>
      </label>
      <p className="inline-summary">
        +{activeInterval.semitones} semitoni / {activeInterval.label}
      </p>
    </section>
  );
}
