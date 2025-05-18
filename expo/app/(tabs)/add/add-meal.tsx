import entryData from "@/queries/entryData";

import useInsertEntry from "@/mutations/useInsertEntry";
import useUpdateEntry from "@/mutations/useUpdateEntry";
import useDeleteEntry from "@/mutations/useDeleteEntry";

import PageMeal from "@/components/Page/Meal";
import HeaderLoading from "@/components/Header/Loading";
import ProductStatus from "@/components/Product/Status";

import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ServingData } from "@/schemas/serving";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

export default function AddPreviewBarcodeScreen() {
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
    return (
      <View style={{ padding: 32, minHeight: "100%" }}>
        <HeaderLoading />

        <ProductStatus status="We zijn de maaltijd in onze database aan het zoeken" />
      </View>
    );
  }

  const meal = entry?.meal;
  const serving = entry?.serving;

  if (!meal || !serving) {
    return <Redirect href="/" />;
  }

  const handleSave = async (
    returnedServing: ServingData,
    returnedCreated: Date
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
