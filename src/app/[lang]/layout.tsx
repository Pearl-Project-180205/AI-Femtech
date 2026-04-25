import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "../globals.css";
import { Navigation } from "@/components/Navigation";
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
  title: "포엠 (For:M) | Daily Guidance",
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
        {/* On Mobile: bottom padding for navigation. On Desktop: left padding for fixed sidebar. */}
        <main className="flex-1 w-full min-h-screen relative pb-24 md:pb-10 md:pl-64 transition-all bg-secondary">
          <div className="w-full h-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
