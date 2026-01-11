"use client";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from '@/i18n/navigation';
import { Target, Trophy, BookOpen, CheckCircle2, User } from "lucide-react";
import StatCard from "@/components/stats/StatCard";
import ProgressRing from "@/components/stats/ProgressRing";
import RecentQuizCard from "@/components/stats/RecentQuizCard";
import QuizHistoryTable from "@/components/stats/QuizHistoryTable";

interface FetchedData {
  threeLatestQuizzes: QuizResult[];
  totalRightAnswers: number;
  totalQuestions: number;
  allUserQuizzes: QuizResult[];
  perfectScoreCount: number;
  uniqueQuizzesCount: number;
}

interface QuizResult {
  id: number;
  quizId: number;
  score: number;
  createdAt: string;
  quizTitle: string;
}

const fetchUserQuizStats = async (userId: string, locale: string): Promise<FetchedData> => {
  const res = await fetch(`/api/user/${userId}/quiz-stats?lang=${locale}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

const Profile = () => {
  const t = useTranslations("Profile");
  const { data: session, status } = useSession();

  const userId = session?.user?.id;
  const locale = useLocale();
  const router = useRouter();
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["userStats", userId, locale],
    queryFn: () => fetchUserQuizStats(userId!, locale!),
    enabled: !!userId,
  });

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{t("noData")}</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t("refresh")}
        </button>
      </div>
    );
  }

  const accuracy = Math.round((stats.totalRightAnswers / stats.totalQuestions) * 100) || 0;

  return (
    <div className="min-h-screen glass relative overflow-hidden rounded-b-2xl">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

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
                {session?.user?.name || t("welcome")}
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
              value={stats.uniqueQuizzesCount}
              icon={BookOpen}
              delay={1}
            />
            <StatCard
              title={t("perfectScores")}
              value={stats.perfectScoreCount}
              icon={Trophy}
              delay={2}
              gradient
            />
            <StatCard
              title={t("correctAnswers")}
              value={stats.totalRightAnswers}
              icon={CheckCircle2}
              delay={3}
            />
            <StatCard
              title={t("totalQuestions")}
              value={stats.totalQuestions}
              icon={Target}
              delay={4}
            />
          </div>
        </div>

        {/* Recent Activity */}
        {stats.threeLatestQuizzes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold font-display text-textColor mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-primary" />
              {t("recentActivity")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.threeLatestQuizzes.map((quiz, index) => (
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
          <QuizHistoryTable quizzes={stats.allUserQuizzes} />
        </section>
      </div>
    </div>
  );
};

export default Profile;