import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

export function useQuizData(id: number) {
  const locale = useLocale();
  const quizId = Number(id);

  return useQuery({
    queryKey: ['quiz', locale, quizId],
    queryFn: () => fetchQuestions(locale, quizId),
    enabled: !isNaN(quizId),
    staleTime: 5 * 60 * 1000,
  });
}

async function fetchQuestions(locale: string, id: number) {
  const res = await fetch(`/api/quiz/${id}?lang=${locale}`);
  if (!res.ok) throw new Error('Quiz not found');
  return res.json();
}