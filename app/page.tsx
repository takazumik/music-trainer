'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Keyboard } from '@/components/Keyboard';
import { ControlPanel } from '@/components/ControlPanel';
import { useAudio } from '@/hooks/useAudio';
import { useMidi } from '@/hooks/useMidi';
import { useKeyboard } from '@/hooks/useKeyboard';
import { getScaleNotes, isNoteInScale } from '@/lib/musicUtils';
import { PracticeSettings } from '@/types/music';

export default function Home() {
  const [settings, setSettings] = useState<PracticeSettings>({
    key: 'C',
    scaleType: 'major',
    showNoteNames: true,
    showHints: false,
  });

  const [pressedNotes, setPressedNotes] = useState<string[]>([]);
  const [incorrectNotes, setIncorrectNotes] = useState<string[]>([]);
  const [completedScales, setCompletedScales] = useState<number>(0);

  const { isInitialized, initialize, playNote, playCorrectSound, playIncorrectSound } = useAudio();

  const scaleNotes = getScaleNotes(settings.key, settings.scaleType);

  const handleNotePress = useCallback((note: string) => {
    // オーディオ初期化（最初のインタラクション時）
    if (!isInitialized) {
      initialize();
    }

    // 既に押されている場合は無視
    if (pressedNotes.includes(note)) return;

    const newPressedNotes = [...pressedNotes, note];
    setPressedNotes(newPressedNotes);

    // 音を鳴らす
    playNote(note);

    // スケールに含まれているかチェック
    if (isNoteInScale(note, scaleNotes)) {
      // 正解音の場合
      const allPressed = scaleNotes.every(scaleNote => {
        const noteWithoutOctave = scaleNote.replace(/\d+$/, '');
        return newPressedNotes.some(pressed => {
          const pressedWithoutOctave = pressed.replace(/\d+$/, '');
          return pressedWithoutOctave === noteWithoutOctave;
        });
      });

      if (allPressed) {
        // スケール完成！
        playCorrectSound();
        setCompletedScales(prev => prev + 1);
        setTimeout(() => {
          setPressedNotes([]);
          setIncorrectNotes([]);
        }, 1000);
      }
    } else {
      // 不正解音
      playIncorrectSound();
      setIncorrectNotes([note]);
      setTimeout(() => {
        setIncorrectNotes([]);
      }, 300);
    }
  }, [pressedNotes, scaleNotes, isInitialized, initialize, playNote, playCorrectSound, playIncorrectSound]);

  const handleNoteRelease = useCallback((note: string) => {
    setPressedNotes(prev => prev.filter(n => n !== note));
  }, []);

  const handleReset = useCallback(() => {
    setPressedNotes([]);
    setIncorrectNotes([]);
  }, []);

  // 設定変更時のリセット
  useEffect(() => {
    handleReset();
  }, [settings.key, settings.scaleType]);

  // MIDI接続
  const { midiStatus, selectedDeviceId, selectDevice } = useMidi(handleNotePress, handleNoteRelease);

  // キーボード入力
  useKeyboard(handleNotePress, handleNoteRelease);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Music Trainer
          </h1>
          <p className="text-gray-600">
            スケールとコードを楽しく学ぼう！
          </p>
          {completedScales > 0 && (
            <p className="mt-2 text-green-600 font-semibold">
              完成したスケール: {completedScales}回
            </p>
          )}
        </header>

        {/* 初期化ボタン（必要な場合） */}
        {!isInitialized && (
          <div className="text-center mb-4">
            <button
              onClick={initialize}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              音声を有効にする（クリックして開始）
            </button>
          </div>
        )}

        {/* MIDI接続状態 */}
        {midiStatus.isSupported && (
          <div className="text-center mb-4">
            <p className={`text-sm ${midiStatus.isConnected ? 'text-green-600' : 'text-gray-500'}`}>
              MIDI: {midiStatus.isConnected ? `接続済み (${midiStatus.deviceName})` : '未接続'}
            </p>
          </div>
        )}

        {/* コントロールパネル */}
        <ControlPanel
          settings={settings}
          onSettingsChange={setSettings}
          onReset={handleReset}
          midiDevices={midiStatus.devices}
          selectedMidiDevice={selectedDeviceId}
          onMidiDeviceChange={selectDevice}
        />

        {/* 現在のスケール表示 */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700">
            {settings.key} {settings.scaleType === 'major' ? 'メジャー' : 'マイナー'}スケール
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            構成音: {scaleNotes.map(n => n.replace(/\d+$/, '')).filter((n, i, arr) => arr.indexOf(n) === i).join(', ')}
          </p>
        </div>

        {/* キーボード */}
        <Keyboard
          onKeyPress={handleNotePress}
          onKeyRelease={handleNoteRelease}
          correctNotes={scaleNotes}
          pressedNotes={pressedNotes}
          incorrectNotes={incorrectNotes}
          showNoteNames={settings.showNoteNames}
          showHints={settings.showHints}
        />
      </div>
    </main>
  );
}
