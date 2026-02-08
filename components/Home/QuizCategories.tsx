'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoryIcon from './QuizSearch/CategoryIcon';
import { useLocale, useTranslations } from 'next-intl';

const categoryList = [
  { key: 'food' },
  { key: 'travel'},
  { key: 'science' },
  { key: 'general' },
  { key: 'music' },
  { key: 'films' },
  { key: 'sport' },
  { key: 'art'},
];

interface QuizCategoriesProps {
  activeCategory?: string;
}

const QuizCategories: React.FC<QuizCategoriesProps> = ({ activeCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string| null>(activeCategory || null);
  const [loading, setLoading] = useState<string>('');
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('categories');

  const orderedCategories = useMemo(() => {
    if (!activeCategory || !categoryList.find(cat => cat.key === activeCategory)) {
      return categoryList;
    }
    
    const activeCat = categoryList.find(cat => cat.key === activeCategory)!;
    const others = categoryList.filter(cat => cat.key !== activeCategory);
    
    return [activeCat, ...others];
  }, [activeCategory]);

  const handleCategoryClick = useCallback((category: string) => {
    router.push(`/${locale}/${category}`);
  }, [router]);


  return (
    <div className="overflow-x-auto gap-3 m-4 p-4 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden hidden lg:flex lg:justify-center">
      {orderedCategories.map(({ key }) => (
        <div
          key={key}
          className={`
            group relative flex items-center gap-3 px-4 py-3 rounded-full border-2 transition-all duration-200 cursor-pointer whitespace-nowrap min-w-fit
            hover:scale-[1.02] hover:border-blue-500 hover:bg-white/20 glass glass-border
            ${selectedCategory === key
              ? 'ring-2 ring-blue-500/50 bg-linear-to-r from-blue-500/20 to-purple-500/20 shadow-md border-blue-500 bg-white/10 backdrop-blur-sm'
              : ' bg-white/10 backdrop-blur-sm'
            }
            ${loading === key ? 'animate-pulse' : ''}
          `}
          onClick={() => handleCategoryClick(key)}
        >
          <div className="shrink-0">
            <CategoryIcon category={key} active={selectedCategory === key}/>
          </div>

          <div className="min-w-0">
            <p className={`font-semibold text-sm truncate transition-colors 
            ${selectedCategory === key
              ? 'text-primary'
              : 'text-textColor'
            }`}>
              {t(key)}
            </p>
          </div>

          {loading === key && (
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizCategories;
