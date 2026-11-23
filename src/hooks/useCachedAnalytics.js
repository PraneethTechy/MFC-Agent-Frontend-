import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { apiCache } from "../services/apiCache";

/**
 * Custom hook for resilient, cached analytical data fetching with:
 * - Instant synchronous cache hydration on return navigation
 * - Seamless filter-triggered loading (keeps previous data visible to eliminate flicker)
 * - Automatic cancellation of stale in-flight requests (race condition prevention)
 * - Request deduplication across simultaneous calls
 * - Controlled cache invalidation when refreshKey updates
 */
export function useCachedAnalytics(url, params = null, options = {}) {
  const {
    staleTime = 60000,
    enabled = true,
    refreshKey = 0,
    initialData = null,
    onSuccess = null,
  } = options;

  // Stable cache key
  const cacheKey = useMemo(() => {
    if (!url) return null;
    return apiCache.createKey(url, params);
  }, [url, JSON.stringify(params)]);

  // Synchronous cache lookup on mount or key change
  const initialCache = useMemo(() => {
    if (!cacheKey) return null;
    return apiCache.get(cacheKey);
  }, [cacheKey]);

  // State initialization
  const [data, setData] = useState(() => initialCache?.data ?? initialData);
  const [loading, setLoading] = useState(() => !initialCache?.data && enabled);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const activeKeyRef = useRef(cacheKey);
  activeKeyRef.current = cacheKey;

  // Inform apiCache if refreshKey has incremented
  useEffect(() => {
    if (refreshKey !== undefined && refreshKey !== null) {
      apiCache.handleRefreshKeyChange(refreshKey);
    }
  }, [refreshKey]);

  // Core fetch function
  const executeFetch = useCallback(
    async (forceRefresh = false) => {
      if (!url || !enabled || !cacheKey) return;

      // Abort any pending request for this component
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Check current cache state
      const cached = apiCache.get(cacheKey);
      if (cached && !cached.isStale && !forceRefresh) {
        setData(cached.data);
        setLoading(false);
        setIsUpdating(false);
        setError(null);
        if (onSuccess) onSuccess(cached.data);
        return;
      }

      // If we already have data on screen (e.g. from previous filter or stale cache),
      // keep it visible and mark isUpdating = true (NO full skeleton / screen flicker)
      if (data !== null) {
        setIsUpdating(true);
        setLoading(false);
      } else {
        setLoading(true);
        setIsUpdating(false);
      }

      setError(null);

      try {
        const result = await apiCache.fetchWithCache(url, {
          params,
          staleTime,
          forceRefresh,
          signal: controller.signal,
        });

        // Ensure this response is still for the latest requested key
        if (activeKeyRef.current === cacheKey) {
          setData(result.data);
          setLoading(false);
          setIsUpdating(false);
          setError(null);
          if (onSuccess) onSuccess(result.data);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          // Normal cancellation due to filter change
          return;
        }
        if (activeKeyRef.current === cacheKey) {
          console.error(`Failed to fetch analytics for ${cacheKey}:`, err);
          setError(err.message || "Failed to load analytics");
          setLoading(false);
          setIsUpdating(false);
          // Notice: We deliberately do NOT wipe `data` on error, ensuring
          // previously valid metrics remain visible with an error indicator.
        }
      }
    },
    [url, cacheKey, enabled, staleTime, onSuccess]
  );

  // Trigger fetch whenever cacheKey, enabled, or refreshKey changes
  useEffect(() => {
    executeFetch(false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cacheKey, enabled, refreshKey, executeFetch]);

  // Explicit manual refetch (forces network retrieval, bypassing cache)
  const refetch = useCallback(() => {
    return executeFetch(true);
  }, [executeFetch]);

  return {
    data,
    loading,      // Cold load indicator (no data in cache)
    isUpdating,   // Warm update indicator (updating in background while previous data is visible)
    error,
    refetch,
    setData,
  };
}

export default useCachedAnalytics;
