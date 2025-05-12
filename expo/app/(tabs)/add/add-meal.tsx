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
import { EntryWithMeal } from "@/types";
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
    ...entryData<EntryWithMeal>({}),
    select: (entries) => entries.find((entry) => entry.uuid === entryId),
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

  if (!meal) {
    return <Redirect href="/" />;
  }

  // The serving value is only undefined if it's AI generated so we can enforce the type
  const serving = {
    gram: entry.consumed_gram!,
    option: entry.consumed_option!,
    quantity: entry.consumed_quantity!,
  };

  const handleSave = async (returnedServing: ServingData) => {
    if (entry) {
      // If we have a existing entry we'll update it
      await updateEntry.mutateAsync({
        ...entry,
        consumed_gram: returnedServing.gram,
        consumed_option: returnedServing.option,
        consumed_quantity: returnedServing.quantity,
      });

      router.replace("/");

      return;
    }

    // Otherwise we'll create a new entry
    await insertEntry.mutateAsync({
      meal_id: meal.uuid,
      product_id: null,
      consumed_gram: returnedServing.gram,
      consumed_option: returnedServing.option,
      consumed_quantity: returnedServing.quantity,
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
      meal_id: meal.uuid,
      product_id: null,
      consumed_gram: serving.gram,
      consumed_option: serving.option,
      consumed_quantity: serving.quantity,
    });

    router.replace("/");
  };

  return (
    <PageMeal
      meal={meal}
      serving={serving}
      onSave={handleSave}
      onDelete={entry ? handleDelete : undefined}
      onRepeat={entry ? handleRepeat : undefined}
    />
  );
}
