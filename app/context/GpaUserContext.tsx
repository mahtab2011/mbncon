"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { GpaRole } from "../../lib/security/gpaPermissions";

type GpaUser = {
  name: string;
  email: string;
  role: GpaRole;
};

type GpaUserContextType = {
  user: GpaUser;
  setUser: (user: GpaUser) => void;
};

const defaultUser: GpaUser = {
  name: "Demo Executive",
  email: "executive@gpa.com",
  role: "SUPER_ADMIN",
};

const GpaUserContext =
  createContext<GpaUserContextType>({
    user: defaultUser,
    setUser: () => {},
  });

export function GpaUserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<GpaUser>(defaultUser);

  return (
    <GpaUserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </GpaUserContext.Provider>
  );
}

export function useGpaUser() {
  return useContext(GpaUserContext);
}