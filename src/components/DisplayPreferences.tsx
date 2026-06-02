import type { SpellingPreference } from "../data/noteNames";

type Props = {
  spelling: SpellingPreference;
  onChange: (value: SpellingPreference) => void;
};

export function DisplayPreferences({ spelling, onChange }: Props) {
  return (
    <section className="panel compact-panel">
      <div className="panel-title-row">
        <h2>Grafia</h2>
      </div>
      <div className="segmented-control">
        <button className={spelling === "flats" ? "active" : ""} onClick={() => onChange("flats")}>
          Preferisci bemolli
        </button>
        <button className={spelling === "sharps" ? "active" : ""} onClick={() => onChange("sharps")}>
          Preferisci diesis
        </button>
      </div>
    </section>
  );
}
