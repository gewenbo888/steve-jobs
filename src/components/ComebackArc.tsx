"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   ComebackArc — Theme 07: The Arc — Fall & Return
   A dramatic three-act trajectory of Steve Jobs (1976–2011).
   Centerpiece: canvas curve of influence/standing over time.
   Two crisis low-points rendered as focal moments.
   Thesis: the wilderness didn't interrupt him — it made him.
   Survivorship caveat surfaced prominently.
═══════════════════════════════════════════════════════════════════════════ */

/* ── palette (raw hex for canvas) ──────────────────────────────────────── */
const C = {
  void950:  "#0a0a0b",
  void900:  "#111113",
  void800:  "#18181b",
  void700:  "#232327",
  flux500:  "#2997ff",
  flux400:  "#6cb8ff",
  iris500:  "#a663cc",
  iris400:  "#c79be0",
  leaf500:  "#61bb46",
  leaf400:  "#8fd47a",
  gold500:  "#f6a623",
  gold400:  "#ffc15e",
  plasm500: "#ff5e5b",
  plasm400: "#ff8a87",
  steel500: "#86868b",
  steel400: "#a1a1a6",
  ink50:    "#f5f5f7",
  ink300:   "#a1a1a6",
  ink500:   "#6e6e73",
};

/* ── the influence/standing y-values for the trajectory curve ───────────── */
// normalized 0–1 scale. 1 = peak, 0 = nadir.
interface CurvePoint {
  year: number;
  value: number;       // 0–1 influence/standing
  crisis?: boolean;    // low-point marker
  labelEn?: string;
  labelZh?: string;
}

const CURVE_POINTS: CurvePoint[] = [
  { year: 1976, value: 0.12, labelEn: "Apple founded", labelZh: "苹果创立" },
  { year: 1980, value: 0.40, labelEn: "Apple IPO", labelZh: "苹果上市" },
  { year: 1984, value: 0.72, labelEn: "Macintosh", labelZh: "麦金塔发布" },
  { year: 1985, value: 0.10, crisis: true, labelEn: "Ousted", labelZh: "被驱逐" },
  { year: 1989, value: 0.20, labelEn: "NeXT Cube", labelZh: "NeXT电脑" },
  { year: 1991, value: 0.28, labelEn: "Pixar pivots", labelZh: "皮克斯转型" },
  { year: 1995, value: 0.38, labelEn: "Toy Story", labelZh: "《玩具总动员》" },
  { year: 1997, value: 0.08, crisis: true, labelEn: "Apple near bankrupt", labelZh: "苹果濒临破产" },
  { year: 1998, value: 0.40, labelEn: "iMac · Think Different", labelZh: "iMac · 非同凡想" },
  { year: 2001, value: 0.62, labelEn: "iPod", labelZh: "iPod" },
  { year: 2003, value: 0.70, labelEn: "iTunes Store", labelZh: "iTunes商店" },
  { year: 2007, value: 0.88, labelEn: "iPhone", labelZh: "iPhone" },
  { year: 2010, value: 0.96, labelEn: "iPad · #1 by mktcap", labelZh: "iPad · 市值登顶" },
  { year: 2011, value: 1.00, labelEn: "Legacy", labelZh: "传承" },
];

/* ── act definitions for step-through ───────────────────────────────────── */
interface Act {
  id: string;
  phase: "rise" | "fall" | "wilderness" | "return" | "renaissance";
  yearRange: [number, number];
  title: { en: string; zh: string };
  subtitle: { en: string; zh: string };
  annotation: { en: string; zh: string };
  color: string;
  colorBg: string;
}

const ACTS: Act[] = [
  {
    id: "rise",
    phase: "rise",
    yearRange: [1976, 1984],
    title: { en: "Act I — Rise", zh: "第一幕——崛起" },
    subtitle: { en: "1976–1984 · Brash, brilliant, arrogant.", zh: "1976–1984 · 莽撞、天才、傲慢" },
    color: C.flux500,
    colorBg: "rgba(41,151,255,0.09)",
    annotation: {
      en: "Apple is co-founded in a garage; the Apple II makes personal computing real for millions. The 1980 IPO creates more millionaires in a single day than any prior event in Silicon Valley. The Macintosh launches in 1984 to a standing ovation — the product of a team Jobs drove to the edge. He is brilliant, charismatic, and impossible: celebrated by the press, feared by his engineers.",
      zh: "苹果在车库中联合创立；Apple II让个人电脑走进千家万户。1980年IPO在一天内缔造的百万富翁数量超过硅谷任何先例。1984年，麦金塔在掌声中发布——这是乔布斯将团队逼到极限的成果。他才华横溢、魅力四射、令人难以相处：受媒体追捧，却令工程师生畏。",
    },
  },
  {
    id: "fall",
    phase: "fall",
    yearRange: [1985, 1985],
    title: { en: "The Fall", zh: "坠落" },
    subtitle: { en: "1985 · Ousted from his own company.", zh: "1985 · 被自己创立的公司驱逐" },
    color: C.plasm500,
    colorBg: "rgba(255,94,91,0.09)",
    annotation: {
      en: "The board sides with CEO John Sculley in a power struggle Jobs himself initiated. He is stripped of his operating role, then resigns entirely, taking five Apple employees with him. He is 30 years old. The humiliation is total and public: the visionary who built the Macintosh has been fired by the company he founded. Isaacson: he described it as having his heart ripped out. (Walter Isaacson, Steve Jobs, 2011.)",
      zh: "在乔布斯亲手挑起的权力争斗中，董事会站到了CEO约翰·斯卡利一边。他被剥夺运营职责，随即辞职，带走五名苹果员工。那年他30岁。这场羞辱是全方位、公开的：建造了麦金塔的远见者，被自己创立的公司扫地出门。艾萨克森记载：他将此描述为心被掏空。（沃尔特·艾萨克森，《史蒂夫·乔布斯传》，2011年）",
    },
  },
  {
    id: "wilderness",
    phase: "wilderness",
    yearRange: [1985, 1996],
    title: { en: "The Wilderness", zh: "荒野岁月" },
    subtitle: { en: "1985–1996 · NeXT + Pixar. Failure and the other thing.", zh: "1985–1996 · NeXT + 皮克斯。失败，以及另一件事" },
    color: C.iris500,
    colorBg: "rgba(166,99,204,0.09)",
    annotation: {
      en: "NeXT Computer: beautiful machines ($6,500 apiece), a technically brilliant OS — and a commercial failure. Fewer than 50,000 units sold. But NeXTSTEP, the operating system built on Unix and Objective-C, would later become the foundation of Apple's OS X and iOS. The failure contained its own future. Meanwhile: Jobs buys a small graphics division from Lucasfilm in 1986 for $5M. He names it Pixar. It nearly bankrupts him — he funds it through the late 1980s from personal capital. Then in 1995, Toy Story earns $362M worldwide and changes cinema. Pixar's 1995 IPO makes Jobs a billionaire the week the film opens. The wilderness was not wasted time.",
      zh: "NeXT电脑：造型精美（每台6500美元）、技术卓越的操作系统——却是商业上的失败。销售总量不足五万台。但NeXTSTEP这套基于Unix和Objective-C的操作系统，后来成为苹果OS X与iOS的基础。失败本身孕育着未来。与此同时：1986年，乔布斯以500万美元从卢卡斯影业买下一个小型图形部门，将其命名为皮克斯。它几乎令他倾家荡产——整个八十年代末他都用个人资本为其输血。然后，1995年《玩具总动员》全球票房3.62亿美元，改变了电影史。1995年皮克斯IPO，在影片上映当周让乔布斯成为亿万富翁。荒野岁月并非虚度。",
    },
  },
  {
    id: "return",
    phase: "return",
    yearRange: [1996, 1997],
    title: { en: "The Return", zh: "回归" },
    subtitle: { en: "1996–1997 · 90 days from death. Microsoft's $150M.", zh: "1996–1997 · 距破产90天。微软1.5亿美元投资" },
    color: C.gold500,
    colorBg: "rgba(246,166,35,0.09)",
    annotation: {
      en: "Apple acquires NeXT for $429M in December 1996, buying the OS it needs — and Jobs with it. He returns initially as \"advisor,\" then interim CEO in September 1997. Apple is weeks from insolvency, burning through $1M a day. The move that shocks the industry: Jobs negotiates a $150M investment from Microsoft — the company he spent a decade vilifying. At Macworld 1997, Bill Gates appears on screen to applause-free silence. Then Jobs launches \"Think Different\" — not a product pitch, but an identity manifesto for a company that had forgotten what it was. The comeback begins not with a product, but with a story.",
      zh: "1996年12月，苹果以4.29亿美元收购NeXT，买下了它所需要的操作系统——以及乔布斯本人。他最初以「顾问」身份回归，1997年9月出任临时CEO。苹果距破产只剩数周，每天烧掉100万美元。随后震惊业界的一幕：乔布斯与他花了十年诅咒的微软谈成1.5亿美元投资。1997年Macworld大会上，比尔·盖茨的画面出现在屏幕上，台下鸦雀无声。随后乔布斯发布「非同凡想」——不是产品宣传，而是一家忘记了自己是谁的公司的身份宣言。复出不是从产品开始，而是从故事开始的。",
    },
  },
  {
    id: "renaissance",
    phase: "renaissance",
    yearRange: [1998, 2011],
    title: { en: "Act III — Renaissance", zh: "第三幕——文艺复兴" },
    subtitle: { en: "1998–2011 · iMac, iPod, iPhone, iPad.", zh: "1998–2011 · iMac、iPod、iPhone、iPad" },
    color: C.leaf500,
    colorBg: "rgba(97,187,70,0.09)",
    annotation: {
      en: "The iMac (1998): colorful, user-first, $1,299 — sells 800,000 in five months. The iPod (2001): 1,000 songs in your pocket, the simplest device that could possibly work. iTunes Store (2003): music industry surrenders to 99¢. The iPhone (2007): the device that ends the keyboard-phone era in a single presentation. The iPad (2010). By August 2011, Apple overtakes ExxonMobil as the world's most valuable company. Jobs dies October 5, 2011, at 56, of pancreatic cancer. The man who returned from the wilderness had, in 14 years, built the defining technology company of his era — more focused, more collaborative, more patient than the first-act version. Isaacson's central observation: the wilderness didn't interrupt him. It completed him.",
      zh: "iMac（1998年）：色彩缤纷、以用户为先，定价1299美元——五个月售出80万台。iPod（2001年）：口袋里装下1000首歌，可能做到的最简单的设备。iTunes商店（2003年）：音乐产业向99美分低头。iPhone（2007年）：在一场发布会上终结键盘手机时代的设备。iPad（2010年）。2011年8月，苹果超越埃克森美孚，成为全球市值最高的公司。乔布斯于2011年10月5日因胰腺癌去世，享年56岁。从荒野归来的那个人，在14年里建造了他那个时代最具决定性意义的科技公司——比第一幕的他更专注、更善于协作、更有耐心。艾萨克森的核心判断：荒野岁月没有打断他，而是完成了他。",
    },
  },
];

/* ── lerp helper ────────────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/* ── catmull-rom spline through the curve points ────────────────────────── */
function catmullRomPoint(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number
): [number, number] {
  const t2 = t * t;
  const t3 = t2 * t;
  const x =
    0.5 * (
      2 * p1[0] +
      (-p0[0] + p2[0]) * t +
      (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
      (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
    );
  const y =
    0.5 * (
      2 * p1[1] +
      (-p0[1] + p2[1]) * t +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
    );
  return [x, y];
}

/* ── build pixel coords from curve points ────────────────────────────────── */
function buildCurveCoords(
  pts: CurvePoint[],
  w: number,
  h: number,
  padL: number,
  padR: number,
  padT: number,
  padB: number
): [number, number][] {
  const minYear = pts[0].year;
  const maxYear = pts[pts.length - 1].year;
  return pts.map(p => [
    padL + ((p.year - minYear) / (maxYear - minYear)) * (w - padL - padR),
    padT + (1 - p.value) * (h - padT - padB),
  ]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DRAW THE ARC CANVAS
═══════════════════════════════════════════════════════════════════════════ */
function drawArc(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  activeActIdx: number,
  progress: number,
  tickT: number,
  lang: "en" | "zh"
) {
  ctx.clearRect(0, 0, w, h);

  // background
  ctx.fillStyle = C.void950;
  ctx.fillRect(0, 0, w, h);

  const PAD_L = 14, PAD_R = 14, PAD_T = 22, PAD_B = 30;
  const isNarrow = w < 480;

  const coords = buildCurveCoords(CURVE_POINTS, w, h, PAD_L, PAD_R, PAD_T, PAD_B);
  const minYear = CURVE_POINTS[0].year;
  const maxYear = CURVE_POINTS[CURVE_POINTS.length - 1].year;
  const toX = (year: number) => PAD_L + ((year - minYear) / (maxYear - minYear)) * (w - PAD_L - PAD_R);
  const ch = h - PAD_T - PAD_B;

  // act shading regions
  const actRegions: { x0: number; x1: number; color: string; alpha: number }[] = [
    { x0: toX(1976), x1: toX(1985), color: C.flux500,  alpha: 0.04 },
    { x0: toX(1985), x1: toX(1986), color: C.plasm500, alpha: 0.07 },
    { x0: toX(1986), x1: toX(1996), color: C.iris500,  alpha: 0.04 },
    { x0: toX(1996), x1: toX(1998), color: C.gold500,  alpha: 0.06 },
    { x0: toX(1998), x1: toX(2011), color: C.leaf500,  alpha: 0.04 },
  ];
  actRegions.forEach(r => {
    ctx.save();
    ctx.fillStyle = r.color;
    ctx.globalAlpha = r.alpha;
    ctx.fillRect(r.x0, PAD_T, r.x1 - r.x0, ch);
    ctx.restore();
  });

  // active act highlight
  const activeAct = ACTS[activeActIdx];
  if (activeAct) {
    const ax0 = toX(activeAct.yearRange[0]);
    const ax1 = toX(activeAct.yearRange[1] + 1);
    ctx.save();
    ctx.globalAlpha = 0.10 + 0.04 * Math.sin(tickT * 1.5);
    ctx.fillStyle = activeAct.color;
    ctx.fillRect(ax0, PAD_T - 2, ax1 - ax0, ch + 4);
    // border glow
    ctx.strokeStyle = activeAct.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.strokeRect(ax0, PAD_T - 2, ax1 - ax0, ch + 4);
    ctx.restore();
  }

  // subtle horizontal grid lines (influence marks)
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 0.5;
  for (let v = 0.25; v <= 1.0; v += 0.25) {
    const gy = PAD_T + (1 - v) * ch;
    ctx.beginPath(); ctx.moveTo(PAD_L, gy); ctx.lineTo(w - PAD_R, gy); ctx.stroke();
  }
  ctx.restore();

  // y-axis labels
  const yLabels: { v: number; en: string; zh: string }[] = [
    { v: 1.0, en: "Peak", zh: "巅峰" },
    { v: 0.5, en: "Mid", zh: "中段" },
    { v: 0.0, en: "Low", zh: "低谷" },
  ];
  ctx.save();
  ctx.font = `${isNarrow ? 6 : 7}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.ink500;
  ctx.textAlign = "left";
  yLabels.forEach(lbl => {
    const gy = PAD_T + (1 - lbl.v) * ch;
    ctx.textBaseline = lbl.v === 0 ? "bottom" : lbl.v === 1 ? "top" : "middle";
    ctx.fillText(lang === "zh" ? lbl.zh : lbl.en, 2, gy);
  });
  ctx.restore();

  // determine how much of the curve to reveal based on progress + act
  // act 0 → reveal up to 1984, act 1 → up to 1985, etc.
  const actEndYears = [1984, 1985, 1996, 1997, 2011];
  const revealEnd = actEndYears[activeActIdx] ?? 2011;
  // total span
  const fullSpan = maxYear - minYear;
  const revealFrac = ((revealEnd - minYear) / fullSpan);
  const fullRevealFrac = revealFrac * progress + (activeActIdx > 0 ? (actEndYears[activeActIdx - 1] - minYear) / fullSpan * (1 - progress) : 0);
  // always show at least up to prior act end, animate new segment in
  const priorEnd = activeActIdx > 0 ? actEndYears[activeActIdx - 1] : minYear;
  const priorFrac = (priorEnd - minYear) / fullSpan;
  const displayFrac = priorFrac + (revealFrac - priorFrac) * progress;

  // draw spline via catmull-rom, up to displayFrac of time axis
  const N = 300; // segments
  let firstPoint = true;
  // gradient path: split into act-colored segments
  ctx.save();
  ctx.lineWidth = isNarrow ? 2 : 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 12;
  ctx.shadowColor = C.flux400;

  const getCurveXY = (fracOfTime: number): [number, number] => {
    // fracOfTime in [0,1] across the full year range
    const targetYear = minYear + fracOfTime * (maxYear - minYear);
    // find which segment
    let segIdx = 0;
    for (let i = 0; i < CURVE_POINTS.length - 1; i++) {
      if (targetYear >= CURVE_POINTS[i].year && targetYear <= CURVE_POINTS[i + 1].year) {
        segIdx = i; break;
      }
      if (i === CURVE_POINTS.length - 2) segIdx = i;
    }
    const p0 = coords[Math.max(0, segIdx - 1)];
    const p1 = coords[segIdx];
    const p2 = coords[Math.min(coords.length - 1, segIdx + 1)];
    const p3 = coords[Math.min(coords.length - 1, segIdx + 2)];
    const segStartYear = CURVE_POINTS[segIdx].year;
    const segEndYear   = CURVE_POINTS[segIdx + 1]?.year ?? segStartYear;
    const tSeg = segEndYear > segStartYear
      ? (targetYear - segStartYear) / (segEndYear - segStartYear)
      : 0;
    return catmullRomPoint(p0, p1, p2, p3, tSeg);
  };

  // color the curve by phase
  const getActColor = (frac: number): string => {
    const yr = minYear + frac * (maxYear - minYear);
    if (yr < 1985)  return C.flux400;
    if (yr < 1986)  return C.plasm400;
    if (yr < 1997)  return C.iris400;
    if (yr < 1998)  return C.gold400;
    return C.leaf400;
  };

  // draw piecewise colored curve
  let prevXY = getCurveXY(0);
  for (let i = 1; i <= N; i++) {
    const frac = (i / N) * displayFrac;
    if (frac > displayFrac) break;
    const xy = getCurveXY(frac);
    const col = getActColor(frac);
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.shadowColor = col;
    ctx.moveTo(prevXY[0], prevXY[1]);
    ctx.lineTo(xy[0], xy[1]);
    ctx.stroke();
    prevXY = xy;
  }
  ctx.restore();

  // leading glow dot at reveal edge
  const edgeFrac = displayFrac;
  if (edgeFrac > 0 && edgeFrac <= 1) {
    const [ex, ey] = getCurveXY(edgeFrac);
    const edgeColor = getActColor(edgeFrac);
    ctx.save();
    const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 14);
    glow.addColorStop(0, edgeColor + "88");
    glow.addColorStop(1, edgeColor + "00");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(ex, ey, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex, ey, 3.5 * (0.8 + 0.2 * Math.sin(tickT * 4)), 0, Math.PI * 2);
    ctx.fillStyle = edgeColor;
    ctx.shadowColor = edgeColor;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();
  }

  // milestone dots + labels
  CURVE_POINTS.forEach((pt, i) => {
    const ptFrac = (pt.year - minYear) / (maxYear - minYear);
    if (ptFrac > displayFrac + 0.001) return; // not yet revealed
    const [px, py] = coords[i];
    const isCrisis = !!pt.crisis;
    const dotColor = isCrisis ? C.plasm500 : (pt.value > 0.8 ? C.leaf400 : C.steel400);
    const dotR = isCrisis ? 5.5 : 3;
    const pulse = isCrisis ? 0.6 + 0.4 * Math.sin(tickT * 3.5) : 1;

    // crisis: draw larger ring
    if (isCrisis) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, dotR * 2.8 * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = C.plasm500 + "55";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, dotR * pulse, 0, Math.PI * 2);
    ctx.fillStyle = dotColor;
    ctx.shadowColor = dotColor;
    ctx.shadowBlur = isCrisis ? 18 : 6;
    ctx.fill();
    ctx.restore();

    // label — only for key points, avoid crowding
    const showLabel = isCrisis || pt.value >= 0.38;
    if (showLabel && pt.labelEn) {
      const lbl = lang === "zh" && pt.labelZh ? pt.labelZh : pt.labelEn;
      const above = pt.value > 0.6;
      ctx.save();
      ctx.font = `${isNarrow ? 6 : 7}px "JetBrains Mono", monospace`;
      ctx.fillStyle = isCrisis ? C.plasm400 : (above ? C.leaf400 : C.steel400);
      ctx.textAlign = "center";
      ctx.textBaseline = above ? "bottom" : "top";
      ctx.fillText(lbl, px, py + (above ? -dotR - 3 : dotR + 3));
      ctx.restore();
    }

    // year annotation for crisis points
    if (isCrisis) {
      ctx.save();
      ctx.font = `bold ${isNarrow ? 8 : 9}px "JetBrains Mono", monospace`;
      ctx.fillStyle = C.plasm400;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.shadowColor = C.plasm500;
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 0.8 + 0.2 * Math.sin(tickT * 2.8);
      ctx.fillText(String(pt.year), px, py + dotR + 10);
      ctx.restore();
    }
  });

  // crisis pulse overlay
  CURVE_POINTS.forEach((pt, i) => {
    if (!pt.crisis) return;
    const ptFrac = (pt.year - minYear) / (maxYear - minYear);
    if (ptFrac > displayFrac + 0.001) return;
    const [px, py] = coords[i];
    const pAlpha = 0.06 + 0.04 * Math.sin(tickT * 2.5);
    ctx.save();
    const rg = ctx.createRadialGradient(px, py, 0, px, py, 50);
    rg.addColorStop(0, `rgba(255,94,91,${pAlpha * 3})`);
    rg.addColorStop(1, "rgba(255,94,91,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(px, py, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // x-axis year labels
  ctx.save();
  ctx.fillStyle = C.ink500;
  ctx.font = `${isNarrow ? 6 : 7}px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  for (const yr of [1976, 1985, 1997, 2001, 2007, 2011]) {
    const isCrisisYr = yr === 1985 || yr === 1997;
    ctx.fillStyle = isCrisisYr ? C.plasm500 + "bb" : C.ink500;
    ctx.fillText(String(yr), toX(yr), h - 2);
  }
  ctx.restore();

  // y-axis label (rotated)
  ctx.save();
  ctx.save();
  ctx.translate(8, PAD_T + ch / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = `${isNarrow ? 5.5 : 6.5}px "JetBrains Mono", monospace`;
  ctx.fillStyle = C.steel500 + "77";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(lang === "zh" ? "影响力 / 地位" : "influence / standing", 0, 0);
  ctx.restore();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function ComebackArc() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => (lang === "zh" ? zh : en);

  /* ── state ─────────────────────────────────────────────────────────────── */
  const [activeAct, setActiveAct]     = useState(0);
  const [showCaveat, setShowCaveat]   = useState(false);

  /* ── refs ─────────────────────────────────────────────────────────────── */
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const tickRef     = useRef<number>(0);
  const progressRef = useRef<number>(0);
  const actRef      = useRef<number>(activeAct);
  const langRef     = useRef<"en" | "zh">(lang);

  useEffect(() => { actRef.current = activeAct; progressRef.current = 0; }, [activeAct]);
  useEffect(() => { langRef.current = lang; }, [lang]);

  /* ── animation loop ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    function tick(ts: number) {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      tickRef.current   += dt;
      progressRef.current = Math.min(progressRef.current + dt * 0.9, 1);

      const r = canvas!.getBoundingClientRect();
      drawArc(ctx!, r.width, r.height, actRef.current, progressRef.current, tickRef.current, langRef.current);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const act = ACTS[activeAct];
  const isFall   = act.phase === "fall";
  const isReturn = act.phase === "return";
  const isCrisis = isFall || isReturn;

  const goNext = useCallback(() => { setActiveAct(i => Math.min(i + 1, ACTS.length - 1)); }, []);
  const goPrev = useCallback(() => { setActiveAct(i => Math.max(i - 1, 0)); }, []);

  /* ── act color helper ────────────────────────────────────────────────────── */
  const actColor = act.color;
  const actBg    = act.colorBg;

  return (
    <div className="w-full space-y-6">

      {/* ── header ──────────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1" style={{ color: C.flux500 }}>
          {L("Theme 07 · The Arc — Fall & Return", "主题 07 · 弧线——坠落与回归")}
        </p>
        <h3 className={`display text-2xl md:text-3xl leading-tight mb-2 spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("The Wilderness Made Him", "荒野岁月铸造了他")}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-3 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "Three acts: a brilliant rise, a total fall, and a return more focused and more powerful than before. The arc is not a comeback story in the Hollywood sense — it is a study in what failure, without rescue, can do to a mind already capable of greatness.",
            "三幕剧：辉煌崛起、彻底坠落、以更专注更强大的姿态回归。这条弧线并非好莱坞意义上的复出故事——它是一份研究，关于失败（没有被任何人拯救的失败）能对一个本就具备伟大潜质的头脑做什么。"
          )}
        </p>
        <div className="rule-flux h-px rounded" />
      </div>

      {/* ── act navigator tabs ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {ACTS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setActiveAct(i)}
            className="px-3 py-1.5 rounded-lg font-mono text-[0.6rem] tracking-wide border transition-all duration-200"
            style={{
              borderColor: activeAct === i ? a.color : "rgba(194,198,212,0.10)",
              background:  activeAct === i ? a.colorBg : "transparent",
              color:       activeAct === i ? a.color : C.ink500,
              boxShadow:   activeAct === i ? `0 0 18px -5px ${a.color}66` : undefined,
            }}
          >
            <span className={lang === "zh" ? "zh" : ""}>
              {L(a.title.en, a.title.zh)}
            </span>
          </button>
        ))}
      </div>

      {/* ── canvas ──────────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-xl overflow-hidden border"
        style={{
          borderColor: isCrisis ? `${C.plasm500}44` : `${actColor}28`,
          boxShadow: isCrisis
            ? `0 0 72px -20px ${C.plasm500}55`
            : `0 0 56px -22px ${actColor}44`,
          background: C.void950,
        }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ aspectRatio: "21/9", minHeight: 180 }}
          aria-label={L(
            "Steve Jobs influence arc 1976–2011. Two crisis low points: 1985 ouster and 1997 near-bankruptcy.",
            "史蒂夫·乔布斯1976–2011年影响力弧线。两个危机低谷：1985年被驱逐，1997年苹果濒临破产。"
          )}
        />

        {/* act phase badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-md font-mono text-[0.62rem] font-bold backdrop-blur-sm"
          style={{
            background: actBg,
            color: actColor,
            border: `1px solid ${actColor}44`,
          }}
        >
          <span className={lang === "zh" ? "zh" : ""}>
            {L(act.subtitle.en, act.subtitle.zh)}
          </span>
        </div>

        {/* crisis pulse badge */}
        {isCrisis && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[0.62rem] backdrop-blur-sm"
            style={{
              background: "rgba(255,94,91,0.14)",
              color: C.plasm400,
              border: `1px solid ${C.plasm500}44`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full pulse" style={{ backgroundColor: C.plasm500 }} />
            <span className={lang === "zh" ? "zh" : ""}>
              {L("Crisis — Low Point", "危机——最低谷")}
            </span>
          </div>
        )}
      </div>

      {/* ── act detail card ──────────────────────────────────────────────────── */}
      <div
        key={act.id + lang}
        className="panel rounded-xl p-5 space-y-3 rise-in"
        style={{
          borderColor: `${actColor}28`,
          boxShadow: isCrisis ? `0 0 40px -14px ${C.plasm500}44` : undefined,
        }}
      >
        <div className="flex flex-wrap items-baseline gap-3">
          <h4 className={`display text-xl leading-tight ${lang === "zh" ? "zh" : ""}`} style={{ color: actColor }}>
            {L(act.title.en, act.title.zh)}
          </h4>
          <span
            className="font-mono text-[0.6rem] px-2 py-0.5 rounded border"
            style={{ borderColor: `${actColor}44`, color: actColor, background: actBg }}
          >
            {act.yearRange[0] === act.yearRange[1] ? act.yearRange[0] : `${act.yearRange[0]}–${act.yearRange[1]}`}
          </span>
          {isCrisis && (
            <span
              className="font-mono text-[0.6rem] px-2 py-0.5 rounded border"
              style={{ borderColor: `${C.plasm500}55`, color: C.plasm400, background: "rgba(255,94,91,0.08)" }}
            >
              {L("▼ Low Point", "▼ 最低谷")}
            </span>
          )}
        </div>
        <p
          className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(act.annotation.en, act.annotation.zh)}
        </p>
      </div>

      {/* ── step controls ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={goPrev}
          disabled={activeAct === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[0.68rem] border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: `${C.flux500}44`, color: C.flux400, background: `${C.flux500}0b` }}
        >
          {L("← Previous", "← 上一幕")}
        </button>

        {/* act dots */}
        <div className="flex items-center gap-2">
          {ACTS.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setActiveAct(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === activeAct ? a.color : "rgba(194,198,212,0.18)",
                transform:  i === activeAct ? "scale(1.6)" : "scale(1)",
                boxShadow:  i === activeAct ? `0 0 10px ${a.color}` : undefined,
              }}
              aria-label={a.title.en}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={activeAct === ACTS.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[0.68rem] border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: `${C.flux500}44`, color: C.flux400, background: `${C.flux500}0b` }}
        >
          {L("Next →", "下一幕 →")}
        </button>
      </div>

      {/* ── thesis cards ────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono" style={{ color: C.iris500 }}>
          {L("The Thesis — What the Arc Argues", "核心论点——这条弧线在诉说什么")}
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            {
              icon: "◆",
              color: C.flux400,
              title: { en: "The First Act Made the Mistake", zh: "第一幕埋下了错误" },
              body: {
                en: "The early Jobs was exceptional and corrosive in equal measure. He could see products others couldn't imagine, and he drove people past what they thought was possible — but with cruelty, not inspiration. The board's decision to remove him was not irrational.",
                zh: "早期的乔布斯杰出与腐蚀性并存。他能看到别人无法想象的产品，能将人逼到超出自我预期——但方式是残酷，而非激励。董事会将他驱逐的决定并非非理性。",
              },
            },
            {
              icon: "◈",
              color: C.iris400,
              title: { en: "The Wilderness Was the Education", zh: "荒野是一所学校" },
              body: {
                en: "NeXT taught him to manage without the Apple halo. Pixar forced partnership with John Lasseter — a creative equal he couldn't override. The decade of partial failure replaced arrogance with focus, and ego with taste. He learned, in failure, what he had missed in success.",
                zh: "NeXT教会了他在没有苹果光环的情况下管理公司。皮克斯迫使他与约翰·拉塞特——一个他无法凌驾的创意平等者——携手合作。这十年的局部失败，用专注代替了傲慢，用品味代替了自我。他在失败中学到了在成功里错过的东西。",
              },
            },
            {
              icon: "◉",
              color: C.leaf400,
              title: { en: "The Third Act Was Different", zh: "第三幕与第一幕截然不同" },
              body: {
                en: "The post-return Jobs built a smaller product line with deeper focus. He trusted Jony Ive, Tim Cook, Phil Schiller — people he would have earlier undermined. The Renaissance products are not first-act products with better technology. They are a different philosophy, formed in exile.",
                zh: "回归后的乔布斯打造了更精简的产品线，专注程度更深。他信任乔尼·艾夫、蒂姆·库克、菲尔·席勒——这些人在第一幕时他可能已经拆台了。文艺复兴时期的产品并非装备了更好技术的第一幕产品，而是一套在流亡中形成的不同哲学。",
              },
            },
          ].map(card => (
            <div
              key={card.title.en}
              className="panel rounded-xl p-4 space-y-2"
              style={{ borderColor: `${card.color}1e` }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: card.color, fontSize: "1.1rem" }}>{card.icon}</span>
                <p className={`display text-[0.82rem] ${lang === "zh" ? "zh" : ""}`} style={{ color: card.color }}>
                  {L(card.title.en, card.title.zh)}
                </p>
              </div>
              <p
                className={`text-[0.68rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {L(card.body.en, card.body.zh)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── two crisis low-points expanded ───────────────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono" style={{ color: C.plasm500 }}>
          {L("The Two Low Points — Anatomy of Crisis", "两个最低谷——危机解剖")}
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            {
              year: "1985",
              title: { en: "The Ouster", zh: "被驱逐" },
              color: C.plasm500,
              body: {
                en: "Jobs had invited John Sculley from PepsiCo in 1983 — the famous pitch: \"Do you want to sell sugared water for the rest of your life, or come with me and change the world?\" By 1985, the relationship had collapsed. The Macintosh was underperforming, and Jobs was attempting to sideline Sculley. The board sided with the CEO. Jobs lost, resigned, and walked out of One Infinite Loop with five employees and a profound humiliation. He was 30. Source: Isaacson, Steve Jobs (2011), ch. 12–13.",
                zh: "1983年，乔布斯邀请约翰·斯卡利从百事可乐加盟——那句著名的游说：「你是想卖一辈子糖水，还是跟我一起改变世界？」到1985年，关系已彻底破裂。麦金塔表现不佳，而乔布斯正试图架空斯卡利。董事会站到了CEO一边。乔布斯输了，辞职了，带着五名员工和彻底的羞辱走出了苹果总部。那年他30岁。来源：艾萨克森《史蒂夫·乔布斯传》（2011年），第12–13章。",
              },
            },
            {
              year: "1997",
              title: { en: "90 Days from Bankruptcy", zh: "距破产90天" },
              color: C.gold500,
              body: {
                en: "Apple under Gil Amelio was burning $1M a day and had roughly 90 days of cash left when Jobs returned. The product line was a mess: 15+ Macintosh models, too many printers, no clear vision. Jobs's first move was not to launch a product but to kill 70% of them. The $150M Microsoft investment — publicly received with shock — bought time and signaled that Apple was not going under. The real rescue was focus, not cash. Source: Isaacson, Steve Jobs (2011), ch. 22–23; Ken Segall, Insanely Simple (2012).",
                zh: "乔布斯回归时，吉尔·阿梅利奥领导下的苹果每天烧掉100万美元，现金大约只够撑90天。产品线一团糟：15款以上的麦金塔型号、太多打印机、没有清晰方向。乔布斯的第一步不是发布新产品，而是砍掉其中70%。微软1.5亿美元投资——公开引发震惊——争取了时间，并释放了苹果不会倒闭的信号。真正的救援是专注，而非现金。来源：艾萨克森《史蒂夫·乔布斯传》（2011年），第22–23章；肯·西格尔《疯狂简洁》（2012年）。",
              },
            },
          ].map(card => (
            <div
              key={card.year}
              className="panel rounded-xl p-4 space-y-2"
              style={{
                borderColor: `${card.color}33`,
                boxShadow:   `0 0 32px -14px ${card.color}33`,
              }}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono text-[0.62rem] px-2 py-0.5 rounded border"
                  style={{ color: card.color, borderColor: `${card.color}55`, background: `${card.color}0f` }}
                >
                  {card.year}
                </span>
                <h5 className={`display text-base ${lang === "zh" ? "zh" : ""}`} style={{ color: card.color }}>
                  {L(card.title.en, card.title.zh)}
                </h5>
              </div>
              <p
                className={`text-[0.68rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {L(card.body.en, card.body.zh)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── survivorship caveat — prominent ─────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: `${C.plasm500}44`, background: "rgba(255,94,91,0.04)" }}
      >
        <button
          onClick={() => setShowCaveat(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-red-500/5"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg" style={{ color: C.plasm500 }}>⚠</span>
            <div>
              <p className="label-mono" style={{ color: C.plasm500 }}>
                {L("Survivorship Bias — The Essential Caveat", "幸存者偏差——最重要的警示")}
              </p>
              <p className={`text-[0.65rem] font-mono mt-0.5 ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink500 }}>
                {L(
                  "Most people fired from their own company do not return as the CEO. Tap to read.",
                  "大多数被自己公司驱逐的人，不会回来成为CEO。点击阅读。"
                )}
              </p>
            </div>
          </div>
          <span className="font-mono text-sm" style={{ color: C.plasm400 }}>
            {showCaveat ? "↑" : "↓"}
          </span>
        </button>

        {showCaveat && (
          <div className="px-5 pb-5 space-y-4 rise-in">
            <div className="h-px" style={{ background: `${C.plasm500}30` }} />
            <p
              className={`text-[0.74rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
            >
              {L(
                "The arc described here is remarkable precisely because it is almost unique. The pattern — ousted founder returns eleven years later to rescue and transform a dying company into the most valuable on earth — has essentially one example at this scale. The narrative is seductive: failure makes you wiser, exile clarifies your vision, the wilderness is secretly preparation. This is easier to believe in retrospect than to live prospectively. For every Jobs, there are thousands of founders fired from their companies who did not come back, did not transform, and whose wilderness remained wilderness.",
                "这里描述的弧线之所以非凡，恰恰因为它几乎独一无二。这一模式——被驱逐的创始人十一年后回归，拯救并改造一家濒死的公司，使其成为全球市值之王——在这个量级上基本只有一个例子。这个叙事极具诱惑力：失败让人更睿智，流亡净化了眼界，荒野其实是秘密的准备。事后回望，这比前瞻性地身处其中要容易相信得多。每一个乔布斯的背后，有数千名被公司驱逐的创始人，他们没有回来，没有蜕变，他们的荒野就是荒野。"
              )}
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                {
                  title: { en: "What the Arc Cannot Tell You", zh: "这条弧线无法告诉你的" },
                  color: C.plasm500,
                  points: [
                    { en: "The base rate: how often fired founders return to build something greater.", zh: "基础概率：被驱逐的创始人有多少能回来建造更伟大的事物。" },
                    { en: "Whether NeXT would have found success without the Apple acquisition.", zh: "如果没有苹果收购，NeXT是否会成功。" },
                    { en: "Whether the wilderness 'made' him, or whether he would have built something comparable from scratch.", zh: "是荒野\"铸造\"了他，还是他无论如何都能重新建造同等级别的东西。" },
                    { en: "What the same decisions would look like if Apple had simply found another operating system.", zh: "如果苹果找到了另一套操作系统，同样的决策会呈现什么面貌。" },
                  ],
                },
                {
                  title: { en: "What the Arc Genuinely Demonstrates", zh: "这条弧线真正揭示的" },
                  color: C.leaf400,
                  points: [
                    { en: "The NeXT software (NeXTSTEP) became OS X — the wilderness had material consequences.", zh: "NeXT的软件（NeXTSTEP）成为了OS X——荒野岁月具有实质性的后续意义。" },
                    { en: "Pixar taught Jobs a different model of creative collaboration, visible in how he ran Apple post-1997.", zh: "皮克斯给乔布斯上了一堂不同的创意协作课，清晰可见于他1997年后运营苹果的方式。" },
                    { en: "The post-wilderness Jobs made different decisions on product focus, which drove different outcomes.", zh: "荒野后的乔布斯在产品专注度上做出了不同的决策，由此产生了不同的结果。" },
                    { en: "The arc is real as biography. It is dangerous as a template.", zh: "作为传记，这条弧线是真实的。作为模板，它是危险的。" },
                  ],
                },
              ].map(panel => (
                <div
                  key={panel.title.en}
                  className="rounded-lg p-3 space-y-2"
                  style={{ background: `${panel.color}0d`, border: `1px solid ${panel.color}22` }}
                >
                  <p className={`font-mono text-[0.65rem] font-bold ${lang === "zh" ? "zh" : ""}`} style={{ color: panel.color }}>
                    {L(panel.title.en, panel.title.zh)}
                  </p>
                  {panel.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: panel.color }} />
                      <p className={`text-[0.67rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink300 }}>
                        {L(pt.en, pt.zh)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p
              className={`text-[0.66rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
            >
              {L(
                "Sources: Walter Isaacson, Steve Jobs (2011) — the primary biographical source. Brent Schlender & Rick Tetzeli, Becoming Steve Jobs (2015) — a revisionist account that emphasizes growth over the wilderness years. Ken Segall, Insanely Simple (2012) — on the post-return product philosophy. Framing and thesis are original editorial judgments.",
                "来源：沃尔特·艾萨克森《史蒂夫·乔布斯传》（2011年）——主要传记来源。布伦特·施伦德与里克·特策利《成为史蒂夫·乔布斯》（2015年）——强调荒野岁月成长的修正主义叙述。肯·西格尔《疯狂简洁》（2012年）——关于回归后的产品哲学。框架与论点均为原创编辑判断。"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
