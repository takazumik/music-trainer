// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Example: global test setup
// import '@testing-library/jest-dom'

// Mock Web Audio API for Tone.js
global.AudioContext = jest.fn().mockImplementation(() => ({
  createGain: jest.fn(),
  createOscillator: jest.fn(),
  destination: {},
  currentTime: 0,
  sampleRate: 44100,
  state: 'running',
  resume: jest.fn().mockResolvedValue(undefined),
  suspend: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
}))

global.webkitAudioContext = global.AudioContext
