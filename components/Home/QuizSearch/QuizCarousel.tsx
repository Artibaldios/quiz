import { useTranslations } from "next-intl";
import QuizCard from "./QuizCard";
import ScrollButton from "./ScrollButton";
import { type QuizCardProps } from '@/utils/helpers';

interface QuizCarouselProps {
  title: string;
  quizzes: QuizCardProps[];
  carouselRef: React.RefObject<HTMLDivElement | null>;
  scrollCarousel: (direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => void;
}

export default function QuizCarousel({ 
  title, 
  quizzes, 
  carouselRef, 
  scrollCarousel 
}: QuizCarouselProps) {
  const t = useTranslations("homePage");

  return (
    <section>
      {/* Header with title + scroll buttons */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-textColor">
          {title}
        </h2>
        <div className="flex gap-2">
          <ScrollButton 
            direction="left" 
            onClick={() => scrollCarousel("left", carouselRef)} 
          />
          <ScrollButton 
            direction="right" 
            onClick={() => scrollCarousel("right", carouselRef)} 
          />
        </div>
      </div>

      {/* Scrollable carousel track */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto overflow-y-hidden gap-6 p-2 md:py-6 scrollbar-hide scroll-smooth"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none" 
          }}
        >
          {quizzes.length > 0 ? (
            // Render actual quizzes
            quizzes.map((quiz) => (
              <div key={quiz.id} className="flex-none w-80 md:w-90">
                <QuizCard {...quiz} />
              </div>
            ))
          ) : (
            // Empty state
            <div className="w-full text-center py-12 text-gray-500">
              {t("notAvailable")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
