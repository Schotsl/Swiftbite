import React, { createContext, ReactNode, useContext, useState } from "react";
import { ServingData } from "@/schemas/serving";
import { MealProductInsert, MealWithProduct } from "../types";

import * as crypto from "expo-crypto";

import useUpdateMeal from "@/mutations/useUpdateMeal";
import useInsertMeal from "@/mutations/useInsertMeal";
import useUpsertMealProduct from "@/mutations/useUpsertMealProduct";
import useDeleteMealProduct from "@/mutations/useDeleteMealProduct";

type MealContextType = {
  uuid: string;
  title: string;
  favorite: boolean;
  updating: boolean;
  mealProducts: MealProductInsert[];

  updateTitle: (title: string) => void;
  updateFavorite: (favorite: boolean) => void;

  removeMealProduct: (productId: string) => void;
  updateMealProduct: (productId: string, serving: ServingData) => void;
  insertMealProduct: (productId: string, serving: ServingData) => void;

  saveChanges: () => Promise<void>;
};

const MealContext = createContext<MealContextType | undefined>(undefined);

type MealProviderProps = {
  initial?: MealWithProduct;
  children: ReactNode;
};

export const MealProvider: React.FC<MealProviderProps> = ({
  initial,
  children,
}) => {
  const updating = !!initial;

  const insertMealMutation = useInsertMeal();
  const updateMealMutation = useUpdateMeal();
  const upsertMealProductMutation = useUpsertMealProduct();
  const deleteMealProductMutation = useDeleteMealProduct();

  const initialUuid = initial?.uuid || crypto.randomUUID();
  const initialTitle = initial?.title || "";
  const initialFavorite = initial?.favorite || false;
  const initialMealProducts = initial?.meal_products || [];

  const [title, setTitle] = useState(initialTitle);
  const [favorite, setFavorite] = useState(initialFavorite);
  const [mealProducts, setMealProducts] =
    useState<MealProductInsert[]>(initialMealProducts);

  const updateTitle = (title: string) => {
    setTitle(title);
  };

  const updateFavorite = (favorite: boolean) => {
    setFavorite(favorite);
  };

  const updateMealProduct = (productId: string, serving: ServingData) => {
    setMealProducts((prev) =>
      prev.map((mealProduct) =>
        mealProduct.product_id === productId
          ? { ...mealProduct, ...serving }
          : mealProduct
      )
    );
  };

  const insertMealProduct = (productId: string, serving: ServingData) => {
    setMealProducts((prev) => [
      ...prev,
      {
        meal_id: initialUuid,
        product_id: productId,

        selected_gram: serving.gram,
        selected_option: serving.option,
        selected_quantity: serving.quantity,
      },
    ]);
  };

  const removeMealProduct = (productId: string) => {
    setMealProducts((prev) =>
      prev.filter((mealProduct) => mealProduct.product_id !== productId)
    );
  };

  const saveChanges = async () => {
    if (updating) {
      // We delete every meal_product so we don't have to keep track of which ones are new
      const promiseDelete = deleteMealProductMutation.mutateAsync({
        mealId: initialUuid,
      });

      const promiseUpdate = updateMealMutation.mutateAsync({
        ...initial,
        title,
        favorite,
      });

      await Promise.all([promiseDelete, promiseUpdate]);

      const promiseArray = mealProducts.map((mealProduct) =>
        upsertMealProductMutation.mutateAsync(mealProduct)
      );

      await Promise.all(promiseArray);
    }

    await insertMealMutation.mutateAsync({
      uuid: initialUuid,
      title,
      favorite,
      ingredients: [],
    });

    const promiseArray = mealProducts.map((mealProduct) =>
      upsertMealProductMutation.mutateAsync(mealProduct)
    );

    await Promise.all(promiseArray);
  };

  return (
    <MealContext.Provider
      value={{
        uuid: initialUuid,
        title,
        updating,
        favorite,
        mealProducts,

        updateTitle,
        updateFavorite,

        removeMealProduct,
        updateMealProduct,
        insertMealProduct,
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
