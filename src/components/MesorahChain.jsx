import React from 'react';
import { Icon } from './Icon.jsx';

const { useState, useEffect, useRef, useCallback, useMemo } = React;
const useS = useState, useE = useEffect, useR = useRef, useC = useCallback;
const useState_p = useState, useEffect_p = useEffect, useState_k = useState;
const useState_m = useState, useEffect_m = useEffect, useRef_m = useRef;
const useS_s = useState, useE_s = useEffect, useR_s = useRef;
const useState_a = useState, useEffect_a = useEffect;
const useState_mc = useState, useRef_mc = useRef, useEffect_mc = useEffect;
const useEffect_h = useEffect, useState_ms = useState, useEffect_ms = useEffect;
const useS_o = useState, useE_o = useEffect;

// Full mesorah chain across Pirkei Avot — speakers from all 6 perakim.
// Each entry: id, abbreviation (Hebrew 2-letter), Hebrew name, English name,
// era, one-sentence bio, and the mishnayot they speak in (perek+mishnah).

const MESORAH_CHAIN = [
  // === Pre-Mishnaic chain (from Avot 1:1) ===
  { id: "moshe", abbrev: "מש", nameHe: "מֹשֶׁה", nameEn: "Moshe", era: "Sinai",
    bio: "Received the Torah at Sinai and transmitted it to Yehoshua.",
    mishnayot: [{perek:1, mishnah:1}] },
  { id: "yehoshua_bn", abbrev: "יה", nameHe: "יְהוֹשֻׁעַ בִּן נוּן", nameEn: "Yehoshua bin Nun", era: "Conquest",
    bio: "Moshe's successor who led the people into Eretz Yisrael.",
    mishnayot: [{perek:1, mishnah:1}] },
  { id: "zekenim", abbrev: "זק", nameHe: "זְקֵנִים", nameEn: "Elders", era: "Judges",
    bio: "The elders who carried the Torah after Yehoshua's passing.",
    mishnayot: [{perek:1, mishnah:1}] },
  { id: "neviim", abbrev: "נב", nameHe: "נְבִיאִים", nameEn: "Prophets", era: "Prophetic era",
    bio: "The prophets who received Torah from the elders.",
    mishnayot: [{perek:1, mishnah:1}] },
  { id: "knesset", abbrev: "כג", nameHe: "כְּנֶסֶת הַגְּדוֹלָה", nameEn: "Men of the Great Assembly", era: "Early Second Temple",
    bio: "120 sages including the last prophets who consolidated the tradition.",
    mishnayot: [{perek:1, mishnah:1}] },

  // === Perek 1 — the Zugot and early Tannaim ===
  { id: "shimon_hatzaddik", abbrev: "שצ", nameHe: "שִׁמְעוֹן הַצַּדִּיק", nameEn: "Shimon HaTzaddik", era: "3rd c. BCE",
    bio: "Among the last of the Great Assembly; high priest of legendary piety.",
    mishnayot: [{perek:1, mishnah:2}] },
  { id: "antignos", abbrev: "אנ", nameHe: "אַנְטִיגְנוֹס", nameEn: "Antignos of Socho", era: "3rd c. BCE",
    bio: "Received from Shimon HaTzaddik; taught service for its own sake.",
    mishnayot: [{perek:1, mishnah:3}] },
  { id: "yose_yoezer", abbrev: "יע", nameHe: "יוֹסֵי בֶּן יוֹעֶזֶר", nameEn: "Yose ben Yoezer", era: "2nd c. BCE",
    bio: "Of the first Zugot — taught making one's home a meeting place for sages.",
    mishnayot: [{perek:1, mishnah:4}] },
  { id: "yose_yochanan", abbrev: "יח", nameHe: "יוֹסֵי בֶּן יוֹחָנָן", nameEn: "Yose ben Yochanan", era: "2nd c. BCE",
    bio: "Of the Zugot; taught opening one's house to the poor.",
    mishnayot: [{perek:1, mishnah:5}] },
  { id: "yehoshua_perachyah", abbrev: "פר", nameHe: "יְהוֹשֻׁעַ בֶּן פְּרַחְיָה", nameEn: "Yehoshua ben Perachyah", era: "2nd c. BCE",
    bio: "Taught: make for yourself a teacher and acquire a friend.",
    mishnayot: [{perek:1, mishnah:6}] },
  { id: "nittai", abbrev: "נת", nameHe: "נִתַּאי הָאַרְבֵּלִי", nameEn: "Nittai of Arbel", era: "2nd c. BCE",
    bio: "Warned against bad neighbors and the company of the wicked.",
    mishnayot: [{perek:1, mishnah:7}] },
  { id: "yehudah_tabbai", abbrev: "טב", nameHe: "יְהוּדָה בֶּן טַבַּאי", nameEn: "Yehudah ben Tabbai", era: "1st c. BCE",
    bio: "Av Beit Din; taught judges to suspect litigants and weigh testimony.",
    mishnayot: [{perek:1, mishnah:8}] },
  { id: "shimon_shetach", abbrev: "שט", nameHe: "שִׁמְעוֹן בֶּן שָׁטָח", nameEn: "Shimon ben Shetach", era: "1st c. BCE",
    bio: "Nasi who reformed the courts and cross-examined witnesses rigorously.",
    mishnayot: [{perek:1, mishnah:9}] },
  { id: "shemayah", abbrev: "שע", nameHe: "שְׁמַעְיָה", nameEn: "Shemaiah", era: "1st c. BCE",
    bio: "Taught: love work, hate authority, avoid the ruling power.",
    mishnayot: [{perek:1, mishnah:10}] },
  { id: "avtalyon", abbrev: "אב", nameHe: "אַבְטַלְיוֹן", nameEn: "Avtalyon", era: "1st c. BCE",
    bio: "Warned sages to be precise with their words lest students drink and die.",
    mishnayot: [{perek:1, mishnah:11}] },
  { id: "hillel", abbrev: "הל", nameHe: "הִלֵּל", nameEn: "Hillel", era: "1st c. BCE / CE",
    bio: "Loved peace, pursued peace, drew people close to Torah.",
    mishnayot: [{perek:1, mishnah:12},{perek:1, mishnah:13},{perek:1, mishnah:14}, {perek:2, mishnah:4},{perek:2, mishnah:5},{perek:2, mishnah:6},{perek:2, mishnah:7}] },
  { id: "shammai", abbrev: "שמ", nameHe: "שַׁמַּאי", nameEn: "Shammai", era: "1st c. BCE / CE",
    bio: "Taught: make your Torah fixed, say little and do much, receive all warmly.",
    mishnayot: [{perek:1, mishnah:15}] },
  { id: "raban_gamliel", abbrev: "גמ", nameHe: "רַבָּן גַּמְלִיאֵל", nameEn: "Rabban Gamliel", era: "1st c. CE",
    bio: "Grandson of Hillel; Nasi who taught: make for yourself a teacher.",
    mishnayot: [{perek:1, mishnah:16}] },
  { id: "shimon_gamliel", abbrev: "בנ", nameHe: "שִׁמְעוֹן בְּנוֹ", nameEn: "Shimon ben Gamliel", era: "1st c. CE",
    bio: "Son of Gamliel; taught that silence is best for the body.",
    mishnayot: [{perek:1, mishnah:17}] },
  { id: "rsbg_1", abbrev: "שג", nameHe: "רַבָּן שִׁמְעוֹן בֶּן גַּמְלִיאֵל", nameEn: "Rabban Shimon ben Gamliel", era: "1st c. CE",
    bio: "Taught: the world endures on justice, truth, and peace.",
    mishnayot: [{perek:1, mishnah:18}] },

  // === Perek 2 — Rebbi and Hillel's descendants ===
  { id: "rebbi", abbrev: "רב", nameHe: "רַבִּי יְהוּדָה הַנָּשִׂיא", nameEn: "Rebbi (Yehudah HaNasi)", era: "Late 2nd c.",
    bio: "Redactor of the Mishnah; compiled the Oral Torah for posterity.",
    mishnayot: [{perek:2, mishnah:1}] },
  { id: "rabban_gamliel_3", abbrev: "ג'", nameHe: "רַבָּן גַּמְלִיאֵל בְּנוֹ שֶׁל רַבִּי", nameEn: "Rabban Gamliel (son of Rebbi)", era: "Late 2nd c.",
    bio: "Taught: Torah study with derech eretz is beautiful.",
    mishnayot: [{perek:2, mishnah:2},{perek:2, mishnah:3}] },
  { id: "ryba_zakkai", abbrev: "יז", nameHe: "רַבָּן יוֹחָנָן בֶּן זַכַּאי", nameEn: "Rabban Yochanan ben Zakkai", era: "1st c. CE",
    bio: "Saved Yavneh after the Temple's destruction; transmitted Torah onward.",
    mishnayot: [{perek:2, mishnah:8},{perek:2, mishnah:9}] },
  { id: "r_eliezer", abbrev: "אל", nameHe: "רַבִּי אֱלִיעֶזֶר", nameEn: "Rabbi Eliezer", era: "1st–2nd c.",
    bio: "Called 'a sealed cistern that loses no drop' by his teacher.",
    mishnayot: [{perek:2, mishnah:10},{perek:2, mishnah:15}] },
  { id: "r_yehoshua_chananya", abbrev: "יו", nameHe: "רַבִּי יְהוֹשֻׁעַ", nameEn: "Rabbi Yehoshua", era: "1st–2nd c.",
    bio: "Master of debate; defender of the people through wisdom and warmth.",
    mishnayot: [{perek:2, mishnah:11}] },
  { id: "r_yose_kohen", abbrev: "יס", nameHe: "רַבִּי יוֹסֵי", nameEn: "Rabbi Yose the Kohen", era: "1st–2nd c.",
    bio: "Disciple of Yochanan ben Zakkai, renowned for piety and warmth.",
    mishnayot: [{perek:2, mishnah:12}] },
  { id: "r_shimon_natanel", abbrev: "שנ", nameHe: "רַבִּי שִׁמְעוֹן", nameEn: "Rabbi Shimon ben Netanel", era: "1st–2nd c.",
    bio: "'A fearer of sin' — disciple of Yochanan ben Zakkai.",
    mishnayot: [{perek:2, mishnah:13}] },
  { id: "r_elazar_arach", abbrev: "ער", nameHe: "רַבִּי אֶלְעָזָר בֶּן עֲרָךְ", nameEn: "Rabbi Elazar ben Arach", era: "1st–2nd c.",
    bio: "Praised by his teacher as 'an overflowing spring.'",
    mishnayot: [{perek:2, mishnah:14}] },
  { id: "r_tarfon", abbrev: "טר", nameHe: "רַבִּי טַרְפוֹן", nameEn: "Rabbi Tarfon", era: "1st–2nd c.",
    bio: "Taught: the day is short, the work is great. Famed kohen and scholar.",
    mishnayot: [{perek:2, mishnah:20},{perek:2, mishnah:21}] },

  // === Perek 3 — Akavya, Chanina, and the great Tannaim ===
  { id: "akavya", abbrev: "עק", nameHe: "עֲקַבְיָא בֶּן מַהֲלַלְאֵל", nameEn: "Akavya ben Mahalalel", era: "1st c.",
    bio: "Taught the three reflections that keep a person from sin.",
    mishnayot: [{perek:3, mishnah:1}] },
  { id: "r_chanina_segan", abbrev: "חנ", nameHe: "רַבִּי חֲנִינָא סְגַן הַכֹּהֲנִים", nameEn: "Rabbi Chanina, Deputy High Priest", era: "1st c.",
    bio: "Pray for the welfare of the government — without its fear we'd swallow each other alive.",
    mishnayot: [{perek:3, mishnah:2}] },
  { id: "r_chananya_tradyon", abbrev: "תר", nameHe: "רַבִּי חֲנַנְיָה בֶּן תְּרַדְיוֹן", nameEn: "Rabbi Chananya ben Teradion", era: "2nd c.",
    bio: "Martyred under Hadrian; when two sit together with words of Torah, the Shechinah dwells.",
    mishnayot: [{perek:3, mishnah:3}] },
  { id: "r_shimon_yochai", abbrev: "שב", nameHe: "רַבִּי שִׁמְעוֹן", nameEn: "Rabbi Shimon bar Yochai", era: "2nd c.",
    bio: "Tradition credits him with the foundations of Kabbalah.",
    mishnayot: [{perek:3, mishnah:4}] },
  { id: "r_nechunya", abbrev: "נח", nameHe: "רַבִּי נְחוּנְיָא בֶּן הַקָּנָה", nameEn: "Rabbi Nechunya ben HaKanah", era: "1st–2nd c.",
    bio: "Bearing the yoke of Torah frees one from worldly burdens.",
    mishnayot: [{perek:3, mishnah:5}] },
  { id: "r_chalafta", abbrev: "חל", nameHe: "רַבִּי חֲלַפְתָּא", nameEn: "Rabbi Chalafta of Kfar Chananyah", era: "2nd c.",
    bio: "When ten sit together with Torah, the Shechinah dwells among them.",
    mishnayot: [{perek:3, mishnah:6}] },
  { id: "r_elazar_bartota", abbrev: "בר", nameHe: "רַבִּי אֶלְעָזָר בֶּן בַּרְתּוֹתָא", nameEn: "Rabbi Elazar of Bartota", era: "2nd c.",
    bio: "Give to Him from what is His — for you and yours are His.",
    mishnayot: [{perek:3, mishnah:7}] },
  { id: "r_yaakov", abbrev: "יע", nameHe: "רַבִּי יַעֲקֹב", nameEn: "Rabbi Yaakov", era: "2nd c.",
    bio: "This world is a corridor before the World to Come — prepare yourself in it.",
    mishnayot: [{perek:3, mishnah:8}] },
  { id: "r_akiva", abbrev: "אק", nameHe: "רַבִּי עֲקִיבָא", nameEn: "Rabbi Akiva", era: "2nd c.",
    bio: "Began learning at 40; the great organiser of the Oral Torah.",
    mishnayot: [{perek:3, mishnah:13},{perek:3, mishnah:14},{perek:3, mishnah:15},{perek:3, mishnah:16},{perek:3, mishnah:17}] },
  { id: "r_elazar_chisma", abbrev: "אז", nameHe: "רַבִּי אֶלְעָזָר חִסְמָא", nameEn: "Rabbi Elazar Chisma", era: "2nd c.",
    bio: "Master of astronomy and gematria; halacha is the body of Torah.",
    mishnayot: [{perek:3, mishnah:18}] },

  // === Perek 4 — Ben Zoma, Ben Azzai, and timeless wisdom ===
  { id: "ben_zoma", abbrev: "בז", nameHe: "בֶּן זוֹמָא", nameEn: "Ben Zoma", era: "2nd c.",
    bio: "Who is wise? One who learns from every person.",
    mishnayot: [{perek:4, mishnah:1}] },
  { id: "ben_azzai", abbrev: "בא", nameHe: "בֶּן עַזַּאי", nameEn: "Ben Azzai", era: "2nd c.",
    bio: "Run to perform even a minor mitzvah; one mitzvah leads to another.",
    mishnayot: [{perek:4, mishnah:2},{perek:4, mishnah:3}] },
  { id: "r_levitas", abbrev: "לו", nameHe: "רַבִּי לְוִיטָס", nameEn: "Rabbi Levitas", era: "2nd c.",
    bio: "Be of an exceedingly humble spirit — the hope of mortals is decay.",
    mishnayot: [{perek:4, mishnah:4}] },
  { id: "r_yochanan_baroka", abbrev: "בק", nameHe: "רַבִּי יוֹחָנָן בֶּן בְּרוֹקָה", nameEn: "Rabbi Yochanan ben Baroka", era: "2nd c.",
    bio: "Whoever desecrates God's name in secret will be punished openly.",
    mishnayot: [{perek:4, mishnah:5}] },
  { id: "r_yishmael_rosh", abbrev: "יש", nameHe: "רַבִּי יִשְׁמָעֵאל בְּנוֹ", nameEn: "Rabbi Yishmael", era: "2nd c.",
    bio: "Be subordinate to a superior, gentle to the young, and receive every person joyfully.",
    mishnayot: [{perek:4, mishnah:12}] },
  { id: "r_meir", abbrev: "מא", nameHe: "רַבִּי מֵאִיר", nameEn: "Rabbi Meir", era: "2nd c.",
    bio: "Akiva's foremost disciple; the unattributed Mishnah follows his view.",
    mishnayot: [{perek:4, mishnah:10},{perek:4, mishnah:14}] },

  // === Perek 5 — Numbered teachings (no single speaker per mishnah) ===
  { id: "anonymous_5", abbrev: "פ״ה", nameHe: "פֶּרֶק חֲמִישִׁי", nameEn: "Anonymous teachings", era: "Tannaitic",
    bio: "Chapter 5 collects numerical teachings — by tens, sevens, fours.",
    mishnayot: [{perek:5, mishnah:1},{perek:5, mishnah:2},{perek:5, mishnah:3},{perek:5, mishnah:4},{perek:5, mishnah:5},{perek:5, mishnah:6},{perek:5, mishnah:7},{perek:5, mishnah:8},{perek:5, mishnah:9},{perek:5, mishnah:10},{perek:5, mishnah:11},{perek:5, mishnah:12},{perek:5, mishnah:13},{perek:5, mishnah:14},{perek:5, mishnah:15},{perek:5, mishnah:16},{perek:5, mishnah:17},{perek:5, mishnah:18},{perek:5, mishnah:19}] },
  { id: "yehudah_ben_tema", abbrev: "תי", nameHe: "יְהוּדָה בֶּן תֵּימָא", nameEn: "Yehudah ben Tema", era: "2nd c.",
    bio: "Be bold as a leopard, light as an eagle, swift as a deer, mighty as a lion.",
    mishnayot: [{perek:5, mishnah:20},{perek:5, mishnah:21}] },
  { id: "ben_bag_bag", abbrev: "בב", nameHe: "בֶּן בַּג בַּג", nameEn: "Ben Bag Bag", era: "2nd c.",
    bio: "Turn it and turn it again, for everything is in it.",
    mishnayot: [{perek:5, mishnah:22}] },
  { id: "ben_he_he", abbrev: "הה", nameHe: "בֶּן הֵא הֵא", nameEn: "Ben Hei Hei", era: "2nd c.",
    bio: "According to the effort is the reward.",
    mishnayot: [{perek:5, mishnah:23}] },

  // === Perek 6 — Kinyan Torah (baraita appendix) ===
  { id: "r_meir_6", abbrev: "מו", nameHe: "רַבִּי מֵאִיר", nameEn: "Rabbi Meir (Perek 6)", era: "2nd c.",
    bio: "Whoever occupies themselves with Torah for its own sake merits many things.",
    mishnayot: [{perek:6, mishnah:1}] },
  { id: "r_yehoshua_levi", abbrev: "יל", nameHe: "רַבִּי יְהוֹשֻׁעַ בֶּן לֵוִי", nameEn: "Rabbi Yehoshua ben Levi", era: "3rd c.",
    bio: "A heavenly voice goes forth each day from Mount Horev.",
    mishnayot: [{perek:6, mishnah:2}] },
  { id: "r_yose_kisma", abbrev: "קס", nameHe: "רַבִּי יוֹסֵי בֶּן קִסְמָא", nameEn: "Rabbi Yose ben Kisma", era: "2nd c.",
    bio: "Even with all silver and gold, only Torah accompanies a person at the end.",
    mishnayot: [{perek:6, mishnah:9}] },
];

// Find active node — best match between current attribution and nameEn
function findActiveIdx(attribution, perek, mishnah) {
  if (!attribution) return -1;
  // Match by mishnah membership first — most accurate
  if (perek != null && mishnah != null) {
    const byRef = MESORAH_CHAIN.findIndex(n => n.mishnayot.some(m => m.perek === perek && m.mishnah === mishnah));
    if (byRef >= 0) return byRef;
  }
  const attr = attribution.toLowerCase();
  // Special case for the opening compound attribution
  if (attr.includes("moshe") && attr.includes("great assembly")) return MESORAH_CHAIN.findIndex(n => n.id === "knesset");
  // Fallback: nameEn substring match
  let best = -1; let bestLen = 0;
  MESORAH_CHAIN.forEach((n, i) => {
    const en = n.nameEn.toLowerCase();
    if (attr.includes(en) || en.includes(attr)) {
      if (en.length > bestLen) { best = i; bestLen = en.length; }
    }
  });
  return best;
}


const MesorahChain = ({ mishnah, perek, onNavigate }) => {
  const [openId, setOpenId] = useState_mc(null);
  const [mobileOpen, setMobileOpen] = useState_mc(false);
  const railRef = useRef_mc(null);
  const activeIdx = findActiveIdx(mishnah?.attribution?.en || "", perek?.num, mishnah?.num);

  useEffect_mc(() => {
    if (activeIdx < 0 || !railRef.current) return;
    const el = railRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIdx]);

  useEffect_mc(() => {
    if (openId == null) return;
    const onDoc = (e) => {
      if (!e.target.closest('.mc-pop') && !e.target.closest('.mc-node')) setOpenId(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openId]);

  const openNode = MESORAH_CHAIN.find(n => n.id === openId);

  return (
    <>
      <div className="mesorah-chain" ref={railRef} aria-label="Chain of Mesorah">
        <div className="mc-line" />
        {MESORAH_CHAIN.map((n, i) => {
          const isActive = i === activeIdx;
          return (
            <button key={n.id}
              data-idx={i}
              className={`mc-node ${isActive ? 'active' : ''} ${openId === n.id ? 'open' : ''}`}
              data-tip={`${n.nameEn} · ${n.era}`}
              data-tip-pos="bottom"
              onClick={(e) => { e.stopPropagation(); setOpenId(openId === n.id ? null : n.id); }}
              aria-label={`${n.nameEn}, ${n.era}`}>
              <span className="mc-abbrev">{n.abbrev}</span>
            </button>
          );
        })}
        {openNode && <NodePopover node={openNode} anchor={railRef.current?.querySelector(`[data-idx="${MESORAH_CHAIN.findIndex(n => n.id === openId)}"]`)} onClose={() => setOpenId(null)} onNavigate={onNavigate} />}
      </div>

      <button className="mesorah-pill" onClick={() => setMobileOpen(true)} aria-label="Open mesorah chain">
        <span className="mc-pill-dot" />
        <span className="mc-pill-label">Mesorah</span>
        {activeIdx >= 0 && <span className="mc-pill-active">{MESORAH_CHAIN[activeIdx].nameEn}</span>}
      </button>

      {mobileOpen && (
        <div className="mc-modal-back" onClick={() => setMobileOpen(false)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-modal-head">
              <div>
                <div className="mc-modal-eyebrow">Chain of Mesorah</div>
                <div className="mc-modal-title">From Sinai to the Mishnah</div>
              </div>
              <button className="icon-btn" onClick={() => setMobileOpen(false)}><Icon name="close" /></button>
            </div>
            <div className="mc-modal-list">
              {MESORAH_CHAIN.map((n, i) => (
                <button key={n.id} className={`mc-modal-item ${i === activeIdx ? 'active' : ''}`}
                  onClick={() => { setOpenId(n.id); setMobileOpen(false); }}>
                  <span className="mc-modal-abbrev">{n.abbrev}</span>
                  <div className="mc-modal-info">
                    <div className="mc-modal-name">{n.nameEn}</div>
                    <div className="mc-modal-meta">{n.era}</div>
                  </div>
                  {i === activeIdx && <span className="mc-modal-now">Current</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NodePopover = ({ node, anchor, onClose, onNavigate }) => {
  const popRef = useRef_mc(null);
  useEffect_mc(() => {
    if (!anchor || !popRef.current) return;
    const ar = anchor.getBoundingClientRect();
    const pop = popRef.current;
    const pw = pop.offsetWidth;
    let left = ar.left + ar.width / 2 - pw / 2;
    left = Math.max(12, Math.min(window.innerWidth - pw - 12, left));
    pop.style.left = left + 'px';
    pop.style.top = (ar.bottom + 10) + 'px';
  }, [anchor]);
  return (
    <div className="mc-pop" ref={popRef} role="dialog">
      <div className="mc-pop-arrow" />
      <div className="mc-pop-head">
        <div className="mc-pop-he">{node.nameHe}</div>
        <div className="mc-pop-en">{node.nameEn}</div>
        <div className="mc-pop-era">{node.era}</div>
      </div>
      <p className="mc-pop-bio">{node.bio}</p>
      <button className="mc-pop-link" onClick={() => {
        if (node.mishnayot[0] && onNavigate) onNavigate(node.mishnayot[0].perek, node.mishnayot[0].mishnah);
        onClose();
      }}>
        See all their mishnayot
        {node.mishnayot.length > 0 && <span className="mc-pop-count">{node.mishnayot.length}</span>}
        <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="10" x2="16" y2="10" /><polyline points="12 6 16 10 12 14" />
        </svg>
      </button>
    </div>
  );
};

window.MesorahChain = MesorahChain;
window.MESORAH_CHAIN = MESORAH_CHAIN;

export { MESORAH_CHAIN, MesorahChain, NodePopover, findActiveIdx };
