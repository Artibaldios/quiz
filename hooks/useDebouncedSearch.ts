import { useState, useEffect, useRef, useCallback } from 'react';
import { type QuizCardProps } from '@/utils/helpers';

interface UseDebouncedSearchProps {
  query: string;
  locale: string;
  limit: number;
}

interface UseDebouncedSearchReturn {
  results: QuizCardProps[];
  initialLoading: boolean;
  incrementalLoading: boolean;
  hasQuery: boolean;
  hasMore: boolean;
  loadMore: () => void;
  page: number;
}

export function useDebouncedSearch({ 
  query, 
  locale,
  limit
}: UseDebouncedSearchProps): UseDebouncedSearchReturn {
  const [results, setResults] = useState<QuizCardProps[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [incrementalLoading, setIncrementalLoading] = useState(false);
  const [hasQuery, setHasQuery] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string, currentPage: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setPage(1);
      setHasMore(true);
      setInitialLoading(false);
      setIncrementalLoading(false);
      setHasQuery(false);
      return;
    }

    // Set appropriate loading state
    if (currentPage === 1) {
      setInitialLoading(true);
      setIncrementalLoading(false);
    } else {
      setIncrementalLoading(true);
    }

    try {
      const res = await fetch(
        `/api/quiz/search?q=${encodeURIComponent(searchQuery)}&locale=${encodeURIComponent(locale)}&page=${currentPage}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      
      if (currentPage === 1) {
        // Initial search - replace results
        setResults(data.results || data);
      } else {
        // Load more - append to existing results
        setResults(prev => [...prev, ...(data.results || data)]);
      }
      
      setHasMore(data.hasMore !== false && (data.results || data).length === limit);
    } catch (error) {
      console.error("Search error:", error);
      if (currentPage === 1) {
        setResults([]);
        setHasMore(false);
      }
    } finally {
      // Clear appropriate loading state
      if (currentPage === 1) {
        setInitialLoading(false);
      } else {
        setIncrementalLoading(false);
      }
    }
  }, [locale]);

  const loadMore = useCallback(() => {
    if (!hasMore || incrementalLoading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    performSearch(query.trim(), nextPage);
  }, [page, query, performSearch, hasMore, incrementalLoading]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    setHasQuery(trimmedQuery.length > 0);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (trimmedQuery) {
      // Reset to page 1 for new search
      setPage(1);
      setHasMore(true);
      debounceRef.current = setTimeout(() => {
        performSearch(trimmedQuery, 1);
      }, 300);
    } else {
      // Clear results when query is empty
      setResults([]);
      setPage(1);
      setHasMore(true);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  return { 
    results, 
    initialLoading,
    incrementalLoading,
    hasQuery, 
    hasMore, 
    loadMore,
    page 
  };
}
