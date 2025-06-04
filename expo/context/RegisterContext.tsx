import { CalorieData, MacroData } from "@/schemas/personal/goal";
import React, { createContext, useState, useContext, ReactNode } from "react";

type RegisterContextType = {
  previous: number;

  birth: Date;
  length: number;
  weight: number;

  setPrevious: (step: number) => void;

  setLength: (length: number) => void;
  setWeight: (weight: number) => void;

  setFirst: (first: string) => void;
  setLast: (last: string) => void;

  setBirth: (birth: Date) => void;

  setCalories: (calories: CalorieData) => void;
  setMacro: (macro: MacroData) => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

type RegisterProviderProps = {
  children: ReactNode;
};

export const RegisterProvider = ({ children }: RegisterProviderProps) => {
  const defaultBirth = new Date(2000, 0, 1);

  const defaultLength = 170;
  const defaultWeight = 70.5;

  const [previous, setPrevious] = useState<number>(0);

  const [length, setLength] = useState<number>(defaultLength);
  const [weight, setWeight] = useState<number>(defaultWeight);

  const [first, setFirst] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);

  const [birth, setBirth] = useState<Date>(defaultBirth);

  const [calories, setCalories] = useState<CalorieData | null>(null);
  const [macro, setMacro] = useState<MacroData | null>(null);

  return (
    <RegisterContext.Provider
      value={{
        birth,
        length,
        weight,

        previous,
        setPrevious,
        setLength,
        setWeight,
        setFirst,
        setLast,
        setBirth,
        setCalories,
        setMacro,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);

  if (context === undefined) {
    throw new Error(
      `useRegisterContext must be used within a RegisterProvider`
    );
  }

  return context;
};
