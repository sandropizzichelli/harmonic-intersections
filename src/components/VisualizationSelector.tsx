export type VisualizationLayer = "notesA" | "notesB" | "common";

export type VisualizationLayers = Record<VisualizationLayer, boolean>;

const VISUALIZATION_OPTIONS: { id: VisualizationLayer; label: string }[] = [
  { id: "notesA", label: "Note A" },
  { id: "notesB", label: "Note B" },
  { id: "common", label: "Note comuni" }
];

type Props = {
  layers: VisualizationLayers;
  onToggle: (value: VisualizationLayer) => void;
};

export function VisualizationSelector({ layers, onToggle }: Props) {
  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Visualizzazione</h2>
      </div>
      <div className="mode-grid three-buttons">
        {VISUALIZATION_OPTIONS.map((item) => (
          <button
            aria-pressed={layers[item.id]}
            className={layers[item.id] ? "mode-button active" : "mode-button"}
            key={item.id}
            onClick={() => onToggle(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
