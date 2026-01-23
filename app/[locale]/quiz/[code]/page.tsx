import Quiz from '@/components/Quiz';

export default function QuizPage({
  params,
  searchParams
}: {
  params: { code: string; locale?: string };
  searchParams: { quizId?: string };
}) {
  return <Quiz />;
}