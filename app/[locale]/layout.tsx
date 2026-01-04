import type { Metadata } from "next";
import Provider from "./provider";
import { NavMenu } from "@/components/NavMenu";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Quiz Master App",
  description: "Quiz Master App",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  return (
    <Provider params={{ locale }}>
        <NavMenu />
        <main className="flex flex-col max-w-[1280px] m-auto mb-4 bg-bgColor">
          {children}
        </main>
        <Footer />
    </Provider>
  );
}

// Optionally statically generate locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}