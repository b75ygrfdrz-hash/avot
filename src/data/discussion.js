// Family discussion questions for the Shabbat table, keyed by "perek.mishnah".
// Open prompts, pitched for a mixed-age table: one on meaning, one on
// personal or family application, one lighter or for younger learners.
// A starter set — edit freely.
//
// SHABBAT_WEEKS (below) curates these into weekly sets of 2-3 mishnayot.
// The Shabbat Table section rotates through the sets by week of the year.
// Every referenced mishnah is a complete one in pirkeiAvot.js (the
// abbreviated stub mishnayot are deliberately left out of the sheet).

const DISCUSSION = {
  '1.1': [
    'The Torah passed through many hands to reach us. Who passed Torah or values down to you, and what did they give you?',
    'The Sages said to be deliberate in judgment. When is it hard to slow down before deciding something, and why does it matter?',
    'What is one small extra rule, a fence, that our family keeps to protect something important?',
  ],
  '1.2': [
    'The world stands on Torah, service of God, and acts of kindness. Which of the three comes most easily to you, and which takes more effort?',
    'What is one act of kindness someone did for you this week, and one you did for someone else?',
    'If our family strengthened just one of these three pillars this year, which would you choose?',
  ],
  '1.3': [
    'Antignos taught to serve without expecting a reward. Is it possible to do good with no thought of reward? Is it wrong to hope for one?',
    'Can you think of something you did this week purely because it was right, not because anyone would notice?',
    'What does it mean to do a mitzvah out of love rather than for a prize?',
  ],
  '1.4': [
    'This mishnah says to fill your home with wise people and their words. Whose wisdom would you most want around your table?',
    'What does it mean to sit in the dust of their feet, to learn with real humility?',
    'What is something wise you have heard from a grandparent or a teacher?',
  ],
  '1.5': [
    'Yose ben Yochanan said to open your home wide to guests. What makes a guest feel truly welcome?',
    'Is there someone who could use an invitation to our Shabbat table?',
    'Why might the mishnah call the poor members of your household rather than just visitors?',
  ],
  '1.6': [
    'The mishnah says to acquire a friend, as if friendship takes effort. What effort does a real friendship ask of us?',
    'Judging others favorably means giving the benefit of the doubt. When did someone do that for you?',
    'Can you think of a time you misjudged someone and later saw it differently?',
  ],
  '1.7': [
    'The mishnah warns that the company we keep shapes us. How do the people around you change the way you act?',
    'It also says not to give up hope. What helps you stay hopeful when things go wrong?',
    'What is one quality you most look for in a good friend?',
  ],
  '1.8': [
    'A judge is told to keep an open mind until the end. How hard is it not to decide who is right too quickly in an argument?',
    'Can you think of a disagreement that looked different once you heard both sides?',
    'Why does it matter to let people leave innocent once a matter is settled?',
  ],
  '1.9': [
    'Words have power. When have careful words helped a situation, or careless words hurt one?',
    'Why does it matter so much to reach the truth before deciding something?',
    'What is one way our family can be more careful with how we speak this week?',
  ],
  '1.10': [
    'Shemayah said to love work. What is a kind of work you genuinely enjoy?',
    'Why might always wanting to be the boss actually be a trap?',
    'What is the difference between leading people and lording over them?',
  ],
  '1.11': [
    'Teachers and parents are told to weigh their words, because others learn from them. Who learns from the way you speak and act?',
    'Has someone ever repeated something you said? How did that feel?',
    'What is a message you would want the people who look up to you to absorb?',
  ],
  '1.12': [
    'Hillel says not just to love peace but to chase after it. What does actively pursuing peace look like in a family?',
    'Who is someone known as a peacemaker in your life, and how do they do it?',
    'Is there a small peace you could help make this week?',
  ],
  '1.13': [
    'Hillel warns that chasing fame backfires. Why might wanting a name so badly cause a person to lose it?',
    'The mishnah says that if you are not growing, you are shrinking. What is one way you grew this week?',
    'What is something you would like to keep learning?',
  ],
  '1.14': [
    'If I am not for myself, who will be for me? When do you need to stand up for yourself?',
    'If I am only for myself, what am I? How do you balance caring for yourself and caring for others?',
    'If not now, when? What is something you have been putting off that you could begin today?',
  ],
  '1.15': [
    'Shammai said to say little and do much. Who do you know who quietly does a great deal without talking about it?',
    'Why does greeting people with a pleasant face matter so much?',
    'What would it look like to make learning a fixed part of your week, not just when there is time?',
  ],
  '1.16': [
    'The mishnah says to find a teacher so you are not left in doubt. Who do you turn to when you are unsure about something important?',
    'Why can it be risky to rely only on guesswork for things that matter?',
    'What is a question you would love a wise teacher to answer for you?',
  ],
  '1.17': [
    'Shimon found nothing better for the body than silence. When is staying quiet the wise choice?',
    'He said the main thing is not study but action. What is one teaching you could turn into an action this week?',
    'Why might too many words lead a person into trouble?',
  ],
  '1.18': [
    'The world endures on justice, truth, and peace. Why do you think these three were chosen?',
    'Can truth and peace ever pull in opposite directions? How would you handle that?',
    'Which of the three would our family most like to be known for?',
  ],
};

// Curated weekly sets for the Shabbat Table sheet. Each week pairs a
// short, coherent group of mishnayot with a theme for the table.
const SHABBAT_WEEKS = [
  {
    theme: 'The Foundations',
    blurb: 'How the Torah reached us, the three things the world stands on, and serving for its own sake.',
    refs: [[1, 1], [1, 2], [1, 3]],
  },
  {
    theme: 'Friendship and the Company We Keep',
    blurb: 'Acquiring a friend, judging others favorably, and how the people around us shape who we become.',
    refs: [[1, 6], [1, 7]],
  },
  {
    theme: 'What to Love',
    blurb: 'Shemayah teaches us to love honest work; Hillel teaches us to love peace and to love people.',
    refs: [[1, 10], [1, 12]],
  },
  {
    theme: 'If Not Now, When?',
    blurb: 'Standing up for yourself and for others, and the wisdom of saying little while doing much.',
    refs: [[1, 14], [1, 15]],
  },
  {
    theme: 'Truth, Justice, and Peace',
    blurb: 'Finding a teacher to remove doubt, the value of silence, and the three things that keep the world standing.',
    refs: [[1, 16], [1, 17], [1, 18]],
  },
];

export { DISCUSSION, SHABBAT_WEEKS };
