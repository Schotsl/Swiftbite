import supabase from "@/utils/supabase";

import { fetch } from "expo/fetch";
import { ProductSearch } from "@/types";
import { useRef, useState, useCallback, useMemo } from "react";

export function useSearch() {
  const abort = useRef<AbortController | null>(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductSearch[]>([]);

  const search = useCallback(async (search: string, lang: string = "nl") => {
    setError(false);
    setProducts([]);
    setLoading(true);

    if (search.length < 3) {
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

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/search?query=${encodeURIComponent(search)}&lang=${lang}`,
      {
        signal,
        headers,
      },
    );

    if (!response.body) {
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
    () => ({ error, search, products, loading }),
    [error, search, products, loading],
  );
}
