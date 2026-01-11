"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import QuizCard from "./QuizCard";
import { QuizCardSkeleton } from "./QuizCardSkeleton";
import { type QuizCardProps } from '@/utils/helpers';
import Loader from '@/components/Loader'

const SEARCH_DEBOUNCE_DELAY = 500;

export default function SearchInput() {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuizCardProps[]>([]);
  const [cardsLatest, setCardsLatest] = useState<QuizCardProps[]>([]);
  const [cardsPopular, setCardsPopular] = useState<QuizCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const t = useTranslations("homePage");

  const carouselLatestRef = useRef<HTMLDivElement>(null);
  const carouselPopularRef = useRef<HTMLDivElement>(null);

  const isSearchActive = query.trim().length > 0;

  useEffect(() => {
    async function fetchHomeQuizzes() {
      setInitialLoading(true);
      try {
        const response = await fetch(`/api/quiz/home?lang=${locale}`);
        if (!response.ok) throw new Error("Failed to fetch quizzes");
        const data = await response.json();
        setCardsLatest(data.latest);
        setCardsPopular(data.popular);
      } catch (error) {
        console.error(error);
        setCardsLatest([]);
        setCardsPopular([]);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchHomeQuizzes();
  }, [locale]);


  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Clear results immediately if input is empty
    if (value.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    // Set a debounce timer to trigger search after delay
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/quiz/search?q=${encodeURIComponent(value)}&locale=${encodeURIComponent(locale)}`
        );
        if (!res.ok) throw new Error("Search request failed");
        const data = await res.json();
        console.log(data)
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_DELAY);
  }

  function scrollCarousel(direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) {
    if (!ref?.current) return;
    const scrollAmount = 350;
    ref.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col p-4 md:p-6 min-h-[400px] rounded-md space-y-6">
        <div className="relative flex justify-center gap-2 mb-6 items-center">
          <div className="relative flex-1 max-w-2xl">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none fill-blue-950 dark:fill-textColor"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                className="fill-blue-950 dark:fill-textColor"
                d="M11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C12.8487 19 14.551 18.3729 15.9056 17.3199L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L17.3199 15.9056C18.3729 14.551 19 12.8487 19 11C19 6.58172 15.4183 3 11 3ZM5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11Z"
              />
            </svg>
            <input
              name="quiz"
              type="text"
              value={query}
              onChange={handleChange}
              placeholder={t("placeholderText")}
              aria-label={t("placeholderText")}
              className="w-full glass px-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg placeholder:text-textColor text-textColor"
              lang={locale}
            />
          </div>
        </div>

        <QuizCarousel
          title={`🔥 ${t("popularQuizCarousel")}`}
          quizzes={[]}
          carouselRef={carouselPopularRef}
          scrollCarousel={scrollCarousel}
          initialLoading={true}
        />
        <QuizCarousel
          title={`🆕 ${t("latestQuizCarousel")}`}
          quizzes={[]}
          carouselRef={carouselLatestRef}
          scrollCarousel={scrollCarousel}
          initialLoading={true}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-6 min-h-[400px] rounded-md">
      <div className="relative flex justify-center gap-2 mb-6 items-center">
        <div className="relative flex-1 max-w-2xl">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none fill-blue-950 dark:fill-textColor"
            viewBox="0 0 24 24"
            width={24}
            height={24}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-blue-950 dark:fill-textColor"
              d="M11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C12.8487 19 14.551 18.3729 15.9056 17.3199L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L17.3199 15.9056C18.3729 14.551 19 12.8487 19 11C19 6.58172 15.4183 3 11 3ZM5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11Z"
            />
          </svg>
          <input
            name="quiz"
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={t("placeholderText")}
            aria-label={t("placeholderText")}
            className="w-full px-10 py-3 glass border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg placeholder:text-textColor text-textColor"
            lang={locale}
          />
        </div>
      </div>

      {!isSearchActive ? (
        <div className="space-y-6">
          <QuizCarousel
            title={`🔥 ${t("popularQuizCarousel")}`}
            quizzes={cardsPopular}
            carouselRef={carouselPopularRef}
            scrollCarousel={scrollCarousel}
            initialLoading={false}
          />
          <QuizCarousel
            title={`🆕 ${t("latestQuizCarousel")}`}
            quizzes={cardsLatest}
            carouselRef={carouselLatestRef}
            scrollCarousel={scrollCarousel}
            initialLoading={false}
          />
        </div>
      ) : loading ? (
        <Loader variant="spinner" color="blue" size="xl" />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((result) => (
            <QuizCard key={result.id} {...result} />
          ))}
        </div>
      ) : (
        <div className="flex flex-1 justify-center items-center h-full">
          <p className="text-gray-500 text-lg">{t("notFound")}</p>
        </div>
      )}
    </div>
  );
}

interface QuizCarouselProps {
  title: string;
  quizzes: QuizCardProps[];
  carouselRef: React.RefObject<HTMLDivElement | null>;
  scrollCarousel: (direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => void;
  initialLoading: boolean;
}

function QuizCarousel({ title, quizzes, carouselRef, scrollCarousel, initialLoading }: QuizCarouselProps) {
  const t = useTranslations("homePage");
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-textColor">{title}</h2>
        <div className="flex gap-2">
          <ScrollButton direction="left" onClick={() => scrollCarousel("left", carouselRef)} />
          <ScrollButton direction="right" onClick={() => scrollCarousel("right", carouselRef)} />
        </div>
      </div>
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 p-2 md:py-6 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {initialLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex-none w-80 md:w-90">
                <QuizCardSkeleton />
              </div>
            ))
          ) : quizzes && quizzes.length > 0 ? (
            quizzes.map((card) => (
              <div key={card.id} className="flex-none w-80 md:w-90">
                <QuizCard {...card} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 text-gray-500">{t("notAvailable")}</div>
          )}
        </div>
      </div>
    </section>
  );
}

interface ScrollButtonProps {
  direction: "left" | "right";
  onClick: () => void;
}

function ScrollButton({ direction, onClick }: ScrollButtonProps) {
  const isLeft = direction === "left";
  return (
    <button
      onClick={onClick}
      className="group relative w-11 h-11 glass backdrop-blur-xl border border-white/50 dark:border-zinc-700/50 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] active:shadow-md active:scale-95 transition-all duration-200 ease-out flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
      aria-label={`Scroll ${direction}`}
      type="button"
    >
      <svg
        className={`w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 group-active:text-zinc-900 transition-colors duration-200 ${isLeft ? "" : "rotate-180"
          }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <div className="absolute inset-0 bg-linear-to-r from-white/30 dark:from-zinc-800/20 to-transparent rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </button>
  );
}
