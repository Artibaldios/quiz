import QuizLobby from '@/components/QuizLobby';

export default function LobbyPage({
  params,
  searchParams
}: {
  params: { code: string; locale?: string };
  searchParams: { quizId?: string };
}) {
  return <QuizLobby />;
}