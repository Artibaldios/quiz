import { getQuizStats } from '@/actions/quizStats'
import ClientProfile from '@/components/Profile/Profile'
import { requireAuth } from '@/actions/auth'
import { Lang } from '@/types/common'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  const { userId, name } = await requireAuth(locale);
  const stats = await getQuizStats({ userId, lang: locale as Lang })

  return (
    <ClientProfile 
      initialStats={stats}
      user={{ id: userId, name  }}
    />
  )
}