import entryData from "@/queries/entryData";

import useInsertEntry from "@/mutations/useInsertEntry";
import useUpdateEntry from "@/mutations/useUpdateEntry";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import PageMeal from "@/components/Page/Meal";
import PageMealLoading from "@/components/Page/Meal/Loading";

import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { useLocalSearchParams, Redirect, useRouter } from "expo-router";

export default function AddMeal() {
  const router = useRouter();

  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();
  const insertEntry = useInsertEntry();

  const { entry: entryId } = useLocalSearchParams<{
    entry: string;
  }>();

  const { data: entry, isLoading } = useQuery({
    ...entryData({ uuid: entryId }),
    select: (entries) => entries[0],
    enabled: !!entryId,
  });

  if (isLoading) {
    return <PageMealLoading editing={!!entry} />;
  }

  const meal = entry?.meal;
  const serving = entry?.serving;

  if (!meal || !serving) {
    return <Redirect href="/" />;
  }

  const handleSave = async (
    returnedServing: ServingData,
    returnedCreated: Date,
  ) => {
    if (entry) {
      // If we have a existing entry we'll update it
      await updateEntry.mutateAsync({
        ...entry,
        serving: returnedServing,
        created_at: returnedCreated,
      });

      router.replace("/");

      return;
    }

    // Otherwise we'll create a new entry
    await insertEntry.mutateAsync({
      meal_id: meal.uuid,
      serving: returnedServing,
      product_id: null,
      created_at: returnedCreated,
    });

    router.replace("/");
  };

  const handleDelete = async () => {
    if (!entry) {
      return;
    }

    await deleteEntry.mutateAsync(entry.uuid);

    router.replace("/");
  };

  const handleRepeat = async (serving: ServingData) => {
    if (!entry) {
      return;
    }

    await insertEntry.mutateAsync({
      serving,
      meal_id: meal.uuid,
      product_id: null,
    });

    router.replace("/");
  };

  return (
    <PageMeal
      meal={meal}
      serving={serving}
      created={entry?.created_at}
      createdVisible={true}
      onSave={handleSave}
      onDelete={entry ? handleDelete : undefined}
      onRepeat={entry ? handleRepeat : undefined}
    />
  );
}
