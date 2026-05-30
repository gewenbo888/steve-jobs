"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "./lang";

/* ─── types ──────────────────────────────────────────────────────── */
type NodeKind = "crisis" | "launch" | "win" | "return" | "milestone" | "farewell";

interface JobsMilestone {
  year: number | string;
  label: { en: string; zh: string };
  title: { en: string; zh: string };
  significance: { en: string; zh: string };
  detail: { en: string; zh: string };
  kind: NodeKind;
  product?: { en: string; zh: string };
}

/* ─── helpers ─────────────────────────────────────────────────────── */
function L(lang: "en" | "zh", en: string, zh: string): string {
  return lang === "zh" ? zh : en;
}

/* ─── palette by node kind ───────────────────────────────────────── */
const KIND_COLOR: Record<NodeKind, string> = {
  launch:    "#2997ff",   // flux-500 Apple-blue — product launches
  win:       "#61bb46",   // leaf-500 green — returns, vindications
  crisis:    "#ff5e5b",   // plasm-500 coral-red — 1985 ouster, 1997 near-bankruptcy
  return:    "#61bb46",   // leaf-500 green — comeback / return arc
  milestone: "#a1a1a6",   // steel-500 silver — operational milestones
  farewell:  "#f6a623",   // gold-500 amber — dignified departure
};

const KIND_LABEL: { en: Record<NodeKind, string>; zh: Record<NodeKind, string> } = {
  en: {
    launch:    "LAUNCH",
    win:       "WIN",
    crisis:    "CRISIS",
    return:    "RETURN",
    milestone: "MILESTONE",
    farewell:  "LEGACY",
  },
  zh: {
    launch:    "发布",
    win:       "胜利",
    crisis:    "危机",
    return:    "回归",
    milestone: "里程碑",
    farewell:  "传承",
  },
};

/* ─── rainbow stripe for Apple icon ─────────────────────────────── */
// The 1977 six-stripe Apple rainbow — only used on the Apple I / II nodes as a nod to origin
const RAINBOW_STRIPE = "linear-gradient(180deg, #61bb46 0%, #f6a623 20%, #ff5e5b 40%, #e0433f 56%, #a663cc 76%, #2997ff 100%)";

/* ─── chronology data ────────────────────────────────────────────── */
const MILESTONES: JobsMilestone[] = [
  {
    year: 1976,
    label: { en: "Apple founded", zh: "创立苹果" },
    title: { en: "Apple Computer founded · Apple I", zh: "苹果电脑公司创立 · Apple I" },
    significance: { en: "Jobs and Wozniak turn a garage board into the first personal-computer company.", zh: "乔布斯与沃兹尼亚克将车库里的电路板变成第一家个人电脑公司。" },
    detail: {
      en: "On April 1, 1976, Steve Jobs, Steve Wozniak, and Ronald Wayne sign the partnership documents that create Apple Computer. The Apple I — designed entirely by Wozniak — is a hand-built circuit board sold for $666.66. Jobs supplies the vision the hardware alone lacks: a distribution strategy, a price point, and the conviction that the machine should reach ordinary people, not just hobbyists. Wayne sells his 10 percent stake weeks later for $800. It is the founding gesture of a company that will define personal computing.",
      zh: "1976年4月1日，史蒂夫·乔布斯、史蒂夫·沃兹尼亚克与罗纳德·韦恩签署合伙协议，创立苹果电脑公司。Apple I完全由沃兹尼亚克设计，是一块手工组装的电路板，售价666.66美元。乔布斯为单纯的硬件注入了它本身所缺乏的愿景：分销策略、价格定位，以及这台机器应当面向普通大众而非仅面向爱好者的信念。韦恩数周后以800美元出售了自己10%的股份。这是一家将定义个人计算的公司的创立手势。",
    },
    kind: "milestone",
    product: { en: "Apple I", zh: "Apple I" },
  },
  {
    year: 1977,
    label: { en: "Apple II", zh: "Apple II" },
    title: { en: "Apple II — the breakthrough personal computer", zh: "Apple II——突破性的个人电脑" },
    significance: { en: "The first mass-market personal computer with color graphics; it makes Apple real.", zh: "首款带彩色图形的大众市场个人电脑，让苹果成为真正的公司。" },
    detail: {
      en: "The Apple II launches at the first West Coast Computer Faire in April 1977. Unlike the Apple I, it arrives in a designed beige plastic case — Jobs insists on the enclosure because he understands the computer must not frighten people. It ships with a color graphics display, BASIC in ROM, a keyboard, and expansion slots. The spreadsheet VisiCalc, released in 1979, turns it into a business tool and drives mass adoption. Apple's revenue grows from $774,000 in 1977 to $334 million by 1981. The Apple II funds everything that follows.",
      zh: "Apple II于1977年4月首届西海岸计算机展会发布。与Apple I不同，它配有精心设计的米色塑料外壳——乔布斯坚持做机箱，因为他明白这台机器不能让人感到恐惧。它附带彩色显示器、固化于ROM中的BASIC、键盘和扩展插槽。1979年发布的电子表格软件VisiCalc将其变成商业工具，推动大规模普及。苹果营收从1977年的77.4万美元增长至1981年的3.34亿美元。Apple II资助了此后的一切。",
    },
    kind: "launch",
    product: { en: "Apple II", zh: "Apple II" },
  },
  {
    year: 1980,
    label: { en: "Apple IPO", zh: "苹果上市" },
    title: { en: "Apple IPO — largest US IPO since Ford in 1956", zh: "苹果IPO——1956年福特以来美国最大IPO" },
    significance: { en: "300 millionaires created overnight; Jobs is 25.", zh: "一夜之间造就300位百万富翁；乔布斯25岁。" },
    detail: {
      en: "On December 12, 1980, Apple goes public at $22 per share. The IPO raises $101 million and is oversubscribed — the largest American IPO since Ford Motor Company in 1956. Jobs's 15 percent stake is worth approximately $256 million on day one. The float creates around 300 millionaires among Apple employees and early investors. Jobs is twenty-five years old. The event is not merely financial: it proves that personal computing is not a hobbyist movement but an industry, and that a college dropout from Los Altos can build one.",
      zh: "1980年12月12日，苹果以每股22美元上市。IPO募资1.01亿美元并获超额认购——这是自1956年福特汽车以来美国最大规模的IPO。乔布斯持有的15%股份在首日估值约2.56亿美元。此次上市在苹果员工和早期投资者中造就约300位百万富翁。彼时乔布斯25岁。这一事件的意义不仅在于财务：它证明个人计算不是爱好者运动而是一个产业，一个来自洛斯阿尔托斯的大学辍学生可以建立这样一个产业。",
    },
    kind: "win",
    product: { en: "Apple", zh: "苹果" },
  },
  {
    year: 1983,
    label: { en: "Lisa · sidelined", zh: "Lisa · 出局" },
    title: { en: "Apple Lisa — commercial failure; Jobs forced off the project", zh: "Apple Lisa——商业失败；乔布斯被逐出项目" },
    significance: { en: "The GUI computer nobody could afford; internal exile plants the seeds of the Mac.", zh: "没人买得起的图形界面电脑；内部流放埋下Mac的种子。" },
    detail: {
      en: "The Lisa launches in January 1983 at $9,995 — approximately $31,000 in 2024 dollars. It is the first commercial personal computer to ship with a graphical user interface and a mouse, but the price kills it. Sales are negligible. Jobs, who had championed the Xerox PARC GUI concept after a famous visit in 1979, had already been pushed off the Lisa project by Apple's management — notably by board member Mike Markkula and CEO Mike Scott — as the company grew and Jobs's management style created friction. Exiled to the Macintosh skunkworks team, he redirects his energy. The Lisa's failure becomes the Mac's mandate.",
      zh: "Lisa于1983年1月发布，售价9995美元——折合2024年约3.1万美元。它是首款随附图形用户界面和鼠标的商用个人电脑，但价格断送了它的市场。销量微乎其微。乔布斯曾在1979年著名的参观之后大力推广施乐PARC的图形界面理念，但随着公司扩大、他的管理风格引发摩擦，他已被苹果管理层——尤其是董事会成员迈克·马库拉和CEO迈克·斯科特——逐出Lisa项目。被放逐至Macintosh小分队后，他将精力重新导向。Lisa的失败成为Mac的使命。",
    },
    kind: "milestone",
    product: { en: "Lisa", zh: "Lisa" },
  },
  {
    year: 1984,
    label: { en: "Macintosh", zh: "麦金塔" },
    title: { en: "Macintosh launches — the '1984' ad airs once during the Super Bowl", zh: "Macintosh发布——\"1984\"广告在超级碗仅播出一次" },
    significance: { en: "The computer for the rest of us; Jobs defines the product launch as theatre.", zh: "属于大众的电脑；乔布斯将产品发布定义为一种剧场艺术。" },
    detail: {
      en: "On January 24, 1984, Jobs walks on stage at the Flint Center in Cupertino and pulls a Macintosh from a bag. It speaks its own name. The audience is stunned. Two days earlier, the Ridley Scott-directed '1984' commercial — Apple's rebuttal to IBM — had aired once during Super Bowl XVIII and never again. The Mac ships at $2,495 with a 128K memory and a 9-inch screen. It is the first mass-market computer with a bitmapped GUI and mouse. Sales disappoint in the second half of 1984 and Jobs and Sculley's relationship deteriorates. But the Mac's design language — the mouse, the desktop metaphor, pull-down menus — defines personal computing for the next four decades.",
      zh: "1984年1月24日，乔布斯走上库比蒂诺弗林特中心的舞台，从袋子里取出一台Macintosh。它用自己的声音说出了自己的名字。观众震惊了。两天前，雷德利·斯科特执导的\"1984\"广告——苹果对IBM的反击——在第XVIII届超级碗播出一次，此后再未播出。Mac以2495美元发售，配备128K内存和9英寸屏幕。它是首款搭载位图图形界面和鼠标的大众市场电脑。1984年下半年销量令人失望，乔布斯与斯卡利的关系持续恶化。但Mac的设计语言——鼠标、桌面隐喻、下拉菜单——定义了此后四十年的个人计算。",
    },
    kind: "launch",
    product: { en: "Macintosh", zh: "Macintosh" },
  },
  {
    year: 1985,
    label: { en: "Ousted", zh: "出局" },
    title: { en: "Ousted from Apple — power struggle with CEO John Sculley", zh: "被逐出苹果——与CEO约翰·斯卡利的权力角力" },
    significance: { en: "The low point. Jobs is thirty. He loses the company he built.", zh: "最低谷。乔布斯三十岁。他失去了自己亲手建立的公司。" },
    detail: {
      en: "By the spring of 1985, the Macintosh is underselling and the company is in crisis. Jobs recruits PepsiCo CEO John Sculley to Apple in 1983 with the line, 'Do you want to sell sugared water for the rest of your life, or do you want to come with me and change the world?' By 1985 they are at war. Sculley, backed by the Apple board, strips Jobs of his operational responsibilities in May. Jobs attempts a boardroom coup to oust Sculley — it fails. In September, he resigns from Apple and sells all but one of his Apple shares. He is thirty years old. The company he co-founded has shown him the door. Walter Isaacson's biography records Jobs calling it the best thing that could have happened: 'The heaviness of being successful was replaced by the lightness of being a beginner again.'",
      zh: "1985年春，Macintosh销量低迷，公司陷入危机。乔布斯1983年用一句\"你是想卖一辈子糖水，还是想跟我一起改变世界？\"将百事可乐CEO约翰·斯卡利招募至苹果。到1985年，两人已陷入对峙。斯卡利在苹果董事会支持下于5月解除乔布斯的运营职权。乔布斯试图发动董事会政变驱逐斯卡利——失败。9月，他从苹果辞职并出售了几乎全部苹果股份。他三十岁。他联合创立的公司将他扫地出门。沃尔特·艾萨克森的传记记载乔布斯称这是可能发生在他身上的最好的事：'成功的沉重感被重新成为初学者的轻盈感所取代。'",
    },
    kind: "crisis",
    product: { en: "Apple / Crisis", zh: "苹果 / 危机" },
  },
  {
    year: "1985–86",
    label: { en: "NeXT · Pixar", zh: "NeXT · 皮克斯" },
    title: { en: "Founds NeXT · buys Lucasfilm graphics group → Pixar", zh: "创立NeXT · 收购卢卡斯影业图形部门→皮克斯" },
    significance: { en: "The wilderness years begin — and produce two instruments that change everything.", zh: "荒野年代开始——并锻造出改变一切的两件利器。" },
    detail: {
      en: "In September 1985, Jobs founds NeXT Inc. with five colleagues from Apple. He invests $7 million of his own money. NeXT's mission is to build a powerful workstation for higher education. The machine — a magnesium cube — is elegant, expensive, and commercially marginal. But its software stack, including the Objective-C frameworks and the Unix-based operating system, will prove crucial when Apple later buys the company. In early 1986, Jobs pays $10 million to George Lucas's Lucasfilm to purchase its computer graphics division. He renames it Pixar. He does not know yet what it will become. The two investments are made in parallel, from the same pool of capital, with different theories of what computing and storytelling might do.",
      zh: "1985年9月，乔布斯与五位苹果同事创立NeXT公司，自掏700万美元。NeXT的使命是为高等教育打造强大的工作站。这台机器——一个镁合金立方体——优雅、昂贵且商业边际效益微薄。但其软件栈，包括Objective-C框架和基于Unix的操作系统，在苹果日后收购该公司时将被证明至关重要。1986年初，乔布斯以1000万美元向乔治·卢卡斯的卢卡斯影业购入其电脑图形部门，将其更名为皮克斯。他当时尚不知它将成为什么。两项投资并行进行，来自同一资本池，基于对计算与叙事可能实现的事物的不同设想。",
    },
    kind: "milestone",
    product: { en: "NeXT · Pixar", zh: "NeXT · 皮克斯" },
  },
  {
    year: 1995,
    label: { en: "Toy Story · IPO", zh: "玩具总动员 · 上市" },
    title: { en: "Pixar's Toy Story — first fully CG feature · Pixar IPO", zh: "皮克斯《玩具总动员》——首部全CG长片 · 皮克斯上市" },
    significance: { en: "The wilderness years produce a cultural monument; Pixar IPO makes Jobs a billionaire again.", zh: "荒野年代孕育出一座文化丰碑；皮克斯上市让乔布斯再度成为亿万富翁。" },
    detail: {
      en: "On November 22, 1995, Toy Story opens in theaters. It is the first feature film made entirely with computer-generated imagery — a collaboration between Pixar and Disney under John Lasseter's direction. It earns $362 million worldwide and becomes the highest-grossing film of 1995. Three days later, Pixar goes public at $22 per share; the stock doubles on day one. Jobs holds 80 percent of Pixar, making his stake worth approximately $1.2 billion. The man who was pushed out of Apple ten years earlier is now worth more than the company that ousted him. Pixar had nearly been sold several times during the intervening decade — to Microsoft, Hasbro, and others. Jobs had kept it alive.",
      zh: "1995年11月22日，《玩具总动员》在院线上映。这是首部完全由计算机生成图像制作的长片——皮克斯与迪士尼在约翰·拉塞特执导下共同创作。影片全球票房3.62亿美元，成为1995年票房最高的电影。三天后，皮克斯以每股22美元上市，首日股价翻番。乔布斯持有皮克斯80%的股份，使其持股市值约12亿美元。那个十年前被苹果赶出门的人，如今的身价已超过驱逐他的公司。在这十年间，皮克斯几乎曾多次被出售——给微软、孩之宝等——乔布斯使它存活了下来。",
    },
    kind: "win",
    product: { en: "Pixar", zh: "皮克斯" },
  },
  {
    year: "1996–97",
    label: { en: "Apple buys NeXT", zh: "苹果收购NeXT" },
    title: { en: "Apple acquires NeXT for $427M — Apple is 90 days from bankruptcy", zh: "苹果4.27亿美元收购NeXT——苹果距破产仅剩90天" },
    significance: { en: "The exile returns through the back door; Apple's survival depends on the software he built in the wilderness.", zh: "流放者从后门归来；苹果的存亡取决于他在荒野中造就的软件。" },
    detail: {
      en: "In late 1996, Apple — having lost $1.6 billion over the previous two years and with its market share collapsing — acquires NeXT Computer for $427 million. Gil Amelio, Apple's CEO, wants NeXT's operating system as the foundation for a new Mac OS. Jobs returns as an advisor. In July 1997, the Apple board removes Amelio. Jobs takes on the title of interim CEO — iCEO, he calls it, not knowing how long he will stay. Apple has roughly 90 days of cash reserves left. The wilderness had not been a detour: it had been a laboratory. NeXT's Unix-based operating system becomes the foundation of every Apple product for the next three decades.",
      zh: "1996年底，苹果——过去两年亏损16亿美元、市场份额持续下滑——以4.27亿美元收购NeXT电脑。苹果CEO吉尔·阿梅利奥希望用NeXT的操作系统作为新Mac OS的基础。乔布斯以顾问身份回归。1997年7月，苹果董事会免去阿梅利奥职务。乔布斯以临时CEO——他称之为iCEO——的身份接掌，不知道自己会留多久。苹果大约只剩90天的现金储备。荒野并非弯路：它是一个实验室。NeXT基于Unix的操作系统成为此后三十年每一款苹果产品的基础。",
    },
    kind: "crisis",
    product: { en: "NeXT → Apple", zh: "NeXT → 苹果" },
  },
  {
    year: 1997,
    label: { en: "Think Different", zh: "非同凡想" },
    title: { en: "Interim CEO · 'Think Different' campaign · Microsoft invests $150M", zh: "临时CEO · \"非同凡想\"运动 · 微软投资1.5亿美元" },
    significance: { en: "He doesn't save the company with a product — he saves it first with a story.", zh: "他不是用产品拯救了公司——他先用一个故事拯救了它。" },
    detail: {
      en: "Jobs returns and immediately begins cutting: he kills all but four product lines, eliminates the clone licensing program, and ends dozens of projects. But the first move is not operational — it is narrative. The 'Think Different' campaign, created with TBWA\\Chiat\\Day, launches in September 1997. It names Einstein, Gandhi, Picasso, Amelia Earhart, and others as Apple's spiritual antecedents. It is an act of brand restoration before a single new product ships. In August, Jobs strikes a deal with Bill Gates: Microsoft invests $150 million in Apple and commits to developing Microsoft Office for the Mac for five years. The Macworld announcement — Gates appearing on a giant screen while Jobs stands below — is a moment of strategic humility that saves Apple's credibility with enterprise buyers.",
      zh: "乔布斯回归后立刻开始削减：他将产品线砍至仅剩四条，终止克隆机授权计划，砍掉数十个项目。但第一个动作不是运营层面的——而是叙事层面的。由TBWA\\Chiat\\Day创作的\"非同凡想\"运动于1997年9月发布。它将爱因斯坦、甘地、毕加索、阿梅莉亚·埃尔哈特等人命名为苹果的精神先驱。这是在任何一款新产品发布之前的品牌复苏行动。8月，乔布斯与比尔·盖茨达成协议：微软向苹果投资1.5亿美元，并承诺未来五年继续为Mac开发Microsoft Office。Macworld发布会上盖茨出现在巨幕上、乔布斯站在台下的场面，是一次拯救了苹果在企业买家中的公信力的战略性谦逊姿态。",
    },
    kind: "return",
    product: { en: "Apple", zh: "苹果" },
  },
  {
    year: 1998,
    label: { en: "iMac G3", zh: "iMac G3" },
    title: { en: "iMac G3 — Apple's revival product", zh: "iMac G3——苹果的复兴产品" },
    significance: { en: "The translucent Bondi Blue shell signals that Apple is back; design is the argument.", zh: "半透明Bondi蓝外壳宣告苹果回来了；设计就是论据。" },
    detail: {
      en: "The iMac G3 ships in August 1998. Designed by Jony Ive, it is a translucent Bondi Blue egg-shaped all-in-one — the monitor and computer in a single sculpted housing. The name begins with a lowercase 'i', initiating a naming convention that will define the company for fifteen years. It ships with USB and no floppy disk — Jobs eliminating legacy ports before the market is ready, a consistent pattern. The iMac sells 278,000 units in its first six weeks, making it the fastest-selling computer in Apple's history. Apple returns to profitability for the first time since 1995. The product is proof of concept for the Jobs–Ive design partnership.",
      zh: "iMac G3于1998年8月发售。由乔纳森·艾夫设计，它是一个半透明Bondi蓝蛋形一体机——显示器与主机融为一体的雕塑感外壳。其名称以小写字母\"i\"开头，开创了定义公司未来十五年的命名惯例。它搭载USB接口，不附软盘驱动器——乔布斯再度在市场准备就绪之前去除旧有接口，这是一个一贯的模式。iMac在前六周售出27.8万台，成为苹果历史上销售最快的电脑。苹果自1995年以来首次恢复盈利。这款产品是乔布斯-艾夫设计伙伴关系的概念验证。",
    },
    kind: "launch",
    product: { en: "iMac", zh: "iMac" },
  },
  {
    year: 2001,
    label: { en: "iPod · Apple Stores", zh: "iPod · 苹果零售" },
    title: { en: "iPod · first Apple Retail Stores open", zh: "iPod · 首批苹果零售店开业" },
    significance: { en: "The digital hub strategy begins: the Mac as the center of a digital lifestyle.", zh: "数字枢纽战略启动：Mac作为数字生活方式的中心。" },
    detail: {
      en: "In May 2001, Apple opens its first two retail stores, in McLean, Virginia, and Glendale, California. Industry analysts predict failure — Gateway had just closed its store chain. Jobs disagrees: he wants Apple to control the entire customer experience, end to end. The stores are designed to explain the Mac lifestyle. In October 2001, Jobs introduces the iPod: '1,000 songs in your pocket.' The device is not the first digital music player, but it is the simplest and the most elegant. Its white earbuds become a cultural signifier. The iPod is the first spoke in what Jobs calls the 'digital hub' strategy — the Mac as the center of a constellation of digital devices. The two announcements are made in the same year deliberately.",
      zh: "2001年5月，苹果在弗吉尼亚州麦克莱恩和加利福尼亚州格伦代尔开设首批两家零售店。业界分析师预测失败——Gateway刚刚关闭了它的连锁门店。乔布斯不以为然：他希望苹果从头到尾掌控整个顾客体验。门店的设计是为了诠释Mac的生活方式。2001年10月，乔布斯发布iPod：\"把1000首歌放进口袋。\"这款产品不是第一款数字音乐播放器，但它是最简洁、最优雅的。它的白色耳机成为一种文化符号。iPod是乔布斯所称「数字枢纽」战略中的第一根辐条——Mac作为数字设备星座的中心。两项发布在同一年刻意并列。",
    },
    kind: "launch",
    product: { en: "iPod · Stores", zh: "iPod · 零售店" },
  },
  {
    year: 2003,
    label: { en: "iTunes Store", zh: "iTunes商店" },
    title: { en: "iTunes Store — 99¢ per song", zh: "iTunes商店——每首歌99美分" },
    significance: { en: "Jobs convinces five major labels to license music digitally; he reshapes an entire industry's economics.", zh: "乔布斯说服五大唱片公司授权数字音乐；他重塑了一个完整产业的经济逻辑。" },
    detail: {
      en: "The iTunes Music Store opens on April 28, 2003, with a catalog of 200,000 songs at 99 cents each. In its first week, 1 million songs are sold. Jobs spends months persuading the five major labels — EMI, Universal, Warner, Sony, and BMG — to license their catalogs. They agree, in part, because the alternative is continued piracy via Napster and its successors. Jobs insists on a simple, single price point. Within three years, iTunes becomes the largest music retailer in the United States. The iPod-iTunes ecosystem is the first demonstration of the hardware-software-services flywheel that Apple will later scale with the iPhone.",
      zh: "iTunes音乐商店于2003年4月28日开业，提供20万首歌曲，每首99美分。开业首周售出100万首。乔布斯花费数月时间说服五大唱片公司——EMI、环球、华纳、索尼和BMG——授权其音乐目录。他们之所以同意，部分原因是替代方案是通过Napster及其后继者持续遭受盗版。乔布斯坚持采用简单的单一价格点。三年内，iTunes成为美国最大的音乐零售商。iPod-iTunes生态系统是硬件-软件-服务飞轮的首次验证，苹果将在此后用iPhone将其放大。",
    },
    kind: "launch",
    product: { en: "iTunes Store", zh: "iTunes商店" },
  },
  {
    year: 2006,
    label: { en: "Pixar → Disney", zh: "皮克斯卖给迪士尼" },
    title: { en: "Pixar sold to Disney · Jobs becomes Disney's largest shareholder", zh: "皮克斯卖给迪士尼 · 乔布斯成为迪士尼最大股东" },
    significance: { en: "The $10M bet on a graphics lab becomes $7.4B; Jobs gains more Disney shares than Walt Disney's family holds.", zh: "1000万美元的图形实验室赌注变成74亿美元；乔布斯获得的迪士尼股份超过沃尔特·迪士尼家族。" },
    detail: {
      en: "In January 2006, Disney acquires Pixar for $7.4 billion in an all-stock deal. Jobs's 50.6 percent stake in Pixar converts to 138 million Disney shares — approximately 7 percent of Disney's total, making him the company's largest individual shareholder, ahead of the Disney family. He joins Disney's board of directors. The investment he made in 1986 for $10 million has returned $7.4 billion twenty years later. Pixar's cultural output by this point includes Toy Story, A Bug's Life, Monsters, Inc., Finding Nemo, The Incredibles, and Cars. It has not made a single unsuccessful film.",
      zh: "2006年1月，迪士尼以74亿美元全股票交易收购皮克斯。乔布斯持有的皮克斯50.6%股份转换为1.38亿迪士尼股票——约占迪士尼总股份的7%，使他成为公司最大的个人股东，超越迪士尼家族。他加入迪士尼董事会。他1986年以1000万美元进行的投资，二十年后回报了74亿美元。皮克斯迄今的文化产出包括《玩具总动员》《虫虫危机》《怪兽公司》《海底总动员》《超人总动员》和《汽车总动员》，一部失败之作也没有。",
    },
    kind: "win",
    product: { en: "Pixar → Disney", zh: "皮克斯 → 迪士尼" },
  },
  {
    year: 2007,
    label: { en: "iPhone", zh: "iPhone" },
    title: { en: "iPhone — 'an iPod, a phone, and an internet communicator'", zh: "iPhone——\"一台iPod、一部电话和一台上网设备\"" },
    significance: { en: "The most consequential product launch in consumer electronics history; it redefines what a phone is.", zh: "消费电子史上影响最深远的产品发布；它重新定义了电话是什么。" },
    detail: {
      en: "On January 9, 2007, Jobs walks on stage at the Macworld Conference & Expo in San Francisco and says he is introducing three revolutionary products: an iPod with touch controls, a mobile phone, and an internet communicator. 'These are not three separate devices,' he says. 'This is one device.' The iPhone ships on June 29, 2007. It has no physical keyboard. It has a full web browser. Nokia, the world's largest phone maker, and BlackBerry's co-CEO Mike Lazaridis both say it will fail. Within five years, both companies are in existential crisis. The iPhone becomes Apple's most important product, ultimately driving more than half of the company's annual revenue. The digital hub strategy inverts: the phone is now the hub.",
      zh: "2007年1月9日，乔布斯走上旧金山Macworld大会的舞台，宣布他将发布三款革命性产品：一台带触控操控的iPod、一部手机和一台上网设备。\"这不是三台独立的设备，\"他说，\"这是一台设备。\"iPhone于2007年6月29日发售。它没有实体键盘，配备完整的网页浏览器。世界最大手机制造商诺基亚和黑莓联合CEO迈克·拉扎里迪斯都说它会失败。五年内，两家公司均陷入生存危机。iPhone成为苹果最重要的产品，最终驱动公司逾半的年度营收。数字枢纽战略发生反转：手机现在才是枢纽。",
    },
    kind: "launch",
    product: { en: "iPhone", zh: "iPhone" },
  },
  {
    year: 2008,
    label: { en: "App Store", zh: "应用商店" },
    title: { en: "App Store — a new economic model for software distribution", zh: "App Store——软件分发的新经济模型" },
    significance: { en: "The platform enables a million-developer ecosystem; the iPhone becomes a platform, not just a product.", zh: "这个平台孕育出百万开发者生态；iPhone成为平台，而非只是产品。" },
    detail: {
      en: "The App Store launches on July 10, 2008, with 500 apps available. Jobs had initially resisted a third-party app ecosystem, preferring web apps — he relented after intense internal lobbying from Phil Schiller and Scott Forstall. The decision transforms the iPhone from a consumer product into a platform. By the end of 2008, the App Store has 10,000 apps and 300 million downloads. The 30/70 revenue split — Apple takes 30 percent, developers keep 70 — creates a new economic model for software. By 2020, the App Store processes more than $640 billion in transactions annually. The platform flywheel accelerates.",
      zh: "App Store于2008年7月10日上线，提供500款应用。乔布斯最初抵制第三方应用生态，偏好网页应用——在菲尔·席勒和斯科特·福斯特尔的内部强力游说后，他改变了立场。这一决定将iPhone从消费品转变为平台。到2008年底，App Store已有10,000款应用和3亿次下载。三七分成的收入模式——苹果拿走30%，开发者保留70%——创造了一种新的软件经济模型。到2020年，App Store每年处理逾6400亿美元的交易。平台飞轮加速转动。",
    },
    kind: "launch",
    product: { en: "App Store", zh: "App Store" },
  },
  {
    year: 2010,
    label: { en: "iPad", zh: "iPad" },
    title: { en: "iPad — a third category of device between phone and laptop", zh: "iPad——介于手机与笔记本之间的第三类设备" },
    significance: { en: "Redefines tablet computing; the category everyone had tried and failed at, executed to perfection.", zh: "重新定义平板计算；所有人尝试过并失败的品类，由他完美执行。" },
    detail: {
      en: "On January 27, 2010, Jobs sits in an armchair on stage and demonstrates the iPad. 'The most important thing I do all year,' he calls the product category. 'Netbooks are not better at anything,' he says, positioning the iPad against cheap laptops. The iPad ships April 3, 2010, at $499. Apple sells 300,000 units on the first day, 3 million in the first 80 days. Microsoft, Google, and many hardware manufacturers had previously attempted tablet computers without success. Jobs's version succeeds because of three things he controls uniquely: the App Store ecosystem, vertical hardware-software integration, and the industrial design. The iPad becomes a cultural fixture in medicine, aviation, education, and entertainment.",
      zh: "2010年1月27日，乔布斯坐在舞台上的扶手椅里展示iPad。他将这一产品品类称为\"我一年中最重要的事\"。\"上网本什么都做不好，\"他说，将iPad与廉价笔记本进行对位。iPad于2010年4月3日以499美元发售，首日售出30万台，前80天售出300万台。微软、谷歌和众多硬件制造商此前均曾尝试平板电脑而未能成功。乔布斯的版本之所以成功，在于他独特地掌控的三件事：App Store生态系统、纵向硬件-软件整合，以及工业设计。iPad成为医疗、航空、教育和娱乐领域的文化定制品。",
    },
    kind: "launch",
    product: { en: "iPad", zh: "iPad" },
  },
  {
    year: 2011,
    label: { en: "Resigns · Oct 5", zh: "辞职 · 10月5日" },
    title: { en: "Resigns as CEO in August · dies October 5, 2011", zh: "8月辞任CEO · 2011年10月5日离世" },
    significance: { en: "He spent his last years designing Apple's next decade. The products outlasted the man.", zh: "他将最后的岁月用于设计苹果的下一个十年。产品比人更长久。" },
    detail: {
      en: "On August 24, 2011, Jobs sends a letter to the Apple board: 'I have always said if there ever came a day when I could no longer meet my duties and expectations as Apple's CEO, I would be the first to let you know. Unfortunately, that day has come.' He recommends Tim Cook as his successor. Jobs had been diagnosed with pancreatic cancer in 2003 and had managed the illness — and its disclosure — with the same control he applied to product launches. He continues working on Apple's spaceship campus and the iCloud strategy until near the end. He dies on October 5, 2011, at home in Palo Alto, surrounded by his family. He is fifty-six years old. Isaacson's biography — the only one Jobs cooperated with — is published eight days later.",
      zh: "2011年8月24日，乔布斯致函苹果董事会：\"我一直说，如果有一天我无法再履行作为苹果CEO的职责和期望，我会是第一个让你们知道的人。不幸的是，那一天到来了。\"他推荐蒂姆·库克为继任者。乔布斯于2003年被诊断出胰腺癌，他对病情——及其公开披露——的把控与他对产品发布的把控一样精准。直到生命将尽，他仍在继续推进苹果飞船园区和iCloud战略的工作。2011年10月5日，他在帕洛阿尔托家中辞世，家人陪伴在侧。他五十六岁。艾萨克森的传记——唯一一部乔布斯亲自配合的传记——于八天后出版。",
    },
    kind: "farewell",
    product: { en: "Apple", zh: "苹果" },
  },
];

/* ─── NodeGlow ────────────────────────────────────────────────────── */
function NodeGlow({
  color,
  active,
  isCrisis,
  isFarewell,
  isWin,
  isReturn,
  useRainbow,
}: {
  color: string;
  active: boolean;
  isCrisis?: boolean;
  isFarewell?: boolean;
  isWin?: boolean;
  isReturn?: boolean;
  useRainbow?: boolean;
}) {
  return (
    <div
      className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
      style={{
        background: active
          ? `radial-gradient(circle, ${color}28 0%, ${color}05 70%)`
          : "transparent",
        border: isCrisis
          ? `2px solid ${color}`
          : `2px solid ${active ? color : color + "40"}`,
        boxShadow: active
          ? `0 0 24px 6px ${color}55, 0 0 48px 14px ${color}18`
          : isCrisis
          ? `0 0 16px 4px ${color}44`
          : (isWin || isReturn) && !active
          ? `0 0 10px 2px ${color}30`
          : "none",
      }}
    >
      {/* inner dot — rainbow on early Apple nodes */}
      {useRainbow ? (
        <div
          className="h-3 w-3 rounded-full transition-all duration-300"
          style={{
            background: RAINBOW_STRIPE,
            opacity: active ? 1 : 0.75,
            boxShadow: active ? `0 0 12px 5px ${color}88` : "none",
          }}
        />
      ) : (
        <div
          className="h-3 w-3 rounded-full transition-all duration-300"
          style={{
            background: color,
            opacity: active ? 1 : 0.55,
            boxShadow: active ? `0 0 12px 5px ${color}88` : "none",
          }}
        />
      )}

      {/* ping ring when active */}
      {active && (
        <div
          className="absolute inset-0 animate-ping rounded-full"
          style={{ border: `1px solid ${color}44`, animationDuration: "1.8s" }}
        />
      )}

      {/* crisis outer pulse ring */}
      {isCrisis && !active && (
        <div
          className="pulse absolute inset-[-5px] rounded-full"
          style={{ border: `1px solid ${color}55` }}
        />
      )}

      {/* farewell — subtle gold breathe */}
      {isFarewell && !active && (
        <div
          className="breathe absolute inset-[-3px] rounded-full"
          style={{ border: `1px solid ${color}33` }}
        />
      )}
    </div>
  );
}

/* ─── ConnectorLine ───────────────────────────────────────────────── */
function ConnectorLine({
  fromColor,
  toColor,
  isCrisisPre,
  isCrisisPost,
  idx,
}: {
  fromColor: string;
  toColor: string;
  isCrisisPre?: boolean;
  isCrisisPost?: boolean;
  idx: number;
}) {
  const gradId = `ptl-${idx}-${fromColor.replace("#", "")}-${toColor.replace("#", "")}`;
  const dashed = isCrisisPre || isCrisisPost;
  return (
    <div className="flex flex-shrink-0 items-center" style={{ width: "40px" }}>
      <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="7"
          x2="40"
          y2="7"
          stroke={`url(#${gradId})`}
          strokeWidth={dashed ? "1" : "1.5"}
          strokeDasharray={dashed ? "3 5" : undefined}
          className={dashed ? "" : "flow"}
        />
      </svg>
    </div>
  );
}

/* ─── throughline annotation ──────────────────────────────────────── */
function ThroughlineBadge({ lang }: { lang: "en" | "zh" }) {
  return (
    <div
      className="mx-auto mb-6 flex max-w-xl items-start gap-3 rounded-xl px-4 py-3"
      style={{
        background: "linear-gradient(120deg, rgba(255,94,91,0.07), rgba(41,151,255,0.06))",
        border: "1px solid rgba(255,94,91,0.18)",
      }}
    >
      <div
        className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: "#ff5e5b", boxShadow: "0 0 8px 3px #ff5e5b66" }}
      />
      <p className={`text-xs leading-relaxed text-steel-400 ${lang === "zh" ? "zh" : ""}`}>
        {L(
          lang,
          "A fall-and-return arc: the 1985 ouster and the wilderness years at NeXT and Pixar made him. Each product enabled the next — a digital hub where the Mac, then the iPhone, became the center of everything.",
          "一段跌落与归来的弧线：1985年的出局和在NeXT与皮克斯的荒野岁月塑造了他。每一件产品都为下一件产品奠基——在数字枢纽中，先是Mac、后是iPhone，成为一切的中心。"
        )}
      </p>
    </div>
  );
}

/* ─── arc phase label ─────────────────────────────────────────────── */
function ArcPhaseAnnotation({
  lang,
  startIdx,
  endIdx,
  label,
  color,
}: {
  lang: "en" | "zh";
  startIdx: number;
  endIdx: number;
  label: { en: string; zh: string };
  color: string;
}) {
  // Approximate pixel width per node slot (node 90px + connector 40px)
  const slotW = 130;
  const leftPx = startIdx * slotW + 45;
  const widthPx = (endIdx - startIdx) * slotW;
  return (
    <div
      className="pointer-events-none absolute top-0"
      style={{ left: leftPx, width: widthPx }}
    >
      <div
        className={`text-center font-mono text-[0.42rem] uppercase tracking-widest ${lang === "zh" ? "zh" : ""}`}
        style={{ color, opacity: 0.55 }}
      >
        {label[lang]}
      </div>
      <div
        className="mx-2 mt-0.5 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}55 30%, ${color}55 70%, transparent)`,
        }}
      />
    </div>
  );
}

/* ─── detail card ─────────────────────────────────────────────────── */
function DetailCard({
  m,
  lang,
  onClose,
  onPrev,
  onNext,
  index,
  total,
}: {
  m: JobsMilestone;
  lang: "en" | "zh";
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
}) {
  const color = KIND_COLOR[m.kind];
  const isCrisis = m.kind === "crisis";
  const isFarewell = m.kind === "farewell";

  return (
    <div
      className="panel mx-auto max-w-2xl rounded-2xl p-6 rise-in"
      style={{
        borderColor: `${color}30`,
        boxShadow: isCrisis
          ? `0 0 80px -20px ${color}55, 0 0 120px -40px ${color}22`
          : isFarewell
          ? `0 0 60px -24px ${color}38`
          : `0 0 60px -24px ${color}40`,
      }}
    >
      {/* crisis callout */}
      {isCrisis && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg px-3 py-2"
          style={{
            background: "rgba(255,94,91,0.10)",
            border: "1px solid rgba(255,94,91,0.35)",
          }}
        >
          <span
            className="pulse h-2 w-2 flex-shrink-0 rounded-full"
            style={{ background: color }}
          />
          <span
            className={`text-[0.62rem] font-mono uppercase tracking-widest ${lang === "zh" ? "zh" : ""}`}
            style={{ color }}
          >
            {index === 5
              ? L(lang, "Low Point — ousted at 30; the wilderness begins", "最低谷——三十岁出局；荒野时代开始")
              : L(lang, "Near-Bankruptcy — Apple has ~90 days of cash remaining", "濒临破产——苹果仅剩约90天现金储备")}
          </span>
        </div>
      )}

      {/* farewell callout */}
      {isFarewell && (
        <div
          className="mb-4 flex items-center gap-3 rounded-lg px-3 py-2"
          style={{
            background: "rgba(246,166,35,0.08)",
            border: "1px solid rgba(246,166,35,0.28)",
          }}
        >
          <span
            className="breathe h-2 w-2 flex-shrink-0 rounded-full"
            style={{ background: color }}
          />
          <span
            className={`text-[0.62rem] font-mono uppercase tracking-widest ${lang === "zh" ? "zh" : ""}`}
            style={{ color }}
          >
            {L(lang, "Legacy — the products outlasted the man", "传承——产品比人更长久")}
          </span>
        </div>
      )}

      {/* year + product */}
      <div className="mb-1 flex items-baseline gap-3">
        <span
          className="font-mono text-[0.58rem] uppercase tracking-[0.22em]"
          style={{ color }}
        >
          {m.year}
        </span>
        {m.product && (
          <span className={`font-mono text-[0.52rem] tracking-wider text-steel-500 ${lang === "zh" ? "zh" : ""}`}>
            {m.product[lang]}
          </span>
        )}
      </div>

      {/* title */}
      <h3 className={`display mt-0.5 text-xl text-ink-50 md:text-2xl ${lang === "zh" ? "zh" : ""}`}>
        {m.title[lang]}
      </h3>

      {/* significance */}
      <p
        className={`mt-2 text-sm font-medium leading-snug ${lang === "zh" ? "zh" : ""}`}
        style={{ color }}
      >
        {m.significance[lang]}
      </p>

      {/* kind badge */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1"
          style={{
            background: `${color}10`,
            border: `1px solid ${color}25`,
          }}
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          <span
            className="font-mono text-[0.52rem] uppercase tracking-widest"
            style={{ color }}
          >
            {KIND_LABEL[lang][m.kind]}
          </span>
        </div>
      </div>

      {/* detail prose */}
      <p className={`mt-4 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        {m.detail[lang]}
      </p>

      {/* nav bar */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-1.5">
          <button
            onClick={onPrev}
            className="font-mono text-[0.58rem] uppercase tracking-wider text-steel-500 transition hover:text-ink-300 disabled:opacity-30"
            disabled={index === 0}
            aria-label={L(lang, "Previous", "上一条")}
          >
            ← {L(lang, "prev", "上一")}
          </button>
          <span className="font-mono text-[0.52rem] tracking-wider text-steel-500 opacity-40">
            {index + 1} / {total}
          </span>
          <button
            onClick={onNext}
            className="font-mono text-[0.58rem] uppercase tracking-wider text-steel-500 transition hover:text-ink-300 disabled:opacity-30"
            disabled={index === total - 1}
            aria-label={L(lang, "Next", "下一条")}
          >
            {L(lang, "next", "下一")} →
          </button>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-[0.58rem] uppercase tracking-wider text-steel-500 transition hover:text-ink-300"
        >
          {L(lang, "× close", "× 收起")}
        </button>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────── */
export default function ProductTimeline() {
  const { lang } = useLang();
  const [active, setActive] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll active node into view
  useEffect(() => {
    if (active === null || !trackRef.current) return;
    const nodes = trackRef.current.querySelectorAll("[data-node]");
    const el = nodes[active] as HTMLElement | undefined;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [active]);

  return (
    <section className="w-full">
      {/* ── header ── */}
      <div className="mb-6 text-center">
        <p className="label-mono mb-3">
          {L(lang, "The Product Arc", "产品弧线")}
        </p>
        <h2 className="display text-2xl text-ink-50 md:text-3xl">
          {L(lang, "Product Timeline", "产品时间线")}
        </h2>
        <p className={`mt-2 text-sm text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
          {L(
            lang,
            "1976 – 2011 · Life as a product line. Click any node to read the record.",
            "1976–2011 · 将人生视为一条产品线。点击任意节点阅读详情。"
          )}
        </p>
        <div className="rule-flux mx-auto mt-4 h-px w-24" />
      </div>

      {/* ── throughline ── */}
      <ThroughlineBadge lang={lang} />

      {/* ── horizontal scrollable track ── */}
      <div
        ref={trackRef}
        className="scrollbar-thin overflow-x-auto pb-6"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" as const }}
      >
        {/* arc phase annotations — positioned absolutely above the track */}
        <div className="relative" style={{ minWidth: "max-content" }}>
          {/* Phase annotation bar */}
          <div
            className="pointer-events-none relative"
            style={{ minWidth: "max-content", height: "22px", padding: "0 36px" }}
          >
            {/* Rise: 1976–1984 (nodes 0–4) */}
            <ArcPhaseAnnotation
              lang={lang}
              startIdx={0}
              endIdx={4}
              label={{ en: "Rise", zh: "崛起" }}
              color="#2997ff"
            />
            {/* Wilderness: 1985–1995 (nodes 5–7) */}
            <ArcPhaseAnnotation
              lang={lang}
              startIdx={5}
              endIdx={7}
              label={{ en: "Wilderness", zh: "荒野" }}
              color="#ff5e5b"
            />
            {/* Return: 1996–2001 (nodes 8–11) */}
            <ArcPhaseAnnotation
              lang={lang}
              startIdx={8}
              endIdx={11}
              label={{ en: "Return", zh: "回归" }}
              color="#61bb46"
            />
            {/* Zenith: 2003–2011 (nodes 12–17) */}
            <ArcPhaseAnnotation
              lang={lang}
              startIdx={12}
              endIdx={17}
              label={{ en: "Zenith", zh: "顶峰" }}
              color="#f6a623"
            />
          </div>

          {/* node track */}
          <div
            className="flex items-center"
            style={{ minWidth: "max-content", padding: "8px 36px 24px" }}
          >
            {MILESTONES.map((m, i) => {
              const color = KIND_COLOR[m.kind];
              const isActive = active === i;
              const isCrisis = m.kind === "crisis";
              const isFarewell = m.kind === "farewell";
              const isWin = m.kind === "win";
              const isReturn = m.kind === "return";
              // Use rainbow dot only on Apple I (idx 0) and Apple II (idx 1)
              const useRainbow = i === 0 || i === 1;

              return (
                <div key={i} className="flex items-center" data-node={i}>
                  {/* node button */}
                  <button
                    onClick={() => setActive(isActive ? null : i)}
                    className="flex flex-shrink-0 flex-col items-center gap-1.5 focus:outline-none"
                    style={{ scrollSnapAlign: "center", width: "90px" }}
                    aria-label={m.title[lang]}
                    aria-pressed={isActive}
                  >
                    <NodeGlow
                      color={color}
                      active={isActive}
                      isCrisis={isCrisis}
                      isFarewell={isFarewell}
                      isWin={isWin}
                      isReturn={isReturn}
                      useRainbow={useRainbow}
                    />
                    {/* year */}
                    <span
                      className="font-mono text-[0.47rem] uppercase leading-tight tracking-wider"
                      style={{ color: isActive ? color : "#6b7293" }}
                    >
                      {m.year}
                    </span>
                    {/* label */}
                    <span
                      className={`text-center text-[0.58rem] font-semibold leading-tight ${lang === "zh" ? "zh" : ""}`}
                      style={{
                        color: isActive
                          ? color
                          : isCrisis
                          ? "#ff8a87"
                          : isFarewell
                          ? "#ffc15e"
                          : "#a8add0",
                        maxWidth: "82px",
                        filter: isActive ? `drop-shadow(0 0 6px ${color}88)` : "none",
                      }}
                    >
                      {m.label[lang]}
                    </span>
                  </button>

                  {/* connector */}
                  {i < MILESTONES.length - 1 && (
                    <ConnectorLine
                      fromColor={color}
                      toColor={KIND_COLOR[MILESTONES[i + 1].kind]}
                      isCrisisPre={m.kind === "crisis"}
                      isCrisisPost={MILESTONES[i + 1].kind === "crisis"}
                      idx={i}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── detail card ── */}
      <div
        className={`transition-all duration-500 ${
          active !== null
            ? "mt-6 opacity-100"
            : "pointer-events-none mt-0 h-0 overflow-hidden opacity-0"
        }`}
      >
        {active !== null && (
          <DetailCard
            m={MILESTONES[active]}
            lang={lang}
            onClose={() => setActive(null)}
            onPrev={() => setActive((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
            onNext={() =>
              setActive((prev) =>
                prev !== null && prev < MILESTONES.length - 1 ? prev + 1 : prev
              )
            }
            index={active}
            total={MILESTONES.length}
          />
        )}
      </div>

      {/* ── legend ── */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {(
          [
            { kind: "launch" as NodeKind,    en: "Product Launch",        zh: "产品发布" },
            { kind: "win" as NodeKind,        en: "Win / Vindication",     zh: "胜利 / 验证" },
            { kind: "crisis" as NodeKind,     en: "Crisis",                zh: "危机" },
            { kind: "return" as NodeKind,     en: "Return",                zh: "回归" },
            { kind: "milestone" as NodeKind,  en: "Milestone",             zh: "里程碑" },
            { kind: "farewell" as NodeKind,   en: "Legacy",                zh: "传承" },
          ] as { kind: NodeKind; en: string; zh: string }[]
        ).map(({ kind, en, zh }) => (
          <div key={kind} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: KIND_COLOR[kind],
                boxShadow: `0 0 6px ${KIND_COLOR[kind]}88`,
              }}
            />
            <span className={`font-mono text-[0.56rem] uppercase tracking-wider text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              {L(lang, en, zh)}
            </span>
          </div>
        ))}
      </div>

      {/* ── source note ── */}
      <p className={`mt-6 text-center font-mono text-[0.48rem] uppercase tracking-widest text-ink-500 opacity-40 ${lang === "zh" ? "zh" : ""}`}>
        {L(
          lang,
          "Facts drawn from Walter Isaacson, Steve Jobs (2011) — the only biography Jobs cooperated with.",
          "内容引自沃尔特·艾萨克森《乔布斯传》（2011年）——唯一一部乔布斯本人配合的传记。"
        )}
      </p>
    </section>
  );
}
