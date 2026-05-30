"use client";

import { useState } from "react";
import { useLang, T } from "./lang";
import type { Bi } from "./lang";

/* ─── data ─────────────────────────────────────────────────────────────────── */

type Voice = {
  id: string;
  role: Bi;
  blurb: Bi;
  /** Full Tailwind classes for the active tab state */
  tabActive: string;
  border: string;
  bgFrom: string;
  textAccent: string;
};

const VOICES: Voice[] = [
  {
    id: "designer",
    role:      { en: "Designer",               zh: "设计师" },
    blurb:     { en: "simplicity, taste, the unseen detail",
                 zh: "简洁、品味、看不见的细节" },
    tabActive: "border-flux-500/60 bg-flux-500/10 text-flux-400",
    border:    "border-flux-500/40",
    bgFrom:    "from-flux-500/[0.07]",
    textAccent:"text-flux-400",
  },
  {
    id: "engineer",
    role:      { en: "Engineer",               zh: "工程师" },
    blurb:     { en: "integration, the whole widget, real constraints",
                 zh: "集成、整体产品、真实的约束" },
    tabActive: "border-steel-500/60 bg-steel-500/10 text-steel-400",
    border:    "border-steel-500/40",
    bgFrom:    "from-steel-500/[0.07]",
    textAccent:"text-steel-400",
  },
  {
    id: "biographer",
    role:      { en: "Biographer",             zh: "传记作者" },
    blurb:     { en: "the man, the fall-and-return arc, Isaacson's questions",
                 zh: "其人、跌落与回归的弧线、传记的视角" },
    tabActive: "border-iris-500/60 bg-iris-500/10 text-iris-400",
    border:    "border-iris-500/40",
    bgFrom:    "from-iris-500/[0.07]",
    textAccent:"text-iris-400",
  },
  {
    id: "strategist",
    role:      { en: "Business Strategist",    zh: "商业战略家" },
    blurb:     { en: "focus, products-over-profits, the 1997 turnaround",
                 zh: "专注、产品优先于利润、1997年的逆转" },
    tabActive: "border-leaf-500/60 bg-leaf-500/10 text-leaf-400",
    border:    "border-leaf-500/40",
    bgFrom:    "from-leaf-500/[0.07]",
    textAccent:"text-leaf-400",
  },
  {
    id: "colleague",
    role:      { en: "Colleague",              zh: "共事的同事" },
    blurb:     { en: "the lived experience: inspiring and bruising at once",
                 zh: "亲身经历——既是激励，也是创伤" },
    tabActive: "border-gold-500/60 bg-gold-500/10 text-gold-400",
    border:    "border-gold-500/40",
    bgFrom:    "from-gold-500/[0.07]",
    textAccent:"text-gold-400",
  },
  {
    id: "skeptic",
    role:      { en: "Skeptic",                zh: "怀疑者" },
    blurb:     { en: "cruelty, myth-making, the portrait built on cooperation",
                 zh: "残酷、神话塑造、由合作构建的肖像" },
    tabActive: "border-plasm-500/60 bg-plasm-500/10 text-plasm-400",
    border:    "border-plasm-500/40",
    bgFrom:    "from-plasm-500/[0.07]",
    textAccent:"text-plasm-400",
  },
];

/* ─── questions + voice answers ──────────────────────────────────────────── */

type QA = {
  q: Bi;
  answers: Record<string, Bi>;
};

const QUESTIONS: QA[] = [
  {
    q: {
      en: "Were the brilliance and the brutality separable?",
      zh: "才华与残酷，真的可以分开吗？",
    },
    answers: {
      designer: {
        en: "The case for inseparability is aesthetic, not ethical. Jobs believed that what is not perfect is wrong, and that conviction ran all the way down — into fonts, into the curve of a polycarbonate shell, into the boot sequence a user sees once and then forgets. Brutality may have been less a tool than a symptom: a person who cannot tolerate imperfection in a corner radius cannot easily compartmentalise it when a person disappoints. The tragedy is that the same absolutism that produced the best-made objects of his era also produced a management style that most people cannot survive. They are not the same thing, but they spring from the same source.",
        zh: "无法分割的理由是美学上的，而非伦理上的。乔布斯相信不完美即错误，这种信念贯彻到底——字体、聚碳酸酯外壳的弧度、用户只看一次便遗忘的开机动画。残酷也许不是手段，而是症状：一个无法容忍圆角细节上的瑕疵的人，当人让他失望时，也很难将其compartmentalise。悲剧在于，正是这种绝对主义造就了他那个时代制作最精良的产品，同时也造就了一种大多数人无法承受的管理方式。两者并非同一回事，却同出一源。",
      },
      engineer: {
        en: "From an engineering standpoint the question matters because the answer determines what is replicable. If the exceptional products required the brutal management, then the template is toxic by design. The evidence is mixed. The teams that built the original Mac and the iPhone were driven hard, but they also had clarity of requirement and genuine creative latitude — conditions that produce great work independently of cruelty. The moments of harshest treatment often coincided with Jobs's own uncertainty rather than with engineering necessity. The products were excellent not because engineers were humiliated but because the requirements were clear and non-negotiable. Those two things can, in principle, be separated.",
        zh: "从工程角度看，这个问题至关重要，因为答案决定了什么是可复制的。如果卓越的产品需要残酷的管理，那么这套模板从设计上就是有毒的。证据是混杂的。制造最初Mac和iPhone的团队被严苛驱使，但他们也拥有清晰的需求和真正的创作空间——这些条件本身就能产生卓越的工作，与残酷无关。最严酷的对待往往发生在乔布斯自身不确定的时刻，而非工程必要的时刻。产品之所以卓越，不是因为工程师被羞辱，而是因为需求清晰且不可妥协。原则上，这两者是可以分开的。",
      },
      biographer: {
        en: "The question Isaacson was trying to resolve is ultimately whether Jobs was a great man who was also cruel, or a cruel man who was also great. The biography lands, somewhat uneasily, on the first interpretation. What the account makes clear is that Jobs never experienced his harshness as separable from his standards — in his own understanding, demanding the impossible was the same act as producing the extraordinary. That self-conception is part of the record, not a verdict on it. The fall-and-return arc suggests the exile did soften some edges; NeXT and Pixar showed he could build lasting relationships and sustained institutional culture. The question of what the brutality cost the people around him is one the biography raises but does not fully reckon with.",
        zh: "传记作者艾萨克森试图解决的问题，归根结底是：乔布斯是一位恰好也很残酷的伟人，还是一位恰好也很伟大的残酷之人？这本传记带着些许不安，落脚于前者。叙述中清晰呈现的是，乔布斯从未将自己的严苛视为与标准可分割的东西——在他自己的理解中，要求不可能与创造非凡是同一行为。这种自我认知是记录的一部分，而非对其的裁决。跌落与回归的弧线表明流放确实磨平了一些棱角；NeXT和皮克斯表明他能够建立持久的关系和延续的机构文化。残酷对身边人造成的代价，是这本书提出但未能充分正视的问题。",
      },
      strategist: {
        en: "The strategically relevant question is not whether they were separable in Jobs but whether they need to be coupled in building a great company. The 1997 turnaround required a ruthlessness that most boards and most managers cannot deploy — the product line was cut from hundreds of SKUs to four, and the people attached to those products were told directly that their work had been wrong. That clarity, applied fast, saved the company. But the long record also shows that the most durable Apple capabilities — the industrial design language, the retail experience, the developer platform — were built by teams with continuity and trust. The crisis required the brutality; the compounding did not.",
        zh: "战略层面真正重要的问题，不是在乔布斯身上两者是否可分，而是在建立伟大公司的过程中是否必须将两者捆绑。1997年的逆转需要一种大多数董事会和管理者无法运用的冷酷——产品线从数百个SKU削减到四个，与这些产品相关联的人被直接告知他们的工作是错误的。这种快速施加的清晰度拯救了公司。但长期记录也表明，苹果最持久的能力——工业设计语言、零售体验、开发者平台——是由具有延续性和信任感的团队建立的。危机需要残酷；复利增长则不需要。",
      },
      colleague: {
        en: "Living inside the reality distortion field, the two were absolutely inseparable — because he never signalled which mode he was in. You could receive the same quality of attention whether he was about to tell you your work was the best thing he had ever seen or the worst. That unpredictability was itself a form of control: it kept everyone alert and calibrated to his judgment rather than their own. The inspiration was real and the work was genuinely extraordinary. But so was the cost to people who had families, or health issues, or simply needed to know whether they had done a good job that week. The answer, from inside, is that you got both at once and were not given a choice about which you wanted.",
        zh: "置身于现实扭曲力场之中，两者绝对无法分开——因为他从不发出信号表明自己处于哪种模式。无论他即将告诉你你的工作是他见过最好的，还是最差的，你接收到的关注质量是相同的。这种不可预测性本身就是一种控制：它让每个人都保持警觉，向他的判断而非自己的判断校准。这种激励是真实的，工作也确实非凡。但对那些有家庭、有健康问题，或只是需要知道这周是否做得好的人来说，代价同样真实。从内部来看，答案是：你同时获得了两者，而没有被给予选择哪个的权利。",
      },
      skeptic: {
        en: "The inseparability thesis is convenient for the mythology and should be examined carefully. It serves to make the cruelty a necessary cost of the genius, which forecloses the question of whether it was actually necessary. Several of Jobs's most praised products were built by teams he was not closely managing — the iPod hardware team under Tony Fadell, large parts of the iPhone software stack — and they are not obviously less excellent for it. The thesis also conveniently exonerates a pattern of behaviour that caused documentable harm: employees who were fired or humiliated at critical personal moments, suppliers bullied into unsustainable terms, a daughter he refused to acknowledge for years. A portrait assembled with the subject's cooperation will tend to frame these as the price of greatness. A more honest accounting asks whether the price was paid by the people who received the greatness, or by the ones who did not.",
        zh: "不可分割论对神话很方便，需要仔细审视。它将残酷变成天才的必要代价，从而封闭了这一问题：这究竟是否必要。乔布斯最受称赞的几款产品，是由他并未紧密管理的团队打造的——托尼·法德尔领导下的iPod硬件团队、iPhone软件堆栈的大部分——它们并不因此而明显逊色。这一论点还方便地为一种造成可证实伤害的行为模式开脱：在关键个人时刻被解雇或羞辱的员工、被迫接受不可持续条款的供应商、他多年拒绝承认的女儿。在当事人配合下写成的肖像，往往将这些框架为伟大的代价。更诚实的核算会追问：这代价是由那些得到了伟大的人支付的，还是由那些没有得到的人支付的。",
      },
    },
  },

  {
    q: {
      en: "Is the reality distortion field a tool you'd actually want?",
      zh: "现实扭曲力场——你真的想要这个工具吗？",
    },
    answers: {
      designer: {
        en: "From a design perspective, the reality distortion field was primarily a belief about timelines and material constraints that turned out, often enough, to be correct. When Jobs insisted that a scroll wheel could be manufactured to a tolerance that suppliers said was impossible, the suppliers were frequently wrong — not because physics had been suspended but because the conventional estimate embedded a great deal of institutional caution and learned helplessness. The design value of insisting on what seems impossible is that it forces a real engineering investigation rather than an immediate retreat to the known. The danger is when the thing that seems impossible actually is impossible, and the field prevents the team from recognising that before the deadline.",
        zh: "从设计角度看，现实扭曲力场本质上是对时间线和物质约束的信念，而这种信念往往被证明是正确的。当乔布斯坚持一个滚轮可以按照供应商称之为不可能的公差制造时，供应商通常是错的——不是因为物理定律被暂停，而是因为传统估算中嵌入了大量的机构谨慎和习得性无助。坚持看似不可能之事的设计价值在于：它迫使真正的工程调查，而非立即退守到已知领域。危险在于当看似不可能的事情确实不可能时，力场阻止了团队在截止日期前认识到这一点。",
      },
      engineer: {
        en: "The honest engineering answer is: sometimes yes, sometimes catastrophically no. The field's mechanism is to reset the team's prior probability of success upward, which causes people to attempt things they would otherwise have correctly concluded were not worth attempting. When the new prior is more accurate than the conservative estimate — which is often, in early-stage technology — the field is genuinely productive. When it is not — when the schedule really cannot be met or the component really cannot be manufactured — the field produces denial that costs time, money, and the psychological safety of the team. The Macintosh shipped sixteen months late. The original iPhone missed its memory target. The field raises ambition; it does not repeal the laws of physics or the realities of supply chains.",
        zh: "诚实的工程答案是：有时候是的，有时候会造成灾难性后果。该力场的机制是将团队对成功的先验概率向上重置，这促使人们尝试他们本来会正确判断为不值得尝试的事情。当新的先验比保守估计更准确时——在早期技术阶段这很常见——力场确实具有生产力。当它不准确时——当进度表真的无法满足，或组件真的无法制造——力场产生的否认会消耗时间、金钱以及团队的心理安全感。Macintosh晚了十六个月。最初的iPhone未能达到其内存目标。力场提升了雄心壮志；它不废除物理定律或供应链的现实。",
      },
      biographer: {
        en: "The reality distortion field as a concept was coined by Bud Tribble in 1981, and Isaacson's account treats it as simultaneously Jobs's greatest managerial tool and the thing that most frequently brought projects to the edge of failure. What the biography captures less well is how the field changed across Jobs's two Apple stints. The early field was nakedly coercive — schedules were simply declared. The post-return version was more sophisticated: Jobs had learned at NeXT and Pixar that you need people to believe the impossible is possible, not just to be told it is. The field became partly motivational infrastructure rather than pure top-down pressure. Whether that distinction matters to the people on the receiving end is another question.",
        zh: "\"现实扭曲力场\"这一概念由巴德·特里布尔于1981年创造，艾萨克森的叙述将其同时视为乔布斯最伟大的管理工具和最频繁将项目推至失败边缘的东西。传记捕捉得不够充分的，是这一力场在乔布斯两次苹果任期中的演变。早期的力场是赤裸裸的强制性的——进度表只是被宣布。回归后的版本更为复杂：乔布斯在NeXT和皮克斯学到，你需要人们相信不可能是可能的，而不仅仅是被告知它是可能的。力场在一定程度上变成了激励基础设施，而非纯粹的自上而下的压力。这种区别对于承受者而言是否重要，则是另一个问题。",
      },
      strategist: {
        en: "As a competitive tool, the field had a specific strategic function: it allowed Apple to commit to product specifications and timelines that competitors, reasoning more conservatively, would not attempt. The original iPhone was announced before the software was stable and the supply chain was confirmed. In a market where pre-announcing a product raises the bar for all competitors and buys acquisition of developers and consumer attention, the ability to commit credibly to a future that does not yet exist is a genuine strategic asset. The cost is that the commitment is not always met — Maps, MobileMe, the antenna. The field is most valuable in a market where being directionally right matters more than being precisely on schedule. Apple's market, for most of Jobs's tenure, fit that description.",
        zh: "作为竞争工具，力场具有特定的战略功能：它允许苹果承诺竞争对手因推理更为保守而不会尝试的产品规格和时间线。最初的iPhone是在软件稳定和供应链确认之前就宣布的。在一个预先宣布产品能为所有竞争对手提高门槛、并赢得开发者和消费者注意力的市场中，可信地承诺一个尚不存在的未来，是真正的战略资产。代价是承诺并不总是实现——地图、MobileMe、天线门。在方向正确比精确按时更重要的市场中，力场最有价值。苹果的市场，在乔布斯大部分任期内，符合这一描述。",
      },
      colleague: {
        en: "You would want it, and then you would not want it, and then you would want it again. The field was not uniform — it had gradients. When it was directed at a problem, rather than at a person, it was extraordinary to be inside: you collectively agreed to believe something was possible that you were privately unsure of, and the belief sometimes made it so. The moments when it was directed at you personally — when the impossibility you were being asked to deny was your own competence, or your estimate, or your judgement — were the moments it felt like abuse. Most people who worked closely with Jobs would tell you that the net effect on their careers was positive and the net effect on their sense of self-worth during the hardest periods was not. Wanting it is not the same as being glad it happened to you.",
        zh: "你会想要它，然后你不会想要，然后你又会想要。力场并不均匀——它有梯度。当它指向一个问题而非一个人时，置身其中是非凡的：你们集体同意相信某件私下不确定的事情是可能的，而这种信念有时能让它成真。当它指向你个人时——当你被要求否认的不可能性是你自己的能力、你的估算、你的判断时——那些时刻感觉像是虐待。大多数与乔布斯密切共事过的人会告诉你，它对职业生涯的净效果是正面的，而对最艰难时期的自我价值感的净效果则不然。想要它，与庆幸它发生在你身上，并不是同一回事。",
      },
      skeptic: {
        en: "The framing of the reality distortion field as a tool is itself part of the mythology's sleight of hand. Tools are chosen and deployed with intention; the field was more accurately a personality trait — a refusal to process certain forms of negative information — that sometimes produced good outcomes and sometimes produced denial of engineering reality that delayed products and broke people. Calling it a tool retroactively attributes agency and craft to what was often obstinacy. More importantly, the concept has been exported into management culture as a template to emulate, which has done measurable harm: the founders who adopt the template without Jobs's specific domain knowledge produce organisations that are merely high-pressure, not high-performing. The field worked, when it worked, because Jobs usually understood the product deeply enough that his priors were better than the team's. Strip that condition and you have charisma applied to ignorance.",
        zh: "将现实扭曲力场框架为一种工具，本身就是神话的障眼法之一。工具是有意识地选择和部署的；而这种力场更准确地说是一种人格特质——拒绝处理某些形式的负面信息——它有时产生良好结果，有时产生对工程现实的否认，延误产品并伤害人。事后将其称为工具，是在追溯性地将能动性和技艺归于往往只是执拗的东西。更重要的是，这一概念已作为效仿模板输出到管理文化中，造成了可衡量的伤害：在没有乔布斯特定领域知识的情况下采用这一模板的创始人，创建的组织只是高压力的，而非高绩效的。力场之所以奏效——当它奏效时——是因为乔布斯通常对产品的理解足够深入，使得他的先验比团队的更好。去掉这个条件，你得到的不过是魅力施加于无知之上。",
      },
    },
  },

  {
    q: {
      en: "Does 'control the whole widget' still win?",
      zh: "\"掌控整个产品\"的逻辑，今天还成立吗？",
    },
    answers: {
      designer: {
        en: "From a design standpoint, vertical integration is not a business strategy — it is a prerequisite for a certain quality of experience. When the hardware, the operating system, and the application layer are designed by the same team with the same intent, the seams disappear. The first time a MacBook woke from sleep in under two seconds while Windows machines were still spinning, or the first time an iPhone scroll felt physically weighted, or the first time a Mac and iPhone handed off a phone call seamlessly — those moments exist because no hand-off between vendors had to be negotiated. The cost of that integration is enormous. But the resulting experience is qualitatively different from anything that can be produced by a loosely coupled stack. Whether the market continues to reward that difference is a separate question from whether the difference is real.",
        zh: "从设计角度看，垂直整合不是一种商业策略——而是特定体验质量的前提条件。当硬件、操作系统和应用层由同一团队以相同意图设计时，接缝消失了。当MacBook第一次在两秒内从睡眠唤醒而Windows机器还在转动时，当iPhone的滚动第一次感觉有物理重量时，当Mac和iPhone第一次无缝切换电话时——这些时刻的存在，是因为不需要在供应商之间协商任何交接。这种整合的成本是巨大的。但由此产生的体验与任何松散耦合的技术栈所能产生的东西在性质上是不同的。市场是否继续奖励这种差异，是一个与这种差异是否真实分离的问题。",
      },
      engineer: {
        en: "The technical answer is that full-stack integration wins in hardware-constrained, latency-sensitive, user-experience-critical applications — and loses in applications where the value is in the platform and the network effect, not the individual experience. Apple Silicon is the clearest current demonstration: designing the CPU, GPU, neural engine, and memory subsystem together produced performance-per-watt that neither Intel nor Qualcomm could match with equivalent silicon, because the whole widget assumption allowed the memory bandwidth to be allocated once rather than negotiated across a bus. The places where the strategy fails are where the ecosystem matters more than the hardware — enterprise software, developer tooling, interoperability standards. Jobs consistently underweighted these, and it cost Apple in markets it should have won.",
        zh: "技术答案是：全栈整合在硬件受限、延迟敏感、用户体验关键的应用中获胜——在价值在于平台和网络效应而非个体体验的应用中失败。Apple Silicon是最清晰的当代例证：将CPU、GPU、神经引擎和内存子系统一起设计，产生了英特尔和高通均无法用同等芯片匹敌的每瓦性能，因为整体产品假设允许内存带宽被一次性分配，而非跨总线协商。该策略失败的地方，是生态系统比硬件更重要的地方——企业软件、开发者工具、互操作性标准。乔布斯一贯低估了这些，这使苹果在本应赢得的市场中付出了代价。",
      },
      biographer: {
        en: "Isaacson's account frames the whole-widget philosophy as Jobs's deepest conviction — more fundamental than any specific product decision. It traced directly to his admiration for the Bauhaus idea that the designer should control the whole object, and to his frustration at every Apple licensing debate where he watched the experience he cared about get diluted by partners who did not share his obsessions. The strategy was vindicated spectacularly in the iPhone era; it had been badly punished in the PC era, when the Windows OEM ecosystem overwhelmed Apple's integrated alternative on price. What the biography cannot fully resolve is whether Jobs changed his mind about the failure mode from the first stint, or whether the second stint's success was partly lucky timing into a market — mobile — where the whole-widget logic happened to be determinative.",
        zh: "艾萨克森的叙述将整体产品哲学框架为乔布斯最深层的信念——比任何具体的产品决定都更为根本。它直接追溯到他对包豪斯理念的钦佩——设计师应该掌控整个物件——以及他在每次苹果授权辩论中的挫败感，眼睁睁看着他所在乎的体验被不分享他痴迷的合作伙伴稀释。该策略在iPhone时代得到了壮观的验证；在PC时代则受到了严酷的惩罚，当时Windows OEM生态系统以价格压倒了苹果的整合替代品。传记无法完全解决的是：乔布斯是否从第一次任期的失败模式中改变了看法，还是第二次任期的成功部分得益于进入了一个整体产品逻辑恰好起决定性作用的市场——移动。",
      },
      strategist: {
        en: "The whole-widget strategy wins when switching costs are high, when the integration layer is genuinely proprietary, and when the target user segment cares about experience enough to pay a premium for it. It loses when the market commoditises, when good-enough replaces best, or when the platform value exceeds the product value. In the PC market, Microsoft won by making Windows the platform; Jobs was wrong. In the smartphone market, Apple won by making iOS+hardware the product; Jobs was right. The key strategic insight the biography doesn't fully draw is that Jobs's instinct was correct in markets where he was selling to consumers who could choose, and wrong in markets dominated by enterprise procurement. The lesson is not 'always integrate' but 'understand which customers will pay for integration and price it accordingly.'",
        zh: "整体产品策略在转换成本高、整合层真正具有专有性、且目标用户群足够在乎体验愿意为之支付溢价时获胜。在市场商品化、足够好取代最好、或平台价值超越产品价值时失败。在PC市场，微软通过使Windows成为平台而获胜；乔布斯是错的。在智能手机市场，苹果通过使iOS+硬件成为产品而获胜；乔布斯是对的。传记未能充分揭示的关键战略洞察是：乔布斯的直觉在他向有选择权的消费者销售的市场中是正确的，在由企业采购主导的市场中是错的。教训不是\"始终整合\"，而是\"理解哪些客户愿意为整合付费，并据此定价\"。",
      },
      colleague: {
        en: "Inside Apple, the whole-widget philosophy was not experienced as a business strategy — it was experienced as a culture of accountability without excuse. If something in the experience was broken, it was Apple's problem. There was no vendor to blame, no gap in the architecture to hide behind. That accountability created a specific pressure: the bar for shipping was determined by the integrated experience, not by any individual component being 'good enough.' Whether that creates better products is something users who have spent time with both integrated and fragmented alternatives can judge. What it certainly creates is a company where 'that's not our problem' is not an available answer, and where the pressure to make every layer excellent never lets up. For some engineers, that is the only environment worth working in. For others, it is exhausting.",
        zh: "在苹果内部，整体产品哲学并不被体验为商业策略——而是被体验为一种没有借口的问责文化。如果体验中有什么东西出了问题，那就是苹果的问题。没有供应商可以指责，没有架构上的空隙可以躲避。这种问责创造了特定的压力：发货的门槛由整合体验决定，而非由任何单个组件\"足够好\"决定。这是否创造了更好的产品，是那些在整合和碎片化替代品上都花过时间的用户可以判断的。它确实创造的，是一家\"那不是我们的问题\"不是可用答案的公司，以及使每一层都卓越的压力从未消退的公司。对某些工程师来说，那是唯一值得工作的环境。对另一些人来说，那令人精疲力竭。",
      },
      skeptic: {
        en: "The whole-widget thesis has been substantially overfitted to Apple's success in one market during one decade. The PC era was a decisive counterexample — Jobs ran the same philosophy and nearly destroyed the company, and only returned to find a business that had survived because the clones had won the market he refused to serve. The iPhone's success resulted from a combination of factors of which tight integration was one: the timing relative to cellular network maturation, the app store as a platform play that invited exactly the fragmentation Jobs elsewhere resisted, the carrier subsidies that obscured the real price. Attributing the outcome primarily to the integration philosophy risks learning the wrong lesson. The more durable insight may be that Jobs was skilled at reading which specific constraints a market rewarded at a particular moment — and that skill, not the philosophical commitment to integration, is what is worth studying.",
        zh: "整体产品论已被过度拟合于苹果在某一十年间在某一市场的成功。PC时代是决定性的反例——乔布斯秉持相同哲学，几乎摧毁了公司，回归时发现的是一个靠克隆机赢得他拒绝服务的市场而存活下来的企业。iPhone的成功源于多种因素，紧密整合只是其中之一：相对于蜂窝网络成熟度的时机、作为平台举措邀请了他在其他地方所抵制的碎片化的应用商店、掩盖真实价格的运营商补贴。将结果主要归因于整合哲学，有可能学到错误的教训。更持久的洞察也许是：乔布斯擅长读懂特定时刻市场奖励哪些特定约束——而那种技能，而非对整合的哲学承诺，才是值得研究的东西。",
      },
    },
  },

  {
    q: {
      en: "Can taste really be taught — or transmitted?",
      zh: "品味真的可以被教授——或传递——吗？",
    },
    answers: {
      designer: {
        en: "Taste is not a gift; it is the residue of sustained attention. Jobs's taste was formed by specific experiences — Jony Ive describes it as a shared vocabulary built through thousands of conversations about why a particular surface treatment was right and another was wrong. That vocabulary can be transmitted, but it requires a teacher who can articulate the reasoning, not just dictate the verdict. Jobs was inconsistent here: sometimes he could explain exactly why something was wrong at the level of proportion or material honesty; sometimes the explanation was simply 'it's not right yet.' The first kind teaches; the second kind creates dependency. Apple's post-Jobs design continuity — which has held for over a decade under Ive and subsequently — suggests that the vocabulary was transmitted successfully. Whether it can survive a third generation of stewardship is the live question.",
        zh: "品味不是天赋；它是持续注意力的沉淀。乔布斯的品味由特定经历塑造——乔纳森·艾维将其描述为通过数千次关于为何特定表面处理是对的而另一种是错的对话建立起来的共同词汇。那种词汇可以传递，但它需要一个能够阐明理由而非只是宣布裁决的老师。乔布斯在这里是不一致的：有时他能精确解释为什么某样东西在比例或材料诚实性层面是错的；有时解释只是\"还不对\"。第一种方式教导人；第二种方式制造依赖。苹果后乔布斯时代的设计连续性——在艾维及其后继者的管理下保持了十余年——表明词汇被成功传递了。它能否在第三代管理人手中存续，是尚待解答的问题。",
      },
      engineer: {
        en: "From an engineering standpoint, 'taste' translates most usefully into a set of falsifiable constraints: the scroll should feel physically weighted; the haptic feedback should correspond exactly to the perceived action; the tolerance stack on the enclosure should be tight enough that no two units feel different. These are teachable in the sense that they can be written down, tested, and used to reject components. What is harder to teach is the intuition about which constraints matter — the ability to identify, before user testing, which details users will notice unconsciously and which they will not. That intuition appears to be transmissible through shared practice, but it degrades with institutional distance. The further you get from the source, the more the transmitted version tends toward checklist rather than judgment.",
        zh: "从工程角度看，\"品味\"最有用地转化为一套可证伪的约束：滚动应该感觉有物理重量；触觉反馈应与感知到的动作精确对应；外壳的公差叠加应足够紧密，使得没有两台设备感觉不同。这些在可以写下来、测试并用来拒绝组件的意义上是可教的。更难教的是关于哪些约束重要的直觉——在用户测试之前，识别用户会无意识注意到哪些细节而忽略哪些细节的能力。这种直觉似乎可以通过共同实践传递，但随着机构距离的增加而退化。离源头越远，被传递的版本就越倾向于清单而非判断力。",
      },
      biographer: {
        en: "The biography treats taste as Jobs's most distinctive quality and the one most resistant to analysis. Isaacson's account of the formative influences — the typefaces at Reed, the calligraphy, the Bauhaus furniture, the Eichler homes in the Cuesta Park neighbourhood where he grew up — suggests a man who was unusually porous to aesthetic influence and unusually rigorous in internalising it into principles. Whether that process is reproducible is unclear; it may be more similar to the formation of a musician's ear than the acquisition of an engineering skill. What the biography does establish is that Jobs believed taste could be transmitted, which is why he spent so much time explaining his judgments to Ive and the design team. The results suggest he was right. Whether the transmission works at scale, without the originator present, is the unresolved question the biography leaves open.",
        zh: "传记将品味视为乔布斯最鲜明的特质，也是最抵制分析的特质。艾萨克森对形成性影响的叙述——里德学院的字体、书法、包豪斯家具、他成长的圭斯塔公园街区的艾克勒住宅——描绘了一个对审美影响异常通透、并异常严格地将其内化为原则的人。这一过程是否可复制尚不清楚；它可能更类似于音乐家耳力的形成，而非工程技能的习得。传记确立的是：乔布斯相信品味可以传递，这也是为什么他花了大量时间向艾维和设计团队解释他的判断。结果表明他是对的。在没有原创者在场的情况下，这种传递是否能在规模上奏效，是传记留下的未解之问。",
      },
      strategist: {
        en: "Taste as a competitive moat has a specific strategic profile: it is extremely hard to acquire from outside (you cannot buy it), it compounds over time (the vocabulary gets richer with each product cycle), and it is very hard for competitors to reverse-engineer because the reasoning is not visible in the output. The strategic danger is that it depends on individuals, not processes. Microsoft could not acquire taste by hiring designers; it took fifteen years of iterative attempt and the specific leadership of Panos Panay at Surface, and even then the result was competence rather than the thing Apple had. The transmission question is therefore a board-level governance question as much as a cultural one: how do you encode a judgment-dependent capability into an institution so that it does not walk out the door when the person who holds it leaves?",
        zh: "品味作为竞争护城河具有特定的战略特征：极难从外部获得（你买不到它），随时间复利增长（词汇随每个产品周期变得更丰富），竞争对手极难逆向工程，因为推理在输出中不可见。战略危险在于它依赖于个人，而非流程。微软无法通过雇用设计师来获得品味；这花了十五年的迭代尝试和Surface的潘诺斯·帕内的特定领导力，即便如此结果也是能力而非苹果所拥有的东西。因此，传递问题与其说是文化问题，不如说是董事会层面的治理问题：你如何将依赖判断力的能力编码进一个机构，使它在持有者离开时不会随之消失？",
      },
      colleague: {
        en: "Working under him, you did not experience it as being taught taste — you experienced it as being required to have a taste you didn't yet fully possess, and then acquiring it out of necessity. The pressure was to hold a standard you could not initially articulate, and then to work backward until you understood why the standard was what it was. That is a real form of teaching, but it requires the teacher to be present, responding to actual objects, and it requires the learner to be willing to be wrong repeatedly in front of someone who holds the standard uncompromisingly. Most people who were formed in that environment can apply the vocabulary elsewhere. What they cannot easily replicate is the environment itself — which required not just the teacher but also the resources to execute to the standard, and the authority to reject work that did not meet it.",
        zh: "在他手下工作，你不会体验到品味被教授——你会体验到被要求拥有一种你尚未完全具备的品味，然后出于必要而习得它。压力是去持守一个你最初无法阐明的标准，然后逆向工作直到你理解为什么标准是那样的。这是一种真实的教学形式，但它需要老师在场、回应实际的物件，也需要学习者愿意在一个毫不妥协地持守标准的人面前反复犯错。在那种环境中形成的大多数人可以在其他地方应用这种词汇。他们难以轻易复制的是环境本身——这不仅需要老师，还需要执行到标准的资源，以及拒绝不符合标准的工作的权威。",
      },
      skeptic: {
        en: "The taste narrative carries a significant selection-bias risk: we are evaluating it on the products that succeeded, which are the products where Jobs's taste happened to align with what a large and wealthy consumer market was willing to reward. There were many products — the Lisa, the NeXT cube, the original Mac at $2,495 in 1984 dollars — where the taste was impeccable and the commercial result was not. The biography's treatment of taste risks circularity: Jobs had good taste because the products were successful, and the products were successful because Jobs had good taste. A more useful analysis would try to distinguish the elements of the design philosophy that were reliably market-winning from those that were personally satisfying but commercially neutral or harmful. The belief that the inside of the case should be as clean as the outside, for instance, is aesthetically coherent and commercially irrelevant. Collapsing all of this into 'taste' obscures more than it reveals.",
        zh: "品味叙事存在显著的选择偏差风险：我们在成功的产品上评估它，而那些恰好是乔布斯的品味与大型富裕消费市场愿意奖励的东西相符的产品。有很多产品——Lisa、NeXT立方体、1984年售价2495美元的原始Mac——品味无可挑剔，而商业结果并非如此。传记对品味的处理有循环论证的风险：乔布斯有好品味因为产品成功了，产品成功了因为乔布斯有好品味。更有用的分析会尝试区分设计哲学中可靠地赢得市场的元素，与那些个人上令人满足但商业上中性或有害的元素。例如，相信机箱内部应该和外部一样整洁的信念，在美学上是连贯的，在商业上是无关紧要的。将这一切折叠进\"品味\"中，掩盖的多于揭示的。",
      },
    },
  },

  {
    q: {
      en: "Did the wilderness make him — or would he have returned anyway?",
      zh: "荒野造就了他——还是他无论如何都会回来？",
    },
    answers: {
      designer: {
        en: "The twelve years between the 1985 exit and the 1997 return produced two outcomes that directly shaped everything Apple did after: Pixar, which taught Jobs what a sustained creative culture built on technical excellence actually feels like from the inside; and NeXT, which despite its commercial failure produced the operating system kernel that became macOS and iOS. The first gave him the emotional intelligence to understand that great work requires sustained institutional conditions, not just the right individual at the top. The second gave him the technical foundation for the next act. Neither could have happened inside Apple. The wilderness didn't just make him — it supplied the specific materials the second act required. Whether a different kind of exile would have produced the same outcomes is genuinely unknowable.",
        zh: "1985年离开和1997年回归之间的十二年产生了两个直接塑造苹果此后一切的成果：皮克斯，它让乔布斯从内部感受到建立在技术卓越之上的持续创意文化究竟是什么感觉；以及NeXT，尽管商业上失败了，却产生了成为macOS和iOS的操作系统内核。前者给了他情商，让他理解到伟大的工作需要持续的机构条件，而不仅仅是顶端的正确个人。后者给了他下一幕所需的技术基础。这两者都无法在苹果内部发生。荒野不仅造就了他——它提供了第二幕所需的特定材料。不同类型的流放是否会产生相同的结果，是真正无法知晓的。",
      },
      engineer: {
        en: "The engineering case for the wilderness being essential is straightforward: the NeXT operating system — Mach kernel, BSD Unix, Objective-C, the Display PostScript environment — was technically superior to anything Apple had internally, and Apple's 1994-1996 Copland project had conclusively demonstrated that Apple could not build its next-generation OS from within. The acquisition of NeXT in 1997 was therefore not just a Jobs acquisition; it was a platform acquisition. That platform was the product of eleven years of work by the NeXT engineering team. Without the wilderness years, there is no NeXT OS, and the most plausible counterfactual — Apple acquiring Be Inc. instead — would have produced a technically inferior foundation for the next two decades. The exile was necessary for the platform, whether or not it was necessary for the man.",
        zh: "支持荒野是必要的工程论据很直接：NeXT操作系统——Mach内核、BSD Unix、Objective-C、Display PostScript环境——在技术上优于苹果内部的任何东西，而苹果1994-1996年的Copland项目已经决定性地证明苹果无法从内部构建其下一代操作系统。因此1997年收购NeXT不仅仅是一次人才收购；而是一次平台收购。那个平台是NeXT工程团队十一年工作的产物。没有荒野岁月，就没有NeXT操作系统，而最可信的反事实——苹果转而收购Be公司——将为接下来二十年提供一个技术上较弱的基础。无论流放对这个人是否必要，它对平台是必要的。",
      },
      biographer: {
        en: "Isaacson's reading of the exile is that it was formative in the biographical sense — that it transformed Jobs from a person of great talent and great destructiveness into someone who had learned, at cost, the difference between building something and burning it down. The Pixar experience in particular gave him a sustained encounter with collaborative creative culture that his first Apple stint had not. Whether this transformation was caused by the exile specifically, or whether it was the result of aging, therapy, the birth of his children, the discipline of running two companies simultaneously — the biography doesn't fully disentangle. What is clear is that the 1997 Jobs was a different kind of difficult person than the 1985 Jobs: still demanding, still capable of cruelty, but with a longer time horizon and a better understanding of what institutions require to sustain themselves.",
        zh: "艾萨克森对流放的解读是，它在传记意义上是形成性的——它将一个才华横溢、破坏力巨大的人转变为一个付出代价后学会了建造与摧毁之间区别的人。尤其是皮克斯的经历，给了他一种在第一次苹果任期中未曾拥有的与协作创意文化的持续接触。这种转变是否专门由流放造成，还是年龄增长、心理咨询、子女出生、同时经营两家公司的纪律的结果——传记没有完全解开这一问题。清晰的是，1997年的乔布斯是与1985年的乔布斯不同类型的难相处之人：依然要求苛刻，依然能够残酷，但拥有更长的时间视野和对机构需要什么才能自我维持的更好理解。",
      },
      strategist: {
        en: "The strategic version of the question is whether a leader who had not been exiled could have executed the 1997-2011 run as effectively. The honest answer is probably not, for a specific reason: the exile produced a Jobs who was willing to be patient with the platform and the ecosystem in a way that the 1985 Jobs demonstrably was not. The App Store, the iTunes ecosystem, the developer relationships that made the iPhone successful — these required a willingness to share the economics of the platform with third parties that Jobs had historically resisted. The twelve-year lesson in what happens when you build a great product on a weak ecosystem — NeXT — appears to have taught him that the ecosystem is part of the product. That lesson required the specific experience of the wilderness to become actionable knowledge.",
        zh: "这个问题的战略版本是：一位未曾流放的领导者能否同样有效地执行1997-2011年的那段历程。诚实的答案可能是否定的，原因很具体：流放产生了一个愿意以1985年的乔布斯明显不愿意的方式对平台和生态系统保持耐心的乔布斯。应用商店、iTunes生态系统、使iPhone成功的开发者关系——这些需要一种愿意与第三方分享平台经济利益的意愿，而乔布斯历史上一直对此抵制。在一个伟大产品建立在薄弱生态系统上会发生什么——NeXT——方面的十二年教训，似乎教会了他生态系统是产品的一部分。那个教训需要荒野的特定经历才能成为可操作的知识。",
      },
      colleague: {
        en: "From inside the second Apple, the exile was visible in a specific way: Jobs would occasionally reference what he had learned at Pixar about how to run a creative organisation, and those references had a quality of hard-won knowledge rather than theory. He knew what it was like to not be the most powerful person in the room — at Pixar, Catmull and Lasseter were the creative authorities — and that experience appeared to have taught him something about when to trust other people's judgment. He was still capable of overriding everyone, but there were moments in the second Apple that had no equivalent in the accounts of the first: moments where he waited, deferred, let someone else carry the idea. Whether the wilderness was sufficient or merely necessary for that, none of us can say. But the product of it was a person who had been marked by failure in a way that made him more complete.",
        zh: "从第二次苹果内部看，流放以一种特定的方式可见：乔布斯偶尔会提及他在皮克斯学到的关于如何经营创意组织的东西，而那些提及带有来之不易的知识的质感，而非理论。他知道不是房间里最有权力的人是什么感觉——在皮克斯，卡特姆和拉塞特是创意权威——那段经历似乎教会了他一些关于何时信任他人判断的东西。他依然能够推翻所有人，但第二次苹果有一些在第一次的记述中找不到对等的时刻：他等待、推迟、让别人承担想法的时刻。荒野对此是充分的还是仅仅必要的，我们中没有人能说清楚。但它的产物是一个被失败深深烙印的人，而那种烙印使他更完整。",
      },
      skeptic: {
        en: "The redemption-through-exile narrative is one of the most powerful story structures in Western biography, and it should make us more careful rather than less about accepting it at face value. The trajectory — pride, fall, purification, return, greatness — maps almost perfectly onto the Jobs story, which should prompt the question of how much of that mapping is interpretive rather than causal. Jobs returned because Apple was failing and the board was desperate, not because he had completed a developmental arc. The 1997 acquisition was a business transaction. Whether he was 'ready' to lead is not obviously answerable from the evidence; what is answerable is that he was available, that the NeXT OS was a genuine technical asset, and that Apple had no better option. The wilderness years produced real capabilities — Pixar, NeXT OS — but the claim that they produced a wiser, more mature Jobs should be held to the same scrutiny as any other founder mythology.",
        zh: "通过流放得到救赎的叙事是西方传记中最有力的故事结构之一，这应该让我们对原样接受它更加谨慎，而非更少。轨迹——骄傲、跌落、净化、回归、伟大——几乎与乔布斯的故事完美对应，这应该引发一个问题：那种对应中有多少是解释性的而非因果性的。乔布斯回归是因为苹果正在失败而董事会走投无路，而非因为他完成了一段发展弧线。1997年的收购是一笔商业交易。他是否\"准备好\"领导，从证据中并不明显可回答；可以回答的是他可以获得、NeXT OS是真正的技术资产、苹果没有更好的选择。荒野岁月产生了真实的能力——皮克斯、NeXT OS——但关于它们产生了一个更智慧、更成熟的乔布斯的主张，应与任何其他创始人神话接受同等的审视。",
      },
    },
  },
];

/* ─── component ─────────────────────────────────────────────────────────────── */

export default function JobsAnalyst() {
  const { lang } = useLang();
  const [qi, setQi] = useState(0);
  const [voiceId, setVoiceId] = useState("designer");

  const q = QUESTIONS[qi];
  const activeVoice = VOICES.find((v) => v.id === voiceId) ?? VOICES[0];

  return (
    <div className="panel rounded-2xl p-5 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">

        {/* ── left: question selector ─────────────────────────────────────── */}
        <div>
          <div className="label-mono mb-4">
            {lang === "zh" ? "选择一个问题" : "choose a question"}
          </div>
          <div className="space-y-2">
            {QUESTIONS.map((item, i) => (
              <button
                key={i}
                onClick={() => setQi(i)}
                className={`block w-full rounded-lg border px-4 py-2.5 text-left text-sm leading-snug transition ${
                  i === qi
                    ? "border-flux-500/50 bg-flux-500/10 text-flux-300"
                    : "border-ink-100/10 text-ink-400 hover:border-flux-500/30 hover:text-ink-200"
                }`}
              >
                <T v={item.q} />
              </button>
            ))}
          </div>
        </div>

        {/* ── right: voice selector + answer ──────────────────────────────── */}
        <div>
          {/* voice tabs */}
          <div className="flex flex-wrap gap-2">
            {VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setVoiceId(voice.id)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] transition ${
                  voiceId === voice.id
                    ? voice.tabActive
                    : "border-ink-100/10 text-ink-500 hover:text-ink-200"
                }`}
              >
                <T v={voice.role} />
              </button>
            ))}
          </div>

          {/* selected question heading */}
          <h3 className="display mt-5 text-xl leading-snug text-ink-50 md:text-2xl">
            <T v={q.q} />
          </h3>

          {/* answer card */}
          <div
            key={`${qi}-${voiceId}`}
            className={`lang-fade mt-4 rounded-xl border ${activeVoice.border} bg-gradient-to-br ${activeVoice.bgFrom} to-transparent p-5`}
          >
            {/* voice label */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`label-mono ${activeVoice.textAccent}`}>
                <T v={activeVoice.role} />
              </span>
              <span className="text-ink-600">·</span>
              <span className="label-mono text-ink-500">
                <T v={activeVoice.blurb} />
              </span>
            </div>

            {/* answer body */}
            <p className="mt-3 font-serif text-base leading-relaxed text-ink-100 md:text-lg">
              <T v={q.answers[activeVoice.id]} />
            </p>
          </div>

          {/* epistemic footnote */}
          <p className="mt-4 text-xs leading-relaxed text-ink-500">
            {lang === "zh"
              ? "每条回答力求忠实于该视角的主流理解，公平呈现竞争性观点，并明确标注何处仍是开放问题或推测。六位声音意见一致处，是坚实的地基；意见分歧处——尤其是怀疑者发声时——才是真正的前沿。这是一部分析性伴读，为原创评论，不转述书中文本。"
              : "Each answer aims to be faithful to its perspective's mainstream understanding, to present competing views fairly, and to flag where questions remain genuinely open. Where the six voices agree, the ground is solid. Where they diverge — especially when the Skeptic speaks — that is the real debate. Original analytical commentary; no book text reproduced."}
          </p>
        </div>

      </div>
    </div>
  );
}
