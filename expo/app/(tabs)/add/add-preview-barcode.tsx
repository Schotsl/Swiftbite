import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import useInsertEntry from "../../../mutations/useInsertEntry";
import useInsertIngredient from "../../../mutations/useInsertIngredient";
import ingredientData from "../../../queries/ingredientData";
import openfoodData from "../../../queries/openfoodData";

export default function AddPreviewBarcodeScreen() {
  const router = useRouter();

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const insertIngredient = useInsertIngredient();
  const insertEntry = useInsertEntry();

  const { barcode } = useLocalSearchParams<{ barcode: string }>();

  const { data: supabaseIngredients, isLoading: isLoadingIngredient } =
    useQuery(ingredientData(barcode));

  const { data: openfoodIngredients, isLoading: isLoadingOpenfood } = useQuery(
    openfoodData(barcode)
  );

  const loadingBackup = isLoadingOpenfood && !supabaseIngredients;
  const loading = isLoadingIngredient || loadingBackup;

  const ingredientSupabase = supabaseIngredients?.[0];
  const ingredientOpenfood = openfoodIngredients?.[0];
  const ingredient = ingredientSupabase ?? ingredientOpenfood;

  const OPTIONS = [
    {
      id: "1",
      label: `1 serving (${ingredient?.portion}g)`,
      grams: ingredient?.portion ?? 0,
    },
    { id: "2", label: "1 tablespoon (15g)", grams: 15 },
    { id: "3", label: "1 teaspoon (5g)", grams: 5 },
    { id: "4", label: "1/2 cup (100g)", grams: 100 },
    { id: "5", label: "1 cup (200g)", grams: 200 },
    { id: "6", label: "Custom amount", grams: 0, isCustom: true },
  ];

  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(0);
  const [customAmount, setCustomAmount] = useState("1");

  const handleSave = async () => {
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
    const multiplier = customAmount ? parseFloat(customAmount) : 1;
    const amountInGrams = OPTIONS[selected].grams * multiplier;

    // Insert an entry with the selected portion size
    await insertEntry.mutateAsync({
      type: "ingredient",
      title: null,
      meal_id: null,
      ingredient_id: savedIngredient!.uuid,
      consumed_unit: "gram",
      consumed_quantity: amountInGrams,
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
          // This entire component needs reworking since there's also no placeholder image
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

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Size option:</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModal(true)}
              >
                <Text style={styles.dropdownText}>
                  {OPTIONS[selected].label}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity:</Text>
              <TextInput
                style={styles.quantityInput}
                placeholder="1"
                keyboardType="numeric"
                value={customAmount}
                onChangeText={setCustomAmount}
              />
            </View>
          </View>

          {/* Nutrition Information */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.sectionTitle}>Nutrition Information</Text>
            <Text style={styles.nutritionSubtitle}>Based on 100g</Text>

            <View style={styles.nutritionTable}>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>
                  {ingredient?.calorie_100g ?? 0} kcal
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>
                  {ingredient?.protein_100g ?? 0}g
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Carbohydrates</Text>
                <Text style={styles.nutritionValue}>
                  {ingredient?.carbohydrate_100g ?? 0}g
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>
                  {ingredient?.fat_100g ?? 0}g
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Fiber</Text>
                <Text style={styles.nutritionValue}>
                  {ingredient?.fiber_100g ?? 0}g
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Sugar</Text>
                <Text style={styles.nutritionValue}>
                  {ingredient?.carbohydrate_sugar_100g ?? 0}g
                </Text>
              </View>

              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>Sodium</Text>
                <Text style={styles.nutritionValue}>
                  {ingredient?.sodium_100g ?? 0}mg
                </Text>
              </View>
            </View>
          </View>

          {/* Dietary Information */}
          {/* <View style={styles.dietaryContainer}>
            <Text style={styles.sectionTitle}>Dietary Information</Text>
            <View style={styles.tagsContainer}>
              {ingredient.dietaryInfo.map((info, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{info}</Text>
                </View>
              ))}
            </View>
          </View> */}

          {/* Allergens */}
          {/* <View style={styles.allergensContainer}>
            <Text style={styles.sectionTitle}>Allergens</Text>
            <Text style={styles.allergenText}>
              {ingredient.allergens.join(", ")}
            </Text>
          </View> */}
        </View>
      </ScrollView>

      {/* Add to Meal Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleSave}>
          <Text style={styles.addButtonText}>Add to meal</Text>
        </TouchableOpacity>
      </View>

      {/* Serving Size Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Serving Size</Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={OPTIONS}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.servingOption,
                    selected === index && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelected(index);
                    setModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.servingOptionText,
                      selected === index && styles.selectedOptionText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selected === index && (
                    <Ionicons name="checkmark" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    color: "#333",
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  quantityContainer: {
    marginTop: 10,
    flexDirection: "column",
  },
  quantityLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  nutritionContainer: {
    marginBottom: 20,
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
  },
  nutritionTable: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  nutritionLabel: {
    fontSize: 16,
    color: "#333",
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  dietaryContainer: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#e8f4f8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#0077b6",
    fontSize: 14,
  },
  allergensContainer: {
    marginBottom: 20,
  },
  allergenText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  servingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#4CAF50",
  },
  servingOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "500",
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
