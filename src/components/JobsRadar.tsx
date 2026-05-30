"use client";

import { useState } from "react";
import { useLang, T } from "./lang";
import type { Bi } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════════
   JobsRadar — 8-axis meta-model radar mapping the "Jobs Method":
   the interlocking traits the biography distils from Apple's products and
   Steve Jobs's way of working.

   Five builder-archetype presets morph the polygon; any two can be overlaid.
   Scores are an interpretive analytical lens — not the book's explicit claims.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────── axes ────────────────────────────────────

const AXES: Bi[] = [
  { en: "Simplicity", zh: "简约" },
  { en: "Integration /\nWhole Widget", zh: "整合" },
  { en: "Focus", zh: "专注" },
  { en: "Taste &\nCraft", zh: "品味与匠艺" },
  { en: "Vision /\nReality Distortion", zh: "愿景 /\n现实扭曲" },
  { en: "Product\nObsession", zh: "产品痴迷" },
  { en: "Intensity", zh: "强度" },
  { en: "Showmanship", zh: "表演力" },
];

const AXIS_NOTES: Bi[] = [
  {
    en: "The relentless reduction of the product to its irreducible essence — fewer buttons, fewer menus, fewer steps. Jobs believed that true simplicity was not the absence of complexity but the mastery of it: every unnecessary element a form of dishonesty to the user. Measured by how much was deliberately removed rather than merely not added.",
    zh: "将产品不断压缩至其不可再简化的本质——更少的按钮、更少的菜单、更少的步骤。乔布斯认为真正的简约不是复杂性的缺席，而是对它的掌控：每一个不必要的元素都是对用户的一种不诚实。衡量标准是有意删除了多少，而不仅仅是未曾添加的内容。",
  },
  {
    en: "The insistence on controlling the entire stack — hardware, software, silicon, packaging, retail — so that every layer can be optimised as a unified whole. The 'whole widget' philosophy: the experience cannot be designed if the experience cannot be owned. Highest when no seam is visible between layers.",
    zh: "坚持掌控整个技术栈——硬件、软件、芯片、包装、零售——使每一层都能作为统一整体进行优化。「完整产品」的哲学：若体验无法被拥有，则无法被设计。当层与层之间没有任何接缝可见时，达到最高值。",
  },
  {
    en: "The willingness to say no to a hundred good things to protect the few great ones. Jobs kept Apple's product matrix on a 2×2 grid when he returned in 1997; every addition was a dilution. Focus is measured not by what a company does but by what it refuses — and the discipline to refuse grows harder as scale increases.",
    zh: "拒绝一百件好事以保护少数几件伟大之事的意愿。1997年回归后，乔布斯将苹果的产品矩阵保持在一个2×2的格子里；每一次增添都是一次稀释。专注的衡量标准不是一家公司做了什么，而是它拒绝了什么——随着规模的扩大，这种拒绝的纪律变得愈加困难。",
  },
  {
    en: "The conviction that the aesthetic surface is not decoration but function — that beauty and utility are not in tension. Jobs spent weeks on font spacing, on the colour of screws inside the Mac, on the curve of a corner. Taste here means the cultivated ability to know when something is right; craft means the obsessive execution required to make it so.",
    zh: "美学表面不是装饰而是功能的信念——美与实用并不冲突。乔布斯在字体间距、Mac内部螺丝的颜色、边角的弧度上花费数周时间。这里的品味是指一种培养出的判断何时某物是对的能力；匠艺则是让其成为现实所需的强迫性执行力。",
  },
  {
    en: "The capacity to project a future so compelling that it reshapes what engineers, suppliers, and customers believe is possible — the 'reality distortion field' his colleagues described. At its best this is visionary leadership that pulls the probable toward the desirable. At its worst it is denial of genuine constraints with real costs for teams that cannot say no.",
    zh: "投射出如此令人信服的未来愿景，以至于重塑了工程师、供应商和客户对可能性的认知——即其同事所描述的「现实扭曲力场」。在最好的情况下，这是将概然引向理想的远见领导力。在最坏的情况下，这是对真实约束的否认，对那些无法说不的团队造成真实代价。",
  },
  {
    en: "The depth of personal investment in the product as an end in itself — not as a means to revenue, market share, or validation. Jobs famously delayed shipping until he felt the product was right, overriding commercial timelines when the object fell short of his internal standard. Measured by how often the product itself is the final arbiter of decisions.",
    zh: "将产品本身作为目的而非手段的个人投入深度——而非作为收入、市场份额或认可的手段。乔布斯以推迟发货直到他认为产品正确为人所知，当产品不符合他的内部标准时，他会否决商业时间线。衡量标准是产品本身在多大程度上是决策的最终仲裁者。",
  },
  {
    en: "The emotional force applied to the work — and to the people doing it. Jobs's intensity manifested as explosive anger at imprecision, relentless pressure on teams, and a refusal to accept 'good enough'. The book treats this intensity as inseparable from the outcomes; the counterpoint is that it was also inseparable from real human damage. High intensity is not automatically right.",
    zh: "施加于工作——以及从事工作的人——的情感力量。乔布斯的强度表现为对不精确的爆发性愤怒、对团队的持续施压，以及拒绝接受「足够好」。本书将这种强度视为与成果不可分割；对立观点是，它也与真实的人际伤害不可分割。高强度并不自动意味着正确。",
  },
  {
    en: "The craft of presentation — the keynote as product, the reveal as narrative arc, the slide as single idea. Jobs treated each product launch as a theatrical performance with the same obsessive preparation applied to the object itself. Showmanship here is not superficiality; it is the discipline of communicating clearly and memorably to a wide audience.",
    zh: "展示的匠艺——将主题演讲视为产品，将揭幕视为叙事弧线，将幻灯片视为单一理念。乔布斯以同样对产品本身的强迫性准备来对待每一次产品发布，将其视为戏剧性表演。这里的表演力不是肤浅；而是清晰、令人难忘地向广大受众传达信息的纪律。",
  },
];

// ─────────────────────────────────── presets ─────────────────────────────────

interface Preset {
  name: Bi;
  note: Bi;
  scores: [number, number, number, number, number, number, number, number];
  color: string;
  interpretive?: boolean;
}

/* Scores order:
   [Simplicity, Integration, Focus, Taste&Craft,
    Vision/RDF, ProductObsession, Intensity, Showmanship] */
const PRESETS: Preset[] = [
  {
    name: { en: "The Book's Jobs", zh: "本书的乔布斯" },
    note: {
      en: "The composed Jobs method as the biography portrays it: high on nearly all eight axes, working as an interlocking system. An interpretive synthesis, not a factual claim.",
      zh: "传记所呈现的完整乔布斯方法论：八个轴几乎全部高值，作为联锁系统运转。这是一种诠释性综合，而非事实性断言。",
    },
    scores: [0.96, 0.92, 0.90, 0.95, 0.91, 0.94, 0.88, 0.93],
    color: "#2997ff", // Apple-blue
    interpretive: true,
  },
  {
    name: { en: "Committee-Run Incumbent", zh: "委员会主导的在位者" },
    note: {
      en: "Low simplicity, fragmented focus, diluted intensity — the 'bean-counter' company the book warns against. Moderate integration through legacy lock-in rather than deliberate design.",
      zh: "低简约度、碎片化的专注、被稀释的强度——正是本书所警示的「算账员公司」。通过历史遗留锁定而非刻意设计实现适度的整合。",
    },
    scores: [0.28, 0.52, 0.30, 0.38, 0.40, 0.45, 0.35, 0.42],
    color: "#86868b", // steel silver
    interpretive: true,
  },
  {
    name: { en: "The Pure Engineer", zh: "纯粹的工程师" },
    note: {
      en: "High craft and integration; deep product obsession. But low showmanship and deliberately measured reality-distortion — lets the engineering speak for itself rather than bending perception.",
      zh: "高度的匠艺与整合；深度的产品痴迷。但表演力低，现实扭曲刻意克制——让工程本身说话，而不是弯曲他人的认知。",
    },
    scores: [0.74, 0.85, 0.70, 0.88, 0.38, 0.86, 0.62, 0.28],
    color: "#61bb46", // leaf green
    interpretive: true,
  },
  {
    name: { en: "Open-Platform Builder", zh: "开放平台的建造者" },
    note: {
      en: "Low integration — deliberately open and extensible, the Microsoft/PC-world counterpoint. Moderate taste and breadth. Shows that massive reach is possible without the whole-widget philosophy.",
      zh: "低整合度——刻意保持开放和可扩展，即微软/PC世界的对立面。适度的品味与广度。表明无需「完整产品」哲学也能实现巨大影响力。",
    },
    scores: [0.42, 0.20, 0.50, 0.55, 0.60, 0.58, 0.54, 0.48],
    color: "#f6a623", // gold amber
    interpretive: true,
  },
  {
    name: { en: "The Humane Builder", zh: "人道的建造者" },
    note: {
      en: "High simplicity, taste, and product obsession — but deliberately moderate intensity and reality-distortion. A counterpoint: were the results inseparable from the cruelty? The question the book raises but does not settle.",
      zh: "高度的简约、品味与产品痴迷——但有意保持适度的强度与现实扭曲。一种对立观点：成果是否真的与残酷不可分割？这是本书提出却未解答的问题。",
    },
    scores: [0.92, 0.80, 0.84, 0.90, 0.52, 0.88, 0.44, 0.76],
    color: "#a663cc", // iris violet
    interpretive: true,
  },
];

// ─────────────────────────────── geometry ────────────────────────────────────

const SIZE = 460;
const C = SIZE / 2;
const R = SIZE * 0.36;
const N = AXES.length;

function pt(i: number, frac: number): [number, number] {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
  return [C + Math.cos(a) * R * frac, C + Math.sin(a) * R * frac];
}

function polyPoints(scores: readonly number[]): string {
  return scores.map((s, i) => pt(i, s).join(",")).join(" ");
}

// ─────────────────────────────── component ───────────────────────────────────

export default function JobsRadar() {
  const { lang } = useLang();

  // primary selected preset (always shown) — default: The Book's Jobs
  const [primary, setPrimary] = useState<number>(0);
  // optional compare overlay (null = off)
  const [compare, setCompare] = useState<number | null>(null);
  // hovered axis for tooltip
  const [axis, setAxis] = useState<number | null>(null);
  // hover on a preset button to dim others
  const [hover, setHover] = useState<number | null>(null);

  const primaryPreset = PRESETS[primary];
  const comparePreset = compare !== null ? PRESETS[compare] : null;

  function handlePresetClick(idx: number) {
    if (idx === primary) return;
    if (compare === null) {
      setPrimary(idx);
    } else {
      if (idx === compare) {
        setCompare(null);
      } else {
        setPrimary(idx);
      }
    }
  }

  function handleCompareToggle(idx: number) {
    if (idx === primary) return;
    setCompare((c) => (c === idx ? null : idx));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      {/* ─── Radar SVG ─── */}
      <div className="relative mx-auto w-full max-w-[540px]">
        <svg viewBox={`-128 -52 ${SIZE + 256} ${SIZE + 104}`} className="w-full">
          {/* grid rings */}
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <polygon
              key={f}
              points={AXES.map((_, i) => pt(i, f).join(",")).join(" ")}
              fill="none"
              stroke="rgba(41,151,255,0.09)"
              strokeWidth={1}
            />
          ))}

          {/* ring labels (25 … 100) at top axis */}
          {[0.25, 0.5, 0.75, 1].map((f) => {
            const [lx, ly] = pt(0, f);
            return (
              <text
                key={f}
                x={lx + 5}
                y={ly}
                fontSize={8}
                dominantBaseline="middle"
                fill="rgba(134,134,139,0.5)"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {(f * 100).toFixed(0)}
              </text>
            );
          })}

          {/* axis spokes */}
          {AXES.map((_, i) => {
            const [x, y] = pt(i, 1);
            return (
              <g key={i}>
                <line
                  x1={C}
                  y1={C}
                  x2={x}
                  y2={y}
                  stroke="rgba(41,151,255,0.10)"
                  strokeWidth={1}
                />
                {/* invisible hit target */}
                <circle
                  cx={x}
                  cy={y}
                  r={16}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setAxis(i)}
                  onMouseLeave={() => setAxis(null)}
                />
              </g>
            );
          })}

          {/* compare polygon (drawn below primary so primary is on top) */}
          {comparePreset && (
            <g style={{ transition: "opacity 0.25s" }}>
              <polygon
                points={polyPoints(comparePreset.scores)}
                fill={comparePreset.color}
                fillOpacity={0.07}
                stroke={comparePreset.color}
                strokeWidth={1.6}
                strokeDasharray="5 3"
                strokeLinejoin="round"
                style={{ transition: "points 0.45s cubic-bezier(0.4,0,0.2,1)" }}
              />
              {comparePreset.scores.map((s, i) => {
                const [x, y] = pt(i, s);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={2.2}
                    fill={comparePreset.color}
                    opacity={0.7}
                  />
                );
              })}
            </g>
          )}

          {/* primary polygon */}
          <g>
            <polygon
              points={polyPoints(primaryPreset.scores)}
              fill={primaryPreset.color}
              fillOpacity={0.11}
              stroke={primaryPreset.color}
              strokeWidth={2.2}
              strokeLinejoin="round"
              style={{
                filter: `drop-shadow(0 0 9px ${primaryPreset.color}88)`,
                transition: "points 0.45s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
            {primaryPreset.scores.map((s, i) => {
              const [x, y] = pt(i, s);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={3}
                  fill={primaryPreset.color}
                  style={{ filter: `drop-shadow(0 0 4px ${primaryPreset.color})` }}
                />
              );
            })}
          </g>

          {/* axis labels */}
          {AXES.map((ax, i) => {
            const [x, y] = pt(i, 1.19);
            const anchor: "middle" | "start" | "end" =
              Math.abs(x - C) < 40 ? "middle" : x > C ? "start" : "end";
            const lines = ax[lang].split("\n");
            return (
              <text
                key={i}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={lang === "zh" ? 12 : 10.5}
                className={`${
                  axis === i ? "fill-flux-400" : "fill-[#767ba2]"
                } ${lang === "zh" ? "zh" : "font-mono"}`}
                style={{
                  letterSpacing: lang === "zh" ? "0.02em" : "0.04em",
                  cursor: "pointer",
                  textTransform: lang === "zh" ? "none" : "uppercase",
                  transition: "fill 0.15s",
                }}
                onMouseEnter={() => setAxis(i)}
                onMouseLeave={() => setAxis(null)}
              >
                {lines.map((line, li) => (
                  <tspan
                    key={li}
                    x={x}
                    dy={li === 0 ? (lines.length > 1 ? "-0.55em" : "0") : "1.25em"}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}

          {/* centre dot */}
          <circle cx={C} cy={C} r={3} fill="rgba(41,151,255,0.30)" />
        </svg>
      </div>

      {/* ─── Controls panel ─── */}
      <div>
        <div className="label-mono">
          {lang === "zh"
            ? "乔布斯方法论 · 建造者原型对比"
            : "jobs method · builder archetypes"}
        </div>

        <div className="mt-4 space-y-2">
          {PRESETS.map((p, pi) => {
            const isPrimary = pi === primary;
            const isCompare = pi === compare;
            const dimmed =
              hover !== null && hover !== pi && !isPrimary && !isCompare;

            return (
              <div
                key={pi}
                className={`flex w-full items-start gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all ${
                  isPrimary
                    ? "border-ink-100/25 bg-void-800/80"
                    : isCompare
                    ? "border-ink-100/15 bg-void-900/60"
                    : "border-ink-100/6 bg-void-950/40"
                } ${dimmed ? "opacity-35" : "opacity-100"}`}
                style={{ transition: "opacity 0.2s, border-color 0.2s" }}
                onMouseEnter={() => setHover(pi)}
                onMouseLeave={() => setHover(null)}
              >
                {/* colour swatch + click-to-set-primary */}
                <button
                  onClick={() => handlePresetClick(pi)}
                  className="flex min-w-0 flex-1 items-start gap-3"
                  aria-pressed={isPrimary}
                >
                  <span
                    className="mt-1 h-3 w-3 flex-none rounded-sm"
                    style={{
                      background: p.color,
                      boxShadow: isPrimary
                        ? `0 0 12px ${p.color}`
                        : isCompare
                        ? `0 0 7px ${p.color}88`
                        : "none",
                    }}
                  />
                  <span className="min-w-0">
                    <span className="display block text-sm text-ink-100">
                      <T v={p.name} />
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-500">
                      <T v={p.note} />
                    </span>
                  </span>
                </button>

                {/* compare toggle button */}
                {!isPrimary && (
                  <button
                    onClick={() => handleCompareToggle(pi)}
                    title={
                      isCompare
                        ? lang === "zh"
                          ? "移除对比"
                          : "Remove overlay"
                        : lang === "zh"
                        ? "添加对比"
                        : "Overlay"
                    }
                    className={`mt-0.5 flex-none rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition ${
                      isCompare
                        ? "border-iris-500/50 bg-iris-500/15 text-iris-400"
                        : "border-ink-100/10 text-ink-500 hover:border-iris-500/40 hover:text-iris-400"
                    }`}
                  >
                    {isCompare
                      ? lang === "zh"
                        ? "取消"
                        : "×"
                      : lang === "zh"
                      ? "对比"
                      : "vs"}
                  </button>
                )}

                {isPrimary && (
                  <span className="mt-0.5 flex-none rounded border border-flux-500/40 bg-flux-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-flux-400">
                    {lang === "zh" ? "选中" : "active"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── axis detail card ─── */}
        <div
          key={axis ?? -1}
          className="mt-6 min-h-[96px] rounded-xl border border-flux-500/20 bg-void-900/60 p-4 lang-fade"
        >
          {axis === null ? (
            <p className="text-sm leading-relaxed text-ink-400">
              <T
                v={{
                  en: "Hover an axis to read what it measures. Click an archetype to morph the polygon; use the vs button to overlay a second archetype for comparison.",
                  zh: "悬停某个轴以阅读它度量什么。点击某个原型，多边形将变形；使用「对比」按钮叠加另一个原型进行比较。",
                }}
              />
            </p>
          ) : (
            <>
              <div className="display text-base flux-glow">
                <T v={AXES[axis]} />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">
                <T v={AXIS_NOTES[axis]} />
              </p>
            </>
          )}
        </div>

        {/* ─── compare legend strip (visible when comparing) ─── */}
        {comparePreset && (
          <div
            className="mt-3 flex items-center gap-4 rounded-lg border border-ink-100/8 bg-void-900/40 px-4 py-2.5"
            style={{ transition: "opacity 0.3s" }}
          >
            <span className="flex items-center gap-2 text-xs text-ink-400">
              <span
                className="inline-block h-2.5 w-5 rounded-sm"
                style={{
                  background: primaryPreset.color,
                  boxShadow: `0 0 8px ${primaryPreset.color}`,
                }}
              />
              <T v={primaryPreset.name} />
            </span>
            <span className="text-xs text-ink-500/40">vs</span>
            <span className="flex items-center gap-2 text-xs text-ink-400">
              <span
                className="inline-block h-2.5 w-5 rounded-sm opacity-70"
                style={{
                  background: comparePreset.color,
                  border: `1px dashed ${comparePreset.color}`,
                }}
              />
              <T v={comparePreset.name} />
            </span>
          </div>
        )}

        {/* ─── interpretive note ─── */}
        <p className="mt-4 border-t border-ink-100/5 pt-3 text-[10px] leading-relaxed text-ink-500/70">
          <T
            v={{
              en: "Scores are an interpretive analytical lens — a way of reading the book's argument spatially. They are not the book's explicit claims, nor verified measurements.",
              zh: "分数是一种诠释性分析视角——一种从空间上阅读本书论点的方式。它们既非本书的明确主张，也非经过验证的量化数据。",
            }}
          />
        </p>
      </div>
    </div>
  );
}
