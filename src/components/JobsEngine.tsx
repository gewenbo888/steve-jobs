"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, PANELS } from "./content";
import JobsField from "./JobsField";
import SimplicityStudio from "./SimplicityStudio";
import ProductTimeline from "./ProductTimeline";
import JobsPrinciples from "./JobsPrinciples";
import IntersectionViz from "./IntersectionViz";
import DesignLayers from "./DesignLayers";
import RDFViz from "./RDFViz";
import IntegrationViz from "./IntegrationViz";
import FocusGrid from "./FocusGrid";
import ComebackArc from "./ComebackArc";
import TasteViz from "./TasteViz";
import LegacyViz from "./LegacyViz";
import JobsAnalyst from "./JobsAnalyst";
import JobsRadar from "./JobsRadar";
import RecursiveJobsEngine from "./RecursiveJobsEngine";

const BOOK_URL = "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781451648539";

function ConceptPanels({ id }: { id: string }) {
  const { lang } = useLang();
  const set = PANELS[id];
  if (!set) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {set.map((c, i) => (
        <div key={i} className="panel rounded-xl p-5">
          <div key={lang} className={`display text-base text-flux-400 lang-fade ${lang === "zh" ? "zh" : ""}`}>{c.t[lang]}</div>
          <p key={`d-${lang}`} className={`mt-2 text-sm leading-relaxed text-ink-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>{c.d[lang]}</p>
        </div>
      ))}
    </div>
  );
}

const VIS: Record<string, ReactNode> = {
  intersection: <IntersectionViz />,
  simplicity: <DesignLayers />,
  rdf: <RDFViz />,
  integration: <IntegrationViz />,
  focus: <FocusGrid />,
  products: <ConceptPanels id="products" />,
  arc: <ComebackArc />,
  taste: <TasteViz />,
  legacy: <LegacyViz />,
};

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-ink-100/10 bg-void-950/85 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-md border border-ink-100/15 bg-void-800">
          <svg viewBox="0 0 32 32" className="h-5 w-5">
            <rect x="9" y="6" width="14" height="3.2" rx="1.2" fill="#61bb46" />
            <rect x="9" y="9.6" width="14" height="3.2" rx="1.2" fill="#f6a623" />
            <rect x="9" y="13.2" width="14" height="3.2" rx="1.2" fill="#ff5e5b" />
            <rect x="9" y="16.8" width="14" height="3.2" rx="1.2" fill="#e0433f" />
            <rect x="9" y="20.4" width="14" height="3.2" rx="1.2" fill="#a663cc" />
            <rect x="9" y="24" width="14" height="3.2" rx="1.2" fill="#2997ff" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="display text-base text-ink-50">Steve Jobs</div>
          <div className="zh text-[0.6rem] text-ink-500">《史蒂夫·乔布斯传》深度解读</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-500 lg:flex">
        <a href="#simplicity" className="hover:text-flux-400">Simplicity</a>
        <a href="#rdf" className="hover:text-flux-400">RDF</a>
        <a href="#arc" className="hover:text-flux-400">The Arc</a>
        <a href="#principles" className="hover:text-flux-400">Principles</a>
        <a href="#analyst" className="hover:text-flux-400">Analyst</a>
        <a href="#synthesis" className="hover:text-flux-400">Method</a>
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a href="https://psyverse.fun" className="hidden font-mono text-[0.6rem] uppercase tracking-[0.18em] text-flux-500 hover:text-flux-400 sm:block">← Psyverse</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <JobsField />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void-950/30 via-transparent to-void-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · an analytical companion</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ink-500">
          EN · 中文 · a study guide to Walter Isaacson's «Steve Jobs»
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.95] text-ink-50 md:text-8xl">
          Steve <span className="spark-text">Jobs</span>
        </h1>
        <h2 className="zh mt-3 text-2xl text-ink-200 md:text-4xl">《史蒂夫·乔布斯传》深度解读</h2>

        <p className="mt-9 max-w-2xl font-serif text-lg leading-relaxed text-ink-100 md:text-xl">
          <T v={{
            en: "Walter Isaacson's authorized biography asks one question across six hundred pages: were the brilliance and the brutality two things, or one? This is an independent companion to that book — a thematic map of the ideas that run through it (the art/technology intersection, simplicity, the reality distortion field, integration, focus, the fall-and-return arc) rebuilt as original interactive visualizations, and read with a fair, two-handed eye: the method studied, the cost never airbrushed.",
            zh: "沃尔特·艾萨克森的授权传记，用六百页追问一个问题：那才华与那残暴，是两件事，还是一件事？这是一份对那本书的独立解读——它把贯穿全书的诸般理念（人文与科技的交汇、简约、现实扭曲力场、整合、专注、坠落与归来的弧线）绘成一张主题地图，重建为原创的交互可视化，并以一种公允、两手并存的眼光来读：研究那方法，也绝不为那代价涂脂抹粉。",
          }} />
        </p>

        <div className="mt-10 max-w-2xl panel rounded-lg p-6">
          <div className="label-mono">Central question · 核心问题</div>
          <p className="mt-3 font-serif text-xl leading-relaxed text-ink-50 md:text-2xl">
            <T v={{
              en: "He wanted to stand at the intersection of the humanities and technology — and to make a dent in the universe.",
              zh: "他想站在人文与科技的交汇处——并在宇宙中留下一道印记。",
            }} />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-500">
          <span>10 themes · 41 chapters</span>
          <span>Apple 1976 → ouster 1985 → return 1997</span>
          <span>commentary, not the book itself</span>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ s, vis }: { s: (typeof SECTIONS)[number]; vis?: ReactNode }) {
  return (
    <section id={s.id} className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="label-mono"><T v={s.kicker} /></div>
        <div className="mt-3 flex items-baseline gap-4">
          <span className="display text-5xl text-ink-500/40">{s.num}</span>
          <div>
            <h2 className="display text-3xl text-ink-50 md:text-5xl"><T v={s.title} /></h2>
            <h3 className="mt-1 text-base text-flux-400 md:text-lg"><T v={s.sub} /></h3>
          </div>
        </div>
        <div className="mt-5 h-px rule-flux opacity-60" />
        <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-ink-200"><T v={s.body} /></p>
        <div className="mt-5 flex items-start gap-3 max-w-3xl">
          <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-plasm-500" />
          <p className="font-serif text-base italic leading-relaxed text-plasm-400/90"><T v={s.ask} /></p>
        </div>
        {vis && <div className="mt-12">{vis}</div>}
      </div>
    </section>
  );
}

function Body() {
  const { lang } = useLang();
  const synthesis = SECTIONS.find((s) => s.id === "synthesis")!;
  const rest = SECTIONS.filter((s) => s.id !== "synthesis");

  return (
    <main className="relative bg-void-950 text-ink-100">
      <Header />
      <Hero />

      {/* attribution banner */}
      <div className="border-y border-flux-500/20 bg-void-900/70 px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-serif text-sm leading-relaxed text-ink-300">
            <T v={{
              en: "Based on «Steve Jobs» by Walter Isaacson (© 2011, Simon & Schuster). This site is independent commentary and analysis — not affiliated with, nor a substitute for, the book.",
              zh: "基于沃尔特·艾萨克森的《史蒂夫·乔布斯传》（© 2011，西蒙与舒斯特）。本站为独立的评论与分析——与本书无隶属关系，亦非其替代品。",
            }} />
          </p>
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer"
            className="flex-none rounded-full border border-flux-500/40 px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-flux-400 transition hover:bg-flux-500/15">
            {lang === "zh" ? "获取原书 →" : "Get the book →"}
          </a>
        </div>
      </div>

      {/* product timeline */}
      <section className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The arc · 轨迹</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "Thirty-five years, one product at a time", zh: "三十五年，一次一款产品" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "The biography read as a product line: Apple I to iPad, with the 1985 ouster, the NeXT/Pixar wilderness, the 1997 return to a company ninety days from bankruptcy, and the illness that closed it. The dates are the book's; the reading is ours.",
              zh: "把传记读作一条产品线：从 Apple I 到 iPad，连同 1985 年的被逐、NeXT/皮克斯的荒野、1997 年回到一家距破产九十天的公司，以及为之收尾的那场病。日期出自本书；这番解读出自我们。",
            }} />
          </p>
          <div className="mt-12"><ProductTimeline /></div>
        </div>
      </section>

      {/* ticker */}
      <div className="border-y border-ink-100/10 bg-void-900 py-2.5 overflow-hidden">
        <div className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.3em] text-flux-400/80">
          {(lang === "zh"
            ? "人文与科技的交汇 · 至繁归于至简 · 设计是它如何运作 · 现实扭曲力场 · 掌控整体产品 · 专注即说不 · 产品高于利润 · 真正的艺术家准时交付 · 在意无人看见的部分 · 在宇宙中留下印记 · 非同凡想 · "
            : "INTERSECTION OF ART & TECHNOLOGY · SIMPLICITY IS THE ULTIMATE SOPHISTICATION · DESIGN IS HOW IT WORKS · THE REALITY DISTORTION FIELD · CONTROL THE WHOLE WIDGET · FOCUS IS SAYING NO · PRODUCTS OVER PROFITS · REAL ARTISTS SHIP · CARE ABOUT THE PARTS NO ONE SEES · MAKE A DENT IN THE UNIVERSE · THINK DIFFERENT · ").repeat(2)}
        </div>
      </div>

      {/* Feature — Simplicity Studio */}
      <section id="studio" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The signature instinct · 标志性直觉</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "The Simplicity Studio", zh: "简约工作室" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "Jobs's most repeated belief was that simplicity is the ultimate sophistication — and that it is reached by mastering complexity, not by hiding it. Take a cluttered product below and strip it toward its essence: cut features, buttons, steps and manuals until what remains is the one thing it should do. Watch the clutter fall and the 'true simplicity' meter rise — and see where stripping becomes mastery versus where it becomes control.",
              zh: "乔布斯最常重复的信念是：至繁归于至简——而它的抵达，靠的是征服复杂，而非藏起它。取下面一款臃肿的产品，把它剥向本质：删去功能、按钮、步骤与说明书，直到所剩下的，是它应当做的那一件事。看着杂乱脱落、『真正的简约』之表上升——并看清，剥离在何处成为精通、又在何处成为控制。",
            }} />
          </p>
          <div className="mt-10"><SimplicityStudio /></div>
        </div>
      </section>

      {/* Sections 01–09 */}
      {rest.map((s) => (
        <SectionBlock key={s.id} s={s} vis={VIS[s.id]} />
      ))}

      {/* Feature — Principles */}
      <section id="principles" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The distilled lessons · 提炼的教益</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "Jobs's principles, clustered", zh: "乔布斯的原则，分簇" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "The biography's lessons on innovation, leadership and values, distilled into our own paraphrases and grouped into thematic clusters so the shape of the method is visible at a glance. Filter by cluster; each is a pointer back into the book, not a replacement for its full text — and several carry the cost alongside the credo.",
              zh: "本书关于创新、领导力与价值观的教益，被提炼为我们自己的转述，并归入若干主题簇，好让那方法的形状一目了然。按簇筛选；每一条，都是指回本书的一个路标，而非对其全文的替代——而其中数条，把代价与信条并置。",
            }} />
          </p>
          <div className="mt-10"><JobsPrinciples /></div>
        </div>
      </section>

      {/* Analyst */}
      <section id="analyst" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The analyst · 分析者</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "Six readings of the same man", zh: "对同一个人的六种读法" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "Pick a question the book raises, then hear it from six angles in turn — a designer, an engineer, a biographer, a business strategist, a colleague who worked for him, and a skeptic. The colleague and the skeptic are deliberate: a portrait built from the founder's own cooperation needs the chairs that talk back.",
              zh: "选一个本书引出的问题，再依次从六个角度听它——一位设计师、一位工程师、一位传记作者、一位商业战略家、一位曾为他工作的同事，以及一位怀疑者。那位同事与那位怀疑者，是刻意安排的：一幅由创始人自己的配合所建成的画像，需要那些会回嘴的椅子。",
            }} />
          </p>
          <div className="mt-10"><JobsAnalyst /></div>
        </div>
      </section>

      {/* Meta-model — the method radar */}
      <section id="model" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">The method model · 方法模型</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "The method, scored", zh: "为方法打分" }} />
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "If the biography describes one machine, it has parts. We score eight of them — simplicity, integration, focus, taste & craft, vision (the RDF), product obsession, intensity, and showmanship — and let you trace how different makers (a committee-run incumbent, a pure engineer, an open-platform builder, the book's portrait of Jobs himself) light up very different shapes.",
              zh: "如果传记描述的是一台机器，它便有部件。我们为其中八者打分——简约、整合、专注、品味与匠艺、愿景（现实扭曲力场）、产品痴迷、强度，与表演力——并让你描摹：不同的制造者（一家委员会主导的在位者、一位纯粹的工程师、一位开放平台的建造者，以及本书对乔布斯本人的描画），如何点亮截然不同的形状。",
            }} />
          </p>
          <div className="mt-12"><JobsRadar /></div>
        </div>
      </section>

      {/* Section 10 — synthesis */}
      <section id={synthesis.id} className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono"><T v={synthesis.kicker} /></div>
          <div className="mt-3 flex items-baseline gap-4">
            <span className="display text-5xl text-ink-500/40">{synthesis.num}</span>
            <div>
              <h2 className="display text-3xl text-ink-50 md:text-5xl"><T v={synthesis.title} /></h2>
              <h3 className="mt-1 text-base text-flux-400 md:text-lg"><T v={synthesis.sub} /></h3>
            </div>
          </div>
          <div className="mt-5 h-px rule-flux opacity-60" />
          <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-ink-200"><T v={synthesis.body} /></p>
          <div className="mt-5 flex items-start gap-3 max-w-3xl">
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-plasm-500" />
            <p className="font-serif text-base italic leading-relaxed text-plasm-400/90"><T v={synthesis.ask} /></p>
          </div>
          <div className="mt-12"><RecursiveJobsEngine /></div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative border-t border-ink-100/8 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display text-4xl leading-snug text-ink-50 md:text-6xl">
            <T v={{ en: "Admire the dent in the universe; don't romanticise what it cost.", zh: "赞叹那在宇宙中的印记；但不要把它的代价浪漫化。" }} />
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink-300">
            <T v={{
              en: "Isaacson's own verdict stays unresolved on purpose, and so does ours: the same intensity that produced the products produced the cruelty, and the honest reader cannot cleanly separate them. Take the method — the standard, the focus, the care for the parts no one sees, the refusal of false constraints — and leave the binary contempt and the wounds. The lessons are real; so was the harm.",
              zh: "艾萨克森自己的裁决，刻意悬而未决，我们的也是：那造出产品的同一种强度，也造出了残酷，而诚实的读者，无法把它们干净地分开。取走那方法——那标准、那专注、那对无人看见之部分的在意、那对虚假约束的拒绝——而留下那二元的蔑视与那些伤害。那些教益是真的；那份伤害，也是。",
            }} />
          </p>
          <div className="mx-auto mt-10 max-w-xl rounded-lg border border-flux-500/25 bg-void-900 p-5">
            <p className="text-xs leading-relaxed text-ink-500">
              <T v={{
                en: "An independent, educational study companion to «Steve Jobs» by Walter Isaacson (© 2011 Walter Isaacson / Simon & Schuster). All themes are paraphrased and synthesised in our own words with original commentary and visualizations; this site is not affiliated with the author or publisher and is not a substitute for the book. Quotations and facts are attributed to the book and its sources.",
                zh: "一份针对沃尔特·艾萨克森《史蒂夫·乔布斯传》（© 2011 沃尔特·艾萨克森 / 西蒙与舒斯特）的、独立的教育性研读伴侣。所有主题均以我们自己的语言转述与综合，配以原创评论与可视化；本站与作者或出版方无隶属关系，亦非本书的替代品。引文与事实均归属于本书及其来源。",
              }} />
            </p>
          </div>
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full border border-flux-500/40 px-6 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-flux-400 transition hover:bg-flux-500/15">
            {lang === "zh" ? "获取《史蒂夫·乔布斯传》原书 →" : "Get «Steve Jobs» →"}
          </a>
          <div className="mx-auto mt-12 h-px w-40 rule-flux" />
          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-flux-500/70">
            Steve Jobs · companion · Psyverse · 2026
          </p>
        </div>
      </section>

      <footer className="border-t border-ink-100/10 bg-void-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="display text-xl text-ink-50">Steve Jobs</div>
            <div className="zh mt-1 text-sm text-ink-300">《史蒂夫·乔布斯传》深度解读</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              <T v={{ en: "An independent bilingual companion to Walter Isaacson's authorized biography — the art/technology intersection, simplicity, the reality distortion field, integration, focus, and the fall-and-return arc, rebuilt as original interactive analysis.", zh: "一份对沃尔特·艾萨克森授权传记的独立双语解读——人文与科技的交汇、简约、现实扭曲力场、整合、专注，以及坠落与归来的弧线，重建为原创的交互分析。" }} />
            </p>
          </div>
          <div>
            <div className="label-mono">Themes · 主题</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-500">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="hover:text-flux-400">{s.num} · <T v={s.title} /></a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-300">
              <li><a href="https://musk-codex.psyverse.fun" className="hover:text-flux-400">Musk Codex · 马斯克法典</a></li>
              <li><a href="https://book-of-elon.psyverse.fun" className="hover:text-flux-400">The Book of Elon · 埃隆之书</a></li>
              <li><a href="https://innovation-engines.psyverse.fun" className="hover:text-flux-400">Innovation Engines · 创新引擎</a></li>
              <li><a href="https://product-engine.psyverse.fun" className="hover:text-flux-400">Product Engine · 产品引擎</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-flux-500 hover:text-flux-400">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-flux" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-ink-500">
          <div>© 2026 Gewenbo · Psyverse · commentary</div>
          <div>EN · 中文 · educational</div>
        </div>
      </footer>
    </main>
  );
}

export default function JobsEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
