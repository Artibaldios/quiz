"use client";
import { NextIntlClientProvider } from 'next-intl';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import { SessionProvider } from 'next-auth/react';
import { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";
import { ThemeProvider } from '@/components/ThemeProvider';

interface Messages {
  [key: string]: string | Messages;
}
type Locale = 'en' | 'ru';
const messages: Record<Locale, Messages> = {
  en,
  ru,
};

type Props = {
  children: React.ReactNode;
  session?: Session;
  params: { locale: string; }
};

export default function Providers({ children, session, params }: Props) {
  const locale = params.locale;
  const localeMessages = messages[locale as Locale] || messages.en;
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={localeMessages} timeZone="UTC">
          <ThemeProvider>
              {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}