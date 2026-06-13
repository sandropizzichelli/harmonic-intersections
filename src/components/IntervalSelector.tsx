import { INTERVAL_OPTIONS } from "../data/intervals";

type Props = {
  interval: number;
};

export function IntervalSelector({ interval }: Props) {
  const activeInterval = INTERVAL_OPTIONS[interval];

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Distance</h2>
      </div>
      <label className="field">
        <span>Interval from A to B</span>
        <output className="locked-value">
          +{activeInterval.semitones} semitones / {activeInterval.label}
        </output>
      </label>
      <p className="inline-summary">
        +{activeInterval.semitones} semitones / {activeInterval.label}
      </p>
    </section>
  );
}
