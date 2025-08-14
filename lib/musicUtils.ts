import { Scale } from "tonal";
import { Note, ScaleType, KeyData } from "@/types/music";

export const ALL_NOTES: Note[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// エンハーモニック（異名同音）の変換マップ
// フラット記号をシャープ記号に統一（一方向のみ）
const ENHARMONIC_MAP: { [key: string]: string } = {
  // フラット → シャープ変換
  "Bb": "A#",
  "Db": "C#",
  "Eb": "D#",
  "Gb": "F#",
  "Ab": "G#",
  // 複雑な記号の変換（理論的な音名）
  "E#": "F",
  "B#": "C",
  "F##": "G",
  "C##": "D",
  "G##": "A",  // A# major scale用
  // NOTE: シャープ→フラット変換は削除（逆変換バグの原因）
};

// エンハーモニック変換関数
function normalizeNoteName(note: string): string {
  // フラット記号をシャープ記号に統一
  return ENHARMONIC_MAP[note] || note;
}

export function getScaleNotes(key: Note, scaleType: ScaleType): string[] {
  const scaleName = scaleType === "major" ? "major" : "minor";
  const scale = Scale.get(`${key} ${scaleName}`);

  // 3オクターブ分の音階を生成（C3からC5）
  const scaleNotes: string[] = [];
  for (let octave = 3; octave <= 5; octave++) {
    scale.notes.forEach((note) => {
      // フラット記号をシャープ記号に統一
      const normalizedNote = normalizeNoteName(note);
      const fullNote = `${normalizedNote}${octave}`;
      if (octave === 5 && normalizedNote !== "C") return; // C5より上は含めない
      scaleNotes.push(fullNote);
    });
  }

  return scaleNotes;
}

export function generateKeyboardData(): KeyData[] {
  const keys: KeyData[] = [];

  for (let octave = 3; octave <= 5; octave++) {
    ALL_NOTES.forEach((note, index) => {
      // C5より上は含めない
      if (octave === 5 && note !== "C") return;

      const isBlack = note.includes("#");
      const midi = octave * 12 + index;

      const keyData: KeyData = {
        note: `${note}${octave}`,
        octave,
        midi,
        isBlack,
      };

      if (isBlack) {
        // 黒鍵の位置計算（各オクターブ内での相対位置）
        const blackKeyPositions: { [key: string]: string } = {
          "C#": "8.5%",
          "D#": "20.5%",
          "F#": "44.5%",
          "G#": "56.5%",
          "A#": "68.5%",
        };
        keyData.position = { left: blackKeyPositions[note] || "0%" };
      }

      keys.push(keyData);
    });
  }

  return keys;
}

export function noteToMidi(note: string): number {
  const noteRegex = /^([A-G]#?)(\d)$/;
  const match = note.match(noteRegex);
  if (!match) return -1;

  const [, noteName, octaveStr] = match;
  const octave = parseInt(octaveStr);
  const noteIndex = ALL_NOTES.indexOf(noteName as Note);

  if (noteIndex === -1) return -1;

  return octave * 12 + noteIndex;
}

export function midiToNote(midi: number): string {
  const octave = Math.floor(midi / 12);
  const noteIndex = midi % 12;
  return `${ALL_NOTES[noteIndex]}${octave}`;
}

export function isNoteInScale(note: string, scaleNotes: string[]): boolean {
  // オクターブを無視して音名のみで比較
  const noteWithoutOctave = note.replace(/\d+$/, "");
  const normalizedNote = normalizeNoteName(noteWithoutOctave);

  return scaleNotes.some((scaleNote) => {
    const scaleNoteWithoutOctave = scaleNote.replace(/\d+$/, "");
    const normalizedScaleNote = normalizeNoteName(scaleNoteWithoutOctave);
    return normalizedNote === normalizedScaleNote;
  });
}

// PCキーボードマッピング（仕様書Ver.1.6準拠）
export const KEYBOARD_MAP: { [key: string]: string } = {
  // 白鍵（下段）
  z: "C3",
  x: "D3",
  c: "E3",
  v: "F3",
  b: "G3",
  n: "A3",
  m: "B3",
  ",": "C4",
  ".": "D4",
  "/": "E4",

  // 黒鍵（上段）
  s: "C#3",
  d: "D#3",
  g: "F#3",
  h: "G#3",
  j: "A#3",
  k: "C#4",
  l: "D#4",

  // 追加マッピング（2オクターブ目）
  q: "C4",
  w: "D4",
  e: "E4",
  r: "F4",
  t: "G4",
  y: "A4",
  u: "B4",
  i: "C5",

  "2": "C#4",
  "3": "D#4",
  "5": "F#4",
  "6": "G#4",
  "7": "A#4",
};
