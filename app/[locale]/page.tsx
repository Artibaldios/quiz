import { Suspense } from 'react';
import { getHomeQuizzes } from '@/actions/homeData';
import { getTranslations } from 'next-intl/server';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import QuizSearchSkeleton from '@/components/skeletons/QuizSearchSkeleton';
import ErrorUI from '@/components/ErrorUI';
import QuizLeaderboardSkeleton from '@/components/skeletons/LeaderBoardSkeleton';
import QuizLeaderboard from '@/components/Home/QuizLeaderBoard';
import QuizSearch from '@/components/Home/QuizSearch/QuizSearch';
import LobbyInput from '@/components/Home/Lobbyinput';
import Title from '@/components/Home/Title';
import QuizCategories from '@/components/Home/QuizCategories';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations("homePage");
  const homeQuizzes = await getHomeQuizzes(locale);

  return (
    <div className="h-full flex flex-col rounded-md mx-2">
      <Title />
      <QuizCategories />
      <ErrorBoundary fallback={<ErrorUI message="Can't load data"/>}>
        <Suspense fallback={<QuizSearchSkeleton />}>
          <QuizSearch initialData={homeQuizzes} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<ErrorUI message="Can't load data"/>}>
        <Suspense fallback={<QuizLeaderboardSkeleton />}>
          <QuizLeaderboard />
        </Suspense>
      </ErrorBoundary>

      <LobbyInput />
    </div>
  );
}