import React, { createContext, ReactNode, useContext, useState } from "react";
import { ImageManipulator } from "expo-image-manipulator";

import * as Crypto from "expo-crypto";

import { renderToBase64 } from "@/helper";
import { Image, FoodItemLocal, Status } from "@/types";
import { fetchNutrition, fetchTitle } from "@/service";
import { Estimation } from "../../types";
import { supabase } from "@/supabase";

type FoodContextType = {
  foods: FoodItemLocal[];
  addFood: (image: Image) => FoodItemLocal;
  removeFood: (food: FoodItemLocal) => void;
  resizeFood: (food: FoodItemLocal) => void;
  analyzeFood: (food: FoodItemLocal) => void;
};

const FoodContext = createContext<FoodContextType>({
  foods: [],
  addFood: () => ({}) as FoodItemLocal,
  removeFood: () => {},
  resizeFood: () => {},
  analyzeFood: () => {},
});

type FoodProviderProps = {
  children: ReactNode;
};

export const FoodProvider = ({ children }: FoodProviderProps) => {
  const [foods, setFoods] = useState<FoodItemLocal[]>([]);

  const addFood = (image: Image) => {
    const id = Crypto.randomUUID();
    const status = Status.Idle;
    const pending = false;

    const food = { id, image, status, pending };

    setFoods((current) => [...current, food]);

    return food;
  };

  const removeFood = (food: FoodItemLocal) => {
    setFoods((current) =>
      current.filter((foodNeedle) => foodNeedle.id !== food.id)
    );
  };

  const resizeFood = async (food: FoodItemLocal) => {
    // Change the status to resizing
    setFoods((current) =>
      current.map((foodNeedle) =>
        food.id === foodNeedle.id
          ? { ...foodNeedle, status: Status.Resizing }
          : { ...foodNeedle }
      )
    );

    const { uri, width, height } = food.image;

    console.log("[DEVICE] Manipulating picture...");

    const smallManipulator = ImageManipulator.manipulate(uri);
    const largeManipulator = ImageManipulator.manipulate(uri);

    const isLandscape = width > height;

    smallManipulator.resize({
      width: isLandscape ? 512 : null,
      height: isLandscape ? null : 512,
    });

    largeManipulator.resize({
      width: isLandscape ? 1440 : null,
      height: isLandscape ? null : 1440,
    });

    const [imageBase64Small, imageBase64Large] = await Promise.all([
      renderToBase64(smallManipulator, true),
      renderToBase64(largeManipulator, false),
    ]);

    console.log("[DEVICE] Picture manipulated");

    setFoods((current) =>
      current.map((foodNeedle) => {
        const { id, pending } = foodNeedle;

        if (id !== food.id) return foodNeedle;

        const updated = {
          ...foodNeedle,
          status: Status.ResizingDone,
          pending: false,
          imageBase64Small,
          imageBase64Large,
        };

        if (pending) {
          analyzeFood(updated);
        }

        return updated;
      })
    );
  };

  const analyzeFood = (food: FoodItemLocal) => {
    // I don't love this but the user probably has the old object so we'll find the new one
    food = foods.find((foodNeedle) => foodNeedle.id === food.id)!;

    // Change the status or set pending flag to true if resizing is not done
    setFoods((current) =>
      current.map((foodNeedle) =>
        foodNeedle.id === food.id
          ? foodNeedle.status === Status.Resizing
            ? { ...foodNeedle, pending: true }
            : { ...foodNeedle, status: Status.Analyzing }
          : foodNeedle
      )
    );

    fetchTitle(food.imageBase64Small!).then((title: string) => {
      setFoods((current) =>
        current.map((foodNeedle) => {
          const complete = foodNeedle.id === food.id && foodNeedle.nutrition;
          const status = complete ? Status.AnalyzingDone : foodNeedle.status;

          const { id, nutrition } = foodNeedle;

          supabase
            .from("food")
            .insert({ id, title, nutrition })
            .then(() => {
              console.log("[Supabase] Inserted food");
            });

          return foodNeedle.id === food.id
            ? {
                ...foodNeedle,
                title,
                status,
              }
            : foodNeedle;
        })
      );
    });

    fetchNutrition(food.imageBase64Large!).then((nutrition: Estimation) => {
      setFoods((current) =>
        current.map((foodNeedle) => {
          const complete = foodNeedle.id === food.id && foodNeedle.title;
          const status = complete ? Status.AnalyzingDone : foodNeedle.status;

          const { id, title } = foodNeedle;

          supabase
            .from("food")
            .insert({ id, title, nutrition })
            .then(() => {
              console.log("[Supabase] Inserted food");
            });

          return foodNeedle.id === food.id
            ? {
                ...foodNeedle,
                status,
                nutrition,
              }
            : foodNeedle;
        })
      );
    });
  };

  return (
    <FoodContext.Provider
      value={{
        foods,
        addFood,
        removeFood,
        resizeFood,
        analyzeFood,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFoodProvider = () => {
  const context = useContext(FoodContext);

  if (!context) {
    throw new Error("useFoodProvider must be used within a FoodProvider");
  }

  return context;
};
