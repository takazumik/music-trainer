import { useEffect, useState, useCallback } from "react";
import { audioEngine } from "@/lib/audioEngine";

export function useAudio() {
  const [isInitialized, setIsInitialized] = useState(false);

  const initialize = useCallback(async () => {
    if (isInitialized) return;

    try {
      await audioEngine.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  }, [isInitialized]);

  const playNote = useCallback(
    (note: string) => {
      if (!isInitialized) {
        console.warn("Audio not initialized, attempting to initialize...");
        initialize();
        return;
      }
      audioEngine.playNote(note);
    },
    [isInitialized, initialize]
  );

  const playCorrectSound = useCallback(() => {
    if (!isInitialized) return;
    audioEngine.playCorrectSound();
  }, [isInitialized]);

  const playIncorrectSound = useCallback(() => {
    if (!isInitialized) return;
    audioEngine.playIncorrectSound();
  }, [isInitialized]);

  useEffect(() => {
    return () => {
      audioEngine.dispose();
    };
  }, []);

  return {
    isInitialized,
    initialize,
    playNote,
    playCorrectSound,
    playIncorrectSound,
  };
}
