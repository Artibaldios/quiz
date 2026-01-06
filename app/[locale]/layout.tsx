import Provider from '../provider';
import { NavMenu } from '@/components/NavMenu';
import Footer from '@/components/Footer';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <Provider params={{ locale }}>
      <NavMenu />
      <main className="flex flex-col max-w-7xl m-auto mb-4 bg-bgColor">
        {children}
      </main>
      <Footer />
    </Provider>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}