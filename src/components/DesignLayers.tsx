"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "./lang";

/* ─────────────────────────────────────────────────────────────────────────────
   PALETTE  (spec-exact; explicit hex for canvas)
───────────────────────────────────────────────────────────────────────────── */
const C = {
  void950:  "#0a0a0b",
  void900:  "#111113",
  void800:  "#18181b",
  void700:  "#232327",
  flux500:  "#2997ff",  // Apple-blue
  flux400:  "#6cb8ff",
  iris500:  "#a663cc",  // violet
  iris400:  "#c79be0",
  leaf500:  "#61bb46",  // design-all-the-way-through
  leaf400:  "#8fd47a",
  gold500:  "#f6a623",  // lineage
  gold400:  "#ffc15e",
  plasm500: "#ff5e5b",  // design-as-imposition
  plasm400: "#ff8a87",
  steel500: "#86868b",  // surface / material
  steel400: "#a1a1a6",
  ink50:    "#f5f5f7",
  ink300:   "#a1a1a6",
  ink500:   "#6e6e73",
};

/* ─────────────────────────────────────────────────────────────────────────────
   LAYER DATA
   Four concentric design layers: Surface → Interaction → Architecture → Interior
───────────────────────────────────────────────────────────────────────────── */
type LayerId = "surface" | "interaction" | "architecture" | "interior";

interface Layer {
  id: LayerId;
  depth: number;       // 0 = outermost
  color: string;
  dimColor: string;
  icon: string;
  name: { en: string; zh: string };
  tagline: { en: string; zh: string };
  body: { en: string; zh: string };
  verdict: { en: string; zh: string };  // is this what "styling" addresses, or "design"?
  verdictStyling: boolean;  // true = styling stops here; false = design reaches here
  radius: number;      // canvas ring outer radius fraction 0–1
}

const LAYERS: Layer[] = [
  {
    id: "surface",
    depth: 0,
    color: C.steel500,
    dimColor: C.steel400,
    icon: "◻",
    radius: 1.0,
    name:    { en: "Surface", zh: "表层" },
    tagline: { en: "Form · Material · Colour · Finish", zh: "形态 · 材质 · 色彩 · 表面处理" },
    body: {
      en: "The layer the eye meets first: the curve of an enclosure, the weight of aluminium in the hand, a precise radius on every corner, the matte of anodised metal. Jobs understood that this layer carries meaning — not decoration. But it is the layer that stylists can reach without going further. \"Styling\" stops here. Real design uses this layer as the conclusion of thinking that started deeper.",
      zh: "眼睛最先触及的层：外壳的弧度、手中铝材的分量、每个角落精确的圆角半径、阳极氧化金属的哑光质感。乔布斯深知这一层承载着意义——而非装饰。但这也是造型师无需深入便可触达的层。「造型设计」止步于此。真正的设计，将这一层用作更深层思考的结论。",
    },
    verdict: {
      en: "Styling addresses only this layer. Design uses it as the final statement of deeper decisions.",
      zh: "造型设计仅止于此层。而真正的设计，将此层作为更深层决策的最终表达。",
    },
    verdictStyling: true,
  },
  {
    id: "interaction",
    depth: 1,
    color: C.flux500,
    dimColor: C.flux400,
    icon: "◈",
    radius: 0.72,
    name:    { en: "Interaction", zh: "交互层" },
    tagline: { en: "How you use it · Flow · Feedback · Gesture", zh: "如何使用 · 流程 · 反馈 · 手势" },
    body: {
      en: "The original iPod's click wheel was not a visual flourish. It was a solution to a problem: browse a thousand songs with a thumb and never get lost. Every interaction on every Apple product was auditioned against one criterion — does the next step feel inevitable? The scroll that has momentum, the swipe that carries intention. This layer is invisible when right, and excruciating when wrong. Styling doesn't reach it; only design does.",
      zh: "最初的iPod点击转盘并非视觉噱头。它是一个问题的解答：用大拇指浏览千首歌曲，且不会迷失。苹果每款产品上的每一次交互，都以同一标准经过考量——下一步是否感觉理所当然？带有惯性的滚动，承载意图的滑动。这一层做对了便隐于无形，做错了则令人痛苦。造型设计无法触及此处；只有真正的设计才能。",
    },
    verdict: {
      en: "This layer is where design begins to separate from decoration. The experience you don't notice is the goal.",
      zh: "这一层是设计与装饰开始分道扬镳之处。你毫无察觉的体验，才是目标。",
    },
    verdictStyling: false,
  },
  {
    id: "architecture",
    depth: 2,
    color: C.iris500,
    dimColor: C.iris400,
    icon: "◉",
    radius: 0.47,
    name:    { en: "Architecture", zh: "架构层" },
    tagline: { en: "How it's structured · System logic · Hierarchy · Constraints", zh: "结构方式 · 系统逻辑 · 层级 · 约束" },
    body: {
      en: "Mac OS X's window management, the original iPhone's single home button, the iPad's one-application focus: these are architectural decisions. They define what is possible, what is forbidden, and what requires three steps versus one. The architecture is invisible to most users, but it is the skeleton that every interaction and surface is built on. Wrong architecture makes every layer above it a fight. Right architecture makes the impossible feel natural.",
      zh: "Mac OS X的窗口管理、初代iPhone的单一Home键、iPad的单应用焦点——这些都是架构决策。它们定义了什么是可能的、什么被禁止，以及什么需要三步而非一步。架构对大多数用户来说不可见，但它是每一层交互与表面赖以建立的骨架。错误的架构让上面每一层都变成一场搏斗。正确的架构让不可能感觉自然。",
    },
    verdict: {
      en: "Architecture is the level where the real decisions are made. Surface and interaction are downstream consequences.",
      zh: "架构层才是真正做决策之处。表层与交互层是它的下游结果。",
    },
    verdictStyling: false,
  },
  {
    id: "interior",
    depth: 3,
    color: C.leaf500,
    dimColor: C.leaf400,
    icon: "◇",
    radius: 0.26,
    name:    { en: "The Unseen Interior", zh: "不可见的内部" },
    tagline: { en: "The parts no one sees · Craftsmanship in the dark", zh: "无人见及之处 · 黑暗中的工艺" },
    body: {
      en: "Jobs insisted that the interior of the original Mac had to be beautiful — the circuit board, the cabling, the inside of the enclosure — even though no customer would ever see it. He cited his father's teaching: a craftsman cares about the back of a cabinet even if it sits against a wall. This is not aesthetics for its own sake. It is a belief that the commitment to quality must be total, because any place you allow yourself not to care becomes a place where everything unravels. The parts no one sees constrain everything else.",
      zh: "乔布斯坚持最初的Mac内部必须要美——电路板、线束、外壳内侧——尽管没有任何顾客会看到它们。他援引父亲的教诲：一个工匠，即便橱柜靠墙而立，也在乎它的背面。这并非为美而美。这是一种信念：对品质的承诺必须是全然的，因为任何你允许自己不在乎的地方，都会成为一切松动之处。无人见及的部件，约束着其他一切。",
    },
    verdict: {
      en: "Design all the way through: the quality of what no one sees disciplines the quality of everything they do.",
      zh: "设计贯穿始终：无人见及之处的品质，约束着所有可见之处的品质。",
    },
    verdictStyling: false,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   LINEAGE DATA  — Bauhaus → Dieter Rams → Jobs
───────────────────────────────────────────────────────────────────────────── */
interface LineageNode {
  id: string;
  era: { en: string; zh: string };
  name: { en: string; zh: string };
  creed: { en: string; zh: string };
  body: { en: string; zh: string };
  arrow?: { en: string; zh: string };
  color: string;
}

const LINEAGE: LineageNode[] = [
  {
    id: "bauhaus",
    era:   { en: "Weimar, 1919–1933", zh: "魏玛，1919–1933" },
    name:  { en: "Bauhaus — Form Follows Function", zh: "包豪斯 — 形式追随功能" },
    creed: { en: '"Form ever follows function."', zh: "「形式永远追随功能。」" },
    body: {
      en: "Louis Sullivan's axiom became Bauhaus doctrine: ornament that serves no function is not neutral — it is dishonest. Gropius, Mies, Moholy-Nagy built the premise that a chair's form should be the purest possible solution to the problem of sitting. Not decorated sitting. Not sitting with historical signalling. Sitting, solved. This was the first claim that art, craft, and industry could share a single truth.",
      zh: "路易·沙利文的格言成为包豪斯信条：无功能的装饰并非中性——它是不诚实的。格罗皮乌斯、密斯、莫霍利-纳吉建立了这样一个前提：一把椅子的形态，应该是「坐」这一问题最纯粹的解答。不是装饰化的坐。不是带有历史符号的坐。只是「坐」，被解决了。这是艺术、工艺与工业可以共享同一真理的第一次宣告。",
    },
    arrow: {
      en: "transmitted through Ulm School to Braun's industrial design department →",
      zh: "经乌尔姆学院传至博朗工业设计部门 →",
    },
    color: C.gold500,
  },
  {
    id: "rams",
    era:   { en: "Frankfurt, 1955–1995", zh: "法兰克福，1955–1995" },
    name:  { en: "Dieter Rams — Less, But Better", zh: "迪特·拉姆斯 — 少，但更好" },
    creed: { en: '"Good design is as little design as possible."', zh: "「好设计，是尽可能少的设计。」" },
    body: {
      en: "Rams's ten principles for good design are the clearest articulation of the lineage: honest, unobtrusive, long-lasting, thorough down to the last detail. His Braun products — the T3 pocket radio, the ET 66 calculator, the 606 shelving system — look like the design language Jobs would inherit. But the inheritance was not superficial mimicry. It was the shared conviction that a product should not shout, should not pretend, and should not wear its function on the outside like a costume. \"Weniger, aber besser\" — less, but better — is a discipline, not a style.",
      zh: "拉姆斯的设计十原则，是这一谱系最清晰的表达：诚实、不张扬、经久耐用、细节上一丝不苟。他的博朗产品——T3袖珍收音机、ET 66计算器、606置物架系统——看起来就像乔布斯日后继承的设计语言。但这种继承并非表面模仿。它是一种共同的信念：产品不应喧嚣，不应伪装，不应把功能像戏服一样穿在外面。「Weniger, aber besser」——少，但更好——是一种纪律，不是一种风格。",
    },
    arrow: {
      en: "Jobs studied Braun products; Ive acknowledged the lineage explicitly →",
      zh: "乔布斯研究博朗产品；艾维明确承认了这一谱系 →",
    },
    color: C.flux500,
  },
  {
    id: "jobs",
    era:   { en: "Cupertino, 1997–2011", zh: "库比蒂诺，1997–2011" },
    name:  { en: "Steve Jobs — Simplicity is Mastery", zh: "史蒂夫·乔布斯 — 简洁即掌控" },
    creed: { en: '"Simplicity is the ultimate sophistication."', zh: "「简洁是终极的复杂。」" },
    body: {
      en: "Jobs synthesised the lineage into a single conviction: real simplicity is not the removal of features — it is the mastery of complexity on the user's behalf. \"It takes a lot of hard work to make something simple, to truly understand the underlying challenges and come up with elegant solutions.\" The iMac's translucent shell was not whimsy; the iPhone's single button was not poverty; the MacBook's unibody was not minimalism for show. Each was the surface expression of a system whose complexity had been conquered, not hidden.",
      zh: "乔布斯将这一谱系综合为一个核心信念：真正的简洁不是去除功能——而是代替用户掌控复杂性。「让某样东西变得简单需要大量艰辛的工作，真正理解其深层挑战并找出优雅的解决方案。」iMac的半透明外壳并非任性；iPhone的单一按钮并非贫乏；MacBook的一体成型并非摆姿态的极简主义。每一样都是一个系统——其复杂性已被征服而非隐藏——的表面表达。",
    },
    color: C.leaf500,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PEELABLE LAYERS CANVAS
   Concentric rings, outermost = Surface, innermost = Unseen Interior.
   Active layer glows; peeled layers remain at reduced opacity.
───────────────────────────────────────────────────────────────────────────── */
interface LayerCanvasProps {
  activeId: LayerId;
  peeled: Set<LayerId>;
  lang: "en" | "zh";
}

function LayerCanvas({ activeId, peeled, lang }: LayerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const glowRef   = useRef(0);  // t for breathing glow

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let lastTs = 0;

    const draw = (ts: number) => {
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0;
      lastTs = ts;
      glowRef.current = (glowRef.current + dt * 1.1) % (Math.PI * 2);

      const ctx = canvas.getContext("2d");
      if (!ctx || W === 0) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.void900;
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;
      const maxR = Math.min(W, H) * 0.46;

      // Draw from outside inward (Surface first, Interior last)
      [...LAYERS].reverse().forEach((layer) => {
        const R = maxR * layer.radius;
        const isActive  = layer.id === activeId;
        const isPeeled  = peeled.has(layer.id);
        const glow      = 0.55 + 0.45 * Math.sin(glowRef.current + layer.depth * 0.9);
        const baseAlpha = isPeeled ? 0.22 : (isActive ? 1.0 : 0.45);
        const strokeAlpha = isPeeled ? 0.15 : (isActive ? glow : 0.3);

        // filled ring (annulus) — done as full circle, overdrawn inward
        const grad = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
        const hexA = Math.round(baseAlpha * 255).toString(16).padStart(2, "0");
        grad.addColorStop(0, `${layer.color}00`);
        grad.addColorStop(0.7, `${layer.color}${hexA}`);
        grad.addColorStop(1, `${layer.color}${hexA}`);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // stroke ring
        const strokeHex = Math.round(strokeAlpha * 255).toString(16).padStart(2, "0");
        ctx.strokeStyle = `${layer.color}${strokeHex}`;
        ctx.lineWidth = isActive ? 1.8 : 0.7;
        if (isActive) {
          ctx.shadowColor = layer.color;
          ctx.shadowBlur  = 18;
        }
        ctx.stroke();
        ctx.restore();

        // Label on ring — only if not peeled or is active
        if (!isPeeled || isActive) {
          const labelR = R - 10;
          const labelAngle = -Math.PI / 2 - layer.depth * 0.28;
          const lx = cx + labelR * Math.cos(labelAngle);
          const ly = cy + labelR * Math.sin(labelAngle);

          ctx.save();
          ctx.font = `${isActive ? "bold " : ""}${isActive ? 9 : 7.5}px 'JetBrains Mono', monospace`;
          ctx.textAlign  = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle  = isActive
            ? layer.color
            : `${layer.color}${Math.round(baseAlpha * 200).toString(16).padStart(2, "0")}`;
          if (isActive) {
            ctx.shadowColor = layer.color;
            ctx.shadowBlur  = 10;
          }
          const label = lang === "zh" ? layer.name.zh : layer.name.en.toUpperCase();
          ctx.fillText(label, lx, ly);
          ctx.restore();
        }
      });

      // Core dot — glowing leaf at the center
      const coreGlow = 0.6 + 0.4 * Math.sin(glowRef.current);
      const coreR = maxR * 0.08;
      ctx.save();
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      coreGrad.addColorStop(0, `${C.leaf400}ff`);
      coreGrad.addColorStop(0.6, `${C.leaf500}88`);
      coreGrad.addColorStop(1, `${C.leaf500}00`);
      ctx.globalAlpha = 0.5 + 0.5 * coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.shadowColor = C.leaf500;
      ctx.shadowBlur  = 22;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();

      // Legend: layer name on the right side
      const legendX = W * 0.72;
      LAYERS.forEach((layer) => {
        const R       = maxR * layer.radius;
        const isActive  = layer.id === activeId;
        const isPeeled  = peeled.has(layer.id);
        const ly      = cy + (layer.depth - 1.5) * (R * 0.26 + 8);

        const alpha = isPeeled ? 0.22 : (isActive ? 1 : 0.45);
        ctx.save();
        ctx.font = `${isActive ? "bold " : ""}${isActive ? 8.5 : 7}px 'JetBrains Mono', monospace`;
        ctx.textAlign    = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle    = `${layer.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
        if (isActive) {
          ctx.shadowColor = layer.color;
          ctx.shadowBlur  = 8;
        }
        // tick line
        ctx.strokeStyle = `${layer.color}${Math.round(alpha * 0.7 * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth   = 0.6;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(cx + R, cy + (layer.depth - 1.5) * 0);
        ctx.lineTo(legendX - 4, ly);
        ctx.stroke();
        ctx.setLineDash([]);

        const lname = lang === "zh" ? layer.name.zh : layer.name.en;
        ctx.fillText(lname, legendX, ly);
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [activeId, peeled, lang]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-label={
        lang === "zh"
          ? "设计层级示意图：同心圆环从表层到不可见内部"
          : "Design layers diagram: concentric rings from surface to unseen interior"
      }
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LINEAGE CONNECTOR SVG
   A flowing arrow from Bauhaus → Rams → Jobs
───────────────────────────────────────────────────────────────────────────── */
function LineageConnector({ active }: { active: number }) {
  const W = 320;
  const H = 28;
  const nodes = [60, 160, 260];
  const colors = [C.gold500, C.flux500, C.leaf500];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-7" aria-hidden="true">
      {/* dashed flow line */}
      <line
        x1={nodes[0]} y1={H / 2} x2={nodes[2]} y2={H / 2}
        stroke={`${C.steel500}30`} strokeWidth={1}
        strokeDasharray="4 7"
      />
      {/* active fill */}
      <line
        x1={nodes[0]} y1={H / 2} x2={nodes[active]} y2={H / 2}
        stroke={colors[active]} strokeWidth={1.2}
        strokeDasharray="4 7"
        className="flow"
        opacity={0.7}
      />
      {nodes.map((x, i) => (
        <g key={i}>
          <circle
            cx={x} cy={H / 2} r={i === active ? 7 : 5}
            fill={i <= active ? `${colors[i]}22` : `${C.void800}`}
            stroke={colors[i]}
            strokeWidth={i === active ? 1.5 : 0.8}
            opacity={i <= active ? 1 : 0.35}
          />
          {i === active && (
            <circle
              cx={x} cy={H / 2} r={9}
              fill="none"
              stroke={colors[i]}
              strokeWidth={0.6}
              opacity={0.5}
              className="breathe"
            />
          )}
        </g>
      ))}
      {/* arrowhead */}
      <polygon
        points={`${nodes[2] + 10},${H / 2} ${nodes[2] + 4},${H / 2 - 3} ${nodes[2] + 4},${H / 2 + 3}`}
        fill={colors[2]}
        opacity={active === 2 ? 0.9 : 0.3}
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAVEAT PANEL — design as truth vs design as imposition
───────────────────────────────────────────────────────────────────────────── */
function DesignImpositionPanel({ lang }: { lang: "en" | "zh" }) {
  const L = (en: string, zh: string) => lang === "zh" ? zh : en;
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border transition-all duration-300"
      style={{
        borderColor: open ? `${C.plasm500}40` : `${C.plasm500}20`,
        background: open ? `${C.plasm500}07` : `${C.plasm500}03`,
        boxShadow: open ? `0 0 44px -20px ${C.plasm500}44` : "none",
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs"
          style={{ background: `${C.plasm500}18`, color: C.plasm400, border: `1px solid ${C.plasm500}30` }}
        >
          ⚠
        </div>
        <div className="flex-1 min-w-0">
          <div className="label-mono text-[0.6rem]" style={{ color: C.plasm400 }}>
            {L("CAVEAT · DESIGN AS IMPOSITION", "注意事项 · 设计作为强加")}
          </div>
          <div
            className={`display text-[0.92rem] font-bold mt-0.5 ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.plasm400 }}
          >
            {L(
              "When conviction becomes control: the ports that were removed",
              "当信念变为管控：被移除的接口",
            )}
          </div>
        </div>
        <div
          className="shrink-0 label-mono text-[0.6rem] transition-transform duration-200"
          style={{
            color: C.plasm400,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-4">
          <div className="h-px" style={{ background: `${C.plasm500}20` }} />
          <p
            className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L(
              "The same conviction that made Apple products coherent also made them uncompromising in ways users did not always request. The original iMac removed the floppy drive before many users were ready. The 2016 MacBook Pro removed every port but USB-C, forcing adapters. The iPhone never had a replaceable battery. The iPad's walled garden limited sideloading. In each case, Jobs's (and later Tim Cook's) rationale was consistent: the friction of ports and doors is design clutter, and the system will be simpler without them.",
              "正是让苹果产品保持一致性的那种信念，也让它们以用户未必要求的方式变得不妥协。初代iMac在许多用户还没准备好之前就移除了软驱。2016款MacBook Pro除了USB-C之外移除了所有接口，迫使用户使用转接器。iPhone从未有过可更换电池。iPad的封闭生态限制了旁加载。每一次，乔布斯（后来是蒂姆·库克）的理由都是一致的：接口和舱门的摩擦是设计杂乱，没有它们系统会更简洁。",
            )}
          </p>
          <p
            className={`text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
          >
            {L(
              "The tension is real and worth naming: design as mastery of complexity (done on behalf of the user) versus design as substitution of the designer's judgement for the user's preference. These are not the same operation, even if they sometimes share a surface. The Bauhaus–Rams–Jobs lineage holds that the designer knows better what the user truly needs — which can be a profound service, or a form of paternalism dressed as elegance. Both can be true simultaneously.",
              "这种张力是真实的，值得点明：将复杂性的掌控作为设计（代表用户完成），与用设计师的判断取代用户偏好的设计——这并非同一种操作，即便它们有时表面相同。包豪斯–拉姆斯–乔布斯谱系的主张是：设计师比用户更清楚他们真正需要什么——这既可以是深刻的服务，也可以是以优雅为名的家长式作风。两者可以同时为真。",
            )}
          </p>
          <div
            className={`text-[0.78rem] px-4 py-3 rounded-xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
            style={{
              background: `${C.plasm500}0d`,
              border: `1px solid ${C.plasm500}22`,
              color: `${C.ink300}bb`,
              fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
            }}
          >
            {L(
              "The question is not whether the designer's conviction was wrong. Often it was right — the headphone jack's removal accelerated wireless audio; the floppy drive's removal was early. The question is whether the user was consulted, whether the removal served the user's actual workflow, and whether the decision was reversible. Design all the way through is a virtue. Design over the user's objection is a choice.",
              "问题不在于设计师的信念是否错误。通常它是对的——移除耳机孔加速了无线音频的普及；移除软驱只是时机偏早。问题在于：用户是否被征询，移除是否服务于用户的实际工作流程，以及这个决定是否可逆。贯穿始终的设计是一种美德。凌驾于用户异议之上的设计，是一种选择。",
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function DesignLayers() {
  const { lang } = useLang();
  const L = useCallback((en: string, zh: string) => lang === "zh" ? zh : en, [lang]);

  // Which layer is currently active / expanded
  const [activeLayer, setActiveLayer] = useState<LayerId>("surface");
  // Which layers have been peeled (toggled off)
  const [peeledLayers, setPeeledLayers] = useState<Set<LayerId>>(new Set());

  // Active lineage node
  const [activeLineage, setActiveLineage] = useState(0);

  const activeLayerData = LAYERS.find(l => l.id === activeLayer)!;

  const togglePeel = useCallback((id: LayerId) => {
    setPeeledLayers(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full flex flex-col gap-10">

      {/* ── SECTION HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono" style={{ color: C.flux500 }}>
          {L("Theme 02 · Simplicity & Design", "主题02 · 简洁与设计")}
        </div>
        <h2 className={`display text-3xl md:text-4xl leading-tight spark-text ${lang === "zh" ? "zh" : ""}`}>
          {L("Design Is Not How It Looks", "设计不是外观")}
        </h2>
        <p
          className={`display text-xl md:text-2xl font-bold ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.leaf400 }}
        >
          {L("It is how it works — all the way through.", "而是它如何运作——贯穿始终。")}
        </p>
        <p
          className={`text-sm max-w-2xl leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
        >
          {L(
            "Styling is skin-deep. Design reaches all the way down. Jobs's conviction — inherited from Bauhaus and Dieter Rams, sharpened into doctrine — was that every layer of a product, including the parts no one sees, must be resolved with the same rigour as the face the customer touches. Peel the layers. See how far design must go.",
            "造型只有皮相。设计贯穿每一层。乔布斯的信念——源自包豪斯与迪特·拉姆斯，被磨砺成教义——是产品的每一层，包括无人见及之处，都必须以顾客触碰到的那一面同等的严苛来处理。剥开每一层，看看设计必须走多深。",
          )}
        </p>
      </div>

      <div className="h-px rule-flux opacity-40 rounded-full" />

      {/* ── PART 1: THE PEELABLE LAYERS ──────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div className="label-mono" style={{ color: C.leaf500 }}>
          {L("Part 1 · The Design Layers", "第一部分 · 设计层级")}
        </div>

        {/* Main split: canvas left, detail right */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 items-start">

          {/* Canvas */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              background: C.void900,
              borderColor: `${activeLayerData.color}28`,
              boxShadow: `0 0 60px -24px ${activeLayerData.color}44`,
              transition: "border-color 0.4s, box-shadow 0.4s",
            }}
          >
            <div style={{ height: 300 }}>
              <LayerCanvas
                activeId={activeLayer}
                peeled={peeledLayers}
                lang={lang}
              />
            </div>
            {/* Peeled/active hint */}
            <div
              className="px-4 py-2 flex items-center justify-between gap-2 border-t"
              style={{ borderColor: `${C.steel500}15` }}
            >
              <span
                className={`text-[0.63rem] font-mono ${lang === "zh" ? "zh" : ""}`}
                style={{ color: `${C.ink500}88` }}
              >
                {L("Click a layer to explore · Toggle to peel", "点击层级探索 · 切换以剥离")}
              </span>
              {peeledLayers.size > 0 && (
                <button
                  onClick={() => setPeeledLayers(new Set())}
                  className="font-mono text-[0.6rem] px-2 py-1 rounded-full border transition-all duration-150 hover:opacity-100 opacity-70"
                  style={{ borderColor: `${C.steel500}30`, color: C.steel400 }}
                >
                  {L("Restore all", "还原全部")}
                </button>
              )}
            </div>
          </div>

          {/* Layer selector + detail */}
          <div className="flex flex-col gap-3">

            {/* Layer buttons */}
            <div className="grid grid-cols-2 gap-2">
              {LAYERS.map((layer) => {
                const isActive = layer.id === activeLayer;
                const isPeeled = peeledLayers.has(layer.id);
                return (
                  <button
                    key={layer.id}
                    onClick={() => {
                      setActiveLayer(layer.id);
                      if (isPeeled) togglePeel(layer.id);
                    }}
                    className="panel rounded-xl px-3 py-3 text-left flex flex-col gap-1 transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      borderColor: isActive
                        ? `${layer.color}55`
                        : isPeeled
                          ? `${layer.color}10`
                          : `${layer.color}22`,
                      boxShadow: isActive ? `0 0 28px -10px ${layer.color}66` : "none",
                      opacity: isPeeled ? 0.45 : 1,
                    }}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm shrink-0"
                        style={{ color: isActive ? layer.color : `${layer.color}88` }}
                      >
                        {layer.icon}
                      </span>
                      <span
                        className={`display text-[0.72rem] font-bold leading-tight ${lang === "zh" ? "zh" : ""}`}
                        style={{ color: isActive ? layer.color : C.ink500 }}
                      >
                        {layer.name[lang]}
                      </span>
                      {layer.verdictStyling && (
                        <span
                          className="ml-auto shrink-0 label-mono text-[0.48rem] px-1.5 py-0.5 rounded"
                          style={{
                            background: `${C.steel500}18`,
                            color: `${C.steel400}99`,
                            border: `1px solid ${C.steel500}22`,
                          }}
                        >
                          {L("STYLING", "造型")}
                        </span>
                      )}
                      {!layer.verdictStyling && (
                        <span
                          className="ml-auto shrink-0 label-mono text-[0.48rem] px-1.5 py-0.5 rounded"
                          style={{
                            background: `${C.leaf500}18`,
                            color: `${C.leaf400}99`,
                            border: `1px solid ${C.leaf500}22`,
                          }}
                        >
                          {L("DESIGN", "设计")}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[0.63rem] leading-tight mt-0.5 ${lang === "zh" ? "zh" : ""}`}
                      style={{ color: `${C.ink500}99` }}
                    >
                      {layer.tagline[lang]}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Peel toggle for active layer */}
            <button
              onClick={() => togglePeel(activeLayer)}
              className="self-start flex items-center gap-2 px-3 py-2 rounded-full font-mono text-[0.63rem] border transition-all duration-200 hover:opacity-100"
              style={{
                borderColor: peeledLayers.has(activeLayer)
                  ? `${activeLayerData.color}45`
                  : `${C.steel500}30`,
                color: peeledLayers.has(activeLayer)
                  ? activeLayerData.color
                  : C.steel400,
                background: peeledLayers.has(activeLayer)
                  ? `${activeLayerData.color}12`
                  : "transparent",
                opacity: 0.85,
              }}
            >
              {peeledLayers.has(activeLayer)
                ? L(`▲ Restore ${activeLayerData.name.en}`, `▲ 恢复${activeLayerData.name.zh}`)
                : L(`▼ Peel ${activeLayerData.name.en}`, `▼ 剥离${activeLayerData.name.zh}`)}
            </button>

            {/* Active layer detail card */}
            <div
              className="panel rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300"
              style={{
                borderColor: `${activeLayerData.color}35`,
                boxShadow: `0 0 44px -18px ${activeLayerData.color}44`,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 breathe"
                  style={{
                    background: activeLayerData.color,
                    boxShadow: `0 0 10px ${activeLayerData.color}`,
                  }}
                />
                <div className="label-mono text-[0.58rem]" style={{ color: activeLayerData.color }}>
                  {L(
                    `Layer ${activeLayerData.depth + 1} of ${LAYERS.length} · ${activeLayerData.name.en.toUpperCase()}`,
                    `第${activeLayerData.depth + 1}层（共${LAYERS.length}层）· ${activeLayerData.name.zh}`,
                  )}
                </div>
              </div>
              <div
                className={`display text-base font-bold leading-snug ${lang === "zh" ? "zh" : ""}`}
                style={{ color: activeLayerData.color }}
              >
                {activeLayerData.tagline[lang]}
              </div>
              <p
                className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
              >
                {activeLayerData.body[lang]}
              </p>
              <div
                className={`flex items-start gap-2 px-3 py-2 rounded-xl text-[0.72rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{
                  background: `${activeLayerData.color}0d`,
                  border: `1px solid ${activeLayerData.color}22`,
                  color: activeLayerData.dimColor,
                  fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
                  fontStyle: "italic",
                }}
              >
                <span className="shrink-0 text-xs mt-0.5" style={{ color: activeLayerData.color }}>
                  {activeLayerData.verdictStyling ? "◈" : "◉"}
                </span>
                <span>{activeLayerData.verdict[lang]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Styling vs Design callout */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div
            className="panel rounded-2xl p-4 flex flex-col gap-2"
            style={{ borderColor: `${C.steel500}22`, boxShadow: `0 0 32px -18px ${C.steel500}33` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: C.steel400 }}
              />
              <div className="label-mono text-[0.58rem]" style={{ color: C.steel400 }}>
                {L("STYLING — surface only", "造型设计 — 仅及表层")}
              </div>
            </div>
            <p
              className={`text-[0.74rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink500, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
            >
              {L(
                "Styling modifies the surface layer: colour, material, finish, form. It can be executed without any understanding of how the product works, what the user does, or how the system is structured. It produces objects that are visually coherent but internally incoherent — attractive at first contact, frustrating in use.",
                "造型设计修改的是表层：颜色、材质、表面处理、外形。它可以在完全不理解产品如何运作、用户如何使用、系统如何构建的情况下执行。它产出的是视觉上连贯但内部不一致的物品——初次接触时令人愉悦，实际使用时令人沮丧。",
              )}
            </p>
          </div>
          <div
            className="panel-leaf panel rounded-2xl p-4 flex flex-col gap-2"
            style={{ boxShadow: `0 0 32px -18px ${C.leaf500}44` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: C.leaf500, boxShadow: `0 0 8px ${C.leaf500}` }}
              />
              <div className="label-mono text-[0.58rem]" style={{ color: C.leaf400 }}>
                {L("DESIGN — all the way through", "真正的设计 — 贯穿始终")}
              </div>
            </div>
            <p
              className={`text-[0.74rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
              style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
            >
              {L(
                "Real design begins with function and works outward: architecture constrains interaction; interaction constrains surface. The visual form is the last decision, not the first. When the interior is right, the surface is right too — not by accident, but because both are answers to the same question. This is what Jobs meant. Design is how it works.",
                "真正的设计从功能出发，由内而外：架构约束交互；交互约束表层。视觉形态是最后一个决策，不是第一个。当内部是正确的，表层也是正确的——不是偶然，而是因为两者都是同一个问题的答案。这正是乔布斯所说的。设计是它如何运作。",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── PART 2: THE LINEAGE ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div className="label-mono" style={{ color: C.gold500 }}>
          {L("Part 2 · The Design Lineage", "第二部分 · 设计谱系")}
        </div>
        <h3
          className={`display text-xl font-bold ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink50 }}
        >
          {L(
            "Bauhaus → Dieter Rams → Steve Jobs: Simplicity as inherited discipline",
            "包豪斯 → 迪特·拉姆斯 → 史蒂夫·乔布斯：简洁作为传承的纪律",
          )}
        </h3>
        <p
          className={`text-sm leading-relaxed max-w-2xl ${lang === "zh" ? "zh" : ""}`}
          style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
        >
          {L(
            "Jobs did not invent the conviction that design means function, honesty, and the removal of everything unnecessary. He inherited it from a lineage that runs from Weimar to Frankfurt to Cupertino. What he added was the industrial scale, the consumer technology medium, and the insistence that this was not a style preference but a truth about what products owe their users.",
            "乔布斯并非凭空发明了「设计意味着功能、诚实与去除一切多余之物」的信念。他继承了一条从魏玛到法兰克福再到库比蒂诺的谱系。他所添加的，是工业规模、消费技术这一介质，以及坚持认为这不是风格偏好，而是关于产品对用户负有何种责任的真理。",
          )}
        </p>

        {/* Lineage connector */}
        <div className="px-2">
          <LineageConnector active={activeLineage} />
          <div className="grid grid-cols-3 text-center mt-1">
            {LINEAGE.map((n, i) => (
              <div
                key={n.id}
                className={`label-mono text-[0.52rem] transition-all duration-200 cursor-default ${lang === "zh" ? "zh" : ""}`}
                style={{ color: i === activeLineage ? n.color : `${n.color}50` }}
              >
                {n.era[lang]}
              </div>
            ))}
          </div>
        </div>

        {/* Lineage node tabs */}
        <div className="flex gap-2 flex-wrap">
          {LINEAGE.map((n, i) => (
            <button
              key={n.id}
              onClick={() => setActiveLineage(i)}
              className="px-4 py-2 rounded-full font-mono text-[0.65rem] border transition-all duration-200"
              style={{
                borderColor: activeLineage === i ? `${n.color}60` : `${n.color}22`,
                color: activeLineage === i ? n.color : C.ink500,
                background: activeLineage === i ? `${n.color}15` : "transparent",
                boxShadow: activeLineage === i ? `0 0 16px -4px ${n.color}55` : "none",
              }}
              aria-pressed={activeLineage === i}
            >
              {n.name[lang]}
            </button>
          ))}
        </div>

        {/* Active lineage node detail */}
        {(() => {
          const node = LINEAGE[activeLineage];
          return (
            <div
              key={node.id}
              className="panel rounded-2xl p-5 flex flex-col gap-4 rise-in"
              style={{
                borderColor: `${node.color}30`,
                boxShadow: `0 0 48px -20px ${node.color}44`,
              }}
            >
              <div className="flex items-start gap-4 flex-wrap">
                <div>
                  <div className="label-mono text-[0.58rem] mb-1" style={{ color: `${node.color}80` }}>
                    {node.era[lang]}
                  </div>
                  <div
                    className={`display text-lg font-bold leading-snug ${lang === "zh" ? "zh" : ""}`}
                    style={{ color: node.color }}
                  >
                    {node.name[lang]}
                  </div>
                </div>
              </div>

              {/* Creed quote */}
              <blockquote
                className={`display text-base font-bold leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{
                  color: node.color,
                  borderLeft: `2px solid ${node.color}40`,
                  paddingLeft: "1rem",
                }}
              >
                {node.creed[lang]}
              </blockquote>

              <p
                className={`text-[0.78rem] leading-relaxed ${lang === "zh" ? "zh" : ""}`}
                style={{ color: C.ink300, fontFamily: lang === "zh" ? undefined : '"Spectral", serif' }}
              >
                {node.body[lang]}
              </p>

              {/* Arrow to next node */}
              {node.arrow && (
                <div
                  className={`flex items-center gap-2 text-[0.65rem] font-mono ${lang === "zh" ? "zh" : ""}`}
                  style={{ color: `${node.color}70` }}
                >
                  <span className="flow shrink-0" style={{ fontSize: "1rem" }}>→</span>
                  <span>{node.arrow[lang]}</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Lineage synthesis */}
        <div
          className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{
            borderColor: `${C.leaf500}18`,
            background: `${C.leaf500}04`,
            color: C.ink500,
            fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
          }}
        >
          {L(
            "The common thread across Bauhaus, Rams, and Jobs is a single claim: ornament that serves no function is not neutral — it is dishonest. Honest design shows what it is. It does not pretend to be more, or less, than it is. Jobs extended this principle into every layer of every product — and, crucially, into the manufacturing process itself, the packaging, the retail environment, the unboxing. Design as a total commitment, not a department.",
            "贯穿包豪斯、拉姆斯与乔布斯的共同主线，是同一个主张：无功能的装饰不是中性的——它是不诚实的。诚实的设计展示它本身的样子。它不假装自己比实际更多或更少。乔布斯将这一原则延伸至每款产品的每一层——而且，关键地，延伸至制造过程本身、包装、零售环境、开箱体验。设计作为一种全然的承诺，而非一个部门。",
          )}
        </div>
      </div>

      <div className="h-px rule-flux opacity-25 rounded-full" />

      {/* ── PART 3: DESIGN AS IMPOSITION ─────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <div className="label-mono" style={{ color: C.plasm500 }}>
          {L("Part 3 · The Fair Accounting", "第三部分 · 公正的核算")}
        </div>
        <DesignImpositionPanel lang={lang} />
      </div>

      {/* ── CLOSING OBSERVATION ──────────────────────────────────────────────── */}
      <div
        className={`rounded-xl border px-5 py-4 text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`}
        style={{
          borderColor: `${C.leaf500}15`,
          background: `${C.leaf500}04`,
          color: C.ink500,
          fontFamily: lang === "zh" ? undefined : '"Spectral", serif',
        }}
      >
        {L(
          "\"Design is not just what it looks like and feels like. Design is how it works.\" — Jobs, New York Times Magazine, 2003. This sentence contains a claim about depth: that appearances are downstream of function, and that real design is the act of resolving function — at every layer, including the layers no one sees — and then allowing the surface to follow. The test is not whether it looks good. The test is whether the layers are honest with each other.",
          "「设计不只是外观和感觉。设计是它如何运作。」——乔布斯，《纽约时报杂志》，2003年。这句话包含一个关于深度的主张：外表是功能的下游，而真正的设计，是在每一层——包括无人见及的层——解决功能问题，然后让表层随之而来。检验标准不是它是否好看。检验标准是各层之间是否彼此诚实。",
        )}
      </div>

    </div>
  );
}
