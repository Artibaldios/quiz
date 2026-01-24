import { Settings, Timer, RotateCcw, Play } from "lucide-react";
import { LobbySettings as LobbySettingsType } from "@/types/quiz";
import { useTranslations } from "next-intl";

interface LobbySettingsProps {
  settings: LobbySettingsType;
  onSettingsChange: (settings: LobbySettingsType) => void;
}

const LobbySettings = ({ settings, onSettingsChange }: LobbySettingsProps) => {
  const t = useTranslations("lobby");
  const handleQuestionTimerChange = (value: number[]) => {
    onSettingsChange({ ...settings, questionTimer: value[0] });
  };

  const handleResultTimerChange = (value: number[]) => {
    onSettingsChange({ ...settings, resultTimer: value[0] });
  };

  const handleAutoContinueChange = (checked: boolean) => {
    onSettingsChange({ ...settings, autoContinue: checked });
  };

  return (
    <div className="glass p-4 animate-fade-in rounded-2xl sm:p-6" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">{t("settings")}</h2>
      </div>

      <div className="space-y-6">
        {/* Question Timer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{t("questionTimer")}</span>
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5s</span>
            <span>60s</span>
          </div>
        </div>

        {/* Result Timer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{t("resultDisplay")}</span>
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2s</span>
            <span>15s</span>
          </div>
        </div>

        {/* Auto Continue */}
        {/* <div className="glass p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Auto Continue</p>
              <p className="text-xs text-muted-foreground">Automatically advance to next question</p>
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
