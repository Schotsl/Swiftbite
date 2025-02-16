import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  ImageManipulator,
  ImageManipulatorContext,
  SaveFormat,
} from "expo-image-manipulator";

import Crypto from "expo-crypto";
import { renderToBase64 } from "@/helper";
import { fetchNutrition, fetchTitle } from "@/service";

type FoodContextType = {
  food: FoodItem[];
  addFood: (uri: string, width: number, height: number) => void;
  removeFood: (id: string) => void;
  resizeFood: (id: string) => void;
  analyzeFood: (id: string) => void;
};

const FoodContext = createContext<FoodContextType>({
  food: [],
  addFood: (uri: string, width: number, height: number) => {},
  removeFood: (id: string) => {},
  resizeFood: (id: string) => {},
  analyzeFood: (id: string) => {},
});

type FoodProviderProps = {
  children: ReactNode;
};

enum Status {
  Idle = "idle",
  Resizing = "resizing",
  ResizingIdle = "resizing-idle",
  Analyzing = "analyzing",
  Processed = "processed",
}

type FoodItem = {
  id: string;
  status: Status;
  image: {
    uri: string;
    width: number;
    height: number;
  };
  base64Small?: string;
  base64Large?: string;
  title?: string;
  nutrition?: string;
};

export const FoodProvider = ({ children }: FoodProviderProps) => {
  const [food, setFood] = useState<FoodItem[]>([]);

  const addFood = (uri: string, width: number, height: number) => {
    const food = {
      id: Crypto.randomUUID(),
      status: Status.Idle,
      image: { uri, width, height },
    };
    setFood((current) => [...current, food]);
  };

  const removeFood = (id: string) => {
    setFood((current) => current.filter((food) => food.id !== id));
  };

  const resizeFood = async (id: string) => {
    const item = food.find((food) => food.id === id);

    setFood((current) =>
      current.map((food) =>
        food.id === id ? { ...food, status: Status.Resizing } : food
      )
    );

    if (!item) {
      throw new Error(`Food item with id ${id} not found`);
    }

    const { uri, width, height } = item.image;

    console.log("[DEVICE] Manipulating picture...");

    const smallManipulator = ImageManipulator.manipulate(uri);
    const largeManipulator = ImageManipulator.manipulate(uri);

    const imageLandscape = width > height;

    smallManipulator.resize({
      width: imageLandscape ? 512 : null,
      height: imageLandscape ? null : 512,
    });

    largeManipulator.resize({
      width: imageLandscape ? 1440 : null,
      height: imageLandscape ? null : 1440,
    });

    const [smallBase64, largeBase64] = await Promise.all([
      renderToBase64(smallManipulator, true),
      renderToBase64(largeManipulator, false),
    ]);

    setFood((current) =>
      current.map((food) =>
        food.id === id
          ? {
              ...food,
              status: Status.ResizingIdle,
              base64Small: smallBase64,
              base64Large: largeBase64,
            }
          : food
      )
    );

    console.log("[DEVICE] Picture manipulated");
  };

  const analyzeFood = (id: string) => {
    const item = food.find((food) => food.id === id);

    setFood((current) =>
      current.map((food) =>
        food.id === id ? { ...food, status: Status.Analyzing } : food
      )
    );

    if (!item) {
      throw new Error(`Food item with id ${id} not found`);
    }

    const { base64Large, base64Small } = item;

    if (!base64Large || !base64Small) {
      throw new Error(`Food item with id ${id} is missing base64 data`);
    }

    //Set title and nutrition if either is returned and once both are returned, set status to processed
    fetchTitle(base64Small).then((title: string) => {
      setFood((current) =>
        current.map((food) => {
          const complete = food.id === id && food.nutrition;
          const status = complete ? Status.Processed : food.status;

          return food.id === id ? { ...food, title, status } : food;
        })
      );
    });

    fetchNutrition(base64Large).then((nutrition: string) => {
      setFood((current) =>
        current.map((food) => {
          const complete = food.id === id && food.title;
          const status = complete ? Status.Processed : food.status;

          return food.id === id ? { ...food, nutrition, status } : food;
        })
      );
    });
  };

  return (
    <FoodContext.Provider
      value={{
        food,
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
