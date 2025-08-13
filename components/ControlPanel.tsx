import React from "react";
import { ALL_NOTES } from "@/lib/musicUtils";
import { ControlPanelProps, Note, ScaleType } from "@/types/music";

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onSettingsChange,
  onReset,
  midiDevices,
  selectedMidiDevice,
  onMidiDeviceChange,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <h2 className='text-xl font-bold mb-4'>練習設定</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* キー選択 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            キー (Key)
          </label>
          <select
            value={settings.key}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                key: e.target.value as Note,
              })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {ALL_NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

        {/* スケールタイプ選択 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            スケール (Scale)
          </label>
          <select
            value={settings.scaleType}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                scaleType: e.target.value as ScaleType,
              })
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='major'>メジャースケール</option>
            <option value='minor'>ナチュラルマイナースケール</option>
          </select>
        </div>

        {/* MIDIデバイス選択 */}
        {midiDevices.length > 0 && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              MIDIデバイス
            </label>
            <select
              value={selectedMidiDevice || ""}
              onChange={(e) => onMidiDeviceChange(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>選択してください</option>
              {midiDevices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* オプション設定 */}
      <div className='mt-4 flex flex-wrap gap-4'>
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={settings.showNoteNames}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                showNoteNames: e.target.checked,
              })
            }
            className='rounded text-blue-600 focus:ring-blue-500'
          />
          <span className='text-sm'>音名を表示</span>
        </label>

        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={settings.showHints}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                showHints: e.target.checked,
              })
            }
            className='rounded text-blue-600 focus:ring-blue-500'
          />
          <span className='text-sm'>ヒント表示（正解の鍵盤をハイライト）</span>
        </label>
      </div>

      {/* リセットボタン */}
      <div className='mt-4'>
        <button
          onClick={onReset}
          className='px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
        >
          練習をリセット
        </button>
      </div>
    </div>
  );
};
