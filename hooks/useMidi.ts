import { useEffect, useState, useCallback } from "react";
import { midiToNote } from "@/lib/musicUtils";
import { MidiStatus } from "@/types/music";

export function useMidi(
  onNotePress: (note: string) => void,
  onNoteRelease: (note: string) => void
) {
  const [midiStatus, setMidiStatus] = useState<MidiStatus>({
    isConnected: false,
    deviceName: null,
    isSupported: false,
    devices: [],
  });
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);

  const handleMidiMessage = useCallback(
    (event: MIDIMessageEvent) => {
      if (!event.data) return;
      const data = Array.from(event.data);
      const [status, noteNumber, velocity] = data;

      // Note On message (status 144-159)
      if (status >= 144 && status <= 159) {
        const note = midiToNote(noteNumber);
        if (velocity > 0) {
          onNotePress(note);
        } else {
          onNoteRelease(note);
        }
      }
      // Note Off message (status 128-143)
      else if (status >= 128 && status <= 143) {
        const note = midiToNote(noteNumber);
        onNoteRelease(note);
      }
    },
    [onNotePress, onNoteRelease]
  );

  const selectDevice = useCallback(
    (deviceId: string) => {
      if (!midiAccess) return;

      // 全デバイスのイベントリスナーをクリア
      midiAccess.inputs.forEach((input) => {
        input.onmidimessage = null;
      });

      // 選択されたデバイスのみイベントリスナーを設定
      const selectedDevice = midiAccess.inputs.get(deviceId);
      if (selectedDevice) {
        selectedDevice.onmidimessage = handleMidiMessage;
        setSelectedDeviceId(deviceId);
        setMidiStatus((prev) => ({
          ...prev,
          isConnected: true,
          deviceName: selectedDevice.name || "Unknown MIDI Device",
        }));
      }
    },
    [midiAccess, handleMidiMessage]
  );

  const connectMidiDevices = useCallback(async () => {
    if (!navigator.requestMIDIAccess) {
      console.log("Web MIDI API is not supported in this browser");
      setMidiStatus((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    try {
      const access = await navigator.requestMIDIAccess();
      setMidiAccess(access);
      setMidiStatus((prev) => ({ ...prev, isSupported: true }));

      // 接続されているMIDI入力デバイスを取得
      const devices = Array.from(access.inputs.values());
      setMidiStatus((prev) => ({
        ...prev,
        devices,
      }));

      // デバイスが1つだけの場合は自動選択
      if (devices.length === 1) {
        const device = devices[0];
        device.onmidimessage = handleMidiMessage;
        setSelectedDeviceId(device.id);
        setMidiStatus((prev) => ({
          ...prev,
          isConnected: true,
          deviceName: device.name || "Unknown MIDI Device",
        }));
      }

      // MIDIデバイスの接続/切断を監視
      access.onstatechange = (event: MIDIConnectionEvent) => {
        if (event.port && event.port.type === "input") {
          const newDevices = Array.from(access.inputs.values());
          setMidiStatus((prev) => ({
            ...prev,
            devices: newDevices,
          }));

          if (
            event.port.state === "disconnected" &&
            event.port.id === selectedDeviceId
          ) {
            setSelectedDeviceId(null);
            setMidiStatus((prev) => ({
              ...prev,
              isConnected: false,
              deviceName: null,
            }));
          }
        }
      };
    } catch (error) {
      console.error("Failed to access MIDI devices:", error);
      setMidiStatus({
        isConnected: false,
        deviceName: null,
        isSupported: false,
        devices: [],
      });
    }
  }, [handleMidiMessage]); // selectedDeviceIdを依存配列から削除

  useEffect(() => {
    connectMidiDevices();
  }, []); // 初回のみ実行

  return {
    midiStatus,
    selectedDeviceId,
    selectDevice,
  };
}
