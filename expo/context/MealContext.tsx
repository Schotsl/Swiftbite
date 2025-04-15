import React, { createContext, ReactNode, useContext, useState } from "react";

import * as crypto from "expo-crypto";
import { MealData, ServingDataNew } from "@/schemas/serving";
import {
  MealProductWithProduct,
  MealProductWithProductInsert,
  MealWithProduct,
  MealWithProductInsert,
  Product,
  ProductInsert,
} from "../types";

import useDeleteMealProduct from "@/mutations/useDeleteMealProduct";
import useUpdateMealProduct from "@/mutations/useUpdateMealProduct";
import useInsertMealProduct from "@/mutations/useInsertMealProduct";
import useUpdateMeal from "@/mutations/useUpdateMeal";
import useInsertMeal from "@/mutations/useInsertMeal";

type MealContextType = {
  meal: MealWithProduct | MealWithProductInsert;

  removeMealProduct: (productId: string) => void;
  updateMealProduct: (productId: string, product: ServingDataNew) => void;
  insertMealProduct: (
    productId: string,
    product: ServingDataNew,
    productObject: Product,
  ) => void;

  saveChanges: (meal: MealData) => Promise<void>;
};

const MealContext = createContext<MealContextType | undefined>(undefined);

type MealProviderProps = {
  initial?: MealWithProduct;
  children: ReactNode;
};

const createMeal = (): MealWithProductInsert => ({
  uuid: crypto.randomUUID(),
  title: "",
  meal_product: [],
});

export const MealProvider: React.FC<MealProviderProps> = ({
  initial,
  children,
}) => {
  const [meal, setMeal] = useState<MealWithProduct | MealWithProductInsert>(
    initial || createMeal(),
  );

  const [removedProductIds, setRemovedProductIds] = useState<string[]>([]);
  const [insertedProducts, setInsertedProducts] = useState<
    Record<string, ServingDataNew>
  >({});

  const [updatedProducts, setUpdatedProducts] = useState<
    Record<string, ServingDataNew>
  >({});

  const insertMealMutation = useInsertMeal();
  const updateMealMutation = useUpdateMeal();
  const insertMealProductMutation = useInsertMealProduct();
  const updateMealProductMutation = useUpdateMealProduct();
  const deleteMealProductMutation = useDeleteMealProduct();

  const insertMealProduct = (
    productId: string,
    product: ServingDataNew,
    productObject: ProductInsert,
  ) => {
    setMeal((currentMeal) => {
      const meal: MealProductWithProductInsert = {
        meal_id: currentMeal.uuid!,
        product_id: productId,

        product: productObject,
        quantity: product.quantity,
      };

      return {
        ...currentMeal,
        meal_product: [...currentMeal.meal_product, meal],
      };
    });

    setInsertedProducts((prev) => ({ ...prev, [productId]: product }));
  };

  const updateMealProduct = (
    productId: string,
    { quantity }: { quantity: number },
  ) => {
    setMeal((currentMeal) => {
      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.map((mealProduct) =>
          mealProduct.product_id === productId
            ? { ...mealProduct, quantity }
            : mealProduct,
        ),
      };
    });

    setUpdatedProducts((prev) => ({ ...prev, [productId]: { quantity } }));
  };

  const removeMealProduct = (productId: string) => {
    setMeal((currentMeal) => {
      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.filter(
          (mealProduct) => mealProduct.product_id !== productId,
        ),
      };
    });

    setRemovedProductIds((prev) => [...prev, productId]);
  };

  const saveChanges = async (updatedMeal: MealData) => {
    if (!meal) return;

    const mealId = meal.uuid!;

    if (!initial) {
      // If the meal is new it's a Insert type
      const mealCast = { ...meal, ...updatedMeal } as MealWithProductInsert;
      await insertMealMutation.mutateAsync(mealCast);
    }

    // Prepare the payload for the meal update
    const updateMealPromise = async () => {
      if (!initial) {
        return Promise.resolve();
      }

      const { title } = updatedMeal;
      const { title: titleOriginal } = meal;

      if (title !== titleOriginal) {
        // If the meal isn't new it's a MealWithProduct
        const mealCast = { ...meal, title } as MealWithProduct;
        return updateMealMutation.mutateAsync(mealCast);
      }

      return Promise.resolve();
    };

    const insertMealProducts = Object.entries(insertedProducts);
    const insertMealProductsPromises = insertMealProducts.map(
      ([productId, product]) => {
        const { quantity } = product;
        return insertMealProductMutation.mutateAsync({
          quantity,
          meal_id: mealId,
          product_id: productId,
        });
      },
    );

    // Prepare the payload for the meal_product updates
    const updateMealProducts = Object.entries(updatedProducts);
    const updateMealProductsPromises = updateMealProducts.map(
      ([productId, product]) => {
        // Find the original product
        const productOriginal = initial?.meal_product.find(
          (product) => product.product_id === productId,
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
      },
    );

    // Prepare the payload for the meal_product delete
    const deleteMealProductsPromises = removedProductIds.map((productId) =>
      deleteMealProductMutation.mutateAsync({ mealId, productId }),
    );

    await Promise.all([
      updateMealPromise(),
      ...insertMealProductsPromises,
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

        insertMealProduct,
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
