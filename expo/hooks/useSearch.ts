import supabase from "@/utils/supabase";

import { fetch } from "expo/fetch";
import { Enums } from "@/database.types";
import { Product } from "@/types/product";
import { useRef, useState, useCallback } from "react";

export function useSearch() {
  const abort = useRef<AbortController | null>(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [overloaded, setOverloaded] = useState(false);

  const reset = useCallback(() => {
    setError(false);
    setProducts([]);
    setLoading(false);
    setOverloaded(false);
  }, []);

  const search = useCallback(
    async (search: string, type: Enums<"type">, lang: string = "nl") => {
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

      const signal = abort.current.signal;

      try {
        const session = await supabase.auth.getSession();
        const bearer = session?.data.session?.access_token;

        if (!bearer) {
          throw new Error("User not authenticated");
        }

        const headers = {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
        };

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_SWIFTBITE_URL}/api/ai/search?query=${encodeURIComponent(search)}&lang=${lang}&type=${type}`,
          {
            signal,
            headers,
          }
        );

        if (response.status === 429) {
          setProducts([]);
          setOverloaded(true);
          return;
        }

        if (!response.body || response.status !== 200) {
          setProducts([]);
          setError(true);
          return;
        }

        const decoder = new TextDecoder();
        const reader = response.body.getReader();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const decoded = decoder.decode(value);
          const parsed = JSON.parse(decoded);

          if (parsed.length > 0) {
            setProducts(parsed);
          }
        }

        await reader.closed;
      } catch (error: any) {
        if (signal.aborted || error.name === "AbortError") {
          setProducts([]);

          return;
        }

        setProducts([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { error, search, reset, products, loading, overloaded };
}
