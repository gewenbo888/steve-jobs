"use client";

import { useEffect, useRef } from "react";

/* JobsField — full-bleed animated hero background.
   "The intersection of liberal arts and technology."
   A deep graphite void with two faint, perpendicular light beams crossing
   near the golden-ratio point, plus a sparse field of slow-drifting motes
   that occasionally ignite in one of the six vintage Apple-rainbow hues.
   Everything is restrained, minimal, cinematic — lots of negative space.
   Palette (site bg #0a0a0b):
     void       graphite   #0a0a0b / #18181b
     motes      aluminum   #a1a1a6  low-alpha
     beam H     Apple-blue #2997ff  very low-alpha (liberal arts)
     beam V     aluminum   #e8e8ed  very low-alpha (technology)
     glints     rainbow    #61bb46 / #f6a623 / #ff5e5b / #e0433f / #a663cc / #2997ff
   Additive blending for all beam glow; prefers-reduced-motion respected.  */

/* ── types ──────────────────────────────────────────────────────────────── */
interface Mote {
  x: number;       // 0..1 fractional position
  y: number;
  vy: number;      // drift speed (pixels/tick, very slow)
  vx: number;
  r: number;       // radius px
  a: number;       // base alpha
  phase: number;   // breathing phase offset
  freq: number;    // breathing frequency
  // rainbow glint
  glintColor: string;   // one of the six hues
  glintPhase: number;   // offset into glint cycle
  glintPeriod: number;  // how many ticks between glints
}

/* ── deterministic LCG ──────────────────────────────────────────────────── */
function makeLCG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = ((s * 9301 + 49297) >>> 0) % 233280;
    return s / 233280;
  };
}

/* ── six vintage Apple rainbow hues (low-alpha base; glints brighten them) */
const RAINBOW = [
  "#61bb46", // leaf
  "#f6a623", // amber
  "#ff5e5b", // red
  "#e0433f", // coral
  "#a663cc", // violet
  "#2997ff", // blue
] as const;

/* ── component ──────────────────────────────────────────────────────────── */
export default function JobsField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr    = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0, h = 0;

    /* ── scene state ──────────────────────────────────────────────────── */
    let motes: Mote[] = [];

    /* ── resize + reinit ──────────────────────────────────────────────── */
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width  = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function init() {
      const rand = makeLCG(0x5e7b3a1d);  // fixed seed → deterministic

      /* ── mote count scales with canvas area ─────────────────────── */
      const count = w < 640 ? 40 : w < 1200 ? 65 : 90;
      motes = [];

      for (let i = 0; i < count; i++) {
        const r = 0.3 + rand() * 0.9;
        motes.push({
          x:           rand(),
          y:           rand(),
          vx:          (rand() - 0.5) * 0.00018,  // very slow lateral drift
          vy:          -(0.00008 + rand() * 0.00014), // gentle upward float
          r,
          a:           0.06 + rand() * 0.22,
          phase:       rand() * Math.PI * 2,
          freq:        0.25 + rand() * 0.9,
          glintColor:  RAINBOW[Math.floor(rand() * RAINBOW.length)],
          glintPhase:  rand() * 6000,
          glintPeriod: 220 + Math.floor(rand() * 560), // rare: every 220–780 ticks
        });
      }
    }

    resize();

    /* ── beam positions: intersection at golden-ratio point ─────────── */
    // Horizontal beam: y ≈ 0.382 h (golden ratio from top)
    // Vertical beam  : x ≈ 0.618 w (golden ratio from left)
    // Both are very faint — suggestions of light, not spotlights

    function drawBeams() {
      if (w === 0 || h === 0) return;

      const bx = w * 0.618;  // vertical beam x
      const by = h * 0.382;  // horizontal beam y

      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";

      /* ── horizontal beam (Apple-blue — "liberal arts") ─────────── */
      // A wide, very faint horizontal gradient band
      const hGrd = ctx!.createLinearGradient(0, by - 160, 0, by + 160);
      hGrd.addColorStop(0,    "rgba(41,151,255,0)");
      hGrd.addColorStop(0.35, "rgba(41,151,255,0.022)");
      hGrd.addColorStop(0.5,  "rgba(41,151,255,0.038)");
      hGrd.addColorStop(0.65, "rgba(41,151,255,0.022)");
      hGrd.addColorStop(1,    "rgba(41,151,255,0)");
      ctx!.fillStyle = hGrd;
      ctx!.fillRect(0, by - 160, w, 320);

      // hairline center rule — barely visible
      ctx!.strokeStyle = "rgba(41,151,255,0.07)";
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.moveTo(0, by);
      ctx!.lineTo(w, by);
      ctx!.stroke();

      /* ── vertical beam (aluminum-white — "technology") ──────────── */
      const vGrd = ctx!.createLinearGradient(bx - 140, 0, bx + 140, 0);
      vGrd.addColorStop(0,    "rgba(232,232,237,0)");
      vGrd.addColorStop(0.35, "rgba(232,232,237,0.018)");
      vGrd.addColorStop(0.5,  "rgba(232,232,237,0.032)");
      vGrd.addColorStop(0.65, "rgba(232,232,237,0.018)");
      vGrd.addColorStop(1,    "rgba(232,232,237,0)");
      ctx!.fillStyle = vGrd;
      ctx!.fillRect(bx - 140, 0, 280, h);

      // hairline center rule
      ctx!.strokeStyle = "rgba(232,232,237,0.06)";
      ctx!.lineWidth   = 0.6;
      ctx!.beginPath();
      ctx!.moveTo(bx, 0);
      ctx!.lineTo(bx, h);
      ctx!.stroke();

      /* ── intersection accent — a very faint, soft bloom ─────────── */
      const iGrd = ctx!.createRadialGradient(bx, by, 0, bx, by, 120);
      iGrd.addColorStop(0,   "rgba(180,200,255,0.055)");
      iGrd.addColorStop(0.5, "rgba(100,160,255,0.022)");
      iGrd.addColorStop(1,   "rgba(41,151,255,0)");
      ctx!.fillStyle = iGrd;
      ctx!.beginPath();
      ctx!.arc(bx, by, 120, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.globalCompositeOperation = "source-over";
      ctx!.restore();
    }

    /* ── draw motes ─────────────────────────────────────────────────────── */
    function drawMotes(tick: number) {
      for (const m of motes) {
        // wrap position
        let px = ((m.x % 1) + 1) % 1;
        let py = ((m.y % 1) + 1) % 1;
        const sx = px * w;
        const sy = py * h;

        // breathing alpha
        const breath  = 0.5 + 0.5 * Math.sin(tick * 0.011 * m.freq + m.phase);
        const baseAlpha = m.a * (0.5 + 0.5 * breath);

        // glint: every glintPeriod ticks a short flash of rainbow color
        // use a triangle wave keyed to (tick + glintPhase) % glintPeriod
        const tRaw    = (tick + m.glintPhase) % m.glintPeriod;
        const glintDur = 28;  // ticks the glint lasts
        const glinting = tRaw < glintDur;
        const glintT   = glinting ? tRaw / glintDur : 0;  // 0→1 ramp in, 0 out
        // bell shape: 4t(1-t)
        const glintStr = glinting ? 4 * glintT * (1 - glintT) : 0;

        if (glintStr > 0.01) {
          // parse hex color into rgba for the glint (additive)
          const hex = m.glintColor.replace("#", "");
          const rC  = parseInt(hex.substring(0, 2), 16);
          const gC  = parseInt(hex.substring(2, 4), 16);
          const bC  = parseInt(hex.substring(4, 6), 16);

          ctx!.save();
          ctx!.globalCompositeOperation = "lighter";

          // soft outer glow
          const glowR = m.r * 6 * glintStr;
          const gGrd  = ctx!.createRadialGradient(sx, sy, 0, sx, sy, glowR);
          const ga    = (0.18 * glintStr).toFixed(3);
          gGrd.addColorStop(0,   `rgba(${rC},${gC},${bC},${ga})`);
          gGrd.addColorStop(0.5, `rgba(${rC},${gC},${bC},${(parseFloat(ga) * 0.4).toFixed(3)})`);
          gGrd.addColorStop(1,   `rgba(${rC},${gC},${bC},0)`);
          ctx!.fillStyle = gGrd;
          ctx!.beginPath();
          ctx!.arc(sx, sy, glowR, 0, Math.PI * 2);
          ctx!.fill();

          // crisp core flare
          const ca = Math.min(0.9, 0.45 + glintStr * 0.5);
          ctx!.fillStyle = `rgba(${rC},${gC},${bC},${ca.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(sx, sy, m.r * (1 + glintStr * 1.2), 0, Math.PI * 2);
          ctx!.fill();

          ctx!.globalCompositeOperation = "source-over";
          ctx!.restore();
        } else {
          // normal silver/aluminum mote
          // faint tint — mix toward slightly warm white
          ctx!.fillStyle = `rgba(161,161,166,${baseAlpha.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(sx, sy, m.r, 0, Math.PI * 2);
          ctx!.fill();
        }

        // advance position
        m.x += m.vx;
        m.y += m.vy;
      }
    }

    /* ── ambient edge vignette (very subtle) ────────────────────────────── */
    function drawVignette() {
      const grd = ctx!.createRadialGradient(
        w * 0.5, h * 0.45, Math.min(w, h) * 0.30,
        w * 0.5, h * 0.45, Math.max(w, h) * 0.82,
      );
      grd.addColorStop(0, "rgba(10,10,11,0)");
      grd.addColorStop(1, "rgba(10,10,11,0.50)");
      ctx!.fillStyle = grd;
      ctx!.fillRect(0, 0, w, h);
    }

    /* ── main loop ──────────────────────────────────────────────────────── */
    let tick = 0;

    function frame() {
      tick++;
      ctx!.clearRect(0, 0, w, h);

      drawBeams();
      drawMotes(tick);
      drawVignette();

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    frame();
    if (reduce) {
      // warm up into a natural static snapshot
      for (let i = 0; i < 20; i++) frame();
    }

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}
