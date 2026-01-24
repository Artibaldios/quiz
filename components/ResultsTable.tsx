import React from 'react';

interface QuizResult {
  id: number;
  quizId: number;
  score: number;
  createdAt: string;
  quizTitle: string;
}

interface QuizResultsListProps {
  results: QuizResult[];
}

export const QuizResultsList: React.FC<QuizResultsListProps> = ({ results }) => {
  return (
    <div className="quiz-results-list space-y-4">
      {results.map(({ id, quizTitle, score, createdAt }) => (
        <div key={id} className="quiz-card p-4 border rounded shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold">{quizTitle}</h3>
          <div className="text-sm text-gray-600">Score: {score}</div>
          <div className="text-xs text-gray-500">
            Completed: {new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
      ))}
    </div>
  );
};