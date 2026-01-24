"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useTranslations } from "next-intl";

export default function ThemeSwitcher({ text }: { text: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("navMenu");
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center ${text ? "space-x-3 w-full " : ""} px-4 py-3 text-sm rounded-xl hover:bg-white/50 dark:hover:bg-gray-500/50 transition-all duration-200 group cursor-pointer`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-yellow-500" />
      ) : (
        <Moon size={18} className="text-blue-500" />
      )}
      {text ? theme === "dark" ? <p className="text-textColor">{t("lightTheme")}</p> : <p className="text-textColor">{t("darkTheme")}</p> : null}
    </button>
  );
} 