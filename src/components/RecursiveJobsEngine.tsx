"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang, T } from "./lang";
import type { Bi } from "./lang";

/* ══════════════════════════════════════════════════════════════════
   RecursiveJobsEngine — The Compounding Digital-Hub Cycle
   System closer: steps through 7 stages of Steve Jobs' platform
   recursion — each product platform enabled the next and re-applied
   the same method (simplicity + integration + taste + focus).
   Stage 7 surfaces the open question: does the method survive
   the man? Rendered in coral/plasm to mark the unresolved arc.
══════════════════════════════════════════════════════════════════ */

/* ── palette (raw hex for canvas / SVG) ── */
const HEX = {
  flux:   "#2997ff",
  flux4:  "#6cb8ff",
  iris:   "#a663cc",
  iris4:  "#c79be0",
  gold:   "#f6a623",
  gold4:  "#ffc15e",
  leaf:   "#61bb46",
  leaf4:  "#8fd47a",
  plasm:  "#ff5e5b",
  plasm4: "#ff8a87",
  steel:  "#86868b",
  steel4: "#a1a1a6",
  void9:  "#0a0a0b",
  void8:  "#18181b",
  void7:  "#232327",
  void6:  "#34343a",
  ink3:   "#a1a1a6",
  ink5:   "#6e6e73",
} as const;

/* ── stage definitions ── */
interface Stage {
  id: string;
  num: number;
  era: Bi;
  name: Bi;
  what: Bi;       // what it was
  enabled: Bi;    // what it enabled next
  method: Bi;     // how the method applied
  integration: number; // 0–1: degree of integration / ecosystem compounding
  openQuestion?: true; // marks the unresolved arc
}

const STAGES: Stage[] = [
  {
    id: "mac-hub",
    num: 1,
    era: { en: "1998 – 2001", zh: "1998—2001 年" },
    name: { en: "The Mac as Digital Hub", zh: "作为数字枢纽的 Mac" },
    what: {
      en: "The iMac (1998) rescued Apple from near-bankruptcy and announced the return of a coherent design vision. By 2001 Jobs articulated the hub strategy: the personal computer as the centre that camera, camcorder, music player, and PDA all plug into.",
      zh: "iMac（1998 年）将苹果从破产边缘拯救出来，宣告了连贯设计愿景的回归。到 2001 年，乔布斯提出了「数字枢纽」战略：个人电脑作为中心，摄像机、DV、音乐播放器和 PDA 都接入其中。",
    },
    enabled: {
      en: "The hub vision demanded a dedicated device. If the Mac managed your music library, Apple had to build the best portable music player — not license the category to someone else.",
      zh: "枢纽愿景需要一款专属设备。如果 Mac 管理你的音乐库，苹果就必须打造最好的便携式音乐播放器——而不是将这个品类授权给他人。",
    },
    method: {
      en: "Simplicity: strip the iMac to its essence — a translucent teardrop, one cable, no beige. Integration: the hardware, the OS, and iLife apps are one designed whole.",
      zh: "简洁：将 iMac 化繁为简——半透明泪滴造型，一根线缆，告别米黄色。整合：硬件、操作系统与 iLife 应用构成一个设计整体。",
    },
    integration: 0.18,
  },
  {
    id: "ipod",
    num: 2,
    era: { en: "2001", zh: "2001 年" },
    name: { en: "iPod", zh: "iPod" },
    what: {
      en: '"1,000 songs in your pocket." The iPod collapsed function to a single click wheel and a single promise. Existing MP3 players were ugly, complex, and had no software story. The iPod had iTunes — the hub.',
      zh: "「把 1000 首歌装进口袋」。iPod 将功能浓缩为一个点击滚轮和一个核心承诺。当时市面上的 MP3 播放器丑陋、复杂且毫无软件支撑。而 iPod 背后有 iTunes——有枢纽。",
    },
    enabled: {
      en: "The iPod created a mass hardware audience and an enormous iTunes library. The natural next step: sell the music itself — not on CD but track by track, from the same company, through the same software.",
      zh: "iPod 创造了大规模的硬件用户群和庞大的 iTunes 曲库。下一步顺理成章：卖音乐本身——不是 CD，而是一首一首，由同一家公司出售，通过同一款软件完成。",
    },
    method: {
      en: "Taste over specs: Jobs chose feel over gigabytes. Focus: hundreds of features were cut to leave one scroll wheel. The device and its software were designed as one.",
      zh: "审美重于参数：乔布斯选择手感而非兆字节。专注：数百项功能被砍掉，只留下一个滚轮。设备与软件被作为一个整体来设计。",
    },
    integration: 0.32,
  },
  {
    id: "itunes-store",
    num: 3,
    era: { en: "2003", zh: "2003 年" },
    name: { en: "iTunes Store", zh: "iTunes Store" },
    what: {
      en: "Jobs persuaded every major label to license music at $0.99/track — by showing them the alternative was worse piracy. The store launched April 2003; 1 million songs sold in the first week. The widget now included the content.",
      zh: "乔布斯说服了各大唱片公司以每首 0.99 美元授权音乐——通过让他们看到另一条路是更猖獗的盗版。iTunes Store 于 2003 年 4 月上线；第一周售出 100 万首歌曲。整个「设备」如今已包含内容本身。",
    },
    enabled: {
      en: "The full-stack content model — device + software + store — proved that controlling the whole widget works. The same logic demanded a phone. A phone with music, internet, and an app ecosystem.",
      zh: "全栈内容模式——设备 + 软件 + 商店——证明了掌控整个系统是可行的。同样的逻辑迫切需要一部手机：一部集音乐、互联网和应用生态于一身的手机。",
    },
    method: {
      en: "Integration: Apple negotiated content into its ecosystem rather than outsourcing distribution. The whole widget — hardware, OS, store — became one designed system.",
      zh: "整合：苹果将内容谈判纳入自身生态，而非外包分发。整个系统——硬件、操作系统、商店——成为一个统一设计的整体。",
    },
    integration: 0.44,
  },
  {
    id: "iphone",
    num: 4,
    era: { en: "2007", zh: "2007 年" },
    name: { en: "iPhone", zh: "iPhone" },
    what: {
      en: '"An iPod, a phone, and an internet communicator." Jobs collapsed three separate device categories into one glass slab. Carriers said it was impossible. Nokia shipped 400 million phones that year. The iPhone was a bet that integration and taste would beat incumbents.',
      zh: "「一部 iPod、一部手机，以及一台互联网通讯设备」。乔布斯将三个独立的设备品类融合进一块玻璃屏幕。运营商说这不可能。诺基亚那年出货 4 亿部手机。iPhone 押注于整合与审美能够击败在位者。",
    },
    enabled: {
      en: "A pocket computer with a real browser and the full iTunes library created an obvious demand: other developers must build for it. The device needed a store for software — not just music.",
      zh: "一台配备真正浏览器和完整 iTunes 曲库的口袋电脑创造了显而易见的需求：其他开发者必须为它构建应用。这台设备需要一个软件商店——而不仅仅是音乐商店。",
    },
    method: {
      en: "Simplicity: the keyboard was erased; the interface was the glass. Integration: iPod + phone + internet in one object, one battery, one OS. The hub goes mobile.",
      zh: "简洁：键盘被消除；界面即玻璃本身。整合：iPod + 手机 + 互联网合而为一，共用一块电池、一套操作系统。枢纽走向移动化。",
    },
    integration: 0.60,
  },
  {
    id: "app-store",
    num: 5,
    era: { en: "2008", zh: "2008 年" },
    name: { en: "App Store", zh: "App Store" },
    what: {
      en: "Launched July 2008 — a year after the iPhone. Jobs initially resisted: he wanted web apps only. Scott Forstall and Phil Schiller pushed for native apps. The App Store launched with 500 apps; within a year there were 65,000. The platform now compounded with others\' work.',",
      zh: "2008 年 7 月上线——iPhone 发布一年后。乔布斯起初抗拒：他只想要 Web 应用。Scott Forstall 和 Phil Schiller 力主原生应用。App Store 以 500 款应用起步；一年内增至 65,000 款。这个平台如今借助他人的工作实现了复利增长。",
    },
    enabled: {
      en: "The App Store made the iPhone a general-purpose computer. It also proved a new commercial model: Apple takes 30% of every transaction on its platform. The same model — a platform others build on — could scale across form factors.",
      zh: "App Store 让 iPhone 成为通用计算设备。它同时证明了一种新的商业模式：苹果从平台上每笔交易中抽取 30%。同样的模式——让他人在其上构建——可以在不同的产品形态中规模化复制。",
    },
    method: {
      en: "Focus, then open: Apple controlled the rules (curation, payment, APIs) while opening the surface area. The ecosystem compounds because others invest in building for the platform.",
      zh: "专注，然后开放：苹果掌控规则（审核、支付、API），同时开放接口面积。生态系统之所以复利增长，是因为他人投入资源为这个平台构建应用。",
    },
    integration: 0.74,
  },
  {
    id: "ipad",
    num: 6,
    era: { en: "2010", zh: "2010 年" },
    name: { en: "iPad", zh: "iPad" },
    what: {
      en: '"The most important thing I\'ve ever done." Jobs opened the iPad launch asking what lay between a smartphone and a laptop. The iPad was the answer — a new form factor that plugged into the same ecosystem: same App Store, same iTunes, same iCloud (nascent). The post-PC era.',
      zh: "「这是我做过的最重要的事」。乔布斯在 iPad 发布会上提问：智能手机和笔记本电脑之间是什么？iPad 就是答案——一种接入同一生态系统的新形态：同一个 App Store、同一个 iTunes、同一个（雏形中的）iCloud。后 PC 时代由此开启。",
    },
    enabled: {
      en: "The iPad proved the ecosystem could be distributed across any screen size. The real product was no longer a single device — it was the integrated whole: every device, the software, the content, the store, the culture of building it all together.",
      zh: "iPad 证明了这个生态系统可以覆盖任意屏幕尺寸。真正的产品不再是单一设备——而是一个整合的整体：所有设备、软件、内容、商店，以及将这一切凝聚在一起的文化。",
    },
    method: {
      en: "Form factor multiplication: the same method deployed to a new surface area without losing coherence. The whole widget expands — one ecosystem, many devices.",
      zh: "形态倍增：同一套方法部署到新的形态上而不失去连贯性。整个系统扩张——一个生态，多款设备。",
    },
    integration: 0.86,
  },
  {
    id: "ecosystem-company",
    num: 7,
    era: { en: "ongoing", zh: "持续至今" },
    name: { en: "The Ecosystem & the Company", zh: "生态系统与公司本身" },
    what: {
      en: "By 2011 the real product was neither Mac, nor iPhone, nor iPad — it was the integrated whole and the culture engineered to keep making great things. Jobs spent his final years designing Apple\'s physical headquarters and its succession structures as deliberately as any product.",
      zh: "到 2011 年，真正的产品既不是 Mac，也不是 iPhone，更不是 iPad——而是那个整合的整体，以及被刻意塑造成能够持续创造伟大事物的文化。乔布斯将生命最后几年，像设计产品一样精心设计苹果的新总部和接班人结构。",
    },
    enabled: {
      en: "The open question: does the method — simplicity, integration, taste, focus — survive the man who enforced it by sheer force of will? Apple has become the world\'s most valuable company. Whether it continues to apply the method or coasts on the installed base is what the biography leaves genuinely unresolved.",
      zh: "悬而未决的问题是：这套方法——简洁、整合、审美、专注——能否在那个凭借强大意志力贯彻它的人离去后继续存活？苹果已成为全球市值最高的公司。它究竟在继续践行这套方法，还是靠存量用户惯性滑行？这是这本传记真正留下的开放问题。",
    },
    method: {
      en: "⚠ Open question: the method was always personal — inseparable from one person\'s taste and will. Jobs built the university (Apple University) and the campus (Apple Park) to transmit the culture. Whether institutions can carry what a person embodies is unresolved.",
      zh: "⚠ 开放问题：这套方法始终是高度个人化的——与一个人的品味和意志不可分割。乔布斯创建了苹果大学并规划了苹果园区，以期传承这种文化。机构能否承载一个人所体现的精神，至今无解。",
    },
    integration: 1.0,
    openQuestion: true,
  },
];

/* ── engine narrative states keyed on arc progress ── */
interface EngineState { min: number; title: Bi; body: Bi; }
const ENGINE_STATES: EngineState[] = [
  {
    min: 0,
    title: { en: "The hub strategy", zh: "枢纽战略" },
    body: {
      en: "The pattern starts with a frame, not a product. In 2001 Jobs told his team: the personal computer will become the digital hub — the centre that all the new consumer electronics plug into. Every product that followed was derived from that frame.",
      zh: "这个模式始于一个框架，而非一款产品。2001 年，乔布斯告诉团队：个人电脑将成为数字枢纽——所有新消费电子设备接入的中心。此后每一款产品，都从这个框架中派生而来。",
    },
  },
  {
    min: 0.14,
    title: { en: "Hardware + simplicity", zh: "硬件 + 简洁" },
    body: {
      en: "The iPod proved that taste is a competitive moat. While rivals competed on specs, Apple competed on feel — the weight of the device, the resistance of the scroll wheel, the silence of the interface. \'1,000 songs in your pocket\' was a human sentence, not a spec sheet.",
      zh: "iPod 证明了审美是一种竞争护城河。当竞争对手比拼参数时，苹果在比拼手感——设备的重量、滚轮的阻尼、界面的寂静。「把 1000 首歌装进口袋」是一句人话，不是参数表。",
    },
  },
  {
    min: 0.29,
    title: { en: "The whole widget", zh: "整个系统" },
    body: {
      en: "The iTunes Store was the moment Apple became a content company as well as a hardware company. The principle: own the whole widget — device, software, and store. This is the integration thesis in its most commercial form, and it required persuading an entire industry to change its distribution model.",
      zh: "iTunes Store 是苹果同时成为内容公司与硬件公司的时刻。原则是：掌控整个系统——设备、软件和商店。这是整合理念最具商业价值的体现，为此苹果需要说服整个行业改变其分发模式。",
    },
  },
  {
    min: 0.43,
    title: { en: "Integration at scale", zh: "规模化整合" },
    body: {
      en: "The iPhone was not an incremental improvement — it was a category collapse. Three devices became one. The keyboard became software. The carrier relationship was renegotiated. Each of these required the same move: refuse the constraint that everyone else accepted, then design around the refusal.",
      zh: "iPhone 不是渐进式改进——而是品类崩塌与重组。三台设备变成一台。键盘变成了软件。运营商关系被重新谈判。每一步都需要同样的动作：拒绝所有人都接受的约束，然后围绕这种拒绝来设计。",
    },
  },
  {
    min: 0.57,
    title: { en: "The platform compounds", zh: "平台开始复利" },
    body: {
      en: "The App Store was the inflection: the platform began compounding with other people\'s work. Apple no longer had to build every application — it built the rules, the payment layer, and the APIs; developers built the surface area. The method still applied (Apple curated, Apple controlled taste at the platform level), but the labour was distributed.",
      zh: "App Store 是一个拐点：平台开始借助他人的工作实现复利增长。苹果不再需要构建每一款应用——它构建规则、支付层和 API；开发者构建应用层面。这套方法依然适用（苹果审核、苹果在平台层面掌控品味），但劳动被分布化了。",
    },
  },
  {
    min: 0.71,
    title: { en: "The form-factor multiply", zh: "形态倍增" },
    body: {
      en: "The iPad demonstrated that the ecosystem, not the device, was the durable unit. The same App Store, the same iTunes account, the same iCloud — a new screen shape plugged into the same infrastructure. The method scaled because integration had produced genuine switching costs.",
      zh: "iPad 证明了生态系统而非设备才是持久的单元。同一个 App Store、同一个 iTunes 账户、同一个 iCloud——一种新的屏幕形态接入了同一套基础设施。这套方法得以规模化，是因为整合产生了真实的用户迁移成本。",
    },
  },
  {
    min: 0.86,
    title: { en: "The open question", zh: "开放的问题" },
    body: {
      en: "The final compounding was not a product — it was the company itself. Jobs spent his last years designing Apple Park and Apple University as deliberately as any product. The honest question the biography raises: can a method that depended on one person\'s unreplicable will and taste be institutionalised? The answer is genuinely open.",
      zh: "最后的复利不是一款产品——而是公司本身。乔布斯将最后几年，像设计任何一款产品一样刻意地设计了苹果园区和苹果大学。这本传记提出的诚实问题是：一套依赖于某个人不可复制的意志力与品味的方法，能够被制度化吗？答案真正地悬而未决。",
    },
  },
];

/* ── canvas dimensions ── */
const W = 440;
const H = 340;

/* deterministic seeded value — no Math.random in render */
function seededVal(x: number, seed: number): number {
  const s = Math.sin(x * 127.1 + seed * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/* colour for stage index */
function stageColor(i: number): string {
  if (i >= 6) return HEX.plasm;    // open question / coral
  if (i >= 4) return HEX.iris;     // app store / ipad — violet
  if (i === 3) return HEX.flux;    // iphone — Apple blue
  if (i === 2) return HEX.gold;    // iTunes Store — amber
  if (i === 1) return HEX.leaf;    // iPod — green
  return HEX.gold;                  // mac hub
}

/* draw the compounding hub arc */
function drawArc(
  ctx: CanvasRenderingContext2D,
  stageIdx: number,
  progress: number,
  tick: number,
): void {
  const n = STAGES.length; // 7
  const openStart = 6;     // stage 6 (0-indexed) is the open question

  ctx.clearRect(0, 0, W, H);

  /* ── background micro-grid ── */
  ctx.strokeStyle = "rgba(41,151,255,0.028)";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 24) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  /* ── layout ── */
  const leftPad = 48;
  const rightPad = 16;
  const topPad = 18;
  const botPad = 46;
  const bw = W - leftPad - rightPad;
  const bh = H - topPad - botPad;

  /* ── integration compounding curve overlay ── */
  ctx.save();
  ctx.setLineDash([2, 6]);
  ctx.strokeStyle = HEX.steel + "22";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let px = 0; px <= bw; px += 2) {
    const t = px / bw;
    // exponential-ish integration curve
    const intY = topPad + bh - bh * (0.12 + 0.82 * (1 - Math.exp(-3.5 * t)));
    if (px === 0) ctx.moveTo(leftPad + px, intY);
    else ctx.lineTo(leftPad + px, intY);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  /* ── stage bands ── */
  for (let i = 0; i < n; i++) {
    const isOpen = i >= openStart;
    const bandH = bh / n;
    const by = topPad + (n - 1 - i) * bandH;

    let fill = 0;
    if (i < stageIdx) fill = 1;
    else if (i === stageIdx) fill = progress;

    if (fill <= 0) continue;

    const col = stageColor(i);

    /* gradient fill */
    const grad = ctx.createLinearGradient(leftPad, 0, leftPad + bw * fill, 0);
    grad.addColorStop(0, col + "22");
    grad.addColorStop(0.4, col + "88");
    grad.addColorStop(1, col + "dd");
    ctx.fillStyle = grad;
    ctx.fillRect(leftPad, by + 2, bw * fill, bandH - 4);

    /* open-question dashed overlay */
    if (isOpen && fill > 0) {
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = col + "66";
      ctx.lineWidth = 0.9;
      ctx.strokeRect(leftPad + 1, by + 3, bw * fill - 2, bandH - 6);
      ctx.setLineDash([]);

      /* soft pulse to mark uncertainty */
      const pulse = 0.10 + 0.08 * Math.sin(tick * 0.07);
      ctx.fillStyle = `rgba(255,94,91,${pulse})`;
      ctx.fillRect(leftPad, by + 2, bw * fill, bandH - 4);
    }

    /* leading-edge glow on active stage */
    if (i === stageIdx && fill > 0.02) {
      const ex = leftPad + bw * fill;
      const eglow = ctx.createLinearGradient(ex - 22, 0, ex + 8, 0);
      eglow.addColorStop(0, col + "00");
      eglow.addColorStop(1, col + "ff");
      ctx.fillStyle = eglow;
      ctx.fillRect(ex - 22, by + 2, 30, bandH - 4);
    }

    /* flowing dashes for active stage */
    if (i === stageIdx && fill > 0.05) {
      const phase = (tick * 0.42) % 26;
      ctx.setLineDash([5, 8]);
      ctx.lineDashOffset = -phase;
      ctx.strokeStyle = col + "88";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(leftPad, by + bandH / 2);
      ctx.lineTo(leftPad + bw * fill, by + bandH / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* ── y-axis stage numbers ── */
  ctx.font = "10px 'JetBrains Mono', monospace";
  ctx.textAlign = "right";
  for (let i = 0; i < n; i++) {
    const bandH = bh / n;
    const cy = topPad + (n - 1 - i) * bandH + bandH / 2 + 3.5;
    const active = i <= stageIdx;
    const col = stageColor(i);
    ctx.fillStyle = active ? col + "ff" : HEX.ink5;
    ctx.fillText(`${i + 1}`, leftPad - 6, cy);
  }

  /* ── animated sparks on active stage band ── */
  if (stageIdx < n) {
    const col = stageColor(stageIdx);
    const bandH = bh / n;
    const by = topPad + (n - 1 - stageIdx) * bandH;
    const maxX = leftPad + bw * Math.max(0.05, progress);
    for (let s = 0; s < 6; s++) {
      const t = (tick + s * 7) % 60;
      const sx = leftPad + (t / 60) * (maxX - leftPad);
      const sy = by + bandH / 2 + (seededVal(s, tick * 0.01) - 0.5) * (bandH * 0.55);
      const r = 1.2 + seededVal(s + 3, tick * 0.02) * 2;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = col + "cc";
      ctx.fill();
    }
  }

  /* ── integration scale markers (right edge) ── */
  const intX = leftPad + bw;
  ctx.textAlign = "right";
  ctx.font = "8px 'JetBrains Mono', monospace";
  for (let i = 0; i < n; i++) {
    const bandH = bh / n;
    const cy = topPad + (n - 1 - i) * bandH + bandH / 2 + 3;
    const intVal = STAGES[i].integration;
    const col = stageColor(i);
    const active = i <= stageIdx;
    ctx.fillStyle = active ? col + "bb" : HEX.ink5 + "55";
    ctx.fillText(`${Math.round(intVal * 100)}%`, intX, cy);
  }

  /* ── bottom zone labels ── */
  const phaseY = H - botPad + 14;
  ctx.textAlign = "left";
  ctx.font = "8px 'JetBrains Mono', monospace";
  ctx.fillStyle = HEX.gold + "aa";
  ctx.fillText("HUB", leftPad, phaseY);
  const midX = leftPad + bw * (2.8 / n);
  ctx.fillStyle = HEX.flux + "aa";
  ctx.fillText("INTEGRATION →", midX, phaseY);
  const ecosX = leftPad + bw * (5.2 / n);
  ctx.fillStyle = HEX.iris + "aa";
  ctx.fillText("ECOSYSTEM", ecosX, phaseY);

  /* secondary label — integration axis */
  const phaseY2 = H - botPad + 26;
  ctx.textAlign = "right";
  ctx.fillStyle = HEX.steel + "66";
  ctx.font = "7px 'JetBrains Mono', monospace";
  ctx.fillText("integration depth →", leftPad + bw, phaseY2);

  /* ── open-question zone marker ── */
  const openBandTop = topPad + (n - 1 - (openStart - 1)) * (bh / n);
  ctx.setLineDash([4, 6]);
  ctx.strokeStyle = HEX.plasm + "44";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftPad, openBandTop);
  ctx.lineTo(leftPad + bw, openBandTop);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = "right";
  ctx.fillStyle = HEX.plasm + "99";
  ctx.font = "8px 'JetBrains Mono', monospace";
  ctx.fillText("▲ OPEN QUESTION", leftPad + bw - 50, openBandTop - 3);

  /* ── top label ── */
  ctx.textAlign = "center";
  ctx.fillStyle = HEX.flux4 + "99";
  ctx.font = "9px 'JetBrains Mono', monospace";
  ctx.fillText("DIGITAL HUB → COMPOUNDING CYCLE", W / 2, 11);
}

/* ─────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────── */
export default function RecursiveJobsEngine() {
  const { lang } = useLang();

  const [stageIdx, setStageIdx] = useState(0);
  const [sweepProg, setSweepProg] = useState(0);
  const [running, setRunning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const tickRef = useRef(0);
  const runRef = useRef(false);
  const stageRef = useRef(stageIdx);
  const sweepRef = useRef(sweepProg);

  stageRef.current = stageIdx;
  sweepRef.current = sweepProg;

  const totalStages = STAGES.length;
  const mastery = (stageIdx + sweepProg) / totalStages;

  let engineState = ENGINE_STATES[0];
  for (const s of ENGINE_STATES) if (mastery >= s.min) engineState = s;

  /* canvas draw loop */
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    tickRef.current += 1;
    drawArc(ctx, stageRef.current, sweepRef.current, tickRef.current);
    rafRef.current = requestAnimationFrame(renderFrame);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [renderFrame]);

  /* auto-advance */
  const startRun = useCallback(() => {
    if (runRef.current) return;
    runRef.current = true;
    setRunning(true);

    let startStage = stageRef.current;
    let startSweep = sweepRef.current;
    if (startStage >= totalStages - 1 && startSweep >= 0.99) {
      startStage = 0;
      startSweep = 0;
      setStageIdx(0);
      setSweepProg(0);
    }

    const stageDurMs = 440;
    const totalMs = stageDurMs * (totalStages - startStage - startSweep);
    const startT = performance.now();

    const step = (now: number) => {
      if (!runRef.current) return;
      const elapsed = now - startT;
      const totalProgress = startSweep + elapsed / stageDurMs;
      const clampedTotal = Math.min(totalProgress, totalStages - startStage);
      const newStage = Math.min(totalStages - 1, startStage + Math.floor(clampedTotal));
      const newSweep =
        newStage < totalStages - 1
          ? clampedTotal - Math.floor(clampedTotal)
          : 1;

      setStageIdx(newStage);
      setSweepProg(newSweep);

      if (elapsed < totalMs - stageDurMs * startSweep) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setStageIdx(totalStages - 1);
        setSweepProg(1);
        runRef.current = false;
        setRunning(false);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [totalStages]);

  /* step forward / backward */
  const stepStage = useCallback(
    (dir: 1 | -1) => {
      if (runRef.current) { runRef.current = false; setRunning(false); }
      setStageIdx((prev) => {
        const next = Math.max(0, Math.min(totalStages - 1, prev + dir));
        setSweepProg(dir > 0 ? 1 : 0);
        return next;
      });
    },
    [totalStages],
  );

  const resetAll = useCallback(() => {
    runRef.current = false;
    setRunning(false);
    setStageIdx(0);
    setSweepProg(0);
  }, []);

  const currentStage = STAGES[stageIdx];
  const isOpenQ = !!currentStage.openQuestion;

  /* colour classification */
  const stageColorKey =
    isOpenQ
      ? "plasm"
      : stageIdx >= 4
      ? "iris"
      : stageIdx === 3
      ? "flux"
      : stageIdx === 1
      ? "leaf"
      : "gold";

  const stageBorderCls =
    stageColorKey === "plasm"
      ? "border-plasm-500/40 bg-plasm-500/[0.07]"
      : stageColorKey === "iris"
      ? "border-iris-500/30 bg-iris-500/[0.07]"
      : stageColorKey === "flux"
      ? "border-flux-500/30 bg-flux-500/[0.07]"
      : stageColorKey === "leaf"
      ? "border-leaf-500/30 bg-leaf-500/[0.07]"
      : "border-gold-500/30 bg-gold-500/[0.07]";

  const stageTextCls =
    stageColorKey === "plasm"
      ? "text-plasm-400"
      : stageColorKey === "iris"
      ? "text-iris-400"
      : stageColorKey === "flux"
      ? "text-flux-400"
      : stageColorKey === "leaf"
      ? "text-leaf-400"
      : "text-gold-400";

  const stageDotCls =
    stageColorKey === "plasm"
      ? "bg-plasm-500"
      : stageColorKey === "iris"
      ? "bg-iris-500"
      : stageColorKey === "flux"
      ? "bg-flux-500"
      : stageColorKey === "leaf"
      ? "bg-leaf-500"
      : "bg-gold-500";

  /* integration bar colour */
  const intPct = Math.round(currentStage.integration * 100);
  const intColor =
    isOpenQ
      ? HEX.plasm
      : currentStage.integration > 0.7
      ? HEX.iris
      : currentStage.integration > 0.5
      ? HEX.flux
      : currentStage.integration > 0.3
      ? HEX.leaf
      : HEX.gold;

  return (
    <div className="panel rounded-2xl p-5 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-center">

        {/* ── canvas ── */}
        <div className="relative mx-auto w-full max-w-[440px]">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full rounded-lg"
            style={{ background: HEX.void9 }}
            aria-label={
              lang === "zh"
                ? "数字枢纽复利循环图"
                : "digital hub compounding cycle"
            }
          />

          {/* stage pill overlay */}
          <div className="pointer-events-none absolute left-2 top-2">
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.13em] backdrop-blur-sm ${stageBorderCls} ${stageTextCls}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${stageDotCls} pulse`} />
              <span
                key={`st-${stageIdx}-${lang}`}
                className={`lang-fade ${lang === "zh" ? "zh" : ""}`}
              >
                {lang === "zh"
                  ? `第 ${currentStage.num} 阶段`
                  : `Stage ${currentStage.num} / ${totalStages}`}
              </span>
            </div>
          </div>

          {/* integration badge */}
          <div className="pointer-events-none absolute right-2 top-2">
            <div className="flex items-center gap-1 rounded-full border border-void-600/80 bg-void-900/80 px-2 py-1 font-mono text-[0.58rem] backdrop-blur-sm">
              <span className="text-ink-500">{lang === "zh" ? "整合度" : "integration"}</span>
              <span
                key={`int-${stageIdx}`}
                className="font-bold lang-fade"
                style={{ color: intColor }}
              >
                {intPct}%
              </span>
            </div>
          </div>
        </div>

        {/* ── right panel ── */}
        <div>

          {/* progress bar */}
          <div className="flex items-center justify-between">
            <div className="label-mono">
              {lang === "zh" ? "数字枢纽循环进程" : "hub cycle"}
            </div>
            <div className="display text-3xl text-flux-400">
              {Math.round(mastery * 100)}%
            </div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-void-700">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${mastery * 100}%`,
                background:
                  "linear-gradient(90deg,#f6a623,#61bb46,#2997ff,#a663cc,#ff5e5b)",
              }}
            />
          </div>

          {/* current stage card */}
          <div
            key={`sc-${stageIdx}-${lang}`}
            className={`mt-5 rounded-xl border p-5 lang-fade ${stageBorderCls}`}
          >
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div className={`display text-xl ${stageTextCls}`}>
                <span
                  key={`sn-${stageIdx}-${lang}`}
                  className={`lang-fade ${lang === "zh" ? "zh" : ""}`}
                >
                  <T v={currentStage.name} />
                </span>
              </div>
              <div className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-ink-500 shrink-0">
                <T v={currentStage.era} />
              </div>
            </div>

            {/* status badges */}
            {isOpenQ && (
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-plasm-500/40 bg-plasm-500/10 px-2 py-0.5">
                  <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-plasm-400">
                    {lang === "zh" ? "⚠ 开放问题" : "⚠ open question"}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-3 space-y-2.5">
              <div className="flex gap-2 text-sm leading-snug">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500 shrink-0 mt-0.5 w-14">
                  {lang === "zh" ? "是什么" : "what"}
                </span>
                <span className={`text-ink-300 text-sm leading-snug ${lang === "zh" ? "zh" : ""}`}>
                  <T v={currentStage.what} />
                </span>
              </div>
              <div className="flex gap-2 text-sm leading-snug">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500 shrink-0 mt-0.5 w-14">
                  {lang === "zh" ? "使能" : "enabled"}
                </span>
                <span className={`${stageTextCls} text-sm leading-snug ${lang === "zh" ? "zh" : ""}`}>
                  <T v={currentStage.enabled} />
                </span>
              </div>
              <div className="flex gap-2 text-sm leading-snug">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-ink-500 shrink-0 mt-0.5 w-14">
                  {lang === "zh" ? "方法" : "method"}
                </span>
                <span className={`text-ink-300 text-sm leading-snug ${lang === "zh" ? "zh" : ""}`}>
                  <T v={currentStage.method} />
                </span>
              </div>
            </div>

            {/* integration depth meter */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-ink-500">
                  {lang === "zh" ? "生态整合深度" : "integration depth"}
                </span>
                <span
                  className="font-mono text-[0.62rem] font-bold"
                  style={{ color: intColor }}
                >
                  {intPct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-void-700">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${currentStage.integration * 100}%`,
                    background: `linear-gradient(90deg, ${HEX.gold}, ${intColor})`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* engine narrative */}
          <div
            key={`es-${engineState.title.en}-${lang}`}
            className="mt-4 rounded-xl border border-void-600 bg-void-800/50 p-4 lang-fade"
          >
            <div className="display text-base text-ink-300">
              <T v={engineState.title} />
            </div>
            <p className={`mt-1.5 text-sm leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              <T v={engineState.body} />
            </p>
          </div>

          {/* stage stepper dots */}
          <div className="mt-5">
            <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-500 mb-2">
              <span>{lang === "zh" ? "选择阶段" : "stage"}</span>
              <span className={stageTextCls}>{stageIdx + 1} / {totalStages}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map((st, i) => {
                const isOQ = !!st.openQuestion;
                const isCur = i === stageIdx;
                const colKey =
                  isOQ ? "plasm"
                  : i >= 4 ? "iris"
                  : i === 3 ? "flux"
                  : i === 1 ? "leaf"
                  : "gold";
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (runRef.current) { runRef.current = false; setRunning(false); }
                      setStageIdx(i);
                      setSweepProg(1);
                    }}
                    className={`h-7 w-7 rounded font-mono text-[0.62rem] transition
                      ${isCur
                        ? colKey === "plasm"
                          ? "bg-plasm-500/25 border border-plasm-500/60 text-plasm-400"
                          : colKey === "iris"
                          ? "bg-iris-500/25 border border-iris-500/60 text-iris-400"
                          : colKey === "flux"
                          ? "bg-flux-500/25 border border-flux-500/60 text-flux-400"
                          : colKey === "leaf"
                          ? "bg-leaf-500/25 border border-leaf-500/60 text-leaf-400"
                          : "bg-gold-500/25 border border-gold-500/60 text-gold-400"
                        : isOQ
                          ? "border border-dashed border-plasm-500/30 text-ink-500 hover:border-plasm-500/60 hover:text-plasm-400"
                          : "border border-void-600 text-ink-500 hover:border-flux-500/40 hover:text-flux-400"
                      }`}
                    aria-label={`Stage ${i + 1}`}
                    aria-pressed={isCur}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={startRun}
              disabled={running}
              className="rounded-full border border-flux-500/50 bg-flux-500/10 px-5 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-flux-400 transition hover:bg-flux-500/20 disabled:opacity-40"
            >
              {running
                ? lang === "zh" ? "运行中…" : "running…"
                : lang === "zh" ? "▶ 运行引擎" : "▶ run engine"}
            </button>
            <button
              onClick={() => stepStage(-1)}
              disabled={stageIdx === 0}
              className="rounded-full border border-ink-100/15 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400 transition hover:text-flux-400 disabled:opacity-30"
            >
              ‹ {lang === "zh" ? "上一阶段" : "prev"}
            </button>
            <button
              onClick={() => stepStage(1)}
              disabled={stageIdx === totalStages - 1}
              className="rounded-full border border-ink-100/15 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400 transition hover:text-flux-400 disabled:opacity-30"
            >
              {lang === "zh" ? "下一阶段" : "next"} ›
            </button>
            <button
              onClick={resetAll}
              className="rounded-full border border-ink-100/15 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400 transition hover:text-flux-400"
            >
              {lang === "zh" ? "重置" : "reset"}
            </button>
          </div>

          {/* teaching point + open question caveat */}
          <div className="mt-5 border-t border-void-700 pt-4 space-y-3">
            <p className={`text-xs leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "核心洞见：每一个阶段都重新应用了同一套方法——简洁、整合、审美、专注——并使下一阶段成为可能。这是一个复利循环，而非一系列互不相关的成功。每一次胜利都扩大了整个系统的表面积，而不仅仅是在单个产品上积分。"
                : "Teaching point: each rung re-applied the same method — simplicity, integration, taste, focus — and made the next rung possible. This is a compounding cycle, not a series of unrelated hits. Each win enlarged the surface area of the whole system rather than just scoring on a single product."}
            </p>
            <p className={`text-xs leading-relaxed text-plasm-400/80 italic ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "⚠ 后乔布斯的开放问题：这套方法与执行者的个人意志密不可分。苹果凭借现有生态取得了创纪录的财务成就，但「整合、审美、专注」这套方法是否在制度层面得以延续——还是说公司正在依靠存量用户惯性滑行——这是传记留给读者的真正悬案。"
                : "⚠ Post-2011 open question: the method was inseparable from one person's will. Apple has achieved record financial results on the installed base, but whether the method — integration, taste, focus — continues institutionally, or whether the company coasts, is the question the biography leaves genuinely unresolved."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
