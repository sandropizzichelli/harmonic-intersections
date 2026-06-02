import type { ArpeggioMatrixRow } from "../music/intersectionAnalyzer";

type Props = {
  rows: ArpeggioMatrixRow[];
  selectedRowId: string;
  minimumCommon: number;
  onMinimumCommonChange: (value: number) => void;
  onSelectRow: (row: ArpeggioMatrixRow) => void;
};

const FILTERS = [
  { value: 0, label: "tutti" },
  { value: 1, label: "almeno 1" },
  { value: 2, label: "almeno 2" },
  { value: 3, label: "almeno 3" },
  { value: 4, label: "equivalenze" }
];

export function ArpeggioMatrix({
  rows,
  selectedRowId,
  minimumCommon,
  onMinimumCommonChange,
  onSelectRow
}: Props) {
  const filteredRows = rows
    .filter((row) => row.commonCount >= minimumCommon)
    .sort((a, b) => b.commonCount - a.commonCount || a.arpeggioA.degree - b.arpeggioA.degree || a.arpeggioB.degree - b.arpeggioB.degree);

  return (
    <section className="panel analysis-panel matrix-panel">
      <div className="panel-title-row">
        <div>
          <h2>Matrice degli arpeggi</h2>
          <p className="muted">{rows.length} confronti, {filteredRows.length} visibili</p>
        </div>
        <label className="field small-field">
          <span>Filtro</span>
          <select value={minimumCommon} onChange={(event) => onMinimumCommonChange(Number(event.target.value))}>
            {FILTERS.map((filter) => (
              <option value={filter.value} key={filter.value}>{filter.label}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="inline-summary">
        Criterio operativo: 4 note = equivalenza, 3 = relazione primaria, 2 = affine, 1 = debole.
      </p>
      <div className="matrix-table-wrap">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>A</th>
              <th>B</th>
              <th>Comuni</th>
              <th>Relazione</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                className={row.id === selectedRowId ? "selected" : ""}
                key={row.id}
                onClick={() => onSelectRow(row)}
              >
                <td>{row.arpeggioA.roman} {row.arpeggioA.chordName}</td>
                <td>{row.arpeggioB.roman} {row.arpeggioB.chordName}</td>
                <td>{row.commonCount} - {row.commonNames.join(" ") || "nessuna"}</td>
                <td>{row.relation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
