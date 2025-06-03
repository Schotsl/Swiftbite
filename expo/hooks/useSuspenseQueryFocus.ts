import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  QueryKey,
  useSuspenseQuery,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";

export default function useSuspenseQueryFocus<
  TQuery = unknown,
  TError = Error,
  TData = TQuery,
  TKey extends QueryKey = QueryKey,
>(
  query: UseSuspenseQueryOptions<TQuery, TError, TData, TKey>,
): UseSuspenseQueryResult<TData, TError> {
  const focus = useIsFocused();
  const result = useSuspenseQuery<TQuery, TError, TData, TKey>(query);

  const { refetch } = result;

  useEffect(() => {
    if (!focus) {
      return;
    }

    refetch();
  }, [focus, refetch]);

  return result;
}
