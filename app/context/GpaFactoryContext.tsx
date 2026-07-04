"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type GpaFactoryContextType = {
  selectedFactory: string;

  setSelectedFactory: (
    factoryId: string
  ) => void;
};

const GpaFactoryContext =
  createContext<GpaFactoryContextType | null>(
    null
  );

export function GpaFactoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedFactory, setSelectedFactory] =
    useState("F001");

  const value = useMemo(
    () => ({
      selectedFactory,
      setSelectedFactory,
    }),
    [selectedFactory]
  );

  return (
    <GpaFactoryContext.Provider value={value}>
      {children}
    </GpaFactoryContext.Provider>
  );
}

export function useGpaFactory() {
  const context = useContext(
    GpaFactoryContext
  );

  if (!context) {
    throw new Error(
      "useGpaFactory must be used inside GpaFactoryProvider"
    );
  }

  return context;
}