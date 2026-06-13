import { buildFretboard } from "../music/fretboardMapper";
import { pitchClassName, type PitchClass } from "../music/pitchClass";
import type { SpellingPreference } from "../data/noteNames";
import type { CSSProperties } from "react";
import { combinedDegreeLabel, type DegreeLabels } from "../music/degreeLabels";
import type { DisplayMode } from "./DisplayModeSelector";
import type { FretRange } from "./FretRangeSelector";
import type { ActiveStrings } from "./StringSelector";
import type { VisualizationLayers } from "./VisualizationSelector";
import type { CagedPosition } from "../music/cagedPositions";
import { fretPositionVisualState } from "../music/fretboardVisibility";

type Props = {
  notesA: PitchClass[];
  notesB: PitchClass[];
  rootA: PitchClass;
  rootB: PitchClass;
  visualizationLayers: VisualizationLayers;
  cagedPositionA: CagedPosition | null;
  cagedPositionB: CagedPosition | null;
  spelling: SpellingPreference;
  displayMode: DisplayMode;
  degreeLabelsA: DegreeLabels;
  degreeLabelsB: DegreeLabels;
  fretRange: FretRange;
  activeStrings: ActiveStrings;
  fretCount?: number;
};

const FRET_MARKERS = [
  { fret: 3, type: "single" },
  { fret: 5, type: "single" },
  { fret: 7, type: "single" },
  { fret: 9, type: "single" },
  { fret: 12, type: "double" }
];

const stateClassFor = (
  isCommon: boolean,
  isOnlyA: boolean,
  isOnlyB: boolean,
  isRootA: boolean,
  isRootB: boolean
) => {
  const classes = ["fret-note"];
  if (isCommon) classes.push("common");
  if (isOnlyA) classes.push("only-a");
  if (isOnlyB) classes.push("only-b");
  if (isRootA) classes.push("root-a");
  if (isRootB) classes.push("root-b");
  return classes.join(" ");
};

export function Fretboard({
  notesA,
  notesB,
  rootA,
  rootB,
  visualizationLayers,
  cagedPositionA,
  cagedPositionB,
  spelling,
  displayMode,
  degreeLabelsA,
  degreeLabelsB,
  fretRange,
  activeStrings,
  fretCount = 12
}: Props) {
  const strings = buildFretboard(fretCount);
  const pitchClassesA = new Set(notesA);
  const pitchClassesB = new Set(notesB);

  return (
    <section className="panel fretboard-panel">
      <div className="fretboard-header">
        <h2>Fretboard</h2>
        <div className="fret-numbers" style={{ "--fret-count": fretCount + 1 } as CSSProperties}>
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <span key={fret}>{fret}</span>
          ))}
        </div>
      </div>
      <div className="fretboard-scroll">
        <div className="fretboard" style={{ "--fret-count": fretCount + 1 } as CSSProperties}>
          <div className="fret-markers" aria-hidden="true">
            {Array.from({ length: fretCount + 1 }, (_, fret) => {
              const marker = FRET_MARKERS.find((item) => item.fret === fret);
              return (
                <span className={marker ? `fret-marker ${marker.type}` : "fret-marker empty"} key={fret}>
                  {marker?.type === "double" ? (
                    <>
                      <span />
                      <span />
                    </>
                  ) : marker ? (
                    <span />
                  ) : null}
                </span>
              );
            })}
          </div>
          {strings.map((string) => {
            const stringNumber = string[0].stringNumber;
            const isStringActive = activeStrings.has(stringNumber);

            return (
            <div className={isStringActive ? "string-row" : "string-row string-disabled"} key={stringNumber}>
              <span className="string-label">
                <span className="string-number">{stringNumber}</span>
                {string[0].stringName}
              </span>
              {string.map((position) => {
                const isInRange = position.fret >= fretRange.start && position.fret <= fretRange.end;
                const visualState = fretPositionVisualState({
                  pitchClass: position.pitchClass,
                  fret: position.fret,
                  pitchClassesA,
                  pitchClassesB,
                  rootA,
                  rootB,
                  layers: visualizationLayers,
                  cagedPositionA,
                  cagedPositionB
                });
                const cellClasses = [
                  "fret-cell",
                  position.fret === 0 ? "open-string-cell" : "",
                  isInRange ? "in-range" : "out-of-range"
                ]
                  .filter(Boolean)
                  .join(" ");
                const noteLabel =
                  displayMode === "degrees"
                    ? combinedDegreeLabel(
                        position.pitchClass,
                        degreeLabelsA,
                        degreeLabelsB,
                        visualState.visibleToA,
                        visualState.visibleToB
                      )
                    : pitchClassName(position.pitchClass, spelling);
                const noteClasses = [
                  stateClassFor(
                    visualState.isCommon,
                    visualState.isOnlyA,
                    visualState.isOnlyB,
                    visualState.isRootA,
                    visualState.isRootB
                  ),
                  displayMode === "degrees" ? "degree-label" : "",
                  noteLabel.includes("/") ? "dual-degree-label" : ""
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div className={cellClasses} key={`${position.stringNumber}-${position.fret}`}>
                    {isStringActive && isInRange && visualState.isVisible ? (
                    <span className={noteClasses}>{noteLabel}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
