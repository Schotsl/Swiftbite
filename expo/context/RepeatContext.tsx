import React from "react";

import { Repeat } from "@/types/repeat";
import { Product } from "@/types/product";
import { ServingData } from "@/schemas/serving";
import { createContext, ReactNode, useContext, useState } from "react";

import useUpdateRepeat from "@/mutations/useUpdateRepeat";
import useInsertRepeat from "@/mutations/useInsertRepeat";
import useDeleteRepeat from "@/mutations/useDeleteRepeat";

type RepeatContextType = {
  time: Date;
  product: Product | null;
  serving: ServingData | null;
  weekdays: string[];
  updating: boolean;

  removeRepeat: () => void;
  removeProduct: () => void;

  updateTime: (time: Date) => void;
  updateWeekdays: (weekdays: string[]) => void;
  updateProduct: (product: Product) => void;
  updateServing: (serving: ServingData) => void;

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

  const deleteRepeat = useDeleteRepeat();
  const updateRepeat = useUpdateRepeat();
  const insertRepeat = useInsertRepeat();

  const initialTime = initial?.time || new Date();
  const initialWeekdays = initial?.weekdays || [];

  const initialProduct = initial?.product || null;
  const initialServing = initial?.serving || null;

  const [time, setTime] = useState(initialTime);
  const [weekdays, setWeekdays] = useState(initialWeekdays);

  const [product, setProduct] = useState(initialProduct);
  const [serving, setServing] = useState(initialServing);

  const removeProduct = () => {
    setProduct(null);
    setServing(null);
  };

  const removeRepeat = async () => {
    if (!updating) {
      return;
    }
    deleteRepeat.mutateAsync(initial?.uuid);
  };

  const updateTime = (time: Date) => {
    setTime(time);
  };

  const updateWeekdays = (weekdays: string[]) => {
    setWeekdays(weekdays);
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

        // TODO: Could probably be fancier but until I add meals it will work
        serving: serving!,
        product_id: product!.uuid,
      });

      return;
    }

    await insertRepeat.mutateAsync({
      time,
      weekdays,

      // TODO: Could probably be fancier but until I add meals it will work
      serving: serving!,
      meal_id: null,
      product_id: product!.uuid,
    });
  };

  return (
    <RepeatContext.Provider
      value={{
        time,
        product,
        serving,
        weekdays,
        updating,

        removeRepeat,
        removeProduct,

        updateTime,
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
