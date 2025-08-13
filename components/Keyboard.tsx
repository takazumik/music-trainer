import React from "react";
import { Key } from "./Key";
import { generateKeyboardData } from "@/lib/musicUtils";
import { KeyboardProps } from "@/types/music";

export const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onKeyRelease,
  correctNotes,
  pressedNotes,
  incorrectNotes,
  showNoteNames,
  showHints,
}) => {
  const keys = generateKeyboardData();

  // 白鍵と黒鍵を分けてレンダリング
  const whiteKeys = keys.filter((key) => !key.isBlack);
  const blackKeys = keys.filter((key) => key.isBlack);

  // オクターブごとに分割
  const octave3WhiteKeys = whiteKeys.filter((k) => k.octave === 3);
  const octave4WhiteKeys = whiteKeys.filter((k) => k.octave === 4);
  const octave5WhiteKeys = whiteKeys.filter((k) => k.octave === 5);
  const octave3BlackKeys = blackKeys.filter((k) => k.octave === 3);
  const octave4BlackKeys = blackKeys.filter((k) => k.octave === 4);

  return (
    <div className='relative w-full max-w-6xl mx-auto px-4'>
      {/* モバイル用の横スクロールコンテナ */}
      <div className='overflow-x-auto pb-4'>
        <div className='relative inline-flex min-w-max'>
          {/* オクターブ3 (C3-B3) */}
          <div className='relative flex'>
            {/* 白鍵 */}
            {octave3WhiteKeys.map((key) => (
              <Key
                key={key.note}
                note={key.note}
                isBlack={false}
                isPressed={pressedNotes.includes(key.note)}
                isCorrect={
                  correctNotes.includes(key.note) &&
                  pressedNotes.includes(key.note)
                }
                isIncorrect={incorrectNotes.includes(key.note)}
                isHinted={showHints && correctNotes.includes(key.note)}
                showNoteName={showNoteNames}
                onClick={() => onKeyPress(key.note)}
                onRelease={() => onKeyRelease(key.note)}
              />
            ))}
            {/* 黒鍵 */}
            {octave3BlackKeys.map((key) => (
              <Key
                key={key.note}
                note={key.note}
                isBlack={true}
                isPressed={pressedNotes.includes(key.note)}
                isCorrect={
                  correctNotes.includes(key.note) &&
                  pressedNotes.includes(key.note)
                }
                isIncorrect={incorrectNotes.includes(key.note)}
                isHinted={showHints && correctNotes.includes(key.note)}
                showNoteName={showNoteNames}
                onClick={() => onKeyPress(key.note)}
                onRelease={() => onKeyRelease(key.note)}
                position={key.position}
              />
            ))}
          </div>

          {/* オクターブ4 (C4-B4) */}
          <div className='relative flex'>
            {/* 白鍵 */}
            {octave4WhiteKeys.map((key) => (
              <Key
                key={key.note}
                note={key.note}
                isBlack={false}
                isPressed={pressedNotes.includes(key.note)}
                isCorrect={
                  correctNotes.includes(key.note) &&
                  pressedNotes.includes(key.note)
                }
                isIncorrect={incorrectNotes.includes(key.note)}
                isHinted={showHints && correctNotes.includes(key.note)}
                showNoteName={showNoteNames}
                onClick={() => onKeyPress(key.note)}
                onRelease={() => onKeyRelease(key.note)}
              />
            ))}
            {/* 黒鍵 */}
            {octave4BlackKeys.map((key) => (
              <Key
                key={key.note}
                note={key.note}
                isBlack={true}
                isPressed={pressedNotes.includes(key.note)}
                isCorrect={
                  correctNotes.includes(key.note) &&
                  pressedNotes.includes(key.note)
                }
                isIncorrect={incorrectNotes.includes(key.note)}
                isHinted={showHints && correctNotes.includes(key.note)}
                showNoteName={showNoteNames}
                onClick={() => onKeyPress(key.note)}
                onRelease={() => onKeyRelease(key.note)}
                position={key.position}
              />
            ))}
          </div>

          {/* オクターブ5 (C5のみ) */}
          <div className='relative flex'>
            {octave5WhiteKeys.map((key) => (
              <Key
                key={key.note}
                note={key.note}
                isBlack={false}
                isPressed={pressedNotes.includes(key.note)}
                isCorrect={
                  correctNotes.includes(key.note) &&
                  pressedNotes.includes(key.note)
                }
                isIncorrect={incorrectNotes.includes(key.note)}
                isHinted={showHints && correctNotes.includes(key.note)}
                showNoteName={showNoteNames}
                onClick={() => onKeyPress(key.note)}
                onRelease={() => onKeyRelease(key.note)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* キーボードショートカットのヒント */}
      <div className='mt-4 text-center text-sm text-gray-600'>
        <p>キーボード: 白鍵 [Z-M, Q-I] | 黒鍵 [S,D,G,H,J...]</p>
      </div>
    </div>
  );
};
