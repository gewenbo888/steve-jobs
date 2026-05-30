"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   TasteViz
   Theme 08 — Taste, Craft & Perfection

   Centerpiece: "The Back of the Fence" — Jobs's adoptive father Paul taught
   him to finish the back of a fence as carefully as the front, because a
   craftsman cares about the parts no one sees. Interactive flip/reveal:
   front view (polished product) ↔ back (internal architecture, circuit layout,
   the part only the maker sees). Paired with "real artists ship" and
   "taste can be cultivated." Fair cost panel: the same perfectionism produced
   cruelty, ruin, and borrowed genius.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── palette ─── */
const C = {
  void:   "#0a0a0b",
  void9:  "#111113",
  void8:  "#18181b",
  void7:  "#232327",
  // flux = Apple-blue
  flux5:  "#2997ff",
  flux4:  "#6cb8ff",
  // iris = violet
  iris5:  "#a663cc",
  iris4:  "#c79be0",
  // leaf = craft green (shipped)
  leaf5:  "#61bb46",
  leaf4:  "#8fd47a",
  // gold = unseen craft, amber
  gold5:  "#f6a623",
  gold4:  "#ffc15e",
  // plasm = cost of perfectionism, coral-red
  plasm5: "#ff5e5b",
  plasm4: "#ff8a87",
  // steel = circuit / interior silver
  steel5: "#86868b",
  steel4: "#a1a1a6",
  // ink
  ink50:  "#f5f5f7",
  ink3:   "#a1a1a6",
  ink5:   "#6e6e73",
} as const;

/* helper */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

/* ─── FRONT panel canvas: polished product exterior ────────────────────── */
function drawFront(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number
) {
  ctx.clearRect(0, 0, w, h);

  const t = frame * 0.016;

  // aluminium body
  const bodyGrad = ctx.createLinearGradient(0, 0, w, h);
  bodyGrad.addColorStop(0, "#232327");
  bodyGrad.addColorStop(0.5, "#2e2e33");
  bodyGrad.addColorStop(1, "#1a1a1e");
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, 24, 20, w - 48, h - 40, 28);
  ctx.fill();

  // subtle brushed-metal sheen lines
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 18; i++) {
    const y = 28 + i * ((h - 56) / 18);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(24, y);
    ctx.lineTo(w - 24, y);
    ctx.stroke();
  }
  ctx.restore();

  // outer border — chamfered aluminum edge glow
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, 24, 20, w - 48, h - 40, 28);
  ctx.stroke();

  // screen bezel area (centered rectangle)
  const bx = 56, by = 52, bw = w - 112, bh = h - 104;
  const bezGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
  bezGrad.addColorStop(0, "#08080a");
  bezGrad.addColorStop(1, "#111113");
  ctx.fillStyle = bezGrad;
  roundRect(ctx, bx, by, bw, bh, 12);
  ctx.fill();

  // screen inner glow — Apple-blue aura
  const screenGlow = ctx.createRadialGradient(
    bx + bw / 2, by + bh / 2, 0,
    bx + bw / 2, by + bh / 2, bw * 0.7
  );
  const breathPulse = 0.55 + 0.15 * Math.sin(t * 0.9);
  screenGlow.addColorStop(0, `rgba(41,151,255,${breathPulse * 0.35})`);
  screenGlow.addColorStop(0.6, `rgba(41,151,255,0.04)`);
  screenGlow.addColorStop(1, "rgba(41,151,255,0)");
  ctx.fillStyle = screenGlow;
  roundRect(ctx, bx, by, bw, bh, 12);
  ctx.fill();

  // Apple logo (six-stripe rainbow circle, small, centered high)
  const lx = bx + bw / 2;
  const ly = by + bh * 0.22;
  const lr = Math.min(bw, bh) * 0.095;
  const stripes = [C.leaf5, C.gold5, C.plasm5, "#e0433f", C.iris5, C.flux5];
  stripes.forEach((color, i) => {
    const startAngle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const endAngle = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.arc(lx, ly, lr, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  // logo overlay bite
  ctx.fillStyle = "#111113";
  ctx.globalAlpha = 1;
  // draw a bite (circular cutout illusion via dark circle)
  ctx.beginPath();
  ctx.arc(lx + lr * 0.55, ly - lr * 0.55, lr * 0.4, 0, Math.PI * 2);
  ctx.fill();
  // thin ring
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(lx, ly, lr + 1.5, 0, Math.PI * 2);
  ctx.stroke();

  // "Think Different" wordmark-style text
  ctx.font = `italic ${Math.round(lr * 1.8)}px Georgia, serif`;
  ctx.fillStyle = `rgba(255,255,255,${0.55 + 0.12 * Math.sin(t * 1.2)})`;
  ctx.textAlign = "center";
  ctx.fillText("Think Different.", bx + bw / 2, by + bh * 0.55);

  // three status indicator dots (sleep/wake light rhythm)
  const dotY = by + bh * 0.76;
  const dotSpacing = lr * 1.6;
  for (let i = 0; i < 3; i++) {
    const dotX = bx + bw / 2 + (i - 1) * dotSpacing;
    const phase = i * 1.2;
    const alpha = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 1.5 + phase));
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(41,151,255,${alpha})`;
    ctx.fill();
  }

  // bottom bar — speaker grille lines
  const grY = by + bh + 14;
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const gx = bx + bw / 2 - 28 + i * 8;
    ctx.beginPath();
    ctx.moveTo(gx, grY);
    ctx.lineTo(gx, grY + 8);
    ctx.stroke();
  }

  // "USER SEES THIS" label
  ctx.font = "8px JetBrains Mono, monospace";
  ctx.fillStyle = "rgba(161,161,166,0.35)";
  ctx.textAlign = "center";
  ctx.fillText("WHAT THE USER SEES", w / 2, h - 12);
}

/* ─── BACK panel canvas: hidden interior — the craftsman's secret ───────── */
function drawBack(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number
) {
  ctx.clearRect(0, 0, w, h);
  const t = frame * 0.016;

  // PCB dark green substrate
  const pcbGrad = ctx.createLinearGradient(0, 0, w, h);
  pcbGrad.addColorStop(0, "#0d1a0f");
  pcbGrad.addColorStop(0.5, "#0f1e12");
  pcbGrad.addColorStop(1, "#0a150c");
  ctx.fillStyle = pcbGrad;
  roundRect(ctx, 24, 20, w - 48, h - 40, 28);
  ctx.fill();

  ctx.strokeStyle = "rgba(97,187,70,0.12)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, 24, 20, w - 48, h - 40, 28);
  ctx.stroke();

  const mx = 24, my = 20, mw = w - 48, mh = h - 40;

  // PCB trace grid — deterministic layout
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, mx, my, mw, mh, 28);
  ctx.clip();

  // horizontal traces (leaf-green, thin)
  const traceAlpha = 0.18 + 0.06 * Math.sin(t * 0.7);
  ctx.strokeStyle = `rgba(97,187,70,${traceAlpha})`;
  ctx.lineWidth = 0.8;
  const traceRows = [0.12, 0.22, 0.35, 0.48, 0.62, 0.75, 0.88];
  traceRows.forEach((fy) => {
    const ty = my + fy * mh;
    ctx.beginPath();
    ctx.moveTo(mx + 12, ty);
    ctx.lineTo(mx + mw * 0.32, ty);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx + mw * 0.55, ty);
    ctx.lineTo(mx + mw - 12, ty);
    ctx.stroke();
  });

  // vertical traces
  const traceCols = [0.15, 0.28, 0.42, 0.60, 0.74, 0.88];
  traceCols.forEach((fx) => {
    const tx = mx + fx * mw;
    ctx.beginPath();
    ctx.moveTo(tx, my + 12);
    ctx.lineTo(tx, my + mh * 0.38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tx, my + mh * 0.62);
    ctx.lineTo(tx, my + mh - 12);
    ctx.stroke();
  });

  // gold signal traces — diagonal runs (gold = unseen craft)
  ctx.strokeStyle = `rgba(246,166,35,${0.28 + 0.10 * Math.sin(t * 1.1)})`;
  ctx.lineWidth = 1;
  const goldTraces: [number, number, number, number][] = [
    [0.12, 0.20, 0.32, 0.45],
    [0.62, 0.15, 0.80, 0.38],
    [0.22, 0.68, 0.45, 0.85],
    [0.68, 0.62, 0.88, 0.80],
  ];
  goldTraces.forEach(([fx1, fy1, fx2, fy2]) => {
    ctx.beginPath();
    ctx.moveTo(mx + fx1 * mw, my + fy1 * mh);
    // L-bend trace (right-angle, like real PCB routing)
    ctx.lineTo(mx + fx2 * mw, my + fy1 * mh);
    ctx.lineTo(mx + fx2 * mw, my + fy2 * mh);
    ctx.stroke();
  });

  // via holes (small filled circles at intersections)
  const vias: [number, number][] = [
    [0.32, 0.45], [0.80, 0.38], [0.45, 0.85],
    [0.88, 0.80], [0.15, 0.62], [0.60, 0.22],
    [0.28, 0.35], [0.74, 0.62], [0.42, 0.75],
  ];
  vias.forEach(([fx, fy]) => {
    const vx = mx + fx * mw, vy = my + fy * mh;
    ctx.beginPath();
    ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#0a150c";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(246,166,35,0.65)`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // inner copper
    ctx.beginPath();
    ctx.arc(vx, vy, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(246,166,35,0.55)`;
    ctx.fill();
  });

  // chips / IC blocks — the beating hearts
  type Chip = {
    fx: number; fy: number; fw: number; fh: number;
    label: string; color: string;
  };
  const chips: Chip[] = [
    { fx: 0.38, fy: 0.28, fw: 0.26, fh: 0.20, label: "CPU", color: C.flux5 },
    { fx: 0.14, fy: 0.52, fw: 0.18, fh: 0.14, label: "RAM", color: C.iris5 },
    { fx: 0.68, fy: 0.52, fw: 0.18, fh: 0.14, label: "GPU", color: C.gold5 },
    { fx: 0.40, fy: 0.70, fw: 0.22, fh: 0.12, label: "SSD", color: C.leaf5 },
  ];

  chips.forEach((chip) => {
    const cx = mx + chip.fx * mw;
    const cy = my + chip.fy * mh;
    const cw = chip.fw * mw;
    const ch = chip.fh * mh;
    const rgb = hexToRgb(chip.color);

    // chip body
    const chipGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
    chipGrad.addColorStop(0, `rgba(${rgb},0.22)`);
    chipGrad.addColorStop(1, `rgba(${rgb},0.10)`);
    ctx.fillStyle = chipGrad;
    roundRect(ctx, cx, cy, cw, ch, 5);
    ctx.fill();

    // chip border — pulsing when active
    const chipPulse = chip.label === "CPU"
      ? 0.5 + 0.5 * Math.sin(t * 2.2)
      : 0.4 + 0.3 * Math.sin(t * 1.4 + chip.fx * 10);
    ctx.strokeStyle = `rgba(${rgb},${0.45 + chipPulse * 0.35})`;
    ctx.lineWidth = chip.label === "CPU" ? 1.5 : 1;
    roundRect(ctx, cx, cy, cw, ch, 5);
    ctx.stroke();

    // chip label
    ctx.font = "bold 8px JetBrains Mono, monospace";
    ctx.fillStyle = `rgba(${rgb},${0.7 + chipPulse * 0.25})`;
    ctx.textAlign = "center";
    ctx.fillText(chip.label, cx + cw / 2, cy + ch / 2 + 3);

    // leg/pin marks along chip edges
    ctx.strokeStyle = `rgba(${rgb},0.3)`;
    ctx.lineWidth = 0.8;
    const pins = 5;
    for (let p = 0; p < pins; p++) {
      const px = cx + (cw / (pins + 1)) * (p + 1);
      // top pins
      ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, cy - 5); ctx.stroke();
      // bottom pins
      ctx.beginPath(); ctx.moveTo(px, cy + ch); ctx.lineTo(px, cy + ch + 5); ctx.stroke();
    }
    const pinsH = 3;
    for (let p = 0; p < pinsH; p++) {
      const py = cy + (ch / (pinsH + 1)) * (p + 1);
      // left pins
      ctx.beginPath(); ctx.moveTo(cx, py); ctx.lineTo(cx - 5, py); ctx.stroke();
      // right pins
      ctx.beginPath(); ctx.moveTo(cx + cw, py); ctx.lineTo(cx + cw + 5, py); ctx.stroke();
    }
  });

  // a small capacitor cluster (electrolytic caps — little cylinders)
  const capPositions: [number, number][] = [
    [0.88, 0.22], [0.92, 0.30], [0.10, 0.30],
  ];
  capPositions.forEach(([fx, fy]) => {
    const cx = mx + fx * mw, cy = my + fy * mh;
    ctx.fillStyle = "#1a2e1a";
    ctx.strokeStyle = "rgba(97,187,70,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(246,166,35,0.4)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy - 2);
    ctx.lineTo(cx + 3, cy - 2);
    ctx.stroke();
  });

  // data flow animation — moving signal on one trace
  const signalProgress = (t * 0.55) % 1.0;
  const signalX = mx + (0.12 + signalProgress * 0.76) * mw;
  const signalY = my + traceRows[2] * mh;
  const sigGlow = ctx.createRadialGradient(signalX, signalY, 0, signalX, signalY, 8);
  sigGlow.addColorStop(0, "rgba(97,187,70,0.85)");
  sigGlow.addColorStop(1, "rgba(97,187,70,0)");
  ctx.fillStyle = sigGlow;
  ctx.beginPath();
  ctx.arc(signalX, signalY, 8, 0, Math.PI * 2);
  ctx.fill();

  // gold signal on gold trace
  const goldProgress = (t * 0.38 + 0.5) % 1.0;
  const gsx = mx + (0.12 + goldProgress * 0.68) * mw;
  const gsy = my + 0.20 * mh;
  const gsGlow = ctx.createRadialGradient(gsx, gsy, 0, gsx, gsy, 7);
  gsGlow.addColorStop(0, "rgba(246,166,35,0.8)");
  gsGlow.addColorStop(1, "rgba(246,166,35,0)");
  ctx.fillStyle = gsGlow;
  ctx.beginPath();
  ctx.arc(gsx, gsy, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // "ONLY THE MAKER SEES THIS" label
  ctx.font = "8px JetBrains Mono, monospace";
  ctx.fillStyle = `rgba(97,187,70,0.5)`;
  ctx.textAlign = "center";
  ctx.fillText("WHAT ONLY THE MAKER SEES", w / 2, h - 12);
}

/* ─── rounded-rect path helper ────────────────────────────────────────── */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ─── Product canvas: front or back ───────────────────────────────────── */
function ProductCanvas({
  face,
  onFlip,
}: {
  face: "front" | "back";
  onFlip: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const faceRef = useRef<"front" | "back">(face);

  useEffect(() => {
    faceRef.current = face;
  }, [face]);

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
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      frameRef.current += 1;
      if (faceRef.current === "front") {
        drawFront(ctx!, w, h, frameRef.current);
      } else {
        drawBack(ctx!, w, h, frameRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-2xl cursor-pointer"
      style={{ height: "260px" }}
      onClick={onFlip}
      aria-label={
        face === "front"
          ? "Polished product — click to flip and see the interior"
          : "Internal architecture — click to flip back"
      }
    />
  );
}

/* ─── Flip card wrapper ────────────────────────────────────────────────── */
function FlipCard({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  const [face, setFace] = useState<"front" | "back">("front");
  const [flipping, setFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  const handleFlip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setFace((f) => f === "front" ? "back" : "front");
      setFlipCount((c) => c + 1);
      setFlipping(false);
    }, 180);
  }, [flipping]);

  return (
    <div className="space-y-4">
      {/* flip container */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          transition: "transform 0.18s ease",
          transform: flipping ? "rotateY(90deg)" : "rotateY(0deg)",
          perspective: "1200px",
        }}
      >
        <ProductCanvas face={face} onFlip={handleFlip} />
      </div>

      {/* flip CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-0.5">
          <p className="label-mono text-[0.55rem]" style={{ color: face === "front" ? C.flux4 : C.leaf4 }}>
            {face === "front"
              ? L("FRONT — The User's View", "正面 — 用户所见")
              : L("BACK — The Craftsman's Interior", "背面 — 工匠的秘密")}
          </p>
          <p className={`text-[0.76rem] ${lang === "zh" ? "zh" : ""}`} style={{ color: C.ink3 }}>
            {face === "front"
              ? L(
                  "Polished, considered, complete. No rough edges, no exposed seams.",
                  "打磨过的、深思熟虑的、完整的。没有粗糙边缘，没有裸露接缝。"
                )
              : L(
                  "The back of the fence. Finished with the same care — because he would know.",
                  "围栏的背面。以同样的用心做好——因为他自己知道。"
                )}
          </p>
        </div>
        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-4 py-2 rounded-full border text-[0.7rem] font-mono transition-all duration-200"
          style={{
            borderColor: face === "front" ? `rgba(41,151,255,0.4)` : `rgba(97,187,70,0.4)`,
            background: face === "front" ? `rgba(41,151,255,0.08)` : `rgba(97,187,70,0.08)`,
            color: face === "front" ? C.flux4 : C.leaf4,
          }}
          aria-label={L("Flip to see the other side", "翻转查看另一面")}
        >
          <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>⟳</span>
          {L("Flip", "翻转")}
          {flipCount > 0 && (
            <span style={{ color: C.ink5 }}>× {flipCount}</span>
          )}
        </button>
      </div>

      {/* back-of-fence parable quote */}
      {face === "back" && (
        <div
          className="panel rounded-xl p-4 space-y-2 rise-in"
          style={{
            borderColor: "rgba(246,166,35,0.28)",
            boxShadow: `0 0 48px -20px rgba(246,166,35,0.3)`,
          }}
        >
          <p className="label-mono text-[0.55rem]" style={{ color: C.gold4 }}>
            {L("The Parable · Paul Jobs", "这个比喻 · 保罗·乔布斯")}
          </p>
          <p
            className={`text-[0.82rem] leading-relaxed italic ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink50 }}
          >
            {L(
              "\"When you're a carpenter making a beautiful chest of drawers, you're not going to use a piece of plywood on the back, even though it faces the wall and nobody will ever see it. You'll know it's there — so you're going to use a beautiful piece of wood on the back.\"",
              "「当你是一位木匠，正在制作一个漂亮的五斗橱时，你不会用一块胶合板做背面，即使它面对着墙壁，没有人会看见。你自己知道它在那里——所以你要在背面也用一块漂亮的木头。」"
            )}
          </p>
          <p className="text-[0.64rem] font-mono" style={{ color: C.ink5 }}>
            {L("Jobs paraphrasing Paul Jobs — original lesson, Jobs's lifelong application.", "乔布斯转述保罗·乔布斯的话 —— 来自父亲的教诲，被他奉行终身。")}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Twin Creed panel ─────────────────────────────────────────────────── */
function TwinCreed({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* "real artists ship" */}
      <div
        className="panel panel-leaf rounded-2xl p-5 space-y-3"
        style={{ boxShadow: `0 0 48px -24px rgba(97,187,70,0.4)` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 breathe"
            style={{ background: "rgba(97,187,70,0.15)", fontSize: "0.9rem" }}
          >
            ✦
          </div>
          <p className="label-mono text-[0.54rem]" style={{ color: C.leaf4 }}>
            {L("Creed I · Discipline", "信条一 · 执行力")}
          </p>
        </div>
        <h3
          className={`display text-base md:text-lg leading-snug ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.leaf4 }}
        >
          {L("Real Artists Ship", "真正的艺术家会交付产品")}
        </h3>
        <p
          className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink3 }}
        >
          {L(
            "Taste without the discipline to finish is aesthetics. A beautiful idea held forever in perfectionist purgatory ships nothing. Jobs believed that the hard, unglamorous act of actually delivering — cutting features, compromising, shipping — separated those who made things from those who only imagined them.",
            "没有执行力的品味只是审美。一个被永远困在完美主义炼狱中的美好创意什么也交付不了。乔布斯认为，真正交付产品的艰难、不光鲜的行为——削减功能、做出妥协、按时出货——才是创造者与空想者之间的分水岭。"
          )}
        </p>
        <div className="h-px" style={{ background: "rgba(97,187,70,0.12)" }} />
        <p
          className={`text-[0.7rem] italic ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink5 }}
        >
          {L(
            "The Mac shipped. The Lisa — beautiful, over-engineered, late — did not survive.",
            "Mac 发布了。Lisa——美丽、过度工程化、迟到——没能存活下来。"
          )}
        </p>
      </div>

      {/* "taste can be cultivated" */}
      <div
        className="panel panel-gold rounded-2xl p-5 space-y-3"
        style={{ boxShadow: `0 0 48px -24px rgba(246,166,35,0.35)` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 pulse"
            style={{ background: "rgba(246,166,35,0.15)", fontSize: "0.9rem" }}
          >
            ◈
          </div>
          <p className="label-mono text-[0.54rem]" style={{ color: C.gold4 }}>
            {L("Creed II · Cultivation", "信条二 · 培育")}
          </p>
        </div>
        <h3
          className={`display text-base md:text-lg leading-snug ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.gold4 }}
        >
          {L("Taste Can Be Cultivated", "品味可以被培养")}
        </h3>
        <p
          className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink3 }}
        >
          {L(
            "Jobs thought most of the technology industry had no taste at all. He didn't treat taste as innate — he treated it as a practice: studying calligraphy, Bauhaus design, Zen minimalism, the Cuisinart food processor. Deliberately consuming the best artifacts in any field, understanding why they worked, and applying that understanding across disciplines.",
            "乔布斯认为大多数科技行业根本没有品味。他不把品味视为天赋——而是视为一种修炼：学习书法、包豪斯设计、禅宗极简主义、Cuisinart食品加工机。有意识地接触各个领域最好的作品，理解它们为何奏效，并将这种理解跨领域地应用。"
          )}
        </p>
        <div className="h-px" style={{ background: "rgba(246,166,35,0.12)" }} />
        <p
          className={`text-[0.7rem] italic ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink5 }}
        >
          {L(
            "He cited the Reed College calligraphy course, taken after dropping out, as the source of the Mac's beautiful typography.",
            "他提到，在退学后旁听里德学院书法课，是 Mac 优美字体排印的源头。"
          )}
        </p>
      </div>
    </div>
  );
}

/* ─── Cost panel: craft braided with cruelty ───────────────────────────── */
function CostPanel({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  const [open, setOpen] = useState(true);

  type CostItem = {
    icon: string;
    en_head: string; zh_head: string;
    en_body: string; zh_body: string;
  };

  const costs: CostItem[] = [
    {
      icon: "⊘",
      en_head: "Abusive Standards",
      zh_head: "虐待性的高标准",
      en_body:
        "Perfectionism directed outward became routine cruelty. Engineers were berated in elevators. Colleagues were declared 'idiots' for work that met any ordinary professional standard. The feedback could produce brilliance; it also produced fear, burnout, and departures. Perfectionism for Jobs was inseparable from contempt — and the contempt was real.",
      zh_body:
        "向外投射的完美主义变成了例行的残忍。工程师在电梯里遭受训斥。同事因达到了任何普通职业标准的工作而被称为「白痴」。这种反馈有时能激发才华；但也制造了恐惧、倦怠和离职。对乔布斯而言，完美主义与蔑视不可分割——而那种蔑视是真实存在的。",
    },
    {
      icon: "⟲",
      en_head: "Ruinously Re-done Parts",
      zh_head: "毁灭性的反复重做",
      en_body:
        "Entire products were scrapped or fully redesigned within weeks of shipping. The original Mac case was re-cast dozens of times for a curvature Jobs found unsatisfying. The cost — in time, engineer morale, supplier strain — was treated as acceptable collateral. The back of the fence was beautiful; the human cost of getting there was not accounted for.",
      zh_body:
        "整个产品会在发布前几周被废弃或完全重新设计。最初的 Mac 外壳为了让乔布斯满意的弧度，被重铸了数十次。时间成本、工程师士气、供应商压力——这些都被视为可接受的附带代价。围栏的背面很漂亮；达到这一步的人力代价却从未被计入账目。",
    },
    {
      icon: "◉",
      en_head: "Borrowed Ideas as His Own",
      zh_head: "将他人创意据为己有",
      en_body:
        "The flip side of 'taste can be cultivated' is that Jobs had a documented habit of absorbing others' ideas and presenting them as his own synthesis. Xerox PARC's graphical interface, Larry Tesler's scrollbar implementations, Jony Ive's enclosures — he was a synthesis machine, often brilliant at the synthesis, but rarely honest about the source. Good taste and appropriation travelled together.",
      zh_body:
        "「品味可以被培养」的另一面是：乔布斯有记录在案的习惯，将他人的创意吸收消化，然后作为自己的综合成果呈现。施乐帕克研究中心的图形界面、拉里·特斯勒的滚动条实现、乔尼·艾夫的外观设计——他是一台综合机器，综合的结果往往出色，但对来源却鲜少诚实。好品味与挪用并肩而行。",
    },
    {
      icon: "↔",
      en_head: "Missed Deadlines & Ruined Launches",
      zh_head: "错过截止日期与搞砸的发布",
      en_body:
        "The same perfectionism that produced the Mac delayed its launch by a year, shipped it with known functional limitations (no fan, limited RAM), and drove its core team to near-collapse. 'Real artists ship' was a mantra Jobs deployed selectively — against others' delays, not his own. His standard for shipping was applied unequally.",
      zh_body:
        "同样的完美主义造就了 Mac，也将其发布推迟了一年，并在产品带有已知功能局限（无风扇、内存不足）的情况下强行出货，还将核心团队逼到崩溃边缘。「真正的艺术家会交付产品」是乔布斯选择性使用的咒语——用来针对别人的拖延，而非他自己的。他对「交付」的标准，是不均等适用的。",
    },
  ];

  return (
    <div
      className="panel rounded-2xl overflow-hidden"
      style={{
        borderColor: "rgba(255,94,91,0.28)",
        boxShadow: "0 0 64px -28px rgba(255,94,91,0.3)",
      }}
    >
      {/* header */}
      <button
        className="w-full flex items-start gap-4 p-5 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="label-mono text-[0.58rem]" style={{ color: C.plasm4 }}>
              {L("Fair Cost Panel", "公正代价评估")}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[0.55rem] font-mono border"
              style={{
                color: C.plasm4,
                borderColor: "rgba(255,94,91,0.3)",
                background: "rgba(255,94,91,0.08)",
              }}
            >
              {L("Craft & Cruelty, Braided", "工匠精神与残忍，交织在一起")}
            </span>
          </div>
          <h3 className={`display text-base md:text-xl ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.plasm4 }}
          >
            {L(
              "The Cost of the Back of the Fence",
              "围栏背面的代价"
            )}
          </h3>
        </div>
        <span
          className="label-mono text-[0.55rem] shrink-0 mt-1 transition-transform duration-300"
          style={{
            color: C.plasm4,
            transform: open ? "rotate(180deg)" : undefined,
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-5 pb-6 space-y-5 rise-in">
          <div className="h-px" style={{ background: "rgba(255,94,91,0.18)" }} />

          {/* framing statement */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "linear-gradient(135deg, rgba(255,94,91,0.07), rgba(255,94,91,0.03))",
              border: "1px solid rgba(255,94,91,0.18)",
            }}
          >
            <p
              className={`text-[0.88rem] font-semibold leading-snug ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.plasm4 }}
            >
              {L(
                "Perfectionism is not a neutral quality. In Jobs, craft and cruelty were inseparable.",
                "完美主义并非中性品质。在乔布斯身上，工匠精神与残忍无法分开。"
              )}
            </p>
            <p
              className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink3 }}
            >
              {L(
                "The same sensibility that finished the back of the fence also held others to a standard they had not agreed to, absorbed their contributions without credit, and treated human costs as rounding errors. This is not a caveat to the genius — it is part of the record of it.",
                "那种将围栏背面也精心打磨的感受力，同样使他将他人置于未曾约定的标准之下，不加致谢地吸收他人贡献，并将人力代价视为可忽略的误差。这不是天才的免责声明——它是天才记录的一部分。"
              )}
            </p>
          </div>

          {/* cost items grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {costs.map((item, i) => (
              <div
                key={i}
                className="panel rounded-xl p-4 space-y-2"
                style={{ borderColor: "rgba(255,94,91,0.15)" }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: C.plasm4 }}>{item.icon}</span>
                  <span
                    className={`text-[0.76rem] font-semibold ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: C.plasm4 }}
                  >
                    {lang === "zh" ? item.zh_head : item.en_head}
                  </span>
                </div>
                <p
                  className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: C.ink3 }}
                >
                  {lang === "zh" ? item.zh_body : item.en_body}
                </p>
              </div>
            ))}
          </div>

          {/* closing note */}
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: "rgba(134,134,139,0.06)",
              border: "1px solid rgba(134,134,139,0.18)",
            }}
          >
            <span style={{ color: C.steel4 }} className="shrink-0 text-base">◇</span>
            <p
              className={`text-[0.76rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink3 }}
            >
              {L(
                "None of this negates the craft. The Mac was beautiful. The typography mattered. The insistence on the unseen interior produced products that still define the standard. The question is what it cost — in people, in credit, in honesty — and whether those costs were ever honestly paid.",
                "以上种种并不否定那份工匠精神。Mac 是美丽的。字体排印是重要的。对看不见的内部的坚持，造就了至今仍定义行业标准的产品。问题在于它的代价是什么——以人、以功劳、以诚实来衡量——以及这些代价是否曾被坦然偿还过。"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Interior detail strip ────────────────────────────────────────────── */
function InteriorStrip({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  const items = [
    {
      color: C.gold5,
      icon: "▣",
      en_label: "Font Rendering",
      zh_label: "字体渲染",
      en_note: "The Mac's bitmap fonts were individually designed. No other manufacturer cared.",
      zh_note: "Mac 的位图字体是逐一设计的。没有其他制造商在意这件事。",
    },
    {
      color: C.flux5,
      icon: "◫",
      en_label: "Screw Geometry",
      zh_label: "螺钉几何",
      en_note: "Internal screws were machined to a visual standard no user would see. Because he would know.",
      zh_note: "内部螺钉以没有用户能看见的视觉标准加工。因为他自己知道。",
    },
    {
      color: C.iris5,
      icon: "⬡",
      en_label: "Circuit Layout",
      zh_label: "电路布局",
      en_note: "Jobs wanted the circuit boards signed by the team — the inside of the cabinet, commemorated.",
      zh_note: "乔布斯希望电路板由团队签名——柜子的内部，作为纪念。",
    },
    {
      color: C.leaf5,
      icon: "◎",
      en_label: "Packaging Interior",
      zh_label: "包装内部",
      en_note: "The inside of Apple product boxes was designed. Unboxing before 'unboxing' was a concept.",
      zh_note: "苹果产品包装盒的内部是经过设计的。在「开箱体验」成为概念之前就已存在。",
    },
  ];

  return (
    <div
      className="panel panel-steel rounded-2xl p-5 space-y-4"
      style={{ borderColor: "rgba(134,134,139,0.2)" }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: C.steel4 }}>◈</span>
        <p className="label-mono text-[0.56rem]" style={{ color: C.steel4 }}>
          {L("The Unseen Interior — Four Instances", "看不见的内部 — 四个例证")}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="space-y-2 rounded-xl p-3"
            style={{
              background: `rgba(${hexToRgb(item.color)},0.04)`,
              border: `1px solid rgba(${hexToRgb(item.color)},0.15)`,
            }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ color: item.color, fontSize: "1rem" }}>{item.icon}</span>
              <span
                className={`text-[0.65rem] font-semibold ${lang === "zh" ? "zh" : ""}`}
                style={{ color: item.color }}
              >
                {lang === "zh" ? item.zh_label : item.en_label}
              </span>
            </div>
            <p
              className={`text-[0.68rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink5 }}
            >
              {lang === "zh" ? item.zh_note : item.en_note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Root component ────────────────────────────────────────────────────── */
export default function TasteViz() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  return (
    <section className="w-full space-y-10 py-2">

      {/* ── header ─────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono" style={{ color: C.gold4 }}>
          {L("Theme 08 · Taste, Craft & Perfection", "主题08 · 品味、工艺与完美")}
        </p>
        <h2 className="display text-2xl md:text-3xl spark-text">
          {L("The Back of the Fence", "围栏的背面")}
        </h2>
        <p
          className={`text-[0.88rem] max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink3 }}
        >
          {L(
            "Paul Jobs taught his son to build the unseen side of a fence with the same care as the visible front — because a true craftsman knows. Jobs applied the principle to every product he touched: the interior circuit board, the packaging, the font kern. Flip the product below to see the other side.",
            "保罗·乔布斯教导儿子，要以和正面同样的用心打造围栏看不见的背面——因为真正的工匠自己知道。乔布斯将这一原则应用于他参与的每一件产品：内部电路板、包装、字体字距。翻转下面的产品，看看另一面。"
          )}
        </p>
      </div>

      {/* ── centerpiece: flip / reveal ──────────────────────────────────── */}
      <div
        className="panel rounded-2xl p-5 space-y-2"
        style={{
          borderColor: "rgba(246,166,35,0.22)",
          boxShadow: `0 0 80px -32px rgba(246,166,35,0.25)`,
        }}
      >
        <FlipCard lang={lang} />
      </div>

      {/* ── twin creed ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono" style={{ color: C.ink5 }}>
          {L("The Twin Creed", "双重信条")}
        </p>
        <TwinCreed lang={lang} />
      </div>

      {/* ── interior strip ─────────────────────────────────────────────── */}
      <InteriorStrip lang={lang} />

      {/* ── rule ───────────────────────────────────────────────────────── */}
      <div className="w-full h-px rule-flux rounded" />

      {/* ── cost panel ─────────────────────────────────────────────────── */}
      <CostPanel lang={lang} />

      {/* ── closing editorial note ─────────────────────────────────────── */}
      <div className="panel panel-iris rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span style={{ color: C.iris4 }}>◇</span>
          <span className="label-mono text-[0.62rem]" style={{ color: C.iris4 }}>
            {L("Editorial Note", "编辑说明")}
          </span>
        </div>
        <p
          className={`text-[0.86rem] leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink3 }}
        >
          {L(
            "The back-of-the-fence parable is real. Jobs told it often; Isaacson records it; the principle demonstrably governed product decisions across three decades. It is also, genuinely, a philosophy of craft — not a marketing strategy. The difficulty is that the same principle, scaled by power and deployed through contempt, becomes something quite different from a lesson about carpentry.",
            "围栏背面的比喻是真实的。乔布斯常常讲起它；艾萨克森记录了它；这一原则明显地主导了三十年来的产品决策。它也确实是一种工艺哲学——而非营销策略。困难在于，同一原则，被权力放大并通过蔑视来执行，就变成了与木工课截然不同的东西。"
          )}
        </p>
        <div className="h-px" style={{ background: "rgba(166,99,204,0.15)" }} />
        <p
          className={`text-[0.76rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink5 }}
        >
          {L(
            "Sources paraphrased throughout. The Isaacson biography (2011) is the primary attributed source for direct quotes and incidents. All editorial commentary is original. The flip visualization is conceptual — not a technical diagram of any specific Apple product.",
            "全文均为意译。艾萨克森传记（2011年）是直接引语和事件的主要注明来源。所有编辑性评论均为原创。翻转可视化为概念性示意——并非任何具体苹果产品的技术图纸。"
          )}
        </p>
      </div>

    </section>
  );
}
