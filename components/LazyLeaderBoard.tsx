'use client';

import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Your original component renamed to QuizLeaderboardContent
const QuizLeaderboardContent = dynamic(() => import('./QuizLeaderBoard'), {
  ssr: false, // Disable SSR since it's scroll-triggered
  loading: () => (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-white/30 overflow-hidden p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-3 border-white/30 rounded-full animate-pulse"></div>
      </div>
    </div>
  ),
});

const LazyQuizLeaderboard: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '10px 0px',
  });

  return (
    <section ref={ref} className="w-full py-8">
      {inView && (
        <Suspense fallback={null}>
          <QuizLeaderboardContent />
        </Suspense>
      )}
    </section>
  );
};

export default LazyQuizLeaderboard;