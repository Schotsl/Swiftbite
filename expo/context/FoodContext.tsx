import React, { createContext, ReactNode, useContext, useState } from "react";
import { ImageManipulator } from "expo-image-manipulator";

import * as Crypto from "expo-crypto";

import { Image } from "@/types";
import { renderToBase64 } from "@/helper";
import { fetchNutrition, fetchTitle } from "@/service";

type FoodContextType = {
  foods: FoodItem[];
  addFood: (image: Image) => string;
  removeFood: (id: string) => void;
  resizeFood: (id: string) => void;
  analyzeFood: (id: string) => void;
};

const FoodContext = createContext<FoodContextType>({
  foods: [],
  addFood: () => "",
  removeFood: () => {},
  resizeFood: () => {},
  analyzeFood: () => {},
});

type FoodProviderProps = {
  children: ReactNode;
};

enum Status {
  Idle = "idle",
  Resizing = "resizing",
  ResizingDone = "resizing-done",
  Analyzing = "analyzing",
  AnalyzingDone = "analyzing-done",
}

type FoodItem = {
  id: string;
  image: Image;
  status: Status;
  pending: boolean;
  // TODO: Rename these to resizingData and analyzingData
  base64Small?: string;
  base64Large?: string;
  title?: string;
  nutrition?: string;
};

export const FoodProvider = ({ children }: FoodProviderProps) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const addFood = (image: Image) => {
    const id = Crypto.randomUUID();
    const status = Status.Idle;
    const pending = false;

    const food = { id, image, status, pending };

    setFoods((current) => [...current, food]);

    return food;
  };

  const removeFood = (id: string) => {
    setFoods((current) => current.filter((food) => food.id !== id));
  };

  const resizeFood = async (id: string) => {
    const food = foods.find((food) => food.id === id);

    if (!food) throw new Error(`Food item with id ${id} not found`);

    setFoods((current) =>
      current.map((food) =>
        food.id === id ? { ...food, status: Status.Resizing } : food
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

    const [smallBase64, largeBase64] = await Promise.all([
      renderToBase64(smallManipulator, true),
      renderToBase64(largeManipulator, false),
    ]);

    console.log("[DEVICE] Picture manipulated");

    setFoods((current) =>
      current.map((food) => {
        const { id, pending } = food;

        if (id !== id) return food;
        if (pending) {
          analyzeFood(id);
        }

        return {
          ...food,
          status: Status.ResizingDone,
          pending: false,
          base64Small: smallBase64,
          base64Large: largeBase64,
        };
      })
    );
  };

  const analyzeFood = (id: string) => {
    // Change the status or set pending flag to true if resizing is not done
    setFoods((current) =>
      current.map((food) =>
        food.id === id
          ? food.status === Status.Resizing
            ? { ...food, pending: true }
            : { ...food, status: Status.Analyzing }
          : food
      )
    );

    const food = foods.find((food) => food.id === id);

    if (!food) throw new Error(`Food item with id ${id} not found`);

    fetchTitle(food.base64Small!).then((title: string) => {
      setFoods((current) =>
        current.map((food) => {
          const complete = food.id === id && food.nutrition;
          const status = complete ? Status.AnalyzingDone : food.status;

          return food.id === id
            ? {
                ...food,
                title,
                status,
              }
            : food;
        })
      );
    });

    fetchNutrition(food.base64Large!).then((nutrition: string) => {
      setFoods((current) =>
        current.map((food) => {
          const complete = food.id === id && food.title;
          const status = complete ? Status.AnalyzingDone : food.status;

          return food.id === id
            ? {
                ...food,
                status,
                nutrition,
              }
            : food;
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
