import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import Table from "@/components/Table";
import useInsertEntry from "@/mutations/useInsertEntry";
import useInsertIngredient from "@/mutations/useInsertIngredient";
import ingredientData from "@/queries/ingredientData";
import openfoodData from "@/queries/openfoodData";
import { ServingData, servingSchema } from "@/schemas/serving";

// Define the type for dropdown option
type Option = {
  id: string;
  label: string;
  value: number;
};

export default function AddPreviewBarcodeScreen() {
  const router = useRouter();

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const insertIngredient = useInsertIngredient();
  const insertEntry = useInsertEntry();

  const { barcode } = useLocalSearchParams<{ barcode: string }>();

  const { data: supabaseIngredients, isLoading: isLoadingIngredient } =
    useQuery(ingredientData({ openfood: barcode }));

  const { data: openfoodIngredients, isLoading: isLoadingOpenfood } = useQuery(
    openfoodData({ barcode })
  );

  const loadingBackup = isLoadingOpenfood && !supabaseIngredients;
  const loading = isLoadingIngredient || loadingBackup;

  const ingredientSupabase = supabaseIngredients?.[0];
  const ingredientOpenfood = openfoodIngredients;
  const ingredient = ingredientSupabase ?? ingredientOpenfood;

  const servingSizeOptions = [
    {
      id: "1",
      label: `1 serving (${ingredient?.portion}g)`,
      value: ingredient?.portion ?? 0,
    },
    { id: "2", label: "1 tablespoon (15g)", value: 15 },
    { id: "3", label: "1 teaspoon (5g)", value: 5 },
    { id: "4", label: "1/2 cup (100g)", value: 100 },
    { id: "5", label: "1 cup (200g)", value: 200 },
    { id: "6", label: "Custom amount", value: 1 },
  ];

  // Initialize react-hook-form with zod resolver
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServingData>({
    resolver: zodResolver(servingSchema),
    defaultValues: {
      sizeOption: "1",
      quantity: "1",
    },
  });

  // Watch the current selected size option
  const selectedSizeOption = watch("sizeOption");

  const nutritionData = [
    {
      id: 1,
      label: "Calories",
      value: `${ingredient?.calorie_100g ?? 0} kcal`,
    },
    { id: 2, label: "Protein", value: `${ingredient?.protein_100g ?? 0}g` },
    {
      id: 3,
      label: "Carbohydrates",
      value: `${ingredient?.carbohydrate_100g ?? 0}g`,
    },
    { id: 4, label: "Fat", value: `${ingredient?.fat_100g ?? 0}g` },
    { id: 5, label: "Fiber", value: `${ingredient?.fiber_100g ?? 0}g` },
    {
      id: 6,
      label: "Sugar",
      value: `${ingredient?.carbohydrate_sugar_100g ?? 0}g`,
    },
    { id: 7, label: "Sodium", value: `${ingredient?.sodium_100g ?? 0}mg` },
  ];

  const onSubmit = async (data: ServingData) => {
    // Insert the ingredient if it doesn't already exist
    let savedIngredient = ingredientSupabase;

    if (!ingredientSupabase) {
      savedIngredient = await insertIngredient.mutateAsync({
        type: "openfood",
        title: ingredient?.title ?? null,
        brand: ingredient?.brand ?? null,
        image: ingredient?.image ?? null,
        icon_id: null,
        openfood_id: ingredient?.openfood_id ?? null,
        portion: ingredient?.portion ?? null,
        calcium_100g: ingredient?.calcium_100g ?? null,
        calorie_100g: ingredient?.calorie_100g ?? null,
        carbohydrate_100g: ingredient?.carbohydrate_100g ?? null,
        carbohydrate_sugar_100g: ingredient?.carbohydrate_sugar_100g ?? null,
        cholesterol_100g: ingredient?.cholesterol_100g ?? null,
        fat_100g: ingredient?.fat_100g ?? null,
        fat_saturated_100g: ingredient?.fat_saturated_100g ?? null,
        fat_trans_100g: ingredient?.fat_trans_100g ?? null,
        fat_unsaturated_100g: ingredient?.fat_unsaturated_100g ?? null,
        fiber_100g: ingredient?.fiber_100g ?? null,
        iron_100g: ingredient?.iron_100g ?? null,
        micros_100g: null,
        potassium_100g: ingredient?.potassium_100g ?? null,
        protein_100g: ingredient?.protein_100g ?? null,
        sodium_100g: ingredient?.sodium_100g ?? null,
      });
    }

    // Calculate amount - use base amount from selected option multiplied by quantity
    const selectedOption = servingSizeOptions.find(
      (option) => option.id === data.sizeOption
    );
    const amountMultiplier = data.quantity ? parseFloat(data.quantity) : 1;
    const amountGrams = (selectedOption?.value ?? 0) * amountMultiplier;

    // Insert an entry with the selected portion size
    await insertEntry.mutateAsync({
      type: "ingredient",
      title: null,
      meal_id: null,
      ingredient_id: savedIngredient!.uuid,
      consumed_unit: "gram",
      consumed_quantity: amountGrams,
    });

    router.push("/");
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Fetching ingredient details...</Text>

          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonTextLarge} />
            <View style={styles.skeletonTextSmall} />
            <View style={styles.skeletonTextSmall} />
            <View style={styles.skeletonBox} />
            <View style={styles.skeletonTextMedium} />
            <View style={styles.skeletonList}>
              <View style={styles.skeletonListItem} />
              <View style={styles.skeletonListItem} />
              <View style={styles.skeletonListItem} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {ingredient?.image && (
          <Image
            source={{ uri: ingredient?.image }}
            style={[
              styles.image,
              {
                aspectRatio:
                  imageWidth && imageHeight ? imageWidth / imageHeight : 1,
              },
            ]}
            resizeMode="cover"
            onLoad={(event) => {
              setImageWidth(event.nativeEvent.source.width ?? 0);
              setImageHeight(event.nativeEvent.source.height ?? 0);
            }}
          />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{ingredient?.title}</Text>
          <Text style={styles.brand}>{ingredient?.brand}</Text>

          <View style={styles.barcodeContainer}>
            <Ionicons name="barcode-outline" size={18} color="#666" />
            <Text style={styles.barcode}>{ingredient?.openfood_id}</Text>
          </View>

          {/* Serving Size Selector */}
          <View style={styles.servingContainer}>
            <Text style={styles.sectionTitle}>Serving Size</Text>

            <Dropdown
              label="Size option:"
              placeholder="Select a size option"
              options={servingSizeOptions}
              selected={selectedSizeOption}
              onSelect={(option: Option) => {
                setValue("sizeOption", option.id);
              }}
            />

            <Input
              name="quantity"
              type="numeric"
              label="Quantity:"
              placeholder="1"
              control={control}
              error={errors.quantity?.message}
            />
          </View>

          {/* Nutrition Information */}
          <Table
            title="Nutrition Information"
            subtitle="Based on 100g"
            data={nutritionData}
          />
        </View>
      </ScrollView>

      <View
        style={{
          padding: 16,
          paddingBottom: 0,

          borderTopWidth: 1,
          borderTopColor: "#eee",
        }}
      >
        <Button
          onPress={handleSubmit(onSubmit)}
          title="Add to meal"
          icon="fast-food-outline"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 0,
  },
  container: {
    backgroundColor: "#f8f8f8",
  },
  image: {
    marginTop: 12,
    marginLeft: 28,
    marginBottom: -28,
    height: 120,
    zIndex: 1000,
    width: "auto",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  infoContainer: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  brand: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  barcode: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  servingContainer: {
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    // marginBottom: 12,
  },
  loadingContainer: {
    backgroundColor: "#f8f8f8",
  },
  loadingContent: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    marginBottom: 30,
  },
  skeletonContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  skeletonImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 20,
  },
  skeletonTextLarge: {
    width: "70%",
    height: 24,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonTextMedium: {
    width: "50%",
    height: 18,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonTextSmall: {
    width: "40%",
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonBox: {
    width: "100%",
    height: 50,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 20,
  },
  skeletonList: {
    width: "100%",
  },
  skeletonListItem: {
    width: "100%",
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
});
