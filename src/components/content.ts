import { Bi } from "./lang";

export type Panel = { t: Bi; d: Bi };

/* ═══════════════════════════════ THE TEN THEMES ═══════════════════════════════
   An ANALYTICAL COMPANION to Walter Isaacson's "Steve Jobs" (© 2011 Walter
   Isaacson / Simon & Schuster). Each section is original commentary and synthesis
   — a thematic map of the ideas that run through the biography, in our own words,
   with a fair, two-handed critical edge. This is a study guide, NOT the book; we
   distil and paraphrase, attribute throughout, and point readers to the source.
   id maps to a visualization in JobsEngine.tsx. */

export interface Section {
  num: string;
  id: string;
  kicker: Bi;
  title: Bi;
  sub: Bi;
  body: Bi;
  ask: Bi;
}

export const SECTIONS: Section[] = [
  {
    num: "01",
    id: "intersection",
    kicker: { en: "Theme I · the crossroads", zh: "主题一 · 十字路口" },
    title: { en: "Art × Technology", zh: "人文与科技的交汇" },
    sub: { en: "Standing where the liberal arts meet engineering", zh: "站在人文与工程相交之处" },
    body: {
      en: "Isaacson's whole portrait turns on one self-image Jobs returned to again and again: a person who stood at the intersection of the humanities and technology, and tried to live there. The biography traces the inputs — a dropped-in calligraphy class that later shaped the Mac's typography, a youth steeped in Bob Dylan and Zen practice and a 1970s counterculture that distrusted IBM-grey conformity, the Bauhaus and Braun design language he absorbed. The thesis the book builds from this is that Jobs's products felt different because they were made by someone who refused to treat technology and taste as separate departments. As analysis it is genuinely illuminating: it explains why a computer company obsessed over fonts, packaging and the curve of a corner. The companion adds the fair qualifier — 'intersection of art and tech' is also a flattering story a marketer tells, and Jobs was a peerless marketer; the biography mostly admires the self-image rather than interrogating it. We keep both in view.",
      zh: "艾萨克森的整幅画像，都围绕着乔布斯一再回到的一个自我形象：一个站在人文与科技交汇处、并试图在那里生活的人。传记追溯了那些输入——一堂旁听的书法课，后来塑造了麦金塔的字体排印；一段浸润于鲍勃·迪伦、禅修，以及一种不信任 IBM 式灰色顺从的 1970 年代反主流文化的青春；他所吸收的包豪斯与博朗的设计语言。本书由此建立的论点是：乔布斯的产品之所以感觉不同，是因为它们出自一个拒绝把技术与品味当作两个分开的部门的人。作为分析，这确实富有启发：它解释了一家电脑公司为何对字体、包装与一个边角的弧度如此痴迷。本解读补上公允的限定——『人文与科技的交汇』也是一个营销者讲述的、讨人喜欢的故事，而乔布斯是无与伦比的营销者；传记大多在赞许这个自我形象，而非审问它。两者，我们都保留在视野中。",
    },
    ask: { en: "Was the intersection a real place he lived — or the best brand story ever told?", zh: "那个交汇处，是他真正栖居的所在——还是有史以来最好的品牌故事？" },
  },
  {
    num: "02",
    id: "simplicity",
    kicker: { en: "Theme II · subtraction", zh: "主题二 · 做减法" },
    title: { en: "Simplicity & Design", zh: "简约与设计" },
    sub: { en: "'Design is not how it looks; it is how it works'", zh: "『设计不是它看起来如何，而是它如何运作』" },
    body: {
      en: "The book's most quoted creed is that simplicity is the ultimate sophistication — and, crucially, that simplicity is hard, won by deep understanding rather than by stripping things away superficially. Isaacson shows the practice behind the slogan: a Zen-trained instinct for the essential, a Bauhaus belief that good design is honest and unornamented, and a refusal to accept that complexity is the price of capability. The famous worked examples recur — one button where rivals had many, no manual needed, 'a thousand songs in your pocket' as the entire pitch. The deep, correct point the companion underlines is that real simplicity is the opposite of easy: it requires conquering the underlying complexity so thoroughly that the user never meets it. The honest caveat is that the same instinct, pushed to dogma, also produced closed systems, removed ports and buttons people wanted, and treated the designer's certainty as superior to the user's choice. Simplicity as mastery; simplicity as control — the biography mostly celebrates the first.",
      zh: "本书被引用最多的信条是：至繁归于至简——而关键在于，简约是困难的，靠的是深刻的理解，而非表面地把东西删掉。艾萨克森展示了口号背后的实践：一种受禅修训练的、对本质的直觉；一种『好的设计是诚实而不加装饰的』的包豪斯信念；以及一种拒绝接受『复杂是能力的代价』的态度。那些著名的范例反复出现——别家有许多按钮之处，它只有一个；无需说明书；『把一千首歌装进口袋』就是全部的推介。本解读要强调的那个深刻而正确的要点是：真正的简约，是『容易』的反面：它要求把底层的复杂如此彻底地征服，以至用户从不与之相遇。诚实的告诫是：同一种直觉，推成教条，也造出了封闭的系统，移除了人们想要的接口与按钮，并把设计师的笃定，置于用户的选择之上。作为精通的简约；作为控制的简约——传记大多在赞颂前者。",
    },
    ask: { en: "When the designer is sure, whose simplicity wins — the maker's or the user's?", zh: "当设计师笃定时，谁的简约胜出——制造者的，还是用户的？" },
  },
  {
    num: "03",
    id: "rdf",
    kicker: { en: "Theme III · bending reality", zh: "主题三 · 扭曲现实" },
    title: { en: "The Reality Distortion Field", zh: "现实扭曲力场" },
    sub: { en: "Willing the impossible — at a price others paid", zh: "意志逼出不可能——而代价由他人承受" },
    body: {
      en: "Coined by his own colleagues, the 'reality distortion field' is the biography's name for Jobs's ability to convince himself and everyone around him that the impossible was merely difficult and would be done — on his timeline. Isaacson treats it with real ambivalence, which is the right register. On one side it was a genuine engine of achievement: engineers shipped things they swore couldn't be built because Jobs refused to accept the constraint, and sometimes the constraint really was negotiable. On the other side it shaded into denial, manipulation, and a binary cruelty — people and ideas were 'the best thing ever' or 'total shit', sometimes within the same hour — and the field's most famous instance is the one it could not bend: a cancer that early alternative-medicine delay may have made worse. The companion's reading is that the RDF is the book's sharpest lesson and its sharpest warning at once: the same trait that bent the world also bruised the people in it, and a will that overrides reality is magnificent until it meets a reality that does not negotiate.",
      zh: "由他自己的同事所造，『现实扭曲力场』是传记为乔布斯一种能力所起的名字：让自己、也让周围所有人相信，不可能之事不过是困难、并且会被完成——按他的时间表。艾萨克森以一种真切的矛盾来对待它，而这正是恰当的语气。一面，它是一台真正的成就引擎：工程师交付出他们曾发誓造不出之物，只因乔布斯拒绝接受那约束，而有时，那约束确实可议。另一面，它滑向了否认、操纵，与一种二元的残酷——人与想法非是『有史以来最好』，便是『一堆狗屎』，有时就在同一小时之内——而力场最著名的一次显现，正是它无法扭曲的那一次：一场癌症，早期对替代疗法的拖延，或许使其更糟。本解读认为：现实扭曲力场，同时是本书最锋利的教益，与最锋利的警示：那扭曲了世界的同一种特质，也擦伤了世界中的人；而一个凌驾于现实之上的意志，是壮丽的——直到它遇上一个不讨价还价的现实。",
    },
    ask: { en: "If the same will both ships the impossible and wounds people, can you keep one half?", zh: "若同一种意志，既交付了不可能、也伤害了人，你能否只留下其中一半？" },
  },
  {
    num: "04",
    id: "integration",
    kicker: { en: "Theme IV · the whole widget", zh: "主题四 · 整体产品" },
    title: { en: "Controlling the Whole Widget", zh: "掌控整体产品" },
    sub: { en: "Hardware, software and experience, end to end", zh: "硬件、软件与体验，端到端" },
    body: {
      en: "A through-line of the whole life is the conviction that to guarantee a great experience you must own the entire stack — hardware, software, and increasingly the content and the store — rather than let a 'committee' of separate companies assemble a compromise. Isaacson frames this as the deep philosophical fault line between Jobs and the open-licensing world of Microsoft and the PC clones: Jobs would rather control a smaller, perfect whole than license a larger, messier ecosystem. The biography's clearest illustration is the contrast between the patched-together music phones that preceded the iPhone and the iPhone itself, where one company tuned hardware, software and the store as a single object. As analysis this explains an enormous amount about why Apple's products felt seamless and why Jobs distrusted modularity. The fair counter the companion keeps visible: integration is also a synonym for the closed, the locked-down, and the controlled — the walled garden delivers polish and also gatekeeping, and the open systems he disdained are what much of the world actually runs on.",
      zh: "贯穿其一生的一条线索，是这样一个信念：要保证一种卓越的体验，你必须拥有整个堆栈——硬件、软件，以及越来越多的内容与商店——而非任由一个由不同公司组成的『委员会』，拼凑出一个妥协。艾萨克森把它框定为乔布斯，与微软及 PC 兼容机那个开放授权世界之间，那道深刻的哲学断层线：乔布斯宁愿掌控一个更小、完美的整体，也不愿去授权一个更大、更杂乱的生态。本书最清晰的例证，是 iPhone 之前那些拼凑而成的音乐手机，与 iPhone 本身之间的对比——后者，由一家公司把硬件、软件与商店，当作单一的对象来调校。作为分析，这极大地解释了，为何苹果的产品感觉如此无缝，以及乔布斯为何不信任模块化。本解读始终保留可见的那个公允的反面是：整合，也是封闭、被锁定、被控制的同义词——围墙花园，既递送精致，也递送守门；而他所鄙夷的开放系统，正是世界大部分实际运行所依赖的。",
    },
    ask: { en: "Is a seamless walled garden a gift to the user — or a leash?", zh: "一座无缝的围墙花园，是给用户的礼物——还是一根牵绳？" },
  },
  {
    num: "05",
    id: "focus",
    kicker: { en: "Theme V · saying no", zh: "主题五 · 说不" },
    title: { en: "Focus & the Power of No", zh: "专注与『说不』的力量" },
    sub: { en: "Deciding what not to do is the real decision", zh: "决定不做什么，才是真正的决定" },
    body: {
      en: "When Jobs returned to a near-bankrupt Apple in 1997, the biography's most instructive set-piece is not a product but a deletion: he drew a two-by-two grid — consumer and pro, desktop and portable — and cancelled almost everything that didn't fit four boxes. Isaacson uses this to crystallise a creed Jobs repeated for the rest of his life: focus means saying no to a thousand good ideas so that a few can be great; innovation is as much about what you leave out as what you put in. As management analysis this is unusually clean and unusually correct — it explains the turnaround better than any single product, and it is the lesson most transferable to anyone who isn't a design genius. The companion's only caveat is scale-dependence: ruthless focus is a superpower for a founder who can hold the whole vision in one head, and a liability when imposed as dogma on domains, people, or markets that genuinely need breadth. The art is knowing which kind of problem you have.",
      zh: "当乔布斯在 1997 年回到濒临破产的苹果，传记中最具教益的一幕，并非一款产品，而是一次删除：他画了一个二乘二的方格——消费级与专业级、台式与便携——并取消了几乎一切不落入那四个格子之物。艾萨克森借此把乔布斯余生反复重申的一条信条结晶出来：专注，意味着对一千个好主意说不，好让少数几个变得伟大；创新，既关乎你放进什么，也同样关乎你略去什么。作为管理分析，这异乎寻常地干净、也异乎寻常地正确——它比任何单一产品都更好地解释了那场扭转，且是最可迁移给『并非设计天才』的任何人的教益。本解读唯一的告诫，是它对尺度的依赖：无情的专注，对一个能把整幅愿景装进一颗头脑的创始人是超能力，而当它作为教条，被强加于那些确实需要广度的领域、人或市场时，便成了负债。其艺术，在于知道你手上是哪一种问题。",
    },
    ask: { en: "Focus is power for a genius founder — what is it for everyone else who copies it?", zh: "专注，对天才创始人是力量——对其余照搬它的所有人，又是什么？" },
  },
  {
    num: "06",
    id: "products",
    kicker: { en: "Theme VI · the creed", zh: "主题六 · 信条" },
    title: { en: "Products Over Profits", zh: "产品高于利润" },
    sub: { en: "Make something great; the money follows", zh: "造出伟大之物；钱随之而来" },
    body: {
      en: "A recurring contrast in the book is between two kinds of company: one where product people run the show, and one where, once it has a monopoly, the sales-and-finance people take over and the product slowly rots. Jobs's stated creed — which Isaacson treats as central to the 1997 revival — is that if you make insanely great products, the profits follow, but if you chase the profits first, the products and eventually the profits decay. The biography extends this to the idea that the company itself, and its enduring culture, was Jobs's greatest product — the thing meant to keep making great things after him. As analysis this is a genuine and somewhat unfashionable corrective to a finance-first orthodoxy, and Apple's trajectory is strong evidence for it. The companion notes two honest tensions the book underplays: 'products first' was practised by a man whose company became the most valuable on earth, so it is also a winner's story; and the creed coexisted, uncomfortably, with hard-edged decisions about price, labour and supply that a pure product-romance leaves out.",
      zh: "本书中一个反复出现的对比，是两种公司之间的：一种由产品的人主事；另一种，一旦拥有了垄断，销售与财务的人便接管，而产品慢慢腐烂。乔布斯所申明的信条——艾萨克森视之为 1997 年复兴的核心——是：若你造出极其伟大的产品，利润随之而来；但若你先追逐利润，产品、以及最终的利润，都会衰败。传记把这一点延伸为这样一个想法：公司本身，及其持久的文化，是乔布斯最伟大的产品——那个被设计来在他身后继续造出伟大之物的东西。作为分析，这是对一种『财务优先』正统的、真切而略显不合时宜的纠偏，而苹果的轨迹，是支持它的有力证据。本解读指出本书轻描淡写的两处诚实张力：『产品优先』，是由一个其公司成为地球上最有价值者的人所践行的，因此它也是一个赢家的故事；而这一信条，与那些关于价格、劳工与供应链的、棱角分明的决定，不无别扭地共存着——而一段纯粹的产品浪漫，把后者略去了。",
    },
    ask: { en: "Is 'products first' a universal law — or the story winners tell after they've won?", zh: "『产品优先』是一条普适的定律——还是赢家在赢了之后所讲的故事？" },
  },
  {
    num: "07",
    id: "arc",
    kicker: { en: "Theme VII · fall & return", zh: "主题七 · 坠落与归来" },
    title: { en: "The Arc", zh: "那道弧线" },
    sub: { en: "1976 → exile in 1985 → the wilderness → 1997 return", zh: "1976 → 1985 被逐 → 荒野 → 1997 归来" },
    body: {
      en: "The biography's narrative spine is a near-mythic three-act shape: the brash founding of Apple in 1976 and the triumph of the Macintosh; the humiliating ouster in 1985 from the company he created; a twelve-year wilderness building NeXT (a commercial failure that became technically vital) and buying a small graphics outfit that became Pixar (an improbable triumph); and the 1997 return to an Apple ninety days from bankruptcy, which he rebuilt into the most valuable company on earth. Isaacson's claim — and it is persuasive — is that the wilderness was not a detour but the making of him: the arrogance of the first act was tempered by failure into the focus and partnership of the third. As analysis the fall-and-return is the book's most resonant structure and its most useful, because it reframes catastrophic failure as potential raw material. The companion's caution is the survivorship one: most people fired from their own companies do not return to build the world's most valuable one, and the myth is easier to admire than to live.",
      zh: "传记的叙事脊柱，是一个近乎神话的三幕形状：1976 年苹果那场莽撞的创立，与麦金塔的凯旋；1985 年，从他亲手创造的公司中、那场羞辱性的被逐；一段十二年的荒野——建造 NeXT（一次商业失败，却成为技术上至关重要者），并买下一家小小的图形公司，使其成为皮克斯（一次不大可能的凯旋）；以及 1997 年，回到一家距破产九十天的苹果，并把它重建为地球上最有价值的公司。艾萨克森的主张——而它很有说服力——是：那段荒野并非弯路，而是成就了他：第一幕的傲慢，被失败淬炼为第三幕的专注与合作。作为分析，坠落与归来，是本书最具回响的结构，也是最有用的，因为它把灾难性的失败，重新框定为潜在的原材料。本解读的告诫，是那个幸存性的告诫：多数被自己公司开除的人，并不会回来建造世界上最有价值的那一家，而那神话，欣赏起来，比活出来要容易。",
    },
    ask: { en: "The wilderness made him — but how many wildernesses simply end in the wilderness?", zh: "荒野成就了他——但有多少荒野，只是终结于荒野？" },
  },
  {
    num: "08",
    id: "taste",
    kicker: { en: "Theme VIII · craft", zh: "主题八 · 匠艺" },
    title: { en: "Taste, Craft & Perfection", zh: "品味、匠艺与完美" },
    sub: { en: "Caring about the parts no one sees", zh: "在意那些无人看见的部分" },
    body: {
      en: "A small story the biography returns to as a parable: Jobs's adoptive father taught him to build the back of a fence, or the inside of a cabinet, as carefully as the front — because a true craftsman cares about the parts no one will see. Isaacson uses this to explain a perfectionism that extended to the circuit boards inside the Macintosh, the unseen interior architecture of products, the curve of an on-screen rounded rectangle. The creed has a twin: 'real artists ship' — taste without the discipline to finish and deliver is mere aesthetics. As analysis, taste-as-craft is a serious and teachable idea: caring about the invisible is what separates a product from a thing, and Jobs's insistence that taste can be cultivated (he thought most of tech had 'no taste') is a useful provocation. The companion holds the cost in frame: the same perfectionism produced abusive standards, missed deadlines, parts re-done at ruinous expense, and a habit of claiming others' ideas as his own once they passed his taste — craft and cruelty, again, braided together.",
      zh: "传记当作寓言一再回到的一个小故事：乔布斯的养父教他，把一道篱笆的背面、或一个柜子的内里，造得与正面一样仔细——因为真正的匠人，在意那些无人会看见的部分。艾萨克森借此解释一种完美主义：它延伸到麦金塔内部的电路板、产品看不见的内部架构、屏幕上一个圆角矩形的弧度。这信条有一个孪生：『真正的艺术家准时交付』——没有完成与交付之纪律的品味，不过是美学。作为分析，作为匠艺的品味，是一个严肃而可教的想法：在意那不可见者，正是把一件产品与一个物件区分开来之物，而乔布斯坚持品味可被培养（他认为科技界大多『没有品味』），是一个有用的挑衅。本解读把代价保留在视野中：同一种完美主义，造出了苛虐的标准、错过的截止期、以毁灭性代价返工的零件，以及一种习惯——一旦他人的想法通过了他的品味，便据为己有——匠艺与残酷，再一次，被编织在一起。",
    },
    ask: { en: "Caring about the unseen made the products — did it have to break the people?", zh: "在意那不可见者，成就了产品——但它非得碾碎那些人吗？" },
  },
  {
    num: "09",
    id: "legacy",
    kicker: { en: "Theme IX · the dent", zh: "主题九 · 那道印记" },
    title: { en: "A Dent in the Universe", zh: "在宇宙中留下一道印记" },
    sub: { en: "Six industries, mortality, and what he left", zh: "六个产业、死亡，与他所留下的" },
    body: {
      en: "The biography closes on legacy, and is unusual in that its subject narrated his own — Jobs cooperated fully and then refused to read it, wanting his children to one day understand him. Isaacson's accounting is concrete: across one life Jobs reshaped at least six industries — personal computers, animated film, music, phones, tablets, and digital publishing — a range almost no one matches. The deeper legacy the book argues for is the conviction Jobs voiced to the young: that the world was built by people no smarter than you, that you can change it, and that you should live as though you will not get another life to spend. The final chapters handle his illness and death with restraint, and they are where the admiring tone earns its keep — there is grief, not hagiography. The companion's note is that legacy is the chapter most shaped by proximity: a portrait built from forty interviews with a dying man and those who loved or feared him is intimate and partial at once, and the most honest reading holds the dent and the damage in the same hand.",
      zh: "传记以『遗产』收尾，且不寻常之处在于：它的主人公讲述了他自己的遗产——乔布斯全面配合，而后拒绝阅读它，他想让自己的孩子有朝一日理解他。艾萨克森的清点是具体的：在一生之中，乔布斯重塑了至少六个产业——个人电脑、动画电影、音乐、手机、平板与数字出版——一种几乎无人能及的跨度。本书所论证的更深的遗产，是乔布斯对年轻人所道出的那个信念：世界，是由并不比你更聪明的人所建造的；你能够改变它；而你应当像『不会再有另一生可供挥霍』那样去活。最后几章，以克制处理他的病与死，而正是在那里，那赞许的语气，挣得了它的位置——那里有悲恸，而非圣徒传。本解读的注脚是：遗产，是最被『距离之近』所塑造的一章：一幅由与一个垂死之人、及那些爱他或惧他者的四十次访谈所建成的画像，同时是亲密的与片面的；而最诚实的读法，把那道印记，与那份伤害，握在同一只手中。",
    },
    ask: { en: "He left a dent and a wound — does the world get to keep one without the other?", zh: "他留下了一道印记，也留下了一道伤口——世界能否只留其一？" },
  },
  {
    num: "10",
    id: "synthesis",
    kicker: { en: "Synthesis · the method", zh: "综合 · 方法" },
    title: { en: "The Jobs Method", zh: "乔布斯方法" },
    sub: { en: "What the themes are, read as one machine", zh: "把诸主题当作一台机器来读" },
    body: {
      en: "Read whole, the biography is an attempt to answer one question: were the brilliance and the brutality two things, or one? The themes compose into something like a method. The intersection of art and technology sets the ambition; simplicity and taste set the standard; focus decides what not to build; integration guarantees the experience; the reality distortion field supplies the will to force it into existence; and a products-first creed, carried by a culture meant to outlast him, keeps the engine running. The pieces reinforce each other — which is why the book reads as a system, not a list of habits. The companion's closing position is deliberately two-handed, and it is Isaacson's own unresolved verdict made explicit: the same intensity that produced the products produced the cruelty, and the honest reader cannot cleanly separate them. Take the method — the standard, the focus, the care for the unseen, the refusal of false constraints — and leave the binary contempt and the wounds. Admire the dent in the universe; do not romanticise what it cost the people standing closest.",
      zh: "整体读来，传记是对一个问题的解答尝试：那才华与那残暴，是两件事，还是一件事？诸主题，组合成某种近似方法之物。人文与科技的交汇，设定了野心；简约与品味，设定了标准；专注，决定了不去建造什么；整合，保证了体验；现实扭曲力场，提供了把它逼入存在的意志；而一种产品优先的信条，由一个被设计来比他活得更久的文化所承载，使引擎持续运转。这些部件彼此强化——这正是本书读起来像一套系统、而非一列习惯的原因。本解读的收尾立场，刻意是两手并存的，而它正是艾萨克森自己那个悬而未决的裁决、被明说出来：那造出产品的同一种强度，也造出了残酷，而诚实的读者，无法把它们干净地分开。取走那方法——那标准、那专注、那对不可见者的在意、那对虚假约束的拒绝——而留下那二元的蔑视与那些伤害。赞叹那在宇宙中的印记；但不要把它对那些站得最近的人所付出的代价，浪漫化。",
    },
    ask: { en: "Were the brilliance and the brutality one thing — and can you keep the first without the second?", zh: "那才华与那残暴，是同一件事吗——而你能否只留前者，不留后者？" },
  },
];

/* ─────────────────────── concept panels (products-over-profits) ─────────────────── */

export const PANELS: Record<string, Panel[]> = {
  products: [
    {
      t: { en: "Product people vs bean-counters", zh: "产品的人 vs 算账的人" },
      d: { en: "The book's recurring warning: once a monopoly lets sales-and-finance take over from product people, the product quietly rots — and the profits eventually follow it down.", zh: "本书反复出现的警示：一旦垄断让销售与财务的人，从产品的人手中接管，产品便悄悄腐烂——而利润，最终随之而下。" },
    },
    {
      t: { en: "The company as the product", zh: "公司即产品" },
      d: { en: "Jobs's most enduring creation, the biography argues, was a company and a culture engineered to keep making great things after he was gone.", zh: "传记论证道，乔布斯最持久的创造，是一家公司、一种文化——被设计来在他离去后，继续造出伟大之物。" },
    },
    {
      t: { en: "Make it, the money follows", zh: "造出它，钱随之而来" },
      d: { en: "Chase insanely great products and profit follows; chase profit first and both decay. A real corrective — though also, honestly, a story told by the winner.", zh: "追逐极其伟大的产品，利润随之而来；先追逐利润，二者皆衰。一种真切的纠偏——尽管，老实说，也是一个由赢家讲述的故事。" },
    },
    {
      t: { en: "The presentation is the product too", zh: "发布会也是产品" },
      d: { en: "Jobs treated the keynote as a designed object — the reveal, the one-more-thing, the live demo — because how a product enters the world shapes what it means.", zh: "乔布斯把主题演讲当作一件被设计的对象——那揭幕、那『还有一件事』、那现场演示——因为一款产品如何进入世界，塑造了它意味着什么。" },
    },
    {
      t: { en: "Price, labour & supply", zh: "价格、劳工与供应链" },
      d: { en: "The honest footnote the romance omits: 'products first' coexisted with hard, contested decisions about pricing, manufacturing and the supply chain behind the magic.", zh: "那浪漫所略去的诚实脚注：『产品优先』，与那些关于定价、制造，以及魔法背后供应链的、艰难而有争议的决定，共存着。" },
    },
    {
      t: { en: "The most valuable company", zh: "最有价值的公司" },
      d: { en: "The creed's strongest evidence and its biggest caveat are the same fact: practised by Jobs, it built the most valuable company on earth — which makes it both proven and survivor-told.", zh: "这信条最有力的证据，与它最大的告诫，是同一个事实：由乔布斯践行，它建起了地球上最有价值的公司——这使它既被证明，又出自幸存者之口。" },
    },
  ],
};
