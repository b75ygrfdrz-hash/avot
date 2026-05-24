import React from 'react';

// Detailed Pirkei Avot coloring-book pages, hand-drawn in SVG.
// Each scene is shaped like a real kids' coloring page: a framed
// composition with 25-50 fillable regions, bold line art, clear
// subjects matching the mishnah it illustrates.
//
// Every scene exports the same prop signature so the ColoringPage
// host can swap them by mishnah number:
//   ({ fills, onFill, svgRef, mishnah }) => <svg>...</svg>

// Region props helper: each fillable shape carries data-id, click
// handler, and the current fill from state.
function r(id, fills, onFill) {
  return {
    'data-id': id,
    fill: fills[id] || '#ffffff',
    stroke: '#1a1a1a',
    strokeWidth: 2.5,
    strokeLinejoin: 'round',
    onClick: () => onFill(id),
    style: { cursor: 'pointer' },
  };
}

// Shared frame + corner ornaments + title banner used on every page.
function PageFrame({ fills, onFill, title, children }) {
  const R = (id) => r(id, fills, onFill);
  return (
    <>
      <rect {...R('frame_outer')} x="20" y="20" width="760" height="960" rx="14" />
      <rect {...R('frame_inner')} x="40" y="40" width="720" height="920" rx="8" />
      <path {...R('banner')} d="M 200 50 L 600 50 L 624 95 L 600 140 L 200 140 L 176 95 Z" />
      <text x="400" y="105" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fontWeight="600" fill="none" stroke="#1a1a1a" strokeWidth="1.2">
        {title}
      </text>
      <path {...R('corner_tl')} d="M 60 60 L 110 60 L 110 75 Q 95 75, 90 90 Q 75 95, 60 95 Z" />
      <path {...R('corner_tr')} d="M 740 60 L 690 60 L 690 75 Q 705 75, 710 90 Q 725 95, 740 95 Z" />
      <path {...R('corner_bl')} d="M 60 940 L 110 940 L 110 925 Q 95 925, 90 910 Q 75 905, 60 905 Z" />
      <path {...R('corner_br')} d="M 740 940 L 690 940 L 690 925 Q 705 925, 710 910 Q 725 905, 740 905 Z" />
      {children}
    </>
  );
}

// ============================================================
// Mishnah 1:1 — Moshe at Sinai
// (Detailed Sinai scene with Moshe, tablets, chain, decoration.)
// ============================================================
const Sinai1 = ({ fills, onFill, svgRef }) => {
  const R = (id) => r(id, fills, onFill);
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <PageFrame fills={fills} onFill={onFill} title="From Sinai">
        {/* Sky */}
        <path {...R('sky')} d="M 60 150 L 740 150 L 740 600 L 60 600 Z" />
        {/* Sun + rays */}
        <circle {...R('sun')} cx="660" cy="230" r="46" />
        <polygon {...R('ray_n')}  points="660,160 651,182 669,182" />
        <polygon {...R('ray_e')}  points="730,230 708,221 708,239" />
        <polygon {...R('ray_s')}  points="660,300 651,278 669,278" />
        <polygon {...R('ray_w')}  points="590,230 612,221 612,239" />
        <polygon {...R('ray_ne')} points="713,177 695,193 708,205" />
        <polygon {...R('ray_se')} points="713,283 695,267 708,255" />
        <polygon {...R('ray_sw')} points="607,283 625,267 612,255" />
        <polygon {...R('ray_nw')} points="607,177 625,193 612,205" />
        {/* Clouds */}
        <path {...R('cloud1')} d="M 100 250 Q 110 222, 150 226 Q 165 205, 200 220 Q 230 210, 245 235 Q 260 252, 235 260 L 110 260 Q 88 260, 100 250 Z" />
        <path {...R('cloud2')} d="M 290 320 Q 300 295, 340 299 Q 355 278, 390 295 Q 420 285, 432 308 Q 446 325, 420 330 L 305 330 Q 282 330, 290 320 Z" />
        <path {...R('cloud3')} d="M 490 245 Q 502 222, 540 226 Q 555 208, 590 222 Q 615 235, 600 252 L 510 252 Q 488 252, 490 245 Z" />
        {/* Birds */}
        <path {...R('bird1')} d="M 200 195 Q 215 182, 230 195 Q 245 182, 260 195 L 260 200 Q 245 188, 230 200 Q 215 188, 200 200 Z" />
        <path {...R('bird2')} d="M 360 215 Q 375 202, 390 215 Q 405 202, 420 215 L 420 220 Q 405 208, 390 220 Q 375 208, 360 220 Z" />
        <path {...R('bird3')} d="M 460 340 Q 475 327, 490 340 Q 505 327, 520 340 L 520 345 Q 505 333, 490 345 Q 475 333, 460 345 Z" />
        {/* Stars */}
        <polygon {...R('star1')} points="160,180 164,191 175,191 166,198 169,209 160,202 151,209 154,198 145,191 156,191" />
        <polygon {...R('star2')} points="740,300 744,310 754,310 746,317 749,327 740,321 731,327 734,317 726,310 736,310" />
        <polygon {...R('star3')} points="80,400 84,410 94,410 86,417 89,427 80,421 71,427 74,417 66,410 76,410" />
        {/* Mountains */}
        <polygon {...R('left_mtn')} points="60,740 230,460 380,740" />
        <polygon {...R('left_mtn_snow')} points="208,495 230,460 252,495 240,505 220,505" />
        <polygon {...R('right_mtn')} points="420,740 570,460 740,740" />
        <polygon {...R('right_mtn_snow')} points="548,495 570,460 592,495 580,505 560,505" />
        <polygon {...R('sinai')} points="180,740 400,290 620,740" />
        <polygon {...R('sinai_snow')} points="368,375 400,290 432,375 420,388 380,388" />
        {/* Light rays */}
        <polygon {...R('ray_light_1')} points="378,450 360,580 396,580 396,450" />
        <polygon {...R('ray_light_2')} points="404,450 404,580 440,580 422,450" />
        {/* Tablets */}
        <path {...R('tablet_l')} d="M 360 488 L 360 600 Q 360 612, 372 612 L 392 612 Q 400 612, 400 602 L 400 510 Q 400 488, 380 488 Z" />
        <path {...R('tablet_r')} d="M 400 488 L 400 602 Q 400 612, 408 612 L 428 612 Q 440 612, 440 600 L 440 510 Q 440 488, 420 488 Z" />
        <line x1="366" y1="520" x2="394" y2="520" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="366" y1="540" x2="394" y2="540" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="366" y1="560" x2="394" y2="560" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="366" y1="580" x2="394" y2="580" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="406" y1="520" x2="434" y2="520" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="406" y1="540" x2="434" y2="540" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="406" y1="560" x2="434" y2="560" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="406" y1="580" x2="434" y2="580" stroke="#1a1a1a" strokeWidth="1.4" />
        {/* Moshe */}
        <path {...R('robe')} d="M 372 740 L 372 670 Q 372 645, 400 628 Q 428 645, 428 670 L 428 740 Z" />
        <circle {...R('head')} cx="400" cy="616" r="16" />
        <path {...R('beard')} d="M 386 622 Q 386 648, 400 654 Q 414 648, 414 622 Z" />
        <rect {...R('staff')} x="430" y="660" width="6" height="84" />
        {/* Ground / path */}
        <path {...R('ground')} d="M 60 740 L 740 740 L 740 940 L 60 940 Z" />
        <path {...R('path')} d="M 340 940 L 425 940 L 412 740 L 388 740 Z" />
        {/* Trees */}
        <rect {...R('tree1_trunk')} x="100" y="830" width="26" height="80" rx="3" />
        <ellipse {...R('tree1_leaves')} cx="113" cy="810" rx="48" ry="56" />
        <ellipse {...R('tree1_detail')} cx="113" cy="795" rx="22" ry="22" />
        <rect {...R('tree2_trunk')} x="674" y="830" width="26" height="80" rx="3" />
        <ellipse {...R('tree2_leaves')} cx="687" cy="810" rx="48" ry="56" />
        <ellipse {...R('tree2_detail')} cx="687" cy="795" rx="22" ry="22" />
        {/* Flowers */}
        <line x1="220" y1="895" x2="220" y2="930" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle {...R('flower1_petal')} cx="220" cy="880" r="14" />
        <circle {...R('flower1_center')} cx="220" cy="880" r="5" />
        <line x1="280" y1="910" x2="280" y2="932" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle {...R('flower2_petal')} cx="280" cy="900" r="12" />
        <circle {...R('flower2_center')} cx="280" cy="900" r="4" />
        <line x1="520" y1="905" x2="520" y2="930" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle {...R('flower3_petal')} cx="520" cy="893" r="13" />
        <circle {...R('flower3_center')} cx="520" cy="893" r="4" />
        <line x1="580" y1="895" x2="580" y2="930" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle {...R('flower4_petal')} cx="580" cy="880" r="14" />
        <circle {...R('flower4_center')} cx="580" cy="880" r="5" />
        <path d="M 170 935 L 175 920 L 180 935" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 350 938 L 355 922 L 360 938" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 460 938 L 465 922 L 470 938" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 630 935 L 635 920 L 640 935" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      </PageFrame>
    </svg>
  );
};

// ============================================================
// Mishnah 1:2 — Three Pillars (Torah, Avodah, Gemilut Chasadim)
// ============================================================
const ThreePillars2 = ({ fills, onFill, svgRef }) => {
  const R = (id) => r(id, fills, onFill);
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <PageFrame fills={fills} onFill={onFill} title="Three Pillars">
        {/* Sky */}
        <path {...R('sky')} d="M 60 150 L 740 150 L 740 560 L 60 560 Z" />
        {/* Sun */}
        <circle {...R('sun')} cx="400" cy="220" r="42" />
        <polygon {...R('sun_r1')} points="400,150 392,178 408,178" />
        <polygon {...R('sun_r2')} points="470,220 442,212 442,228" />
        <polygon {...R('sun_r3')} points="400,290 392,262 408,262" />
        <polygon {...R('sun_r4')} points="330,220 358,212 358,228" />
        {/* Stars */}
        <polygon {...R('star1')} points="140,200 144,210 154,210 146,217 149,227 140,221 131,227 134,217 126,210 136,210" />
        <polygon {...R('star2')} points="640,200 644,210 654,210 646,217 649,227 640,221 631,227 634,217 626,210 636,210" />
        <polygon {...R('star3')} points="180,360 183,368 191,368 185,373 187,381 180,376 173,381 175,373 169,368 177,368" />
        <polygon {...R('star4')} points="610,360 613,368 621,368 615,373 617,381 610,376 603,381 605,373 599,368 607,368" />
        {/* Clouds */}
        <path {...R('cloud1')} d="M 100 260 Q 110 240, 145 244 Q 160 224, 195 240 Q 220 230, 230 252 Q 240 268, 215 274 L 110 274 Q 88 274, 100 260 Z" />
        <path {...R('cloud2')} d="M 540 280 Q 552 258, 590 262 Q 610 244, 640 262 Q 660 280, 640 290 L 555 290 Q 538 290, 540 280 Z" />
        {/* Ground */}
        <path {...R('ground')} d="M 60 760 L 740 760 L 740 940 L 60 940 Z" />
        {/* Small grass tufts */}
        <path d="M 110 940 L 116 920 L 122 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 300 940 L 306 920 L 312 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 488 940 L 494 920 L 500 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 680 940 L 686 920 L 692 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />

        {/* Pillar 1 — Torah (scroll) on top */}
        <rect {...R('p1_base')} x="140" y="740" width="120" height="22" />
        <rect {...R('p1_shaft')} x="160" y="450" width="80" height="310" />
        <rect {...R('p1_cap')} x="140" y="430" width="120" height="22" />
        {/* Scroll on left pillar */}
        <rect {...R('p1_scroll_body')} x="160" y="380" width="80" height="50" rx="3" />
        <circle {...R('p1_scroll_l')} cx="160" cy="405" r="10" />
        <circle {...R('p1_scroll_r')} cx="240" cy="405" r="10" />
        <line x1="172" y1="390" x2="228" y2="390" stroke="#1a1a1a" strokeWidth="1.2" />
        <line x1="172" y1="400" x2="228" y2="400" stroke="#1a1a1a" strokeWidth="1.2" />
        <line x1="172" y1="410" x2="228" y2="410" stroke="#1a1a1a" strokeWidth="1.2" />
        <line x1="172" y1="420" x2="228" y2="420" stroke="#1a1a1a" strokeWidth="1.2" />

        {/* Pillar 2 — Avodah (flame on altar), tallest center */}
        <rect {...R('p2_base')} x="332" y="740" width="136" height="26" />
        <rect {...R('p2_shaft')} x="356" y="400" width="88" height="346" />
        <rect {...R('p2_cap')} x="332" y="380" width="136" height="22" />
        {/* Altar block */}
        <rect {...R('p2_altar')} x="350" y="340" width="100" height="44" />
        {/* Flame */}
        <path {...R('p2_flame_outer')} d="M 400 250 Q 376 280, 380 320 Q 386 350, 400 358 Q 414 350, 420 320 Q 424 280, 400 250 Z" />
        <path {...R('p2_flame_inner')} d="M 400 280 Q 388 300, 390 322 Q 394 340, 400 346 Q 406 340, 410 322 Q 412 300, 400 280 Z" />

        {/* Pillar 3 — Gemilut Chasadim (cupped hands) */}
        <rect {...R('p3_base')} x="540" y="740" width="120" height="22" />
        <rect {...R('p3_shaft')} x="560" y="450" width="80" height="310" />
        <rect {...R('p3_cap')} x="540" y="430" width="120" height="22" />
        {/* Cupped hands holding a bowl */}
        <path {...R('p3_hands')} d="M 542 410 Q 540 388, 558 384 Q 580 376, 600 382 Q 620 376, 642 384 Q 660 388, 658 410 Q 640 426, 600 426 Q 560 426, 542 410 Z" />
        <ellipse {...R('p3_bowl')} cx="600" cy="396" rx="34" ry="8" />
        <ellipse {...R('p3_glow')} cx="600" cy="390" rx="18" ry="6" />
      </PageFrame>
    </svg>
  );
};

// ============================================================
// Mishnah 1:6 — Friends + Scales (judge favorably)
// Two figures meeting under balanced scales.
// ============================================================
const Friends6 = ({ fills, onFill, svgRef }) => {
  const R = (id) => r(id, fills, onFill);
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <PageFrame fills={fills} onFill={onFill} title="Friends">
        {/* Sky */}
        <path {...R('sky')} d="M 60 150 L 740 150 L 740 620 L 60 620 Z" />
        {/* Sun */}
        <circle {...R('sun')} cx="660" cy="220" r="38" />
        <polygon {...R('sun_r1')} points="660,160 652,184 668,184" />
        <polygon {...R('sun_r2')} points="720,220 696,212 696,228" />
        <polygon {...R('sun_r3')} points="660,280 652,256 668,256" />
        <polygon {...R('sun_r4')} points="600,220 624,212 624,228" />
        {/* Clouds */}
        <path {...R('cloud1')} d="M 110 220 Q 120 198, 155 202 Q 170 184, 200 198 Q 222 192, 232 212 Q 240 228, 218 234 L 120 234 Q 100 234, 110 220 Z" />
        <path {...R('cloud2')} d="M 380 280 Q 390 258, 420 262 Q 435 244, 460 258 Q 480 270, 466 282 L 395 282 Q 378 282, 380 280 Z" />

        {/* Scales of judgment in the sky */}
        <line x1="400" y1="360" x2="400" y2="470" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="300" y1="380" x2="500" y2="380" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="300" y1="380" x2="300" y2="410" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="500" y1="380" x2="500" y2="410" stroke="#1a1a1a" strokeWidth="2" />
        <ellipse {...R('scale_l')} cx="300" cy="420" rx="38" ry="12" />
        <ellipse {...R('scale_r')} cx="500" cy="420" rx="38" ry="12" />
        <circle {...R('scale_pivot')} cx="400" cy="360" r="10" />

        {/* Ground / hill */}
        <path {...R('ground')} d="M 60 760 Q 280 720, 400 730 Q 520 740, 740 760 L 740 940 L 60 940 Z" />
        <path {...R('path_ground')} d="M 340 940 L 420 940 L 412 770 L 388 770 Z" />

        {/* Two friends standing together */}
        {/* Friend 1 (left) */}
        <path {...R('f1_robe')} d="M 318 760 L 318 700 Q 318 670, 340 656 Q 362 670, 362 700 L 362 760 Z" />
        <circle {...R('f1_head')} cx="340" cy="640" r="16" />
        <path {...R('f1_beard')} d="M 326 646 Q 326 668, 340 672 Q 354 668, 354 646 Z" />
        {/* Arm of friend 1 reaching toward friend 2 */}
        <path d="M 362 700 Q 390 690, 410 700" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Friend 2 (right) */}
        <path {...R('f2_robe')} d="M 438 760 L 438 700 Q 438 670, 460 656 Q 482 670, 482 700 L 482 760 Z" />
        <circle {...R('f2_head')} cx="460" cy="640" r="16" />
        {/* Arm of friend 2 reaching back */}
        <path d="M 438 700 Q 420 690, 400 700" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Trees */}
        <rect {...R('tree1_trunk')} x="120" y="800" width="22" height="80" />
        <ellipse {...R('tree1_leaves')} cx="131" cy="780" rx="42" ry="50" />
        <rect {...R('tree2_trunk')} x="660" y="800" width="22" height="80" />
        <ellipse {...R('tree2_leaves')} cx="671" cy="780" rx="42" ry="50" />

        {/* Flowers */}
        <line x1="220" y1="895" x2="220" y2="925" stroke="#1a1a1a" strokeWidth="2" />
        <circle {...R('f_flower1_p')} cx="220" cy="880" r="10" />
        <circle {...R('f_flower1_c')} cx="220" cy="880" r="3" />
        <line x1="580" y1="895" x2="580" y2="925" stroke="#1a1a1a" strokeWidth="2" />
        <circle {...R('f_flower2_p')} cx="580" cy="880" r="10" />
        <circle {...R('f_flower2_c')} cx="580" cy="880" r="3" />
      </PageFrame>
    </svg>
  );
};

// ============================================================
// Mishnah 1:12 — Peace Dove. Two friends, dove with olive branch,
// olive trees, flowers.
// ============================================================
const PeaceDove12 = ({ fills, onFill, svgRef }) => {
  const R = (id) => r(id, fills, onFill);
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <PageFrame fills={fills} onFill={onFill} title="Pursue Peace">
        {/* Sky */}
        <path {...R('sky')} d="M 60 150 L 740 150 L 740 620 L 60 620 Z" />
        {/* Sun */}
        <circle {...R('sun')} cx="170" cy="220" r="38" />
        <polygon {...R('sun_r1')} points="170,162 162,184 178,184" />
        <polygon {...R('sun_r2')} points="228,220 206,212 206,228" />
        <polygon {...R('sun_r3')} points="170,278 162,256 178,256" />
        <polygon {...R('sun_r4')} points="112,220 134,212 134,228" />
        {/* Clouds */}
        <path {...R('cloud1')} d="M 480 220 Q 492 198, 525 202 Q 540 184, 570 198 Q 595 192, 605 212 Q 615 228, 590 234 L 490 234 Q 475 234, 480 220 Z" />

        {/* Dove flying in center */}
        <g transform="translate(400 360)">
          <ellipse {...R('dove_halo')} cx="0" cy="0" rx="80" ry="60" />
          <path {...R('dove_body')} d="M -50 0 Q -30 -24, 0 -24 Q 28 -24, 50 0 Q 28 16, 0 12 Q -16 22, -50 0 Z" />
          <path {...R('dove_wing')} d="M -10 -12 Q 0 -32, 18 -28 Q 10 -10, -10 -12 Z" />
          <path {...R('dove_tail')} d="M -50 0 L -68 -8 L -60 6 Z" />
          <circle {...R('dove_eye')} cx="-30" cy="-8" r="2" />
          <path {...R('dove_beak')} d="M -54 -2 L -64 0 L -54 4 Z" />
          {/* Olive branch in beak */}
          <path d="M -64 0 Q -86 -6, -100 -18" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
          <ellipse {...R('dove_olive1')} cx="-78" cy="-8" rx="6" ry="3" />
          <ellipse {...R('dove_olive2')} cx="-92" cy="-14" rx="5" ry="3" />
          <ellipse {...R('dove_olive3')} cx="-86" cy="-2" rx="5" ry="3" />
        </g>

        {/* Ground */}
        <path {...R('ground')} d="M 60 760 Q 280 730, 400 740 Q 520 750, 740 760 L 740 940 L 60 940 Z" />

        {/* Two figures meeting */}
        <path {...R('f1_robe')} d="M 308 770 L 308 700 Q 308 672, 332 658 Q 356 672, 356 700 L 356 770 Z" />
        <circle {...R('f1_head')} cx="332" cy="640" r="16" />
        <path {...R('f1_beard')} d="M 318 646 Q 318 666, 332 670 Q 346 666, 346 646 Z" />
        <path d="M 356 700 Q 380 700, 400 700" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />

        <path {...R('f2_robe')} d="M 444 770 L 444 700 Q 444 672, 468 658 Q 492 672, 492 700 L 492 770 Z" />
        <circle {...R('f2_head')} cx="468" cy="640" r="16" />
        <path d="M 444 700 Q 420 700, 400 700" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Olive trees */}
        <rect {...R('olive1_trunk')} x="100" y="800" width="22" height="80" />
        <ellipse {...R('olive1_leaves')} cx="111" cy="780" rx="48" ry="56" />
        <circle {...R('olive1_o1')} cx="92" cy="780" r="5" />
        <circle {...R('olive1_o2')} cx="120" cy="760" r="5" />
        <circle {...R('olive1_o3')} cx="100" cy="800" r="5" />

        <rect {...R('olive2_trunk')} x="680" y="800" width="22" height="80" />
        <ellipse {...R('olive2_leaves')} cx="691" cy="780" rx="48" ry="56" />
        <circle {...R('olive2_o1')} cx="672" cy="780" r="5" />
        <circle {...R('olive2_o2')} cx="700" cy="760" r="5" />
        <circle {...R('olive2_o3')} cx="680" cy="800" r="5" />

        {/* Flowers */}
        <line x1="200" y1="895" x2="200" y2="925" stroke="#1a1a1a" strokeWidth="2" />
        <circle {...R('p_flower1_petal')} cx="200" cy="880" r="10" />
        <circle {...R('p_flower1_center')} cx="200" cy="880" r="3" />
        <line x1="600" y1="895" x2="600" y2="925" stroke="#1a1a1a" strokeWidth="2" />
        <circle {...R('p_flower2_petal')} cx="600" cy="880" r="10" />
        <circle {...R('p_flower2_center')} cx="600" cy="880" r="3" />
        <line x1="260" y1="908" x2="260" y2="932" stroke="#1a1a1a" strokeWidth="2" />
        <circle {...R('p_flower3_petal')} cx="260" cy="898" r="8" />
        <circle {...R('p_flower3_center')} cx="260" cy="898" r="3" />
        <line x1="540" y1="908" x2="540" y2="932" stroke="#1a1a1a" strokeWidth="2" />
        <circle {...R('p_flower4_petal')} cx="540" cy="898" r="8" />
        <circle {...R('p_flower4_center')} cx="540" cy="898" r="3" />
      </PageFrame>
    </svg>
  );
};

// ============================================================
// Mishnah 1:14 — Hourglass (If not now, when?)
// Big hourglass, sand falling, figure striding forward past it.
// ============================================================
const Hourglass14 = ({ fills, onFill, svgRef }) => {
  const R = (id) => r(id, fills, onFill);
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <PageFrame fills={fills} onFill={onFill} title="If Not Now">
        {/* Sky */}
        <path {...R('sky')} d="M 60 150 L 740 150 L 740 760 L 60 760 Z" />
        {/* Sun */}
        <circle {...R('sun')} cx="640" cy="220" r="42" />
        <polygon {...R('sun_r1')} points="640,158 632,180 648,180" />
        <polygon {...R('sun_r2')} points="702,220 678,212 678,228" />
        <polygon {...R('sun_r3')} points="640,282 632,260 648,260" />
        <polygon {...R('sun_r4')} points="578,220 600,212 600,228" />
        {/* Stars */}
        <polygon {...R('star1')} points="170,200 174,210 184,210 176,217 179,227 170,221 161,227 164,217 156,210 166,210" />
        <polygon {...R('star2')} points="200,360 203,368 211,368 205,373 207,381 200,376 193,381 195,373 189,368 197,368" />
        {/* Clouds */}
        <path {...R('cloud1')} d="M 100 280 Q 110 258, 145 262 Q 160 244, 192 258 Q 215 270, 200 282 L 110 282 Q 92 282, 100 280 Z" />

        {/* Hourglass — frame top */}
        <rect {...R('hg_frame_top')} x="280" y="320" width="240" height="22" />
        {/* Hourglass — frame bottom */}
        <rect {...R('hg_frame_bot')} x="280" y="720" width="240" height="22" />
        {/* Side rails */}
        <rect {...R('hg_rail_l')} x="290" y="342" width="14" height="378" />
        <rect {...R('hg_rail_r')} x="496" y="342" width="14" height="378" />
        {/* Glass — top half */}
        <path {...R('hg_glass_top')} d="M 304 342 L 496 342 L 400 530 Z" />
        {/* Glass — bottom half */}
        <path {...R('hg_glass_bot')} d="M 400 530 L 496 720 L 304 720 Z" />
        {/* Sand top */}
        <path {...R('hg_sand_top')} d="M 314 352 L 486 352 L 400 522 Z" />
        {/* Sand stream */}
        <rect {...R('hg_sand_stream')} x="396" y="528" width="8" height="180" />
        <circle {...R('hg_sand_drop')} cx="400" cy="700" r="5" />
        {/* Sand pile bottom */}
        <path {...R('hg_sand_bottom')} d="M 340 712 Q 360 685, 400 682 Q 440 685, 460 712 Z" />

        {/* Figure striding forward beside the hourglass */}
        <g transform="translate(610 730)">
          {/* Body */}
          <path {...R('p_robe')} d="M -24 0 L -28 -78 Q -28 -94, -12 -98 L 12 -98 Q 28 -94, 28 -78 L 24 0 Z" />
          <circle {...R('p_head')} cx="0" cy="-110" r="14" />
          <path {...R('p_beard')} d="M -8 -104 Q -8 -90, 0 -84 Q 8 -90, 8 -104 Z" />
          {/* Forward arm */}
          <path d="M 26 -76 Q 56 -74, 70 -52" stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>

        {/* Ground */}
        <path {...R('ground')} d="M 60 760 L 740 760 L 740 940 L 60 940 Z" />
        {/* Footprints leading forward */}
        <ellipse {...R('foot1')} cx="430" cy="810" rx="14" ry="6" />
        <ellipse {...R('foot2')} cx="500" cy="828" rx="14" ry="6" />
        <ellipse {...R('foot3')} cx="570" cy="846" rx="14" ry="6" />
      </PageFrame>
    </svg>
  );
};

// ============================================================
// Mishnah 1:18 — World on Three Pillars
// (Justice, Truth, Peace)
// ============================================================
const WorldOnPillars18 = ({ fills, onFill, svgRef }) => {
  const R = (id) => r(id, fills, onFill);
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <PageFrame fills={fills} onFill={onFill} title="The World Endures">
        {/* Sky */}
        <path {...R('sky')} d="M 60 150 L 740 150 L 740 540 L 60 540 Z" />
        {/* Stars */}
        <polygon {...R('star1')} points="140,210 144,220 154,220 146,227 149,237 140,231 131,237 134,227 126,220 136,220" />
        <polygon {...R('star2')} points="640,210 644,220 654,220 646,227 649,237 640,231 631,237 634,227 626,220 636,220" />
        <polygon {...R('star3')} points="200,420 203,428 211,428 205,433 207,441 200,436 193,441 195,433 189,428 197,428" />
        <polygon {...R('star4')} points="600,420 603,428 611,428 605,433 607,441 600,436 593,441 595,433 589,428 597,428" />
        <polygon {...R('star5')} points="400,180 404,190 414,190 406,197 409,207 400,201 391,207 394,197 386,190 396,190" />

        {/* Clouds around the world */}
        <path {...R('cloud1')} d="M 220 330 Q 232 308, 265 312 Q 278 296, 300 308 Q 318 322, 300 332 L 228 332 Q 214 332, 220 330 Z" />
        <path {...R('cloud2')} d="M 500 330 Q 512 308, 540 312 Q 555 296, 580 308 Q 600 322, 580 332 L 508 332 Q 494 332, 500 330 Z" />

        {/* The World */}
        <circle {...R('world_outer')} cx="400" cy="350" r="100" />
        <path {...R('world_continent1')} d="M 340 320 Q 360 310, 380 318 Q 405 325, 425 318 Q 445 312, 460 322 Q 462 340, 440 350 Q 420 360, 400 355 Q 380 360, 360 348 Q 342 340, 340 320 Z" />
        <path {...R('world_continent2')} d="M 360 380 Q 390 376, 410 386 Q 425 396, 415 410 Q 400 414, 380 410 Q 365 402, 360 380 Z" />
        <ellipse {...R('world_highlight')} cx="370" cy="320" rx="18" ry="12" />

        {/* Three pillars holding it up */}
        {/* Pillar 1 — Scales of Justice */}
        <rect {...R('p1_base')} x="120" y="780" width="120" height="22" />
        <rect {...R('p1_shaft')} x="148" y="500" width="64" height="280" />
        <rect {...R('p1_cap')} x="120" y="480" width="120" height="22" />
        {/* Scales ornament */}
        <line x1="180" y1="430" x2="180" y2="475" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="140" y1="440" x2="220" y2="440" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse {...R('p1_scale_l')} cx="140" cy="460" rx="16" ry="5" />
        <ellipse {...R('p1_scale_r')} cx="220" cy="460" rx="16" ry="5" />
        <line x1="140" y1="440" x2="140" y2="455" stroke="#1a1a1a" strokeWidth="1.5" />
        <line x1="220" y1="440" x2="220" y2="455" stroke="#1a1a1a" strokeWidth="1.5" />

        {/* Pillar 2 — Tablet of Truth (center, tallest) */}
        <rect {...R('p2_base')} x="332" y="780" width="136" height="26" />
        <rect {...R('p2_shaft')} x="358" y="500" width="84" height="280" />
        <rect {...R('p2_cap')} x="332" y="480" width="136" height="22" />
        <path {...R('p2_tablet')} d="M 372 410 L 372 472 Q 372 478, 380 478 L 420 478 Q 428 478, 428 472 L 428 422 Q 428 410, 412 410 Z" />
        <line x1="378" y1="430" x2="422" y2="430" stroke="#1a1a1a" strokeWidth="1.2" />
        <line x1="378" y1="442" x2="422" y2="442" stroke="#1a1a1a" strokeWidth="1.2" />
        <line x1="378" y1="454" x2="422" y2="454" stroke="#1a1a1a" strokeWidth="1.2" />
        <line x1="378" y1="466" x2="422" y2="466" stroke="#1a1a1a" strokeWidth="1.2" />

        {/* Pillar 3 — Dove of Peace */}
        <rect {...R('p3_base')} x="560" y="780" width="120" height="22" />
        <rect {...R('p3_shaft')} x="588" y="500" width="64" height="280" />
        <rect {...R('p3_cap')} x="560" y="480" width="120" height="22" />
        <path {...R('p3_dove_body')} d="M 600 470 Q 616 458, 628 462 Q 644 466, 644 478 Q 632 482, 624 478 Q 614 484, 600 470 Z" />
        <path {...R('p3_dove_wing')} d="M 614 466 Q 622 454, 632 458 Q 626 466, 614 466 Z" />
        <circle {...R('p3_dove_eye')} cx="638" cy="470" r="1.5" />
        <path {...R('p3_dove_tail')} d="M 600 470 L 590 466 L 596 474 Z" />

        {/* Ground */}
        <path {...R('ground')} d="M 60 800 L 740 800 L 740 940 L 60 940 Z" />
        <path d="M 130 940 L 136 920 L 142 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 320 940 L 326 920 L 332 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 488 940 L 494 920 L 500 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M 680 940 L 686 920 L 692 940" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      </PageFrame>
    </svg>
  );
};

// ============================================================
// Simple placeholder for mishnayot without a dedicated scene yet.
// ============================================================
const SimpleColoring = ({ mishnah, fills, onFill, svgRef }) => {
  const R = (id) => r(id, fills, onFill);
  return (
    <svg ref={svgRef} viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" className="cp-svg">
      <PageFrame fills={fills} onFill={onFill} title={`Mishnah ${mishnah.num}`}>
        <rect {...R('back')} x="60" y="160" width="680" height="780" rx="20" />
        <rect {...R('p1_base')} x="120" y="780" width="160" height="40" />
        <rect {...R('p1_shaft')} x="148" y="320" width="104" height="460" />
        <rect {...R('p1_cap')} x="120" y="280" width="160" height="40" />
        <rect {...R('p2_base')} x="320" y="780" width="160" height="40" />
        <rect {...R('p2_shaft')} x="348" y="280" width="104" height="500" />
        <rect {...R('p2_cap')} x="320" y="240" width="160" height="40" />
        <rect {...R('p3_base')} x="520" y="780" width="160" height="40" />
        <rect {...R('p3_shaft')} x="548" y="320" width="104" height="460" />
        <rect {...R('p3_cap')} x="520" y="280" width="160" height="40" />
        <circle {...R('sun_a')} cx="200" cy="220" r="30" />
        <circle {...R('sun_b')} cx="600" cy="220" r="30" />
      </PageFrame>
    </svg>
  );
};

// ============================================================
// Registry
// ============================================================
const COLORING = {
  1: Sinai1,
  2: ThreePillars2,
  6: Friends6,
  12: PeaceDove12,
  14: Hourglass14,
  18: WorldOnPillars18,
};

export function getColoringFor(mishnahNum) {
  return COLORING[mishnahNum] || null;
}

export { SimpleColoring };
