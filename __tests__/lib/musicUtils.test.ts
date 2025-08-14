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

    test('should preserve C# major scale without reverse conversion', () => {
      const scaleNotes = getScaleNotes('C#', 'major')

      // C# major should contain: C#, D#, F (from E#), F#, G#, A#, C (from B#)
      const expectedNotes = ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C']

      expectedNotes.forEach(note => {
        const hasNote = scaleNotes.some(scaleNote =>
          scaleNote.replace(/\d+$/, '') === note
        )
        expect(hasNote).toBe(true)
      })

      // Should NOT be converted to Db major
      const hasDbNotes = scaleNotes.some(note => note.includes('Db')) ||
                        scaleNotes.some(note => note.includes('Eb'))
      expect(hasDbNotes).toBe(false)
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

    test('should correctly identify notes in C# major scale', () => {
      const cSharpMajorNotes = getScaleNotes('C#', 'major')

      // These notes should be in C# major
      expect(isNoteInScale('C#4', cSharpMajorNotes)).toBe(true)
      expect(isNoteInScale('D#3', cSharpMajorNotes)).toBe(true)
      expect(isNoteInScale('F4', cSharpMajorNotes)).toBe(true)  // from E#
      expect(isNoteInScale('F#4', cSharpMajorNotes)).toBe(true)
      expect(isNoteInScale('G#4', cSharpMajorNotes)).toBe(true)
      expect(isNoteInScale('A#4', cSharpMajorNotes)).toBe(true)
      expect(isNoteInScale('C5', cSharpMajorNotes)).toBe(true)  // from B#

      // These notes should NOT be in C# major
      expect(isNoteInScale('D4', cSharpMajorNotes)).toBe(false)
      expect(isNoteInScale('E4', cSharpMajorNotes)).toBe(false)
      expect(isNoteInScale('G4', cSharpMajorNotes)).toBe(false)
      expect(isNoteInScale('A4', cSharpMajorNotes)).toBe(false)
      expect(isNoteInScale('B4', cSharpMajorNotes)).toBe(false)
    })
  })

  describe('comprehensive scale tests', () => {
    // Test all 12 major scales with their expected notes (normalized)
    const majorScaleTests = [
      { key: 'C', expected: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
      { key: 'G', expected: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
      { key: 'D', expected: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
      { key: 'A', expected: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
      { key: 'E', expected: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
      { key: 'B', expected: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
      { key: 'F#', expected: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'] }, // E# → F
      { key: 'C#', expected: ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'] }, // E# → F, B# → C
      { key: 'F', expected: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'] },       // Bb → A#
      { key: 'A#', expected: ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'] },     // B# → C, C## → D, E# → F, F## → G, G## → A
      { key: 'D#', expected: ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'] },    // Complex enharmonics normalized
      { key: 'G#', expected: ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'] },   // Complex enharmonics normalized
    ];

    const minorScaleTests = [
      { key: 'A', expected: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
      { key: 'E', expected: ['E', 'F#', 'G', 'A', 'B', 'C', 'D'] },
      { key: 'B', expected: ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'] },
      { key: 'F#', expected: ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'] },
      { key: 'C#', expected: ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'] },
      { key: 'G#', expected: ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'] },
      { key: 'D#', expected: ['D#', 'F', 'F#', 'G#', 'A#', 'B', 'C#'] }, // E# → F
      { key: 'A#', expected: ['A#', 'C', 'C#', 'D#', 'F', 'F#', 'G#'] }, // B# → C
      { key: 'D', expected: ['D', 'E', 'F', 'G', 'A', 'A#', 'C'] },       // Bb → A#
      { key: 'G', expected: ['G', 'A', 'A#', 'C', 'D', 'D#', 'F'] },      // Bb → A#, Eb → D#
      { key: 'C', expected: ['C', 'D', 'D#', 'F', 'G', 'G#', 'A#'] },     // Eb → D#, Ab → G#, Bb → A#
      { key: 'F', expected: ['F', 'G', 'G#', 'A#', 'C', 'C#', 'D#'] },    // Ab → G#, Bb → A#, Db → C#, Eb → D#
    ];

    test.each(majorScaleTests)('$key major scale should contain correct notes', ({ key, expected }) => {
      const scaleNotes = getScaleNotes(key as any, 'major');

      expected.forEach(note => {
        const hasNote = scaleNotes.some(scaleNote =>
          scaleNote.replace(/\d+$/, '') === note
        );
        expect(hasNote).toBe(true);
      });
    });

    test.each(minorScaleTests)('$key minor scale should contain correct notes', ({ key, expected }) => {
      const scaleNotes = getScaleNotes(key as any, 'minor');

      expected.forEach(note => {
        const hasNote = scaleNotes.some(scaleNote =>
          scaleNote.replace(/\d+$/, '') === note
        );
        expect(hasNote).toBe(true);
      });
    });

    // Test that each scale's tonic note is recognized correctly
    test.each(majorScaleTests)('$key major scale should recognize its tonic note', ({ key }) => {
      const scaleNotes = getScaleNotes(key as any, 'major');
      expect(isNoteInScale(`${key}4`, scaleNotes)).toBe(true);
    });

    test.each(minorScaleTests)('$key minor scale should recognize its tonic note', ({ key }) => {
      const scaleNotes = getScaleNotes(key as any, 'minor');
      expect(isNoteInScale(`${key}4`, scaleNotes)).toBe(true);
    });
  })
})
