const LEGEND_ITEMS = [
  { className: "common", label: "Comune" },
  { className: "only-a", label: "Solo A" },
  { className: "only-b", label: "Solo B" },
  { className: "root-a", label: "Tonica/Fond. A" },
  { className: "root-b", label: "Tonica/Fond. B" },
  { className: "common-root-a", label: "Comune + A" },
  { className: "common-root-b", label: "Comune + B" }
];

export function FretboardLegend() {
  return (
    <div className="fretboard-legend" aria-label="Legenda tastiera">
      {LEGEND_ITEMS.map((item) => (
        <span className="legend-item" key={item.className}>
          <span className={`legend-dot ${item.className}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
