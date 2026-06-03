import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { DisplayPreferences } from "../components/DisplayPreferences";
import { Fretboard, type PitchClassVisualState } from "../components/Fretboard";
import { FretboardLegend } from "../components/FretboardLegend";
import { FretRangeSelector, type FretRange } from "../components/FretRangeSelector";
import { IntervalSelector } from "../components/IntervalSelector";
import { MaterialComparisonPanel, type ActiveMaterialSummary } from "../components/MaterialComparisonPanel";
import { SystemSelector, type MaterialMode } from "../components/SystemSelector";
import {
  VisualizationSelector,
  type VisualizationLayer,
  type VisualizationLayers
} from "../components/VisualizationSelector";
import type { ScaleId } from "../data/scales";
import type { SpellingPreference } from "../data/noteNames";
import { generateArpeggios, type ArpeggioType } from "../music/arpeggioGenerator";
import { compareMaterials } from "../music/intersectionAnalyzer";
import { normalizePitchClass, type PitchClass } from "../music/pitchClass";
import { generateScale } from "../music/scaleGenerator";

const toSet = (items: PitchClass[]) => new Set(items);
const keepRootsIn = (roots: PitchClass[], visibleNotes: Set<PitchClass>) =>
  toSet(roots.filter((root) => visibleNotes.has(root)));
const withoutPitchClasses = (source: Set<PitchClass>, excluded: Set<PitchClass>) =>
  new Set([...source].filter((pitchClass) => !excluded.has(pitchClass)));
const unionPitchClasses = (...sets: Set<PitchClass>[]) => new Set(sets.flatMap((set) => [...set]));

export function MainExplorerPage() {
  const [spelling, setSpelling] = useState<SpellingPreference>("flats");
  const [rootA, setRootA] = useState(0);
  const [scaleAId, setScaleAId] = useState<ScaleId>("ionian");
  const [rootB, setRootB] = useState(8);
  const [scaleBId, setScaleBId] = useState<ScaleId>("ionian");
  const [visualizationLayers, setVisualizationLayers] = useState<VisualizationLayers>({
    notesA: true,
    notesB: true,
    common: true
  });
  const [materialModeA, setMaterialModeA] = useState<MaterialMode>("scales");
  const [materialModeB, setMaterialModeB] = useState<MaterialMode>("scales");
  const [arpeggioTypeA, setArpeggioTypeA] = useState<ArpeggioType>("seventh");
  const [arpeggioTypeB, setArpeggioTypeB] = useState<ArpeggioType>("seventh");
  const [selectedArpeggioA, setSelectedArpeggioA] = useState(0);
  const [selectedArpeggioB, setSelectedArpeggioB] = useState(0);
  const [fretRange, setFretRange] = useState<FretRange>({ start: 0, end: 12 });

  const intervalToB = normalizePitchClass(rootB - rootA);
  const scaleA = useMemo(() => generateScale(rootA, scaleAId, spelling), [rootA, scaleAId, spelling]);
  const scaleB = useMemo(() => generateScale(rootB, scaleBId, spelling), [rootB, scaleBId, spelling]);
  const arpeggiosA = useMemo(() => generateArpeggios(scaleA, spelling, "A", arpeggioTypeA), [scaleA, spelling, arpeggioTypeA]);
  const arpeggiosB = useMemo(() => generateArpeggios(scaleB, spelling, "B", arpeggioTypeB), [scaleB, spelling, arpeggioTypeB]);

  useEffect(() => {
    setSelectedArpeggioA(0);
  }, [rootA, scaleAId, arpeggioTypeA]);

  useEffect(() => {
    setSelectedArpeggioB(0);
  }, [rootB, scaleBId, arpeggioTypeB]);

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

  const toggleVisualizationLayer = (layer: VisualizationLayer) => {
    setVisualizationLayers((current) => ({
      ...current,
      [layer]: !current[layer]
    }));
  };

  const visualStates: PitchClassVisualState = useMemo(() => {
    const rootsA = [materialA.root];
    const rootsB = [materialB.root];
    const notesA = toSet(activeComparison.a);
    const notesB = toSet(activeComparison.b);
    const common = toSet(activeComparison.common);
    const showCommon = visualizationLayers.common || (visualizationLayers.notesA && visualizationLayers.notesB);
    const visibleCommon = showCommon ? common : new Set<PitchClass>();
    const visibleOnlyA = visualizationLayers.notesA ? withoutPitchClasses(notesA, visibleCommon) : new Set<PitchClass>();
    const visibleOnlyB = visualizationLayers.notesB ? withoutPitchClasses(notesB, visibleCommon) : new Set<PitchClass>();
    const visibleAForRoots = unionPitchClasses(visibleOnlyA, visibleCommon);
    const visibleBForRoots = unionPitchClasses(visibleOnlyB, visibleCommon);

    const base = {
      common: new Set<PitchClass>(),
      onlyA: new Set<PitchClass>(),
      onlyB: new Set<PitchClass>(),
      rootsA: new Set<PitchClass>(),
      rootsB: new Set<PitchClass>()
    };

    return {
      ...base,
      common: visibleCommon,
      onlyA: visibleOnlyA,
      onlyB: visibleOnlyB,
      rootsA: keepRootsIn(rootsA, visibleAForRoots),
      rootsB: keepRootsIn(rootsB, visibleBForRoots)
    };
  }, [activeComparison, materialA.root, materialB.root, visualizationLayers]);

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
            onRootChange={setRootB}
            onScaleChange={setScaleBId}
            onMaterialModeChange={setMaterialModeB}
            onArpeggioTypeChange={setArpeggioTypeB}
            onSelectedArpeggioChange={setSelectedArpeggioB}
          />
        </div>
        <div className="stack">
          <DisplayPreferences spelling={spelling} onChange={setSpelling} />
          <VisualizationSelector layers={visualizationLayers} onToggle={toggleVisualizationLayer} />
          <IntervalSelector interval={intervalToB} />
          <FretRangeSelector range={fretRange} onChange={setFretRange} />
        </div>
      </div>

      <div className="fretboard-block">
        <FretboardLegend />
        <Fretboard states={visualStates} spelling={spelling} fretRange={fretRange} />
      </div>

      <MaterialComparisonPanel materialA={materialA} materialB={materialB} comparison={activeComparison} spelling={spelling} />
    </main>
  );
}
