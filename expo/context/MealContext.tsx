import React, { createContext, ReactNode, useContext, useState } from "react";

import { MealData, ServingDataNew } from "@/schemas/serving";
import { MealProductWithProduct, MealWithProduct } from "../types";

import useDeleteMealProduct from "@/mutations/useDeleteMealProduct";
import useUpdateMealProduct from "@/mutations/useUpdateMealProduct";
import useUpdateMeal from "@/mutations/useUpdateMeal";

type MealContextType = {
  meal: MealWithProduct | null;

  // insertProduct: (productId: string, product: ProductData) => void;
  removeMealProduct: (productId: string) => void;
  updateMealProduct: (productId: string, product: ServingDataNew) => void;

  saveChanges: (meal: MealData) => Promise<void>;
};

const MealContext = createContext<MealContextType | undefined>(undefined);

type MealProviderProps = {
  children: ReactNode;
  initialMeal: MealWithProduct;
};

export const MealProvider: React.FC<MealProviderProps> = ({
  children,
  initialMeal,
}) => {
  const [meal, setMeal] = useState<MealWithProduct | null>(initialMeal);

  const [removedProductIds, setRemovedProductIds] = useState<string[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<
    Record<string, ServingDataNew>
  >({});

  const updateMealMutation = useUpdateMeal();
  const updateMealProductMutation = useUpdateMealProduct();
  const deleteMealProductMutation = useDeleteMealProduct();

  const updateMealProduct = (
    productId: string,
    { quantity }: { quantity: number }
  ) => {
    setMeal((currentMeal) => {
      if (!currentMeal) {
        return null;
      }

      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.map((mealProduct) =>
          mealProduct.product_id === productId
            ? { ...mealProduct, quantity }
            : mealProduct
        ),
      };
    });

    setUpdatedProducts((prev) => ({ ...prev, [productId]: { quantity } }));
  };

  const removeMealProduct = (productId: string) => {
    setMeal((currentMeal) => {
      if (!currentMeal) {
        return null;
      }

      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.filter(
          (mealProduct) => mealProduct.product_id !== productId
        ),
      };
    });

    setRemovedProductIds((prev) => [...prev, productId]);
  };

  const saveChanges = async (updatedMeal: MealData) => {
    if (!meal) return;

    const mealId = meal.uuid;

    // Prepare the payload for the meal update
    const updateMealPromise = async () => {
      const { title } = updatedMeal;
      const { title: titleOriginal } = meal;

      if (title !== titleOriginal) {
        return updateMealMutation.mutateAsync({ ...meal, title });
      }

      return Promise.resolve();
    };

    // Prepare the payload for the meal_product updates
    const updateMealProducts = Object.entries(updatedProducts);
    const updateMealProductsPromises = updateMealProducts.map(
      ([productId, product]) => {
        // Find the original product
        const productOriginal = initialMeal.meal_product.find(
          (product) => product.product_id === productId
        );

        // If the product is not found return a resolved promise
        if (!productOriginal) return Promise.resolve();

        // Create a payload with the original product and the updated quantity
        const productUpdated: MealProductWithProduct = {
          ...productOriginal,
          quantity: product.quantity,
        };

        // Update the product
        return updateMealProductMutation.mutateAsync(productUpdated);
      }
    );

    // Prepare the payload for the meal_product delete
    const deleteMealProductsPromises = removedProductIds.map((productId) =>
      deleteMealProductMutation.mutateAsync({ mealId, productId })
    );

    await Promise.all([
      updateMealPromise(),
      ...updateMealProductsPromises,
      ...deleteMealProductsPromises,
    ]);

    setUpdatedProducts({});
    setRemovedProductIds([]);
  };

  return (
    <MealContext.Provider
      value={{
        meal,
        updateMealProduct,
        removeMealProduct,
        saveChanges,
      }}
    >
      {children}
    </MealContext.Provider>
  );
};

export const useEditMeal = (): MealContextType => {
  const context = useContext(MealContext);

  if (context === undefined) {
    throw new Error("useEditMeal must be used within an MealProvider");
  }

  return context;
};
