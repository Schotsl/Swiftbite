import React, { createContext, useState, useContext, ReactNode } from "react";

type RegisterContextType = {
  previous: number;

  setPrevious: (step: number) => void;
};

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined,
);

type RegisterProviderProps = {
  children: ReactNode;
};

export const RegisterProvider = ({ children }: RegisterProviderProps) => {
  const [previous, setPrevious] = useState<number>(0);

  return (
    <RegisterContext.Provider value={{ previous, setPrevious }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);

  if (context === undefined) {
    throw new Error(
      `useRegisterContext must be used within a RegisterProvider`,
    );
  }

  return context;
};
