export type Note =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export type ScaleType = "major" | "minor";

export interface KeyData {
  note: string;
  octave: number;
  midi: number;
  isBlack: boolean;
  position?: { left: string };
}

export interface ScaleData {
  key: Note;
  type: ScaleType;
  notes: string[];
}

export interface PracticeSettings {
  key: Note;
  scaleType: ScaleType;
  showNoteNames: boolean;
  showHints: boolean;
}

export interface KeyboardProps {
  onKeyPress: (note: string) => void;
  onKeyRelease: (note: string) => void;
  correctNotes: string[];
  pressedNotes: string[];
  incorrectNotes: string[];
  showNoteNames: boolean;
  showHints: boolean;
}

export interface ControlPanelProps {
  settings: PracticeSettings;
  onSettingsChange: (settings: PracticeSettings) => void;
  onReset: () => void;
  midiDevices: MIDIInput[];
  selectedMidiDevice: string | null;
  onMidiDeviceChange: (deviceId: string) => void;
}

export interface MidiStatus {
  isConnected: boolean;
  deviceName: string | null;
  isSupported: boolean;
  devices: MIDIInput[];
}
