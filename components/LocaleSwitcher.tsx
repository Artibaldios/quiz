"use client";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    const newLocale = locale === "ru" ? "en" : "ru";
    const newPath = pathname.replace(/^\/(en|ru)/, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <button
      className="flex items-center space-x-3 w-full px-4 py-3 text-sm rounded-xl hover:bg-gray-100 dark:hover:bg-gray-500/50 transition-all duration-200 group cursor-pointer"
      onClick={toggleLocale}
      aria-label={t("locale")}
    >
      <Globe className="w-5 h-5 text-gray-500 group-hover:text-green-500" />
      <span className="font-medium text-gray-900 dark:text-white">
        {t("locale", { locale })}
      </span>
    </button>
  );
}