import { QuizCardProps } from "@/utils/helpers";
import QuizCard from "./QuizCard";
import { memo } from "react";

export default function SearchResultsGrid({ results }: { results: QuizCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {results.map((quiz) => (
        <QuizCardMemo key={quiz.id} {...quiz} />
      ))}
    </div>
  );
}
const QuizCardMemo = memo(QuizCard);
