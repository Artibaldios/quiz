import type { Metadata } from "next";
import Provider from "./provider";
import { NavMenu } from "@/components/NavMenu";

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
      <>
        <NavMenu />
        <main className="flex flex-col min-h-[calc(100vh-148px)] mx-4 mb-4 bg-bgColor">
          {children}
        </main>
      </>
    </Provider>
  );
}

// Optionally statically generate locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}