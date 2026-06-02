import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { DisplayPreferences } from "../components/DisplayPreferences";
import { Fretboard, type PitchClassVisualState } from "../components/Fretboard";
import { FretboardLegend } from "../components/FretboardLegend";
import { IntervalSelector } from "../components/IntervalSelector";
import { MaterialComparisonPanel, type ActiveMaterialSummary } from "../components/MaterialComparisonPanel";
import { SystemSelector, type MaterialMode } from "../components/SystemSelector";
import { VisualizationSelector, type VisualizationMode } from "../components/VisualizationSelector";
import type { ScaleId } from "../data/scales";
import type { SpellingPreference } from "../data/noteNames";
import { generateArpeggios, type ArpeggioType } from "../music/arpeggioGenerator";
import { compareMaterials } from "../music/intersectionAnalyzer";
import { pitchClassName, transposePitchClass, type PitchClass } from "../music/pitchClass";
import { generateScale } from "../music/scaleGenerator";

const toSet = (items: PitchClass[]) => new Set(items);
const keepRootsIn = (roots: PitchClass[], visibleNotes: Set<PitchClass>) =>
  toSet(roots.filter((root) => visibleNotes.has(root)));

export function MainExplorerPage() {
  const [spelling, setSpelling] = useState<SpellingPreference>("flats");
  const [rootA, setRootA] = useState(0);
  const [scaleAId, setScaleAId] = useState<ScaleId>("ionian");
  const [intervalToB, setIntervalToB] = useState(8);
  const [scaleBId, setScaleBId] = useState<ScaleId>("ionian");
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>("common");
  const [materialModeA, setMaterialModeA] = useState<MaterialMode>("scales");
  const [materialModeB, setMaterialModeB] = useState<MaterialMode>("scales");
  const [arpeggioTypeA, setArpeggioTypeA] = useState<ArpeggioType>("seventh");
  const [arpeggioTypeB, setArpeggioTypeB] = useState<ArpeggioType>("seventh");
  const [selectedArpeggioA, setSelectedArpeggioA] = useState(0);
  const [selectedArpeggioB, setSelectedArpeggioB] = useState(0);

  const rootB = transposePitchClass(rootA, intervalToB);
  const scaleA = useMemo(() => generateScale(rootA, scaleAId, spelling), [rootA, scaleAId, spelling]);
  const scaleB = useMemo(() => generateScale(rootB, scaleBId, spelling), [rootB, scaleBId, spelling]);
  const arpeggiosA = useMemo(() => generateArpeggios(scaleA, spelling, "A", arpeggioTypeA), [scaleA, spelling, arpeggioTypeA]);
  const arpeggiosB = useMemo(() => generateArpeggios(scaleB, spelling, "B", arpeggioTypeB), [scaleB, spelling, arpeggioTypeB]);

  useEffect(() => {
    setSelectedArpeggioA(0);
  }, [rootA, scaleAId, arpeggioTypeA]);

  useEffect(() => {
    setSelectedArpeggioB(0);
  }, [rootA, intervalToB, scaleBId, arpeggioTypeB]);

  const materialA: ActiveMaterialSummary & { root: PitchClass } = useMemo(() => {
    const arpeggio = arpeggiosA[selectedArpeggioA];
    if (materialModeA === "arpeggios" && arpeggio) {
      return {
        label: `${arpeggio.roman} ${arpeggio.chordName}`,
        notes: arpeggio.notes,
        noteNames: arpeggio.noteNames,
        root: arpeggio.root
      };
    }
    return {
      label: `${scaleA.noteNames[0]} ${scaleA.label}`,
      notes: scaleA.notes,
      noteNames: scaleA.noteNames,
      root: rootA
    };
  }, [arpeggiosA, materialModeA, rootA, scaleA, selectedArpeggioA]);

  const materialB: ActiveMaterialSummary & { root: PitchClass } = useMemo(() => {
    const arpeggio = arpeggiosB[selectedArpeggioB];
    if (materialModeB === "arpeggios" && arpeggio) {
      return {
        label: `${arpeggio.roman} ${arpeggio.chordName}`,
        notes: arpeggio.notes,
        noteNames: arpeggio.noteNames,
        root: arpeggio.root
      };
    }
    return {
      label: `${scaleB.noteNames[0]} ${scaleB.label}`,
      notes: scaleB.notes,
      noteNames: scaleB.noteNames,
      root: rootB
    };
  }, [arpeggiosB, materialModeB, rootB, scaleB, selectedArpeggioB]);

  const activeComparison = useMemo(() => compareMaterials(materialA.notes, materialB.notes), [materialA.notes, materialB.notes]);

  const visualStates: PitchClassVisualState = useMemo(() => {
    const rootsA = [materialA.root];
    const rootsB = [materialB.root];
    const notesA = toSet(activeComparison.a);
    const notesB = toSet(activeComparison.b);
    const common = toSet(activeComparison.common);
    const base = {
      common: new Set<PitchClass>(),
      onlyA: new Set<PitchClass>(),
      onlyB: new Set<PitchClass>(),
      rootsA: new Set<PitchClass>(),
      rootsB: new Set<PitchClass>()
    };

    if (visualizationMode === "notesA") {
      return {
        ...base,
        onlyA: notesA,
        rootsA: keepRootsIn(rootsA, notesA)
      };
    }
    if (visualizationMode === "notesB") {
      return {
        ...base,
        onlyB: notesB,
        rootsB: keepRootsIn(rootsB, notesB)
      };
    }
    return {
      ...base,
      common,
      rootsA: keepRootsIn(rootsA, common),
      rootsB: keepRootsIn(rootsB, common)
    };
  }, [activeComparison, materialA.root, materialB.root, visualizationMode]);

  return (
    <main className="app-shell">
      <AppHeader />
      <div className="top-grid">
        <SystemSelector
          title="Sistema A"
          root={rootA}
          scaleId={scaleAId}
          scale={scaleA}
          materialMode={materialModeA}
          arpeggioType={arpeggioTypeA}
          arpeggios={arpeggiosA}
          selectedArpeggio={selectedArpeggioA}
          onRootChange={setRootA}
          onScaleChange={setScaleAId}
          onMaterialModeChange={setMaterialModeA}
          onArpeggioTypeChange={setArpeggioTypeA}
          onSelectedArpeggioChange={setSelectedArpeggioA}
        />
        <div className="stack">
          <SystemSelector
            title="Sistema B"
            root={rootB}
            scaleId={scaleBId}
            scale={scaleB}
            materialMode={materialModeB}
            arpeggioType={arpeggioTypeB}
            arpeggios={arpeggiosB}
            selectedArpeggio={selectedArpeggioB}
            rootLocked
            rootLabel={pitchClassName(rootB, spelling)}
            onScaleChange={setScaleBId}
            onMaterialModeChange={setMaterialModeB}
            onArpeggioTypeChange={setArpeggioTypeB}
            onSelectedArpeggioChange={setSelectedArpeggioB}
          />
        </div>
        <div className="stack">
          <DisplayPreferences spelling={spelling} onChange={setSpelling} />
          <VisualizationSelector mode={visualizationMode} onChange={setVisualizationMode} />
          <IntervalSelector interval={intervalToB} onChange={setIntervalToB} />
        </div>
      </div>

      <div className="fretboard-block">
        <FretboardLegend />
        <Fretboard states={visualStates} spelling={spelling} />
      </div>

      <MaterialComparisonPanel materialA={materialA} materialB={materialB} comparison={activeComparison} spelling={spelling} />
    </main>
  );
}
