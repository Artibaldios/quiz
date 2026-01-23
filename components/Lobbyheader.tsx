"use client"
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface LobbyHeaderProps {
  lobbyCode: string;
}

const LobbyHeader = ({ lobbyCode }: LobbyHeaderProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(lobbyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-solid p-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 glass flex items-center justify-center rounded-xl">
          {/* QR Code placeholder - displays lobby code */}
          <div className="text-center">
            <div className="text-[8px] text-muted-foreground mb-1">SCAN TO JOIN</div>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Lobby Code</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold tracking-widest gradient-text">
              {lobbyCode}
            </span>
            <button
              onClick={handleCopy}
              className="glass p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 group"
              aria-label="Copy lobby code"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Share this code with friends</p>
        <p className="text-xs text-muted-foreground/70">or scan QR to join</p>
      </div>
    </div>
  );
};

export default LobbyHeader;