import { QuizCardProps } from "@/utils/helpers";
import QuizCarousel from "./QuizCarousel";

export default function HomeCarousels({ 
  sections, 
  scrollCarousel 
}: { 
  sections: Array<{
    title: string;
    quizzes: QuizCardProps[];
    ref: React.RefObject<HTMLDivElement | null> ;
  }>;
  scrollCarousel: (direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => void;
}) {
  return (
    <div className="space-y-6">
      {sections.map(({ title, quizzes, ref }, index) => (
        <QuizCarousel
          key={index}
          title={title}
          quizzes={quizzes}
          carouselRef={ref}
          scrollCarousel={scrollCarousel}
        />
      ))}
    </div>
  );
}