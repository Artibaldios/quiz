"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useCallback } from "react";
import { type QuizCardProps } from '@/utils/helpers';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import SearchHeader from './SearchHeader';
import SearchResultsGrid from "./SearchResultsGrid";
import NoResults from "./NoResults";
import HomeCarousels from "./HomeCarousels";
import Loader from '@/components/Loader';

interface QuizSearchProps {
  initialData: { latest: QuizCardProps[]; popular: QuizCardProps[] };
}

const LIMIT_NUMBER = 9;

export default function QuizSearch({ initialData }: QuizSearchProps) {
  const locale = useLocale();
  const t = useTranslations("homePage");
  const [query, setQuery] = useState("");
  
  const { 
    results, 
    initialLoading, 
    incrementalLoading, 
    hasQuery, 
    hasMore, 
    loadMore 
  } = useDebouncedSearch({ query, locale, limit: LIMIT_NUMBER });
  
  const popularRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  
  const scrollCarousel = useCallback((direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth"
    });
  }, []);

  return (
    <div className="flex flex-col p-4 md:p-6 min-h-[400px] rounded-md space-y-6">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        placeholder={t("placeholderText")}
        locale={locale}
      />

      {hasQuery && initialLoading && <Loader size="xl" />}
      
      {hasQuery && !initialLoading && results.length > 0 && (
        <>
          <SearchResultsGrid results={results} />
          {hasMore && (
            <button 
            className={`
        px-6 py-2 rounded-xl font-semibold text-sm
        bg-linear-to-r from-blue-600 to-blue-500 
        shadow-md shadow-blue-500/20 text-white
        transform transition-all duration-300
        hover:shadow-blue-500/50 hover:scale-105
        active:scale-95 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        md:w-1/4 md:mx-auto
      `}
            onClick={loadMore} 
            disabled={incrementalLoading}>
              {incrementalLoading ? "Loading..." : "Load More"}
            </button>
          )}
        </>
      )}
      
      {hasQuery && results.length === 0 && query.trim().length > 0 && <NoResults t={t} />}
      
      {!hasQuery && (
        <HomeCarousels           
          sections={[
            { title: `🔥 ${t("popularQuizCarousel")}`, quizzes: initialData.popular, ref: popularRef },
            { title: `🆕 ${t("latestQuizCarousel")}`, quizzes: initialData.latest, ref: latestRef }
          ]}
          scrollCarousel={scrollCarousel}
        />
      )}
    </div>
  );
}
