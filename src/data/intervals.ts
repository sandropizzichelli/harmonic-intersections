export const INTERVAL_LABELS = [
  "unisono",
  "seconda minore",
  "seconda maggiore",
  "terza minore",
  "terza maggiore",
  "quarta giusta",
  "tritono",
  "quinta giusta",
  "sesta minore",
  "sesta maggiore",
  "settima minore",
  "settima maggiore"
];

export const INTERVAL_OPTIONS = INTERVAL_LABELS.map((label, semitones) => ({
  semitones,
  label
}));
