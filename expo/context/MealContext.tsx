import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { MealProductWithProduct, MealWithProduct } from "../types"; // Assuming you have a Meal type defined somewhere
import useDeleteMealProduct from "@/mutations/useDeleteMealProduct";
import useUpdateMealProduct from "@/mutations/useUpdateMealProduct";

type ProductData = {
  quantity: number;
};

type MealContextType = {
  meal: MealWithProduct | null;

  // insertProduct: (productId: string, product: ProductData) => void;
  removeMealProduct: (productId: string) => void;
  updateMealProduct: (productId: string, product: ProductData) => void;

  saveChanges: () => Promise<void>;
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
    Record<string, ProductData>
  >({});

  const updateMealProductMutation = useUpdateMealProduct();
  const deleteMealProductMutation = useDeleteMealProduct();

  const updateMealProduct = (
    productId: string,
    { quantity }: { quantity: number }
  ) => {
    setMeal((currentMeal) => {
      if (!currentMeal) return null;
      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.map((mealProduct) =>
          mealProduct.product_id === productId
            ? { ...mealProduct, quantity }
            : mealProduct
        ),
      };
    });

    setRemovedProductIds((prev) => prev.filter((id) => id !== productId));
    setUpdatedProducts((prev) => ({ ...prev, [productId]: { quantity } }));
  };

  const removeMealProduct = (productId: string) => {
    setMeal((currentMeal) => {
      if (!currentMeal) return null;
      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.filter(
          (mealProduct) => mealProduct.product_id !== productId
        ),
      };
    });

    setRemovedProductIds((prev) => [...prev, productId]);
    setUpdatedProducts((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const saveChanges = async () => {
    if (!meal) return;

    const mealId = meal.uuid;

    const updateEntries = Object.entries(updatedProducts);
    const updatePromises = updateEntries.map(([productId, product]) => {
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
    });

    const deletePromises = removedProductIds.map((productId) =>
      // Way simpler just delete the product
      deleteMealProductMutation.mutateAsync({ mealId, productId })
    );

    await Promise.all([...updatePromises, ...deletePromises]);
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
