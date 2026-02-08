import {
  Brain,
  Globe,
  Star,
  Coffee,
  Film,
  Music,
  Book,
  Palette,
  Volleyball,
  Cpu
} from 'lucide-react';

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

interface CategoryIconProps {
  category: string;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const CategoryIcon = ({ 
  category, 
  active = false, 
  className = '', 
  style 
}: CategoryIconProps) => {
  const normalizedCategory = category.toLowerCase().trim();
  const IconComponent = categoryIcons[normalizedCategory] || Star;
  
  const baseClasses = `w-5 h-5 ${active ? 'text-primary' : 'text-textColor'}`;
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return (
    <IconComponent 
      className={combinedClasses} 
      style={style}
    />
  );
};

export default CategoryIcon;