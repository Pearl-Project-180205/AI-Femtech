import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "../globals.css";
import { Navigation } from "@/components/Navigation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getDictionary } from "@/lib/dictionaries";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MORA | AI Coach For Your Best Days",
  description: "당신을 위한 맞춤형 컨디션 코칭 앱",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-secondary text-primary md:flex-row">
        <Navigation lang={lang} dict={dict} />
        <main className="flex-1 w-full min-h-screen relative pb-24 md:pb-10 md:pl-64 transition-all bg-secondary flex flex-col">
          <div className="w-full h-full max-w-7xl mx-auto flex-1">
            {children}
          </div>
          {/* Static language selector at the bottom of the page */}
          <div className="w-full py-8 mt-auto flex justify-center border-t border-neutral/10 bg-secondary">
            <LanguageSelector currentLang={lang} dict={dict} floating={false} />
          </div>
        </main>
      </body>
    </html>
  );
}
