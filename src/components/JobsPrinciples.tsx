"use client";

import { useState } from "react";
import { useLang } from "./lang";

/* ─── types ──────────────────────────────────────────────────────────────── */

type ClusterId =
  | "vision"
  | "simplicity"
  | "craft"
  | "distortion"
  | "leadership"
  | "mortality";

type Principle = {
  id: number;
  cluster: ClusterId;
  principle: { en: string; zh: string };
  gloss: { en: string; zh: string };
  /** verbatim: cite the aphorism source inline */
  verbatim?: string;
  /** cost: a dark-side observation from the biography */
  cost?: { en: string; zh: string };
};

/* ─── cluster definitions ─────────────────────────────────────────────────── */

type ClusterDef = {
  id: ClusterId;
  label: { en: string; zh: string };
  accent: string;
  chipActive: string;
  chipText: string;
  chipBorder: string;
  cardAccent: string;
  dotColor: string;
  numberColor: string;
  panelClass: string;
};

const CLUSTERS: ClusterDef[] = [
  {
    id: "vision",
    label: { en: "Vision & Purpose", zh: "愿景与目标" },
    accent: "#2997ff",
    chipActive: "bg-flux-500/20",
    chipText: "text-flux-400",
    chipBorder: "border-flux-500/50",
    cardAccent: "border-l-flux-500",
    dotColor: "bg-flux-400",
    numberColor: "text-flux-500",
    panelClass: "panel",
  },
  {
    id: "simplicity",
    label: { en: "Simplicity & Design", zh: "简约与设计" },
    accent: "#a663cc",
    chipActive: "bg-iris-500/20",
    chipText: "text-iris-400",
    chipBorder: "border-iris-500/50",
    cardAccent: "border-l-iris-500",
    dotColor: "bg-iris-400",
    numberColor: "text-iris-500",
    panelClass: "panel panel-iris",
  },
  {
    id: "craft",
    label: { en: "Product & Craft", zh: "产品与匠艺" },
    accent: "#61bb46",
    chipActive: "bg-leaf-500/20",
    chipText: "text-leaf-400",
    chipBorder: "border-leaf-500/50",
    cardAccent: "border-l-leaf-500",
    dotColor: "bg-leaf-400",
    numberColor: "text-leaf-500",
    panelClass: "panel panel-leaf",
  },
  {
    id: "distortion",
    label: { en: "Reality Distortion", zh: "现实扭曲" },
    accent: "#f6a623",
    chipActive: "bg-gold-500/20",
    chipText: "text-gold-400",
    chipBorder: "border-gold-500/50",
    cardAccent: "border-l-gold-500",
    dotColor: "bg-gold-400",
    numberColor: "text-gold-500",
    panelClass: "panel panel-gold",
  },
  {
    id: "leadership",
    label: { en: "Leadership & People", zh: "领导力与人" },
    accent: "#86868b",
    chipActive: "bg-steel-500/20",
    chipText: "text-steel-400",
    chipBorder: "border-steel-500/40",
    cardAccent: "border-l-steel-500",
    dotColor: "bg-steel-400",
    numberColor: "text-steel-500",
    panelClass: "panel panel-steel",
  },
  {
    id: "mortality",
    label: { en: "Mortality & Resilience", zh: "无常与坚韧" },
    accent: "#ff5e5b",
    chipActive: "bg-plasm-500/20",
    chipText: "text-plasm-400",
    chipBorder: "border-plasm-500/50",
    cardAccent: "border-l-plasm-500",
    dotColor: "bg-plasm-400",
    numberColor: "text-plasm-500",
    panelClass: "panel panel-plasm",
  },
];

/* ─── 34 paraphrased principles ──────────────────────────────────────────── */

const PRINCIPLES: Principle[] = [
  /* ── VISION & PURPOSE ── */
  {
    id: 1,
    cluster: "vision",
    principle: {
      en: "Make a dent in the universe.",
      zh: "在宇宙中留下你的印记。",
    },
    gloss: {
      en: "The ambition of the work should exceed the span of one life — aim at a contribution the world will remember.",
      zh: "工作的抱负应该超越一个人的生命长度——以世界将铭记的贡献为目标。",
    },
    verbatim: "Steve Jobs",
  },
  {
    id: 2,
    cluster: "vision",
    principle: {
      en: "Stand at the crossing of arts and technology.",
      zh: "立于艺术与科技的交汇之处。",
    },
    gloss: {
      en: "The most resonant products emerge where humanistic thinking meets engineering rigour — neither alone is sufficient.",
      zh: "最能打动人心的产品，诞生于人文思维与工程严谨的交汇之处——单独任何一方都不够。",
    },
  },
  {
    id: 3,
    cluster: "vision",
    principle: {
      en: "The people crazy enough to believe they can change the world are the ones who actually do.",
      zh: "相信自己能改变世界的那些“疯子”，才是真正改变世界的人。",
    },
    gloss: {
      en: "Conventional ambition produces conventional results; world-changing requires a willingness to look unreasonable.",
      zh: "常规的抱负产生常规的结果；改变世界需要甘愿看起来不理性的勇气。",
    },
  },
  {
    id: 4,
    cluster: "vision",
    principle: {
      en: "Build for the person you wish existed — then find out that millions of them do.",
      zh: "为你希望存在的那种人而建造——然后发现有数百万这样的人。",
    },
    gloss: {
      en: "Deep personal taste, pursued without compromise, turns out to be universal rather than niche.",
      zh: "毫不妥协地追求深刻的个人品味，结果往往是普世的，而非小众的。",
    },
  },
  {
    id: 5,
    cluster: "vision",
    principle: {
      en: "Your time is too finite to live by someone else's script.",
      zh: "你的时间太有限，不要活在别人的剧本里。",
    },
    gloss: {
      en: "Conformity extracts a hidden tax: every year spent meeting others' expectations is a year not spent discovering your own.",
      zh: "顺从收取一种隐性税：每一年满足他人期望的时光，就是未用于发现自我的时光。",
    },
  },

  /* ── SIMPLICITY & DESIGN ── */
  {
    id: 6,
    cluster: "simplicity",
    principle: {
      en: "Simplicity is the ultimate sophistication.",
      zh: "简约是终极的精致。",
    },
    gloss: {
      en: "Arriving at the simple solution is harder, costlier, and rarer than the complex one — that is exactly its value.",
      zh: "获得简单的解决方案比复杂的更难、代价更高、也更罕见——这正是它的价值所在。",
    },
    verbatim: "Leonardo da Vinci, adopted by Jobs",
  },
  {
    id: 7,
    cluster: "simplicity",
    principle: {
      en: "Design is what something does, not only what it looks like.",
      zh: "设计是事物的功能方式，而不仅是外观。",
    },
    gloss: {
      en: "Surface beauty without functional elegance is decoration; true design is invisible — it simply works.",
      zh: "没有功能优雅的表面美是装饰；真正的设计是无形的——它只是好用。",
    },
  },
  {
    id: 8,
    cluster: "simplicity",
    principle: {
      en: "Focus is the art of saying no to a thousand good ideas.",
      zh: "专注是对一千个好点子说不的艺术。",
    },
    gloss: {
      en: "The discipline is not knowing what to work on — it is refusing to work on everything else.",
      zh: "难的不是知道该做什么——而是拒绝做其他所有事情。",
    },
  },
  {
    id: 9,
    cluster: "simplicity",
    principle: {
      en: "Conquer complexity before the user ever meets it.",
      zh: "在用户遭遇复杂之前就将其征服。",
    },
    gloss: {
      en: "Every knob, menu, and preference transferred to the user is an engineering failure, not a feature.",
      zh: "每一个转移给用户的旋钮、菜单或偏好设置，都是工程失败，而非功能特性。",
    },
  },
  {
    id: 10,
    cluster: "simplicity",
    principle: {
      en: "Less, but far better.",
      zh: "更少，但好得多。",
    },
    gloss: {
      en: "Reduction is not subtraction — it is the removal of everything that dilutes the essential until only the essential remains.",
      zh: "削减不是减法——而是移除一切稀释本质的东西，直到只剩下本质本身。",
    },
  },

  /* ── PRODUCT & CRAFT ── */
  {
    id: 11,
    cluster: "craft",
    principle: {
      en: "Real artists ship.",
      zh: "真正的艺术家交付产品。",
    },
    gloss: {
      en: "Vision without delivery is merely daydreaming; the act of shipping is the proof of creative seriousness.",
      zh: "没有交付的愿景只是白日梦；发布产品的行为是创造力认真程度的证明。",
    },
    verbatim: "Steve Jobs",
  },
  {
    id: 12,
    cluster: "craft",
    principle: {
      en: "Finish the back of the fence even when no one will see it.",
      zh: "把篱笆背面也打磨好，哪怕没人会看见它。",
    },
    gloss: {
      en: "Craftsmanship is a standard you hold with yourself, not a performance for observers — the hidden parts matter most.",
      zh: "工匠精神是你与自己之间的标准，而非为旁观者表演——隐藏的部分最重要。",
    },
  },
  {
    id: 13,
    cluster: "craft",
    principle: {
      en: "Taste is not inherited — it is cultivated through obsessive attention.",
      zh: "品味不是遗传的——它是通过痴迷的专注培养出来的。",
    },
    gloss: {
      en: "Aesthetic judgment sharpens exactly as engineering judgment does: by studying great work and making things until the gap closes.",
      zh: "审美判断的磨砺方式与工程判断完全相同：研究伟大的作品，不断创作，直到差距消失。",
    },
  },
  {
    id: 14,
    cluster: "craft",
    principle: {
      en: "Own the whole experience — hardware, software, and the moment of unboxing.",
      zh: "掌控整体体验——硬件、软件，以及开箱的那一刻。",
    },
    gloss: {
      en: "The seam between components is where mediocrity hides; integrated control eliminates the seam.",
      zh: "组件之间的接缝是平庸藏身之处；整合控制消除了接缝。",
    },
  },
  {
    id: 15,
    cluster: "craft",
    principle: {
      en: "A-players insist on working with other A-players.",
      zh: "顶尖人才坚持只与同等水平的人共事。",
    },
    gloss: {
      en: "Hiring a B-player is not a neutral act — it starts a chain reaction that drags the entire team toward mediocrity.",
      zh: "雇用B级人才不是中性行为——它会引发连锁反应，将整个团队拖向平庸。",
    },
  },
  {
    id: 16,
    cluster: "craft",
    principle: {
      en: "The company itself is the most important product you will ever build.",
      zh: "公司本身是你将建造的最重要的产品。",
    },
    gloss: {
      en: "An organisation designed with the same intentionality as a great product will keep producing great products long after you are gone.",
      zh: "一个像伟大产品一样精心设计的组织，在你离开后仍能持续创造伟大的产品。",
    },
  },

  /* ── REALITY DISTORTION ── */
  {
    id: 17,
    cluster: "distortion",
    principle: {
      en: "The impossible is not a fact — it is merely the current state of your conviction.",
      zh: "不可能不是事实——它只是你当下信念的现状。",
    },
    gloss: {
      en: "Most limits on what can be built are psychological rather than physical; the reality-distortion field works by refusing psychological limits.",
      zh: "大多数关于能建造什么的限制是心理上的，而非物理上的；现实扭曲场通过拒绝心理限制来发挥作用。",
    },
  },
  {
    id: 18,
    cluster: "distortion",
    principle: {
      en: "Pressure people past the boundary of what they believe is possible — they will thank you.",
      zh: "将人们逼过他们认为可能的边界——他们会感激你的。",
    },
    gloss: {
      en: "Stretched goals that get met become the new baseline; people discover their own capacity only when someone refuses to accept a lesser one.",
      zh: "实现了的拉伸目标成为新的基准；只有当有人拒绝接受更低的标准时，人们才发现自己的潜力。",
    },
    cost: {
      en: "The cost: the same pressure, delivered without empathy, left engineers and colleagues feeling diminished rather than elevated.",
      zh: "代价：同样的压力，若缺乏同理心地施加，会让工程师和同事感到被贬低而非被提升。",
    },
  },
  {
    id: 19,
    cluster: "distortion",
    principle: {
      en: "Bend reality to the timeline, not the timeline to reality.",
      zh: "让现实适应时间表，而非让时间表适应现实。",
    },
    gloss: {
      en: "Accepting every constraint as fixed produces incremental work; suspending disbelief long enough to begin often unlocks solutions no one knew existed.",
      zh: "接受一切约束为固定不变，会产生渐进式的工作；足够长时间地暂停质疑去开始，往往能解锁没人知道存在的方案。",
    },
    cost: {
      en: "The cost: the binary of 'best thing ever / total garbage' sometimes denied reality dangerously, delaying medical attention and straining relationships.",
      zh: "代价：“史上最佳／一无是处”的二元评判有时危险地否认现实，耽误医疗和损害关系。",
    },
  },

  /* ── LEADERSHIP & PEOPLE ── */
  {
    id: 20,
    cluster: "leadership",
    principle: {
      en: "Keep the team small enough that everyone knows everyone's name.",
      zh: "把团队保持在每个人都知道彼此名字的规模。",
    },
    gloss: {
      en: "Coordination overhead grows faster than headcount; the creative output of one brilliant team beats a bureaucracy ten times its size.",
      zh: "协调成本的增长比人员规模更快；一支才华横溢的小团队的创造力胜过规模十倍的官僚机构。",
    },
  },
  {
    id: 21,
    cluster: "leadership",
    principle: {
      en: "Honest feedback is an act of respect — polite evasion is the real cruelty.",
      zh: "诚实的反馈是一种尊重——礼貌的回避才是真正的残忍。",
    },
    gloss: {
      en: "Withholding your real assessment robs people of the chance to improve; the momentary discomfort of candor is nothing against that cost.",
      zh: "隐瞒真实评价剥夺了他人改进的机会；坦率的瞬间不适与这种代价相比微不足道。",
    },
    cost: {
      en: "The cost: candor without compassion curdled into cruelty — Jobs's critiques sometimes wounded rather than elevated.",
      zh: "代价：没有同理心的坦率演变成了残忍——乔布斯的批评有时是伤害，而非提升。",
    },
  },
  {
    id: 22,
    cluster: "leadership",
    principle: {
      en: "Put the product people in charge — never let the accountants run the asylum.",
      zh: "让产品人掌舵——永远不要让会计师统治这一切。",
    },
    gloss: {
      en: "When financial optimisers lead creative companies, they optimise for margins and kill the very thing that generates them.",
      zh: "当财务优化者领导创意公司时，他们优化利润率，并扼杀正是产生利润率的那个东西。",
    },
  },
  {
    id: 23,
    cluster: "leadership",
    principle: {
      en: "Profit is the result of doing the mission well — pursue the mission, not the metric.",
      zh: "利润是使命执行良好的结果——追求使命，而非指标。",
    },
    gloss: {
      en: "Companies that optimise directly for profit tend to lose the qualities that made them profitable in the first place.",
      zh: "直接以利润为优化目标的公司，往往会失去最初让他们盈利的那些特质。",
    },
  },
  {
    id: 24,
    cluster: "leadership",
    principle: {
      en: "The best executive is the one who does not feel like an executive.",
      zh: "最好的管理者是那个感觉不像管理者的人。",
    },
    gloss: {
      en: "Hierarchical distance from the work breeds disconnection from its quality; staying close to the making keeps judgment sharp.",
      zh: "与工作的层级距离会滋生对品质的疏离；保持与创造的接近能使判断保持敏锐。",
    },
  },
  {
    id: 25,
    cluster: "leadership",
    principle: {
      en: "Great leaders ask 'why' before they ask 'how'.",
      zh: "优秀的领导者在问「怎么做」之前先问「为什么」。",
    },
    gloss: {
      en: "Understanding the purpose behind an effort clarifies which direction 'better' actually lies; technique without direction is just speed.",
      zh: "理解一项努力背后的目的，能厘清「更好」究竟在哪个方向；没有方向的技术只是速度。",
    },
  },

  /* ── MORTALITY & RESILIENCE ── */
  {
    id: 26,
    cluster: "mortality",
    principle: {
      en: "Getting fired was the best thing that ever happened to me.",
      zh: "被解雇是发生在我身上最好的事情。",
    },
    gloss: {
      en: "Forced exits strip away the weight of success and return you to the beginner's freedom — a second start with the knowledge of a veteran.",
      zh: "被迫离开能剥去成功的重量，让你回到初学者的自由——以老兵的知识重新出发。",
    },
    verbatim: "Steve Jobs",
  },
  {
    id: 27,
    cluster: "mortality",
    principle: {
      en: "Stay hungry, stay foolish.",
      zh: "求知若饥，虚心若愚。",
    },
    gloss: {
      en: "Hunger keeps you in motion; foolishness keeps you open. Together they prevent the complacency that buries successful people.",
      zh: "饥渴让你保持行动；愚钝让你保持开放。二者共同防止了掩埋成功者的自满。",
    },
    verbatim: "Stewart Brand's Whole Earth Catalog, quoted by Jobs",
  },
  {
    id: 28,
    cluster: "mortality",
    principle: {
      en: "Remembering you will die is the clearest lens there is.",
      zh: "记住自己终将死去，是最清晰的透镜。",
    },
    gloss: {
      en: "Mortality dissolves the illusions of pride, fear of embarrassment, and fear of failure — only the things that genuinely matter survive the filter.",
      zh: "死亡消解了自尊的幻觉、尴尬的恐惧与失败的恐惧——只有真正重要的事物才能通过这个过滤器。",
    },
    verbatim: "Steve Jobs, 2005 Stanford commencement",
  },
  {
    id: 29,
    cluster: "mortality",
    principle: {
      en: "You cannot connect the dots looking forward — only looking back.",
      zh: "向前看你无法把点连成线——只有回望才能。",
    },
    gloss: {
      en: "Trust that seemingly unrelated experiences will eventually cohere; the coherence appears only in retrospect, but that is enough reason to pursue them.",
      zh: "相信看似不相关的经历最终会融合成形；融合只在回望时出现，但这已足够成为追求它们的理由。",
    },
    verbatim: "Steve Jobs, 2005 Stanford commencement",
  },
  {
    id: 30,
    cluster: "mortality",
    principle: {
      en: "The exile between Apple chapters was not wasted time — it was a doctorate.",
      zh: "两段苹果岁月之间的流放不是虚度——那是一段博士课程。",
    },
    gloss: {
      en: "Jobs built NeXT and Pixar during his years away; the technologies and temperament developed there made the second Apple era possible.",
      zh: "乔布斯在离开期间建立了NeXT和皮克斯；在那里发展的技术和气质使苹果的第二个时代成为可能。",
    },
  },
  {
    id: 31,
    cluster: "mortality",
    principle: {
      en: "Illness concentrated his attention, not diminished it.",
      zh: "疾病使他的注意力更集中，而非减弱。",
    },
    gloss: {
      en: "Facing mortality clarified what he refused to leave unfinished — it was fuel rather than brake.",
      zh: "直面死亡让他清楚地知道什么是他拒绝留下未竟的——这是燃料，而非刹车。",
    },
  },
  {
    id: 32,
    cluster: "mortality",
    principle: {
      en: "Setbacks are not detours — they are part of the main road.",
      zh: "挫折不是弯路——它们是主干道的一部分。",
    },
    gloss: {
      en: "Every reversal Jobs suffered fed directly into a subsequent leap; the narrative only looks inevitable in retrospect.",
      zh: "乔布斯遭受的每一次逆转都直接推动了随后的飞跃；只有在回望时，这段叙事才看起来不可避免。",
    },
  },

  /* ── a few additional craft/product principles to reach 34 ── */
  {
    id: 33,
    cluster: "craft",
    principle: {
      en: "Packaging is the theatre of the product — design it like a stage set.",
      zh: "包装是产品的剧场——像设计舞台一样设计它。",
    },
    gloss: {
      en: "The first sensory encounter with a product shapes every subsequent perception of its quality; no detail is too small.",
      zh: "与产品的第一次感官接触塑造了随后对其品质的每一种感知；没有任何细节太小。",
    },
  },
  {
    id: 34,
    cluster: "simplicity",
    principle: {
      en: "Three hundred engineers for three years to make one button disappear.",
      zh: "三百名工程师花三年时间，只为让一个按钮消失。",
    },
    gloss: {
      en: "The depth of investment required to achieve effortless simplicity is invisible to the user — that invisibility is precisely the goal.",
      zh: "实现毫不费力的简约所需的投入深度，对用户是不可见的——那种不可见性正是目标所在。",
    },
  },
];

/* ─── cluster lookup helper ──────────────────────────────────────────────── */

function getCluster(id: ClusterId): ClusterDef {
  return CLUSTERS.find((c) => c.id === id)!;
}

/* ─── cluster chip ───────────────────────────────────────────────────────── */

function ClusterChip({
  cluster,
  count,
  active,
  onClick,
  lang,
}: {
  cluster: ClusterDef;
  count: number;
  active: boolean;
  onClick: () => void;
  lang: string;
}) {
  const label = lang === "zh" ? cluster.label.zh : cluster.label.en;

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs
        transition-all duration-200 cursor-pointer select-none
        ${
          active
            ? `${cluster.chipActive} ${cluster.chipText} ${cluster.chipBorder}`
            : "bg-void-800/60 text-ink-500 border-void-600/60 hover:text-ink-300 hover:border-steel-500/30"
        }
      `}
    >
      {active && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cluster.dotColor}`}
        />
      )}
      <span
        className={`label-mono text-[0.56rem] tracking-widest ${
          lang === "zh" ? "zh" : ""
        }`}
      >
        {label}
      </span>
      <span
        className={`label-mono text-[0.52rem] px-1 py-0.5 rounded-md ${
          active ? cluster.chipActive : "bg-void-700/60"
        }`}
        style={{ letterSpacing: "0.1em" }}
      >
        {count}
      </span>
    </button>
  );
}

/* ─── cost note ──────────────────────────────────────────────────────────── */

function CostNote({
  cost,
  lang,
}: {
  cost: { en: string; zh: string };
  lang: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-plasm-500/30 bg-plasm-500/06 px-3 py-2.5">
      {/* alert glyph */}
      <svg
        viewBox="0 0 12 12"
        width="11"
        height="11"
        aria-hidden="true"
        className="flex-shrink-0 mt-0.5"
      >
        <polygon
          points="6,1 11,10 1,10"
          fill="none"
          stroke="#ff8a87"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <line
          x1="6"
          y1="4.5"
          x2="6"
          y2="7"
          stroke="#ff8a87"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="6" cy="8.5" r="0.6" fill="#ff8a87" />
      </svg>
      <div className="flex flex-col gap-0.5">
        <span className="label-mono text-[0.48rem] text-plasm-400 tracking-widest">
          THE COST
        </span>
        <p
          className={`text-plasm-400 text-[0.68rem] leading-relaxed ${
            lang === "zh" ? "zh leading-loose" : ""
          }`}
          style={{
            fontFamily:
              lang === "zh"
                ? undefined
                : '"Newsreader", ui-serif, serif',
          }}
        >
          {lang === "zh" ? cost.zh : cost.en}
        </p>
      </div>
    </div>
  );
}

/* ─── principle card ─────────────────────────────────────────────────────── */

function PrincipleCard({
  item,
  lang,
}: {
  item: Principle;
  lang: string;
}) {
  const cluster = getCluster(item.cluster);

  return (
    <article
      className={`
        ${item.cost ? "panel panel-plasm" : cluster.panelClass}
        rounded-xl border-l-2 ${cluster.cardAccent}
        px-4 py-4 flex flex-col gap-2.5 rise-in
      `}
    >
      {/* row: number + cluster badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`label-mono text-[0.50rem] ${cluster.numberColor}`}
        >
          {String(item.id).padStart(2, "0")}
        </span>
        <span
          className={`label-mono text-[0.46rem] px-2 py-0.5 rounded-full border ${cluster.chipText} ${cluster.chipBorder}`}
          style={{ background: cluster.accent + "14" }}
        >
          <span className={lang === "zh" ? "zh" : ""}>
            {lang === "zh"
              ? cluster.label.zh
              : cluster.label.en}
          </span>
        </span>
      </div>

      {/* principle text */}
      <p
        className={`text-ink-50 text-sm font-semibold leading-snug ${
          lang === "zh" ? "zh" : "display"
        }`}
        style={{
          fontFamily:
            lang === "zh"
              ? undefined
              : '"Fraunces", ui-serif, serif',
          fontWeight: 600,
        }}
      >
        {lang === "zh" ? item.principle.zh : item.principle.en}
      </p>

      {/* verbatim attribution */}
      {item.verbatim && (
        <div className="flex items-center gap-1.5">
          <span
            className="h-px flex-1 opacity-20"
            style={{ background: cluster.accent }}
          />
          <span
            className="label-mono text-[0.44rem] text-ink-500 italic normal-case"
            style={{
              letterSpacing: "0.06em",
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: "none",
            }}
          >
            "{item.verbatim}"
          </span>
          <span
            className="h-px flex-1 opacity-20"
            style={{ background: cluster.accent }}
          />
        </div>
      )}

      {/* hairline */}
      {!item.verbatim && (
        <div className="h-px" style={{ background: cluster.accent + "22" }} />
      )}

      {/* gloss */}
      <p
        className={`text-ink-500 text-xs leading-relaxed ${
          lang === "zh" ? "zh leading-loose" : ""
        }`}
        style={{
          fontFamily:
            lang === "zh"
              ? undefined
              : '"Newsreader", ui-serif, serif',
        }}
      >
        {lang === "zh" ? item.gloss.zh : item.gloss.en}
      </p>

      {/* cost note */}
      {item.cost && <CostNote cost={item.cost} lang={lang} />}
    </article>
  );
}

/* ─── main export ────────────────────────────────────────────────────────── */

export default function JobsPrinciples() {
  const { lang } = useLang();
  const L = (en: string, zh: string) => (lang === "zh" ? zh : en);

  const [activeCluster, setActiveCluster] = useState<ClusterId | "all">(
    "all"
  );

  const filtered =
    activeCluster === "all"
      ? PRINCIPLES
      : PRINCIPLES.filter((p) => p.cluster === activeCluster);

  const countFor = (id: ClusterId) =>
    PRINCIPLES.filter((p) => p.cluster === id).length;

  const activeDef =
    activeCluster !== "all" ? getCluster(activeCluster) : null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 flex flex-col gap-10">

      {/* ── header ── */}
      <div className="flex flex-col gap-4 max-w-3xl">
        <div className="label-mono text-flux-400">
          {L("System 10 · Distilled Principles", "系统 10 · 精粹原则")}
        </div>

        <h2 className="display text-4xl md:text-5xl spark-text leading-none">
          {L("The Jobs Principles", "乔布斯原则")}
        </h2>

        <p
          className={`text-base text-ink-300 leading-relaxed max-w-2xl ${
            lang === "zh" ? "zh" : ""
          }`}
          style={{
            fontFamily:
              lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
          }}
        >
          {L(
            "Thirty-four paraphrased lessons drawn from Steve Jobs's life — grouped into six thematic clusters. Cards flagged in coral carry a dark-side note where the biography shows the cost of a principle taken too far.",
            "从史蒂夫·乔布斯的一生中提炼出的三十四条转述课训——归纳为六个主题群组。标注为珊瑚色的卡片带有暗面注释，揭示了传记中某条原则被推向极端时的代价。"
          )}
        </p>

        {/* attribution */}
        <div className="inline-flex items-center gap-2 rounded-lg border border-steel-500/20 bg-void-800/50 px-3 py-2 self-start">
          <svg
            viewBox="0 0 12 12"
            width="10"
            height="10"
            aria-hidden="true"
          >
            <circle
              cx="6"
              cy="6"
              r="5"
              fill="none"
              stroke="#86868b"
              strokeWidth="1.2"
            />
            <line
              x1="6"
              y1="5"
              x2="6"
              y2="9"
              stroke="#86868b"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="6" cy="3.5" r="0.8" fill="#86868b" />
          </svg>
          <span
            className={`text-[0.65rem] text-ink-500 ${
              lang === "zh" ? "zh" : ""
            }`}
            style={{
              fontFamily:
                lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
            }}
          >
            {L(
              "Principles paraphrased in original words — based on Walter Isaacson's «Steve Jobs»",
              "原创措辞转述原则——基于沃尔特·艾萨克森所著《史蒂夫·乔布斯传》"
            )}
          </span>
        </div>
      </div>

      {/* ── cluster filter chips ── */}
      <div className="flex flex-col gap-3">
        <div className="label-mono text-[0.55rem] text-ink-500">
          {L("FILTER BY CLUSTER", "按主题筛选")}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* ALL chip */}
          <button
            onClick={() => setActiveCluster("all")}
            aria-pressed={activeCluster === "all"}
            className={`
              inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5
              transition-all duration-200 cursor-pointer select-none
              ${
                activeCluster === "all"
                  ? "bg-flux-500/15 text-flux-400 border-flux-500/40"
                  : "bg-void-800/60 text-ink-500 border-void-600/60 hover:text-ink-300 hover:border-steel-500/30"
              }
            `}
          >
            <span className="label-mono text-[0.56rem] tracking-widest">
              {L("ALL", "全部")}
            </span>
            <span
              className={`label-mono text-[0.52rem] px-1 py-0.5 rounded-md ${
                activeCluster === "all"
                  ? "bg-flux-500/20"
                  : "bg-void-700/60"
              }`}
            >
              {PRINCIPLES.length}
            </span>
          </button>

          {CLUSTERS.map((c) => (
            <ClusterChip
              key={c.id}
              cluster={c}
              count={countFor(c.id)}
              active={activeCluster === c.id}
              onClick={() =>
                setActiveCluster(activeCluster === c.id ? "all" : c.id)
              }
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* ── active cluster description strip ── */}
      {activeDef && (
        <div
          className="rounded-xl border px-4 py-3 flex items-center gap-3 rise-in"
          style={{
            borderColor: activeDef.accent + "30",
            background: activeDef.accent + "08",
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 pulse"
            style={{
              background: activeDef.accent,
              boxShadow: `0 0 6px 2px ${activeDef.accent}55`,
            }}
          />
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`label-mono text-[0.6rem] ${activeDef.chipText}`}
            >
              {lang === "zh"
                ? activeDef.label.zh
                : activeDef.label.en}
            </span>
            <span
              className="text-ink-500 text-xs"
              style={{ fontFamily: '"Newsreader", ui-serif, serif' }}
            >
              —
            </span>
            <span
              className={`text-ink-300 text-xs ${lang === "zh" ? "zh" : ""}`}
              style={{
                fontFamily:
                  lang === "zh"
                    ? undefined
                    : '"Newsreader", ui-serif, serif',
              }}
            >
              {L(
                `${filtered.length} principle${filtered.length !== 1 ? "s" : ""} in this cluster`,
                `此主题共 ${filtered.length} 条原则`
              )}
            </span>
          </div>
        </div>
      )}

      {/* ── principle cards grid ── */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-live="polite"
        aria-label={L("Filtered principles", "已筛选原则")}
      >
        {filtered.map((item) => (
          <PrincipleCard key={item.id} item={item} lang={lang} />
        ))}
      </div>

      {/* ── rainbow rule ── */}
      <div className="h-px rule-flux rounded-full opacity-30" />

      {/* ── closing note ── */}
      <div
        className="rounded-2xl border px-6 py-5 text-sm leading-relaxed"
        style={{
          borderColor: "rgba(41,151,255,0.10)",
          background: "rgba(41,151,255,0.03)",
        }}
      >
        <p
          className={`text-ink-300 ${lang === "zh" ? "zh leading-loose" : ""}`}
          style={{
            fontFamily:
              lang === "zh" ? undefined : '"Newsreader", ui-serif, serif',
          }}
        >
          {L(
            "These are analytical paraphrases, not the book's verbatim text. Four widely-attributed aphorisms appear verbatim with attribution. Dark-side cost notes reflect the biography's own honest accounting. For the primary source, see Walter Isaacson's «Steve Jobs» (2011).",
            "这些是分析性转述，而非原书的逐字文本。四条广泛流传的格言经注明来源后原文引用。暗面代价注释反映了传记本身诚实的记录。原始资料请参阅沃尔特·艾萨克森所著《史蒂夫·乔布斯传》（2011年）。"
          )}
        </p>
      </div>

    </section>
  );
}
