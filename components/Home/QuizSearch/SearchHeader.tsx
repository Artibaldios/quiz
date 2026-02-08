import { ChangeEvent } from 'react';

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder: string;
  locale: string;
}

export default function SearchHeader({
  query,
  onQueryChange,
  placeholder,
  locale
}: SearchHeaderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  return (
    <div className="relative flex justify-center gap-2 mb-6 items-center">
      <div className="relative flex-1 max-w-2xl">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none w-6 h-6 fill-blue-950 dark:fill-textColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-blue-950 dark:fill-textColor"
            d="M11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C12.8487 19 14.551 18.3729 15.9056 17.3199L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L17.3199 15.9056C18.3729 14.551 19 12.8487 19 11C19 6.58172 15.4183 3 11 3ZM5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11Z"
          />
        </svg>
        <input
          name="quiz"
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full px-10 py-3 glass border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg placeholder:text-textColor text-textColor"
          lang={locale}
        />
      </div>
    </div>
  );
}