import { NOTE_OPTIONS } from "../data/noteNames";
import { SCALE_FAMILIES, SCALES, type ScaleId } from "../data/scales";
import { ARPEGGIO_TYPE_OPTIONS, type Arpeggio, type ArpeggioType } from "../music/arpeggioGenerator";
import { labelsForPitchClasses, type DegreeLabels } from "../music/degreeLabels";
import type { ScaleMaterial } from "../music/scaleGenerator";
import type { DisplayMode } from "./DisplayModeSelector";
import { NoteChips } from "./NoteChips";

export type MaterialMode = "scales" | "arpeggios";

type Props = {
  title: string;
  root: number;
  scaleId: ScaleId;
  scale: ScaleMaterial;
  materialMode: MaterialMode;
  arpeggioType: ArpeggioType;
  arpeggios: Arpeggio[];
  selectedArpeggio: number;
  displayMode: DisplayMode;
  degreeLabels: DegreeLabels;
  rootLocked?: boolean;
  rootLabel?: string;
  onRootChange?: (value: number) => void;
  onScaleChange: (value: ScaleId) => void;
  onMaterialModeChange: (value: MaterialMode) => void;
  onArpeggioTypeChange: (value: ArpeggioType) => void;
  onSelectedArpeggioChange: (value: number) => void;
};

const arpeggioOptionLabel = (arpeggio: Arpeggio) =>
  `${arpeggio.roman} - ${arpeggio.chordName} - ${arpeggio.noteNames.join(" ")}`;

export function SystemSelector({
  title,
  root,
  scaleId,
  scale,
  materialMode,
  arpeggioType,
  arpeggios,
  selectedArpeggio,
  displayMode,
  degreeLabels,
  rootLocked = false,
  rootLabel,
  onRootChange,
  onScaleChange,
  onMaterialModeChange,
  onArpeggioTypeChange,
  onSelectedArpeggioChange
}: Props) {
  const activeArpeggio = arpeggios[selectedArpeggio];
  const activePitchClasses = materialMode === "arpeggios" && activeArpeggio ? activeArpeggio.notes : scale.notes;
  const activeNotes =
    displayMode === "degrees"
      ? labelsForPitchClasses(activePitchClasses, degreeLabels)
      : materialMode === "arpeggios" && activeArpeggio
        ? activeArpeggio.noteNames
        : scale.noteNames;

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>{title}</h2>
      </div>
      <label className="field">
        <span>Tonica</span>
        {rootLocked ? (
          <output className="locked-value">{rootLabel}</output>
        ) : (
          <select value={root} onChange={(event) => onRootChange?.(Number(event.target.value))}>
            {NOTE_OPTIONS.map((note) => (
              <option value={note.pitchClass} key={note.pitchClass}>
                {note.label}
              </option>
            ))}
          </select>
        )}
      </label>
      <label className="field">
        <span>Modo</span>
        <select value={scaleId} onChange={(event) => onScaleChange(event.target.value as ScaleId)}>
          {SCALE_FAMILIES.map((family) => (
            <optgroup label={family.label} key={family.id}>
              {SCALES.filter((scaleOption) => scaleOption.family === family.id).map((scaleOption) => (
                <option value={scaleOption.id} key={scaleOption.id}>
                  {scaleOption.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="segmented-control material-toggle">
        <button className={materialMode === "scales" ? "active" : ""} onClick={() => onMaterialModeChange("scales")}>
          Scala completa
        </button>
        <button className={materialMode === "arpeggios" ? "active" : ""} onClick={() => onMaterialModeChange("arpeggios")}>
          Arpeggio
        </button>
      </div>
      {materialMode === "arpeggios" ? (
        <>
          <label className="field material-field">
            <span>Tipo arpeggio</span>
            <select value={arpeggioType} onChange={(event) => onArpeggioTypeChange(event.target.value as ArpeggioType)}>
              {ARPEGGIO_TYPE_OPTIONS.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Grado</span>
            <select value={selectedArpeggio} onChange={(event) => onSelectedArpeggioChange(Number(event.target.value))}>
              {arpeggios.map((arpeggio, index) => (
                <option value={index} key={arpeggio.id}>
                  {arpeggioOptionLabel(arpeggio)}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : null}
      <NoteChips
        label={
          displayMode === "degrees"
            ? materialMode === "arpeggios"
              ? "Gradi arpeggio"
              : "Gradi scala"
            : materialMode === "arpeggios"
              ? "Note arpeggio"
              : "Note scala"
        }
        notes={activeNotes}
      />
    </section>
  );
}
