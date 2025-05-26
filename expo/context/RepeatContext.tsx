import React from "react";

import { Repeat } from "@/types/repeat";
import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { MealWithProduct } from "@/types/meal";
import { createContext, ReactNode, useContext, useState } from "react";

import useUpdateRepeat from "@/mutations/useUpdateRepeat";
import useInsertRepeat from "@/mutations/useInsertRepeat";

type RepeatContextType = {
  time: Date;
  meal: MealWithProduct | null;
  product: Product | null;
  serving: ServingData | null;
  weekdays: string[];
  updating: boolean;

  remove: () => void;
  updateTime: (time: Date) => void;
  updateMeal: (meal: MealWithProduct) => void;
  updateProduct: (product: Product) => void;
  updateServing: (serving: ServingData) => void;
  updateWeekdays: (weekdays: string[]) => void;

  saveChanges: () => Promise<void>;
};

const RepeatContext = createContext<RepeatContextType | undefined>(undefined);

type RepeatProviderProps = {
  initial?: Repeat;
  children: ReactNode;
};

export const RepeatProvider: React.FC<RepeatProviderProps> = ({
  initial,
  children,
}) => {
  const updating = !!initial;

  const updateRepeat = useUpdateRepeat();
  const insertRepeat = useInsertRepeat();

  const initialTime = initial?.time || new Date();
  const initialWeekdays = initial?.weekdays || [];

  const initialMeal = initial?.meal || null;
  const initialProduct = initial?.product || null;
  const initialServing = initial?.serving || null;

  const [time, setTime] = useState(initialTime);
  const [weekdays, setWeekdays] = useState(initialWeekdays);

  const [meal, setMeal] = useState(initialMeal);
  const [product, setProduct] = useState(initialProduct);
  const [serving, setServing] = useState(initialServing);

  const remove = () => {
    setMeal(null);
    setProduct(null);
    setServing(null);
  };

  const updateTime = (time: Date) => {
    setTime(time);
  };

  const updateWeekdays = (weekdays: string[]) => {
    setWeekdays(weekdays);
  };

  const updateMeal = (meal: MealWithProduct) => {
    setMeal(meal);
  };

  const updateProduct = (product: Product) => {
    setProduct(product);
  };

  const updateServing = (serving: ServingData) => {
    setServing(serving);
  };

  const saveChanges = async () => {
    if (updating) {
      await updateRepeat.mutateAsync({
        ...initial,
        time,
        weekdays,

        serving: serving!,
        meal_id: meal?.uuid || null,
        product_id: product?.uuid || null,
      });

      return;
    }

    await insertRepeat.mutateAsync({
      time: time.toISOString(),
      weekdays,

      // TODO: Could probably be fancier but until I add meals it will work
      serving: serving!,
      meal_id: meal?.uuid || null,
      product_id: product?.uuid || null,
    });
  };

  return (
    <RepeatContext.Provider
      value={{
        time,
        meal,
        product,
        serving,
        weekdays,
        updating,

        remove,
        updateTime,
        updateMeal,
        updateWeekdays,
        updateProduct,
        updateServing,

        saveChanges,
      }}
    >
      {children}
    </RepeatContext.Provider>
  );
};

export const useEditRepeat = (): RepeatContextType => {
  const context = useContext(RepeatContext);

  if (context === undefined) {
    throw new Error("useEditRepeat must be used within an RepeatProvider");
  }

  return context;
};
