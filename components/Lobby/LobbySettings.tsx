import { Settings, Timer, RotateCcw } from "lucide-react";
import { LobbySettings as LobbySettingsType } from "@/types/quiz";
import { useTranslations } from "next-intl";

interface LobbySettingsProps {
  settings: LobbySettingsType;
  //onSettingsChange: (settings: LobbySettingsType) => void;
}

const LobbySettings = ({ settings }: LobbySettingsProps) => {
  const t = useTranslations("lobby");

  return (
    <div className="glass glass-border p-4 animate-fade-in rounded-2xl sm:p-6" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-textColor">{t("settings")}</h2>
      </div>

      <div className="space-y-6">
        {/* Question Timer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-textColor" />
              <span className="text-sm font-medium text-textColor">{t("questionTimer")}</span>
            </div>
            <span className="text-sm font-bold text-primary">{settings.questionTimer}s</span>
          </div>
          {/* <Slider
            value={[settings.questionTimer]}
            onValueChange={handleQuestionTimerChange}
            min={5}
            max={60}
            step={5}
            className="w-full"
          /> */}
          <div className="flex justify-between text-xs text-textColor">
            <span>5s</span>
            <span>60s</span>
          </div>
        </div>

        {/* Result Timer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-textColor" />
              <span className="text-sm font-medium text-textColor">{t("resultDisplay")}</span>
            </div>
            <span className="text-sm font-bold text-primary">{settings.resultTimer}s</span>
          </div>
          {/* <Slider
            value={[settings.resultTimer]}
            onValueChange={handleResultTimerChange}
            min={2}
            max={15}
            step={1}
            className="w-full"
          /> */}
          <div className="flex justify-between text-xs text-textColor">
            <span>2s</span>
            <span>15s</span>
          </div>
        </div>

        {/* Auto Continue */}
        {/* <div className="glass p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play className="w-4 h-4 text-muted-textColor" />
            <div>
              <p className="text-sm font-medium text-textColor">Auto Continue</p>
              <p className="text-xs text-muted-textColor">Automatically advance to next question</p>
            </div>
          </div>
          {/* <Switch
            checked={settings.autoContinue}
            onCheckedChange={handleAutoContinueChange}
          /> 
        </div> */}
      </div>
    </div>
  );
};

export default LobbySettings;
