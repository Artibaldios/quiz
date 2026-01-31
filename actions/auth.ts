import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function requireAuth(locale: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect(`/${locale}/`)
  return { userId: session.user.id, name: session.user.name ?? 'User' }
}