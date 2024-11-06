/**
 * UserContext.tsx
 * 
 * Context for managing user data, including username and profile image URI.
 * Provides `UserProvider` to wrap components that need access to user context,
 * and `useUserContext` hook to access and modify user data within the context.
 */

import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  username: string;
  imageUri: string | null;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const defaultUser: User = {
  username: "",
  imageUri: null,
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
