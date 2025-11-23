import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "./provider";
import { NavMenu } from "@/components/NavMenu";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Master App",
  description: "Quiz Master App",
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const { locale } = await params;
  return (
    <Provider params={{ locale }}>
      <>
        <NavMenu />
        <main className="flex flex-col min-h-[calc(100vh-148px)] mx-4 mb-4 bg-bgColor">
          {children}
        </main>
        {/* <Footer /> */}
      </>
    </Provider>
  );
}

// Optionally statically generate locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}