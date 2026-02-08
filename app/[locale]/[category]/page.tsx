import QuizCategories from '@/components/Home/QuizCategories';
import SearchResultsGrid from '@/components/Home/QuizSearch/SearchResultsGrid';
import { getQuizzesByCategory } from '@/actions/quizzes';
import { Suspense } from 'react';
import { QuizCardSkeleton } from '@/components/skeletons/QuizCardSkeleton';
import { Lang } from '@/types/common';

interface CategoryPageProps {
  params: Promise<{ locale: Lang; category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  const quizzes = await getQuizzesByCategory(category, locale);

  return (
    <div className="">
      <QuizCategories activeCategory={category} />

      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-textColor white mb-8 capitalize">
          {category} Quizzes
        </h1>

        <Suspense fallback={<QuizCardSkeleton />}>
          <SearchResultsGrid results={quizzes} />
        </Suspense>
      </div>
    </div>
  );
}