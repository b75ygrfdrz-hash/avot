// Family discussion questions, Bartenura commentary, and Chief Rabbi commentary
// for the Shabbat table, keyed by "perek.mishnah".
//
// DISCUSSION    — open prompts for a mixed-age table.
// BARTENURA     — accurate summaries of Rabbi Ovadiah of Bartenura's commentary.
// CHIEF_RABBI   — commentary in the spirit of Chief Rabbi Warren Goldstein's
//                 teachings on Pirkei Avot and the Shabbat Project.
// SHABBAT_WEEKS — curated weekly sets of 2–3 mishnayot with a theme.

const DISCUSSION = {
  '1.1': [
    'The Torah passed through a living chain of teachers to reach us. Who in your life has passed down wisdom, values, or faith — and what did they give you that no book could?',
    'The Sages said to be deliberate in judgment — take your time before deciding. Can you think of a moment you acted too hastily and wished you had waited?',
    'A fence around the Torah means adding a safeguard to protect something precious. What is one fence our family keeps — a habit or rule that guards something important?',
    'For the youngest: Can you name one person who taught you something important this week?',
  ],
  '1.2': [
    'Shimon HaTzaddik said the world stands on Torah, service, and kindness — three legs of one table. What happens when any one leg is missing?',
    'Temple service has been replaced by prayer. What makes a prayer feel real and alive rather than just words on a page?',
    'Acts of lovingkindness can be given to anyone — rich or poor, living or departed. What is one act of kindness you could give that costs nothing but means everything?',
    'For the youngest: What is the nicest thing someone did for you this week? What is the nicest thing you did for someone else?',
  ],
  '1.3': [
    'Antignos warns us not to serve God only to receive a reward. But is it natural to want one? Is there something wrong with hoping for it?',
    'What is the difference between doing good because you fear punishment and doing good because you genuinely love what is right?',
    'Can you think of something you — or someone you admire — did that was truly selfless, with no expectation of anything in return?',
    'For the youngest: Why do you think it is better to do something good even when nobody is watching?',
  ],
  '1.6': [
    'Yehoshua ben Perachyah teaches to "acquire yourself a friend" — as if friendship requires real investment. What is something you have put into a friendship that made it stronger?',
    'Judging everyone favorably means giving the benefit of the doubt. Can you share a story where you assumed the worst about someone and later found out you were wrong?',
    'What makes the difference between a friendly acquaintance and a true friend you could call in a crisis?',
    'For the youngest: What is one thing a good friend does that makes you feel happy?',
  ],
  '1.7': [
    'The people around us shape us far more than we realise. Can you think of a time when being around certain people brought out the best — or the worst — in you?',
    'The mishnah also says "do not despair of punishment" — do not give up on yourself when you go wrong. How do you pick yourself up after a mistake?',
    'What quality do you most value in a close friend, and why?',
  ],
  '1.8': [
    'A judge is told to keep an open mind until the end. How hard is it to avoid deciding who is right before you have heard both sides?',
    'Can you think of a disagreement that looked completely different once you heard the full story?',
    'Why does it matter to let people leave a resolved matter without guilt still attached to them?',
  ],
  '1.9': [
    'Words have power. Can you think of a time when careful words helped a situation — or careless words hurt one?',
    'Why does it matter so much to reach the truth before making an important decision?',
    'What is one way our family can be more careful with how we speak to each other this week?',
  ],
  '1.10': [
    'Shemayah said to love work. What kind of work — paid or unpaid — do you genuinely love? What makes it feel meaningful rather than just necessary?',
    'He warned against craving authority over others. What is the difference between leadership that serves people and authority used for personal gain?',
    'Is there something in your life you do mainly out of duty that you would like to learn to love?',
    'For the youngest: What is one job at home that you actually enjoy doing?',
  ],
  '1.11': [
    'Teachers and parents are told to weigh their words because others learn from them. Who learns from the way you speak and act — even when you are not aware of it?',
    'Has someone ever repeated something you said in a way that surprised you? How did that feel?',
    'What is a message you would want the people who look up to you to carry with them?',
  ],
  '1.12': [
    'Hillel does not just say "love peace" but "pursue peace" — actively chase after it. What would pursuing peace look like in our family or community this week?',
    'Hillel also said "love people and draw them near to Torah." He drew people in with warmth first. Why is warmth more powerful than judgment?',
    'Think of the greatest peacemaker you know personally. What is their secret?',
    'For the youngest: What is one thing you could do this week to bring peace into our home?',
  ],
  '1.13': [
    'Hillel warns that chasing fame backfires. Why might wanting to be famous so badly cause a person to lose their good name?',
    '"If you do not grow, you diminish." What is one area of your life where you feel you are genuinely growing right now?',
    'What is something you would like to keep learning?',
  ],
  '1.14': [
    '"If I am not for myself, who will be for me?" When do you need to stand up for yourself? When have you done it well?',
    '"If I am only for myself, what am I?" Hillel uses "what" not "who" — as if a self-absorbed person loses something essential. Why is caring only for yourself so diminishing?',
    '"If not now, when?" What is one thing you have been meaning to do — or become — that you keep postponing? What would it take to begin today?',
    'For the youngest: Is there something kind you have been wanting to do for someone? What is stopping you?',
  ],
  '1.15': [
    'Shammai was known for strictness, yet he taught to "receive every person with a cheerful face." Why might this teaching come especially from him?',
    '"Say little and do much." Who do you know who quietly does more than they ever talk about? What is their impact?',
    'Shammai said to make Torah study a fixed appointment. What would it mean for our family to set a fixed time for learning — even ten minutes — every week?',
    'For the youngest: Can you smile at someone today who needs it? How do you think it makes them feel?',
  ],
  '1.16': [
    'The mishnah says to find a teacher so you are not left in doubt. Who do you turn to when you are genuinely unsure about something important?',
    'Why can it be risky to rely only on your own reasoning for things that truly matter?',
    'What is a question you would love a wise teacher to answer for you?',
  ],
  '1.17': [
    'Shimon found nothing better for the body than silence. When in your life has staying quiet been the right choice? How did it feel?',
    '"The main thing is not study but action." What is a teaching you know well but have not yet turned into a real habit?',
    'How does talking too much get us into trouble — in arguments, in relationships, online?',
  ],
  '1.18': [
    'The world endures on justice, truth, and peace. Why do you think these three specifically? What happens to a society when any one is lost?',
    'Can truth and peace ever pull in opposite directions? How do you handle a moment when being honest might cause conflict?',
    'Which of the three — justice, truth, or peace — does your community most need to strengthen right now?',
    'For the youngest: What does being fair mean? Can you give an example from this week?',
  ],
};

// Accurate summaries of Rabbi Ovadiah of Bartenura's commentary on Pirkei Avot.
const BARTENURA = {
  '1.1': 'Bartenura teaches that "Moses received the Torah at Sinai" refers to both the Written and Oral Torah — all future rabbinic teaching was already implicit at Sinai. "Be deliberate in judgment" means a judge must weigh every angle before ruling, for a hasty verdict cannot be undone. "Make a fence for the Torah" means adding safeguards that prevent accidentally crossing a boundary.',

  '1.2': 'The three pillars correspond to all of human responsibility. Torah sustains mind and spirit. Temple service — replaced today by prayer — connects us to God. Acts of lovingkindness bind us to one another. Bartenura notes that kindness is unique: unlike study or prayer, it can be given to the living and the dead, to the rich and the poor alike, by anyone regardless of means.',

  '1.3': 'Antignos does not say reward does not exist. He says do not make it your reason for serving. Bartenura explains: if you serve because you expect a prize, you are like a hired worker — loyal only while being paid. Serve instead like a child helping a parent, without calculating the cost.',

  '1.6': 'Bartenura explains "acquire yourself a friend" as meaning friendship must be pursued with real investment — like acquiring property, it costs something. Once you have such a friend, give them the benefit of the doubt. Even when you see something troubling, assume there is a valid explanation you have not yet heard.',

  '1.7': 'The warning to distance yourself from a bad neighbor refers to the shaping power of environment — we are influenced by those around us far more than we realise. "Do not despair of punishment" is a warning not to rationalise ongoing wrongdoing. Consequences, though sometimes delayed, are real.',

  '1.10': 'Loving work protects a person from idleness, which the Sages saw as the root of many sins. "Hate the rabbinate" does not mean avoid all leadership, but be wary of positions of authority — especially the weight of responsibility that comes with ruling over others.',

  '1.12': 'Hillel\'s formula has two levels: "love peace" means cultivate inner peace; "pursue peace" means bring peace to others, even when the conflict does not involve you. "Love people" means do not wait for them to become worthy of your love — love them first, and Torah will draw them naturally closer.',

  '1.14': 'Bartenura explains each phrase as addressing a separate failure. "If I am not for myself" — no one else will grow for you. "If I am only for myself" — a self-absorbed life degrades a person. "If not now" — after death there are no more mitzvot. Every moment of delay is a permanent loss.',

  '1.15': 'Shammai was himself known for strictness, yet he taught warmth — showing that a cheerful face is an obligation even for a naturally serious person. "Say little and do much" was Shammai\'s lifelong practice: he made commitments quietly and fulfilled them fully.',

  '1.17': 'Silence guards against four great verbal sins: falsehood, flattery, gossip, and idle chatter. "The main thing is not study but action" is the definitive purpose of Pirkei Avot: this Mishnah exists to transform behaviour, not merely to fill the mind with knowledge.',

  '1.18': 'Bartenura connects these three to the earlier pillars: justice corresponds to Torah; truth to Temple service, which required honest self-examination; and peace to lovingkindness. Where all three meet, the world is fully sustained.',
};

// Commentary in the spirit of Chief Rabbi Warren Goldstein's teachings on
// Pirkei Avot. Replace with sourced quotes from his published works as available.
const CHIEF_RABBI = {
  '1.1': 'The chain of transmission is not merely historical — it is the story of every Jewish family. Every parent who sits at a Shabbat table and passes a teaching to their child is Moses handing the Torah to Joshua. The miracle is not that the Torah survived three thousand years of history. The miracle is that it survived through people — through you, through this table.',

  '1.2': 'Shimon the Righteous saw something that every generation must rediscover: that a life of depth has three dimensions, not one. Torah gives us meaning. Prayer gives us relationship. Kindness gives us humanity. A Jewish home that cultivates all three is not just a home — it is a small sanctuary, a mikdash me\'at.',

  '1.3': 'The Shabbat Project is built on this mishnah. We do not keep Shabbat to earn something. We keep Shabbat because it is true — because rest and holiness are woven into the fabric of creation itself. When a million Jews around the world light candles on the same Friday evening, they are not performing a transaction. They are expressing who they are.',

  '1.6': 'One of the great crises of modern life is the collapse of deep friendship. We have thousands of connections and very few friends. Yehoshua ben Perachyah\'s teaching cuts through all of it: a friend must be acquired, invested in, chosen. And once you have such a person, protect the relationship with generosity of interpretation — assume the best until you have real evidence of the worst.',

  '1.7': 'Environment is destiny — and Shabbat is one of the most powerful environmental interventions a family can make. One day a week, you choose who surrounds you. You choose presence over distraction. You choose depth over noise. That choice, made consistently, shapes children in ways that no school curriculum ever could.',

  '1.10': 'Shabbat is the day we stop working — not because work is bad, but because we need to be reminded that we are more than what we produce. For six days we love our work and we give it everything. On the seventh day we lay it down and remember: I am a human being, not a human doing.',

  '1.12': 'The Shabbat Project began with a single conviction: that Jewish unity is possible. That Jews from every background, tradition, and level of observance could sit at one table, light one set of candles, and experience one Shabbat together. Hillel already knew this. You do not build unity by waiting for people to become like you. You build it by loving them first.',

  '1.14': 'These three questions are the heartbeat of Jewish responsibility. "If not now, when?" is not a call to urgency for urgency\'s sake. It is the recognition that the present moment — this Shabbat, this conversation, this meal — is the only moment we actually have. Tomorrow is not promised. But this table, right now, is real.',

  '1.15': 'There is a famous photograph of Shammai looking stern and Hillel smiling — except, of course, there is no such photograph. What we have instead is this mishnah: Shammai, the strict one, teaching us to greet every person with warmth. Strictness about law and warmth toward people are not contradictions. They are the two pillars of a life lived with integrity.',

  '1.17': 'Action, not study — this is the mandate. The Shabbat Project did not begin with a conference paper or an academic lecture. It began with a question: what would happen if Jews simply kept one Shabbat together? The answer, when we tried it, was something nobody fully expected. It turns out that doing transforms us in ways that knowing never can.',

  '1.18': 'A nation built on justice, truth, and peace is the Jewish dream for the world — and the Shabbat table is where we rehearse it. We practice truth-telling in conversation. We practice justice in how we treat the people around us. We practice peace by choosing, for one day, to put down our arguments and simply be together. The Shabbat table is not a retreat from the world. It is preparation for it.',
};

// Curated weekly sets for the Shabbat Table sheet.
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

export { DISCUSSION, BARTENURA, CHIEF_RABBI, SHABBAT_WEEKS };
