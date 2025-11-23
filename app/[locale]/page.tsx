"use client"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

export default function Home() {
  const t = useTranslations('homePage');
  const quizResult = useSelector((state: RootState) => state.quiz.quizResult)

  return (
    <div className="h-full flex flex-col bg-bgColor">
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-primary mb-4">Quiz Master</h1>
              <p className="text-lg text-textColor mb-8">
                {t('description')}
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/quiz"
                  className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm hover:shadow"
                >{t('startButton')}
                </Link>
                {quizResult && quizResult.questionsWithAnswers ? (
                  <Link
                  href="/results"
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-sm hover:shadow"
                >{t('resultsButton')}
                </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}