import { Link } from '@/i18n/navigation';
import React from 'react';
import { formatRelativeDate, getLevelConfig, type LevelConfig, type QuizCardProps } from '@/utils/helpers';
import { useLocale, useTranslations } from 'next-intl';
import { 
  Brain, 
  BookOpen, 
  Globe, 
  Star,
  Coffee,
  Film,
  Gamepad2,
  Music, 
  HelpCircle, 
  Users,
  Book,
  Palette,
  Volleyball,
  Cpu
} from 'lucide-react';
const QuizCard: React.FC<QuizCardProps> = ({
  title,
  category,
  level = 'medium',
  questionCount,
  plays,
  createdAt,
  id
}) => {
  const t = useTranslations("quizCard");
  const locale = useLocale();
  const levelConfig: LevelConfig = getLevelConfig(level, locale);
  return (
      <div className="group relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={`
        relative glass rounded-2xl p-4 md:p-6 border border-white/20
        transform transition-all duration-500 ease-out
        hover:border-white/40 hover:shadow-md`
      }>
        {/* Floating orbs */}
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary/40 to-purple-500/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float" />
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-br from-pink-500/40 to-orange-500/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-float" style={{ animationDelay: "0.5s" }} />
        
        <h3 className="text-lg font-semibold text-textColor mb-4 line-clamp-1">{title}</h3>
        
        <div className="flex items-center gap-3 mb-4">
          {/* Category icon */}
          <div className={`
            w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center
            shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6
          `}>
            <CategoryIcon category={category}/>
            
          </div>
          
          {/* Question icon */}
          <div className="w-10 h-10 rounded-xl bg-secondary/80 backdrop-blur flex items-center justify-center border border-white/10">
            <HelpCircle className="w-5 h-5 text-textColor" />
          </div>
          
          {/* Players icon */}
          <div className="w-10 h-10 rounded-xl bg-secondary/80 backdrop-blur flex items-center justify-center border border-white/10">
            <Users className="w-5 h-5 text-textColor" />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-sm flex-nowrap">
          <span className={`
            px-2 py-0.5 rounded-md border text-xs font-medium whitespace-nowrap
            ${levelConfig.color} ${levelConfig.border} ${levelConfig.text}
          `}>{levelConfig.level.toUpperCase()}</span>
          <span className="text-textColor/70 whitespace-nowrap">
            {t("questions")} <span className="text-textColor">{questionCount}</span>
          </span>
          <span className="text-textColor/70 whitespace-nowrap">
            {t("played")} <span className="text-textColor">{plays.toLocaleString()}</span>
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-textColor">{formatRelativeDate(createdAt, locale)}</span>
          <Link href={`/quiz/${id}`} className={`
            px-6 py-2 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-blue-600 to-blue-500 
            shadow-md shadow-blue-500/20 text-white
            transform transition-all duration-300
            hover:shadow-blue-500/50 hover:scale-105
            active:scale-95 cursor-pointer`
            }>
            {t("playButton")}
          </Link>
        </div>
      </div>
    </div>
  );
};

// Category to icon mapping
const categoryIcons: Record<string, React.ElementType> = {
  'food': Coffee,
  'еда': Coffee, 
  'travel': Globe,
  'путешествия': Globe,
  'science': Brain,
  'наука': Brain,
  'general': Star,
  'общее': Star,
  'music': Music,
  'музыка': Music,
  'films': Film,
  'фильмы': Film,
  'sport': Volleyball,
  'спорт': Volleyball,
  'literature': Book,
  'литература': Book,
  'art': Palette,
  'искусство': Palette,
  'technology': Cpu,
  'технологии': Cpu,
};

const CategoryIcon = ({category}:{category:string}) => {
  // Normalize category (lowercase, trim)
  const normalizedCategory = category.toLowerCase().trim();
  
  // Default fallback icon
  const IconComponent = categoryIcons[normalizedCategory] || Star;
  
  return <IconComponent className="w-5 h-5 text-white" />;
};
export default QuizCard;
