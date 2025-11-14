"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (userRole && !allowedRoles.includes(userRole)))) {
      router.push('/login');
    }
  }, [isAuthenticated, userRole, isLoading, router, allowedRoles]);

  if (isLoading || !isAuthenticated || (userRole && !allowedRoles.includes(userRole))) {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-1/4" />
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
