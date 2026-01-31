"use client";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Target, Trophy, BookOpen, CheckCircle2, User } from "lucide-react";
import StatCard from "@/components/stats/StatCard";
import ProgressRing from "@/components/stats/ProgressRing";
import RecentQuizCard from "@/components/stats/RecentQuizCard";
import QuizHistoryTable from "@/components/stats/QuizHistoryTable";
import { FetchedUserData } from "@/types/quiz";
import Loader from "@/components/Loader";

interface Props {
  initialStats: FetchedUserData;
  user: { id: string; name: string };
}

export default function ClientProfile({ initialStats, user }: Props) {
  const t = useTranslations("Profile");
  const { data: session } = useSession();

  if (!session) return <Loader />;

  const accuracy = initialStats.totalQuestions > 0 
    ? Math.round((initialStats.totalRightAnswers / initialStats.totalQuestions) * 100) 
    : 0;

  return (
    <div className="min-h-screen glass relative overflow-hidden rounded-b-2xl">
      <div className="relative z-10 container p-4 m-2 md:mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-12 animate-fade-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                <User className="w-8 h-8 text-textColor" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-textColor mb-2">
                {user.name || t("welcome")}
              </h1>
              <p className="text-textColor mt-1">{t("progress")}</p>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Ring - Featured */}
          <div className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center animate-fade-up">
            <div className="relative z-10">
              <ProgressRing
                percentage={accuracy}
                size={220}
                strokeWidth={14}
                label={t("accuracy")}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title={t("quizzesTaken")}
              value={initialStats.uniqueQuizzesCount}
              icon={BookOpen}
              delay={1}
            />
            <StatCard
              title={t("perfectScores")}
              value={initialStats.perfectScoreCount}
              icon={Trophy}
              delay={2}
              gradient
            />
            <StatCard
              title={t("correctAnswers")}
              value={initialStats.totalRightAnswers}
              icon={CheckCircle2}
              delay={3}
            />
            <StatCard
              title={t("totalQuestions")}
              value={initialStats.totalQuestions}
              icon={Target}
              delay={4}
            />
          </div>
        </div>

        {/* Recent Activity */}
        {initialStats.threeLatestQuizzes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold font-display text-textColor mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-primary" />
              {t("recentActivity")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {initialStats.threeLatestQuizzes.map((quiz, index) => (
                <RecentQuizCard key={quiz.id} quiz={quiz} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Quiz History */}
        <section>
          <h2 className="text-xl font-semibold font-display text-textColor mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-primary" />
            {t("completeHistory")}
          </h2>
          <QuizHistoryTable quizzes={initialStats.allUserQuizzes} />
        </section>
      </div>
    </div>
  );
};

