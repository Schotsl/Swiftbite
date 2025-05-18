import React from "react";

import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { MealProductInsert, MealWithProduct } from "@/types/meal";
import { createContext, ReactNode, useContext, useState } from "react";

import useUpdateMeal from "@/mutations/useUpdateMeal";
import useInsertMeal from "@/mutations/useInsertMeal";
import useUpsertMealProduct from "@/mutations/useUpsertMealProduct";
import useDeleteMealProduct from "@/mutations/useDeleteMealProduct";

type MealProductTemporary = Omit<MealProductInsert, "meal_id"> & {
  meal_id: string | null;
};

type MealContextType = {
  title: string;
  updating: boolean;
  mealProducts: MealProductTemporary[];

  updateTitle: (title: string) => void;

  updateMealProduct: (product: Product, serving: ServingData) => void;
  insertMealProduct: (product: Product, serving: ServingData) => void;
  removeMealProduct: (productId: string) => void;

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

  const initialTitle = initial?.title || "";
  const initialMealProducts = initial?.meal_products || [];

  const [title, setTitle] = useState(initialTitle);
  const [mealProducts, setMealProducts] =
    useState<MealProductTemporary[]>(initialMealProducts);

  const updateTitle = (title: string) => {
    setTitle(title);
  };

  const updateMealProduct = (product: Product, serving: ServingData) => {
    setMealProducts((prev) =>
      prev.map((mealProduct) =>
        mealProduct.product.uuid === product.uuid
          ? { ...mealProduct, serving }
          : mealProduct
      )
    );
  };

  const insertMealProduct = (product: Product, serving: ServingData) => {
    setMealProducts((prev) => [
      ...prev,
      {
        serving,
        meal_id: null,
        product: product,
        product_id: product.uuid,
      },
    ]);
  };

  const removeMealProduct = (productId: string) => {
    setMealProducts((prev) =>
      prev.filter((mealProduct) => mealProduct.product.uuid !== productId)
    );
  };

  const saveChanges = async () => {
    if (updating) {
      const { uuid } = initial;

      // We delete every meal_product so we don't have to keep track of which ones are new
      const promiseDelete = deleteMealProductMutation.mutateAsync(uuid);

      const promiseUpdate = updateMealMutation.mutateAsync({
        ...initial,
        title,
      });

      await Promise.all([promiseDelete, promiseUpdate]);

      const promiseArray = mealProducts.map((mealProduct) =>
        upsertMealProductMutation.mutateAsync({
          ...mealProduct,
          meal_id: uuid,
        })
      );

      await Promise.all(promiseArray);

      return;
    }

    const { uuid } = await insertMealMutation.mutateAsync({
      title,
    });

    const promiseArray = mealProducts.map((mealProduct) =>
      upsertMealProductMutation.mutateAsync({
        ...mealProduct,
        meal_id: uuid,
      })
    );

    await Promise.all(promiseArray);
  };

  return (
    <MealContext.Provider
      value={{
        title,
        updating,
        mealProducts,

        updateTitle,

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
