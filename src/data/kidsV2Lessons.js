// Kids V2 lesson definitions.
//
// Each lesson is an array of exercises. Exercise kinds:
//   - match    : { he: ['א','ב','ג','ד'], en: ['1','2','3','4'], answer: [[0,2],[1,0],[2,3],[3,1]] }
//                user must tap pairs that connect (Hebrew word ↔ English word)
//   - listen   : { audio: 'משה', choices: ['משה','תורה','סיני','יהושע'], answer: 0 }
//                speech-synthesis reads the answer; user taps the matching Hebrew word
//   - order    : { words: ['קבל','משה','תורה','מסיני'], correct: [1,0,2,3] }
//                user taps Hebrew words in correct order to build the phrase
//   - choose   : { prompt: '...', choices: ['...','...','...','...'], answer: 0, lang: 'en'|'he' }
//                multiple choice with prompt + 4 options
//
// XP per correct: 5. Per lesson: roughly 25-30 XP if all correct.

export const LESSONS = {
  '1.1': {
    perek: 1,
    mishnah: 1,
    title: 'Moses received the Torah',
    titleHe: 'משה קבל תורה',
    theme: 'The Chain of Tradition',
    intro: 'Learn the very first Mishnah of Pirkei Avot — how the Torah was passed down from Moses, generation to generation.',
    exercises: [
      {
        kind: 'match',
        instruction: 'Match each Hebrew word with its meaning.',
        pairs: [
          { he: 'מֹשֶׁה', en: 'Moshe (Moses)' },
          { he: 'תּוֹרָה', en: 'Torah' },
          { he: 'סִינַי', en: 'Sinai' },
          { he: 'יְהוֹשֻׁעַ', en: 'Yehoshua (Joshua)' },
        ],
      },
      {
        kind: 'listen',
        instruction: 'Listen and tap the Hebrew word you hear.',
        speakText: 'מֹשֶׁה',
        speakLang: 'he-IL',
        choices: ['מֹשֶׁה', 'תּוֹרָה', 'סִינַי', 'יְהוֹשֻׁעַ'],
        answer: 0,
      },
      {
        kind: 'order',
        instruction: 'Tap the words in order to build the phrase.',
        translation: 'Moses received the Torah from Sinai',
        words: ['קִבֵּל', 'מֹשֶׁה', 'תּוֹרָה', 'מִסִּינַי'],
        // Correct order: משה קבל תורה מסיני → indices [1, 0, 2, 3]
        correctOrder: [1, 0, 2, 3],
      },
      {
        kind: 'choose',
        instruction: 'What did Moses receive at Mount Sinai?',
        choices: ['The Torah', 'A sword', 'A crown', 'A scroll of poems'],
        answer: 0,
        lang: 'en',
      },
      {
        kind: 'choose',
        instruction: 'After Moshe, who received the Torah next?',
        choices: ['The Prophets', 'Yehoshua (Joshua)', 'The Kings', 'King David'],
        answer: 1,
        lang: 'en',
      },
      {
        kind: 'choose',
        instruction: 'The Men of the Great Assembly said three things. Which one?',
        choices: [
          'Wake up early every day',
          'Be deliberate in judgment',
          'Sing songs of praise',
          'Travel to far lands',
        ],
        answer: 1,
        lang: 'en',
      },
    ],
  },
  // Lessons for 1:2 and 1:3 will be added in a follow-up session.
};

export function getLesson(perek, mishnah) {
  return LESSONS[`${perek}.${mishnah}`] || null;
}

// Expose the map on window so buildPath can know which stops are playable
// without creating an import cycle.
if (typeof window !== 'undefined') {
  window.__avotKidsV2Lessons = LESSONS;
}
