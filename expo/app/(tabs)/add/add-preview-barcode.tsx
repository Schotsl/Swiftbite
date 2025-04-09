import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import useInsertProduct from "@/mutations/useInsertProduct";
import openfoodData from "@/queries/openfoodData";
import { ServingData, servingSchema } from "@/schemas/serving";
import { Product } from "@/types";

// Define the type for dropdown option
type Option = {
  id: string;
  label: string;
  value: number;
};

export default function AddPreviewBarcodeScreen() {
  const focus = useIsFocused();
  const router = useRouter();

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const insertProduct = useInsertProduct();
  const insertEntry = useInsertEntry();

  const { title, brand, quantity, barcode } = useLocalSearchParams<{
    title?: string;
    brand?: string;
    barcode?: string;
    quantity?: string;
  }>();

  const { data: openfoodProduct, isLoading: isLoadingOpenfood } = useQuery(
    openfoodData({ barcode, title, brand, quantity }),
  );

  // const loadingBackup = isLoadingOpenfood && !supabaseProducts;
  // const loading = isLoadingProduct || loadingBackup;

  // const productSupabase = supabaseProducts?.[0];
  // const productOpenfood = openfoodProducts;
  // const product = productSupabase ?? (productOpenfood as Product);

  const product = openfoodProduct as Product;
  const loading = isLoadingOpenfood;

  const servingSizeOptions = [
    {
      id: "1",
      label: `1 serving (${product?.serving}${product?.serving_unit})`,
      value: product?.serving ?? 0,
    },
    { id: "2", label: "1 tablespoon (15g)", value: 15 },
    { id: "3", label: "1 teaspoon (5g)", value: 5 },
    { id: "4", label: "1/2 cup (100g)", value: 100 },
    { id: "5", label: "1 cup (200g)", value: 200 },
    { id: "6", label: "Custom amount", value: 1 },
  ];

  // Initialize react-hook-form with zod resolver
  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
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
      value: `${product?.calorie_100g ?? 0} kcal`,
    },
    { id: 2, label: "Protein", value: `${product?.protein_100g ?? 0}g` },
    {
      id: 3,
      label: "Carbohydrates",
      value: `${product?.carbohydrate_100g ?? 0}g`,
    },
    { id: 4, label: "Fat", value: `${product?.fat_100g ?? 0}g` },
    { id: 5, label: "Fiber", value: `${product?.fiber_100g ?? 0}g` },
    {
      id: 6,
      label: "Sugar",
      value: `${product?.carbohydrate_sugar_100g ?? 0}g`,
    },
    { id: 7, label: "Sodium", value: `${product?.sodium_100g ?? 0}mg` },
  ];

  const onSubmit = async (data: ServingData) => {
    // Insert the product if it doesn't already exist
    // let savedProduct = productSupabase;

    // if (!productSupabase) {
    const savedProduct = await insertProduct.mutateAsync({
      type: "openfood",
      estimated: product?.estimated ?? false,
      quantity: product?.quantity ?? null,
      quantity_unit: product?.quantity_unit ?? null,

      title: product?.title ?? null,
      brand: product?.brand ?? null,
      image: product?.image ?? null,

      icon_id: null,
      openfood_id: product?.openfood_id ?? null,

      serving: product?.serving ?? null,
      serving_unit: product?.serving_unit ?? null,

      calcium_100g: product?.calcium_100g ?? null,
      calorie_100g: product?.calorie_100g ?? null,
      carbohydrate_100g: product?.carbohydrate_100g ?? null,
      carbohydrate_sugar_100g: product?.carbohydrate_sugar_100g ?? null,
      cholesterol_100g: product?.cholesterol_100g ?? null,
      fat_100g: product?.fat_100g ?? null,
      fat_saturated_100g: product?.fat_saturated_100g ?? null,
      fat_trans_100g: product?.fat_trans_100g ?? null,
      fat_unsaturated_100g: product?.fat_unsaturated_100g ?? null,
      fiber_100g: product?.fiber_100g ?? null,
      iron_100g: product?.iron_100g ?? null,
      potassium_100g: product?.potassium_100g ?? null,
      protein_100g: product?.protein_100g ?? null,
      sodium_100g: product?.sodium_100g ?? null,

      micros_100g: null,
    });

    // Calculate amount - use base amount from selected option multiplied by quantity
    const selectedOption = servingSizeOptions.find(
      (option) => option.id === data.sizeOption,
    );
    const amountMultiplier = data.quantity ? parseFloat(data.quantity) : 1;
    const amountGrams = (selectedOption?.value ?? 0) * amountMultiplier;

    // Insert an entry with the selected serving size
    await insertEntry.mutateAsync({
      type: "product",
      title: null,
      meal_id: null,
      product_id: savedProduct!.uuid,
      consumed_unit: "gram",
      consumed_quantity: amountGrams,
    });

    router.replace("/");
  };

  // Reset the page's state when is the screen is unfocused
  useEffect(() => {
    if (focus) {
      return;
    }

    reset();

    setImageWidth(0);
    setImageHeight(0);
  }, [focus, reset]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Fetching product details...</Text>

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
        {product?.image && (
          <Image
            source={{ uri: product?.image }}
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
          {product?.estimated && (
            <View>
              <Ionicons name="warning-outline" size={20} color="red" />
              <Text style={{ color: "red", marginTop: 4, marginBottom: 16 }}>
                The nutritions have been estimated by comparing the product to
                other products in our database.
              </Text>
            </View>
          )}
          <Text style={styles.name}>{product?.title}</Text>
          <Text style={styles.brand}>{product?.brand}</Text>

          <View style={styles.barcodeContainer}>
            <Ionicons name="barcode-outline" size={18} color="#666" />
            <Text style={styles.barcode}>{product?.openfood_id}</Text>
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
