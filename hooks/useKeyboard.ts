import { useEffect } from "react";
import { KEYBOARD_MAP } from "@/lib/musicUtils";

export function useKeyboard(
  onNotePress: (note: string) => void,
  onNoteRelease: (note: string) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // 修飾キーが押されている場合は無視
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.toLowerCase();
      const note = KEYBOARD_MAP[key];

      if (note && !event.repeat) {
        event.preventDefault();
        onNotePress(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const note = KEYBOARD_MAP[key];

      if (note) {
        event.preventDefault();
        onNoteRelease(note);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onNotePress, onNoteRelease, enabled]);
}
