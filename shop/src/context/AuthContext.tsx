// src/context/AuthContext.tsx
import { createContext, useState, useContext } from 'react';

interface User {
  name: string
  email?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if(newUser){
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      localStorage.removeItem("user")
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error("useAuth phải dùng trong AuthProvider")
  return ctx
}