"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "./lang";

/* ─────────────────────────────────────────────────────────────────────────────
   COLOUR PALETTE  (Theme 04 · Controlling the Whole Widget)
───────────────────────────────────────────────────────────────────────────── */
const C = {
  void950: "#0a0a0b",
  void900: "#111113",
  void800: "#18181b",
  void700: "#232327",
  flux500: "#2997ff",   // integrated / seamless
  flux400: "#6cb8ff",
  iris500: "#a663cc",
  iris400: "#c79be0",
  leaf500: "#61bb46",   // openness
  leaf400: "#8fd47a",
  gold500: "#f6a623",
  gold400: "#ffc15e",
  plasm500: "#ff5e5b",  // fragmentation / lock-in seams
  plasm400: "#ff8a87",
  steel500: "#86868b",
  steel400: "#a1a1a6",
  ink50:    "#f5f5f7",
  ink300:   "#a1a1a6",
  ink500:   "#6e6e73",
};

/* ─────────────────────────────────────────────────────────────────────────────
   STACK LAYER DATA
───────────────────────────────────────────────────────────────────────────── */

interface Layer {
  id: string;
  labelEn: string;
  labelZh: string;
  iconEn: string;
  iconZh: string;
  // fragmented: who owns this layer?
  ownerEn: string;
  ownerZh: string;
}

const LAYERS: Layer[] = [
  {
    id: "hardware",
    labelEn: "Hardware",
    labelZh: "硬件",
    iconEn: "Chip · sensors · enclosure",
    iconZh: "芯片 · 传感器 · 外壳",
    ownerEn: "Chip Maker",
    ownerZh: "芯片厂商",
  },
  {
    id: "os",
    labelEn: "Operating System",
    labelZh: "操作系统",
    iconEn: "Kernel · drivers · security",
    iconZh: "内核 · 驱动 · 安全",
    ownerEn: "Platform Vendor",
    ownerZh: "平台供应商",
  },
  {
    id: "apps",
    labelEn: "Applications",
    labelZh: "应用程序",
    iconEn: "First-party apps · APIs",
    iconZh: "原生应用 · 接口",
    ownerEn: "Software Maker",
    ownerZh: "软件厂商",
  },
  {
    id: "content",
    labelEn: "Content",
    labelZh: "内容",
    iconEn: "Music · video · media",
    iconZh: "音乐 · 视频 · 媒体",
    ownerEn: "Content Provider",
    ownerZh: "内容提供商",
  },
  {
    id: "store",
    labelEn: "Distribution",
    labelZh: "分发渠道",
    iconEn: "Store · payments · discovery",
    iconZh: "商店 · 支付 · 发现",
    ownerEn: "Carrier / Retailer",
    ownerZh: "运营商 / 零售商",
  },
];

// colours assigned to fragmented owners (deterministic, not random)
const OWNER_COLORS = [
  C.iris500,
  C.gold500,
  C.plasm500,
  C.leaf500,
  C.steel400,
];

/* ─────────────────────────────────────────────────────────────────────────────
   STACK CANVAS — animated SVG-style stack diagram
───────────────────────────────────────────────────────────────────────────── */

interface StackCanvasProps {
  mode: "integrated" | "fragmented";
  lang: "en" | "zh";
}

function StackCanvas({ mode, lang }: StackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const pulseRef = useRef(0);
  const lastTsRef = useRef(0);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx2 = canvas.getContext("2d");
      if (ctx2) ctx2.scale(dpr, dpr);
    };
    setup();
    const ro = new ResizeObserver(setup);
    ro.observe(canvas);

    const draw = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;
      pulseRef.current += dt * 1.8;

      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.void950;
      ctx.fillRect(0, 0, W, H);

      const isIntegrated = modeRef.current === "integrated";
      const pulse = pulseRef.current;
      const n = LAYERS.length;
      const marginX = W < 360 ? 12 : 24;
      const marginY = 18;
      const availH = H - marginY * 2;
      const layerH = availH / n;
      const gap = 3;
      const blockH = layerH - gap;
      const blockW = W - marginX * 2;

      for (let i = 0; i < n; i++) {
        const layer = LAYERS[i];
        const y = marginY + i * layerH;

        // seam / friction line above this layer (except first)
        if (i > 0 && !isIntegrated) {
          const seamY = y - gap / 2 - 1;
          // jagged seam animation
          ctx.save();
          ctx.strokeStyle = `${C.plasm500}99`;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = C.plasm500;
          ctx.shadowBlur = 8 + 4 * Math.sin(pulse + i);
          ctx.setLineDash([3, 4]);
          ctx.lineDashOffset = (pulse * 14) % 7;
          ctx.beginPath();
          ctx.moveTo(marginX, seamY);
          ctx.lineTo(marginX + blockW, seamY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        // integrated: flux glow joins. fragmented: owner-colour box
        const fillColor = isIntegrated ? C.flux500 : OWNER_COLORS[i];
        const glowColor = isIntegrated ? C.flux500 : OWNER_COLORS[i];
        const borderAlpha = isIntegrated
          ? 0.52 + 0.22 * Math.sin(pulse - i * 0.5)
          : 0.4;
        const fillAlpha = isIntegrated ? 0.14 : 0.08;
        const glowBlur = isIntegrated
          ? 18 + 8 * Math.sin(pulse - i * 0.6)
          : 6 + 2 * Math.sin(pulse + i * 0.9);

        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowBlur;
        ctx.strokeStyle = hexAlpha(fillColor, borderAlpha);
        ctx.fillStyle = hexAlpha(fillColor, fillAlpha);
        ctx.lineWidth = isIntegrated ? 1.5 : 1.0;
        ctx.beginPath();
        ctx.roundRect(marginX, y, blockW, blockH, 6);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // integrated: lock-bracket connectors between layers
        if (isIntegrated && i < n - 1) {
          const midX = marginX + blockW * 0.5;
          const seamY2 = y + blockH;
          const nextY = marginY + (i + 1) * layerH;
          const lockAlpha = 0.55 + 0.2 * Math.sin(pulse - i * 0.8);
          ctx.save();
          ctx.strokeStyle = hexAlpha(C.flux400, lockAlpha);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(midX - 20, seamY2 + 1);
          ctx.lineTo(midX - 20, nextY - 1);
          ctx.moveTo(midX + 20, seamY2 + 1);
          ctx.lineTo(midX + 20, nextY - 1);
          // horizontal tick at top
          ctx.moveTo(midX - 22, seamY2 + 1);
          ctx.lineTo(midX - 18, seamY2 + 1);
          ctx.moveTo(midX + 18, seamY2 + 1);
          ctx.lineTo(midX + 22, seamY2 + 1);
          // horizontal tick at bottom
          ctx.moveTo(midX - 22, nextY - 1);
          ctx.lineTo(midX - 18, nextY - 1);
          ctx.moveTo(midX + 18, nextY - 1);
          ctx.lineTo(midX + 22, nextY - 1);
          ctx.stroke();
          ctx.restore();
        }

        // layer name
        const label = langRef.current === "zh" ? layer.labelZh : layer.labelEn;
        const sublabel = langRef.current === "zh" ? layer.iconZh : layer.iconEn;
        const ownerLabel = langRef.current === "zh" ? layer.ownerZh : layer.ownerEn;

        const textX = marginX + 14;
        const textY = y + blockH / 2;
        const fontSize = W < 360 ? 8.5 : 10;

        ctx.save();
        ctx.font = `700 ${fontSize}px 'Manrope', sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = isIntegrated ? C.flux400 : OWNER_COLORS[i];
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isIntegrated ? 6 : 3;
        ctx.fillText(label, textX, textY - (W < 360 ? 4 : 5));
        ctx.restore();

        ctx.save();
        ctx.font = `${W < 360 ? 6 : 7.5}px 'JetBrains Mono', monospace`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = hexAlpha(isIntegrated ? C.ink300 : OWNER_COLORS[i], 0.58);
        ctx.fillText(sublabel, textX, textY + (W < 360 ? 5 : 6));
        ctx.restore();

        // fragmented: owner badge on right
        if (!isIntegrated) {
          const ownerColor = OWNER_COLORS[i];
          const badgeW = W < 360 ? 60 : 80;
          const badgeH = 16;
          const badgeX = marginX + blockW - badgeW - 8;
          const badgeY2 = y + (blockH - badgeH) / 2;

          ctx.save();
          ctx.fillStyle = hexAlpha(ownerColor, 0.15);
          ctx.strokeStyle = hexAlpha(ownerColor, 0.55);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY2, badgeW, badgeH, 4);
          ctx.fill();
          ctx.stroke();
          ctx.font = `600 ${W < 360 ? 6 : 7}px 'JetBrains Mono', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = ownerColor;
          ctx.fillText(ownerLabel, badgeX + badgeW / 2, badgeY2 + badgeH / 2);
          ctx.restore();
        }
      }

      // integrated: single "Apple" ownership badge spanning all layers
      if (isIntegrated) {
        const badgeH = 22;
        const badgeW = W < 360 ? 58 : 72;
        const bx = marginX + blockW - badgeW - 6;
        const by2 = marginY + (availH - badgeH) / 2;
        const breathe = 0.7 + 0.15 * Math.sin(pulse * 0.8);

        ctx.save();
        ctx.globalAlpha = breathe;
        ctx.fillStyle = hexAlpha(C.flux500, 0.18);
        ctx.strokeStyle = hexAlpha(C.flux400, 0.72);
        ctx.lineWidth = 1.2;
        ctx.shadowColor = C.flux500;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(bx, by2, badgeW, badgeH, 5);
        ctx.fill();
        ctx.stroke();
        ctx.font = `700 ${W < 360 ? 7 : 8.5}px 'Manrope', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = C.flux400;
        ctx.shadowColor = C.flux400;
        ctx.shadowBlur = 8;
        ctx.fillText(langRef.current === "zh" ? "Apple" : "Apple", bx + badgeW / 2, by2 + badgeH / 2);
        ctx.restore();

        // vertical bracket line
        ctx.save();
        ctx.strokeStyle = hexAlpha(C.flux400, 0.4);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bx - 6, marginY);
        ctx.lineTo(bx - 6, marginY + availH - gap);
        ctx.moveTo(bx - 6, marginY);
        ctx.lineTo(bx - 3, marginY);
        ctx.moveTo(bx - 6, marginY + availH - gap);
        ctx.lineTo(bx - 3, marginY + availH - gap);
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  const ariaLabel = lang === "zh"
    ? mode === "integrated" ? "垂直整合堆栈示意图" : "碎片化生态系统堆栈示意图"
    : mode === "integrated" ? "Integrated stack diagram" : "Fragmented ecosystem stack diagram";

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-label={ariaLabel}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITY
───────────────────────────────────────────────────────────────────────────── */

function hexAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   TRADEOFF METER — seamlessness vs openness slider
───────────────────────────────────────────────────────────────────────────── */

interface TradeoffMeterProps {
  value: number; // 0 = fully open/fragmented, 100 = fully integrated/closed
  onChange: (v: number) => void;
  lang: "en" | "zh";
}

function TradeoffMeter({ value, onChange, lang }: TradeoffMeterProps) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const seamless = value;
  const openness = 100 - value;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="label-mono" style={{ color: C.flux400 }}>
          {L("Your Weighting", "你的权重")}
        </span>
        <div className="flex items-center gap-3 text-[0.68rem] font-mono">
          <span style={{ color: C.flux400 }}>{L("Seamlessness", "无缝体验")} {seamless}%</span>
          <span style={{ color: C.steel400 }}>·</span>
          <span style={{ color: C.leaf400 }}>{L("Openness", "开放性")} {openness}%</span>
        </div>
      </div>

      {/* slider track */}
      <div className="relative h-8 flex items-center">
        <div
          className="absolute inset-y-0 left-0 right-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${C.flux500}33, ${C.leaf500}33)`,
            top: "50%",
            height: "6px",
            transform: "translateY(-50%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-none"
          style={{
            width: `${value}%`,
            height: "6px",
            top: "50%",
            transform: "translateY(-50%)",
            background: `linear-gradient(90deg, ${C.flux500}cc, ${C.plasm500}88)`,
            boxShadow: `0 0 12px -2px ${C.flux500}88`,
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="relative w-full h-8 appearance-none bg-transparent cursor-pointer"
          style={{ accentColor: C.flux400 }}
          aria-label={L("Seamlessness vs openness weighting", "无缝体验与开放性权重")}
        />
      </div>

      {/* poles */}
      <div className="flex justify-between text-[0.64rem] font-mono">
        <span style={{ color: C.leaf400 }}>
          {L("← Open / Fragmented", "← 开放 / 碎片化")}
        </span>
        <span style={{ color: C.flux400 }}>
          {L("Integrated / Closed →", "整合 / 封闭 →")}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export default function IntegrationViz() {
  const { lang } = useLang();
  const L = useCallback((en: string, zh: string) => lang === "zh" ? zh : en, [lang]);

  const [mode, setMode] = useState<"integrated" | "fragmented">("integrated");
  const [tradeoff, setTradeoff] = useState(65); // default: lean slightly toward seamlessness

  const isIntegrated = mode === "integrated";

  // derived commentary from tradeoff slider
  const tradeoffComment = (() => {
    if (tradeoff <= 20) return L(
      "You prioritise openness and ecosystem diversity above all. The friction of fragmented systems is an acceptable price for choice and competition.",
      "你将开放性与生态多样性置于首位。碎片化系统的摩擦是选择与竞争的可接受代价。",
    );
    if (tradeoff <= 45) return L(
      "You lean open. Fragmentation costs are real, but so is the danger of a single gatekeeper deciding what runs on the platform you own.",
      "你偏向开放。碎片化的代价是真实的，但单一守门人决定你设备上能运行什么的危险同样真实。",
    );
    if (tradeoff <= 55) return L(
      "You hold the tension evenly: seamlessness and openness both matter, and neither wholly wins. The right answer depends on context.",
      "你平衡地持守这一张力：无缝体验与开放性同等重要，两者都无法完全胜出。正确答案取决于具体情境。",
    );
    if (tradeoff <= 80) return L(
      "You lean integrated. The experience gains from a coherent stack are worth the trade-off — as long as the gatekeeper earns trust and doesn't abuse the position.",
      "你偏向整合。连贯堆栈带来的体验收益值得这种权衡——只要守门人赢得信任，不滥用地位。",
    );
    return L(
      "You strongly favour integration. The user experience of one coherent object justifies the walled garden — and history suggests consumers largely agreed, at least for premium markets.",
      "你强烈倾向于整合。单一连贯产品的用户体验证明了围墙花园的合理性——历史表明消费者在很大程度上认同这一点，至少在高端市场如此。",
    );
  })();

  return (
    <div className="w-full flex flex-col gap-10">

      {/* ── Section header ── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono" style={{ color: C.flux400 }}>
          {L("Theme 04 · Controlling the Whole Widget", "主题04 · 掌控整个产品")}
        </div>
        <h2 className={`display text-3xl md:text-4xl leading-tight spark-text${lang === "zh" ? " zh" : ""}`}>
          {L("The Integrated Stack", "垂直整合堆栈")}
        </h2>
        <p
          className={`text-sm max-w-2xl leading-relaxed${lang === "zh" ? " zh" : ""}`}
          style={{
            color: C.ink300,
            fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
          }}
        >
          {L(
            "Jobs had a cardinal conviction: when one company controls every layer — from the silicon to the software to the store — the result can be tuned as a single instrument. When no one does, you get a compromise. Toggle the modes and watch the stack.",
            "乔布斯有一个根本信念：当一家公司掌控每一层——从芯片到软件再到商店——结果可以像单件乐器一样精调。当没有人这样做时，你得到的是妥协。切换模式，观察堆栈。",
          )}
        </p>
      </div>

      <div className="h-px rule-flux opacity-40 rounded-full" />

      {/* ── MODE TOGGLE ── */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="label-mono" style={{ color: C.steel400 }}>
            {L("Architecture Mode", "架构模式")}
          </div>
          <div
            className="flex items-center rounded-full border overflow-hidden text-[0.72rem] font-mono"
            style={{ borderColor: `${C.steel400}30` }}
          >
            <button
              onClick={() => setMode("integrated")}
              className="px-4 py-2 transition-all duration-300"
              style={{
                background: isIntegrated ? hexAlpha(C.flux500, 0.2) : "transparent",
                color: isIntegrated ? C.flux400 : C.steel400,
                borderRight: `1px solid ${C.steel400}25`,
              }}
            >
              {L("Integrated", "整合")}
            </button>
            <button
              onClick={() => setMode("fragmented")}
              className="px-4 py-2 transition-all duration-300"
              style={{
                background: !isIntegrated ? hexAlpha(C.plasm500, 0.2) : "transparent",
                color: !isIntegrated ? C.plasm400 : C.steel400,
              }}
            >
              {L("Fragmented", "碎片化")}
            </button>
          </div>
        </div>

        {/* ── TWO-PANEL DIAGRAM ── */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Stack canvas */}
          <div
            className="relative rounded-2xl overflow-hidden border transition-all duration-500"
            style={{
              background: C.void950,
              borderColor: isIntegrated
                ? hexAlpha(C.flux500, 0.32)
                : hexAlpha(C.plasm500, 0.25),
              boxShadow: isIntegrated
                ? `0 0 60px -28px ${C.flux500}55`
                : `0 0 40px -20px ${C.plasm500}44`,
              minHeight: 280,
            }}
          >
            <div style={{ height: 300 }}>
              <StackCanvas mode={mode} lang={lang} />
            </div>

            {/* Mode caption bar */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center gap-2"
              style={{
                background: isIntegrated
                  ? hexAlpha(C.flux500, 0.12)
                  : hexAlpha(C.plasm500, 0.1),
                borderTop: `1px solid ${isIntegrated ? hexAlpha(C.flux500, 0.22) : hexAlpha(C.plasm500, 0.18)}`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 pulse"
                style={{ backgroundColor: isIntegrated ? C.flux400 : C.plasm400 }}
              />
              <span
                className={`text-[0.68rem] font-mono${lang === "zh" ? " zh" : ""}`}
                style={{ color: isIntegrated ? C.flux400 : C.plasm400 }}
              >
                {isIntegrated
                  ? L("All layers: Apple. One tuned instrument.", "所有层：Apple。一件精调的乐器。")
                  : L("Five layers, five owners. Friction at every seam.", "五个层次，五个所有者。每条接缝都有摩擦。")}
              </span>
            </div>
          </div>

          {/* Explainer / case study panel */}
          <div className="flex flex-col gap-4">
            {isIntegrated ? (
              <>
                <div
                  className={`panel rounded-2xl p-5 flex flex-col gap-3 transition-all duration-500${lang === "zh" ? " zh" : ""}`}
                  style={{ borderColor: hexAlpha(C.flux500, 0.25) }}
                >
                  <div className="label-mono" style={{ color: C.flux400 }}>
                    {L("The iPhone Model, 2007", "iPhone 模式，2007年")}
                  </div>
                  <p
                    className={`text-[0.78rem] leading-relaxed${lang === "zh" ? " zh" : ""}`}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                    }}
                  >
                    {L(
                      "When Jobs unveiled the iPhone, every layer was Apple's: the ARM cores were Apple-licensed and later Apple-designed, iOS was Apple's, the App Store was Apple's, iTunes and the content deals were Apple's. Nothing was farmed out to a carrier to cripple or a software vendor to slow down. The result was a device that behaved like a single thought — fluid, fast, coherent.",
                      "当乔布斯发布iPhone时，每一层都属于Apple：ARM核心由Apple授权并后来自研，iOS是Apple的，App Store是Apple的，iTunes和内容合同是Apple的。没有任何部分交给运营商去阉割，或交给软件供应商去拖慢。结果是一台行为如同单一意念的设备——流畅、快速、连贯。",
                    )}
                  </p>
                </div>

                <div
                  className={`panel rounded-2xl p-5 flex flex-col gap-3${lang === "zh" ? " zh" : ""}`}
                  style={{ borderColor: hexAlpha(C.plasm500, 0.18) }}
                >
                  <div className="label-mono" style={{ color: C.plasm400 }}>
                    {L("The cost: the walled garden", "代价：围墙花园")}
                  </div>
                  <p
                    className={`text-[0.78rem] leading-relaxed${lang === "zh" ? " zh" : ""}`}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                    }}
                  >
                    {L(
                      "Integration delivers polish — and also gatekeeping. Apple can remove an app, set the rules for what competes with its own services, take a 30% commission, and decide what hardware runs iOS. Seamlessness and control are not two products. They are the same product.",
                      "整合带来精致——也带来守门权。Apple可以下架应用、制定与自身服务竞争的规则、抽取30%佣金、决定什么硬件可以运行iOS。无缝体验与控制权不是两个产品。它们是同一个产品。",
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`panel rounded-2xl p-5 flex flex-col gap-3 transition-all duration-500${lang === "zh" ? " zh" : ""}`}
                  style={{ borderColor: hexAlpha(C.plasm500, 0.25) }}
                >
                  <div className="label-mono" style={{ color: C.plasm400 }}>
                    {L("The ROKR Model, 2005", "ROKR 模式，2005年")}
                  </div>
                  <p
                    className={`text-[0.78rem] leading-relaxed${lang === "zh" ? " zh" : ""}`}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                    }}
                  >
                    {L(
                      "Motorola built the handset. Cingular controlled the network and the carrier billing. Apple supplied the iTunes software. The music labels owned the content. Each party optimised for its own margin. The result was a phone that could hold 100 songs — capped by Cingular, worried about lost ringtone revenue — and required three logins to buy one track. Usability was nobody's job.",
                      "摩托罗拉制造手机。Cingular控制网络和运营商计费。Apple提供iTunes软件。音乐公司拥有内容。每一方都为自己的利润优化。结果是一部能存放100首歌的手机——被Cingular强制限制上限，担心铃声收入受损——购买一首歌需要三次登录。用户体验是无人负责的事。",
                    )}
                  </p>
                </div>

                <div
                  className={`panel rounded-2xl p-5 flex flex-col gap-3${lang === "zh" ? " zh" : ""}`}
                  style={{ borderColor: hexAlpha(C.leaf500, 0.18) }}
                >
                  <div className="label-mono" style={{ color: C.leaf400 }}>
                    {L("The benefit: open ecosystems scale", "优势：开放生态系统具有规模效应")}
                  </div>
                  <p
                    className={`text-[0.78rem] leading-relaxed${lang === "zh" ? " zh" : ""}`}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                    }}
                  >
                    {L(
                      "The systems Jobs dismissed — Android, the open web, the PC — now run the numerical majority of the world's devices. Open ecosystems absorb more contributors, more use cases, more price points. They are messier and less polished. They are also harder to kill. The 96% of the smartphone market not using an iPhone is evidence that fragmentation has its own vitality.",
                      "乔布斯所不屑的系统——Android、开放网络、PC——如今运行着全球数量最多的设备。开放生态系统吸纳了更多贡献者、更多使用场景、更多价位。它们更混乱、更缺乏精致感。它们也更难被消灭。全球智能手机市场96%不使用iPhone，证明碎片化有其独特的生命力。",
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── FAIR COUNTER-PANEL ── */}
      <div className="flex flex-col gap-5">
        <div className="label-mono" style={{ color: C.gold500 }}>
          {L("The Honest Ledger", "诚实账本")}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Integration pros/cons */}
          <div
            className={`panel rounded-2xl p-5 flex flex-col gap-4${lang === "zh" ? " zh" : ""}`}
            style={{ borderColor: hexAlpha(C.flux500, 0.22) }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.flux400 }} />
              <span className="label-mono" style={{ color: C.flux400 }}>
                {L("Integration", "垂直整合")}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                {
                  sign: "+",
                  color: C.flux400,
                  text: L(
                    "Single design authority: hardware and software can be co-designed atom by atom. The M-series chips are impossible without owning both sides.",
                    "单一设计权威：硬件与软件可以逐原子地协同设计。M系列芯片若不同时拥有两端，便不可能实现。",
                  ),
                },
                {
                  sign: "+",
                  color: C.flux400,
                  text: L(
                    "Security and privacy are easier to enforce when you control the full stack. Carrier-installed spyware is architecturally impossible.",
                    "当你掌控整个堆栈时，安全与隐私更容易实施。运营商预装间谍软件在架构上不可能发生。",
                  ),
                },
                {
                  sign: "–",
                  color: C.plasm400,
                  text: L(
                    "Gatekeeping: one company decides what software can run, what payment methods exist, and which competing services are allowed. The EU's Digital Markets Act is a direct response.",
                    "守门权：一家公司决定哪些软件可以运行、哪些支付方式存在、哪些竞争服务被允许。欧盟《数字市场法》是对此的直接回应。",
                  ),
                },
                {
                  sign: "–",
                  color: C.plasm400,
                  text: L(
                    "Lock-in by design: switching costs are deliberately high. iMessage, iCloud, AirDrop, Handoff — each is a thread in a net that makes leaving expensive.",
                    "刻意设计的锁定：转换成本被蓄意提高。iMessage、iCloud、AirDrop、Handoff——每一个都是网中的一根线，使离开代价高昂。",
                  ),
                },
              ].map(({ sign, color, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center font-mono text-[0.65rem] font-bold mt-0.5"
                    style={{ background: hexAlpha(color, 0.15), color }}
                  >
                    {sign}
                  </span>
                  <p
                    className={`text-[0.74rem] leading-relaxed${lang === "zh" ? " zh" : ""}`}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fragmentation pros/cons */}
          <div
            className={`panel rounded-2xl p-5 flex flex-col gap-4${lang === "zh" ? " zh" : ""}`}
            style={{ borderColor: hexAlpha(C.leaf500, 0.2) }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.leaf400 }} />
              <span className="label-mono" style={{ color: C.leaf400 }}>
                {L("Open / Fragmented", "开放 / 碎片化")}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                {
                  sign: "+",
                  color: C.leaf400,
                  text: L(
                    "Scale and diversity: Android runs on $50 phones in rural India and $1,500 flagship foldables. No single company can serve that range alone.",
                    "规模与多样性：Android运行在印度农村的50美元手机和1500美元旗舰折叠屏上。没有单一公司能独自服务这一范围。",
                  ),
                },
                {
                  sign: "+",
                  color: C.leaf400,
                  text: L(
                    "Competition between layers: when hardware is separated from software, dozens of makers compete on each dimension. Prices fall; niches are served.",
                    "层间竞争：当硬件与软件分离，数十家制造商在每个维度上竞争。价格下降；利基市场得到服务。",
                  ),
                },
                {
                  sign: "–",
                  color: C.plasm400,
                  text: L(
                    "Nobody owns the whole experience. Every Android OEM's update schedule, every carrier's bloatware, every chip vendor's driver—all diverge. Security patches take a year to reach most devices.",
                    "没有人拥有完整体验。每家Android OEM的更新计划、每家运营商的预装软件、每家芯片厂商的驱动——全都分歧。安全补丁需要一年才能到达大多数设备。",
                  ),
                },
                {
                  sign: "–",
                  color: C.plasm400,
                  text: L(
                    "Race to the bottom on margin means less investment in depth. The committee compromise is real: features that require hardware + software co-design (Face ID, Neural Engine, Taptic feedback) took Android years to approximate.",
                    "利润率的竞底意味着深度投入减少。委员会妥协是真实的：需要硬件+软件协同设计的功能（Face ID、神经引擎、Taptic反馈）让Android花了数年才接近。",
                  ),
                },
              ].map(({ sign, color, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center font-mono text-[0.65rem] font-bold mt-0.5"
                    style={{ background: hexAlpha(color, 0.15), color }}
                  >
                    {sign}
                  </span>
                  <p
                    className={`text-[0.74rem] leading-relaxed${lang === "zh" ? " zh" : ""}`}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── TRADEOFF METER ── */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="label-mono" style={{ color: C.steel400 }}>
            {L("Weigh the Tradeoff", "权衡取舍")}
          </div>
          <p
            className={`text-[0.74rem] leading-relaxed max-xl${lang === "zh" ? " zh" : ""}`}
            style={{
              color: C.ink500,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {L(
              "Slide to indicate how much you value seamless experience relative to openness and user freedom. There is no correct answer — only your answer.",
              "滑动以表明你对无缝体验相对于开放性和用户自由的重视程度。没有正确答案——只有你的答案。",
            )}
          </p>
        </div>

        <div
          className="panel rounded-2xl p-5 flex flex-col gap-4"
          style={{ borderColor: hexAlpha(C.flux500, 0.18) }}
        >
          <TradeoffMeter value={tradeoff} onChange={setTradeoff} lang={lang} />

          {/* Dynamic commentary */}
          <div
            className={`rounded-xl border px-4 py-3 text-[0.76rem] leading-relaxed transition-all duration-300${lang === "zh" ? " zh" : ""}`}
            style={{
              borderColor: tradeoff > 50
                ? hexAlpha(C.flux500, 0.22)
                : hexAlpha(C.leaf500, 0.22),
              background: tradeoff > 50
                ? hexAlpha(C.flux500, 0.06)
                : hexAlpha(C.leaf500, 0.06),
              color: C.ink300,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {tradeoffComment}
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: L("Apple market share (phones)", "Apple手机市场份额"),
              value: "~17%",
              sub: L("Global units, 2024", "全球出货量，2024年"),
              color: C.flux400,
            },
            {
              label: L("Revenue per iPhone user", "每位iPhone用户收入"),
              value: "~$1,000",
              sub: L("vs ~$200 Android avg", "vs Android约$200"),
              color: C.gold400,
            },
            {
              label: L("App Store commission", "App Store佣金"),
              value: "15–30%",
              sub: L("On all digital sales", "所有数字销售"),
              color: C.plasm400,
            },
          ].map(({ label, value, sub, color }) => (
            <div
              key={label}
              className="panel rounded-xl px-4 py-3 flex flex-col gap-1"
              style={{ borderColor: hexAlpha(color, 0.2) }}
            >
              <span
                className={`text-[0.58rem] font-mono uppercase tracking-widest${lang === "zh" ? " zh" : ""}`}
                style={{ color: hexAlpha(color, 0.7) }}
              >
                {label}
              </span>
              <span
                className="font-mono text-base font-bold"
                style={{ color }}
              >
                {value}
              </span>
              <span
                className={`text-[0.62rem]${lang === "zh" ? " zh" : ""}`}
                style={{ color: C.ink500 }}
              >
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── CLOSING OBSERVATION ── */}
      <div
        className={`rounded-xl border px-5 py-4 text-sm leading-relaxed${lang === "zh" ? " zh" : ""}`}
        style={{
          borderColor: hexAlpha(C.flux500, 0.16),
          background: hexAlpha(C.flux500, 0.04),
          fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
          color: hexAlpha(C.ink300, 0.88),
        }}
      >
        {L(
          "The walled garden is not incidental to the Apple experience — it is the Apple experience. The seamlessness users praise and the gatekeeping critics condemn are produced by the same architectural decision. Jobs was not wrong that integration creates better products in the narrow sense. The question his successors face, and that regulators are now forcing open, is whether a product that is better precisely because it is closed is compatible with a healthy, competitive market. The stack diagram above is not a technical curiosity. It is a power map.",
          "围墙花园并非Apple体验的附带产物——它本身就是Apple体验。用户称赞的无缝体验和批评者谴责的守门权，由同一个架构决策产生。乔布斯关于整合在狭义上创造更好产品并没有错。他的继任者面临的问题，以及监管机构正在强制打开的问题是：一个恰恰因为封闭而更好的产品，是否与健康、竞争性的市场相容。上方的堆栈图不是一个技术趣闻。它是一张权力地图。",
        )}
      </div>

    </div>
  );
}
