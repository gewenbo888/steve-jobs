"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   FocusGrid
   Theme 05 — Focus & the Power of No

   Recreates the famous 1997 moment: Jobs returned to a near-bankrupt Apple,
   drew a 2×2 grid (Consumer/Pro × Desktop/Portable), and cancelled almost
   everything that didn't fit one of the four boxes. The survivors became the
   iMac, Power Mac, iBook, and PowerBook — four products that rebuilt Apple.

   Panels:
   1. Clutter field — ~18 product tiles from Apple's sprawling late-90s lineup.
      Click "Apply the Grid" to trigger the purge animation: cancelled tiles
      dissolve with an X, survivors snap into the 2×2.
   2. Focus dividend — a resource bar readout showing effort concentrating.
   3. Jobs's creed (paraphrased, attributed).
   4. Fair caveat: ruthless focus is a founder superpower; it becomes a
      liability when imposed as dogma on domains that need breadth.
═══════════════════════════════════════════════════════════════════════════ */

/* ── palette (raw hex for canvas) ────────────────────────────────────────── */
const C = {
  void950:   "#0a0a0b",
  void900:   "#111113",
  void800:   "#18181b",
  void700:   "#232327",
  flux500:   "#2997ff",   // Apple-blue — the four survivors
  flux400:   "#6cb8ff",
  iris500:   "#a663cc",
  iris400:   "#c79be0",
  leaf500:   "#61bb46",   // focus dividend / green
  leaf400:   "#8fd47a",
  gold500:   "#f6a623",
  gold400:   "#ffc15e",
  plasm500:  "#ff5e5b",   // cancelled / caveat (coral)
  plasm400:  "#ff8a87",
  steel500:  "#86868b",   // clutter tiles (silver)
  steel400:  "#a1a1a6",
  ink50:     "#f5f5f7",
  ink300:    "#a1a1a6",
  ink500:    "#6e6e73",
};

/* ── deterministic PRNG ───────────────────────────────────────────────────── */
function seeded(s: number, salt = 0): number {
  const x = Math.sin(s * 9301 + salt * 49297 + 233720) * 43758.5453;
  return x - Math.floor(x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

function easeInCubic(t: number) {
  return Math.pow(Math.max(0, Math.min(1, t)), 3);
}

/* ── product tile definitions ─────────────────────────────────────────────── */
/* Quadrant assignment: 0=iMac(consumer-desktop), 1=PowerMac(pro-desktop),
   2=iBook(consumer-portable), 3=PowerBook(pro-portable), null=cancelled     */

type ProductTile = {
  id: string;
  en: string;
  zh: string;
  category: string;
  quadrant: 0 | 1 | 2 | 3 | null; // null = cancelled
};

const PRODUCTS: ProductTile[] = [
  // ── The four survivors ─────────────────────────────────────────────────────
  { id: "imac",      en: "iMac",            zh: "iMac",          category: "desktop",   quadrant: 0 },
  { id: "powermac",  en: "Power Mac",        zh: "Power Mac",     category: "desktop",   quadrant: 1 },
  { id: "ibook",     en: "iBook",            zh: "iBook",         category: "portable",  quadrant: 2 },
  { id: "powerbook", en: "PowerBook G3",     zh: "PowerBook G3",  category: "portable",  quadrant: 3 },
  // ── Cancelled ─────────────────────────────────────────────────────────────
  { id: "newton",    en: "Newton MessagePad",zh: "Newton MessagePad", category: "pda",   quadrant: null },
  { id: "pippin",    en: "Pippin",           zh: "Pippin",        category: "console",   quadrant: null },
  { id: "copland",   en: "Copland OS",       zh: "Copland OS",    category: "software",  quadrant: null },
  { id: "cloner1",   en: "Mac OS Licensing", zh: "Mac OS 授权",   category: "licensing", quadrant: null },
  { id: "pm4400",    en: "Power Mac 4400",   zh: "Power Mac 4400",category: "desktop",   quadrant: null },
  { id: "pm5500",    en: "Power Mac 5500",   zh: "Power Mac 5500",category: "desktop",   quadrant: null },
  { id: "pm6500",    en: "Power Mac 6500",   zh: "Power Mac 6500",category: "desktop",   quadrant: null },
  { id: "pb1400",    en: "PowerBook 1400",   zh: "PowerBook 1400",category: "portable",  quadrant: null },
  { id: "pb3400",    en: "PowerBook 3400",   zh: "PowerBook 3400",category: "portable",  quadrant: null },
  { id: "laser",     en: "LaserWriter",      zh: "LaserWriter",   category: "printer",   quadrant: null },
  { id: "colorlaser",en: "Color LaserWriter",zh: "彩色激光打印机", category: "printer",   quadrant: null },
  { id: "inkjet",    en: "StyleWriter",      zh: "StyleWriter",   category: "printer",   quadrant: null },
  { id: "performa",  en: "Performa 6400",    zh: "Performa 6400", category: "desktop",   quadrant: null },
  { id: "workgroup", en: "Workgroup Server", zh: "工作组服务器",   category: "server",    quadrant: null },
];

/* The four quadrant cells */
const QUADRANT_LABELS = [
  { en: "Consumer · Desktop",  zh: "消费级 · 桌面", hint: "iMac",        hintZh: "iMac" },
  { en: "Pro · Desktop",       zh: "专业级 · 桌面", hint: "Power Mac",   hintZh: "Power Mac" },
  { en: "Consumer · Portable", zh: "消费级 · 便携", hint: "iBook",       hintZh: "iBook" },
  { en: "Pro · Portable",      zh: "专业级 · 便携", hint: "PowerBook",   hintZh: "PowerBook" },
];

/* ── clutter scatter: deterministic positions inside a 600×340 field ─────── */
type TilePos = { x: number; y: number; w: number; rot: number };

function scatterPos(idx: number): TilePos {
  const cols = 6;
  const rows = 3;
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  const bx = (col / cols) * 0.88 + 0.02;
  const by = (row / rows) * 0.80 + 0.04;
  // deterministic jitter
  const jx = (seeded(idx, 1) - 0.5) * 0.06;
  const jy = (seeded(idx, 2) - 0.5) * 0.10;
  const rot = (seeded(idx, 3) - 0.5) * 6;   // degrees, -3..+3
  const w = 0.12 + seeded(idx, 4) * 0.03;
  return { x: bx + jx, y: by + jy, w, rot };
}

/* ── quadrant target positions (in the 2×2 grid canvas) ──────────────────── */
function quadrantTarget(q: 0 | 1 | 2 | 3): { cx: number; cy: number } {
  const col = q % 2;  // 0=left(consumer), 1=right(pro)
  const row = Math.floor(q / 2);  // 0=top(desktop), 1=bottom(portable)
  return {
    cx: 0.25 + col * 0.5,
    cy: 0.25 + row * 0.5,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS RENDERER
   Phase: "clutter" | "animating" | "grid"
   animProg: 0→1
═══════════════════════════════════════════════════════════════════════════ */

type Phase = "clutter" | "animating" | "grid";

interface DrawCtx {
  w: number;
  h: number;
  phase: Phase;
  animProg: number;  // 0→1 overall animation progress
  hovered: number | null;
  lang: "en" | "zh";
  animT: number;     // running time for subtle alive-effects
}

function drawCanvas(
  ctx: CanvasRenderingContext2D,
  dc: DrawCtx,
) {
  const { w, h, phase, animProg, hovered, lang, animT } = dc;
  ctx.clearRect(0, 0, w, h);

  // background gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, C.void900);
  bg.addColorStop(1, C.void950);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // scanlines
  for (let sy = 0; sy < h; sy += 3) {
    ctx.fillStyle = "rgba(0,0,0,0.025)";
    ctx.fillRect(0, sy, w, 1);
  }

  // ── grid lines (emerge as animProg advances) ───────────────────────────────
  const gridAlpha = phase === "clutter" ? 0 : easeOutCubic(Math.min(1, animProg * 2));

  if (gridAlpha > 0.005) {
    ctx.save();
    ctx.globalAlpha = gridAlpha * 0.9;

    // outer border of 2×2 grid
    const gx = w * 0.04;
    const gy = h * 0.10;
    const gw = w * 0.92;
    const gh = h * 0.82;

    // quadrant fill
    const quadFills = [
      `rgba(41,151,255,0.07)`,   // consumer desktop — blue
      `rgba(166,99,204,0.07)`,   // pro desktop — iris
      `rgba(41,151,255,0.05)`,   // consumer portable
      `rgba(166,99,204,0.05)`,   // pro portable
    ];
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([col, row], qi) => {
      ctx.fillStyle = quadFills[qi];
      ctx.fillRect(
        gx + col * gw * 0.5,
        gy + row * gh * 0.5,
        gw * 0.5,
        gh * 0.5,
      );
    });

    // outer rect
    ctx.strokeStyle = `rgba(41,151,255,0.35)`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx, gy, gw, gh);

    // center dividers
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = `rgba(41,151,255,0.30)`;
    ctx.beginPath();
    ctx.moveTo(gx + gw * 0.5, gy);
    ctx.lineTo(gx + gw * 0.5, gy + gh);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(gx, gy + gh * 0.5);
    ctx.lineTo(gx + gw, gy + gh * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // axis labels
    ctx.save();
    ctx.globalAlpha = gridAlpha;
    ctx.font = `600 ${Math.round(Math.min(w, h) * 0.028)}px "JetBrains Mono", monospace`;
    ctx.fillStyle = C.flux400 + "cc";
    ctx.textAlign = "center";

    // top axis: Desktop
    ctx.fillText(
      lang === "zh" ? "← 桌面 →" : "← DESKTOP →",
      gx + gw * 0.5, gy - 6,
    );

    // bottom axis: Portable
    ctx.fillText(
      lang === "zh" ? "← 便携 →" : "← PORTABLE →",
      gx + gw * 0.5, gy + gh + 14,
    );

    // left axis: Consumer (rotated)
    ctx.save();
    ctx.translate(gx - 10, gy + gh * 0.5);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(lang === "zh" ? "消费级 ↑" : "CONSUMER ↑", 0, 0);
    ctx.restore();

    // right axis: Pro (rotated)
    ctx.save();
    ctx.translate(gx + gw + 12, gy + gh * 0.5);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(lang === "zh" ? "专业级 ↑" : "PRO ↑", 0, 0);
    ctx.restore();

    ctx.restore();
  }

  // ── product tiles ──────────────────────────────────────────────────────────
  PRODUCTS.forEach((prod, idx) => {
    const scatter = scatterPos(idx);
    const isHovered = hovered === idx;
    const isSurvivor = prod.quadrant !== null;

    // determine tile position
    let tx: number, ty: number, tRot: number, tAlpha: number, strikeAlpha: number;

    if (phase === "clutter") {
      tx      = scatter.x * w;
      ty      = scatter.y * h;
      tRot    = scatter.rot;
      tAlpha  = 1;
      strikeAlpha = 0;
    } else if (phase === "animating") {
      // survivors snap to grid; cancelled fade + strike
      const prog = animProg;

      if (isSurvivor) {
        const qt = quadrantTarget(prod.quadrant as 0 | 1 | 2 | 3);
        const gx = w * 0.04 + w * 0.92 * qt.cx;
        const gy2 = h * 0.10 + h * 0.82 * qt.cy;
        const snapStart = 0.3;
        const snapProg = easeOutCubic(Math.max(0, (prog - snapStart) / (1 - snapStart)));
        tx    = lerp(scatter.x * w, gx, snapProg);
        ty    = lerp(scatter.y * h, gy2, snapProg);
        tRot  = lerp(scatter.rot, 0, snapProg);
        tAlpha = 1;
        strikeAlpha = 0;
      } else {
        // fade + cross out over first 60% of animation
        const fadeProg = easeInCubic(Math.min(1, prog / 0.6));
        tx         = scatter.x * w;
        ty         = scatter.y * h;
        tRot       = scatter.rot;
        tAlpha     = 1 - fadeProg * 0.85;
        strikeAlpha = fadeProg;
      }
    } else {
      // grid phase: survivors at quadrant center, cancelled hidden
      if (isSurvivor) {
        const qt = quadrantTarget(prod.quadrant as 0 | 1 | 2 | 3);
        tx    = w * 0.04 + w * 0.92 * qt.cx;
        ty    = h * 0.10 + h * 0.82 * qt.cy;
        tRot  = 0;
        tAlpha = 1;
        strikeAlpha = 0;
      } else {
        tAlpha = 0.12;
        tx     = scatter.x * w;
        ty     = scatter.y * h;
        tRot   = scatter.rot;
        strikeAlpha = 1;
      }
    }

    // tile dimensions
    const baseW = Math.min(w, h) * 0.18;
    const tileW = isSurvivor && phase === "grid"
      ? baseW * 1.18
      : baseW;
    const tileH = tileW * 0.46;
    const fontSize = tileW * 0.165;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, tAlpha));
    ctx.translate(tx, ty);
    ctx.rotate((tRot * Math.PI) / 180);

    // subtle alive drift for clutter
    let driftX = 0, driftY = 0;
    if (phase === "clutter") {
      driftX = Math.sin(animT * 0.4 + idx * 1.3) * 0.8;
      driftY = Math.cos(animT * 0.35 + idx * 0.9) * 0.5;
    }

    const bx = -tileW / 2 + driftX;
    const by = -tileH / 2 + driftY;

    // glow for survivors in grid or hovered
    if ((isSurvivor && phase === "grid") || isHovered) {
      ctx.save();
      ctx.shadowColor = C.flux500;
      ctx.shadowBlur  = isHovered ? 22 : 14;
      ctx.restore();
    }

    // tile body
    const tileFill = isSurvivor
      ? `rgba(41,151,255,${phase === "grid" ? 0.22 : 0.13})`
      : `rgba(134,134,139,0.12)`;
    const tileBorder = isSurvivor
      ? (phase === "grid" ? C.flux500 : C.flux400 + "77")
      : (strikeAlpha > 0.5 ? C.plasm400 + "77" : C.steel400 + "40");

    ctx.beginPath();
    const r = 6;
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + tileW - r, by);
    ctx.arcTo(bx + tileW, by, bx + tileW, by + r, r);
    ctx.lineTo(bx + tileW, by + tileH - r);
    ctx.arcTo(bx + tileW, by + tileH, bx + tileW - r, by + tileH, r);
    ctx.lineTo(bx + r, by + tileH);
    ctx.arcTo(bx, by + tileH, bx, by + tileH - r, r);
    ctx.lineTo(bx, by + r);
    ctx.arcTo(bx, by, bx + r, by, r);
    ctx.closePath();

    // fill
    if ((isSurvivor && phase === "grid")) {
      const tileGrad = ctx.createLinearGradient(bx, by, bx + tileW, by + tileH);
      tileGrad.addColorStop(0, `rgba(41,151,255,0.26)`);
      tileGrad.addColorStop(1, `rgba(41,151,255,0.12)`);
      ctx.fillStyle = tileGrad;
    } else {
      ctx.fillStyle = tileFill;
    }
    ctx.fill();

    ctx.strokeStyle = isHovered ? C.flux400 : tileBorder;
    ctx.lineWidth   = isSurvivor && phase === "grid" ? 1.5 : 1;
    if (isSurvivor && phase === "grid") {
      ctx.shadowColor = C.flux500;
      ctx.shadowBlur  = 12;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // tile label
    ctx.fillStyle = isSurvivor
      ? (phase === "grid" ? C.flux400 : C.ink50 + "bb")
      : (strikeAlpha > 0.5 ? C.plasm400 + "77" : C.steel400 + "bb");
    ctx.font      = `600 ${Math.round(fontSize)}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const label = lang === "zh" ? prod.zh : prod.en;
    // clip text to tile width
    ctx.save();
    ctx.rect(bx + 4, by + 2, tileW - 8, tileH - 4);
    ctx.clip();
    ctx.fillText(label, driftX, driftY, tileW - 8);
    ctx.restore();

    // category tag
    if (phase !== "grid" || !isSurvivor) {
      ctx.fillStyle = C.steel500 + "66";
      ctx.font = `500 ${Math.round(fontSize * 0.72)}px "JetBrains Mono", monospace`;
      ctx.fillText(prod.category, driftX, driftY + tileH * 0.28, tileW - 8);
    }

    // cancellation X
    if (strikeAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha *= strikeAlpha;
      ctx.strokeStyle = C.plasm500;
      ctx.lineWidth   = 2.2;
      ctx.shadowColor = C.plasm500;
      ctx.shadowBlur  = 8;
      const margin = tileW * 0.1;
      ctx.beginPath();
      ctx.moveTo(bx + margin,         by + margin);
      ctx.lineTo(bx + tileW - margin, by + tileH - margin);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + tileW - margin, by + margin);
      ctx.lineTo(bx + margin,         by + tileH - margin);
      ctx.stroke();
      ctx.restore();
    }

    // survivor quadrant label in grid phase
    if (isSurvivor && phase === "grid") {
      const ql = QUADRANT_LABELS[prod.quadrant as number];
      ctx.fillStyle = C.flux500 + "88";
      ctx.font = `500 ${Math.round(fontSize * 0.7)}px "JetBrains Mono", monospace`;
      ctx.fillText(
        lang === "zh" ? ql.zh : ql.en,
        0,
        tileH * 0.38,
        tileW - 4,
      );
    }

    ctx.restore();
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function FocusGrid() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;

  /* ── state ───────────────────────────────────────────────────────────────── */
  const [phase, setPhase]           = useState<Phase>("clutter");
  const [animProg, setAnimProg]     = useState(0);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);
  const [showCaveat, setShowCaveat] = useState(false);
  const [focusDividend, setFocusDividend] = useState(0);  // 0→1 as grid applied

  /* ── refs ────────────────────────────────────────────────────────────────── */
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const animTRef     = useRef(0);          // running time
  const animProgRef  = useRef(0);
  const phaseRef     = useRef<Phase>("clutter");
  const hoveredRef   = useRef<number | null>(null);
  const langRef      = useRef(lang);

  useEffect(() => { phaseRef.current  = phase; },       [phase]);
  useEffect(() => { hoveredRef.current = hoveredTile; }, [hoveredTile]);
  useEffect(() => { langRef.current   = lang; },         [lang]);

  /* ── animation driver ───────────────────────────────────────────────────── */
  const animStartRef  = useRef<number | null>(null);
  const ANIM_DURATION = 2200; // ms

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.floor(rect.width  * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    let last = 0;
    function tick(ts: number) {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      animTRef.current += dt;

      // advance animation progress
      if (phaseRef.current === "animating") {
        if (animStartRef.current === null) animStartRef.current = ts;
        const elapsed = ts - animStartRef.current;
        const prog = Math.min(1, elapsed / ANIM_DURATION);
        animProgRef.current = prog;
        setAnimProg(prog);
        setFocusDividend(easeOutCubic(prog));

        if (prog >= 1) {
          phaseRef.current = "grid";
          setPhase("grid");
          setFocusDividend(1);
        }
      }

      const rect = canvas!.getBoundingClientRect();
      drawCanvas(ctx!, {
        w:         rect.width,
        h:         rect.height,
        phase:     phaseRef.current,
        animProg:  animProgRef.current,
        hovered:   hoveredRef.current,
        lang:      langRef.current,
        animT:     animTRef.current,
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── trigger animation ─────────────────────────────────────────────────── */
  const handleApplyGrid = useCallback(() => {
    if (phase !== "clutter") return;
    animStartRef.current = null;
    animProgRef.current  = 0;
    setAnimProg(0);
    setFocusDividend(0);
    phaseRef.current = "animating";
    setPhase("animating");
  }, [phase]);

  const handleReset = useCallback(() => {
    animProgRef.current = 0;
    setAnimProg(0);
    setFocusDividend(0);
    phaseRef.current = "clutter";
    setPhase("clutter");
    animStartRef.current = null;
  }, []);

  /* ── canvas mouse tracking ─────────────────────────────────────────────── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== "clutter") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    const w    = rect.width;
    const h    = rect.height;

    let found: number | null = null;
    PRODUCTS.forEach((_, idx) => {
      const scatter = scatterPos(idx);
      const tileW   = Math.min(w, h) * 0.18;
      const tileH   = tileW * 0.46;
      const tx      = scatter.x * w;
      const ty      = scatter.y * h;
      if (
        mx >= tx - tileW / 2 - 4 &&
        mx <= tx + tileW / 2 + 4 &&
        my >= ty - tileH / 2 - 4 &&
        my <= ty + tileH / 2 + 4
      ) {
        found = idx;
      }
    });
    setHoveredTile(found);
  }, [phase]);

  const handleMouseLeave = useCallback(() => {
    setHoveredTile(null);
  }, []);

  /* ── focus dividend readout ─────────────────────────────────────────────── */
  const cancelledCount = PRODUCTS.filter((p) => p.quadrant === null).length;
  const survivorCount  = PRODUCTS.length - cancelledCount;
  const dividendPct    = Math.round(focusDividend * 100);

  /* ── hovered tile info ─────────────────────────────────────────────────── */
  const hTile = hoveredTile !== null ? PRODUCTS[hoveredTile] : null;

  return (
    <div className="w-full space-y-8">

      {/* ── header ────────────────────────────────────────────────────────── */}
      <div>
        <p className="label-mono mb-1">
          {L("Theme 05 · Focus", "主题 05 · 专注")}
        </p>
        <h3 className={`display text-2xl md:text-3xl leading-tight mb-2 spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("The Power of No", "拒绝的力量")}
        </h3>
        <p
          className={`text-sm max-w-2xl leading-relaxed mb-1 ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Newsreader", serif' }}
        >
          {L(
            "In 1997, Jobs returned to a near-bankrupt Apple and found a company scattered across dozens of products. His first act of design was not to build something — it was to eliminate. He drew a two-by-two grid and cancelled almost everything that didn't fit.",
            "1997年，乔布斯回到濒临破产的苹果，发现公司产品线杂乱无章、四面开花。他第一个设计动作不是创造，而是删减。他画了一个二乘二的方格，几乎取消了所有不符合框架的产品。",
          )}
        </p>
        <div className="rule-flux h-px rounded mt-3" />
      </div>

      {/* ── interactive canvas ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap justify-between">
          <p className="label-mono">
            {L("Apple's Product Lineup, Late 1997", "苹果产品线，1997年底")}
          </p>
          <div className="flex items-center gap-2">
            {phase === "clutter" && (
              <button
                onClick={handleApplyGrid}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-[0.7rem] tracking-wider uppercase border transition-all duration-200"
                style={{
                  borderColor: C.flux500,
                  background: `rgba(41,151,255,0.1)`,
                  color: C.flux400,
                  boxShadow: `0 0 20px -6px rgba(41,151,255,0.4)`,
                }}
              >
                <span
                  className="inline-block w-3 h-3 border-2 rounded-sm flex-shrink-0"
                  style={{ borderColor: C.flux400 }}
                  aria-hidden="true"
                />
                <span className={lang === "zh" ? "zh" : ""}>
                  {L("Apply the Grid", "应用方格")}
                </span>
              </button>
            )}
            {(phase === "animating" || phase === "grid") && (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl font-mono text-[0.7rem] tracking-wider uppercase border transition-all duration-200"
                style={{
                  borderColor: `rgba(134,134,139,0.3)`,
                  background: "transparent",
                  color: C.ink300,
                }}
              >
                <span className={lang === "zh" ? "zh" : ""}>
                  {L("Reset", "重置")}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* canvas */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            border: phase === "grid"
              ? `1px solid rgba(41,151,255,0.35)`
              : `1px solid rgba(255,255,255,0.07)`,
            boxShadow: phase === "grid"
              ? `0 0 80px -24px rgba(41,151,255,0.35)`
              : `0 4px 40px -12px rgba(0,0,0,0.6)`,
            transition: "border-color 0.8s ease, box-shadow 0.8s ease",
          }}
        >
          <canvas
            ref={canvasRef}
            className="block w-full"
            style={{ aspectRatio: "16/9", minHeight: 240, cursor: phase === "clutter" ? "crosshair" : "default" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label={L(
              "Interactive Apple product grid visualization",
              "苹果产品方格互动可视化",
            )}
          />

          {/* phase label overlay */}
          <div className="absolute top-3 left-3">
            <span
              className="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 rounded-md"
              style={{
                background:
                  phase === "clutter"   ? "rgba(134,134,139,0.15)" :
                  phase === "animating" ? "rgba(246,166,35,0.15)"   :
                  "rgba(41,151,255,0.15)",
                color:
                  phase === "clutter"   ? C.steel400 :
                  phase === "animating" ? C.gold400   :
                  C.flux400,
                border: `1px solid ${
                  phase === "clutter"   ? C.steel400 + "44" :
                  phase === "animating" ? C.gold400   + "44" :
                  C.flux400 + "44"
                }`,
              }}
            >
              {phase === "clutter"   && L("36 products. Chaos.", "36款产品。一片混乱。")}
              {phase === "animating" && L("Applying focus…",     "专注筛选中…")}
              {phase === "grid"      && L("4 products. Clarity.", "4款产品。清晰。")}
            </span>
          </div>

          {/* hovered tile tooltip */}
          {hTile && phase === "clutter" && (
            <div
              className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-56 rounded-xl px-3 py-2 pointer-events-none"
              style={{
                background: "rgba(17,17,19,0.92)",
                border: `1px solid ${hTile.quadrant !== null ? C.flux400 + "44" : C.plasm400 + "33"}`,
                backdropFilter: "blur(8px)",
              }}
            >
              <p
                className={`font-mono text-[0.65rem] mb-0.5 ${lang === "zh" ? "zh" : ""}`}
                style={{ color: hTile.quadrant !== null ? C.flux400 : C.plasm400 }}
              >
                {lang === "zh" ? hTile.zh : hTile.en}
              </p>
              <p className="font-mono text-[0.58rem]" style={{ color: C.ink500 }}>
                {hTile.category}
                {hTile.quadrant !== null
                  ? ` · ${L("SURVIVES →", "存活 →")} ${L(QUADRANT_LABELS[hTile.quadrant].hint, QUADRANT_LABELS[hTile.quadrant].hintZh)}`
                  : ` · ${L("CANCELLED", "取消")}`
                }
              </p>
            </div>
          )}
        </div>

        {/* count legend */}
        <div className="flex flex-wrap gap-3 text-[0.62rem] font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded border flex-shrink-0"
              style={{ background: "rgba(41,151,255,0.22)", borderColor: C.flux500 }}
            />
            <span style={{ color: C.flux400 }}>
              {survivorCount} {L("survive", "存活")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded border flex-shrink-0"
              style={{ background: "rgba(134,134,139,0.12)", borderColor: C.plasm400 + "55" }}
            />
            <span style={{ color: C.plasm400 }}>
              {cancelledCount} {L("cancelled", "取消")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: C.ink500 }}>
              {L("Axes: Consumer ↔ Pro · Desktop ↔ Portable", "坐标轴：消费级 ↔ 专业级 · 桌面 ↔ 便携")}
            </span>
          </div>
        </div>
      </div>

      {/* ── focus dividend readout ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <p className="label-mono" style={{ color: C.leaf400 }}>
          {L("Focus Dividend", "专注红利")}
        </p>

        <div
          className="panel panel-leaf rounded-xl p-5 space-y-4"
          style={{
            borderColor: focusDividend > 0.05 ? `rgba(97,187,70,${0.2 + focusDividend * 0.3})` : undefined,
            boxShadow:   focusDividend > 0.5 ? `0 0 60px -20px rgba(97,187,70,0.3)` : undefined,
            transition:  "border-color 0.6s ease, box-shadow 0.6s ease",
          }}
        >
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                labelEn: "Engineering focus",
                labelZh: "工程专注度",
                valueFn: (d: number) => Math.round(d * 100),
                suffix: "%",
                color: C.flux400,
              },
              {
                labelEn: "Products shipped",
                labelZh: "出货产品数",
                valueFn: (d: number) => Math.round(lerp(PRODUCTS.length, survivorCount, d)),
                suffix: "",
                color: C.plasm400,
              },
              {
                labelEn: "Resources per product",
                labelZh: "每产品资源占比",
                valueFn: (d: number) => {
                  const ratio = PRODUCTS.length / (PRODUCTS.length - cancelledCount * d);
                  return `${ratio.toFixed(1)}×`;
                },
                suffix: "",
                color: C.leaf400,
              },
            ].map((m) => (
              <div key={m.labelEn} className="text-center">
                <p
                  className="display text-3xl md:text-4xl leading-none tabular-nums"
                  style={{ color: m.color }}
                >
                  {m.valueFn(focusDividend)}{m.suffix}
                </p>
                <p
                  className={`font-mono text-[0.62rem] mt-1.5 ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: C.ink500 }}
                >
                  {lang === "zh" ? m.labelZh : m.labelEn}
                </p>
              </div>
            ))}
          </div>

          {/* focus progress bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-mono text-[0.6rem]" style={{ color: C.steel400 }}>
                {L("Scattered →", "分散 →")}
              </span>
              <span className="font-mono text-[0.6rem]" style={{ color: C.leaf400 }}>
                {L("→ Focused", "→ 专注")}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: `rgba(97,187,70,0.1)` }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width:      `${dividendPct}%`,
                  background: `linear-gradient(90deg, ${C.leaf500}66, ${C.leaf400}, ${C.flux400})`,
                  boxShadow:  `0 0 8px ${C.leaf500}77`,
                  transition: "width 0.15s linear",
                }}
              />
            </div>
            <p
              className="font-mono text-[0.57rem] mt-1.5 text-right"
              style={{ color: C.ink500 }}
            >
              {dividendPct}% {L("focus applied", "专注度已应用")}
            </p>
          </div>

          <p
            className={`text-[0.72rem] leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}
            style={{
              color: C.ink300,
              fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
            }}
          >
            {L(
              "Apple went from 36 product lines to four. Revenue per engineer rose. Marketing clarity sharpened. The company stopped explaining itself to itself. Within two years, the iMac alone put Apple back in the black.",
              "苹果从36条产品线缩减到4条。每位工程师的营收贡献上升。市场传播变得清晰。公司不再需要向自己解释自己。不到两年，仅iMac一款产品就让苹果重回盈利。",
            )}
          </p>
        </div>
      </div>

      {/* ── the creed ──────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <p className="label-mono" style={{ color: C.gold400 }}>
          {L("The Creed", "信条")}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* primary quote */}
          <div
            className="rounded-xl p-5 flex flex-col justify-between gap-4"
            style={{
              background: "linear-gradient(150deg, rgba(246,166,35,0.07), rgba(17,17,19,0.94))",
              border: `1px solid rgba(246,166,35,0.22)`,
            }}
          >
            <blockquote>
              <p
                className={`text-[0.82rem] leading-relaxed italic ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: C.ink50,
                  fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                  borderLeft: `2px solid ${C.gold400}`,
                  paddingLeft: "0.9rem",
                }}
              >
                {L(
                  "\"People think focus means saying yes to the thing you've got to focus on. But that's not what it means at all. It means saying no to the hundred other good ideas that there are. You have to pick carefully. I'm actually as proud of the things we haven't done as the things I have done. Innovation is saying no to 1,000 things.\"",
                  "「人们以为专注意味着对你要专注的事情说是。但它的意义完全不是这样。专注意味着对其他那一百个好主意说不。你必须谨慎取舍。说实话，我对我们没有做的事情，和对我们做过的事情一样骄傲。创新就是对一千件事情说不。」",
                )}
              </p>
              <footer className="mt-3 font-mono text-[0.6rem]" style={{ color: C.gold400 }}>
                — Steve Jobs, {L("Apple Worldwide Developers Conference, 1997", "苹果全球开发者大会，1997年")}
              </footer>
            </blockquote>
          </div>

          {/* second principle */}
          <div
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{
              background: "linear-gradient(150deg, rgba(41,151,255,0.07), rgba(17,17,19,0.94))",
              border: `1px solid rgba(41,151,255,0.18)`,
            }}
          >
            <p className="label-mono text-[0.6rem]" style={{ color: C.flux400 }}>
              {L("What the Grid Bought", "方格换来了什么")}
            </p>
            <ul className="space-y-2.5">
              {[
                {
                  en: "Engineering depth over breadth — each team could go deep rather than wide",
                  zh: "工程深度优于宽度——每个团队得以深耕而非浅涉",
                },
                {
                  en: "Supply chain leverage — fewer SKUs meant massive component purchasing power",
                  zh: "供应链话语权——更少的SKU意味着大规模元件采购议价力",
                },
                {
                  en: "Marketing coherence — one story per customer segment, told loudly",
                  zh: "市场传播一致性——每个细分客群一个故事，讲得响亮清晰",
                },
                {
                  en: "Organizational alignment — every hire knew which box they were building",
                  zh: "组织对齐——每位员工清楚自己在建造哪个格子里的产品",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-2 text-[0.7rem] leading-relaxed">
                  <span style={{ color: C.flux400, flexShrink: 0 }}>·</span>
                  <span
                    className={lang === "zh" ? "zh" : ""}
                    style={{
                      color: C.ink300,
                      fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                    }}
                  >
                    {lang === "zh" ? item.zh : item.en}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── 2×2 explainer: what went into each box ─────────────────────────── */}
      <div className="space-y-4">
        <p className="label-mono">
          {L("The Four Boxes, Resolved", "四个格子的最终归属")}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {QUADRANT_LABELS.map((ql, qi) => {
            const tile = PRODUCTS.find((p) => p.quadrant === qi)!;
            const colColors = [C.flux500, C.iris500, C.flux400, C.iris400];
            const color     = colColors[qi];
            return (
              <div
                key={qi}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{
                  background: `${color}09`,
                  border:     `1px solid ${color}30`,
                }}
              >
                <p className="label-mono text-[0.58rem]" style={{ color }}>
                  {lang === "zh" ? ql.zh : ql.en}
                </p>
                <p
                  className={`display text-lg md:text-xl leading-tight ${lang === "zh" ? "zh" : ""}`}
                  style={{ color }}
                >
                  {lang === "zh" ? ql.hintZh : ql.hint}
                </p>
                <p
                  className={`text-[0.67rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                  style={{
                    color: C.ink300,
                    fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                  }}
                >
                  {[
                    L("Bondi-blue all-in-one. The image that saved Apple.", "邦迪蓝一体机。挽救苹果的那张脸。"),
                    L("Tower workstation for creative professionals.", "面向创意专业人士的塔式工作站。"),
                    L("The laptop that said: computing is for everyone.", "那台宣告「计算属于所有人」的笔记本。"),
                    L("Mobile power for serious users; titanium later.", "为严肃用户打造的移动主力；后来演变为钛金属款。"),
                  ][qi]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── caveat ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <button
          onClick={() => setShowCaveat((v) => !v)}
          className="flex items-center gap-2 group"
        >
          <span
            className="label-mono transition-colors"
            style={{ color: showCaveat ? C.plasm400 : C.ink500 }}
          >
            {L("Fair Caveat: When Ruthless Focus Becomes a Liability", "公正注释：当无情的专注变成负债时")}
          </span>
          <span
            className="font-mono text-[0.7rem] transition-transform duration-200"
            style={{
              color: C.ink500,
              transform: showCaveat ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ›
          </span>
        </button>

        {showCaveat && (
          <div
            key="caveat"
            className="panel rounded-xl p-5 space-y-4 rise-in"
            style={{
              borderColor: `rgba(255,94,91,0.22)`,
              background:  "rgba(255,94,91,0.04)",
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: C.plasm500, fontSize: "0.9rem" }}>⚠</span>
              <p className="label-mono text-[0.62rem]" style={{ color: C.plasm400 }}>
                {L("Focus as Superpower vs. Focus as Dogma", "专注作为超能力 vs. 专注作为教条")}
              </p>
            </div>

            <p
              className={`text-[0.73rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink300,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
              }}
            >
              {L(
                "Ruthless focus is a founder's superpower precisely when one person holds the whole vision and can judge what truly matters. Jobs in 1997 had that: he saw what Apple had to become, and the 2×2 was the right cut. But focus imposed as dogma — on a large organization, across diverse domains, by someone who does not hold the full map — can eliminate the exploratory breadth that surfaces future breakthroughs. The art is knowing which problem you have.",
                "无情的专注，恰恰是当一个人掌握整体愿景、能够判断真正重要之事时，才成为创始人的超能力。1997年的乔布斯正是如此：他看清了苹果必须成为什么，那个二乘二的方格是正确的切割。但当专注作为教条被强加——施加于庞大组织、跨越多元领域、由不掌握全局地图的人来执行——它可能会消灭催生未来突破的探索性宽度。艺术在于：你要知道自己面对的是哪种问题。",
              )}
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  labelEn: "Focus as superpower",
                  labelZh: "专注作为超能力",
                  color: C.flux400,
                  itemsEn: [
                    "Founder with clear, unified vision",
                    "Resources genuinely too thin to spread",
                    "Market segment well-defined enough to cut",
                    "Execution, not exploration, is the bottleneck",
                  ],
                  itemsZh: [
                    "具有清晰统一愿景的创始人",
                    "资源真正稀薄到无法分散",
                    "市场细分清晰到足以切割",
                    "瓶颈在执行，而非探索",
                  ],
                },
                {
                  labelEn: "When focus becomes a liability",
                  labelZh: "专注变成负债时",
                  color: C.plasm400,
                  itemsEn: [
                    "Large org where no one holds the full map",
                    "Domain requires adjacent exploration to find next S-curve",
                    "\"No\" becomes a political tool, not a design tool",
                    "Platform/ecosystem businesses that need surface area",
                  ],
                  itemsZh: [
                    "无人掌握全局的大型组织",
                    "领域需要相邻探索来找到下一条S曲线",
                    "「不」成为政治工具，而非设计工具",
                    "需要广泛接触面的平台/生态系统业务",
                  ],
                },
              ].map((col) => (
                <div
                  key={col.labelEn}
                  className="rounded-lg p-3 space-y-2"
                  style={{
                    background: `${col.color}0a`,
                    border:     `1px solid ${col.color}22`,
                  }}
                >
                  <p className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: col.color }}>
                    {lang === "zh" ? col.labelZh : col.labelEn}
                  </p>
                  <ul className="space-y-1">
                    {(lang === "zh" ? col.itemsZh : col.itemsEn).map((item, i) => (
                      <li
                        key={i}
                        className={`flex gap-1.5 text-[0.67rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                        style={{ color: C.ink300 }}
                      >
                        <span style={{ color: col.color, flexShrink: 0 }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p
              className={`text-[0.68rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{
                color: C.ink500,
                fontFamily: lang === "zh" ? undefined : '"Newsreader", serif',
                borderLeft: `2px solid ${C.plasm500}55`,
                paddingLeft: "0.75rem",
              }}
            >
              {L(
                "The 1997 grid was the right call. The same logic applied by someone without Jobs's conviction and coherence — or in a context that demands breadth — is not focus; it is premature closure. Knowing the difference is the harder skill.",
                "1997年的那个方格是正确的决策。但同样的逻辑，若由缺乏乔布斯那种信念与整体感的人来执行——或应用于需要广度的场景——就不是专注，而是过早收敛。辨别两者的能力，才是更难的技艺。",
              )}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
