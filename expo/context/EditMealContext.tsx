import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import { Meal, MealProductWithProduct, MealWithProduct } from "../types"; // Assuming you have a Meal type defined somewhere

interface EditMealContextType {
  meal: MealWithProduct | null;
  removeIngredient: (productId: string) => void;
  updateIngredientQuantity: (productId: string, quantity: number) => void;
}

const EditMealContext = createContext<EditMealContextType | undefined>(
  undefined
);

interface EditMealProviderProps {
  children: ReactNode;
  initialMeal: MealWithProduct; // We'll pass the initially fetched meal here
}

export const EditMealProvider: React.FC<EditMealProviderProps> = ({
  children,
  initialMeal,
}) => {
  const [meal, setMeal] = useState<MealWithProduct | null>(initialMeal);

  const updateIngredientQuantity = (productId: string, quantity: number) => {
    setMeal((currentMeal) => {
      if (!currentMeal) return null;
      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.map((mp) =>
          mp.product_id === productId ? { ...mp, quantity } : mp
        ),
      };
    });
  };

  const removeIngredient = (productId: string) => {
    setMeal((currentMeal) => {
      if (!currentMeal) return null;
      return {
        ...currentMeal,
        meal_product: currentMeal.meal_product.filter(
          (mp) => mp.product_id !== productId
        ),
      };
    });
  };

  return (
    <EditMealContext.Provider
      value={{ meal, updateIngredientQuantity, removeIngredient }}
    >
      {children}
    </EditMealContext.Provider>
  );
};

export const useEditMeal = (): EditMealContextType => {
  const context = useContext(EditMealContext);
  if (context === undefined) {
    throw new Error("useEditMeal must be used within an EditMealProvider");
  }
  return context;
};
