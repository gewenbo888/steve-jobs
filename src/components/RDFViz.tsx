"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   RDFViz
   Theme 03 — The Reality Distortion Field

   The field is an act of will applied to perceived constraint.
   At low intensity it loosens genuine assumptions — useful, sometimes
   brilliant. At high intensity it erases the difference between assumptions
   that SHOULD be challenged and facts that cannot be. The component holds
   both truths without flinching. Illness is handled with restraint.
═══════════════════════════════════════════════════════════════════════════ */

/* ── palette (raw hex for canvas) ──────────────────────────────────────── */
const C = {
  void950: "#0a0a0b",
  void900: "#111113",
  void800: "#18181b",
  void700: "#232327",
  flux500: "#2997ff",
  flux400: "#6cb8ff",
  iris500: "#a663cc",
  iris400: "#c79be0",
  leaf500: "#61bb46",
  leaf400: "#8fd47a",
  gold500: "#f6a623",
  gold400: "#ffc15e",
  plasm500: "#ff5e5b",
  plasm400: "#ff8a87",
  steel500: "#86868b",
  steel400: "#a1a1a6",
  ink50:   "#f5f5f7",
  ink300:  "#a1a1a6",
  ink500:  "#6e6e73",
};

/* ── deterministic pseudo-random (no Math.random in render) ─────────────── */
function seeded(seed: number, salt: number = 0): number {
  const x = Math.sin(seed * 9301 + salt * 49297 + 233720) * 43758.5453;
  return x - Math.floor(x);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA: CASES — each has a "did it bend?" verdict
   All figures paraphrased / interpreted; none are direct quotes.
═══════════════════════════════════════════════════════════════════════════ */
type Verdict = "bent" | "partially" | "did-not-bend";

interface RDFCase {
  id: string;
  label: { en: string; zh: string };
  challenge: { en: string; zh: string };
  outcome: { en: string; zh: string };
  cost: { en: string; zh: string };
  verdict: Verdict;
  // 0–1 fraction indicating how much reality actually yielded
  yieldFraction: number;
}

const CASES: RDFCase[] = [
  {
    id: "macintosh_deadline",
    label: { en: "The Mac Deadline", zh: "Mac 的截止日期" },
    challenge: {
      en: "Engineers estimated the original Macintosh needed 12 more months. Jobs declared it would ship by Christmas. It did not — it shipped in January 1984, later than his stated date, but years earlier than the engineers' instinct about what 'done' meant.",
      zh: "工程师估计初代 Mac 还需要12个月。乔布斯宣称圣诞节前发货。它没有——1984年1月才发货，晚于他的宣布，但比工程师对「完成」的本能感觉早了几年。",
    },
    outcome: {
      en: "Reality partially bent. The absolute date did not hold, but the team compressed what they thought was two years of work into one. The machine shipped. The assumption that could not yield — finishing quality — was quietly maintained by the engineers themselves.",
      zh: "现实部分弯曲。绝对日期没有守住，但团队将他们认为需要两年的工作压缩到了一年。产品发布了。那个无法让步的假设——完成质量——被工程师们自己悄悄维护着。",
    },
    cost: {
      en: "Extreme working hours for months. At least one key contributor left the company before launch, worn through. The binary verdict — 'hero or bozo' — left scars. Several people who shipped the Mac described it as the best and most damaging work of their lives.",
      zh: "数月极端工时。至少一位核心贡献者在发布前离开，精疲力竭。「英雄还是废物」的二元判断留下了创伤。多位参与 Mac 开发的人描述那是他们人生中最好也是最具破坏性的工作经历。",
    },
    verdict: "partially",
    yieldFraction: 0.62,
  },
  {
    id: "glass_scroll",
    label: { en: "Glass + Touchscreen", zh: "玻璃与触摸屏" },
    challenge: {
      en: "Every engineer and materials scientist in the industry said you could not put a glass face on a consumer phone — it would shatter, it would scratch, no carrier would allow it. Jobs wanted glass, and he wanted it in months.",
      zh: "业界每一位工程师和材料科学家都说消费手机不能用玻璃面板——会碎、会划，没有运营商会允许。乔布斯要玻璃，而且要在几个月内实现。",
    },
    outcome: {
      en: "Reality bent — substantially. Corning accelerated production of a glass it had shelved for decades. The iPhone shipped with a glass face. What the engineers called impossible turned out to be a logistics and will problem, not a physics problem.",
      zh: "现实被显著弯曲了。康宁加速生产了一种搁置数十年的玻璃。iPhone 用玻璃面板发布了。工程师们称之为不可能的事情，结果是一个后勤和意志问题，而不是物理问题。",
    },
    cost: {
      en: "Corning employees and Apple supply-chain teams worked under ferocious pressure. Some described the timeline as reckless. The glass cracked — extensively — in early drop tests; the schedule left no buffer for the failures. That it worked was partly fortune.",
      zh: "康宁员工和苹果供应链团队在极度压力下工作。一些人称时间表是鲁莽的。在早期跌落测试中，玻璃大量破碎；日程没有为失败留下缓冲。它成功了，部分是运气。",
    },
    verdict: "bent",
    yieldFraction: 0.88,
  },
  {
    id: "one_button",
    label: { en: "One Button", zh: "一个按钮" },
    challenge: {
      en: "Conventional UX wisdom held that complex devices needed many inputs. A phone with one button was derided as an interaction model that could never handle the breadth of a phone's functions.",
      zh: "传统 UX 观念认为复杂设备需要多个输入方式。只有一个按钮的手机被嘲笑为一种永远无法处理手机功能广度的交互模型。",
    },
    outcome: {
      en: "Reality bent completely. The constraint forced the software to absorb the complexity that hardware had been hiding. The gesture vocabulary that emerged — pinch, swipe, tap — became the global standard for a generation of computing.",
      zh: "现实被完全弯曲了。这一限制迫使软件吸收了硬件一直在隐藏的复杂性。由此形成的手势词汇——捏合、滑动、点击——成为一代计算的全球标准。",
    },
    cost: {
      en: "Relatively low — the constraint was productive. The cost was borne by software engineers who had to reimagine interaction from scratch. That work was hard but creative, not purely extractive.",
      zh: "相对较低——这个限制是有建设性的。代价由必须从零重新构想交互的软件工程师承担。那项工作是艰难的，但也是有创意的，而非纯粹的榨取。",
    },
    verdict: "bent",
    yieldFraction: 0.95,
  },
  {
    id: "garbage_verdicts",
    label: { en: "The Bozo Verdict", zh: "「废物」判决" },
    challenge: {
      en: "Jobs operated a binary classification system — 'genius' or 'bozo' — applied to both work and to the people who produced it. When something displeased him, the person who made it became, in his declared view, incompetent.",
      zh: "乔布斯运行一套二元分类系统——「天才」或「废物」——同时适用于工作本身和产出它的人。当某样东西让他不满时，在他公开宣布的看法中，做出那东西的人就变成了无能之辈。",
    },
    outcome: {
      en: "This was the field acting on people rather than on problems. It did not bend reality; it bent the people. Some became genuinely better under the pressure; others left, were discarded, or produced their worst work in the shadow of anticipated condemnation.",
      zh: "这是这个场作用于人而非问题。它没有弯曲现实；它弯曲了人。一些人在压力下真正变得更好；另一些人离开了、被抛弃了，或者在预期谴责的阴影下产出了他们最糟糕的工作。",
    },
    cost: {
      en: "Documented and significant. Andy Hertzfeld, Jony Ive, and many others wrote with precision about the psychological damage of this pattern. People who loved their work and did it brilliantly were reduced to wreckage in a single meeting. The field here was not a tool for innovation; it was a display of dominance.",
      zh: "有充分记录，影响显著。安迪·赫茨菲尔德、乔尼·艾夫等许多人都精确地描述了这种模式造成的心理损害。热爱自己工作并出色完成的人，在一次会议中就被打成废墟。这里的场不是创新的工具；而是统治地位的展示。",
    },
    verdict: "did-not-bend",
    yieldFraction: 0.0,
  },
  {
    id: "illness",
    label: { en: "Illness", zh: "疾病" },
    challenge: {
      en: "Jobs delayed conventional treatment for his cancer diagnosis by nine months, applying to his body the same logic he applied to manufacturing timelines: that the constraint was negotiable if the will was sufficient.",
      zh: "乔布斯将确诊癌症后的常规治疗推迟了九个月，将他用于生产时间表的同一逻辑应用于自己的身体：只要意志足够强大，限制就是可以商量的。",
    },
    outcome: {
      en: "Reality did not bend. The biology was not a perceived constraint or a conventional assumption; it was a fact. His doctors believed the delay affected the prognosis. He later described this decision as his greatest regret.",
      zh: "现实没有弯曲。生物学不是一种被感知的约束或常规假设；它是一个事实。他的医生认为这次推迟影响了预后。他后来将这个决定描述为他最大的遗憾。",
    },
    cost: {
      en: "The cost was final, and it was his to bear. We note it here because it is the starkest illustration of the field's limit: a will magnificent enough to change entire industries met a reality that offered no negotiating position. We hold this with care, not as a cautionary anecdote but as a human truth.",
      zh: "代价是终结性的，由他自己承担。我们在此提及，因为这是对这个场边界最鲜明的说明：一种足以改变整个行业的意志，遇到了一个没有任何谈判余地的现实。我们以审慎而非警示故事的方式持有这个真相，而是作为人类共同的事实。",
    },
    verdict: "did-not-bend",
    yieldFraction: 0.0,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FIELD CANVAS — animated wave that warps as strength rises
   The canvas shows a horizontal "reality line" that bends, breaks, and
   reforms as field strength changes.
═══════════════════════════════════════════════════════════════════════════ */
interface FieldCanvasProps {
  strength: number; // 0–1
}

function FieldCanvas({ strength }: FieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef  = useRef(0);
  const rafRef    = useRef(0);
  const lastRef   = useRef(0);
  const strengthRef = useRef(strength);

  useEffect(() => {
    strengthRef.current = strength;
  }, [strength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function tick(ts: number) {
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      phaseRef.current += dt;

      const ctx = canvas!.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }
      const rect = canvas!.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      const s = strengthRef.current;
      const ph = phaseRef.current;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = C.void950;
      ctx.fillRect(0, 0, W, H);

      const midY = H * 0.5;
      const N = 120;

      // ── Draw "reality" as a flat baseline ────────────────────────────────
      ctx.save();
      ctx.strokeStyle = `${C.steel500}30`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(W, midY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── Main distortion wave ──────────────────────────────────────────────
      // At s=0: flat line. At s=1: complex, multi-frequency warp + fractures.
      const amplitude = s * H * 0.38;
      const chaos     = s * s;                  // quadratic — tame at start
      const speed     = 0.8 + s * 1.6;

      // Outer glow pass (wide, soft)
      if (s > 0.05) {
        ctx.save();
        ctx.globalAlpha = s * 0.25;
        const glowColor = s > 0.7 ? C.plasm500 : C.flux500;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 8 + s * 12;
        ctx.lineJoin = "round";
        ctx.filter = `blur(${4 + s * 8}px)`;
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const t  = i / N;
          const x  = t * W;
          // Primary wave
          const y1 = amplitude * Math.sin(t * Math.PI * 3.4 + ph * speed);
          // Secondary harmonic (chaos onset)
          const y2 = chaos * amplitude * 0.42 * Math.sin(t * Math.PI * 7.8 - ph * speed * 1.3 + 1.1);
          // Tertiary (higher chaos)
          const y3 = chaos > 0.4 ? chaos * amplitude * 0.18 * Math.sin(t * Math.PI * 14 + ph * speed * 2.1) : 0;
          const y = midY + y1 + y2 + y3;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Main wave line
      ctx.save();
      // Colour shifts: blue (will) → violet (edge) → coral (rupture)
      const lineColor = s < 0.5
        ? C.flux500
        : s < 0.75
        ? C.iris500
        : C.plasm500;
      const lineAlpha = 0.3 + s * 0.7;
      ctx.globalAlpha = lineAlpha;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth   = 1.5;
      ctx.lineJoin    = "round";

      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const t  = i / N;
        const x  = t * W;
        const y1 = amplitude * Math.sin(t * Math.PI * 3.4 + ph * speed);
        const y2 = chaos * amplitude * 0.42 * Math.sin(t * Math.PI * 7.8 - ph * speed * 1.3 + 1.1);
        const y3 = chaos > 0.4 ? chaos * amplitude * 0.18 * Math.sin(t * Math.PI * 14 + ph * speed * 2.1) : 0;
        const y = midY + y1 + y2 + y3;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // ── "Fracture points" at high field strength ──────────────────────────
      // Vertical cracks appear when the field tries to override physics
      if (s > 0.72) {
        const fracturePts = [0.28, 0.55, 0.78];
        fracturePts.forEach((ft, fi) => {
          const crackAlpha = (s - 0.72) / 0.28;
          const breathe = 0.5 + 0.5 * Math.sin(ph * 3.1 + fi * 2.4);
          const x = ft * W;
          ctx.save();
          ctx.globalAlpha = crackAlpha * breathe * 0.7;
          ctx.strokeStyle = C.plasm400;
          ctx.lineWidth   = 0.8;
          ctx.setLineDash([2, 4]);
          ctx.beginPath();
          ctx.moveTo(x, H * 0.18);
          ctx.lineTo(x, H * 0.82);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        });
      }

      // ── Drifting motes (field particles) ─────────────────────────────────
      const moteCount = Math.floor(s * 18);
      for (let m = 0; m < moteCount; m++) {
        const baseX  = seeded(m, 0) * W;
        const baseY  = seeded(m, 1) * H;
        const drift  = (ph * (0.3 + seeded(m, 2) * 0.4) + seeded(m, 3) * 10) % 1;
        const mx     = (baseX + drift * 30) % W;
        const my     = (baseY - drift * 60 + H) % H;
        const mr     = 0.8 + seeded(m, 4) * 1.6;
        const ma     = 0.2 + seeded(m, 5) * 0.5;
        const moteColor = s > 0.7
          ? (seeded(m, 6) > 0.5 ? C.plasm400 : C.flux400)
          : C.flux400;
        ctx.save();
        ctx.globalAlpha = ma * s;
        ctx.fillStyle   = moteColor;
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Outcome / Cost zone fills (fill above/below line) ─────────────────
      // Above midline = outcomes zone (leaf), below = cost zone (plasm)
      if (s > 0.1) {
        // Outcomes fill (above)
        ctx.save();
        ctx.globalAlpha = s * 0.07;
        ctx.fillStyle = C.leaf500;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, midY);
        for (let i = 0; i <= N; i++) {
          const t  = i / N;
          const x  = t * W;
          const y1 = amplitude * Math.sin(t * Math.PI * 3.4 + ph * speed);
          const y2 = chaos * amplitude * 0.42 * Math.sin(t * Math.PI * 7.8 - ph * speed * 1.3 + 1.1);
          const y = midY + y1 + y2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Cost fill (below)
        ctx.save();
        ctx.globalAlpha = s * 0.07;
        ctx.fillStyle = C.plasm500;
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(0, midY);
        for (let i = 0; i <= N; i++) {
          const t  = i / N;
          const x  = t * W;
          const y1 = amplitude * Math.sin(t * Math.PI * 3.4 + ph * speed);
          const y2 = chaos * amplitude * 0.42 * Math.sin(t * Math.PI * 7.8 - ph * speed * 1.3 + 1.1);
          const y = midY + y1 + y2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full"
      style={{ height: 120 }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DUAL METER: Outcomes (leaf) and Cost (plasm) — animated fill bars
═══════════════════════════════════════════════════════════════════════════ */
interface DualMeterProps {
  strength: number; // 0–1
  lang: "en" | "zh";
}

function DualMeter({ strength, lang }: DualMeterProps) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  // Outcomes: rises steeply at first, then plateaus (diminishing return) and slightly drops at extremes
  // The curve models: early-field = mostly upside; mid-field = peak; late-field = overreach erodes gains
  const outcomesFn = (s: number): number => {
    if (s < 0.55) return Math.min(s * 1.65, 0.9);
    if (s < 0.78) return 0.9 + (s - 0.55) * 0.4 * (1 - (s - 0.55) * 2);
    return Math.max(0.9 - (s - 0.78) * 1.2, 0.62);
  };

  // Cost: starts low, accelerates after ~0.45, spikes toward 1.0 at max
  const costFn = (s: number): number => {
    if (s < 0.3) return s * 0.3;
    if (s < 0.6) return 0.09 + Math.pow((s - 0.3) / 0.3, 1.8) * 0.38;
    return 0.47 + Math.pow((s - 0.6) / 0.4, 1.4) * 0.53;
  };

  const outcomes = outcomesFn(strength);
  const cost     = costFn(strength);

  const meters = [
    {
      key: "outcomes",
      label:   { en: "OUTCOMES METER", zh: "成果指标" },
      sublabel: { en: "shipped · impossible · legendary", zh: "已发布 · 不可能 · 传奇" },
      value: outcomes,
      color: C.leaf500,
      dimColor: C.leaf400,
      fill: `linear-gradient(90deg, ${C.leaf500}55, ${C.leaf400}cc)`,
      description: {
        en: outcomes > 0.82
          ? "The field is at peak creative power. Constraints collapse. The genuinely negotiable assumptions get renegotiated."
          : outcomes > 0.55
          ? "The field is working. Teams are doing what they said couldn't be done. The machine is producing."
          : "At low field strength, the creative pressure is modest — more good management than distortion.",
        zh: outcomes > 0.82
          ? "这个场处于创造力的巅峰。约束崩溃了。那些真正可以商量的假设被重新协商了。"
          : outcomes > 0.55
          ? "这个场正在发挥作用。团队在做他们说不可能的事情。机器在运转。"
          : "在低场强下，创造性压力是适度的——更像是好的管理，而非扭曲。",
      },
    },
    {
      key: "cost",
      label:   { en: "COST METER", zh: "代价指标" },
      sublabel: { en: "denial · manipulation · harm", zh: "否认 · 操控 · 伤害" },
      value: cost,
      color: C.plasm500,
      dimColor: C.plasm400,
      fill: `linear-gradient(90deg, ${C.plasm500}55, ${C.plasm400}cc)`,
      description: {
        en: cost > 0.75
          ? "At extreme field strength, the cost is documented and severe: people are broken by the binary verdicts, and the will that bends assumptions also bends people. Some never recovered."
          : cost > 0.4
          ? "The cost is rising. The field that motivates also manipulates. The genius/garbage axis is active. Burnout is in the room."
          : "At low field strength, the human cost is modest. The pressure is mostly productive.",
        zh: cost > 0.75
          ? "在极端场强下，代价有充分记录且是严重的：人们被二元判决摧毁，而弯曲假设的意志也弯曲了人。有些人从未恢复。"
          : cost > 0.4
          ? "代价在上升。激励人的场同样也在操控人。天才/废物轴已激活。倦怠就在眼前。"
          : "在低场强下，人力代价是适度的。压力大体上是有建设性的。",
      },
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {meters.map((m) => (
        <div
          key={m.key}
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: `${m.color}08`,
            border: `1px solid ${m.color}22`,
            boxShadow: strength > 0.5 ? `0 0 40px -18px ${m.color}44` : "none",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <div className="space-y-0.5">
            <p className="label-mono" style={{ color: m.dimColor, fontSize: "0.56rem" }}>
              {m.label[lang === "zh" ? "zh" : "en"]}
            </p>
            <p className="font-mono text-[0.6rem]" style={{ color: C.ink500 }}>
              {m.sublabel[lang === "zh" ? "zh" : "en"]}
            </p>
          </div>

          {/* Bar track */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{ height: 8, background: `${C.void800}` }}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: `${m.value * 100}%`,
                background: m.fill,
                boxShadow: `0 0 10px -2px ${m.color}66`,
                transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>

          {/* Numeric + description */}
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-[0.68rem] leading-relaxed flex-1 ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
              }}
            >
              {m.description[lang === "zh" ? "zh" : "en"]}
            </p>
            <span
              className="font-mono font-bold flex-shrink-0"
              style={{
                fontSize: "1.6rem",
                lineHeight: 1,
                color: m.color,
                textShadow: strength > 0.5 ? `0 0 24px ${m.color}55` : "none",
                transition: "text-shadow 0.4s ease",
              }}
            >
              {Math.round(m.value * 100)}
              <span style={{ fontSize: "0.7rem", fontWeight: 400, color: m.dimColor + "88" }}>%</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VERDICT BADGE
═══════════════════════════════════════════════════════════════════════════ */
function VerdictBadge({ verdict, lang }: { verdict: Verdict; lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const config = {
    bent:           { color: C.leaf500,  label: L("Reality bent", "现实弯曲了")          },
    partially:      { color: C.gold500,  label: L("Partially bent", "部分弯曲")           },
    "did-not-bend": { color: C.plasm500, label: L("Did not bend", "现实未弯曲")           },
  }[verdict];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[0.58rem] tracking-wide rounded-full px-2.5 py-1 ${lang === "zh" ? "zh" : ""}`}
      style={{
        color: config.color,
        background: `${config.color}14`,
        border: `1px solid ${config.color}30`,
      }}
    >
      <span>{verdict === "bent" ? "◈" : verdict === "partially" ? "◐" : "○"}</span>
      {config.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CASE NAVIGATOR (flip through cases)
═══════════════════════════════════════════════════════════════════════════ */
interface CaseNavProps {
  caseIndex: number;
  onPrev: () => void;
  onNext: () => void;
  lang: "en" | "zh";
}

function CaseNav({ caseIndex, onPrev, onNext, lang }: CaseNavProps) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        className="w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[0.7rem] transition-all"
        style={{
          borderColor: `${C.steel500}40`,
          color: C.steel400,
          background: "transparent",
        }}
        aria-label={L("Previous case", "上一案例")}
      >
        ‹
      </button>
      <span className="label-mono" style={{ color: C.steel400, fontSize: "0.56rem" }}>
        {caseIndex + 1} / {CASES.length}
      </span>
      <button
        onClick={onNext}
        className="w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[0.7rem] transition-all"
        style={{
          borderColor: `${C.steel500}40`,
          color: C.steel400,
          background: "transparent",
        }}
        aria-label={L("Next case", "下一案例")}
      >
        ›
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function RDFViz() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  // Field strength 0–100 (slider) → 0–1 for internals
  const [sliderVal, setSliderVal]     = useState(42);
  const [caseIndex, setCaseIndex]     = useState(0);
  const [showTakeaway, setShowTakeaway] = useState(false);

  const strength = sliderVal / 100;
  const currentCase = CASES[caseIndex];

  // Slider field label
  const fieldLabel = (): { en: string; zh: string } => {
    if (sliderVal <= 15) return { en: "Quiet Confidence", zh: "平静的自信" };
    if (sliderVal <= 35) return { en: "Creative Pressure", zh: "创造性压力" };
    if (sliderVal <= 55) return { en: "Conviction in Motion", zh: "信念运转中" };
    if (sliderVal <= 72) return { en: "Sustained Override", zh: "持续压制" };
    if (sliderVal <= 88) return { en: "Distortion at Scale", zh: "大规模扭曲" };
    return { en: "Maximum Field", zh: "最大场强" };
  };

  const fl = fieldLabel();

  // Colour of slider thumb / track
  const sliderColor = sliderVal < 45 ? C.flux500 : sliderVal < 72 ? C.iris500 : C.plasm500;

  return (
    <div className="w-full space-y-10">

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1" style={{ color: C.flux500 }}>
          {L("Theme 03 · The Reality Distortion Field", "主题 03 · 现实扭曲力场")}
        </p>
        <h3 className={`display text-2xl md:text-3xl leading-tight mb-2 ${lang === "zh" ? "zh" : ""}`}
            style={{
              background: `linear-gradient(100deg, ${C.flux400}, ${C.iris400} 55%, ${C.plasm400})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
          {L("The Will That Bends Constraints", "弯曲约束的意志")}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-3 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", ui-serif, serif' }}
        >
          {L(
            "Steve Jobs applied to every constraint the assumption that it was negotiable. This turned out to be correct often enough to change industries, and wrong often enough to break people. The visualization below holds both outcomes honestly. The slider is the field strength — not an endorsement of the field, but a lens through which to understand it.",
            "史蒂夫·乔布斯对待每一个约束，都假设它是可以谈判的。这个假设正确的次数足以改变行业，错误的次数也足以伤害他人。下面的可视化诚实地呈现两种结果。滑块代表场强——不是对这个场的背书，而是理解它的透镜。"
          )}
        </p>
        <div className="rule-flux h-px rounded" />
      </div>

      {/* ── FIELD CANVAS ────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          borderColor: `${sliderColor}22`,
          boxShadow: `0 4px 60px -20px ${sliderColor}44`,
          transition: "border-color 0.5s ease, box-shadow 0.5s ease",
        }}
      >
        <FieldCanvas strength={strength} />
        {/* Zone labels */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ background: C.void900 }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: C.leaf500 }} />
            <span className="font-mono text-[0.58rem]" style={{ color: `${C.leaf500}99` }}>
              {L("Outcomes zone", "成果区")}
            </span>
          </div>
          <span
            className={`font-mono text-[0.64rem] font-bold ${lang === "zh" ? "zh" : ""}`}
            style={{ color: sliderColor }}
          >
            {fl[lang === "zh" ? "zh" : "en"]}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[0.58rem]" style={{ color: `${C.plasm500}99` }}>
              {L("Cost zone", "代价区")}
            </span>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: C.plasm500 }} />
          </div>
        </div>
      </div>

      {/* ── FIELD STRENGTH SLIDER ───────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="label-mono" style={{ color: C.steel400 }}>
            {L("Field Strength", "场强")}
          </span>
          <span
            className="font-mono font-bold text-lg"
            style={{
              color: sliderColor,
              textShadow: `0 0 20px ${sliderColor}55`,
              transition: "color 0.4s ease, text-shadow 0.4s ease",
            }}
          >
            {sliderVal}
            <span style={{ fontSize: "0.7rem", fontWeight: 400, opacity: 0.6 }}> / 100</span>
          </span>
        </div>

        {/* slider */}
        <div className="relative">
          {/* Track background gradient */}
          <div
            className="absolute top-1/2 left-0 right-0 h-1.5 rounded-full -translate-y-1/2 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, ${C.flux500}55, ${C.iris500}55 55%, ${C.plasm500}88)`,
            }}
          />
          {/* Filled portion */}
          <div
            className="absolute top-1/2 left-0 h-1.5 rounded-full -translate-y-1/2 pointer-events-none"
            style={{
              width: `${sliderVal}%`,
              background: `linear-gradient(90deg, ${C.flux500}, ${sliderVal > 55 ? C.iris500 : C.flux400} 55%, ${sliderVal > 72 ? C.plasm500 : C.iris400})`,
              boxShadow: `0 0 8px 0 ${sliderColor}66`,
              transition: "width 0.05s ease",
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="relative w-full appearance-none bg-transparent"
            style={{ height: 24 }}
            aria-label={L("Field strength slider", "场强滑块")}
          />
        </div>

        {/* Tick marks */}
        <div className="flex justify-between px-0.5">
          {[
            { v: 0,   en: "Dormant", zh: "休眠" },
            { v: 35,  en: "Active",  zh: "激活" },
            { v: 72,  en: "Overreach", zh: "过度延伸" },
            { v: 100, en: "Maximum", zh: "最大" },
          ].map((t) => (
            <div key={t.v} className="flex flex-col items-center gap-0.5" style={{ width: 0, position: "relative" }}>
              <span
                className={`font-mono text-[0.52rem] whitespace-nowrap ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: sliderVal >= t.v ? sliderColor : C.ink500,
                  position: "absolute",
                  top: 0,
                  transform: "translateX(-50%)",
                }}
              >
                {t[lang === "zh" ? "zh" : "en"]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DUAL METERS ─────────────────────────────────────────────────────── */}
      <DualMeter strength={strength} lang={lang} />

      {/* ── CASES: DID IT BEND? ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-mono" style={{ color: C.steel400 }}>
            {L("Case Studies — Did It Bend?", "案例研究 — 现实弯曲了吗？")}
          </p>
          <CaseNav
            caseIndex={caseIndex}
            onPrev={() => setCaseIndex((i) => (i - 1 + CASES.length) % CASES.length)}
            onNext={() => setCaseIndex((i) => (i + 1) % CASES.length)}
            lang={lang}
          />
        </div>

        {/* Case dot nav */}
        <div className="flex gap-1.5 items-center">
          {CASES.map((c, i) => {
            const dotColor = c.verdict === "bent"
              ? C.leaf500
              : c.verdict === "partially"
              ? C.gold500
              : C.plasm500;
            return (
              <button
                key={c.id}
                onClick={() => setCaseIndex(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === caseIndex ? 20 : 7,
                  height: 7,
                  background: dotColor,
                  opacity: i === caseIndex ? 1 : 0.35,
                }}
                aria-label={c.label[lang === "zh" ? "zh" : "en"]}
              />
            );
          })}
        </div>

        {/* Case card */}
        <div
          key={currentCase.id + lang}
          className="panel rounded-2xl p-5 space-y-5 rise-in"
          style={{
            borderColor: currentCase.verdict === "bent"
              ? `${C.leaf500}28`
              : currentCase.verdict === "partially"
              ? `${C.gold500}28`
              : `${C.plasm500}28`,
          }}
        >
          {/* Case header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <VerdictBadge verdict={currentCase.verdict} lang={lang} />
                <span
                  className="font-mono text-[0.6rem]"
                  style={{ color: C.ink500 }}
                >
                  {L(
                    `Yield: ${Math.round(currentCase.yieldFraction * 100)}%`,
                    `弯曲程度：${Math.round(currentCase.yieldFraction * 100)}%`
                  )}
                </span>
              </div>
              <h4
                className={`display text-lg leading-tight mt-1 ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink50 }}
              >
                {currentCase.label[lang === "zh" ? "zh" : "en"]}
              </h4>
            </div>

            {/* Yield arc */}
            <svg width={54} height={54} viewBox="0 0 54 54" aria-hidden="true" className="flex-shrink-0">
              <circle cx={27} cy={27} r={22} fill="none" stroke={`${C.void800}`} strokeWidth={4} />
              <circle
                cx={27} cy={27} r={22}
                fill="none"
                stroke={
                  currentCase.verdict === "bent"
                    ? C.leaf500
                    : currentCase.verdict === "partially"
                    ? C.gold500
                    : C.plasm500
                }
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray={`${currentCase.yieldFraction * 138.2} 138.2`}
                strokeDashoffset={34.6}
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
              <text
                x={27} y={31}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize={10}
                fontWeight="bold"
                fill={
                  currentCase.verdict === "bent"
                    ? C.leaf400
                    : currentCase.verdict === "partially"
                    ? C.gold400
                    : C.plasm400
                }
              >
                {Math.round(currentCase.yieldFraction * 100)}%
              </text>
            </svg>
          </div>

          {/* Three-column detail */}
          <div className="grid md:grid-cols-3 gap-3">
            {/* Challenge */}
            <div
              className="rounded-xl p-3.5 space-y-2"
              style={{
                background: `${C.void800}`,
                border: `1px solid ${C.steel500}18`,
              }}
            >
              <p className="label-mono" style={{ color: C.steel400, fontSize: "0.54rem" }}>
                {L("The Challenge", "挑战")}
              </p>
              <p
                className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {currentCase.challenge[lang === "zh" ? "zh" : "en"]}
              </p>
            </div>

            {/* Outcome */}
            <div
              className="rounded-xl p-3.5 space-y-2"
              style={{
                background: `${C.leaf500}07`,
                border: `1px solid ${C.leaf500}20`,
              }}
            >
              <p className="label-mono" style={{ color: C.leaf400, fontSize: "0.54rem" }}>
                {L("What Happened", "结果")}
              </p>
              <p
                className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {currentCase.outcome[lang === "zh" ? "zh" : "en"]}
              </p>
            </div>

            {/* Cost */}
            <div
              className="rounded-xl p-3.5 space-y-2"
              style={{
                background: currentCase.id === "illness" ? `${C.steel500}07` : `${C.plasm500}07`,
                border: `1px solid ${currentCase.id === "illness" ? C.steel500 : C.plasm500}20`,
              }}
            >
              <p
                className="label-mono"
                style={{
                  color: currentCase.id === "illness" ? C.steel400 : C.plasm400,
                  fontSize: "0.54rem",
                }}
              >
                {L("The Cost", "代价")}
              </p>
              <p
                className={`text-[0.7rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {currentCase.cost[lang === "zh" ? "zh" : "en"]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── HONEST TAKEAWAY ─────────────────────────────────────────────────── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          borderColor: `${C.iris500}28`,
          background: `${C.iris500}05`,
        }}
      >
        <button
          onClick={() => setShowTakeaway((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[0.9rem]" style={{ color: C.iris400 }} aria-hidden="true">◈</span>
            <span
              className={`label-mono ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.iris400, letterSpacing: "0.2em" }}
            >
              {L("The Honest Takeaway", "诚实的结论")}
            </span>
          </div>
          <span
            className="font-mono text-[0.8rem] transition-transform duration-300"
            style={{
              transform: showTakeaway ? "rotate(180deg)" : "rotate(0deg)",
              display: "inline-block",
              color: C.iris400,
            }}
          >
            ▼
          </span>
        </button>

        {showTakeaway && (
          <div className="px-5 pb-5 space-y-4 rise-in">
            {/* The real achievement */}
            <div
              className="rounded-xl p-4"
              style={{
                background: `${C.leaf500}07`,
                border: `1px solid ${C.leaf500}20`,
              }}
            >
              <p className="label-mono mb-2" style={{ color: C.leaf400, fontSize: "0.54rem" }}>
                {L("The Real Engine", "真正的引擎")}
              </p>
              <p
                className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {L(
                  "The field worked, repeatedly and verifiably. Glass that experts said was impossible was manufactured at scale within months. A one-button computer interface became the global standard. Deadlines that engineers called reckless produced machines that defined a generation. The mechanism was real: by refusing to accept that constraints were fixed, Jobs caused teams to question assumptions they would otherwise have left unexamined. Many of those assumptions were genuinely false. The impossible got shipped.",
                  "这个场切实发挥了作用，反复且可验证。专家们说不可能的玻璃在几个月内实现了规模化生产。单键计算机交互界面成为了全球标准。工程师们称之为鲁莽的截止日期，造就了定义一个时代的机器。这个机制是真实的：通过拒绝接受约束是固定不变的，乔布斯迫使团队质疑那些他们本来会不假思索留下的假设。那些假设中有许多确实是错误的。所谓不可能的事情被实现了。"
                )}
              </p>
            </div>

            {/* The real harm */}
            <div
              className="rounded-xl p-4"
              style={{
                background: `${C.plasm500}07`,
                border: `1px solid ${C.plasm500}20`,
              }}
            >
              <p className="label-mono mb-2" style={{ color: C.plasm400, fontSize: "0.54rem" }}>
                {L("The Real Harm", "真实的伤害")}
              </p>
              <p
                className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {L(
                  "The same mechanism that renegotiated manufacturing timelines also renegotiated the truth about people. The 'genius or garbage' binary wasn't a management style — it was a field applied to human beings. People who did extraordinary work were publicly declared incompetent on the basis of a single meeting. Some left, carrying the damage. The field did not distinguish between a falsifiable assumption ('this deadline is impossible') and a person's dignity. That distinction mattered, and the field consistently failed to make it.",
                  "那个重新谈判生产时间线的同一机制，也重新谈判了关于人的真相。「天才还是废物」的二元对立不是一种管理风格——而是一种施加于人身上的场。做出了卓越工作的人，仅凭一次会议就被公开宣告无能。一些人带着创伤离开了。这个场没有区分一个可证伪的假设（「这个截止日期不可能实现」）和一个人的尊严。这种区分很重要，而这个场始终未能做到。"
                )}
              </p>
            </div>

            {/* The limit */}
            <div
              className="rounded-xl p-4"
              style={{
                background: `${C.steel500}07`,
                border: `1px solid ${C.steel500}20`,
              }}
            >
              <p className="label-mono mb-2" style={{ color: C.steel400, fontSize: "0.54rem" }}>
                {L("The Limit That Does Not Negotiate", "不可谈判的边界")}
              </p>
              <p
                className={`text-[0.75rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
              >
                {L(
                  "A will powerful enough to change industries is not, in the end, powerful enough to negotiate with a biological fact. Jobs applied to his own illness the same assumption he applied to every other constraint. That assumption was wrong, and he later said so. We note this not to diminish his achievement, and not to moralize, but because it is the clearest demonstration of the field's actual limit: the will to distort reality is a genuine creative instrument up to the edge of facts that do not yield. Knowing where that edge is — in technology, in organizations, and in one's own body — is the difference between the field as a tool and the field as a trap.",
                  "一种足以改变行业的意志，最终并不足以和生物事实谈判。乔布斯将他对每一种约束的假设——它是可以谈判的——也应用于自己的疾病。那个假设是错误的，他后来也这样说了。我们提及这一点不是为了贬低他的成就，也不是为了说教，而是因为这是对这个场真实边界最清晰的说明：扭曲现实的意志是一种真正的创造性工具，直到遇上那些不会让步的事实的边缘。知道那个边缘在哪里——在技术上、在组织中、在自己的身体里——是这个场作为工具与作为陷阱的区别。"
                )}
              </p>
            </div>

            {/* Closing line */}
            <p
              className={`text-[0.73rem] leading-relaxed px-1 ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.iris400,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                borderLeft: `2px solid ${C.iris500}44`,
                paddingLeft: "0.8rem",
              }}
            >
              {L(
                "The field was a real engine of achievement and a real source of harm. It was magnificent and it was damaging. It cannot be reduced to either. A clear-eyed account holds both.",
                "这个场既是真正的成就引擎，也是真正的伤害来源。它是宏大的，也是有破坏性的。它不能被简化为任何一面。清醒的叙述必须同时持有两者。"
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── SLIDER STYLE ──────────────────────────────────────────────────────
         range input custom styling injected inline (no new global CSS)       */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${sliderColor};
          box-shadow: 0 0 0 3px ${sliderColor}28, 0 0 14px -3px ${sliderColor}88;
          cursor: pointer;
          border: none;
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }
        input[type=range]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${sliderColor};
          box-shadow: 0 0 0 3px ${sliderColor}28, 0 0 14px -3px ${sliderColor}88;
          cursor: pointer;
          border: none;
        }
        input[type=range]::-webkit-slider-runnable-track { background: transparent; }
        input[type=range]::-moz-range-track { background: transparent; }
      `}</style>

    </div>
  );
}
