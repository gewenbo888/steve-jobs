"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "./lang";

/* ═══════════════════════════════════════════════════════════════════════════
   SIMPLICITY STUDIO
   Jobs's creed: simplicity is the ultimate sophistication — and real
   simplicity comes from MASTERING complexity, not hiding it.

   Presets: MP3 player (2001-era cluttered rival), TV remote, smartphone.
   Five moves applied in order:
     1 · Question  — challenge every feature/button
     2 · Remove    — cut what isn't essential
     3 · Collapse  — merge steps (e.g. "any song in 3 clicks")
     4 · Erase the manual — make it self-evident
     5 · One job, superbly — reduce to a single purpose done perfectly

   Two readout tracks:
     · SUPERFICIAL simplicity (just hiding / stripping away)
     · TRUE simplicity (underlying complexity conquered; user never meets it)

   Counter-panel: the same instinct, pushed to dogma, removed ports/buttons
   people wanted — mastery vs. control.
   ════════════════════════════════════════════════════════════════════════ */

function Lf(en: string, zh: string, lang: string) {
  return lang === "zh" ? zh : en;
}

/* ─── TYPES ─── */
type MoveId = "question" | "remove" | "collapse" | "manual" | "onejob";

type Feature = {
  id: number;
  label: { en: string; zh: string };
  category: "button" | "menu" | "step" | "page" | "indicator";
  essential: boolean;     // survives removal?
  collapsible: boolean;   // can be merged?
  evident: boolean;       // self-evident without manual?
  clutter: number;        // contribution to clutter index 1–10
  removed: boolean;
  collapsed: boolean;
  evident_mark: boolean;
  description: { en: string; zh: string };
};

type Preset = {
  id: string;
  icon: string;
  label: { en: string; zh: string };
  era: { en: string; zh: string };
  desc: { en: string; zh: string };
  reference: { en: string; zh: string };
  features: Omit<Feature, "id" | "removed" | "collapsed" | "evident_mark">[];
  // initial metrics
  buttonCount: number;
  stepsToTask: number;
  menuDepth: number;
  manualPages: number;
};

/* ─── PRESETS ─── */
const PRESETS: Preset[] = [
  {
    id: "mp3",
    icon: "◈",
    label: { en: "MP3 Player", zh: "MP3 播放器" },
    era: { en: "early 2000s rival", zh: "2000 年代初竞品" },
    desc: {
      en: "A typical 2001-era portable digital music player — 26 buttons, a 4-level menu tree, and a 68-page manual before you hear a single song.",
      zh: "2001 年前后的典型便携式数字音乐播放器——26 个按键、四层菜单树，听第一首歌之前需要翻阅 68 页说明书。",
    },
    reference: {
      en: "When Jobs unveiled a device described as putting \"1,000 songs in your pocket,\" the engineering challenge wasn't fitting the songs in — it was making the whole library reachable in three clicks from any track. That constraint drove the scroll wheel, the flat hierarchy, the speed. The simplicity the user experienced was the result of enormous work they never saw. (Paraphrased from Isaacson's account.)",
      zh: "当乔布斯发布那台被描述为「把 1000 首歌装进口袋」的设备时，工程挑战不在于装进去——而在于让整个曲库从任何一首歌起，三次点击内可及。这一约束驱动了滚轮、平坦的层级结构和速度。用户所感受到的简约，是他们从未看见的巨大工作的结果。（改编自艾萨克森的叙述。）",
    },
    buttonCount: 26,
    stepsToTask: 11,
    menuDepth: 4,
    manualPages: 68,
    features: [
      { label: { en: "Play/Pause", zh: "播放/暂停" }, category: "button", essential: true, collapsible: false, evident: true, clutter: 2, description: { en: "Core playback — cannot be removed", zh: "核心播放——不可移除" } },
      { label: { en: "Stop button", zh: "停止键" }, category: "button", essential: false, collapsible: true, evident: false, clutter: 4, description: { en: "Redundant with play/pause in a digital device; adds confusion", zh: "在数字设备中与播放/暂停重叠；增加混淆" } },
      { label: { en: "Rewind (long-press)", zh: "快退（长按）" }, category: "button", essential: true, collapsible: true, evident: false, clutter: 3, description: { en: "Necessary but can be collapsed into scroll gesture", zh: "必要，但可合并进滚动手势" } },
      { label: { en: "Fast-forward", zh: "快进" }, category: "button", essential: true, collapsible: true, evident: false, clutter: 3, description: { en: "Same — collapsible", zh: "同上——可合并" } },
      { label: { en: "Volume Up", zh: "音量+" }, category: "button", essential: true, collapsible: true, evident: false, clutter: 2, description: { en: "Can become scroll direction", zh: "可成为滚动方向" } },
      { label: { en: "Volume Down", zh: "音量-" }, category: "button", essential: true, collapsible: true, evident: false, clutter: 2, description: { en: "Same", zh: "同上" } },
      { label: { en: "EQ Mode Select", zh: "均衡器模式选择" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 6, description: { en: "Most users never change it; hidden complexity pushed to surface", zh: "大多数用户从不更改；隐藏复杂性被推至表面" } },
      { label: { en: "Mode / A-B Repeat", zh: "模式/AB 重复" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 7, description: { en: "Rare edge case; adds permanent visual noise", zh: "罕见边缘情形；增加永久视觉噪音" } },
      { label: { en: "Intro Scan button", zh: "试听扫描键" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "Feature requested by one market segment; bewilders everyone else", zh: "一个细分市场要求的功能；让其他人困惑" } },
      { label: { en: "Hold switch", zh: "锁定开关" }, category: "button", essential: true, collapsible: false, evident: false, clutter: 3, description: { en: "Lock for pocket — necessary but poorly labeled", zh: "口袋锁定——必要但标注不清" } },
      { label: { en: "Next track", zh: "下一曲" }, category: "button", essential: true, collapsible: true, evident: true, clutter: 1, description: { en: "Core — but can share wheel", zh: "核心——但可共用滚轮" } },
      { label: { en: "Previous track", zh: "上一曲" }, category: "button", essential: true, collapsible: true, evident: true, clutter: 1, description: { en: "Core — collapsible", zh: "核心——可合并" } },
      { label: { en: "Menu / Back button", zh: "菜单/返回键" }, category: "button", essential: true, collapsible: false, evident: false, clutter: 4, description: { en: "Needed to navigate hierarchy; could be single center press", zh: "层级导航所需；可合并为中央单击" } },
      { label: { en: "Delete track", zh: "删除曲目" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 7, description: { en: "Rarely needed on device; belongs in desktop software", zh: "设备上很少需要；应属于桌面软件" } },
      { label: { en: "Browse → Artists", zh: "浏览 → 艺术家" }, category: "menu", essential: true, collapsible: false, evident: false, clutter: 3, description: { en: "Core browse path — necessary", zh: "核心浏览路径——必要" } },
      { label: { en: "Browse → Albums", zh: "浏览 → 专辑" }, category: "menu", essential: true, collapsible: false, evident: false, clutter: 3, description: { en: "Core browse", zh: "核心浏览" } },
      { label: { en: "Browse → Genres", zh: "浏览 → 流派" }, category: "menu", essential: false, collapsible: false, evident: false, clutter: 5, description: { en: "Rarely used top-level; can live deeper", zh: "很少用到的顶层；可深层存放" } },
      { label: { en: "Settings → Display", zh: "设置 → 显示" }, category: "menu", essential: false, collapsible: false, evident: false, clutter: 5, description: { en: "Users set once then forget — move to sync software", zh: "用户设置一次后忘记——移至同步软件" } },
      { label: { en: "Settings → Backlight Timer", zh: "设置 → 背光计时" }, category: "menu", essential: false, collapsible: false, evident: false, clutter: 6, description: { en: "Friction with no user payoff", zh: "没有用户收益的摩擦" } },
      { label: { en: "68-page manual", zh: "68 页说明书" }, category: "page", essential: false, collapsible: false, evident: false, clutter: 10, description: { en: "If it needs this, it has failed", zh: "如果需要这个，说明已经失败" } },
      { label: { en: "USB Transfer Wizard", zh: "USB 传输向导" }, category: "step", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "12-step drag-and-manage flow; should be automatic", zh: "12 步拖放管理流程；应该是自动的" } },
      { label: { en: "Battery level indicator (5 segments)", zh: "电池电量指示（5 格）" }, category: "indicator", essential: true, collapsible: false, evident: true, clutter: 1, description: { en: "Useful and self-evident", zh: "有用且自明" } },
    ],
  },
  {
    id: "remote",
    icon: "◉",
    label: { en: "TV Remote", zh: "电视遥控器" },
    era: { en: "2002-era cable remote", zh: "2002 年有线电视遥控器" },
    desc: {
      en: "A typical cable-era TV remote: 52 buttons, 7-level function nesting, and a 44-page booklet that most people simply throw away.",
      zh: "有线电视时代典型的电视遥控器：52 个按键、7 层功能嵌套，以及大多数人直接扔掉的 44 页小册子。",
    },
    reference: {
      en: "Jobs reportedly took apart a Sony remote, catalogued its 38 buttons he considered unnecessary, and used it as a teaching object for his teams: a remote with 38 unnecessary buttons is not a device — it's a user test disguised as a product. His Apple TV remote, reduced to three (or later one) buttons, was a deliberate provocation: could the entire interaction be rethought? The question was never \"which buttons can we hide?\" but \"what if the user never needs a button at all?\" (Paraphrased from Isaacson's account and public Apple product history.)",
      zh: "据报道，乔布斯曾拆开一个索尼遥控器，列举了他认为不必要的 38 个按键，并将其用作向团队传授的教材：一个有 38 个不必要按键的遥控器不是设备——而是一个伪装成产品的用户测试。他的 Apple TV 遥控器，缩减为三个（后来一个）按键，是刻意的挑衅：整个交互能否被重新思考？问题从来不是「我们能隐藏哪些按键」，而是「如果用户根本不需要按键呢」。（改编自艾萨克森的叙述及苹果产品公开史。）",
    },
    buttonCount: 52,
    stepsToTask: 9,
    menuDepth: 7,
    manualPages: 44,
    features: [
      { label: { en: "Power", zh: "电源" }, category: "button", essential: true, collapsible: false, evident: true, clutter: 1, description: { en: "Core — self-evident", zh: "核心——自明" } },
      { label: { en: "Volume Up/Down", zh: "音量+/-" }, category: "button", essential: true, collapsible: true, evident: true, clutter: 2, description: { en: "Essential — but two buttons, could be rocker", zh: "必要——但两个按键，可做成摇杆" } },
      { label: { en: "Channel Up/Down", zh: "频道+/-" }, category: "button", essential: true, collapsible: true, evident: true, clutter: 2, description: { en: "Essential pair — rocker candidate", zh: "必要组合——摇杆候选" } },
      { label: { en: "0–9 number pad", zh: "0–9 数字键盘" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 7, description: { en: "Only needed if you know the channel number; no one does", zh: "只有知道频道号时才需要；没人知道" } },
      { label: { en: "Mute", zh: "静音" }, category: "button", essential: true, collapsible: false, evident: true, clutter: 1, description: { en: "One of the most used buttons — keep", zh: "使用最频繁的按键之一——保留" } },
      { label: { en: "Input Source Select", zh: "输入源选择" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 6, description: { en: "Needed once at setup; causes daily confusion ever after", zh: "设置时需要一次；此后每天引发混乱" } },
      { label: { en: "SAP / Audio Language", zh: "SAP / 音频语言" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "Rarely needed; triggers accidental mode changes constantly", zh: "很少需要；不断触发意外模式切换" } },
      { label: { en: "Sleep Timer", zh: "定时关闭" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 7, description: { en: "Rarely used; belongs in a settings menu at most", zh: "很少使用；最多属于设置菜单" } },
      { label: { en: "PIP (Picture-in-Picture)", zh: "画中画" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 6, description: { en: "Marketing feature, almost never used in practice", zh: "营销功能，实际中几乎从不使用" } },
      { label: { en: "Freeze Frame", zh: "画面定格" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "One user in ten thousand; confusion cost for the other 9,999", zh: "万分之一的用户会用；其他 9999 人因此困惑" } },
      { label: { en: "CC (Closed Caption)", zh: "字幕（CC）" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 5, description: { en: "Needed, but a single-purpose button is overkill; fold into menu", zh: "有需要，但专用按键过多；折叠进菜单" } },
      { label: { en: "Cable Guide", zh: "有线节目指南" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 6, description: { en: "Useful but duplicates on-screen function", zh: "有用但与屏幕功能重复" } },
      { label: { en: "VCR / DVD mode", zh: "录像机/DVD 模式" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 7, description: { en: "Legacy mode switching that predates the device on your shelf", zh: "早于您架子上设备的遗留模式切换" } },
      { label: { en: "Record", zh: "录制" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 5, description: { en: "Rarely correct action from remote; better in on-screen guide", zh: "从遥控器操作很少正确；在屏幕指南中更好" } },
      { label: { en: "Zoom / Aspect Ratio", zh: "缩放/画幅比例" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "Causes accidental widescreen stretch; almost never intentional", zh: "导致意外宽屏拉伸；几乎从不是故意的" } },
      { label: { en: "A/B/C/D colored buttons", zh: "A/B/C/D 彩色按键" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 9, description: { en: "Teletext era relic; assigned to different functions on every device", zh: "图文电视时代遗物；每台设备功能不同" } },
      { label: { en: "Menu navigation arrows ×4", zh: "菜单导航箭头 ×4" }, category: "button", essential: true, collapsible: true, evident: false, clutter: 2, description: { en: "Necessary for menus — but could reduce to two if hierarchy is flat", zh: "菜单导航必要——但如果层级扁平，可减为两个" } },
      { label: { en: "OK / Select", zh: "确认/选择" }, category: "button", essential: true, collapsible: false, evident: true, clutter: 1, description: { en: "Core confirm action", zh: "核心确认操作" } },
      { label: { en: "44-page booklet", zh: "44 页小册子" }, category: "page", essential: false, collapsible: false, evident: false, clutter: 10, description: { en: "The manual's presence is the confession of failure", zh: "说明书的存在是失败的供词" } },
    ],
  },
  {
    id: "phone",
    icon: "◎",
    label: { en: "Smartphone (2006 rival)", zh: "智能手机（2006 竞品）" },
    era: { en: "pre-iPhone dominant", zh: "iPhone 前的主流" },
    desc: {
      en: "A dominant smartphone in 2006: stylus required, 30 physical buttons, carrier software pre-installed, and a setup process requiring 17 steps before a call.",
      zh: "2006 年主流智能手机：需要触控笔、30 个实体按键、预装运营商软件，拨打电话前需要 17 个步骤完成设置。",
    },
    reference: {
      en: "The challenge Jobs set his team was not \"add a touchscreen\" — it was \"remove the stylus, remove the keyboard, make it one thing the human hand already knows how to use.\" The bet was that if the software was good enough to understand finger input, every physical button except one became a question: why does this exist? The one-button-on-the-front outcome was not a simplification of a complex design; it was the result of redesigning from the interaction outward. (Paraphrased from Isaacson's account.)",
      zh: "乔布斯向团队设定的挑战不是「增加触摸屏」——而是「去掉触控笔，去掉键盘，让它成为人手已经知道如何使用的一样东西。」赌注是：如果软件足够好地理解手指输入，除一个按键外，每一个实体按键都变成了一个问题：这为什么存在？前面只有一个按键的结果，不是对复杂设计的简化；而是从交互向外重新设计的结果。（改编自艾萨克森的叙述。）",
    },
    buttonCount: 30,
    stepsToTask: 17,
    menuDepth: 5,
    manualPages: 120,
    features: [
      { label: { en: "Physical keyboard (QWERTY)", zh: "实体键盘（QWERTY）" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 9, description: { en: "Fixed footprint, can't change for each app; software keyboard adapts", zh: "固定面积，无法为每款应用改变；软件键盘可适配" } },
      { label: { en: "Stylus (required)", zh: "触控笔（必需）" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 10, description: { en: "\"If you need a stylus, you've already failed\" — Jobs, 2007 keynote paraphrase", zh: "「如果需要触控笔，你已经失败了」——乔布斯 2007 年发布会转述" } },
      { label: { en: "Call / End buttons", zh: "拨打/结束键" }, category: "button", essential: true, collapsible: true, evident: true, clutter: 1, description: { en: "Core — can become on-screen with touchscreen", zh: "核心——触摸屏后可变为屏幕按键" } },
      { label: { en: "Navigation D-pad", zh: "方向键" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 6, description: { en: "Replaced entirely by direct touch on correct surface", zh: "在正确界面上被直接触摸完全替代" } },
      { label: { en: "Soft keys ×4 (context-shifting)", zh: "软键 ×4（上下文切换）" }, category: "button", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "Change meaning every screen — no mental model possible", zh: "每个屏幕含义不同——无法建立心理模型" } },
      { label: { en: "Home / Menu", zh: "主页/菜单" }, category: "button", essential: true, collapsible: false, evident: false, clutter: 3, description: { en: "One physical home is genuinely needed", zh: "确实需要一个实体主页键" } },
      { label: { en: "Carrier app #1 (pre-installed)", zh: "运营商应用 #1（预装）" }, category: "step", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "Cannot be removed; manufacturer ceded the experience to carrier", zh: "无法删除；制造商将体验让渡给运营商" } },
      { label: { en: "Carrier app #2–6 (bloatware)", zh: "运营商应用 #2–6（垃圾软件）" }, category: "step", essential: false, collapsible: false, evident: false, clutter: 9, description: { en: "Competing with the manufacturer for the user's first screen", zh: "与制造商争夺用户的第一个屏幕" } },
      { label: { en: "SIM PIN entry flow", zh: "SIM 卡 PIN 输入流程" }, category: "step", essential: false, collapsible: false, evident: false, clutter: 7, description: { en: "3 separate screens to dismiss a relic of 1990s security theater", zh: "3 个独立屏幕来消除 1990 年代安全剧场的遗留" } },
      { label: { en: "Network provisioning wizard", zh: "网络配置向导" }, category: "step", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "7-step APN configuration before internet works", zh: "互联网工作前 7 步 APN 配置" } },
      { label: { en: "Sync cable + drivers + software", zh: "同步线 + 驱动 + 软件" }, category: "step", essential: false, collapsible: false, evident: false, clutter: 8, description: { en: "Device tethered to a specific PC; data hostage to a USB port", zh: "设备绑定到特定 PC；数据被 USB 端口劫持" } },
      { label: { en: "120-page manual", zh: "120 页说明书" }, category: "page", essential: false, collapsible: false, evident: false, clutter: 10, description: { en: "The manual is the measure of the failure", zh: "说明书是失败程度的量尺" } },
      { label: { en: "Battery indicator (4 bars)", zh: "电池指示（4 格）" }, category: "indicator", essential: true, collapsible: false, evident: true, clutter: 1, description: { en: "Self-evident and necessary", zh: "自明且必要" } },
      { label: { en: "Signal bars", zh: "信号格" }, category: "indicator", essential: true, collapsible: false, evident: true, clutter: 1, description: { en: "Essential", zh: "必要" } },
      { label: { en: "Bluetooth / WiFi toggles (buried)", zh: "蓝牙/WiFi 开关（深埋）" }, category: "menu", essential: true, collapsible: true, evident: false, clutter: 5, description: { en: "Needed but 4 taps deep", zh: "需要但在 4 次点击深处" } },
    ],
  },
];

/* ─── MOVE DEFINITIONS ─── */
type Move = {
  id: MoveId;
  num: number;
  icon: string;
  label: { en: string; zh: string };
  shortLabel: { en: string; zh: string };
  colorHex: string;
  teaching: { en: string; zh: string };
  action: { en: string; zh: string };
  trueSimplicityGain: number;  // 0–100 how much TRUE simplicity this move earns
  superficialRisk: number;     // 0–100 how easily this move stays superficial if done wrong
};

const MOVES: Move[] = [
  {
    id: "question",
    num: 1,
    icon: "?",
    label: { en: "Question every feature", zh: "质疑每一个功能" },
    shortLabel: { en: "Question", zh: "质疑" },
    colorHex: "#6cb8ff",
    teaching: {
      en: "Every feature has an owner who believed it was necessary. But necessity has to be interrogated: does this serve the user's actual job, or does it serve a committee, a market research session, a competitor's checklist? The first move is not to remove anything — it's to make the invisible visible: expose what each feature costs the user's attention.",
      zh: "每个功能都有一个认为它必要的所有者。但必要性必须被审问：这是为了用户真正的任务，还是为了一个委员会、一次市场调研、一份竞争对手的清单？第一步不是删除任何东西——而是让不可见的东西可见：揭示每个功能对用户注意力的代价。",
    },
    action: { en: "Expose the cost of each feature to user attention", zh: "揭示每个功能对用户注意力的代价" },
    trueSimplicityGain: 10,
    superficialRisk: 5,
  },
  {
    id: "remove",
    num: 2,
    icon: "−",
    label: { en: "Remove what isn't essential", zh: "移除不必要的" },
    shortLabel: { en: "Remove", zh: "移除" },
    colorHex: "#ff8a87",
    teaching: {
      en: "The test for essential is ruthless: not \"could someone use this?\" but \"does removing it break the primary job?\" Features added for edge cases, marketing lists, or fear of user complaints are usually the first to go. This is where most simplicity attempts stop — and where they become superficial. Removing a button while keeping the underlying complexity is hiding, not mastering.",
      zh: "「必要」的测试是无情的：不是「有人会用这个吗」，而是「删除它会破坏主要任务吗」。为边缘情况、营销清单或害怕用户投诉而添加的功能通常最先被去除。这是大多数简约尝试停止的地方——也是它们变得肤浅的地方。删除一个按键同时保留底层复杂性，是在隐藏，而非掌控。",
    },
    action: { en: "Cut features that don't serve the one job", zh: "删除不服务于核心任务的功能" },
    trueSimplicityGain: 25,
    superficialRisk: 40,
  },
  {
    id: "collapse",
    num: 3,
    icon: "⊕",
    label: { en: "Collapse steps (any song in 3 clicks)", zh: "折叠步骤（三次点击任意歌曲）" },
    shortLabel: { en: "Collapse", zh: "折叠" },
    colorHex: "#ffc15e",
    teaching: {
      en: "After cutting the unnecessary, interrogate what remains: do two operations serve the same micro-job? Can a 4-button cluster become one directional gesture? This is where complexity is genuinely conquered — not erased, but restructured so the user never encounters it. The constraint \"every song reachable in three clicks\" didn't come from hiding menu levels. It came from designing the hierarchy differently so the levels weren't needed.",
      zh: "在削减不必要的之后，审问剩余的：两个操作是否服务于同一个微任务？四按键组合能否变成一个方向手势？这是复杂性真正被征服的地方——不是被消除，而是被重构，让用户永远不会遇到它。「三次点击任意歌曲」的约束不是来自隐藏菜单层级。它来自以不同方式设计层级，从而不需要那些层级。",
    },
    action: { en: "Merge, restructure, flatten — make complexity invisible by solving it", zh: "合并、重构、扁平化——通过解决它让复杂性不可见" },
    trueSimplicityGain: 30,
    superficialRisk: 20,
  },
  {
    id: "manual",
    num: 4,
    icon: "✕",
    label: { en: "Remove the manual", zh: "去掉说明书" },
    shortLabel: { en: "No manual", zh: "无说明书" },
    colorHex: "#8fd47a",
    teaching: {
      en: "A manual is a symptom: the product couldn't explain itself. Every page of a manual is a conversation that the design failed to have with the user. \"Making it self-evident\" is not about removing the manual as a file — it's about redesigning until the product teaches itself in use. This is where True Simplicity diverges sharply from superficial: hiding complexity behind a help screen is not the same as eliminating the complexity that made help necessary.",
      zh: "说明书是一个症状：产品无法解释自身。说明书的每一页，都是设计未能与用户进行的对话。「让它自明」不是删除说明书文件——而是重新设计，直到产品在使用中自我教授。这是真正简约与表面简约急剧分叉的地方：在帮助屏幕后面隐藏复杂性，与消除使帮助成为必要的复杂性，不是同一件事。",
    },
    action: { en: "Design until it teaches itself; make help screens unnecessary", zh: "设计直至自我教授；使帮助屏幕不必要" },
    trueSimplicityGain: 20,
    superficialRisk: 50,
  },
  {
    id: "onejob",
    num: 5,
    icon: "◎",
    label: { en: "One job, done superbly", zh: "一件事，做到极致" },
    shortLabel: { en: "One job", zh: "一件事" },
    colorHex: "#c79be0",
    teaching: {
      en: "The final cut: everything that survived the previous four moves is interrogated one more time against the single job the product exists to do. A music player plays music. A phone makes calls. A tablet is a pane of glass that shows apps. Every surviving feature either serves that one purpose or it goes. This isn't just minimalism — it's the commitment to master the one thing completely rather than be mediocre at everything.",
      zh: "最终一刀：所有经历前四步的幸存者，再次被对照产品存在要做的那一件事进行审问。音乐播放器播放音乐。手机打电话。平板电脑是一块展示应用的玻璃。每个幸存的功能，要么服务于那一个目的，要么被去掉。这不只是极简主义——这是承诺完全掌控那一件事，而不是在所有事上平庸。",
    },
    action: { en: "Align everything to the single defining job", zh: "将一切与那唯一的决定性任务对齐" },
    trueSimplicityGain: 15,
    superficialRisk: 10,
  },
];

/* ─── COUNTER-PANEL DATA ─── */
type CostItem = {
  label: { en: string; zh: string };
  detail: { en: string; zh: string };
};

const COST_ITEMS: CostItem[] = [
  {
    label: { en: "No ports (\"courage\")", zh: "无接口（「勇气」）" },
    detail: {
      en: "Removing the headphone jack required a dongle millions of users resented. The argument was correct in trajectory but poorly timed — the mastery (wireless audio) hadn't yet arrived for most users when the port was removed.",
      zh: "去掉耳机插孔，需要数百万用户忍受转接头。这个判断方向正确，但时机不佳——当接口被移除时，大多数用户所需的精通（无线音频）尚未到来。",
    },
  },
  {
    label: { en: "One-button mouse", zh: "单键鼠标" },
    detail: {
      en: "Jobs insisted on a single mouse button for years beyond when a second button had become the standard expected by developers and power users. The original simplicity insight was right; the refusal to update it for a decade became control, not mastery.",
      zh: "乔布斯坚持单键鼠标长达多年，远超第二个按键已成为开发者和高级用户预期标准之后。最初的简约洞见是正确的；但十年间拒绝更新，变成了控制，而非精通。",
    },
  },
  {
    label: { en: "No user-replaceable battery", zh: "不可更换电池" },
    detail: {
      en: "The sealed battery produced a cleaner object and drove the category. It also removed user agency over a component that degrades on a known cycle. Whether the trade was worth making is a value judgment that landed differently for different users.",
      zh: "密封电池产生了更简洁的产品，也推动了这个品类。它同时也移除了用户对一个按已知周期降级部件的控制权。这个权衡是否值得，是一个价值判断，对不同用户落地不同。",
    },
  },
  {
    label: { en: "No stylus → no precision input", zh: "无触控笔 → 无精确输入" },
    detail: {
      en: "Removing the stylus was correct for a general-purpose phone. The same instinct applied to tablets left a gap for graphic artists and surgeons — markets Apple later re-entered with Apple Pencil, acknowledging that simplicity for one use case is complexity for another.",
      zh: "去掉触控笔对通用手机是正确的。同样的直觉应用于平板，为平面艺术家和外科医生留下了空缺——苹果后来以 Apple Pencil 重返这些市场，承认一种使用场景的简约是另一种使用场景的复杂。",
    },
  },
  {
    label: { en: "Closed ecosystem (no sideloading)", zh: "封闭生态（不允许侧载）" },
    detail: {
      en: "Controlling the whole widget produced the most coherent consumer experience of the era. It also locked users and developers into a single gatekeeper. Whether this is mastery or control depends on whether you are a user buying apps or a developer selling them.",
      zh: "掌控整个产品带来了那个时代最连贯的消费者体验。它也把用户和开发者锁定在单一守门人身下。这是精通还是控制，取决于你是购买应用的用户，还是出售应用的开发者。",
    },
  },
];

/* ─── SIMPLICITY METRICS ─── */
function computeSimplicity(features: Feature[], completedMoves: MoveId[]) {
  const total = features.length;
  const removed = features.filter((f) => f.removed).length;
  const collapsed = features.filter((f) => f.collapsed && !f.removed).length;
  const evident = features.filter((f) => f.evident_mark && !f.removed).length;

  // Clutter index: sum of clutter for active features
  const maxClutter = features.reduce((s, f) => s + f.clutter, 0);
  const activeClutter = features.filter((f) => !f.removed).reduce((s, f) => {
    let c = f.clutter;
    if (f.collapsed) c *= 0.5;
    if (f.evident_mark) c *= 0.7;
    return s + c;
  }, 0);
  const clutterReduction = maxClutter > 0 ? Math.round(((maxClutter - activeClutter) / maxClutter) * 100) : 0;

  // True vs superficial simplicity
  // True simplicity = complexity actually conquered; superficial = things hidden/removed without solving them
  let trueScore = 0;
  let superficialScore = 0;

  for (const move of completedMoves) {
    const m = MOVES.find((mv) => mv.id === move)!;
    trueScore += m.trueSimplicityGain;
  }

  // Penalty: if we removed features without collapsing, it's more superficial
  const removedEssential = features.filter((f) => f.removed && f.essential).length;
  if (removedEssential > 0) {
    superficialScore += removedEssential * 12;
    trueScore -= removedEssential * 8;
  }

  // Collapsed = genuine complexity mastered
  if (completedMoves.includes("collapse")) {
    trueScore += collapsed * 4;
  }

  // Manual removal without making things self-evident → superficial
  if (completedMoves.includes("manual") && evident < 3) {
    superficialScore += 20;
  }

  const surviving = total - removed;
  const buttonsSaved = Math.round((removed / total) * 100);

  return {
    clutterReduction,
    trueScore: Math.min(100, Math.max(0, trueScore)),
    superficialScore: Math.min(100, Math.max(0, superficialScore + (clutterReduction > 50 && trueScore < 30 ? 20 : 0))),
    surviving,
    buttonsSaved,
    removed,
  };
}

/* ─── PRODUCT CANVAS ─── */
function ProductCanvas({
  features,
  activeMove,
  lang,
}: {
  features: Feature[];
  activeMove: MoveId | null;
  lang: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const prevRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    const categoryColor: Record<string, string> = {
      button: "#6cb8ff",
      menu: "#c79be0",
      step: "#ffc15e",
      page: "#ff8a87",
      indicator: "#8fd47a",
    };

    const COLS = Math.min(features.length, 7);
    const ROWS = Math.ceil(features.length / COLS);
    const PAD = 12;
    const cellW = (W - PAD * 2) / COLS;
    const cellH = (H - PAD * 2) / Math.max(ROWS, 2);

    function drawFrame(t: number) {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = "#0d0d11";
      ctx!.fillRect(0, 0, W, H);

      // subtle grid
      ctx!.strokeStyle = "rgba(41,151,255,0.04)";
      ctx!.lineWidth = 0.5;
      for (let gx = 0; gx <= W; gx += 28) {
        ctx!.beginPath(); ctx!.moveTo(gx, 0); ctx!.lineTo(gx, H); ctx!.stroke();
      }
      for (let gy = 0; gy <= H; gy += 28) {
        ctx!.beginPath(); ctx!.moveTo(0, gy); ctx!.lineTo(W, gy); ctx!.stroke();
      }

      features.forEach((feat, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const cx = PAD + col * cellW + cellW / 2;
        const cy = PAD + row * cellH + cellH / 2;
        const rw = cellW * 0.86;
        const rh = Math.min(cellH * 0.78, 48);

        const isRemoved = feat.removed;
        const isCollapsed = feat.collapsed && !isRemoved;
        const isEvident = feat.evident_mark && !isRemoved;

        let hex = categoryColor[feat.category] ?? "#9aa0b4";
        if (isRemoved) hex = "#3a3a4a";
        else if (isCollapsed) hex = "#ffc15e";
        else if (isEvident) hex = "#8fd47a";

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const isActive = !isRemoved;
        const breathe = (isActive && !isCollapsed && !isEvident)
          ? 1 + Math.sin(t * 1.4 + i * 0.7) * 0.035
          : 1;

        if (!isRemoved) {
          ctx!.shadowColor = `rgba(${r},${g},${b},${0.25 * breathe})`;
          ctx!.shadowBlur = 8;
        }

        const bx = cx - rw / 2;
        const by = cy - rh / 2;
        ctx!.beginPath();
        ctx!.roundRect(bx, by, rw, rh, 5);

        if (isRemoved) {
          ctx!.fillStyle = "rgba(18,18,22,0.4)";
        } else {
          const grad = ctx!.createLinearGradient(bx, by, bx, by + rh);
          grad.addColorStop(0, `rgba(${r},${g},${b},0.20)`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0.06)`);
          ctx!.fillStyle = grad;
        }
        ctx!.fill();
        ctx!.shadowBlur = 0;

        ctx!.strokeStyle = isRemoved
          ? "rgba(48,48,56,0.35)"
          : `rgba(${r},${g},${b},${0.45 + Math.sin(t * 1.8 + i * 0.4) * 0.1})`;
        ctx!.lineWidth = isRemoved ? 0.5 : 1;
        ctx!.stroke();

        // clutter bar (only for active)
        if (!isRemoved) {
          const barW = rw * 0.74;
          const barH = 2.5;
          const bx2 = cx - barW / 2;
          const by2 = cy + rh / 2 - 7;
          ctx!.fillStyle = "rgba(255,255,255,0.05)";
          ctx!.beginPath();
          ctx!.roundRect(bx2, by2, barW, barH, 1.2);
          ctx!.fill();
          ctx!.fillStyle = `rgba(${r},${g},${b},0.65)`;
          ctx!.beginPath();
          ctx!.roundRect(bx2, by2, barW * (feat.clutter / 10), barH, 1.2);
          ctx!.fill();
        }

        // label
        const label = lang === "zh" ? feat.label.zh : feat.label.en;
        const fontSize = Math.min(7.5, cellW * 0.10);
        ctx!.font = `${fontSize}px JetBrains Mono, monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = isRemoved
          ? "rgba(72,72,82,0.45)"
          : `rgba(${r},${g},${b},0.88)`;

        const maxLW = rw * 0.88;
        const truncated = ctx!.measureText(label).width > maxLW
          ? label.slice(0, Math.floor(label.length * maxLW / ctx!.measureText(label).width) - 1) + "…"
          : label;
        ctx!.fillText(truncated, cx, cy - 4, maxLW);

        // status micro-badge
        if (isCollapsed) {
          ctx!.font = "5px JetBrains Mono, monospace";
          ctx!.fillStyle = `rgba(255,193,94,0.6)`;
          ctx!.fillText("MERGE", cx, cy + rh / 2 - 12, maxLW);
        } else if (isEvident) {
          ctx!.font = "5px JetBrains Mono, monospace";
          ctx!.fillStyle = `rgba(143,212,122,0.6)`;
          ctx!.fillText("SELF-EV", cx, cy + rh / 2 - 12, maxLW);
        } else if (isRemoved) {
          ctx!.font = "5px JetBrains Mono, monospace";
          ctx!.fillStyle = "rgba(72,72,82,0.4)";
          ctx!.fillText("REMOVED", cx, cy + rh / 2 - 12, maxLW);
        }

        // animated scanning dot for active move
        if (activeMove && !isRemoved) {
          const dotPhase = ((t * 0.5 + i * 0.21) % 1);
          const dotA = dotPhase < 0.5 ? dotPhase * 2 : (1 - dotPhase) * 2;
          const mc = MOVES.find((mv) => mv.id === activeMove);
          if (mc) {
            const mr = parseInt(mc.colorHex.slice(1, 3), 16);
            const mg = parseInt(mc.colorHex.slice(3, 5), 16);
            const mb = parseInt(mc.colorHex.slice(5, 7), 16);
            ctx!.beginPath();
            ctx!.arc(cx - rw / 2 + 5, cy - rh / 2 + 5, 2.5, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${mr},${mg},${mb},${dotA * 0.85})`;
            ctx!.fill();
          }
        }
      });
    }

    function step(ts: number) {
      const dt = (ts - prevRef.current) / 1000;
      prevRef.current = ts;
      tRef.current += dt;
      drawFrame(tRef.current);
      frameRef.current = requestAnimationFrame(step);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [features, activeMove, lang]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={200}
      className="w-full rounded-xl"
      style={{ minHeight: 130 }}
    />
  );
}

/* ─── SIMPLICITY METER ─── */
function SimplicityMeter({
  trueScore,
  superficialScore,
  lang,
}: {
  trueScore: number;
  superficialScore: number;
  lang: string;
}) {
  return (
    <div className="space-y-3">
      {/* True simplicity */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: "#8fd47a" }} />
            <span className="label-mono text-[0.56rem]" style={{ color: "#8fd47a" }}>
              {Lf("True Simplicity", "真正简约", lang)}
            </span>
          </div>
          <span className="font-mono text-sm font-bold" style={{ color: "#8fd47a" }}>{trueScore}%</span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(143,212,122,0.08)", border: "1px solid rgba(143,212,122,0.15)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${trueScore}%`, background: `linear-gradient(90deg, rgba(143,212,122,0.5), #8fd47a)` }}
          />
        </div>
        <p className="mt-1 font-mono text-[0.56rem] text-ink-500">
          {Lf("Complexity conquered — the user never meets it", "复杂性已被征服——用户永远不会遇到它", lang)}
        </p>
      </div>

      {/* Superficial simplicity */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full pulse" style={{ background: "#ff8a87" }} />
            <span className="label-mono text-[0.56rem]" style={{ color: "#ff8a87" }}>
              {Lf("Superficial Simplicity", "表面简约", lang)}
            </span>
          </div>
          <span className="font-mono text-sm font-bold" style={{ color: "#ff8a87" }}>{superficialScore}%</span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,138,135,0.08)", border: "1px solid rgba(255,138,135,0.15)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${superficialScore}%`, background: `linear-gradient(90deg, rgba(255,138,135,0.5), #ff8a87)` }}
          />
        </div>
        <p className="mt-1 font-mono text-[0.56rem] text-ink-500">
          {Lf("Things hidden or removed without solving the underlying need", "东西被隐藏或删除，但未解决底层需求", lang)}
        </p>
      </div>
    </div>
  );
}

/* ─── FEATURE SELECTOR ─── */
function FeatureChip({
  feature,
  selected,
  lang,
  onClick,
}: {
  feature: Feature;
  selected: boolean;
  lang: string;
  onClick: () => void;
}) {
  const catColors: Record<string, string> = {
    button: "#6cb8ff",
    menu: "#c79be0",
    step: "#ffc15e",
    page: "#ff8a87",
    indicator: "#8fd47a",
  };
  const hex = feature.removed
    ? "#3a3a4a"
    : feature.collapsed
    ? "#ffc15e"
    : feature.evident_mark
    ? "#8fd47a"
    : catColors[feature.category];

  return (
    <button
      onClick={onClick}
      className="rounded-lg border px-2 py-1 font-mono text-[0.58rem] transition-all duration-200"
      style={
        selected
          ? { borderColor: hex + "99", background: hex + "18", color: hex }
          : feature.removed
          ? { borderColor: "rgba(58,58,74,0.3)", color: "#3a3a4a", textDecoration: "line-through" }
          : { borderColor: "rgba(255,255,255,0.07)", color: "#71717f" }
      }
    >
      {Lf(feature.label.en, feature.label.zh, lang)}
    </button>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function SimplicityStudio() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => Lf(en, zh, lang);

  // preset
  const [presetId, setPresetId] = useState<string>("mp3");
  // completed moves
  const [completedMoves, setCompletedMoves] = useState<MoveId[]>([]);
  // active move in panel
  const [activeMoveId, setActiveMoveId] = useState<MoveId | null>(null);
  // selected feature for detail
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null);
  // show cost panel?
  const [showCost, setShowCost] = useState(false);
  // show done summary?
  const [showSummary, setShowSummary] = useState(false);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  // Build features from preset + completed moves
  const buildFeatures = useCallback(
    (completed: MoveId[]): Feature[] => {
      return preset.features.map((f, i) => {
        const base: Feature = {
          ...f,
          id: i,
          removed: false,
          collapsed: false,
          evident_mark: false,
        };

        if (completed.includes("remove") && !f.essential) {
          base.removed = true;
        }
        if (completed.includes("collapse") && f.collapsible && !base.removed) {
          base.collapsed = true;
        }
        if (completed.includes("manual") && f.evident && !base.removed) {
          base.evident_mark = true;
        }
        return base;
      });
    },
    [preset]
  );

  const [features, setFeatures] = useState<Feature[]>(() => buildFeatures([]));

  useEffect(() => {
    setFeatures(buildFeatures(completedMoves));
    setSelectedFeatureId(null);
  }, [presetId, completedMoves, buildFeatures]);

  const handlePresetChange = (id: string) => {
    setPresetId(id);
    setCompletedMoves([]);
    setActiveMoveId(null);
    setShowSummary(false);
    setShowCost(false);
  };

  const moveIdx = (id: MoveId) => MOVES.findIndex((m) => m.id === id);

  const canApplyMove = (id: MoveId): boolean => {
    const idx = moveIdx(id);
    for (let i = 0; i < idx; i++) {
      if (!completedMoves.includes(MOVES[i].id)) return false;
    }
    return !completedMoves.includes(id);
  };

  const isMoveDone = (id: MoveId) => completedMoves.includes(id);

  const handleMoveClick = (id: MoveId) => {
    setActiveMoveId(activeMoveId === id ? null : id);
  };

  const handleApplyMove = (id: MoveId) => {
    if (!canApplyMove(id)) return;
    const next = [...completedMoves, id];
    setCompletedMoves(next);
    if (id === "onejob") {
      setShowSummary(true);
    }
  };

  const handleReset = () => {
    setCompletedMoves([]);
    setActiveMoveId(null);
    setShowSummary(false);
    setShowCost(false);
    setSelectedFeatureId(null);
  };

  const activeMove = MOVES.find((m) => m.id === activeMoveId) ?? null;
  const metrics = computeSimplicity(features, completedMoves);
  const selectedFeature = selectedFeatureId !== null ? features.find((f) => f.id === selectedFeatureId) ?? null : null;

  // derived product metrics after each move
  const postMetrics = {
    buttonCount: Math.max(1, Math.round(preset.buttonCount * (1 - metrics.buttonsSaved / 110))),
    stepsToTask: completedMoves.includes("collapse")
      ? Math.max(3, Math.round(preset.stepsToTask * 0.3))
      : completedMoves.includes("remove")
      ? Math.round(preset.stepsToTask * 0.65)
      : preset.stepsToTask,
    menuDepth: completedMoves.includes("onejob")
      ? 1
      : completedMoves.includes("collapse")
      ? Math.max(1, Math.round(preset.menuDepth * 0.4))
      : completedMoves.includes("remove")
      ? Math.max(2, Math.round(preset.menuDepth * 0.75))
      : preset.menuDepth,
    manualPages: completedMoves.includes("manual")
      ? 0
      : completedMoves.includes("onejob")
      ? 0
      : completedMoves.includes("remove")
      ? Math.round(preset.manualPages * 0.4)
      : preset.manualPages,
  };

  return (
    <section className="w-full space-y-8">
      {/* ── HEADER ── */}
      <div className="space-y-3">
        <div className="label-mono">
          {L("Simplicity Studio · Jobs's method", "简约工作室 · 乔布斯方法")}
        </div>
        <h2 className="display text-3xl sm:text-4xl spark-text">
          {L("The Simplicity Studio", "简约工作室")}
        </h2>
        <p className="text-sm leading-relaxed text-ink-300 max-w-2xl">
          {L(
            "Jobs held that simplicity is the ultimate sophistication — but that real simplicity comes from mastering complexity, not hiding it. Take a cluttered product and apply five moves in sequence. Watch clutter fall and the True Simplicity meter rise. See where mastery becomes control.",
            "乔布斯认为，至繁归于至简——但真正的简约，来自征服复杂性，而非隐藏它。取一款臃肿的产品，依次应用五个动作。看着杂乱脱落，「真正简约」之表上升。看清精通在何处变成控制。"
          )}
        </p>
        <div className="h-px rule-flux" />
      </div>

      {/* ── PRESET SELECTOR ── */}
      <div className="space-y-3">
        <div className="label-mono text-steel-500">
          {L("Choose a product to simplify", "选择一款产品进行简化")}
        </div>
        <div className="flex flex-wrap gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetChange(p.id)}
              className="panel rounded-xl px-4 py-3 text-left transition-all duration-300 flex items-start gap-3"
              style={
                presetId === p.id
                  ? { borderColor: "rgba(41,151,255,0.55)", boxShadow: "0 0 24px -8px rgba(41,151,255,0.4)" }
                  : {}
              }
            >
              <span
                className="font-mono text-lg mt-0.5 flex-shrink-0"
                style={{ color: presetId === p.id ? "#6cb8ff" : "#71717f" }}
              >
                {p.icon}
              </span>
              <div>
                <div
                  className="font-mono text-[0.68rem] uppercase tracking-[0.14em] mb-0.5"
                  style={{ color: presetId === p.id ? "#6cb8ff" : "#9aa0b4" }}
                >
                  {L(p.label.en, p.label.zh)}
                </div>
                <div className="font-mono text-[0.56rem] text-ink-500 mb-1">{L(p.era.en, p.era.zh)}</div>
                <div className="text-[0.62rem] text-ink-500 leading-relaxed max-w-[200px]">
                  {L(p.desc.en, p.desc.zh)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── INITIAL CLUTTER METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: L("Buttons / Controls", "按键/控件"), initial: preset.buttonCount, current: postMetrics.buttonCount, hex: "#ff8a87" },
          { label: L("Steps to First Task", "首次任务步骤"), initial: preset.stepsToTask, current: postMetrics.stepsToTask, hex: "#ffc15e" },
          { label: L("Menu Depth", "菜单深度"), initial: preset.menuDepth, current: postMetrics.menuDepth, hex: "#c79be0" },
          { label: L("Manual Pages", "说明书页数"), initial: preset.manualPages, current: postMetrics.manualPages, hex: "#6cb8ff" },
        ].map(({ label, initial, current, hex }) => (
          <div key={label} className="panel rounded-xl p-4 text-center space-y-1">
            <div className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ink-500">{label}</div>
            <div
              className="display text-2xl font-bold transition-all duration-700"
              style={{ color: hex }}
            >
              {current}
            </div>
            {current !== initial && (
              <div className="font-mono text-[0.54rem] text-ink-500">
                {L("was", "原为")} <span style={{ color: hex + "99" }}>{initial}</span>
              </div>
            )}
            {current === initial && (
              <div className="font-mono text-[0.54rem] text-ink-500">{initial}</div>
            )}
          </div>
        ))}
      </div>

      {/* ── PRODUCT CANVAS ── */}
      <div className="panel panel-iris rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="label-mono text-iris-400">
            {L("Product Features", "产品功能")}
            <span className="ml-2 text-ink-500 normal-case tracking-normal">
              · {features.filter((f) => !f.removed).length} {L("active", "活跃")} / {features.length} {L("total", "总计")}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="label-mono text-ink-500 hover:text-flux-400 transition-colors px-2 py-1 rounded border border-ink-100/10 hover:border-flux-500/30 text-[0.55rem]"
          >
            {L("Reset ↺", "重置 ↺")}
          </button>
        </div>
        <ProductCanvas features={features} activeMove={activeMoveId} lang={lang} />

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { key: "button", label: L("Button/Control", "按键/控件"), hex: "#6cb8ff" },
            { key: "menu", label: L("Menu item", "菜单项"), hex: "#c79be0" },
            { key: "step", label: L("Setup step", "设置步骤"), hex: "#ffc15e" },
            { key: "page", label: L("Manual", "说明书"), hex: "#ff8a87" },
            { key: "indicator", label: L("Indicator", "指示器"), hex: "#8fd47a" },
          ].map(({ key, label, hex }) => {
            const count = features.filter((f) => f.category === key && !f.removed).length;
            if (count === 0) return null;
            return (
              <div
                key={key}
                className="flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.1em]"
                style={{ borderColor: hex + "44", color: hex, background: hex + "0d" }}
              >
                <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: hex }} />
                {label} ({count})
              </div>
            );
          })}
          {features.filter((f) => f.removed).length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-[0.55rem] uppercase tracking-[0.1em] border-void-600/40 text-ink-500 bg-void-700/20">
              <div className="h-1.5 w-1.5 rounded-full flex-shrink-0 bg-void-500" />
              {L("Removed", "已移除")} ({features.filter((f) => f.removed).length})
            </div>
          )}
        </div>
      </div>

      {/* ── SIMPLICITY METERS ── */}
      <div className="panel rounded-2xl p-5 space-y-4">
        <div className="label-mono">{L("Simplicity readings", "简约读数")}</div>
        <SimplicityMeter trueScore={metrics.trueScore} superficialScore={metrics.superficialScore} lang={lang} />
        <div className="mt-2 rounded-xl border border-ink-100/10 bg-void-800/60 p-3 space-y-1">
          <div className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-500">
            {L("Key distinction", "关键区别")}
          </div>
          <p className="text-xs leading-relaxed text-ink-300">
            {L(
              "True Simplicity rises when the underlying complexity is actually solved — restructured, merged, made self-evident. Superficial Simplicity rises when things are merely removed or hidden without solving what made them necessary. The meter distinguishes mastery from concealment.",
              "当底层复杂性真正被解决——被重构、合并、自明化——时，「真正简约」上升。当事物仅仅被删除或隐藏，而未解决使它们必要的原因时，「表面简约」上升。这个表盘区分精通与掩藏。"
            )}
          </p>
        </div>
      </div>

      {/* ── FIVE MOVES ── */}
      <div className="space-y-4">
        <div className="label-mono text-steel-500">
          {L("Five moves — apply in order", "五个动作——按顺序应用")}
        </div>

        {/* Move tabs */}
        <div className="flex flex-wrap gap-2">
          {MOVES.map((move, idx) => {
            const done = isMoveDone(move.id);
            const can = canApplyMove(move.id);
            const isActive = activeMoveId === move.id;
            const locked = !done && !can;

            return (
              <button
                key={move.id}
                onClick={() => handleMoveClick(move.id)}
                className="flex items-center gap-2 rounded-xl border px-3 py-2 font-mono text-[0.63rem] uppercase tracking-[0.12em] transition-all duration-300"
                style={
                  done
                    ? { borderColor: move.colorHex + "66", background: move.colorHex + "14", color: move.colorHex }
                    : isActive && !locked
                    ? { borderColor: move.colorHex + "99", background: move.colorHex + "1e", color: move.colorHex, boxShadow: `0 0 18px -5px ${move.colorHex}55` }
                    : locked
                    ? { borderColor: "rgba(255,255,255,0.04)", color: "#3a3a4a", cursor: "default" }
                    : { borderColor: "rgba(255,255,255,0.09)", color: "#9aa0b4" }
                }
                aria-pressed={isActive}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[0.58rem] flex-shrink-0"
                  style={{
                    background: done ? move.colorHex + "30" : locked ? "#1a1a22" : move.colorHex + "20",
                    color: done || (!locked && can) ? move.colorHex : "#3a3a4a",
                  }}
                >
                  {done ? "✓" : String(idx + 1)}
                </span>
                <span>{L(move.shortLabel.en, move.shortLabel.zh)}</span>
              </button>
            );
          })}
        </div>

        {/* Active move detail */}
        {activeMove && (
          <div
            className="panel rounded-2xl p-5 space-y-4 rise-in"
            style={{ borderColor: activeMove.colorHex + "40" }}
          >
            {/* Move header */}
            <div className="flex items-start gap-4">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl font-bold"
                style={{
                  background: activeMove.colorHex + "20",
                  color: activeMove.colorHex,
                  border: `1px solid ${activeMove.colorHex}44`,
                }}
              >
                {activeMove.icon}
              </div>
              <div>
                <div className="label-mono" style={{ color: activeMove.colorHex }}>
                  {L(`Move ${activeMove.num}`, `第 ${activeMove.num} 步`)}
                </div>
                <h3 className="display text-xl mt-1" style={{ color: activeMove.colorHex }}>
                  {L(activeMove.label.en, activeMove.label.zh)}
                </h3>
              </div>
            </div>

            <div className="h-px opacity-20" style={{ background: activeMove.colorHex }} />

            {/* Teaching */}
            <p className="text-sm leading-relaxed text-ink-200">
              {L(activeMove.teaching.en, activeMove.teaching.zh)}
            </p>

            {/* True vs Superficial indicators for this move */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl border p-3 space-y-1"
                style={{ borderColor: "rgba(143,212,122,0.25)", background: "rgba(143,212,122,0.05)" }}
              >
                <div className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-leaf-400">
                  {L("True gain", "真正收益")} +{activeMove.trueSimplicityGain}
                </div>
                <p className="text-[0.64rem] text-ink-400 leading-relaxed">
                  {L(
                    "If done right: complexity conquered, user never encounters the underlying mechanism",
                    "做对了：复杂性被征服，用户永远不会遇到底层机制"
                  )}
                </p>
              </div>
              <div
                className="rounded-xl border p-3 space-y-1"
                style={{ borderColor: "rgba(255,138,135,0.2)", background: "rgba(255,138,135,0.04)" }}
              >
                <div className="font-mono text-[0.56rem] uppercase tracking-[0.12em] text-plasm-400">
                  {L("Superficial risk", "表面风险")} {activeMove.superficialRisk}%
                </div>
                <p className="text-[0.64rem] text-ink-400 leading-relaxed">
                  {L(
                    "If done wrong: complexity hidden but not solved; user hits it in a different form",
                    "做错了：复杂性被隐藏但未被解决；用户以另一种形式遇到它"
                  )}
                </p>
              </div>
            </div>

            {/* Action badge */}
            <div
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em]"
              style={{ borderColor: activeMove.colorHex + "55", background: activeMove.colorHex + "0f", color: activeMove.colorHex }}
            >
              <span>→</span>
              {L(activeMove.action.en, activeMove.action.zh)}
            </div>

            {/* Feature inspector (question + remove steps) */}
            {(activeMove.id === "question" || activeMove.id === "remove") && !isMoveDone(activeMove.id) && (
              <div className="space-y-2">
                <div className="label-mono text-ink-500 text-[0.58rem]">
                  {L("Inspect a feature to question it:", "点击功能查看详情：")}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {features.filter((f) => !f.removed).map((f) => (
                    <FeatureChip
                      key={f.id}
                      feature={f}
                      selected={selectedFeatureId === f.id}
                      lang={lang}
                      onClick={() => setSelectedFeatureId(selectedFeatureId === f.id ? null : f.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Selected feature detail */}
            {selectedFeature && (
              <div
                className="rounded-xl border p-4 space-y-3 rise-in"
                style={{ borderColor: "#6cb8ff33", background: "rgba(41,151,255,0.05)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-flux-400">
                    {L(selectedFeature.label.en, selectedFeature.label.zh)}
                  </div>
                  <button
                    onClick={() => setSelectedFeatureId(null)}
                    className="font-mono text-ink-500 hover:text-steel-400 text-sm"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="label-mono text-[0.52rem] text-ink-500 mb-1">{L("Type", "类型")}</div>
                    <div className="font-mono text-xs text-steel-400 capitalize">{selectedFeature.category}</div>
                  </div>
                  <div>
                    <div className="label-mono text-[0.52rem] text-ink-500 mb-1">{L("Clutter cost", "杂乱代价")}</div>
                    <div className="font-mono text-xs text-gold-400">{selectedFeature.clutter}/10</div>
                  </div>
                  <div>
                    <div className="label-mono text-[0.52rem] text-ink-500 mb-1">{L("Essential?", "必要？")}</div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: selectedFeature.essential ? "#8fd47a" : "#ff8a87" }}
                    >
                      {selectedFeature.essential ? L("Yes", "是") : L("No", "否")}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="label-mono text-[0.52rem] text-ink-500 mb-1">{L("Note", "说明")}</div>
                  <p className="text-xs leading-relaxed text-ink-300">
                    {L(selectedFeature.description.en, selectedFeature.description.zh)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFeature.collapsible && !selectedFeature.removed && (
                    <div className="inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[0.54rem] uppercase tracking-[0.1em] border-gold-500/30 text-gold-400 bg-gold-500/06">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#ffc15e" }} />
                      {L("Collapsible — merge with gesture/scroll", "可折叠——合并为手势/滚动")}
                    </div>
                  )}
                  {selectedFeature.evident && !selectedFeature.removed && (
                    <div className="inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[0.54rem] uppercase tracking-[0.1em] border-leaf-500/30 text-leaf-400 bg-leaf-500/06">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#8fd47a" }} />
                      {L("Self-evident — no manual entry needed", "自明——不需要说明书")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reference (shown on question or remove step) */}
            {(activeMove.id === "question" || activeMove.id === "onejob") && (
              <div
                className="rounded-xl border p-4 space-y-2"
                style={{ borderColor: "rgba(41,151,255,0.18)", background: "rgba(41,151,255,0.04)" }}
              >
                <div className="label-mono text-flux-400 text-[0.56rem]">
                  {L("Historical illustration", "历史案例")}
                </div>
                <p className="text-xs leading-relaxed text-ink-300 italic">
                  {L(preset.reference.en, preset.reference.zh)}
                </p>
              </div>
            )}

            {/* Apply button */}
            {!isMoveDone(activeMove.id) && canApplyMove(activeMove.id) && (
              <button
                onClick={() => handleApplyMove(activeMove.id)}
                className="flex items-center gap-2 rounded-xl border px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.02]"
                style={{
                  borderColor: activeMove.colorHex + "77",
                  background: activeMove.colorHex + "18",
                  color: activeMove.colorHex,
                  boxShadow: `0 0 22px -8px ${activeMove.colorHex}50`,
                }}
              >
                <span>{activeMove.icon}</span>
                {L(
                  `Apply move ${activeMove.num}: ${activeMove.shortLabel.en}`,
                  `应用第 ${activeMove.num} 步：${activeMove.shortLabel.zh}`
                )}
              </button>
            )}

            {isMoveDone(activeMove.id) && (
              <div
                className="flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[0.63rem] uppercase tracking-[0.12em]"
                style={{
                  borderColor: activeMove.colorHex + "44",
                  background: activeMove.colorHex + "0d",
                  color: activeMove.colorHex + "bb",
                }}
              >
                <span>✓</span>
                {L("Move complete", "步骤已完成")}
              </div>
            )}

            {!isMoveDone(activeMove.id) && !canApplyMove(activeMove.id) && (
              <div className="rounded-xl border border-plasm-500/20 bg-plasm-500/05 p-3">
                <div className="label-mono text-plasm-400 text-[0.58rem] mb-1">
                  {L("Complete prior moves first", "先完成前面的步骤")}
                </div>
                <p className="text-xs text-ink-400">
                  {L(
                    "The moves are ordered by design — each one opens a class of simplification that the earlier moves make possible.",
                    "步骤是经过设计的有序排列——每一步都开启了前面步骤才能实现的一类简化。"
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SUMMARY ── */}
      {showSummary && (
        <div className="panel panel-leaf rounded-2xl p-6 space-y-6 rise-in">
          <div className="label-mono text-leaf-400">
            {L("Simplification complete — outcome", "简化完成——结果")}
          </div>
          <h3 className="display text-2xl leaf-text">
            {L("From clutter to clarity", "从杂乱到清晰")}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: L("Buttons removed", "移除按键"), value: `${preset.buttonCount - postMetrics.buttonCount}`, sub: L(`of ${preset.buttonCount}`, `共 ${preset.buttonCount}`) , hex: "#ff8a87" },
              { label: L("Steps to task", "任务步骤"), value: `${postMetrics.stepsToTask}`, sub: L(`was ${preset.stepsToTask}`, `原为 ${preset.stepsToTask}`), hex: "#ffc15e" },
              { label: L("Menu depth", "菜单深度"), value: `${postMetrics.menuDepth}`, sub: L(`was ${preset.menuDepth}`, `原为 ${preset.menuDepth}`), hex: "#c79be0" },
              { label: L("Manual pages", "说明书页数"), value: `${postMetrics.manualPages}`, sub: L(`was ${preset.manualPages}`, `原为 ${preset.manualPages}`), hex: "#8fd47a" },
            ].map(({ label, value, sub, hex }) => (
              <div
                key={label}
                className="rounded-xl border p-4 text-center"
                style={{ borderColor: hex + "33", background: hex + "08" }}
              >
                <div className="display text-3xl font-bold" style={{ color: hex }}>{value}</div>
                <div className="label-mono text-ink-500 text-[0.54rem] mt-1">{label}</div>
                <div className="font-mono text-[0.54rem] mt-0.5" style={{ color: hex + "88" }}>{sub}</div>
              </div>
            ))}
          </div>

          <SimplicityMeter trueScore={metrics.trueScore} superficialScore={metrics.superficialScore} lang={lang} />

          <div
            className="rounded-xl border p-4 space-y-2"
            style={{ borderColor: "rgba(143,212,122,0.2)", background: "rgba(143,212,122,0.04)" }}
          >
            <div className="label-mono text-leaf-400 text-[0.58rem]">
              {L("The teaching", "教益")}
            </div>
            <p className="text-sm leading-relaxed text-ink-200">
              {L(
                "The product that results from these five moves is not \"simpler\" in the way of having fewer things — it is simpler in the way of having solved the things that made complexity necessary, so the user never encounters them. True Simplicity is not a surface quality. It is the readout of engineering work the user never sees.",
                "经过这五个步骤产生的产品，不是「更简单」在于东西更少——而是「更简单」在于它解决了使复杂性成为必要的那些问题，让用户永远不会遇到它们。真正简约不是表面特质。它是用户永远看不见的工程工作的读数。"
              )}
            </p>
          </div>

          <button
            onClick={() => setShowCost(!showCost)}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] transition-all duration-200"
            style={
              showCost
                ? { borderColor: "rgba(255,138,135,0.55)", background: "rgba(255,94,91,0.12)", color: "#ff8a87" }
                : { borderColor: "rgba(255,138,135,0.25)", color: "#86868b" }
            }
          >
            <span style={{ color: "#ff8a87" }}>⚠</span>
            {L("The counter-argument: when simplicity becomes control →", "反面论点：当简约变成控制 →")}
          </button>
        </div>
      )}

      {/* ── COUNTER-PANEL ── */}
      {showCost && (
        <div className="panel panel-plasm rounded-2xl p-6 space-y-5 rise-in">
          <div className="label-mono text-plasm-400">
            {L("The same instinct, pushed to dogma", "同一本能，推向教条")}
          </div>
          <h3 className="display text-2xl plasm-text">
            {L("Simplicity as mastery vs. simplicity as control", "简约作为精通 vs. 简约作为控制")}
          </h3>
          <p className="text-sm leading-relaxed text-ink-300 max-w-3xl">
            {L(
              "The same instinct that produced the scroll wheel and the one-button phone also produced choices that removed things people legitimately needed. The cases below are not failures of the principle — they are evidence that any correct principle, applied past its natural boundary, becomes its own kind of dogma. The honest reading holds both.",
              "产生滚轮和单键手机的同一本能，也产生了移除人们合理需要的东西的选择。以下案例不是原则的失败——而是证明任何正确原则，一旦应用超过其自然边界，就会成为自己的一种教条。诚实的阅读，两者兼顾。"
            )}
          </p>

          <div className="space-y-3">
            {COST_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 space-y-2"
                style={{ borderColor: "rgba(255,94,91,0.18)", background: "rgba(255,94,91,0.04)" }}
              >
                <div className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-plasm-400">
                  {L(item.label.en, item.label.zh)}
                </div>
                <p className="text-xs leading-relaxed text-ink-300">
                  {L(item.detail.en, item.detail.zh)}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl border p-4 space-y-2"
            style={{ borderColor: "rgba(246,166,35,0.2)", background: "rgba(246,166,35,0.04)" }}
          >
            <div className="label-mono text-gold-400 text-[0.58rem]">
              {L("The distinction worth keeping", "值得保留的区别")}
            </div>
            <p className="text-sm leading-relaxed text-ink-200">
              {L(
                "Simplicity as mastery asks: \"have we done the engineering work to make this genuinely unnecessary for the user?\" Simplicity as control asks: \"does this inconvenience us to include?\" The scroll wheel was the former. The missing ports, in many cases, were the latter. Both came from the same person's convictions — which is precisely the lesson.",
                "简约作为精通追问：「我们是否做了工程工作，让这对用户真正变得不必要？」简约作为控制追问：「包含这个是否让我们感到不便？」滚轮是前者。缺失的接口，在许多情况下，是后者。两者都来自同一个人的信念——这恰恰就是教益所在。"
              )}
            </p>
          </div>

          <p className="text-[0.64rem] text-ink-500 italic">
            {L(
              "Cases paraphrased and synthesised from Walter Isaacson's «Steve Jobs» and public Apple product history. This panel offers our independent analysis — not the book's conclusion.",
              "案例改编自沃尔特·艾萨克森的《史蒂夫·乔布斯传》及苹果产品公开史。本面板提供我们的独立分析——而非本书的结论。"
            )}
          </p>
        </div>
      )}

      {/* If not done yet, show the cost button standalone */}
      {!showSummary && completedMoves.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowCost(!showCost)}
            className="rounded-xl border px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-all duration-200"
            style={
              showCost
                ? { borderColor: "rgba(255,138,135,0.45)", background: "rgba(255,94,91,0.10)", color: "#ff8a87" }
                : { borderColor: "rgba(255,138,135,0.2)", color: "#86868b" }
            }
          >
            ⚠ {L("Counter-argument: mastery vs. control", "反面论点：精通 vs. 控制")}
          </button>
        </div>
      )}

      {/* Attribution */}
      <p className="text-[0.62rem] text-ink-500 italic">
        {L(
          "Themes and examples paraphrased and synthesised from Walter Isaacson's «Steve Jobs» (© 2011, Simon & Schuster). All attributions are paraphrase; this is independent analysis, not a reproduction of the text.",
          "主题与例证改编自沃尔特·艾萨克森的《史蒂夫·乔布斯传》（© 2011，西蒙与舒斯特）。所有归因均为转述；这是独立分析，而非原文复制。"
        )}
      </p>
    </section>
  );
}
