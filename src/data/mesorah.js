// The chain of transmission (mesorah) as presented in Pirkei Avot.
//
// This is the documented chain: every node has a transmission link that is
// either stated in Pirkei Avot itself (Avot 1:1 through 2:14) or well
// established in the Talmud. Sages who appear in Avot but are not part of
// the documented chain (most speakers of chapters 3-6) are intentionally
// not forced into the tree.
//
// Fields per node:
//   id           stable slug
//   nameHe       Hebrew name
//   nameEn       English name
//   role         'Nasi' | 'Av Beit Din' | null  (for the Zugot pairs)
//   era          approximate, human-readable period
//   generation   integer tier for layout (0 = Moshe, increasing)
//   receivedFrom array of predecessor ids ([] for Moshe)
//   bio          one or two factual sentences
//   mishnayot    appearances in Pirkei Avot, as { perek, mishnah }
//   documented   true if the link is stated in Avot itself; false if it is
//                established in the Talmud rather than in Avot's own chain
//
// Verified against: the text of Pirkei Avot on Sefaria (sefaria.org); the
// generational dating of the Tannaim and the Zugot via Wikipedia; and the
// canonical chain stated in Avot 1:1 and in Rambam's introduction to the
// Mishneh Torah. Eras are approximate by scholarly convention.

const MESORAH_CHAIN = [
  {
    id: 'moshe', nameHe: 'מֹשֶׁה', nameEn: 'Moshe', role: null,
    era: 'Sinai', generation: 0, receivedFrom: [],
    bio: 'Received the Torah at Sinai and transmitted it to Yehoshua.',
    mishnayot: [{ perek: 1, mishnah: 1 }], documented: true,
  },
  {
    id: 'yehoshua', nameHe: 'יְהוֹשֻׁעַ', nameEn: 'Yehoshua', role: null,
    era: 'Entry into the Land', generation: 1, receivedFrom: ['moshe'],
    bio: "Moshe's disciple and successor, who led Israel into the Land.",
    mishnayot: [{ perek: 1, mishnah: 1 }], documented: true,
  },
  {
    id: 'zekenim', nameHe: 'זְקֵנִים', nameEn: 'The Elders', role: null,
    era: 'Era of the Judges', generation: 2, receivedFrom: ['yehoshua'],
    bio: 'The elders who led Israel and carried the tradition after Yehoshua.',
    mishnayot: [{ perek: 1, mishnah: 1 }], documented: true,
  },
  {
    id: 'neviim', nameHe: 'נְבִיאִים', nameEn: 'The Prophets', role: null,
    era: 'The prophetic era', generation: 3, receivedFrom: ['zekenim'],
    bio: 'The prophets, who received the tradition from the elders and passed it on.',
    mishnayot: [{ perek: 1, mishnah: 1 }], documented: true,
  },
  {
    id: 'knesset', nameHe: 'כְּנֶסֶת הַגְּדוֹלָה', nameEn: 'Men of the Great Assembly', role: null,
    era: 'Early Second Temple era', generation: 4, receivedFrom: ['neviim'],
    bio: 'A body of sages at the start of the Second Temple era, including the last prophets, who consolidated and safeguarded the tradition.',
    mishnayot: [{ perek: 1, mishnah: 1 }], documented: true,
  },
  {
    id: 'shimon_hatzaddik', nameHe: 'שִׁמְעוֹן הַצַּדִּיק', nameEn: 'Shimon HaTzaddik', role: null,
    era: 'c. 3rd century BCE', generation: 5, receivedFrom: ['knesset'],
    bio: 'A high priest counted among the last of the Great Assembly; taught that the world stands on Torah, divine service, and acts of kindness.',
    mishnayot: [{ perek: 1, mishnah: 2 }], documented: true,
  },
  {
    id: 'antignos', nameHe: 'אַנְטִיגְנוֹס אִישׁ סוֹכוֹ', nameEn: 'Antignos of Socho', role: null,
    era: 'c. 3rd century BCE', generation: 6, receivedFrom: ['shimon_hatzaddik'],
    bio: 'Received the tradition from Shimon HaTzaddik; taught serving God not for the sake of a reward.',
    mishnayot: [{ perek: 1, mishnah: 3 }], documented: true,
  },
  {
    id: 'yose_ben_yoezer', nameHe: 'יוֹסֵי בֶּן יוֹעֶזֶר', nameEn: 'Yose ben Yoezer of Tzeredah', role: 'Nasi',
    era: 'c. 2nd century BCE', generation: 7, receivedFrom: ['antignos'],
    bio: 'Of the first of the Zugot, a leading sage in the era of the Maccabean revolt.',
    mishnayot: [{ perek: 1, mishnah: 4 }], documented: true,
  },
  {
    id: 'yose_ben_yochanan', nameHe: 'יוֹסֵי בֶּן יוֹחָנָן', nameEn: 'Yose ben Yochanan of Jerusalem', role: 'Av Beit Din',
    era: 'c. 2nd century BCE', generation: 7, receivedFrom: ['antignos'],
    bio: 'Of the first of the Zugot; taught that one’s home should be open wide to the poor.',
    mishnayot: [{ perek: 1, mishnah: 5 }], documented: true,
  },
  {
    id: 'yehoshua_ben_perachyah', nameHe: 'יְהוֹשֻׁעַ בֶּן פְּרַחְיָה', nameEn: 'Yehoshua ben Perachyah', role: 'Nasi',
    era: 'c. late 2nd century BCE', generation: 8, receivedFrom: ['yose_ben_yoezer', 'yose_ben_yochanan'],
    bio: 'Of the second pair; taught to acquire a teacher, find a friend, and judge everyone favorably.',
    mishnayot: [{ perek: 1, mishnah: 6 }], documented: true,
  },
  {
    id: 'nittai', nameHe: 'נִתַּאי הָאַרְבֵּלִי', nameEn: 'Nittai of Arbel', role: 'Av Beit Din',
    era: 'c. late 2nd century BCE', generation: 8, receivedFrom: ['yose_ben_yoezer', 'yose_ben_yochanan'],
    bio: 'Of the second pair; warned against a bad neighbor and the company of the wicked.',
    mishnayot: [{ perek: 1, mishnah: 7 }], documented: true,
  },
  {
    id: 'yehudah_ben_tabbai', nameHe: 'יְהוּדָה בֶּן טַבַּאי', nameEn: 'Yehudah ben Tabbai', role: 'Nasi',
    era: 'c. early 1st century BCE', generation: 9, receivedFrom: ['yehoshua_ben_perachyah', 'nittai'],
    bio: 'Of the third pair, a leader of the courts in the era of Alexander Yannai.',
    mishnayot: [{ perek: 1, mishnah: 8 }], documented: true,
  },
  {
    id: 'shimon_ben_shetach', nameHe: 'שִׁמְעוֹן בֶּן שָׁטָח', nameEn: 'Shimon ben Shetach', role: 'Av Beit Din',
    era: 'c. early 1st century BCE', generation: 9, receivedFrom: ['yehoshua_ben_perachyah', 'nittai'],
    bio: 'Of the third pair; a leader who strengthened the courts during the reign of Alexander Yannai and Salome Alexandra.',
    mishnayot: [{ perek: 1, mishnah: 9 }], documented: true,
  },
  {
    id: 'shemayah', nameHe: 'שְׁמַעְיָה', nameEn: 'Shemayah', role: 'Nasi',
    era: 'c. mid 1st century BCE', generation: 10, receivedFrom: ['yehudah_ben_tabbai', 'shimon_ben_shetach'],
    bio: 'Of the fourth pair; taught to love work, shun lordship, and not seek closeness to the ruling power.',
    mishnayot: [{ perek: 1, mishnah: 10 }], documented: true,
  },
  {
    id: 'avtalyon', nameHe: 'אַבְטַלְיוֹן', nameEn: 'Avtalyon', role: 'Av Beit Din',
    era: 'c. mid 1st century BCE', generation: 10, receivedFrom: ['yehudah_ben_tabbai', 'shimon_ben_shetach'],
    bio: 'Of the fourth pair; taught sages to be careful with their words.',
    mishnayot: [{ perek: 1, mishnah: 11 }], documented: true,
  },
  {
    id: 'hillel', nameHe: 'הִלֵּל', nameEn: 'Hillel', role: 'Nasi',
    era: 'c. 1st century BCE – early 1st century CE', generation: 11, receivedFrom: ['shemayah', 'avtalyon'],
    bio: 'Of the fifth pair and the most celebrated sage of the late Second Temple era; taught love of peace and of one’s fellow, and founded the patriarchal dynasty.',
    mishnayot: [{ perek: 1, mishnah: 12 }, { perek: 1, mishnah: 13 }, { perek: 1, mishnah: 14 }, { perek: 2, mishnah: 4 }, { perek: 2, mishnah: 5 }, { perek: 2, mishnah: 6 }, { perek: 2, mishnah: 7 }], documented: true,
  },
  {
    id: 'shammai', nameHe: 'שַׁמַּאי', nameEn: 'Shammai', role: 'Av Beit Din',
    era: 'c. 1st century BCE – early 1st century CE', generation: 11, receivedFrom: ['shemayah', 'avtalyon'],
    bio: 'Of the fifth pair, Hillel’s colleague; taught to make Torah a fixed practice, say little and do much, and receive everyone warmly.',
    mishnayot: [{ perek: 1, mishnah: 15 }], documented: true,
  },
  {
    id: 'rabban_gamliel_hazaken', nameHe: 'רַבָּן גַּמְלִיאֵל הַזָּקֵן', nameEn: 'Rabban Gamliel the Elder', role: null,
    era: 'Early 1st century CE', generation: 12, receivedFrom: ['hillel'],
    bio: 'Grandson of Hillel and head of the Sanhedrin in Jerusalem in the generation before the Temple’s destruction.',
    mishnayot: [{ perek: 1, mishnah: 16 }], documented: true,
  },
  {
    id: 'rabban_shimon_ben_gamliel_hazaken', nameHe: 'רַבָּן שִׁמְעוֹן בֶּן גַּמְלִיאֵל', nameEn: 'Rabban Shimon ben Gamliel the Elder', role: null,
    era: 'Mid 1st century CE', generation: 13, receivedFrom: ['rabban_gamliel_hazaken'],
    bio: 'Son of Rabban Gamliel the Elder; a leader of the people in Jerusalem in the final years of the Temple.',
    mishnayot: [{ perek: 1, mishnah: 17 }, { perek: 1, mishnah: 18 }], documented: true,
  },
  {
    id: 'rabban_yochanan_ben_zakkai', nameHe: 'רַבָּן יוֹחָנָן בֶּן זַכַּאי', nameEn: 'Rabban Yochanan ben Zakkai', role: null,
    era: '1st century CE', generation: 12, receivedFrom: ['hillel', 'shammai'],
    bio: 'A disciple of Hillel and Shammai; after the Temple’s destruction he founded the academy at Yavneh and secured the tradition’s survival.',
    mishnayot: [{ perek: 2, mishnah: 8 }, { perek: 2, mishnah: 9 }], documented: true,
  },
  {
    id: 'rabbi_eliezer', nameHe: 'רַבִּי אֱלִיעֶזֶר בֶּן הוֹרְקְנוֹס', nameEn: 'Rabbi Eliezer ben Hyrcanus', role: null,
    era: 'Late 1st – early 2nd century CE', generation: 13, receivedFrom: ['rabban_yochanan_ben_zakkai'],
    bio: 'A foremost disciple of Rabban Yochanan ben Zakkai, praised as a sealed cistern that loses not a drop.',
    mishnayot: [{ perek: 2, mishnah: 10 }], documented: true,
  },
  {
    id: 'rabbi_yehoshua', nameHe: 'רַבִּי יְהוֹשֻׁעַ בֶּן חֲנַנְיָה', nameEn: 'Rabbi Yehoshua ben Chananyah', role: null,
    era: 'Late 1st – early 2nd century CE', generation: 13, receivedFrom: ['rabban_yochanan_ben_zakkai'],
    bio: 'A leading disciple of Rabban Yochanan ben Zakkai and a central figure of the Yavneh generation.',
    mishnayot: [{ perek: 2, mishnah: 11 }], documented: true,
  },
  {
    id: 'rabbi_yose_hakohen', nameHe: 'רַבִּי יוֹסֵי הַכֹּהֵן', nameEn: 'Rabbi Yose the Kohen', role: null,
    era: 'Late 1st – early 2nd century CE', generation: 13, receivedFrom: ['rabban_yochanan_ben_zakkai'],
    bio: 'A disciple of Rabban Yochanan ben Zakkai, noted for his piety.',
    mishnayot: [{ perek: 2, mishnah: 12 }], documented: true,
  },
  {
    id: 'rabbi_shimon_ben_netanel', nameHe: 'רַבִּי שִׁמְעוֹן בֶּן נְתַנְאֵל', nameEn: 'Rabbi Shimon ben Netanel', role: null,
    era: 'Late 1st – early 2nd century CE', generation: 13, receivedFrom: ['rabban_yochanan_ben_zakkai'],
    bio: 'A disciple of Rabban Yochanan ben Zakkai, described as one who fears sin.',
    mishnayot: [{ perek: 2, mishnah: 13 }], documented: true,
  },
  {
    id: 'rabbi_elazar_ben_arach', nameHe: 'רַבִּי אֶלְעָזָר בֶּן עֲרָךְ', nameEn: 'Rabbi Elazar ben Arach', role: null,
    era: 'Late 1st – early 2nd century CE', generation: 13, receivedFrom: ['rabban_yochanan_ben_zakkai'],
    bio: 'A disciple of Rabban Yochanan ben Zakkai, praised by his teacher as an ever-strengthening spring.',
    mishnayot: [{ perek: 2, mishnah: 14 }], documented: true,
  },
  {
    id: 'rabban_gamliel_yavneh', nameHe: 'רַבָּן גַּמְלִיאֵל דְּיַבְנֶה', nameEn: 'Rabban Gamliel of Yavneh', role: null,
    era: 'c. 80–120 CE', generation: 14, receivedFrom: ['rabban_shimon_ben_gamliel_hazaken'],
    bio: 'Head of the academy at Yavneh after Rabban Yochanan ben Zakkai, and a great-grandson of Hillel.',
    mishnayot: [], documented: false,
  },
  {
    id: 'rabbi_akiva', nameHe: 'רַבִּי עֲקִיבָא', nameEn: 'Rabbi Akiva', role: null,
    era: 'c. 50–135 CE', generation: 14, receivedFrom: ['rabbi_eliezer', 'rabbi_yehoshua'],
    bio: 'One of the greatest of the Tannaim; began Torah study at forty and shaped the framework of the Oral Law.',
    mishnayot: [{ perek: 3, mishnah: 13 }, { perek: 3, mishnah: 14 }], documented: false,
  },
  {
    id: 'rabban_shimon_ben_gamliel_yavneh', nameHe: 'רַבָּן שִׁמְעוֹן בֶּן גַּמְלִיאֵל', nameEn: 'Rabban Shimon ben Gamliel of Usha', role: null,
    era: 'c. 2nd century CE', generation: 15, receivedFrom: ['rabban_gamliel_yavneh'],
    bio: 'Head of the Sanhedrin at Usha after the Bar Kochba revolt, and the father of Rabbi Yehudah HaNasi.',
    mishnayot: [], documented: false,
  },
  {
    id: 'rabbi_meir', nameHe: 'רַבִּי מֵאִיר', nameEn: 'Rabbi Meir', role: null,
    era: 'Mid 2nd century CE', generation: 15, receivedFrom: ['rabbi_akiva'],
    bio: 'A foremost disciple of Rabbi Akiva; an unattributed teaching in the Mishnah generally follows his view.',
    mishnayot: [{ perek: 4, mishnah: 10 }, { perek: 6, mishnah: 1 }], documented: false,
  },
  {
    id: 'rabbi_yehudah', nameHe: 'רַבִּי יְהוּדָה בַּר אִלְעַאי', nameEn: 'Rabbi Yehudah bar Ilai', role: null,
    era: 'Mid 2nd century CE', generation: 15, receivedFrom: ['rabbi_akiva'],
    bio: 'A disciple of Rabbi Akiva and among the most frequently cited sages in the Mishnah.',
    mishnayot: [{ perek: 4, mishnah: 13 }], documented: false,
  },
  {
    id: 'rabbi_yose', nameHe: 'רַבִּי יוֹסֵי בֶּן חֲלַפְתָּא', nameEn: 'Rabbi Yose ben Halafta', role: null,
    era: 'Mid 2nd century CE', generation: 15, receivedFrom: ['rabbi_akiva'],
    bio: 'A disciple of Rabbi Akiva, known for the soundness of his reasoning.',
    mishnayot: [{ perek: 4, mishnah: 6 }], documented: false,
  },
  {
    id: 'rabbi_shimon', nameHe: 'רַבִּי שִׁמְעוֹן בַּר יוֹחַאי', nameEn: 'Rabbi Shimon bar Yochai', role: null,
    era: 'Mid 2nd century CE', generation: 15, receivedFrom: ['rabbi_akiva'],
    bio: 'A disciple of Rabbi Akiva; tradition associates him with the roots of Jewish mysticism.',
    mishnayot: [{ perek: 3, mishnah: 3 }], documented: false,
  },
  {
    id: 'rabbi_elazar_ben_shammua', nameHe: 'רַבִּי אֶלְעָזָר בֶּן שַׁמּוּעַ', nameEn: 'Rabbi Elazar ben Shammua', role: null,
    era: 'Mid 2nd century CE', generation: 15, receivedFrom: ['rabbi_akiva'],
    bio: 'A disciple of Rabbi Akiva, regarded as a leading teacher of his generation.',
    mishnayot: [{ perek: 4, mishnah: 12 }], documented: false,
  },
  {
    id: 'rabbi_yehudah_hanasi', nameHe: 'רַבִּי יְהוּדָה הַנָּשִׂיא', nameEn: 'Rabbi Yehudah HaNasi (Rebbi)', role: null,
    era: 'c. 135–217 CE', generation: 16,
    receivedFrom: ['rabban_shimon_ben_gamliel_yavneh', 'rabbi_meir', 'rabbi_yose', 'rabbi_shimon', 'rabbi_elazar_ben_shammua'],
    bio: 'Head of the Sanhedrin who redacted the Mishnah around 200 CE, drawing the Oral Torah into a single work.',
    mishnayot: [{ perek: 2, mishnah: 1 }], documented: false,
  },
  {
    id: 'rabban_gamliel_beno', nameHe: 'רַבָּן גַּמְלִיאֵל בְּרַבִּי', nameEn: 'Rabban Gamliel, son of Rebbi', role: null,
    era: 'Early 3rd century CE', generation: 17, receivedFrom: ['rabbi_yehudah_hanasi'],
    bio: 'Son and successor of Rabbi Yehudah HaNasi; taught that Torah study is best joined with a worldly occupation.',
    mishnayot: [{ perek: 2, mishnah: 2 }, { perek: 2, mishnah: 3 }], documented: true,
  },
];

const MESORAH_SOURCES = [
  'Pirkei Avot, text and attributions, Sefaria (sefaria.org)',
  'Avot 1:1 and Rambam, introduction to the Mishneh Torah, for the chain of transmission',
  'Wikipedia, "Tannaim" and "Zugot", for generational dating',
];

export { MESORAH_CHAIN, MESORAH_SOURCES };
