"use client"
import { Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface LobbyHeaderProps {
  lobbyCode: string;
}

const LobbyHeader = ({ lobbyCode }: LobbyHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("lobby");

  const handleCopy = () => {
    navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass glass-border p-4 flex items-center justify-between rounded-2xl md:p-6">
      {/* <div className="flex items-center -betweejustifyn"> */}
      <div>
        <p className="text-sm text-textColor font-bold sm:text-2xl sm:font-extrabold">{t("code")}</p>
      </div>
      <div className="flex items-center  gap-3">
        <span className="text-4xl font-bold tracking-widest gradient-text">
          {lobbyCode}
        </span>
        <button
          onClick={handleCopy}
          className="glass p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
          aria-label="Copy lobby code"
        >
          {copied ? (
            <Check className="w-5 h-5 text-blue-500" />
          ) : (
            <Copy className="w-5 h-5 text-textColor group-hover:text-primary transition-colors" />
          )}
        </button>
      </div>
      {/* </div> */}
      {/* <div className="text-right hidden sm:block">
        <p className="text-sm text-muted-textColor">Share this code with friends</p>
      </div> */}
    </div>
  );
};

export default LobbyHeader;