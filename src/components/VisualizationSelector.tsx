export type VisualizationMode = "notesA" | "notesB" | "common";

const VISUALIZATION_OPTIONS: { id: VisualizationMode; label: string }[] = [
  { id: "notesA", label: "Note A" },
  { id: "notesB", label: "Note B" },
  { id: "common", label: "Note comuni" }
];

type Props = {
  mode: VisualizationMode;
  onChange: (value: VisualizationMode) => void;
};

export function VisualizationSelector({ mode, onChange }: Props) {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Visualizzazione</h2>
      </div>
      <div className="mode-grid three-buttons">
        {VISUALIZATION_OPTIONS.map((item) => (
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
