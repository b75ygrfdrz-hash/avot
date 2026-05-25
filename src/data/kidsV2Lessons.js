// Kids V2 lesson definitions.
//
// Exercise kinds:
//   - match    : tap pairs that connect (Hebrew word ↔ English word)
//   - listen   : speech-synthesis reads the answer; user taps the matching Hebrew word
//   - order    : tap Hebrew words in correct order to build the phrase
//   - choose   : multiple choice with prompt + 4 options
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
        correctOrder: [1, 0, 2, 3],
      },
      {
        kind: 'choose',
        instruction: 'What did Moses receive at Mount Sinai?',
        choices: ['The Torah', 'A sword', 'A crown', 'A scroll of poems'],
        answer: 0,
      },
      {
        kind: 'choose',
        instruction: 'After Moshe, who received the Torah next?',
        choices: ['The Prophets', 'Yehoshua (Joshua)', 'The Kings', 'King David'],
        answer: 1,
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
      },
    ],
  },

  '1.2': {
    perek: 1,
    mishnah: 2,
    title: 'Three Pillars of the World',
    titleHe: 'שִׁמְעוֹן הַצַּדִּיק',
    theme: 'Foundations',
    intro: 'Shimon HaTzaddik teaches that the world stands on three pillars: Torah, Avodah (service), and acts of loving-kindness.',
    exercises: [
      {
        kind: 'match',
        instruction: 'Match each Hebrew word with its meaning.',
        pairs: [
          { he: 'שִׁמְעוֹן', en: 'Shimon' },
          { he: 'הָעוֹלָם', en: 'the world' },
          { he: 'שְׁלֹשָׁה', en: 'three' },
          { he: 'חֲסָדִים', en: 'loving-kindness' },
        ],
      },
      {
        kind: 'listen',
        instruction: 'Listen and tap the word for "Torah".',
        speakText: 'תּוֹרָה',
        speakLang: 'he-IL',
        choices: ['תּוֹרָה', 'עֲבוֹדָה', 'חֲסָדִים', 'כְנֶסֶת'],
        answer: 0,
      },
      {
        kind: 'order',
        instruction: 'Build the famous phrase: "the world stands on three things".',
        translation: 'On three things the world stands',
        words: ['עַל', 'שְׁלֹשָׁה', 'דְבָרִים', 'הָעוֹלָם', 'עוֹמֵד'],
        correctOrder: [0, 1, 2, 3, 4],
      },
      {
        kind: 'choose',
        instruction: 'What are the three pillars Shimon HaTzaddik taught?',
        choices: [
          'Money, fame, and power',
          'Torah, Avodah, and acts of loving-kindness',
          'Food, sleep, and play',
          'Earth, water, and sky',
        ],
        answer: 1,
      },
      {
        kind: 'choose',
        instruction: 'Today, what does "Avodah" (service) mean?',
        choices: ['Hard manual labor', 'Prayer', 'Cooking', 'Cleaning'],
        answer: 1,
      },
      {
        kind: 'choose',
        instruction: 'Shimon HaTzaddik was one of the last members of what group?',
        choices: [
          'The Prophets',
          'The Men of the Great Assembly',
          'The Kings',
          'The Levites',
        ],
        answer: 1,
      },
    ],
  },

  '1.3': {
    perek: 1,
    mishnah: 3,
    title: 'Serve Without Reward',
    titleHe: 'אַנְטִיגְנוֹס אִישׁ סוֹכוֹ',
    theme: 'Pure Service',
    intro: 'Antignos of Socho taught: serve out of love, not for a reward. And always have awe of Heaven.',
    exercises: [
      {
        kind: 'match',
        instruction: 'Match each Hebrew word with its meaning.',
        pairs: [
          { he: 'אַנְטִיגְנוֹס', en: 'Antignos' },
          { he: 'כַעֲבָדִים', en: 'like servants' },
          { he: 'פְּרָס', en: 'a reward' },
          { he: 'שָׁמַיִם', en: 'Heaven' },
        ],
      },
      {
        kind: 'listen',
        instruction: 'Listen and tap the word for "reward".',
        speakText: 'פְּרָס',
        speakLang: 'he-IL',
        choices: ['פְּרָס', 'רַב', 'חָבֵר', 'שָׁמַיִם'],
        answer: 0,
      },
      {
        kind: 'order',
        instruction: 'Build the closing line: "Let the awe of Heaven be upon you".',
        translation: 'And let the awe of Heaven be upon you',
        words: ['וִיהִי', 'מוֹרָא', 'שָׁמַיִם', 'עֲלֵיכֶם'],
        correctOrder: [0, 1, 2, 3],
      },
      {
        kind: 'choose',
        instruction: 'Why should we do mitzvot, according to Antignos?',
        choices: [
          'Only to get a prize',
          'Because we love Hashem, not just for a reward',
          'Only when someone is watching',
          'To impress our friends',
        ],
        answer: 1,
      },
      {
        kind: 'choose',
        instruction: 'Antignos received the Torah from which teacher?',
        choices: [
          'Moshe',
          'Shimon HaTzaddik',
          'Hillel',
          'Rabbi Akiva',
        ],
        answer: 1,
      },
      {
        kind: 'choose',
        instruction: 'What is the highest level of serving Hashem?',
        choices: [
          'Serving because we have to',
          'Serving for a reward',
          'Serving out of pure love',
          'Serving when it is easy',
        ],
        answer: 2,
      },
    ],
  },

  '1.4': {
    perek: 1,
    mishnah: 4,
    title: 'A Home for the Wise',
    titleHe: 'יוֹסֵי בֶּן יוֹעֶזֶר',
    theme: 'A Home of Wisdom',
    intro: 'Yose ben Yoezer of Tzreda teaches: let your home be a meeting place for wise people.',
    exercises: [
      {
        kind: 'match',
        instruction: 'Match each Hebrew word with its meaning.',
        pairs: [
          { he: 'בֵיתְךָ', en: 'your house' },
          { he: 'בֵּית', en: 'a house of' },
          { he: 'וַעַד', en: 'meeting' },
          { he: 'לַחֲכָמִים', en: 'for the wise' },
        ],
      },
      {
        kind: 'listen',
        instruction: 'Listen and tap the word for "your house".',
        speakText: 'בֵיתְךָ',
        speakLang: 'he-IL',
        choices: ['בֵיתְךָ', 'חֲכָמִים', 'יוֹסֵי', 'יְהִי'],
        answer: 0,
      },
      {
        kind: 'choose',
        instruction: 'Yose ben Yoezer teaches us to make our house a meeting place for…',
        choices: ['Wise people', 'Athletes', 'Strangers', 'Children only'],
        answer: 0,
      },
      {
        kind: 'choose',
        instruction: 'Why surround yourself with wise people?',
        choices: [
          'Because their wisdom rubs off on you',
          'Because they bring food',
          'Because they sing well',
          'Because they are tall',
        ],
        answer: 0,
      },
    ],
  },

  '1.5': {
    perek: 1,
    mishnah: 5,
    title: 'An Open Home',
    titleHe: 'יוֹסֵי בֶּן יוֹחָנָן',
    theme: 'Hospitality',
    intro: 'Yose ben Yochanan of Jerusalem teaches: let your house be opened wide, and let the poor be members of your household.',
    exercises: [
      {
        kind: 'match',
        instruction: 'Match each Hebrew word with its meaning.',
        pairs: [
          { he: 'בֵיתְךָ', en: 'your house' },
          { he: 'פָתוּחַ', en: 'open' },
          { he: 'לִרְוָחָה', en: 'wide' },
          { he: 'עֲנִיִּים', en: 'the poor' },
        ],
      },
      {
        kind: 'listen',
        instruction: 'Listen and tap the word for "open".',
        speakText: 'פָתוּחַ',
        speakLang: 'he-IL',
        choices: ['פָתוּחַ', 'בֵיתְךָ', 'עֲנִיִּים', 'יוֹחָנָן'],
        answer: 0,
      },
      {
        kind: 'choose',
        instruction: 'Yose ben Yochanan teaches: your house should be…',
        choices: [
          'Opened wide for guests',
          'Closed and quiet',
          'Decorated lavishly',
          'Filled with toys',
        ],
        answer: 0,
      },
      {
        kind: 'choose',
        instruction: 'Who should be members of your household?',
        choices: [
          'Only family',
          'Only rich friends',
          'The poor',
          'No one outside',
        ],
        answer: 2,
      },
    ],
  },

  '1.6': {
    perek: 1,
    mishnah: 6,
    title: 'Teacher, Friend, Favorable Judgment',
    titleHe: 'יְהוֹשֻׁעַ בֶּן פְּרַחְיָה',
    theme: 'Three Practices',
    intro: 'Yehoshua ben Perachiah teaches three things: make a teacher for yourself, acquire a friend, and judge every person favorably.',
    exercises: [
      {
        kind: 'match',
        instruction: 'Match each Hebrew word with its meaning.',
        pairs: [
          { he: 'רַב', en: 'a teacher' },
          { he: 'חָבֵר', en: 'a friend' },
          { he: 'אָדָם', en: 'a person' },
          { he: 'זְכוּת', en: 'merit / favor' },
        ],
      },
      {
        kind: 'listen',
        instruction: 'Listen and tap the word for "teacher".',
        speakText: 'רַב',
        speakLang: 'he-IL',
        choices: ['רַב', 'חָבֵר', 'אָדָם', 'זְכוּת'],
        answer: 0,
      },
      {
        kind: 'order',
        instruction: 'Build the famous phrase: "Make for yourself a teacher".',
        translation: 'Make for yourself a teacher',
        words: ['עֲשֵׂה', 'לְךָ', 'רַב'],
        correctOrder: [0, 1, 2],
      },
      {
        kind: 'choose',
        instruction: 'What three things does Yehoshua ben Perachiah teach?',
        choices: [
          'Eat, sleep, repeat',
          'Make a teacher, acquire a friend, judge favorably',
          'Run, jump, climb',
          'Pray, fast, donate',
        ],
        answer: 1,
      },
      {
        kind: 'choose',
        instruction: 'Why do we "acquire" a friend (and not just "find" one)?',
        choices: [
          'Friends are bought with money',
          'Real friendship takes effort and investment',
          'Friends are taken from school',
          'It is just a turn of phrase',
        ],
        answer: 1,
      },
      {
        kind: 'choose',
        instruction: 'What does "judge every person favorably" mean?',
        choices: [
          'Always say yes',
          'Give people the benefit of the doubt',
          'Avoid making decisions',
          'Only judge friends, not strangers',
        ],
        answer: 1,
      },
    ],
  },
};

export function getLesson(perek, mishnah) {
  return LESSONS[`${perek}.${mishnah}`] || null;
}

// Expose the map on window so buildPath can know which stops are playable
// without creating an import cycle.
if (typeof window !== 'undefined') {
  window.__avotKidsV2Lessons = LESSONS;
}
