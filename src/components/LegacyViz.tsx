"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   LegacyViz
   Theme 09 — A Dent in the Universe: Legacy & Mortality

   Part 1: Six-industry constellation — interactive spokes around a central
           Jobs silhouette node; each industry is a clickable node with a
           bilingual card (what changed, which product).
   Part 2: The Dent — a panel on the deeper legacy: the conviction he voiced
           to the young, mortality handled with restraint, an honest two-handed
           closing note that holds the dent and the damage together.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── palette (matches globals.css contract) ─── */
const C = {
  void950: "#0a0a0b",
  void900: "#111113",
  void800: "#18181b",
  void700: "#232327",
  // flux — Apple blue
  flux500: "#2997ff",
  flux400: "#6cb8ff",
  // iris — violet
  iris500: "#a663cc",
  iris400: "#c79be0",
  // leaf — green
  leaf500: "#61bb46",
  leaf400: "#8fd47a",
  // gold — amber / the dent
  gold500: "#f6a623",
  gold400: "#ffc15e",
  // plasm — coral / damage
  plasm500: "#ff5e5b",
  plasm400: "#ff8a87",
  // steel — silver
  steel500: "#86868b",
  steel400: "#a1a1a6",
  // ink
  ink50:  "#f5f5f7",
  ink300: "#a1a1a6",
  ink500: "#6e6e73",
} as const;

/* rainbow hues for the six industries — tasteful, not garish */
const INDUSTRY_COLORS = [
  "#61bb46", // green    — personal computers
  "#f6a623", // amber    — animated film
  "#ff5e5b", // coral    — music
  "#2997ff", // blue     — phones
  "#a663cc", // violet   — tablets
  "#6cb8ff", // sky      — digital publishing
] as const;

/* ─── deterministic pseudo-noise (no Math.random in render) ─── */
function dNoise(seed: number, t: number): number {
  const x = Math.sin(seed * 127.1 + t * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ═══════════════════════════════════════════════════════════════════
   INDUSTRY DATA
═══════════════════════════════════════════════════════════════════ */
interface Industry {
  id: string;
  index: number; // 0-5 determines spoke angle
  color: string;
  icon: string;
  name: { en: string; zh: string };
  era:  { en: string; zh: string };
  product: { en: string; zh: string };
  what: { en: string; zh: string };
  before: { en: string; zh: string };
  after: { en: string; zh: string };
}

const INDUSTRIES: Industry[] = [
  {
    id: "pc",
    index: 0,
    color: INDUSTRY_COLORS[0],
    icon: "⌘",
    name: { en: "Personal Computing", zh: "个人电脑" },
    era:  { en: "1977 – 1985 / 1997 – 2011", zh: "1977—1985 / 1997—2011" },
    product: { en: "Apple II, Macintosh, iMac", zh: "Apple II、Macintosh、iMac" },
    what: {
      en: "Jobs convinced the world that a computer was not a corporate tool but a personal one — something intimate, owned, named. The graphical interface, the mouse, the all-in-one design each narrowed the gap between a person and a machine to nothing.",
      zh: "乔布斯让世人相信，计算机不是企业工具，而是个人之物——亲密的、可拥有的、有名字的。图形界面、鼠标、一体机设计，每一项都将人与机器之间的距离缩减至零。",
    },
    before: { en: "Computing: punch cards, command lines, data centres", zh: "计算机：打孔卡、命令行、数据中心" },
    after: { en: "Computing: a desk tool for every creative person on earth", zh: "计算机：地球上每位创造者桌上的工具" },
  },
  {
    id: "film",
    index: 1,
    color: INDUSTRY_COLORS[1],
    icon: "◎",
    name: { en: "Animated Film", zh: "动画电影" },
    era:  { en: "1986 – 2006", zh: "1986—2006" },
    product: { en: "Toy Story, Finding Nemo, The Incredibles (Pixar)", zh: "《玩具总动员》《海底总动员》《超人总动员》（皮克斯）" },
    what: {
      en: "When Jobs bought The Graphics Group from Lucasfilm for $5 million and renamed it Pixar, the animated feature was a dying format. He kept it alive across a decade of losses, insisted on original storytelling, and watched it become the dominant form of family cinema. The Pixar run — from Toy Story in 1995 to the Disney acquisition in 2006 — is twelve years of nearly unbroken artistic and commercial excellence.",
      zh: "乔布斯以500万美元从卢卡斯影业收购图形组并更名为皮克斯时，动画长片几乎是垂死的格式。他在亏损中坚持十年，坚持原创叙事，最终看着它成为家庭电影的主导形式。从1995年《玩具总动员》到2006年迪士尼收购，皮克斯十二年间几乎保持了不间断的艺术与商业双重卓越。",
    },
    before: { en: "Animated features: hand-drawn, limited, marginal", zh: "动画长片：手绘、受限、边缘化" },
    after: { en: "Computer animation: the dominant family-film form", zh: "电脑动画：家庭电影的主导形式" },
  },
  {
    id: "music",
    index: 2,
    color: INDUSTRY_COLORS[2],
    icon: "♩",
    name: { en: "Recorded Music", zh: "录制音乐" },
    era:  { en: "2001 – 2007", zh: "2001—2007" },
    product: { en: "iPod + iTunes Store", zh: "iPod + iTunes 商店" },
    what: {
      en: "The music industry had spent three years watching Napster and its successors hollow out its revenue model. Jobs negotiated with all five major labels at once — something no one had managed — and opened the iTunes Store in April 2003 at 99 cents a track. Legal digital music. Within three years, iTunes was the largest music retailer in the United States.",
      zh: "音乐行业在看着Napster及其继承者掏空收入模式三年后，乔布斯与五大唱片公司同时谈判——此前无人做到——并于2003年4月以每首99美分开设iTunes商店。合法数字音乐。三年内，iTunes成为美国最大的音乐零售商。",
    },
    before: { en: "Music retail: CD, $15–18 per album, piracy in crisis", zh: "音乐零售：CD，每张15-18美元，盗版危机" },
    after: { en: "Music retail: per-track digital purchase, then streaming", zh: "音乐零售：单曲数字购买，进而演变为流媒体" },
  },
  {
    id: "phone",
    index: 3,
    color: INDUSTRY_COLORS[3],
    icon: "▣",
    name: { en: "Mobile Phones", zh: "移动电话" },
    era:  { en: "2007 – present", zh: "2007年至今" },
    product: { en: "iPhone", zh: "iPhone" },
    what: {
      en: "At the 2007 Macworld keynote, Jobs described the iPhone as three things: an iPod, a phone, and an internet communicator — then let the audience understand those were one device. Within five years, the smartphone had replaced the camera, the music player, the GPS unit, the newspaper, and the alarm clock. Every phone made after 2007 is an iPhone — or an answer to the iPhone.",
      zh: "在2007年Macworld主题演讲中，乔布斯将iPhone描述为三样东西：一台iPod、一部电话、一台互联网通信器——然后让观众自己意识到这是同一台设备。五年内，智能手机取代了相机、音乐播放器、GPS、报纸和闹钟。2007年后制造的每一部手机，要么是iPhone，要么是对iPhone的回应。",
    },
    before: { en: "Mobile phones: physical keyboards, carrier-controlled software", zh: "移动电话：实体键盘，运营商控制软件" },
    after: { en: "Smartphones: pocket computers, the new primary screen", zh: "智能手机：口袋电脑，新的主屏幕" },
  },
  {
    id: "tablet",
    index: 4,
    color: INDUSTRY_COLORS[4],
    icon: "◱",
    name: { en: "Tablet Computing", zh: "平板计算" },
    era:  { en: "2010 – present", zh: "2010年至今" },
    product: { en: "iPad", zh: "iPad" },
    what: {
      en: "Tablet computers had existed for a decade — and failed. Microsoft's Tablet PC, announced by Bill Gates in 2001, never found a market. Jobs's insight was that a tablet should not be a laptop with the keyboard removed. It should be a different object altogether: held in the hands, navigated by touch, shaped for consumption and creation in equal measure. The iPad created a new product category.",
      zh: "平板电脑已存在十年——并以失败告终。比尔·盖茨于2001年发布的微软平板PC从未找到市场。乔布斯的洞见是：平板不应是去掉键盘的笔记本。它应该是完全不同的物体：双手持握、触控导航、在消费与创作之间同等塑形。iPad创造了全新的产品品类。",
    },
    before: { en: "Tablets: failed PC derivatives, stylus-dependent", zh: "平板：失败的PC衍生品，依赖手写笔" },
    after: { en: "Tablets: a mainstream form factor, from schools to hospitals", zh: "平板：主流形态，从学校到医院无处不在" },
  },
  {
    id: "publish",
    index: 5,
    color: INDUSTRY_COLORS[5],
    icon: "⊠",
    name: { en: "Digital Publishing", zh: "数字出版" },
    era:  { en: "1984 – 1986 / 2010", zh: "1984—1986 / 2010年" },
    product: { en: "LaserWriter + PageMaker → iBooks", zh: "LaserWriter + PageMaker → iBooks" },
    what: {
      en: "The first disruption came quietly in 1985: the Macintosh, the LaserWriter, and Aldus PageMaker together made desktop publishing real — collapsing the cost of producing a typeset document from thousands of dollars to hundreds. The second wave came with the iPad and iBooks in 2010, which proposed that the textbook, the magazine, and the illustrated book could be reinvented as interactive objects. The groundwork he laid in 1985 made the second wave conceivable.",
      zh: "第一次颠覆悄然发生于1985年：Macintosh、LaserWriter与Aldus PageMaker共同使桌面出版成为现实——将排版文件的生产成本从数千美元压缩至数百美元。第二波浪潮随2010年iPad与iBooks而来，提出教科书、杂志和图文书可以作为互动对象被重新发明。他在1985年奠定的基础，使第二波浪潮成为可能。",
    },
    before: { en: "Publishing: professional typesetting, expensive production", zh: "出版：专业排版，高昂制作成本" },
    after: { en: "Publishing: desktop layout, then digital interactive books", zh: "出版：桌面排版，进而演变为数字互动书籍" },
  },
];

/* ═══════════════════════════════════════════════════════════════════
   CONSTELLATION CANVAS
   Deterministic spoked layout — index drives angle, no Math.random
═══════════════════════════════════════════════════════════════════ */

interface NodePos {
  x: number;   // canvas pixels
  y: number;
  angle: number; // spoke angle in radians
}

function getNodePositions(cx: number, cy: number, radius: number): NodePos[] {
  return INDUSTRIES.map((ind, i) => {
    // evenly spaced; offset so first spoke points top-left (not straight up)
    const angle = (i / INDUSTRIES.length) * Math.PI * 2 - Math.PI * 0.5 + (Math.PI / 6);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), angle };
  });
}

interface ConstellationCanvasProps {
  activeId: string | null;
  onNodeClick: (id: string) => void;
}

function ConstellationCanvas({ activeId, onNodeClick }: ConstellationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const frameRef  = useRef<number>(0);
  // Store hit-test rects: [x, y, r, id]
  const hitsRef   = useRef<Array<{ x: number; y: number; r: number; id: string }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      frameRef.current += 1;
      const f = frameRef.current;
      if (w <= 0 || h <= 0) { rafRef.current = requestAnimationFrame(loop); return; }

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = C.void950;
      ctx.fillRect(0, 0, w, h);

      const t = f * 0.007;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const spokeLen = Math.min(w, h) * 0.375;
      const nodeR    = Math.min(22, Math.min(w, h) * 0.07);
      const centerR  = Math.min(28, Math.min(w, h) * 0.09);

      const positions = getNodePositions(cx, cy, spokeLen);
      hitsRef.current = positions.map((p, i) => ({ x: p.x, y: p.y, r: nodeR + 8, id: INDUSTRIES[i].id }));

      // ── ambient particle field ──
      for (let i = 0; i < 28; i++) {
        const px = dNoise(i * 7 + 1, 0) * w;
        const py = dNoise(i * 7 + 2, 0) * h;
        const alpha = 0.06 + 0.08 * Math.sin(t * (0.5 + dNoise(i * 3, 0)) + dNoise(i * 11, 0) * 6);
        ctx.beginPath();
        ctx.arc(px, py, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194,198,212,${alpha})`;
        ctx.fill();
      }

      // ── spokes ──
      positions.forEach((p, i) => {
        const ind = INDUSTRIES[i];
        const isActive = ind.id === activeId;
        const pulseAlpha = 0.18 + 0.12 * Math.sin(t * 1.3 + i * 1.1);
        const lineAlpha  = isActive ? 0.75 : pulseAlpha;

        // Gradient spoke
        const grad = ctx.createLinearGradient(cx, cy, p.x, p.y);
        grad.addColorStop(0,   `rgba(134,134,139,0.12)`);
        grad.addColorStop(0.6, `${ind.color}${Math.round(lineAlpha * 255).toString(16).padStart(2, "0")}`);
        grad.addColorStop(1,   `${ind.color}${Math.round(lineAlpha * 0.5 * 255).toString(16).padStart(2, "0")}`);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isActive ? 2.2 : 1.2;
        ctx.setLineDash(isActive ? [] : [4, 7]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Spoke label (industry era, tiny)
        const midX = cx + (p.x - cx) * 0.58;
        const midY = cy + (p.y - cy) * 0.58;
        ctx.font = "8px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(161,161,166,${isActive ? 0.9 : 0.35})`;
        ctx.fillText(ind.era.en, midX, midY);
      });

      // ── industry nodes ──
      positions.forEach((p, i) => {
        const ind = INDUSTRIES[i];
        const isActive = ind.id === activeId;
        const pulse = Math.sin(t * 1.8 + i * 0.9) * 0.5 + 0.5;

        // Outer glow
        const glowR = nodeR + 10 + (isActive ? 8 : 0);
        const glow  = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        glow.addColorStop(0,   `${ind.color}${isActive ? "60" : "30"}`);
        glow.addColorStop(0.5, `${ind.color}${isActive ? "28" : "10"}`);
        glow.addColorStop(1,   `${ind.color}00`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Pulsing ring (active state)
        if (isActive) {
          const ringR = nodeR + 8 + pulse * 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `${ind.color}50`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Node disc
        const disc = ctx.createRadialGradient(p.x - nodeR * 0.3, p.y - nodeR * 0.3, nodeR * 0.1, p.x, p.y, nodeR);
        disc.addColorStop(0, `${ind.color}ee`);
        disc.addColorStop(1, `${ind.color}88`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = disc;
        ctx.fill();

        // Border ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeR, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? "#fff" : `${ind.color}99`;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();

        // Icon text
        ctx.font = `bold ${nodeR * 0.95}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = C.void950;
        ctx.fillText(ind.icon, p.x, p.y + 0.5);
        ctx.textBaseline = "alphabetic";
      });

      // ── central node ──
      const cBreath = 1 + 0.04 * Math.sin(t * 0.8);
      const cR      = centerR * cBreath;

      // Outer aura
      const cAura = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR * 2.4);
      cAura.addColorStop(0,   `rgba(246,166,35,0.22)`);
      cAura.addColorStop(0.55,`rgba(246,166,35,0.07)`);
      cAura.addColorStop(1,   `rgba(246,166,35,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, cR * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = cAura;
      ctx.fill();

      // Center disc — graphite with gold accent
      const cDisc = ctx.createRadialGradient(cx - cR * 0.3, cy - cR * 0.3, cR * 0.1, cx, cy, cR);
      cDisc.addColorStop(0, `rgba(80,76,72,0.98)`);
      cDisc.addColorStop(1, `rgba(35,35,39,0.98)`);
      ctx.beginPath();
      ctx.arc(cx, cy, cR, 0, Math.PI * 2);
      ctx.fillStyle = cDisc;
      ctx.fill();

      // Gold ring
      ctx.beginPath();
      ctx.arc(cx, cy, cR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(246,166,35,0.75)`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Apple logo (⌘ / ⬡ simplified — use Ψ as the "dent" symbol)
      ctx.font = `bold ${cR * 0.85}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = C.gold400;
      ctx.fillText("✦", cx, cy + 1);
      ctx.textBaseline = "alphabetic";

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [activeId]);

  // Hit test on click
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect  = canvas.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;
    for (const hit of hitsRef.current) {
      const dx = mx - hit.x;
      const dy = my - hit.y;
      if (dx * dx + dy * dy <= hit.r * hit.r) {
        onNodeClick(hit.id);
        return;
      }
    }
    onNodeClick(""); // click empty = deselect
  }, [onNodeClick]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full rounded-2xl cursor-pointer"
      style={{ height: "340px", display: "block" }}
      aria-label="Six-industry constellation diagram — click any node to expand"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INDUSTRY CARD
═══════════════════════════════════════════════════════════════════ */
interface IndustryCardProps {
  industry: Industry;
  lang: "en" | "zh";
  onClose: () => void;
}

function IndustryCard({ industry: ind, lang, onClose }: IndustryCardProps) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  return (
    <div
      className="rise-in panel rounded-2xl overflow-hidden"
      style={{
        borderColor: `${ind.color}55`,
        boxShadow: `0 0 48px -16px ${ind.color}55`,
      }}
    >
      {/* top accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${ind.color}88, transparent)` }} />

      <div className="p-5 flex flex-col gap-4">
        {/* header */}
        <div className="flex items-start gap-3">
          <span
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold"
            style={{ background: `${ind.color}18`, color: ind.color, border: `1px solid ${ind.color}40` }}
            aria-hidden="true"
          >
            {ind.icon}
          </span>
          <div className="flex-1 min-w-0">
            <h4
              className={`display text-lg leading-snug ${lang === "zh" ? "zh" : ""}`}
              style={{ color: ind.color }}
            >
              {ind.name[lang]}
            </h4>
            <div className="label-mono text-[0.55rem] mt-0.5" style={{ color: C.ink500, letterSpacing: "0.18em" }}>
              {ind.era[lang]}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs transition-opacity hover:opacity-80"
            style={{ background: `${C.void700}`, color: C.ink300, border: `1px solid rgba(255,255,255,0.08)` }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* product badge */}
        <div
          className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[0.62rem] font-mono ${lang === "zh" ? "zh" : ""}`}
          style={{ color: ind.color, background: `${ind.color}12`, border: `1px solid ${ind.color}30` }}
        >
          <span>◆</span>
          <span>{ind.product[lang]}</span>
        </div>

        {/* what changed */}
        <p
          className={`text-[0.8rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {ind.what[lang]}
        </p>

        {/* before / after */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: L("Before", "之前"), text: ind.before[lang], col: C.steel400 },
            { label: L("After", "之后"),  text: ind.after[lang],  col: ind.color  },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-lg px-3 py-2.5 flex flex-col gap-1"
              style={{ background: `${C.void800}`, border: `1px solid rgba(255,255,255,0.05)` }}
            >
              <div className="label-mono text-[0.5rem]" style={{ color: row.col }}>
                {row.label}
              </div>
              <p
                className={`text-[0.72rem] leading-snug ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300 }}
              >
                {row.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INDUSTRY SELECTOR — pill tabs below canvas on mobile
═══════════════════════════════════════════════════════════════════ */
interface SelectorProps {
  activeId: string | null;
  onSelect: (id: string) => void;
  lang: "en" | "zh";
}

function IndustrySelector({ activeId, onSelect, lang }: SelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {INDUSTRIES.map((ind) => {
        const active = ind.id === activeId;
        return (
          <button
            key={ind.id}
            onClick={() => onSelect(active ? "" : ind.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[0.62rem] transition-all duration-200 ${lang === "zh" ? "zh" : ""}`}
            style={{
              color:       active ? ind.color : C.ink500,
              background:  active ? `${ind.color}18` : `${C.void800}`,
              border:      `1px solid ${active ? `${ind.color}55` : "rgba(255,255,255,0.06)"}`,
              boxShadow:   active ? `0 0 16px -6px ${ind.color}60` : "none",
            }}
          >
            <span aria-hidden="true">{ind.icon}</span>
            <span>{ind.name[lang]}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   THE DENT PANEL DATA
═══════════════════════════════════════════════════════════════════ */

interface DentEntry {
  id: string;
  tone: "gold" | "plasm" | "steel";
  title: { en: string; zh: string };
  body:  { en: string; zh: string };
}

const DENT_ENTRIES: DentEntry[] = [
  {
    id: "conviction",
    tone: "gold",
    title: { en: "What He Believed — and Said to the Young", zh: "他所相信的——以及他对年轻人所说的" },
    body: {
      en: "In a 1994 documentary interview, Jobs spoke — plainly, without theatre — about a thought he said had changed his life: that most of what we take as given was made by people no smarter than us. Not geniuses. Not a different species. People who built things. Once you understand that, he said, you can influence things; you can change the world — and once you have grasped that, you can never be entirely passive again. The message was not triumphalist. It was an invitation to seriousness.",
      zh: "在1994年的一次纪录片采访中，乔布斯朴素地、没有任何夸饰地讲述了一个他说改变了自己一生的想法：我们视为理所当然的大多数事物，都是由并不比我们更聪明的人创造的。不是天才，不是另一个物种。是建造了东西的人。一旦你理解了这一点，他说，你就可以影响事物，你可以改变世界——而一旦你领悟了这一点，你就再也无法完全被动下去了。这个信息不是胜利主义的。这是一份对严肃性的邀请。",
    },
  },
  {
    id: "time",
    tone: "gold",
    title: { en: "Your Time Is Limited", zh: "你的时间有限" },
    body: {
      en: "The 2005 Stanford commencement address is the fullest public statement of what Jobs believed about mortality and direction. Paraphrased in his own voice: your time is limited — do not waste it living someone else's life. Do not be trapped by dogma, which is living by the results of other people's thinking. Have the courage to follow your heart and intuition. He spoke these words knowing his prognosis was uncertain. The speech does not read, in retrospect, as performance. It reads as a man in his fifties who had looked at death and come back with a simplified agenda: love what you do; do not settle.",
      zh: "2005年斯坦福毕业典礼演讲，是乔布斯关于死亡与方向最完整的公开表达。以他自己的语气转述：你的时间有限，不要浪费在过别人的生活上。不要被教条困住，那是活在别人思考的结果里。要有勇气跟随你的心和直觉。他说这些话时，知道自己的预后尚不明朗。回头看，那篇演讲不像表演。它像一个五十多岁的人，直视过死亡之后，带着一份简化的清单回来：热爱你所做的事；不要将就。",
    },
  },
  {
    id: "dent",
    tone: "gold",
    title: { en: "A Dent in the Universe", zh: "在宇宙中留下凹痕" },
    body: {
      en: "The phrase — his own, from early Apple — is not metaphorical modesty. Jobs meant it with a quiet literalism: that the universe is large and indifferent, that almost no one and almost nothing leaves a mark, and that the goal of a working life should be to matter. The Macintosh, the iPhone, Pixar, and the iTunes Store are, by any reasonable measure, dents. The world is shaped differently because he worked in it. That is not nothing. That is, in fact, quite rare.",
      zh: "这个短语——他自己的，来自苹果早期——不是比喻性的谦虚。乔布斯带着一种平静的字面意义说这句话：宇宙是广阔而冷漠的，几乎没有人和几乎什么事情能留下痕迹，而职业生涯的目标应该是有所影响。以任何合理的标准衡量，Macintosh、iPhone、皮克斯和iTunes商店都是凹痕。因为他在其中工作，世界被塑造成了不同的形状。那不是什么都没有。那实际上相当罕见。",
    },
  },
  {
    id: "damage",
    tone: "plasm",
    title: { en: "The Damage — Held in the Same Hand", zh: "另一面的代价——同手并握" },
    body: {
      en: "The honest reading of Steve Jobs's biography does not permit a clean legacy. The people who worked most closely with him — at Apple and NeXT and Pixar — often describe a person of extraordinary capability and extraordinary cruelty. Colleagues dismissed in corridors, engineers publicly humiliated, a son he did not acknowledge for years, a daughter he named a failed product after and then denied. The Isaacson biography does not hide these. It places them alongside the products as part of the same record. The dent is real. So is the damage. The most honest reading holds both.",
      zh: "对史蒂夫·乔布斯传记的诚实解读，不允许一个干净的遗产。与他最亲密合作的人——在苹果、NeXT和皮克斯——往往描述一个具有非凡能力和非凡残忍的人。在走廊里被解雇的同事、被当众羞辱的工程师、他多年未承认的儿子、他用来命名一个失败产品然后又否认的女儿。艾萨克森的传记没有隐藏这些。它把这些与产品并列，作为同一份记录的一部分。那个凹痕是真实的。那些代价也是真实的。最诚实的解读，将两者同时持有。",
    },
  },
  {
    id: "synthesis",
    tone: "steel",
    title: { en: "What Survives", zh: "留存下来的" },
    body: {
      en: "The iPad you are reading this on, or the smartphone in your pocket, or the animated film your child watched last night — these are not diminished by their maker's flaws. They were made by thousands of people, shaped by a particular demand for excellence that was sometimes indistinguishable from cruelty. The artefacts survive in a different category from the man. That is perhaps the most honest definition of a dent: something that outlasts the person who made it, that the world adapts to and forgets was ever not there.",
      zh: "你正在阅读这段文字所用的iPad，或者你口袋里的智能手机，或者你的孩子昨晚观看的动画电影——这些不会因为创造者的缺陷而减损。它们由数以千计的人创造，被一种对卓越的特殊要求所塑造，这种要求有时与残忍难以区分。那些人工制品以不同的类别幸存于那个人之外。这也许是对凹痕最诚实的定义：某个比制造它的人活得更久的东西，世界适应了它，然后忘记了它曾经不在那里。",
    },
  },
];

const TONE_COLORS: Record<string, string> = {
  gold:  C.gold500,
  plasm: C.plasm500,
  steel: C.steel500,
};
const TONE_COLORS_LIGHT: Record<string, string> = {
  gold:  C.gold400,
  plasm: C.plasm400,
  steel: C.steel400,
};
const TONE_PANELS: Record<string, string> = {
  gold:  "panel-gold",
  plasm: "panel-plasm",
  steel: "panel-steel",
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */

export default function LegacyViz() {
  const { lang } = useLang();
  const L = useCallback((en: string, zh: string) => lang === "zh" ? zh : en, [lang]);

  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [openDent, setOpenDent] = useState<string | null>(null);

  const handleNodeClick = useCallback((id: string) => {
    setActiveIndustry((prev) => (!id || prev === id) ? null : id);
  }, []);

  const activeInd = INDUSTRIES.find((i) => i.id === activeIndustry) ?? null;

  return (
    <div className="w-full flex flex-col gap-12">

      {/* ── Section header ── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono" style={{ color: C.gold400 }}>
          {L("Theme 09 · A Dent in the Universe", "主题09 · 在宇宙中留下凹痕")}
        </div>
        <h2 className={`display text-3xl md:text-4xl leading-tight spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("Legacy & Mortality", "遗产与死亡")}
        </h2>
        <p
          className={`text-sm max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "Six industries reshaped across one life. A conviction about what a life is for. An honest reckoning with what was built — and what was broken — in the building.",
            "一生之中重塑了六个行业。一种关于生命意义的信念。对建造过程中所造之物——以及所毁之物——的诚实清算。",
          )}
        </p>
      </div>

      <div className="h-px rule-flux opacity-40 rounded-full" />

      {/* ═══ PART 1: SIX INDUSTRIES ═══ */}
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="label-mono" style={{ color: C.gold400 }}>
              {L("Six Industries", "六大行业")}
            </div>
            <h3 className={`display text-xl ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink50 }}>
              {L("One Life, Six Reshapings", "一生，六次重塑")}
            </h3>
            <p
              className={`text-[0.8rem] leading-relaxed max-w-xl ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
            >
              {L(
                "Click any node in the constellation to read what changed — and what the before and after looked like.",
                "点击星座中的任意节点，了解发生了什么改变——以及改变前后各是什么样子。",
              )}
            </p>
          </div>
          <div
            className="shrink-0 rounded-xl px-3 py-2 flex items-center gap-2 border"
            style={{ borderColor: `${C.gold500}20`, background: `${C.void800}` }}
          >
            <span className="text-[0.6rem] font-mono" style={{ color: C.gold400 }}>✦</span>
            <span className="text-[0.62rem] font-mono" style={{ color: C.ink500 }}>
              {L("6 industries · 1 life", "6个行业 · 一生")}
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="panel rounded-2xl overflow-hidden"
          style={{ borderColor: `${C.gold500}20`, boxShadow: `0 0 60px -28px rgba(246,166,35,0.2)` }}
        >
          <ConstellationCanvas
            activeId={activeIndustry}
            onNodeClick={handleNodeClick}
          />
          {/* Legend / selector row */}
          <div className="px-4 py-3 border-t border-white/5">
            <IndustrySelector
              activeId={activeIndustry}
              onSelect={handleNodeClick}
              lang={lang}
            />
          </div>
        </div>

        {/* Expanded industry card */}
        {activeInd && (
          <IndustryCard
            industry={activeInd}
            lang={lang}
            onClose={() => setActiveIndustry(null)}
          />
        )}

        {/* Breadth note */}
        <div
          className="rounded-xl border px-5 py-4 flex flex-col gap-2"
          style={{ borderColor: `${C.gold500}15`, background: `linear-gradient(135deg, rgba(20,20,26,0.6), rgba(13,13,17,0.88))` }}
        >
          <div className="label-mono text-[0.56rem]" style={{ color: C.gold400 }}>
            {L("The rare breadth", "罕见的广度")}
          </div>
          <p
            className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
          >
            {L(
              "Most people who reshape an industry do so in one. Jobs reshaped six — and not sequentially. The Pixar years overlapped with the NeXT years; the iPod launched while he was rebuilding Apple; the iPhone and iPad arrived in the final decade of his life. The breadth is not accidental. The biography argues it came from a specific way of seeing products: as the intersection of technology and liberal arts, built for a person rather than a market.",
              "大多数重塑某个行业的人只做一次。乔布斯重塑了六个——而且不是依次进行的。皮克斯岁月与NeXT岁月重叠；iPod在他重建苹果期间发布；iPhone和iPad出现在他生命的最后十年。这种广度不是偶然的。传记认为，它来自于一种看待产品的特定方式：作为技术与人文艺术的交汇，为一个人而非一个市场而建造。",
            )}
          </p>
          {/* Rainbow breadth bar */}
          <div className="flex gap-1 items-center mt-1">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.id}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{
                  background: ind.color,
                  opacity: activeIndustry === null || activeIndustry === ind.id ? 1 : 0.22,
                  transform: activeIndustry === ind.id ? "scaleY(2)" : "scaleY(1)",
                }}
                title={ind.name.en}
              />
            ))}
          </div>
          <div className="flex gap-1">
            {INDUSTRIES.map((ind) => (
              <div key={ind.id} className="flex-1 text-center">
                <span
                  className={`text-[0.46rem] font-mono ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: activeIndustry === ind.id ? ind.color : C.ink500 }}
                >
                  {lang === "zh" ? ind.name.zh.slice(0, 4) : ind.name.en.split(" ").pop()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: `rgba(194,198,212,0.07)` }} />

      {/* ═══ PART 2: THE DENT ═══ */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="label-mono" style={{ color: C.gold400 }}>
            {L("The Dent", "那个凹痕")}
          </div>
          <h3 className={`display text-xl ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink50 }}>
            {L("Legacy, Mortality, and the Honest Reckoning", "遗产、死亡与诚实的清算")}
          </h3>
          <p
            className={`text-[0.8rem] leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
          >
            {L(
              "What does it mean to leave a mark? The biography's final chapters are not triumphant — they are grief, diagnosis, reconciliation where it was possible, and a sustained meditation on what a life of this intensity finally costs. Click each entry to read.",
              "留下印记意味着什么？传记的最后几章并不是胜利的——它们是悲伤、诊断、在可能的地方的和解，以及对如此高强度的生命最终代价的持续沉思。点击每个条目阅读。",
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {DENT_ENTRIES.map((entry) => {
            const isOpen  = openDent === entry.id;
            const color   = TONE_COLORS[entry.tone];
            const colorL  = TONE_COLORS_LIGHT[entry.tone];
            const panelCls = TONE_PANELS[entry.tone];

            return (
              <div
                key={entry.id}
                className={`panel ${panelCls} rounded-xl overflow-hidden cursor-pointer transition-all duration-300`}
                style={{
                  borderColor:  isOpen ? `${color}55` : undefined,
                  boxShadow:    isOpen ? `0 0 36px -16px ${color}50` : undefined,
                }}
                onClick={() => setOpenDent(isOpen ? null : entry.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => e.key === "Enter" && setOpenDent(isOpen ? null : entry.id)}
              >
                {/* top accent micro-bar */}
                <div
                  className="h-px w-full"
                  style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }}
                />

                <div className="flex items-center gap-3 px-4 py-3.5">
                  {/* tone indicator */}
                  <span
                    className="shrink-0 w-1.5 h-8 rounded-full"
                    style={{ background: `linear-gradient(180deg, ${color}ee, ${color}44)` }}
                    aria-hidden="true"
                  />
                  <h4
                    className={`flex-1 display text-[0.88rem] leading-snug ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: colorL }}
                  >
                    {entry.title[lang]}
                  </h4>
                  <span
                    className="label-mono text-[0.55rem] shrink-0 transition-transform duration-300"
                    style={{ color: colorL, transform: isOpen ? "rotate(180deg)" : undefined }}
                  >
                    ▾
                  </span>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 rise-in">
                    <div className="h-px mb-4" style={{ background: `${color}20` }} />
                    <p
                      className={`text-[0.82rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
                    >
                      {entry.body[lang]}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* The closing honest note */}
        <div
          className="rounded-2xl border px-6 py-6 flex flex-col gap-4"
          style={{
            borderColor: `rgba(246,166,35,0.18)`,
            background:  `linear-gradient(150deg, rgba(20,20,26,0.70), rgba(13,13,17,0.94))`,
          }}
        >
          <div className="label-mono" style={{ color: C.gold400 }}>
            {L("The companion's honest note", "同伴的诚实注记")}
          </div>

          {/* Dent + Damage label pair */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[0.62rem]"
              style={{ color: C.gold400, background: `${C.gold500}12`, border: `1px solid ${C.gold500}30` }}
            >
              <span>✦</span>
              {L("The Dent", "凹痕")}
            </span>
            <span className="font-mono text-[0.7rem]" style={{ color: C.ink500 }}>+</span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[0.62rem]"
              style={{ color: C.plasm400, background: `${C.plasm500}10`, border: `1px solid ${C.plasm500}28` }}
            >
              <span>◈</span>
              {L("The Damage", "代价")}
            </span>
          </div>

          <p
            className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
          >
            {L(
              "Steve Jobs built things that changed the texture of daily life for hundreds of millions of people. He also left a trail of people who were genuinely hurt — by his refusals, his denials, his capacity to treat human beings as obstacles or instruments. The Isaacson biography does not resolve this tension, because the tension does not resolve. It is not a story of a great man whose flaws were minor. It is a story of a major talent and a major capacity for harm, co-existing in the same person across the same life.",
              "史蒂夫·乔布斯建造的东西改变了数亿人日常生活的质感。他也留下了一串真正受到伤害的人——被他的拒绝、否认、以及将人视为障碍或工具的能力所伤害。艾萨克森的传记没有化解这种张力，因为这种张力无法化解。这不是一个伟大人物其缺陷微不足道的故事。这是一个重大才能与重大伤害能力共存于同一个人、贯穿同一生命的故事。",
            )}
          </p>

          <div className="h-px rule-flux opacity-25 rounded-full" />

          <p
            className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
          >
            {L(
              "The world was, in the ways that mattered to him most, changed by his passing through it. That is a rare thing — rarer than most people who work hard and care deeply ever achieve. Whether it justifies the cost to others is a question the biography leaves open, as perhaps it should. The dent and the damage are both facts. The most honest reading holds them in the same hand.",
              "在他最在意的那些方面，世界因他走过而改变了。这是一件罕见的事——比大多数努力工作、深切关怀的人所能实现的都要罕见。这是否能为对他人造成的代价辩护，是传记留作开放的问题，也许本该如此。凹痕与代价都是事实。最诚实的解读，将两者握在同一只手里。",
            )}
          </p>
        </div>
      </div>

    </div>
  );
}
