import { useTranslations } from "next-intl";

export default function NoResults({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex flex-1 justify-center items-center h-full">
      <p className="text-gray-500 text-lg">{t("notFound")}</p>
    </div>
  );
}