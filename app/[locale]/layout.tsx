import Provider from '../provider';
import { NavMenu } from '@/components/NavMenu';
import Footer from '@/components/Footer';
import SocketManager from '@/lib/socket';

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
      <main className="flex flex-col max-w-7xl m-auto mb-4">
        {children}
      </main>
      <Footer />
      <SocketManager />
    </Provider>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}