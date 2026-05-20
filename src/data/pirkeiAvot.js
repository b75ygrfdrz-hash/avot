// Pirkei Avot data — Hebrew text is public domain.
// English is a fresh paraphrase. Structure is designed to map 1:1 to a CMS later.

window.PIRKEI_AVOT = {
  meta: {
    title: { he: "פרקי אבות", en: "Pirkei Avot" },
    subtitle: { he: "מסכת אבות", en: "Ethics of the Fathers" },
  },
  perakim: [
    {
      num: 1,
      title: { he: "פרק א׳", en: "Chapter 1" },
      summary: "The chain of transmission — from Moshe at Sinai through the Anshei Knesset HaGedolah and the early Tannaim. Each generation distills the tradition into three core teachings.",
      mishnayot: [
        {
          num: 1,
          attribution: { he: "משה רבנו ואנשי כנסת הגדולה", en: "Moshe & the Men of the Great Assembly" },
          hebrew: "מֹשֶׁה קִבֵּל תּוֹרָה מִסִּינַי, וּמְסָרָהּ לִיהוֹשֻׁעַ, וִיהוֹשֻׁעַ לִזְקֵנִים, וּזְקֵנִים לִנְבִיאִים, וּנְבִיאִים מְסָרוּהָ לְאַנְשֵׁי כְנֶסֶת הַגְּדוֹלָה. הֵם אָמְרוּ שְׁלֹשָׁה דְבָרִים: הֱווּ מְתוּנִים בַּדִּין, וְהַעֲמִידוּ תַלְמִידִים הַרְבֵּה, וַעֲשׂוּ סְיָג לַתּוֹרָה.",
          english: "Moshe received the Torah at Sinai and transmitted it to Yehoshua; Yehoshua to the Elders; the Elders to the Prophets; and the Prophets to the Men of the Great Assembly. They said three things: Be deliberate in judgment, raise up many students, and make a fence around the Torah.",
          words: [
            { he: "מֹשֶׁה", en: "Moshe" },
            { he: "קִבֵּל", en: "received" },
            { he: "תּוֹרָה", en: "Torah" },
            { he: "מִסִּינַי", en: "from Sinai" },
            { he: "וּמְסָרָהּ", en: "and transmitted it" },
            { he: "לִיהוֹשֻׁעַ", en: "to Yehoshua" },
            { he: "וִיהוֹשֻׁעַ", en: "and Yehoshua" },
            { he: "לִזְקֵנִים", en: "to the Elders" },
            { he: "וּזְקֵנִים", en: "and the Elders" },
            { he: "לִנְבִיאִים", en: "to the Prophets" },
            { he: "וּנְבִיאִים", en: "and the Prophets" },
            { he: "מְסָרוּהָ", en: "transmitted it" },
            { he: "לְאַנְשֵׁי", en: "to the Men of" },
            { he: "כְנֶסֶת", en: "Assembly" },
            { he: "הַגְּדוֹלָה", en: "the Great" },
            { he: "הֵם", en: "they" },
            { he: "אָמְרוּ", en: "said" },
            { he: "שְׁלֹשָׁה", en: "three" },
            { he: "דְבָרִים", en: "things" },
            { he: "הֱווּ", en: "be" },
            { he: "מְתוּנִים", en: "deliberate" },
            { he: "בַּדִּין", en: "in judgment" },
            { he: "וְהַעֲמִידוּ", en: "and raise up" },
            { he: "תַלְמִידִים", en: "students" },
            { he: "הַרְבֵּה", en: "many" },
            { he: "וַעֲשׂוּ", en: "and make" },
            { he: "סְיָג", en: "a fence" },
            { he: "לַתּוֹרָה", en: "around the Torah" },
          ],
          themes: ["Mesorah", "Transmission", "Judgment", "Education"],
          kidsStory: "A long time ago, on a mountain called Sinai, Hashem gave the Torah to Moshe. Moshe was so careful with it — like holding the most precious gift in the world. He gave it to Yehoshua, who gave it to the wise old leaders, who gave it to the prophets, who gave it to a special group of 120 chachamim called the Great Assembly. They taught us three big rules: take your time when deciding what's right, teach lots of kids, and build a little fence around the Torah so we don't accidentally break it.",
          kidsQuestion: {
            q: "What three things did the Men of the Great Assembly teach?",
            options: [
              "Be deliberate in judgment, raise many students, make a fence around the Torah",
              "Eat your vegetables, sleep early, brush your teeth",
              "Love learning, love teaching, love eating",
            ],
            correct: 0,
          },
          commentary: {
            rashi: "מסיני — לא ממשה, אלא מסיני, שהקב״ה הוא הנותן. The Mishnah says 'from Sinai,' not 'from Moshe' — emphasizing that even Moshe was a recipient. Authority flows from Sinai itself.",
            bartenura: "הוו מתונים בדין — שלא תהיו ממהרים לפסוק עד שתחזרו על הדבר פעמים שלוש. Be deliberate in judgment — do not rush to rule until you have reviewed the matter two or three times. A hurried judge can destroy a world.",
            rambam: "פירוש סייג לתורה: גזרות ותקנות שגזרו חכמים להרחיק האדם מן העברה. A fence around the Torah refers to the rabbinic enactments designed to keep a person far from transgression — like a fence around a well, not the well itself.",
            maharal: "שלשה דברים אלו הם שלשה עמודים: הדין הוא העולם המעשי, התלמידים הם העולם הרוחני המתפשט, וסייג לתורה הוא שמירת הקדושה. These three pillars correspond to action, transmission, and preservation — the full architecture of a living tradition.",
          },
          videos: [
            { title: "The Chain of Mesorah — Opening Mishnah", teacher: "Rabbi Jonathan Sacks z\"l", duration: "14:22", source: "YouTube", url: "#", thumb: "warm" },
            { title: "Why 'from Sinai' and not 'from Moshe'?", teacher: "Rabbi YY Jacobson", duration: "22:08", source: "TorahAnytime", url: "#", thumb: "cool" },
            { title: "Three Pillars of the Great Assembly", teacher: "Rabbi David Fohrman", duration: "31:45", source: "Aleph Beta", url: "#", thumb: "earth" },
          ],
        },
        {
          num: 2,
          attribution: { he: "שמעון הצדיק", en: "Shimon HaTzaddik" },
          hebrew: "שִׁמְעוֹן הַצַּדִּיק הָיָה מִשְּׁיָרֵי כְנֶסֶת הַגְּדוֹלָה. הוּא הָיָה אוֹמֵר, עַל שְׁלֹשָׁה דְבָרִים הָעוֹלָם עוֹמֵד, עַל הַתּוֹרָה וְעַל הָעֲבוֹדָה וְעַל גְּמִילוּת חֲסָדִים.",
          english: "Shimon HaTzaddik was among the last of the Men of the Great Assembly. He used to say: The world stands on three things — on Torah, on Avodah (divine service), and on acts of loving-kindness.",
          words: [
            { he: "שִׁמְעוֹן", en: "Shimon" },
            { he: "הַצַּדִּיק", en: "the Righteous" },
            { he: "הָיָה", en: "was" },
            { he: "מִשְּיָרֵי", en: "among the remnants of" },
            { he: "כְנֶסֶת", en: "Assembly" },
            { he: "הַגְּדוֹלָה", en: "the Great" },
            { he: "הוּא", en: "he" },
            { he: "אוֹמֵר", en: "says" },
            { he: "עַל", en: "upon" },
            { he: "שְׁלֹשָׁה", en: "three" },
            { he: "דְבָרִים", en: "things" },
            { he: "הָעוֹלָם", en: "the world" },
            { he: "עוֹמֵד", en: "stands" },
            { he: "הַתּוֹרָה", en: "the Torah" },
            { he: "הָעֲבוֹדָה", en: "divine service" },
            { he: "גְּמִילוּת", en: "acts of" },
            { he: "חֲסָדִים", en: "loving-kindness" },
          ],
          themes: ["Torah", "Avodah", "Chesed", "Foundations"],
          kidsStory: "Shimon HaTzaddik was so good that people called him 'the Righteous.' He taught us that the whole world is like a giant table standing on three legs. If you take away one leg — crash! The first leg is Torah — learning. The second leg is Avodah — talking to Hashem, davening. The third leg is Chesed — being kind and helping others. As long as we do these three things, the world keeps standing.",
          kidsQuestion: {
            q: "What are the three things the world stands on?",
            options: [
              "Money, fame, and power",
              "Torah, Avodah, and acts of kindness",
              "Food, sleep, and games",
            ],
            correct: 1,
          },
          commentary: {
            rashi: "על שלשה דברים — שלשה עמודים שעליהם העולם נכון ועומד. Three pillars upon which the existence of the world is established — not three suggestions, but three structural necessities.",
            bartenura: "התורה — תלמוד תורה. העבודה — עבודת הקרבנות, ובזמן הזה תפלה במקום קרבן. גמילות חסדים — בגופו ובממונו. Torah refers to study; Avodah was sacrificial service and is now prayer in its place; gemilut chasadim is performed with one's body and resources.",
            rambam: "אלו שלשה דברים כוללים תיקון האדם בעצמו (תורה), ובינו לבין קונו (עבודה), ובינו לבין חברו (חסד). These three encompass the perfection of the person in themselves (Torah), between themselves and their Creator (Avodah), and between themselves and others (Chesed).",
            maharal: "התורה היא השכל, העבודה היא הלב, וגמילות חסדים היא המעשה. Torah is intellect, Avodah is heart, gemilut chasadim is action — together the whole human being upholds the world.",
          },
          videos: [
            { title: "The Three Pillars — A Worldview", teacher: "Rabbanit Shani Taragin", duration: "28:15", source: "YouTube", url: "#", thumb: "earth" },
            { title: "From Sacrifice to Prayer", teacher: "Rabbi Hershel Schachter", duration: "45:30", source: "YUTorah", url: "#", thumb: "warm" },
          ],
        },
        {
          num: 3,
          attribution: { he: "אנטיגנוס איש סוכו", en: "Antignos of Socho" },
          hebrew: "אַנְטִיגְנוֹס אִישׁ סוֹכוֹ קִבֵּל מִשִּׁמְעוֹן הַצַּדִּיק. הוּא הָיָה אוֹמֵר, אַל תִּהְיוּ כַעֲבָדִים הַמְשַׁמְּשִׁין אֶת הָרַב עַל מְנָת לְקַבֵּל פְּרָס, אֶלָּא הֱווּ כַעֲבָדִים הַמְשַׁמְּשִׁין אֶת הָרַב שֶׁלֹּא עַל מְנָת לְקַבֵּל פְּרָס, וִיהִי מוֹרָא שָׁמַיִם עֲלֵיכֶם.",
          english: "Antignos of Socho received from Shimon HaTzaddik. He used to say: Do not be like servants who serve the master in order to receive a reward; rather, be like servants who serve the master not in order to receive a reward. And let the awe of Heaven be upon you.",
          words: [
            { he: "אַנְטִיגְנוֹס", en: "Antignos" },
            { he: "אִישׁ", en: "man of" },
            { he: "סוֹכוֹ", en: "Socho" },
            { he: "קִבֵּל", en: "received" },
            { he: "מִשִּׁמְעוֹן", en: "from Shimon" },
            { he: "הַצַּדִּיק", en: "the Righteous" },
            { he: "אַל", en: "do not" },
            { he: "תִּהְיוּ", en: "be" },
            { he: "כַעֲבָדִים", en: "like servants" },
            { he: "הַמְשַׁמְּשִׁין", en: "who serve" },
            { he: "הָרַב", en: "the master" },
            { he: "עַל", en: "in" },
            { he: "מְנָת", en: "order" },
            { he: "לְקַבֵּל", en: "to receive" },
            { he: "פְּרָס", en: "a reward" },
            { he: "אֶלָּא", en: "rather" },
            { he: "הֱווּ", en: "be" },
            { he: "שֶׁלֹּא", en: "that not" },
            { he: "וִיהִי", en: "and let be" },
            { he: "מוֹרָא", en: "awe" },
            { he: "שָׁמַיִם", en: "of Heaven" },
            { he: "עֲלֵיכֶם", en: "upon you" },
          ],
          themes: ["Avodah Lishma", "Yirat Shamayim", "Motivation"],
          kidsStory: "Antignos taught us something amazing. Imagine if you only helped your mom because you wanted a treat afterward. That's nice, but it's not the best kind of help. Now imagine you helped because you LOVE your mom and want her to be happy. That's the best! Antignos says to serve Hashem because we love Him, not just for a prize. And always remember — Hashem is watching, and He's so big and so good.",
          kidsQuestion: {
            q: "Why should we do mitzvot?",
            options: [
              "Only to get a reward",
              "Because we love Hashem, not just for a reward",
              "Only when someone is watching",
            ],
            correct: 1,
          },
          commentary: {
            rashi: "על מנת לקבל פרס — לא תעשו המצוות בשביל השכר, אלא מאהבה. Do not perform mitzvot for the sake of the reward, but out of love.",
            bartenura: "פרס — לשון מתנת חינם, ולא לשון שכר המגיע. ולפי שהיה ירא שמא יבואו תלמידיו לידי טעות, חתם דבריו 'ויהי מורא שמים עליכם'. 'Pras' implies a free gift, not earned wages. Antignos sealed his teaching with 'let the awe of Heaven be upon you' to guard against misinterpretation.",
            rambam: "מדרגה זו היא העליונה — עבודה מאהבה, שלא על תנאי. This is the highest level — service from love, without condition. The Rambam dedicates an entire chapter (Hilchot Teshuvah 10) to this idea.",
            maharal: "כל זמן שאדם עובד על מנת לקבל פרס, אינו עבד גמור, כי דעתו על עצמו. So long as one serves expecting reward, they are not a complete servant, for their attention is on themselves.",
          },
          videos: [
            { title: "Avodah Lishma — Service from Love", teacher: "Rabbi Moshe Weinberger", duration: "41:12", source: "TorahAnytime", url: "#", thumb: "warm" },
            { title: "The Tzadok/Boethus Misreading", teacher: "Dr. Henry Abramson", duration: "18:55", source: "YouTube", url: "#", thumb: "cool" },
          ],
        },
        // Stubs for the rest of perek 1 — text included, deep content pending
        { num: 4, attribution: { he: "יוסי בן יועזר ויוסי בן יוחנן", en: "Yose ben Yoezer & Yose ben Yochanan" }, hebrew: "יוֹסֵי בֶּן יוֹעֶזֶר אִישׁ צְרֵדָה וְיוֹסֵי בֶּן יוֹחָנָן אִישׁ יְרוּשָׁלַיִם קִבְּלוּ מֵהֶם. יוֹסֵי בֶּן יוֹעֶזֶר אוֹמֵר, יְהִי בֵיתְךָ בֵּית וַעַד לַחֲכָמִים...", english: "Yose ben Yoezer of Tzreda and Yose ben Yochanan of Jerusalem received from them. Yose ben Yoezer says: Let your house be a meeting place for the wise...", themes: ["Hachnasat Orchim", "Beit Vaad"], stub: true },
        { num: 5, attribution: { he: "יוסי בן יוחנן", en: "Yose ben Yochanan" }, hebrew: "יוֹסֵי בֶּן יוֹחָנָן אִישׁ יְרוּשָׁלַיִם אוֹמֵר, יְהִי בֵיתְךָ פָתוּחַ לִרְוָחָה, וְיִהְיוּ עֲנִיִּים בְּנֵי בֵיתֶךָ...", english: "Yose ben Yochanan of Jerusalem says: Let your house be opened wide, and let the poor be members of your household...", themes: ["Hachnasat Orchim", "Tzedakah"], stub: true },
        { num: 6, attribution: { he: "יהושע בן פרחיה", en: "Yehoshua ben Perachiah" }, hebrew: "יְהוֹשֻׁעַ בֶּן פְּרַחְיָה וְנִתַּאי הָאַרְבֵּלִי קִבְּלוּ מֵהֶם. יְהוֹשֻׁעַ בֶּן פְּרַחְיָה אוֹמֵר, עֲשֵׂה לְךָ רַב, וּקְנֵה לְךָ חָבֵר, וֶהֱוֵי דָן אֶת כָּל הָאָדָם לְכַף זְכוּת.", english: "Yehoshua ben Perachiah and Nitai of Arbel received from them. Yehoshua ben Perachiah says: Make for yourself a teacher, acquire for yourself a friend, and judge every person favorably.", themes: ["Chavruta", "Dan L'Kaf Zechut"], stub: true },
        { num: 7, attribution: { he: "נתאי הארבלי", en: "Nitai of Arbel" }, hebrew: "נִתַּאי הָאַרְבֵּלִי אוֹמֵר, הַרְחֵק מִשָּׁכֵן רָע, וְאַל תִּתְחַבֵּר לָרָשָׁע, וְאַל תִּתְיָאֵשׁ מִן הַפֻּרְעָנוּת.", english: "Nitai of Arbel says: Distance yourself from a bad neighbor, do not befriend a wicked person, and do not despair of retribution.", themes: ["Influence", "Hashgacha"], stub: true },
        { num: 8, attribution: { he: "יהודה בן טבאי", en: "Yehudah ben Tabbai" }, hebrew: "יְהוּדָה בֶּן טַבַּאי וְשִׁמְעוֹן בֶּן שָׁטָח קִבְּלוּ מֵהֶם...", english: "Yehudah ben Tabbai and Shimon ben Shatach received from them...", themes: ["Judgment"], stub: true },
        { num: 9, attribution: { he: "שמעון בן שטח", en: "Shimon ben Shatach" }, hebrew: "שִׁמְעוֹן בֶּן שָׁטָח אוֹמֵר, הֱוֵי מַרְבֶּה לַחֲקֹר אֶת הָעֵדִים...", english: "Shimon ben Shatach says: Cross-examine the witnesses thoroughly...", themes: ["Justice"], stub: true },
        { num: 10, attribution: { he: "שמעיה", en: "Shemaiah" }, hebrew: "שְׁמַעְיָה וְאַבְטַלְיוֹן קִבְּלוּ מֵהֶם. שְׁמַעְיָה אוֹמֵר, אֱהֹב אֶת הַמְּלָאכָה, וּשְׂנָא אֶת הָרַבָּנוּת, וְאַל תִּתְוַדַּע לָרָשׁוּת.", english: "Shemaiah and Avtalyon received from them. Shemaiah says: Love work, hate authority, and do not seek intimacy with the ruling power.", themes: ["Work", "Humility"], stub: true },
        { num: 11, attribution: { he: "אבטליון", en: "Avtalyon" }, hebrew: "אַבְטַלְיוֹן אוֹמֵר, חֲכָמִים, הִזָּהֲרוּ בְדִבְרֵיכֶם...", english: "Avtalyon says: Sages, be careful with your words...", themes: ["Speech"], stub: true },
        { num: 12, attribution: { he: "הלל הזקן", en: "Hillel the Elder" }, hebrew: "הִלֵּל וְשַׁמַּאי קִבְּלוּ מֵהֶם. הִלֵּל אוֹמֵר, הֱוֵי מִתַּלְמִידָיו שֶׁל אַהֲרֹן, אוֹהֵב שָׁלוֹם וְרוֹדֵף שָׁלוֹם, אוֹהֵב אֶת הַבְּרִיּוֹת וּמְקָרְבָן לַתּוֹרָה.", english: "Hillel and Shammai received from them. Hillel says: Be among the disciples of Aharon — loving peace, pursuing peace, loving people, and drawing them close to Torah.", themes: ["Peace", "Love"], stub: true },
        { num: 13, attribution: { he: "הלל", en: "Hillel" }, hebrew: "הוּא הָיָה אוֹמֵר, נְגַד שְׁמָא אֲבַד שְׁמֵיהּ...", english: "He used to say: One who makes a name for themselves loses their name...", themes: ["Humility"], stub: true },
        { num: 14, attribution: { he: "הלל", en: "Hillel" }, hebrew: "הוּא הָיָה אוֹמֵר, אִם אֵין אֲנִי לִי, מִי לִי. וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי. וְאִם לֹא עַכְשָׁיו, אֵימָתָי.", english: "He used to say: If I am not for myself, who will be for me? And if I am only for myself, what am I? And if not now, when?", themes: ["Self", "Responsibility", "Now"], stub: true },
        { num: 15, attribution: { he: "שמאי", en: "Shammai" }, hebrew: "שַׁמַּאי אוֹמֵר, עֲשֵׂה תוֹרָתְךָ קֶבַע, אֱמֹר מְעַט וַעֲשֵׂה הַרְבֵּה, וֶהֱוֵי מְקַבֵּל אֶת כָּל הָאָדָם בְּסֵבֶר פָּנִים יָפוֹת.", english: "Shammai says: Make your Torah fixed, say little and do much, and receive every person with a pleasant countenance.", themes: ["Consistency", "Action"], stub: true },
        { num: 16, attribution: { he: "רבן גמליאל", en: "Rabban Gamliel" }, hebrew: "רַבָּן גַּמְלִיאֵל הָיָה אוֹמֵר, עֲשֵׂה לְךָ רַב, וְהִסְתַּלֵּק מִן הַסָּפֵק, וְאַל תַּרְבֶּה לְעַשֵּׂר אֳמָדוֹת.", english: "Rabban Gamliel used to say: Make for yourself a teacher, remove yourself from doubt, and do not tithe by estimation.", themes: ["Teacher", "Certainty"], stub: true },
        { num: 17, attribution: { he: "שמעון בנו", en: "Shimon, his son" }, hebrew: "שִׁמְעוֹן בְּנוֹ אוֹמֵר, כָּל יָמַי גָּדַלְתִּי בֵין הַחֲכָמִים, וְלֹא מָצָאתִי לַגּוּף טוֹב אֶלָּא שְׁתִיקָה.", english: "Shimon his son says: All my days I have grown up among the sages, and I have found nothing better for the body than silence.", themes: ["Silence"], stub: true },
        { num: 18, attribution: { he: "רבן שמעון בן גמליאל", en: "Rabban Shimon ben Gamliel" }, hebrew: "רַבָּן שִׁמְעוֹן בֶּן גַּמְלִיאֵל אוֹמֵר, עַל שְׁלֹשָׁה דְבָרִים הָעוֹלָם קַיָּם, עַל הַדִּין וְעַל הָאֱמֶת וְעַל הַשָּׁלוֹם.", english: "Rabban Shimon ben Gamliel says: On three things the world endures — on justice, on truth, and on peace.", themes: ["Justice", "Truth", "Peace"], stub: true },
      ],
    },
    { num: 2, title: { he: "פרק ב׳", en: "Chapter 2" }, summary: "Rabbi and the descendants of Hillel.", mishnayot: [], stub: true },
    { num: 3, title: { he: "פרק ג׳", en: "Chapter 3" }, summary: "Akavya, Chanina, and the great Tannaim.", mishnayot: [], stub: true },
    { num: 4, title: { he: "פרק ד׳", en: "Chapter 4" }, summary: "Ben Zoma, Ben Azzai, and timeless wisdom.", mishnayot: [], stub: true },
    { num: 5, title: { he: "פרק ה׳", en: "Chapter 5" }, summary: "The numbered teachings — tens, sevens, fours.", mishnayot: [], stub: true },
    { num: 6, title: { he: "פרק ו׳", en: "Chapter 6" }, summary: "Kinyan Torah — the acquisition of Torah.", mishnayot: [], stub: true },
  ],
};

window.COMMENTATORS = [
  { id: "rashi", name: "Rashi", he: "רש״י", era: "1040–1105 · Troyes", color: "#7a2e2e" },
  { id: "rambam", name: "Rambam", he: "רמב״ם", era: "1138–1204 · Cordoba/Cairo", color: "#3d5a80", note: "Peirush HaMishnayot" },
  { id: "bartenura", name: "Bartenura", he: "ברטנורא", era: "1445–1515 · Italy", color: "#5b6f3e" },
  { id: "rabbeinu_yonah", name: "Rabbeinu Yonah", he: "רבינו יונה", era: "c.1180–1263 · Girona", color: "#a86c2a" },
  { id: "tosafot_yom_tov", name: "Tosafot Yom Tov", he: "תוי״ט", era: "1579–1654 · Prague", color: "#2e6a6a" },
  { id: "maharal", name: "Maharal", he: "מהר״ל", era: "1520–1609 · Prague", color: "#6b4a8b", note: "Derech Chaim" },
  { id: "tiferet_yisrael", name: "Tiferet Yisrael", he: "תפא״י", era: "1782–1860 · Dessau", color: "#8a4a6a" },
  { id: "modern", name: "Modern", he: "עכשווי", era: "Sacks · Twerski · et al.", color: "#1a1a1a" },
  { id: "chiefRabbi", name: "Chief Rabbi Warren Goldstein", he: "הרב הראשי", era: "Contemporary", color: "#1a3a6a", note: "Chief Rabbi of South Africa" },
];

// Extend commentary for Mishnah 1 with full roster
const m1 = window.PIRKEI_AVOT.perakim[0].mishnayot[0];
Object.assign(m1.commentary, {
  chiefRabbi: "Every parent who teaches their child a brachah, every grandparent who sings Shema with a grandchild, every teacher in every Jewish day school — each is a living link in a chain that stretches back to Sinai. The Mishnah doesn't begin with abstract philosophy; it begins with a story of transmission, because Judaism is not a system of ideas we believe but a relationship we receive and pass on. In our generation, when so much pulls us toward what is fleeting, the courage to hand on Torah — patiently, lovingly, b’simchah — is itself an act of national rebuilding. We are the present-tense verb in this Mishnah.",
  rabbeinu_yonah: "Rabbeinu Yonah emphasizes that 'making a fence around the Torah' is the foundation of yirat shamayim — without protective practices, the Torah itself becomes vulnerable. The sage who builds fences is the sage who loves Torah enough to protect it.",
  tosafot_yom_tov: "התוי״ט מדקדק בלשון 'מסיני' ולא 'בסיני'. The Tosafot Yom Tov notes the precise language 'from Sinai' (not 'at Sinai') — the Torah was given AT Sinai but flows FROM it as an ongoing source. Each generation receives anew.",
  tiferet_yisrael: "התפארת ישראל מבאר ששלשה דברים אלו הם כנגד שלשה כתרים: כתר תורה, כתר כהונה, וכתר מלכות. The Tiferet Yisrael aligns the three teachings with the three crowns: Torah (be deliberate in judgment), Priesthood (raise students), and Kingship (make a fence — the protective rule of law).",
  modern: "Rabbi Sacks z\"l observed that this opening mishnah is itself an argument: by tracing transmission through prophets and a council rather than through priests or kings, the Mishnah quietly establishes that authority belongs to those who teach, not to those who inherit power. The first sentence of Ethics of the Fathers is a theory of legitimacy.",
});
m1.crossRefs = [
  { source: "Devarim 33:4", text: "תּוֹרָה צִוָּה לָנוּ מֹשֶׁה, מוֹרָשָׁה קְהִלַּת יַעֲקֹב — 'Moshe commanded us a Torah, an inheritance for the congregation of Yaakov.' The textual basis for the chain.", type: "tanach" },
  { source: "Yoma 28b", text: "Discussion of the transmission of halakha through the generations — parallels the Mishnah's chain.", type: "talmud" },
  { source: "Avot d'Rabbi Natan 1:1", text: "The Avot d'Rabbi Natan expands this mishnah, listing each link and adding 'Make a fence around your words.'", type: "midrash" },
];

const m2 = window.PIRKEI_AVOT.perakim[0].mishnayot[1];
Object.assign(m2.commentary, {
  chiefRabbi: "Shimon HaTzaddik gives us a personal architecture for a meaningful life: Torah feeds the mind, Avodah forms the heart, and Chesed shapes the hands. Most of us, in moments of stress, default to one of the three at the expense of the others — the scholar who forgets to daven, the davener who forgets the orphan, the giver who never opens a sefer. The avodah of our generation is to insist on all three together, every single week. A life built on one pillar wobbles; a life built on three stands tall.",
  rabbeinu_yonah: "רבינו יונה: שלשה אלו הם תיקון העולם בשלימותו — תורה לדעת, עבודה למעשה, וחסד לזולת. These three are the complete repair of the world — Torah to know, Avodah to act, Chesed for the other.",
  tosafot_yom_tov: "התוי״ט: 'עומד' ולא 'קיים' — העולם נוצר על מנת לעמוד על שלשה אלו, ואין זה רק קיום אלא יסוד הבריאה. The verb 'stands' (rather than 'endures') means the world was CREATED to stand on these three — they are the architectural premise of existence.",
  tiferet_yisrael: "התפארת ישראל מקשר זה למשנה הקודמת: שלשת אבות העולם — אברהם (חסד), יצחק (עבודה), יעקב (תורה). The Tiferet Yisrael connects this to the Avot themselves: Avraham (chesed), Yitzchak (avodah), Yaakov (Torah).",
  modern: "Rabbi Jonathan Sacks framed these as the three voices that build a society: the priest (Avodah — sacred ritual), the prophet (Torah — moral vision), and the king (Chesed — civic care for the vulnerable). A culture missing any one collapses.",
});
m2.crossRefs = [
  { source: "Megillah 31a", text: "The Gemara discusses Shimon HaTzaddik's tenure and the miracles of the Beit HaMikdash in his time.", type: "talmud" },
  { source: "Hosea 6:6", text: "כִּי חֶסֶד חָפַצְתִּי וְלֹא זָבַח — 'For I desire chesed and not sacrifice.' The Navi names two of the three pillars.", type: "tanach" },
  { source: "Bava Batra 9a", text: "On the supremacy of gemilut chasadim over tzedakah — three ways gemilut chasadim is greater.", type: "talmud" },
];

const m3 = window.PIRKEI_AVOT.perakim[0].mishnayot[2];
Object.assign(m3.commentary, {
  chiefRabbi: "In a world that measures everything by reward — likes, salaries, followers — Antignos teaches the most countercultural truth in Pirkei Avot: do the right thing because it is right, not because it pays. This is the difference between a relationship and a transaction. We don't keep Shabbat because we expect a parking spot in olam haba; we keep Shabbat because Hashem invited us in. The yirat shamayim Antignos closes with is not the fear of punishment — it is the awe of being in His presence at all.",
  rabbeinu_yonah: "רבינו יונה אומר שזה היסוד של עבודת ה' — לא לחשב חשבון של רווח, אלא לעבוד מתוך אהבה אמיתית, כעבד הנאמן באמת. The foundation of avodat Hashem — not to calculate gain, but to serve from genuine love, like a truly faithful servant.",
  tosafot_yom_tov: "התוי״ט מציין שאנטיגנוס לא אסר לקבל פרס, אלא שלא יהיה תכלית העבודה. Tosafot Yom Tov clarifies: Antignos did not forbid reward, only that it not be the purpose. One may receive and rejoice, but one must serve for its own sake.",
  tiferet_yisrael: "התפא״י: זאת מדרגה גבוהה מאד, ואינה אלא לחסידים. אבל אדם רגיל יעבוד גם על מנת לקבל פרס, ובלבד שיוסיף את היראה. The Tiferet Yisrael acknowledges this is the level of chasidim. An ordinary person may serve for reward — but always coupled with yirat shamayim.",
  modern: "Rabbi Twerski reads this through the lens of recovery and psychology: external motivators are unstable foundations. Identity built on love rather than reward is the only kind that survives suffering. 'And let the awe of Heaven be upon you' is the anchor.",
});
m3.crossRefs = [
  { source: "Rambam Hilchot Teshuvah 10:1-2", text: "The classic source on avodah me'ahavah — service from love — which the Rambam roots in this mishnah.", type: "halacha" },
  { source: "Sotah 22b", text: "Categories of 'pharisees' — including those who serve from love versus from fear.", type: "talmud" },
  { source: "Avot d'Rabbi Natan 5:2", text: "The tradition that Tzadok and Boethus misinterpreted Antignos's teaching, leading to the Sadducee and Boethusian sects.", type: "midrash" },
];

