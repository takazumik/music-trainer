import { getScaleNotes, isNoteInScale } from '@/lib/musicUtils'

describe('musicUtils', () => {
  describe('getScaleNotes', () => {
    test('should generate C major scale correctly', () => {
      const scaleNotes = getScaleNotes('C', 'major')

      // C major should contain these notes (normalized to sharp notation)
      const expectedNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

      // Check if all expected notes are present across octaves
      expectedNotes.forEach(note => {
        const hasNote = scaleNotes.some(scaleNote =>
          scaleNote.replace(/\d+$/, '') === note
        )
        expect(hasNote).toBe(true)
      })
    })

    test('should normalize F major scale (Bb -> A#)', () => {
      const scaleNotes = getScaleNotes('F', 'major')

      // F major should be: F, G, A, A# (not Bb), C, D, E
      const expectedNotes = ['F', 'G', 'A', 'A#', 'C', 'D', 'E']

      expectedNotes.forEach(note => {
        const hasNote = scaleNotes.some(scaleNote =>
          scaleNote.replace(/\d+$/, '') === note
        )
        expect(hasNote).toBe(true)
      })

      // Should NOT contain Bb (should be normalized to A#)
      const hasBb = scaleNotes.some(scaleNote =>
        scaleNote.replace(/\d+$/, '') === 'Bb'
      )
      expect(hasBb).toBe(false)
    })
  })

  describe('isNoteInScale', () => {
    test('should correctly identify notes in C major scale', () => {
      const cMajorNotes = getScaleNotes('C', 'major')

      // These notes should be in C major
      expect(isNoteInScale('C4', cMajorNotes)).toBe(true)
      expect(isNoteInScale('D3', cMajorNotes)).toBe(true)
      expect(isNoteInScale('E5', cMajorNotes)).toBe(true)

      // These notes should NOT be in C major
      expect(isNoteInScale('C#4', cMajorNotes)).toBe(false)
      expect(isNoteInScale('F#3', cMajorNotes)).toBe(false)
    })

    test('should handle enharmonic equivalents correctly in F major', () => {
      const fMajorNotes = getScaleNotes('F', 'major')

      // A# should be recognized (even though Tonal gives us Bb)
      expect(isNoteInScale('A#4', fMajorNotes)).toBe(true)
      expect(isNoteInScale('A#3', fMajorNotes)).toBe(true)

      // Other F major notes
      expect(isNoteInScale('F4', fMajorNotes)).toBe(true)
      expect(isNoteInScale('G4', fMajorNotes)).toBe(true)
      expect(isNoteInScale('A4', fMajorNotes)).toBe(true)
      expect(isNoteInScale('C4', fMajorNotes)).toBe(true)
      expect(isNoteInScale('D4', fMajorNotes)).toBe(true)
      expect(isNoteInScale('E4', fMajorNotes)).toBe(true)

      // Notes NOT in F major
      expect(isNoteInScale('F#4', fMajorNotes)).toBe(false)
      expect(isNoteInScale('C#4', fMajorNotes)).toBe(false)
      expect(isNoteInScale('B4', fMajorNotes)).toBe(false)
    })

    test('should handle minor scales correctly', () => {
      const aMinorNotes = getScaleNotes('A', 'minor')

      // A natural minor: A, B, C, D, E, F, G
      expect(isNoteInScale('A4', aMinorNotes)).toBe(true)
      expect(isNoteInScale('C4', aMinorNotes)).toBe(true)
      expect(isNoteInScale('F4', aMinorNotes)).toBe(true)
      expect(isNoteInScale('G4', aMinorNotes)).toBe(true)

      // These should NOT be in A minor
      expect(isNoteInScale('C#4', aMinorNotes)).toBe(false)
      expect(isNoteInScale('F#4', aMinorNotes)).toBe(false)
      expect(isNoteInScale('G#4', aMinorNotes)).toBe(false)
    })
  })
})
