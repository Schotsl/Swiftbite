import supabase from "@/utils/supabase";

import { fetch } from "expo/fetch";
import { ProductSearch } from "@/types";
import { useRef, useState, useCallback, useMemo } from "react";

export function useSearch() {
  const abort = useRef<AbortController | null>(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductSearch[]>([]);
  const [overloaded, setOverloaded] = useState(false);

  const search = useCallback(async (search: string, lang: string = "nl") => {
    setError(false);
    setProducts([]);
    setLoading(true);
    setOverloaded(false);

    if (search.length < 4) {
      setLoading(false);

      return;
    }

    if (abort.current) {
      abort.current.abort();
    }

    abort.current = new AbortController();

    const session = await supabase.auth.getSession();
    const bearer = session?.data.session?.access_token;

    if (!bearer) {
      throw new Error("User not authenticated");
    }

    const signal = abort.current.signal;
    const headers = {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    };

    console.log("[SEARCH] Submitting very expensive request");

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/search?query=${encodeURIComponent(search)}&lang=${lang}`,
      {
        signal,
        headers,
      }
    );

    if (response.status === 429) {
      setProducts([]);
      setLoading(false);
      setOverloaded(true);

      return;
    }

    if (!response.body || response.status !== 200) {
      setError(true);
      setProducts([]);
      setLoading(false);

      return;
    }

    const decoder = new TextDecoder();
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        setLoading(false);

        break;
      }

      const decoded = decoder.decode(value);
      const parsed = JSON.parse(decoded);

      if (parsed.length > 0) {
        setProducts(parsed);
        setLoading(false);
      }
    }
  }, []);

  return useMemo(
    () => ({ error, search, products, loading, overloaded }),
    [error, search, products, loading, overloaded]
  );
}
