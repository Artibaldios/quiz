"use client"
import { useState, useEffect } from 'react';
// import { Quiz } from '@/pages/Quiz';
// import { QuizResults } from '@/pages/QuizResults';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  // const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'results'>('home');
  // const [results, setResults] = useState<any>(null);

  // const handleComplete = (quizResults: any) => {
  //   setResults(quizResults);
  //   setCurrentView('results')
  // };
  // // const handleResults = (quizResults: {answers: number[], questions: any[]}) => {
  // //   setResults(quizResults);
  // // };

  // return (
  //   <div className="min-h-screen flex flex-col bg-gray-50">
  //     <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
  //       <h2 className="text-xl font-semibold text-primary">Quiz Master</h2>
  //     </header>
  //     <main className="flex-1 flex items-center justify-center p-8">
  //       <div className="w-full max-w-4xl mx-auto">
  //         <div className="flex flex-col gap-8">
  //           <div className="text-center">
  //           <h1 className="text-5xl font-bold text-primary mb-4">Quiz Master</h1>
  //           {/* <p className="text-xl text-secondary mb-8">
  //             Welcome back, {loggedInUser?.email ?? "friend"}!
  //           </p> */}
  //           <p className="text-lg text-gray-600 mb-8">
  //             Test your knowledge across different topics. Answer 10 questions and see how you perform!
  //           </p>
  //           <div className="flex gap-4 justify-center">
  //             <button
  //               onClick={() => setCurrentView('quiz')}
  //               className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm hover:shadow"
  //             >
  //               Start New Quiz
  //             </button>
  //             <button
  //               onClick={() => setCurrentView('results')}
  //               className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-sm hover:shadow"
  //             >
  //               View Results
  //             </button>
  //           </div>
  //           {/*  views */}
  //           {currentView === 'quiz' && (
  //             <Quiz onComplete={handleComplete} />
  //           )}
  //           {currentView === 'results' && (
  //             <QuizResults results={results} onBackToHome={() => setCurrentView('home')} />
  //           )}
  //         </div>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // );
const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") return <p>Loading...</p>;
  if (session) return <p>Welcome, {session.user?.name}</p>;

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await signIn("name", {
      redirect: false,
      email,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleEmailSignIn}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Sign in with Email</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Example: social provider button */}
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}