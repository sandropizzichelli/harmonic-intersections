export type ComparisonMode =
  | "scale"
  | "selectedArpeggios"
  | "matrix"
  | "onlyA"
  | "onlyB"
  | "commonOnly"
  | "context";

export const COMPARISON_MODES: { id: ComparisonMode; label: string }[] = [
  { id: "scale", label: "Scale complete" },
  { id: "selectedArpeggios", label: "Due arpeggi selezionati" },
  { id: "matrix", label: "Matrice degli arpeggi" },
  { id: "onlyA", label: "Solo note A" },
  { id: "onlyB", label: "Solo note B" },
  { id: "commonOnly", label: "Note comuni" },
  { id: "context", label: "Intersezione con contesto" }
];

type Props = {
  mode: ComparisonMode;
  onChange: (value: ComparisonMode) => void;
};

export function ComparisonModeSelector({ mode, onChange }: Props) {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Modalità</h2>
      </div>
      <div className="mode-grid">
        {COMPARISON_MODES.map((item) => (
          <button
            className={mode === item.id ? "mode-button active" : "mode-button"}
            key={item.id}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
