"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();

  function toggleLocale() {
    const newLocale = locale === "ru" ? "en" : "ru";
    router.push(`/${newLocale}`);
  }

  return (
    <button onClick={toggleLocale} aria-label={t("locale")}>
      {locale === "ru" ? "🇷🇺" : "🇬🇧"} {t("locale", { locale })}
    </button>
  );
}