import { INTERVAL_OPTIONS } from "../data/intervals";

type Props = {
  interval: number;
};

export function IntervalSelector({ interval }: Props) {
  const activeInterval = INTERVAL_OPTIONS[interval];

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Distanza</h2>
      </div>
      <label className="field">
        <span>Intervallo da A a B</span>
        <output className="locked-value">
          +{activeInterval.semitones} semitoni / {activeInterval.label}
        </output>
      </label>
      <p className="inline-summary">
        +{activeInterval.semitones} semitoni / {activeInterval.label}
      </p>
    </section>
  );
}
