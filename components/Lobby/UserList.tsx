import { Users, Crown } from "lucide-react";
import { User } from "@/types/quiz";
import { useTranslations } from "next-intl";

interface JoinedUsersProps {
  users: User[];
}

const JoinedUsers = ({ users }: JoinedUsersProps) => {
  const t = useTranslations("lobby");
  const getAvatarColor = (index: number) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-amber-500",
      "from-red-500 to-rose-500",
      "from-indigo-500 to-violet-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="glass glass-border p-6 animate-fade-in rounded-2xl" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-textColor">{t("players")}</h2>
        </div>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
          {users.length} {t("joined")}
        </span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="glass glass-border p-3 rounded-xl flex items-center gap-3 "
            style={{ animationDelay: `${0.4 + index * 0.05}s` }}
          >
            <div
              className={`w-10 h-10 rounded-full bg-linear-to-br ${getAvatarColor(
                index
              )} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-textColor flex items-center gap-2">
                {user.name}
                {user.isHost && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
              </p>
              {user.isHost && (
                <p className="text-xs text-textColor">{t("host")}</p>
              )}
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-soft" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinedUsers;