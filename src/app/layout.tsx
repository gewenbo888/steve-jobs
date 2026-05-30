import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "Steve Jobs · An Analytical Companion to Walter Isaacson's Authorized Biography";
const TITLE_ZH =
  "《史蒂夫·乔布斯传》深度解读 · 沃尔特·艾萨克森授权传记的原理拆解";
const DESC =
  "A bilingual analytical companion to Walter Isaacson's «Steve Jobs» — a thematic map of the ideas that run through the biography: the intersection of art and technology, simplicity and design, the reality distortion field, end-to-end integration, focus, the products-first creed, the 1976→1985→1997 fall-and-return arc, and the question of whether the cruelty and the greatness can be separated. Independent commentary and study guide, not the book itself.";

export const metadata: Metadata = {
  metadataBase: new URL("https://steve-jobs.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "Steve Jobs", "Walter Isaacson", "Steve Jobs biography", "Apple", "intersection of liberal arts and technology",
    "reality distortion field", "simplicity is the ultimate sophistication", "design", "end-to-end integration",
    "the whole widget", "Think Different", "focus", "Macintosh", "NeXT", "Pixar", "iMac", "iPod", "iPhone", "iPad",
    "iTunes", "1997 return", "make a dent in the universe", "real artists ship", "innovation", "leadership",
    "product design", "Jony Ive", "book summary", "study guide", "book analysis",
    "史蒂夫·乔布斯传", "沃尔特·艾萨克森", "乔布斯", "苹果", "人文与科技的交汇", "现实扭曲力场",
    "至繁归于至简", "设计", "端到端整合", "整体产品", "非同凡想", "专注", "麦金塔", "皮克斯",
    "iMac", "iPod", "iPhone", "iPad", "1997回归", "在宇宙中留下印记", "真正的艺术家准时交付",
    "创新", "领导力", "产品设计", "乔纳森·艾维", "读书笔记", "深度解读",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Steve Jobs · 《史蒂夫·乔布斯传》深度解读 — An Analytical Companion to Walter Isaacson’s Authorized Biography" }],
    title: "Steve Jobs — An Analytical Companion",
    description:
      "A bilingual study guide to Walter Isaacson's «Steve Jobs»: the art/technology intersection, simplicity, the reality distortion field, integration, focus, the products-first creed, and the fall-and-return arc — rebuilt as original interactive visualizations. Independent commentary, not the book.",
    url: "https://steve-jobs.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: "Steve Jobs — An Analytical Companion",
    description: "A bilingual analytical companion to Walter Isaacson's «Steve Jobs»: art × technology, simplicity, the reality distortion field, integration, focus, and the fall-and-return arc — with original interactive visualizations.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0a0a0b" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@300;400;500&family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://steve-jobs.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              about: { "@type": "Book", name: "Steve Jobs", author: { "@type": "Person", name: "Walter Isaacson" } },
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-ink-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
