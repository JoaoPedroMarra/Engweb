"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import apiFetch from '@/lib/api';
import type { User, UserRole } from '@/lib/types';
import type { z } from 'zod';
import type { loginSchema, registerSchema } from '@/lib/schemas';

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface JwtPayload {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: UserRole | null;
  login: (data: LoginData, role: UserRole) => Promise<void>;
  register: (data: RegisterData, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleSetToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('authToken', newToken);
        try {
          const decoded: JwtPayload = jwtDecode(newToken);
          // This is a simplified user object from the token.
          // A real app might fetch full user details from a `/me` endpoint.
          setUser({ id: decoded.sub, role: decoded.role, name: 'User', email: '' });
        } catch (error) {
          console.error('Failed to decode token:', error);
          setUser(null);
        }
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
            const decoded: JwtPayload = jwtDecode(storedToken);
            if (decoded.exp * 1000 > Date.now()) {
                handleSetToken(storedToken);
            } else {
                handleSetToken(null);
            }
        } catch (e) {
            handleSetToken(null);
        }
      }
    }
    setIsLoading(false);
  }, [handleSetToken]);

  const login = async (data: LoginData, role: UserRole) => {
    const response = await apiFetch(`/auth/login/${role}`, { data });
    if (response.token) {
      handleSetToken(response.token);
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  const register = async (data: RegisterData, role: UserRole) => {
    const headers = role === 'admin' && (data as any).adminToken ? { 'x-admin-token': String((data as any).adminToken) } : undefined;
    const response = await apiFetch(`/auth/register/${role}`, { data, headers });
    if (response.token) {
      handleSetToken(response.token);
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  const logout = () => {
    handleSetToken(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    userRole: user?.role ?? null,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
