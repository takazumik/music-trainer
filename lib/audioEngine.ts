import * as Tone from "tone";

class AudioEngine {
  private sampler: Tone.Sampler | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    // Toneを開始（ユーザーインタラクション後に呼ばれる必要がある）
    await Tone.start();

    // ピアノサンプラーを作成
    this.sampler = new Tone.Sampler({
      urls: {
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        console.log("Sampler loaded successfully");
      },
    }).toDestination();

    this.isInitialized = true;
  }

  playNote(note: string, duration: string = "8n") {
    if (!this.sampler || !this.isInitialized) {
      console.warn("Audio engine not initialized");
      return;
    }

    try {
      this.sampler.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error("Error playing note:", error);
    }
  }

  playCorrectSound() {
    if (!this.sampler || !this.isInitialized) return;

    // 正解時は和音を鳴らす（明るい響き）
    const chord = ["C4", "E4", "G4", "C5"];
    chord.forEach((note, index) => {
      setTimeout(() => {
        this.sampler?.triggerAttackRelease(note, "8n");
      }, index * 50);
    });
  }

  playIncorrectSound() {
    if (!this.isInitialized) return;

    // 不正解時はブザー音（200Hz, 300ms）
    // 毎回新しいオシレーターを作成してメモリリークとクラッシュを防ぐ
    const buzzer = new Tone.Oscillator(200, "square").toDestination();
    buzzer.start();
    setTimeout(() => {
      buzzer.stop();
      buzzer.dispose(); // リソースを適切に解放
    }, 300);
  }

  // 音量設定（将来の拡張用）
  setVolume(volume: number) {
    if (this.sampler) {
      this.sampler.volume.value = volume;
    }
  }

  dispose() {
    if (this.sampler) {
      this.sampler.dispose();
    }
    this.isInitialized = false;
  }
}

// シングルトンインスタンス
export const audioEngine = new AudioEngine();
