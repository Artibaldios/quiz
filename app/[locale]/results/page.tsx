"use client"
import Link from 'next/link';
import type { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';

export default  function QuizResults() {
  const quizResult = useSelector((state: RootState) => state.quiz.quizResult)

  if(!quizResult) return  <>No results</>

  const topicScores = Object.entries(quizResult?.topicScores).map(([topic, scores]) => ({
    topic,
    percentage: Math.round(((scores as any).correct / (scores as any).total) * 100),
    correct: (scores as any).correct,
    total: (scores as any).total,
  }));
  

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Quiz Results</h2>
        <div className="text-6xl font-bold text-primary mb-2">{quizResult?.score}%</div>
        <p className="text-lg text-textColor">
          You got {topicScores.reduce((sum, topic) => sum + topic.correct, 0)} out of{" "}
          {topicScores.reduce((sum, topic) => sum + topic.total, 0)} questions correct
        </p>
      </div>

      {/* Topic Performance */}
      <div className="bg-bgContent rounded-lg shadow-sm border p-6 mb-8 border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-textColor">Performance by Topic</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topicScores.map((topic) => (
            <div key={topic.topic} className="border rounded-lg p-4 border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-textColor">{topic.topic}</h4>
                <span className="text-lg font-bold text-primary">{topic.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${topic.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-textColor">
                {topic.correct} out of {topic.total} correct
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-bgContent rounded-lg shadow-sm border p-6 mb-8 border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-textColor">Question Review</h3>
        <div className="space-y-4">
          {quizResult.questionsWithAnswers && quizResult.questionsWithAnswers.map((qa, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                qa.user_answer === qa.correct_answer
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                    {qa.topic}
                  </span>
                  <p className="font-medium text-gray-900">{qa.question_text}</p>
                </div>
                <div className="ml-4">
                  {qa.user_answer === qa.correct_answer ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Your answer: </span>
                  <span className={qa.user_answer === qa.correct_answer ? "text-green-700" : "text-red-700"}>
                    {qa.user_answer}
                  </span>
                </div>
                {qa.user_answer !== qa.correct_answer && (
                  <div>
                    <span className="font-medium text-gray-700">Correct answer: </span>
                    <span className="text-green-700">
                      {qa.correct_answer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center flex gap-4 justify-center items-center m-4 md:w-48 md:m-auto">
        <Link 
        href="/"
        className="w-full px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm hover:shadow"
        >
        <p>Back to Home</p>
        </Link>
      </div>
    </div>
  );
}
