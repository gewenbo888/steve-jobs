"use client";

import { useRef, useEffect, useState } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   IntersectionViz
   Theme 01 — Art × Technology

   Centerpiece: a crossroads where Liberal Arts Avenue meets Technology
   Boulevard. Six formative influences feed into the intersection as
   INPUT nodes. Clicking a node surfaces a bilingual card showing what
   that input contributed to specific product traits.

   A FAIR panel keeps the skeptical read visible alongside the sincere
   one: the "intersection" was also a masterclass in brand storytelling.

   Sources paraphrased from Isaacson, Walter. Steve Jobs. Simon &
   Schuster, 2011.
═══════════════════════════════════════════════════════════════════════════ */

/* ── palette (raw hex for canvas / SVG) ─────────────────────────────────── */
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

/* ── deterministic pseudo-random (grain / sparkle) ──────────────────────── */
function seeded(seed: number, salt: number = 0): number {
  const x = Math.sin(seed * 9301 + salt * 49297 + 233720) * 43758.5453;
  return x - Math.floor(x);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

/** One formative influence */
interface Node {
  id: string;
  /** which avenue this input flows from */
  lane: "arts" | "tech";
  icon: string;           // single unicode glyph
  label: { en: string; zh: string };
  period: { en: string; zh: string };
  /** what it injected into Jobs's thinking */
  input: { en: string; zh: string };
  /** the downstream product trait(s) */
  output: { en: string; zh: string };
  /** name to attribute / cite */
  attribution: { en: string; zh: string };
}

const NODES: Node[] = [
  {
    id: "calligraphy",
    lane: "arts",
    icon: "✦",
    label: { en: "Reed College Calligraphy", zh: "里德学院书法课" },
    period: { en: "1972–1974", zh: "1972–1974" },
    input: {
      en: "A dropped-out Jobs audited a calligraphy class and absorbed the idea that letterforms carry aesthetic weight — that every serif, every em-dash, every proportional relationship matters.",
      zh: "退学后的乔布斯旁听了一门书法课，领悟到字形承载美学分量——每一个衬线、每一个破折号、每一种比例关系都至关重要。",
    },
    output: {
      en: "The Mac shipped in 1984 with proportionally spaced fonts and multiple typefaces — the first consumer computer to treat typography as a first-class design element. Every font on every iPhone descends from this calligraphy class.",
      zh: "1984年发布的麦金塔搭载了比例间距字体和多种字体——这是第一台将排版视为头等设计元素的消费电脑。每一台iPhone上的每一种字体，都源自这门书法课。",
    },
    attribution: {
      en: "Paraphrased from Isaacson, Steve Jobs, ch. 3 — Reed College.",
      zh: "意译自艾萨克森《史蒂夫·乔布斯传》第3章——里德学院。",
    },
  },
  {
    id: "bauhaus",
    lane: "arts",
    icon: "◉",
    label: { en: "Bauhaus & Braun Design", zh: "包豪斯与博朗设计" },
    period: { en: "1970s–1980s", zh: "1970年代–1980年代" },
    input: {
      en: "Jobs was captivated by Dieter Rams's work for Braun: the white plastic surfaces, the recessed screws, the philosophy that form should follow function with no ornament for its own sake. He reportedly carried Braun products to Apple design reviews.",
      zh: "乔布斯对迪特·拉姆斯为博朗所做的设计深深着迷：白色塑料表面、内嵌螺丝、形式追随功能的哲学——无无意义的装饰。据报道，他会将博朗产品带到苹果设计评审会。",
    },
    output: {
      en: "The Snow White industrial language of early Macs; the iPod's white polycarbonate and scroll-wheel purity; the iPhone's recessed steel band. 'Good design is as little design as possible' — Rams's Tenth Principle — became Apple's operating doctrine.",
      zh: "早期麦金塔的\"白雪\"工业设计语言；iPod白色聚碳酸酯与滚轮的纯净；iPhone内嵌不锈钢边框。拉姆斯设计十原则中的\"好设计是尽可能少的设计\"，成为苹果的运营信条。",
    },
    attribution: {
      en: "Paraphrased from Isaacson, Steve Jobs, ch. 12 & 24 — Design philosophy.",
      zh: "意译自艾萨克森《史蒂夫·乔布斯传》第12、24章——设计哲学。",
    },
  },
  {
    id: "dylan",
    lane: "arts",
    icon: "♩",
    label: { en: "Bob Dylan & the Counterculture", zh: "鲍勃·迪伦与反文化" },
    period: { en: "Late 1960s–1970s", zh: "1960年代末–1970年代" },
    input: {
      en: "Jobs was a devotee of Dylan's willingness to reinvent himself, to court controversy, and to use art as a tool against the established order. He memorised entire albums. He also absorbed the counterculture's distrust of institutions — the idea that the individual, armed with the right tools, could challenge IBM or Bell.",
      zh: "乔布斯深受迪伦影响，迪伦愿意不断自我革新、寻求争议、用艺术对抗既有秩序。乔布斯能背出完整专辑。他也吸收了反文化对机构的不信任——个人手持合适工具便可挑战IBM或贝尔。",
    },
    output: {
      en: "The 'Think Different' campaign, the '1984' Super Bowl ad. The Macintosh was positioned not as a machine but as an instrument of liberation — the rebel against the grey conformity of IBM. Dylan's voice was the brand's unconscious register.",
      zh: "\"非同凡想\"广告活动、\"1984\"超级碗广告。麦金塔被定位不只是一台机器，而是解放的工具——对抗IBM灰色从众的反叛者。迪伦的声音是品牌潜意识的音调。",
    },
    attribution: {
      en: "Paraphrased from Isaacson, Steve Jobs, ch. 2 — The countercultural roots.",
      zh: "意译自艾萨克森《史蒂夫·乔布斯传》第2章——反文化根源。",
    },
  },
  {
    id: "zen",
    lane: "arts",
    icon: "◌",
    label: { en: "Zen Buddhism", zh: "禅宗佛教" },
    period: { en: "1974–onwards", zh: "1974年起" },
    input: {
      en: "After a seven-month trip to India and sustained study with Zen master Kobun Chino, Jobs internalised wabi-sabi — the beauty of impermanence, of restraint, of negative space. Zen trained him to believe that what you leave out is as important as what you include.",
      zh: "在七个月的印度之行和跟随禅师乙川弘文的持续修行之后，乔布斯内化了侘寂——无常之美、克制之美、留白之美。禅宗训练他相信省略之物与包含之物同等重要。",
    },
    output: {
      en: "The removal of the floppy drive from the iMac. One button on the iPhone. No stylus. The recessed power button you cannot see. The decision to not put a second mouse button — ever. Negative space as product strategy.",
      zh: "从iMac中去掉软盘驱动器。iPhone上只有一个按键。没有触控笔。看不到的内嵌电源键。永远不加第二个鼠标键的决定。留白作为产品战略。",
    },
    attribution: {
      en: "Paraphrased from Isaacson, Steve Jobs, ch. 4 — Zen and the art of design.",
      zh: "意译自艾萨克森《史蒂夫·乔布斯传》第4章——禅与设计艺术。",
    },
  },
  {
    id: "land",
    lane: "tech",
    icon: "⊡",
    label: { en: "Polaroid's Edwin Land", zh: "宝丽来的埃德温·兰德" },
    period: { en: "1970s–1980s", zh: "1970年代–1980年代" },
    input: {
      en: "Jobs idolised Land — physicist, inventor, humanist — as the working model of what a technology company could be. Land's instant photography collapsed the boundary between chemistry and art. He once said: 'The only thing that separates us from the chimpanzees is our technology and the liberal arts.' Jobs quoted him from memory.",
      zh: "乔布斯崇拜兰德——物理学家、发明家、人文主义者——视其为科技公司可以成为什么的活样本。兰德的即时摄影消弭了化学与艺术之间的边界。他曾说：\"将我们与黑猩猩区分开的，只有技术和人文。\"乔布斯能背出他的话。",
    },
    output: {
      en: "Jobs adopted Land's self-conception: that Apple existed at the intersection of the humanities and the sciences. The framing of product launches — 'the most personal device we've ever made' — owed its emotional vocabulary to Land's style of announcement.",
      zh: "乔布斯接受了兰德的自我定位：苹果存在于人文与科学的交汇处。产品发布的框架——\"我们所做过的最个人化的设备\"——其情感词汇来自兰德的发布风格。",
    },
    attribution: {
      en: "Paraphrased from Isaacson, Steve Jobs, ch. 12 — The company as Land's heir.",
      zh: "意译自艾萨克森《史蒂夫·乔布斯传》第12章——作为兰德继承者的公司。",
    },
  },
  {
    id: "wholeearthl",
    lane: "tech",
    icon: "⊕",
    label: { en: "Whole Earth Catalog", zh: "《全球概览》" },
    period: { en: "Late 1960s–early 1970s", zh: "1960年代末–1970年代初" },
    input: {
      en: "Stewart Brand's catalog was, in Jobs's telling, like Google in paper form — a DIY compendium of tools and ideas for people who wanted to build things. Its final issue signed off: 'Stay hungry. Stay foolish.' The Catalog treated the reader as capable of doing anything if given the right tools.",
      zh: "斯图尔特·布兰德的目录在乔布斯看来是纸质版谷歌——为想要动手创造的人提供的工具与想法DIY大全。最后一期的结语是：\"求知若渴，虚心若愚。\"这本目录将读者视为只要有了合适工具便无所不能的人。",
    },
    output: {
      en: "The belief that the personal computer was a 'bicycle for the mind' — not a tool for specialists but a tool of empowerment for everyone. Jobs quoted 'Stay hungry, stay foolish' in his 2005 Stanford commencement speech. The democratised power-tool ethos shaped the Mac, the iPod, and the App Store.",
      zh: "相信个人电脑是\"思维的自行车\"——不是专家的工具，而是赋予所有人力量的工具。乔布斯在2005年斯坦福毕业典礼上引用了\"求知若渴，虚心若愚\"。这种民主化强力工具的精神塑造了Mac、iPod和App Store。",
    },
    attribution: {
      en: "Paraphrased from Isaacson, Steve Jobs, ch. 2 & Jobs's 2005 Stanford address.",
      zh: "意译自艾萨克森《史蒂夫·乔布斯传》第2章及乔布斯2005年斯坦福演讲。",
    },
  },
];

/* ── Product traits that emerge from the intersection ──────────────────── */
interface Trait {
  id: string;
  label: { en: string; zh: string };
  sources: string[]; // node ids
  color: string;
}
const TRAITS: Trait[] = [
  {
    id: "typography",
    label: { en: "World-class typography", zh: "世界级排版" },
    sources: ["calligraphy"],
    color: C.iris400,
  },
  {
    id: "simplicity",
    label: { en: "Radical simplicity", zh: "极致简约" },
    sources: ["bauhaus", "zen"],
    color: C.flux400,
  },
  {
    id: "rebel",
    label: { en: "Rebel brand identity", zh: "反叛品牌身份" },
    sources: ["dylan", "wholeearthl"],
    color: C.leaf400,
  },
  {
    id: "artsci",
    label: { en: "Art-meets-science framing", zh: "艺术遇见科学框架" },
    sources: ["land"],
    color: C.gold400,
  },
  {
    id: "empowerment",
    label: { en: "Technology as empowerment", zh: "科技作为赋能" },
    sources: ["wholeearthl", "dylan"],
    color: C.plasm400,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CROSSROADS SVG CANVAS
   Drawn as an animated SVG — two perpendicular avenues with street-sign
   labels. Node icons orbit the intersection at fixed angular positions.
   Animated dashes flow from each node toward the center.
═══════════════════════════════════════════════════════════════════════════ */

/* Node angular positions — arts side: left; tech side: right */
const NODE_POSITIONS: Record<string, { angle: number; r: number }> = {
  calligraphy:  { angle: 195, r: 0.76 },
  bauhaus:      { angle: 240, r: 0.76 },
  dylan:        { angle: 270, r: 0.82 },
  zen:          { angle: 165, r: 0.80 },
  land:         { angle: 330, r: 0.80 },
  wholeearthl:  { angle: 15,  r: 0.80 },
};

function deg(a: number) { return (a * Math.PI) / 180; }

interface CrossroadsProps {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  lang: "en" | "zh";
}

function Crossroads({ selectedId, hoveredId, onSelect, onHover, lang }: CrossroadsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    function frame(ts: number) {
      if (cancelled) return;
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      tRef.current += dt;
      setTick((v) => v + 1);
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const t = tRef.current;

  // SVG viewport
  const W = 520;
  const H = 420;
  const cx = W * 0.5;
  const cy = H * 0.5;
  const R = Math.min(W, H) * 0.38;

  // Road geometry
  const roadW = 52;
  const halfW = roadW / 2;

  // Round computed coords so SSR (Node) and client (Chromium) agree to the bit —
  // Math.sin/cos can differ in the last ULP across engines and break hydration.
  const R2 = (n: number) => Math.round(n * 100) / 100;

  // Compute node screen coords
  function nodeXY(id: string) {
    const pos = NODE_POSITIONS[id];
    if (!pos) return { x: cx, y: cy };
    const a = deg(pos.angle);
    return {
      x: R2(cx + Math.cos(a) * R * pos.r),
      y: R2(cy + Math.sin(a) * R * pos.r),
    };
  }

  // Flow dot progress along road to center
  function flowDot(id: string, phase: number) {
    const { x: nx, y: ny } = nodeXY(id);
    const frac = ((t * 0.35 + phase) % 1);
    return {
      x: R2(nx + (cx - nx) * frac),
      y: R2(ny + (cy - ny) * frac),
      alpha: Math.sin(frac * Math.PI),
    };
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ display: "block", maxHeight: 420 }}
      aria-label={lang === "zh" ? "艺术×技术十字路口图" : "Art × Technology crossroads"}
    >
      <defs>
        {/* Road glow filters */}
        <filter id="roadglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="neon" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Radial gradient for junction glow */}
        <radialGradient id="junctionGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2997ff" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#a663cc" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0a0a0b" stopOpacity="0" />
        </radialGradient>

        {/* Horizontal road (tech) gradient */}
        <linearGradient id="techRoad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2997ff" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#2997ff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#2997ff" stopOpacity="0.06" />
        </linearGradient>

        {/* Vertical road (arts) gradient */}
        <linearGradient id="artsRoad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a663cc" stopOpacity="0.06" />
          <stop offset="50%" stopColor="#a663cc" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#a663cc" stopOpacity="0.06" />
        </linearGradient>

        {/* Clip path for roads */}
        <clipPath id="roadClip">
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>

      {/* ── background ──────────────────────────────────────────────────── */}
      <rect x="0" y="0" width={W} height={H} fill={C.void950} />

      {/* grain dots — deterministic */}
      {Array.from({ length: 28 }, (_, i) => (
        <circle
          key={`grain-${i}`}
          cx={R2(seeded(i, 0) * W)}
          cy={R2(seeded(i, 1) * H)}
          r={R2(0.7 + seeded(i, 2) * 0.8)}
          fill={`rgba(161,161,166,${(0.02 + seeded(i, 3) * 0.05).toFixed(3)})`}
        />
      ))}

      {/* ── road surfaces ────────────────────────────────────────────────── */}
      {/* Horizontal — Technology Avenue */}
      <rect
        x="0"
        y={cy - halfW}
        width={W}
        height={roadW}
        fill="url(#techRoad)"
      />
      {/* Horizontal road edges */}
      <line x1="0" y1={cy - halfW} x2={W} y2={cy - halfW}
        stroke={C.flux500} strokeWidth="0.8" strokeOpacity="0.35" />
      <line x1="0" y1={cy + halfW} x2={W} y2={cy + halfW}
        stroke={C.flux500} strokeWidth="0.8" strokeOpacity="0.35" />
      {/* Horizontal center dash */}
      <line x1="0" y1={cy} x2={cx - halfW} y2={cy}
        stroke={C.flux400} strokeWidth="0.6" strokeOpacity="0.22"
        strokeDasharray="8 10"
        style={{ strokeDashoffset: `-${(t * 28) % 1000}` }}
      />
      <line x1={cx + halfW} y1={cy} x2={W} y2={cy}
        stroke={C.flux400} strokeWidth="0.6" strokeOpacity="0.22"
        strokeDasharray="8 10"
        style={{ strokeDashoffset: `-${(t * 28) % 1000}` }}
      />

      {/* Vertical — Liberal Arts Avenue */}
      <rect
        x={cx - halfW}
        y="0"
        width={roadW}
        height={H}
        fill="url(#artsRoad)"
      />
      <line x1={cx - halfW} y1="0" x2={cx - halfW} y2={H}
        stroke={C.iris500} strokeWidth="0.8" strokeOpacity="0.35" />
      <line x1={cx + halfW} y1="0" x2={cx + halfW} y2={H}
        stroke={C.iris500} strokeWidth="0.8" strokeOpacity="0.35" />
      {/* Vertical center dash */}
      <line x1={cx} y1="0" x2={cx} y2={cy - halfW}
        stroke={C.iris400} strokeWidth="0.6" strokeOpacity="0.22"
        strokeDasharray="8 10"
        style={{ strokeDashoffset: `-${(t * 28) % 1000}` }}
      />
      <line x1={cx} y1={cy + halfW} x2={cx} y2={H}
        stroke={C.iris400} strokeWidth="0.6" strokeOpacity="0.22"
        strokeDasharray="8 10"
        style={{ strokeDashoffset: `-${(t * 28) % 1000}` }}
      />

      {/* ── street signs ────────────────────────────────────────────────── */}
      {/* Technology Avenue sign — left */}
      <g transform={`translate(${32}, ${cy - 1})`}>
        <rect x="-2" y="-10" width={lang === "zh" ? 82 : 118} height="20"
          rx="3" fill={C.void800}
          stroke={C.flux500} strokeWidth="0.8" strokeOpacity="0.55" />
        <text x={lang === "zh" ? 39 : 57} y="4.5" textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace" fontSize="7.5"
          letterSpacing="1.8" fill={C.flux400} fillOpacity="0.9">
          {lang === "zh" ? "技术大道" : "TECHNOLOGY AVE"}
        </text>
      </g>

      {/* Liberal Arts Avenue sign — bottom */}
      <g transform={`translate(${cx}, ${H - 28}) rotate(90)`}>
        <rect x="-2" y="-10" width={lang === "zh" ? 90 : 128} height="20"
          rx="3" fill={C.void800}
          stroke={C.iris500} strokeWidth="0.8" strokeOpacity="0.55" />
        <text x={lang === "zh" ? 43 : 62} y="4.5" textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace" fontSize="7.5"
          letterSpacing="1.8" fill={C.iris400} fillOpacity="0.9">
          {lang === "zh" ? "人文艺术大道" : "LIBERAL ARTS AVE"}
        </text>
      </g>

      {/* ── junction glow ───────────────────────────────────────────────── */}
      <ellipse cx={cx} cy={cy}
        rx={R2(roadW * 2.8 + Math.sin(t * 0.6) * 4)}
        ry={R2(roadW * 2.8 + Math.cos(t * 0.6) * 4)}
        fill="url(#junctionGlow)"
      />
      {/* Junction box */}
      <rect
        x={cx - halfW} y={cy - halfW}
        width={roadW} height={roadW}
        fill={C.void700}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
      />

      {/* ── flow lines from each node ────────────────────────────────────── */}
      {NODES.map((node) => {
        const { x: nx, y: ny } = nodeXY(node.id);
        const isActive = selectedId === node.id || hoveredId === node.id;
        const lineColor = node.lane === "arts" ? C.iris400 : C.flux400;
        return (
          <line
            key={`flow-${node.id}`}
            x1={nx} y1={ny} x2={cx} y2={cy}
            stroke={isActive ? lineColor : lineColor + "28"}
            strokeWidth={isActive ? 1.2 : 0.6}
            strokeDasharray="4 7"
            style={{ strokeDashoffset: `-${(t * 22) % 100}` }}
          />
        );
      })}

      {/* ── flow dots (animated particles) ──────────────────────────────── */}
      {NODES.map((node, ni) => {
        const isSelected = selectedId === node.id;
        const dotColor = node.lane === "arts" ? C.iris400 : C.flux400;
        return Array.from({ length: 2 }, (_, di) => {
          const dot = flowDot(node.id, (ni * 0.167 + di * 0.5));
          if (dot.alpha < 0.05) return null;
          return (
            <circle
              key={`dot-${node.id}-${di}`}
              cx={dot.x} cy={dot.y} r={isSelected ? 2.2 : 1.4}
              fill={dotColor}
              fillOpacity={R2(dot.alpha * (isSelected ? 0.95 : 0.55))}
            />
          );
        });
      })}

      {/* ── center intersection — Jobs icon ─────────────────────────────── */}
      {/* Outer halo */}
      <circle cx={cx} cy={cy}
        r={R2(19 + Math.sin(t * 0.9) * 1.5)}
        fill="none"
        stroke={C.gold400}
        strokeWidth="0.8"
        strokeOpacity={R2(0.35 + Math.sin(t * 1.1) * 0.1)}
        strokeDasharray="3 5"
      />
      {/* Inner glow */}
      <circle cx={cx} cy={cy} r="13" fill={C.gold500} fillOpacity="0.12"
        filter="url(#neon)" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="8" fill={C.void800}
        stroke={C.gold400} strokeWidth="1.2" strokeOpacity="0.75" />
      {/* SJ label */}
      <text x={cx} y={cy + 3.5} textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace" fontSize="7"
        fontWeight="700" fill={C.gold400} fillOpacity="0.9">
        SJ
      </text>

      {/* ── node circles ────────────────────────────────────────────────── */}
      {NODES.map((node, ni) => {
        const { x: nx, y: ny } = nodeXY(node.id);
        const isSelected = selectedId === node.id;
        const isHovered = hoveredId === node.id;
        const active = isSelected || isHovered;
        const dotColor = node.lane === "arts" ? C.iris500 : C.flux500;
        const dotLight = node.lane === "arts" ? C.iris400 : C.flux400;
        const pulse = R2(0.85 + 0.15 * Math.sin(t * 1.2 + ni * 1.1));
        const r = active ? 18 : 14;

        return (
          <g
            key={`node-${node.id}`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(node.id)}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            role="button"
            tabIndex={0}
            aria-label={node.label[lang]}
            onKeyDown={(e) => e.key === "Enter" && onSelect(node.id)}
          >
            {/* glow ring */}
            {active && (
              <circle cx={nx} cy={ny} r={R2(r * 1.7 * pulse)}
                fill={dotColor} fillOpacity="0.10" />
            )}
            {/* ring */}
            <circle cx={nx} cy={ny} r={r}
              fill={active ? dotColor + "22" : C.void800}
              stroke={active ? dotLight : dotColor + "55"}
              strokeWidth={active ? 1.4 : 0.8}
            />
            {/* icon */}
            <text x={nx} y={ny + 4} textAnchor="middle"
              fontSize={active ? "12" : "10"}
              fill={active ? dotLight : dotColor + "aa"}
            >
              {node.icon}
            </text>
          </g>
        );
      })}

      {/* ── node labels ─────────────────────────────────────────────────── */}
      {NODES.map((node) => {
        const { x: nx, y: ny } = nodeXY(node.id);
        const isSelected = selectedId === node.id;
        const isHovered = hoveredId === node.id;
        const active = isSelected || isHovered;
        const textColor = node.lane === "arts" ? C.iris400 : C.flux400;

        // Position label away from center
        const a = deg(NODE_POSITIONS[node.id].angle);
        const labelR = 28;
        const lx = R2(nx + Math.cos(a) * labelR);
        const ly = R2(ny + Math.sin(a) * labelR);
        const anchor = lx < cx - 10 ? "end" : lx > cx + 10 ? "start" : "middle";

        const text = lang === "zh" ? node.label.zh : node.label.en;
        // Wrap at space for EN
        const parts = text.split(" ");
        const lines: string[] = [];
        if (lang === "zh") {
          // Split Chinese into two segments if long
          if (text.length > 6) {
            lines.push(text.slice(0, Math.ceil(text.length / 2)));
            lines.push(text.slice(Math.ceil(text.length / 2)));
          } else {
            lines.push(text);
          }
        } else {
          // max 2 words per line
          for (let i = 0; i < parts.length; i += 2) {
            lines.push(parts.slice(i, i + 2).join(" "));
          }
        }

        return (
          <g key={`label-${node.id}`}
            style={{ cursor: "pointer", pointerEvents: "none" }}>
            {lines.map((line, li) => (
              <text
                key={li}
                x={lx}
                y={ly + li * 9.5 - ((lines.length - 1) * 9.5) / 2}
                textAnchor={anchor}
                fontFamily={lang === "zh" ? "'Noto Serif SC', serif" : "'JetBrains Mono', monospace"}
                fontSize={lang === "zh" ? "7" : "6.5"}
                fontWeight={active ? "600" : "400"}
                fill={active ? textColor : textColor + "77"}
                letterSpacing="0.3"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INFLUENCE CARD
   Appears when a node is selected.
═══════════════════════════════════════════════════════════════════════════ */
function InfluenceCard({ node, lang }: { node: Node; lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  const isArts = node.lane === "arts";
  const accent = isArts ? C.iris400 : C.flux400;
  const accentDim = isArts ? C.iris500 : C.flux500;

  return (
    <div
      className="panel rounded-2xl overflow-hidden rise-in"
      style={{
        borderColor: accent + "30",
        boxShadow: `0 0 48px -20px ${accent}44`,
      }}
    >
      {/* card header */}
      <div
        className="px-5 py-4 flex items-start gap-3"
        style={{ borderBottom: `1px solid ${accent}15` }}
      >
        <span
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: accentDim + "18",
            border: `1px solid ${accent}30`,
            color: accent,
          }}
        >
          {node.icon}
        </span>
        <div className="min-w-0">
          <div
            className="label-mono mb-0.5"
            style={{ color: accent + "99" }}
          >
            {isArts ? L("Liberal Arts Input", "人文艺术输入") : L("Technology Input", "技术输入")}
            {" · "}
            {node.period[lang]}
          </div>
          <h4
            className={`display text-lg leading-snug ${lang === "zh" ? "zh" : ""}`}
            style={{ color: accent }}
          >
            {node.label[lang]}
          </h4>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Formative input */}
        <div>
          <p className="label-mono mb-2" style={{ color: C.steel400 }}>
            {L("What Jobs absorbed", "乔布斯吸收了什么")}
          </p>
          <p
            className={`text-[0.74rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{
              color: C.ink50,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {node.input[lang]}
          </p>
        </div>

        {/* Arrow flow indicator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}00, ${accent}60)` }} />
          <span style={{ color: accent + "80", fontSize: "0.75rem" }}>→</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}60, ${accent}00)` }} />
        </div>

        {/* Product output */}
        <div>
          <p className="label-mono mb-2" style={{ color: accent + "99" }}>
            {L("What it produced", "它产生了什么")}
          </p>
          <p
            className={`text-[0.74rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{
              color: C.ink50,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {node.output[lang]}
          </p>
        </div>

        {/* Attribution */}
        <div
          className="rounded-lg px-3 py-2"
          style={{ background: C.void700, border: `1px solid ${accent}12` }}
        >
          <p className="text-[0.62rem] font-mono" style={{ color: C.steel500 }}>
            {node.attribution[lang]}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRAIT PILLS
   Show which inputs feed which output traits.
═══════════════════════════════════════════════════════════════════════════ */
function TraitPills({
  selectedId,
  lang,
}: {
  selectedId: string | null;
  lang: "en" | "zh";
}) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  return (
    <div>
      <p className="label-mono mb-3" style={{ color: C.steel500 }}>
        {L("Intersection Outputs", "交汇产物")}
      </p>
      <div className="flex flex-wrap gap-2">
        {TRAITS.map((trait) => {
          const isActive = selectedId ? trait.sources.includes(selectedId) : false;
          return (
            <div
              key={trait.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300"
              style={{
                background: isActive ? trait.color + "18" : C.void800,
                border: `1px solid ${isActive ? trait.color + "55" : "rgba(255,255,255,0.06)"}`,
                boxShadow: isActive ? `0 0 14px -6px ${trait.color}55` : "none",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: isActive ? trait.color : C.steel500 + "44" }}
              />
              <span
                className={`text-[0.66rem] font-mono ${lang === "zh" ? "zh" : ""}`}
                style={{ color: isActive ? trait.color : C.ink500 }}
              >
                {trait.label[lang]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAIR PANEL — The skeptical read
═══════════════════════════════════════════════════════════════════════════ */
function FairPanel({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  const [open, setOpen] = useState(false);

  const points = [
    {
      en: "The 'intersection' narrative was Jobs's own framing, deployed most famously at every product launch's closing slide. Isaacson reports it largely uncritically; independent corroboration of how deeply these inputs actually shaped engineering decisions is thinner than the brand story implies.",
      zh: "\"交汇\"叙事是乔布斯自己的框架，在每场产品发布会的最后一张幻灯片上最为著名。艾萨克森在很大程度上毫无批判地报道了这一点；独立证实这些输入实际上如何深刻影响工程决策的证据，比品牌故事所暗示的要薄弱。",
    },
    {
      en: "Apple's engineering wins — ARM chip architecture, NAND flash supply chain mastery, cellular radio negotiation — were won by engineers and supply-chain executives, not by someone who had audited a calligraphy class. The 'humanities CEO' framing can obscure the technical depth Apple actually deployed.",
      zh: "苹果的工程胜利——ARM芯片架构、NAND闪存供应链掌控、蜂窝无线电谈判——是由工程师和供应链高管赢得的，而非旁听过书法课的人。\"人文CEO\"框架可能遮蔽了苹果实际部署的技术深度。",
    },
    {
      en: "The Zen influence on Jobs's product philosophy is real and documented. The calligraphy influence is more ambiguous — it explains the Mac's font variety, but many computers of the era shipped multiple typefaces once it became technically feasible.",
      zh: "禅宗对乔布斯产品哲学的影响是真实且有文献记载的。书法影响则更为模糊——它解释了Mac的字体多样性，但那个时代许多计算机一旦技术上可行，也都推出了多种字体。",
    },
    {
      en: "That said: the bet that aesthetics could be a sustained competitive moat — not just a differentiator but a structural barrier — proved correct over 25 years. Whether it originated in genuine humanistic formation or in the marketing intelligence to claim it, the strategy worked.",
      zh: "话虽如此：美学可以成为持续竞争护城河的赌注——不仅是差异化因素，而是结构性壁垒——在25年间被证明是正确的。无论它源于真正的人文素养，还是源于主张这一点的营销智慧，该战略都奏效了。",
    },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${C.plasm500}22`,
        background: `rgba(255,94,91,0.03)`,
      }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[0.65rem]"
            style={{ background: C.plasm500 + "20", color: C.plasm400, border: `1px solid ${C.plasm500}40` }}
          >
            ⚖
          </span>
          <div>
            <p className="label-mono" style={{ color: C.plasm400 }}>
              {L("FAIR READING", "公正解读")}
            </p>
            <p
              className={`text-[0.67rem] mt-0.5 ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
            >
              {L(
                "Was this a genuine philosophical formation — or a brilliant brand story told by a peerless marketer?",
                "这是真正的哲学塑造，还是一位无与伦比的营销大师讲述的精彩品牌故事？",
              )}
            </p>
          </div>
        </div>
        <span style={{ color: C.plasm400 + "80", fontSize: "0.85rem", flexShrink: 0, marginLeft: 12 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          className="px-5 pb-5 space-y-3 rise-in"
          style={{ borderTop: `1px solid ${C.plasm500}18` }}
        >
          <div className="space-y-3 pt-4">
            {points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[0.5rem] font-mono font-bold"
                  style={{
                    background: C.plasm500 + "18",
                    color: C.plasm400,
                    border: `1px solid ${C.plasm500}30`,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  className={`text-[0.71rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  style={{
                    color: C.ink300,
                    fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                  }}
                >
                  {pt[lang]}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl px-4 py-3 mt-2"
            style={{
              background: C.void800,
              border: `1px solid ${C.plasm500}15`,
            }}
          >
            <p className="label-mono mb-1" style={{ color: C.plasm400 + "88" }}>
              {L("Editorial position", "编辑立场")}
            </p>
            <p
              className={`text-[0.69rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink50,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
              }}
            >
              {L(
                "Both reads are defensible. The inputs above were real — Jobs studied calligraphy, genuinely practised Zen, actually collected Braun products. The question is whether the outputs are causal or correlational, and whether the brand story amplified a true insight or retrospectively constructed one. Holding both simultaneously is the honest analytical position.",
                "两种解读都站得住脚。上述输入是真实的——乔布斯确实学过书法，真正修习过禅，确实收藏博朗产品。问题在于这些输出是因果关系还是相关关系，以及品牌故事是放大了一个真实洞见，还是事后构建了一个。同时持有两种观点，是诚实的分析立场。",
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function IntersectionViz() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const [selectedId, setSelectedId] = useState<string | null>("calligraphy");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedNode = selectedId ? NODES.find((n) => n.id === selectedId) ?? null : null;

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="w-full space-y-6">

      {/* ── header ──────────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1" style={{ color: C.flux400 }}>
          {L("Theme 01 · Art × Technology", "主题 01 · 艺术 × 技术")}
        </p>
        <h3 className={`display text-2xl md:text-3xl leading-tight mb-2 spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("The Intersection", "交汇之地")}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-3 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "Jobs insisted Apple stood at the intersection of the liberal arts and technology — not just hardware-plus-software but a genuine synthesis of humanistic tradition and engineering. Six formative inputs flowed into that intersection. Click any node to trace its path from influence to product.",
            "乔布斯坚持认为苹果立于人文艺术与技术的交汇处——不只是硬件加软件，而是人文传统与工程的真正综合。六个形成性输入汇入这个交叉点。点击任意节点，追溯其从影响到产品的路径。",
          )}
        </p>
        <div className="rule-flux h-px rounded" />
      </div>

      {/* ── legend ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 text-[0.62rem] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 rounded" style={{ background: C.iris400 + "80" }} />
          <span style={{ color: C.iris400 }}>
            {L("Liberal Arts inputs", "人文艺术输入")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 rounded" style={{ background: C.flux400 + "80" }} />
          <span style={{ color: C.flux400 }}>
            {L("Technology inputs", "技术输入")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-[0.55rem] font-bold"
            style={{ background: C.gold500 + "18", border: `1px solid ${C.gold400}55`, color: C.gold400 }}
          >
            SJ
          </span>
          <span style={{ color: C.gold400 }}>
            {L("Jobs at the intersection", "乔布斯在交汇处")}
          </span>
        </div>
      </div>

      {/* ── main layout: crossroads + card ──────────────────────────────────── */}
      <div className="grid md:grid-cols-[1fr_360px] gap-6 items-start">

        {/* crossroads SVG */}
        <div
          className="rounded-2xl overflow-hidden border relative"
          style={{
            borderColor: "rgba(255,255,255,0.07)",
            background: C.void950,
            boxShadow: `0 0 80px -30px rgba(41,151,255,0.25), 0 0 80px -30px rgba(166,99,204,0.18)`,
          }}
        >
          <Crossroads
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleSelect}
            onHover={setHoveredId}
            lang={lang}
          />

          {/* Hint overlay */}
          {!selectedId && (
            <div
              className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none"
            >
              <span
                className="font-mono text-[0.6rem] tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: C.void800 + "cc",
                  color: C.ink500,
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {L("← click any node to explore", "← 点击任意节点探索")}
              </span>
            </div>
          )}
        </div>

        {/* right panel: card or placeholder */}
        <div className="space-y-4">
          {selectedNode ? (
            <InfluenceCard key={selectedNode.id + lang} node={selectedNode} lang={lang} />
          ) : (
            <div
              className="panel rounded-2xl px-5 py-8 flex flex-col items-center justify-center gap-3 text-center"
              style={{ minHeight: 220, borderColor: "rgba(255,255,255,0.05)" }}
            >
              <span style={{ fontSize: "2rem", opacity: 0.3 }}>✦</span>
              <p
                className={`text-[0.72rem] max-w-xs leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {L(
                  "Select an input node on the crossroads to trace how it flowed into Jobs's thinking and Apple's products.",
                  "在路口图上选择一个输入节点，追溯它如何流入乔布斯的思维和苹果的产品。",
                )}
              </p>
            </div>
          )}

          {/* Node quick-select list on mobile / supplementary */}
          <div className="grid grid-cols-3 gap-1.5 md:hidden">
            {NODES.map((node) => {
              const isSelected = selectedId === node.id;
              const accent = node.lane === "arts" ? C.iris400 : C.flux400;
              return (
                <button
                  key={node.id}
                  onClick={() => handleSelect(node.id)}
                  className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200"
                  style={{
                    background: isSelected ? accent + "15" : C.void800,
                    border: `1px solid ${isSelected ? accent + "40" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <span style={{ fontSize: "1rem", color: isSelected ? accent : accent + "66" }}>
                    {node.icon}
                  </span>
                  <span
                    className={`text-[0.55rem] text-center leading-tight ${lang === "zh" ? "zh" : "font-mono"}`}
                    style={{ color: isSelected ? accent : C.ink500 }}
                  >
                    {node.label[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── trait pills ─────────────────────────────────────────────────────── */}
      <TraitPills selectedId={selectedId} lang={lang} />

      {/* ── node index strip (desktop) ──────────────────────────────────────── */}
      <div
        className="hidden md:grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
      >
        {NODES.map((node) => {
          const isSelected = selectedId === node.id;
          const accent = node.lane === "arts" ? C.iris400 : C.flux400;
          return (
            <button
              key={node.id}
              onClick={() => handleSelect(node.id)}
              className="flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
              style={{
                background: isSelected ? accent + "10" : C.void800,
                border: `1px solid ${isSelected ? accent + "40" : "rgba(255,255,255,0.05)"}`,
                boxShadow: isSelected ? `0 0 18px -8px ${accent}44` : "none",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: "0.9rem", color: isSelected ? accent : accent + "66" }}>
                  {node.icon}
                </span>
                <span
                  className="font-mono text-[0.5rem] tracking-widest uppercase"
                  style={{ color: isSelected ? accent + "aa" : C.ink500 + "77" }}
                >
                  {node.lane === "arts" ? L("arts", "人文") : L("tech", "技术")}
                </span>
              </div>
              <span
                className={`text-[0.65rem] leading-snug ${lang === "zh" ? "zh" : "font-mono"}`}
                style={{ color: isSelected ? accent : C.ink500 }}
              >
                {node.label[lang]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── FAIR panel ─────────────────────────────────────────────────────── */}
      <FairPanel lang={lang} />

      {/* ── closing attribution ─────────────────────────────────────────────── */}
      <div
        className="rounded-xl px-4 py-3 flex gap-3"
        style={{ background: "rgba(41,151,255,0.04)", border: "1px solid rgba(41,151,255,0.10)" }}
      >
        <span style={{ color: C.flux400 + "80", fontSize: "0.85rem", flexShrink: 0, lineHeight: 1.6 }}>◇</span>
        <p
          className={`text-[0.67rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "All influence narratives above are this site's analytical commentary, paraphrasing the account in Isaacson, Walter. Steve Jobs. Simon & Schuster, 2011. The book's original language and quotations are not reproduced. Readers should verify interpretations against the primary source.",
            "以上所有影响叙事均为本站的分析性评注，意译自艾萨克森《史蒂夫·乔布斯传》（西蒙与舒斯特出版社，2011年）中的描述。本书原文语言和引用均未复现。读者应对照原著核实诠释的准确性。",
          )}
        </p>
      </div>
    </div>
  );
}
