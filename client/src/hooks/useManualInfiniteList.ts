import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   1️⃣ Types
   ---------------------------------------------------------
   PageResult<T> → Structure returned by fetchPage function
   items   → data returned from backend
   hasMore → whether there are more pages to load
   ========================================================= */

type PageResult<T> = {
  items: T[];
  hasMore: boolean;
};

/* =========================================================
   2️⃣ Hook Input Arguments Type
   ---------------------------------------------------------
   queryArgs → filters / parameters for API query
   fetchPage → function responsible for fetching a page
   ========================================================= */

type UseManualInfiniteListArgs<T, Q> = {
  queryArgs: Q;
  fetchPage: (page: number, queryArgs: Q) => Promise<PageResult<T>>;
};

/* =========================================================
   3️⃣ Main Hook
   ---------------------------------------------------------
   Generic Hook for manual infinite pagination.

   T → Type of items returned (AuditLog, User, Product etc.)
   Q → Type of query parameters (filters, search params etc.)
   ========================================================= */

export function useManualInfiniteList<T, Q>({
  queryArgs,
  fetchPage,
}: UseManualInfiniteListArgs<T, Q>) {
  /* =========================================================
     4️⃣ State
     ---------------------------------------------------------
     items            → accumulated list of fetched items
     page             → current page number
     hasMore          → whether more pages exist
     isInitialLoading → loading state for first fetch
     isLoadingMore    → loading state for pagination
     error            → error state
     ========================================================= */

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  /* =========================================================
     5️⃣ Refs
     ---------------------------------------------------------
     requestIdRef → prevents race conditions from old requests
     fetchPageRef → always holds latest fetchPage function
     queryArgsRef → always holds latest queryArgs
     ========================================================= */

  const requestIdRef = useRef(0);
  const fetchPageRef = useRef(fetchPage);
  const queryArgsRef = useRef(queryArgs);

  /* =========================================================
     6️⃣ Keep fetchPage reference updated
     ========================================================= */

  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  /* =========================================================
     7️⃣ Keep queryArgs reference updated
     ========================================================= */

  useEffect(() => {
    queryArgsRef.current = queryArgs;
  }, [queryArgs]);

  /* =========================================================
     8️⃣ Query Key
     ---------------------------------------------------------
     Used to detect when filters change so the list resets
     ========================================================= */

  const queryKey = useMemo(() => JSON.stringify(queryArgs || {}), [queryArgs]);

  /* =========================================================
     9️⃣ Reset List State
     ---------------------------------------------------------
     Clears existing list when query parameters change
     ========================================================= */

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(false);
    setError(null);
  }, []);

  /* =========================================================
     🔟 Fetch Initial Page
     ---------------------------------------------------------
     Loads the first page of data
     Handles race conditions with requestIdRef
     ========================================================= */

  const fetchInitial = useCallback(async () => {
    requestIdRef.current += 1;
    const requestId = requestIdRef.current;

    setIsInitialLoading(true);
    setError(null);
    setPage(1);

    try {
      const result = await fetchPageRef.current(1, queryArgsRef.current);

      // Ignore outdated requests
      if (requestId !== requestIdRef.current) return;

      setItems(result.items || []);
      setHasMore(Boolean(result.hasMore));
    } catch (fetchError) {
      // Ignore outdated requests
      if (requestId !== requestIdRef.current) return;

      setError(fetchError);
      setItems([]);
      setHasMore(false);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsInitialLoading(false);
      }
    }
  }, []);

  /* =========================================================
     1️⃣1️⃣ Load Next Page
     ---------------------------------------------------------
     Appends next page of results to existing list
     ========================================================= */

  const loadMore = useCallback(async () => {
    // Prevent invalid calls
    if (isInitialLoading || isLoadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    try {
      const result = await fetchPageRef.current(nextPage, queryArgsRef.current);

      // Append new items
      setItems((prev) => [...prev, ...(result.items || [])]);

      setPage(nextPage);
      setHasMore(Boolean(result.hasMore));
    } catch (fetchError) {
      setError(fetchError);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isInitialLoading, isLoadingMore, page]);

  /* =========================================================
     1️⃣2️⃣ Auto Refetch When Filters Change
     ---------------------------------------------------------
     When queryArgs change:
       → reset list
       → fetch first page again
     ========================================================= */

  useEffect(() => {
    reset();
    fetchInitial();
  }, [queryKey, fetchInitial, reset]);

  /* =========================================================
     1️⃣3️⃣ Hook Return Values
     ---------------------------------------------------------
     items            → accumulated data
     page             → current page
     hasMore          → more pages available
     isInitialLoading → loading state for first fetch
     isLoadingMore    → loading state for pagination
     error            → error state
     loadMore         → fetch next page
     reset            → clear list manually
     retry            → retry initial fetch
     ========================================================= */

  return {
    items,
    page,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    error,
    loadMore,
    reset,
    retry: fetchInitial,
  };
}
