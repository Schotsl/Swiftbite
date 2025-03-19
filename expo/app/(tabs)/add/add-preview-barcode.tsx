import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ingredientData from "../../../queries/ingredientData";
import openfoodData from "../../../queries/openfoodData";
import { Ingredient } from "../../../types";

export default function AddPreviewBarcodeScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams<{ barcode: string }>();

  const { data: ingredients, isLoading: isLoadingIngredient } = useQuery(
    ingredientData(barcode)
  );
  const { data: openfoodIngredient, isLoading: isLoadingOpenfood } = useQuery({
    ...openfoodData(barcode),
    enabled: !ingredients?.[0],
  });

  const ingredient = ingredients?.[0] || openfoodIngredient;
  const isLoading =
    isLoadingIngredient || (isLoadingOpenfood && !ingredients?.[0]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!ingredient) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No ingredient data found</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.ingredientContainer}>
        <Text style={styles.title}>{ingredient.title}</Text>
        <Text style={styles.servingSize}>
          Serving Size: {ingredient.portion}
        </Text>
        <View style={styles.nutritionContainer}>
          <Text style={styles.nutritionText}>
            Calories: {ingredient.calorie_100g}
          </Text>
          <Text style={styles.nutritionText}>
            Protein: {ingredient.protein_100g}g
          </Text>
          <Text style={styles.nutritionText}>
            Carbs: {ingredient.carbohydrate_100g}g
          </Text>
          <Text style={styles.nutritionText}>Fat: {ingredient.fat_100g}g</Text>
        </View>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push({
              pathname: "/add-preview",
              params: { ingredient: JSON.stringify(ingredient) },
            });
          }}
        >
          <Text style={styles.buttonText}>Add to Meal</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  ingredientContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  servingSize: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  nutritionContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  nutritionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#ff3b30",
  },
});
