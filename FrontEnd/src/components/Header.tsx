'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { LogOut, LayoutDashboard, Utensils, Shield, HeartPulse } from 'lucide-react';

const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-primary pb-1 border-b-2",
        isActive ? "text-primary border-primary" : "text-foreground/60 border-transparent",
        className
      )}
    >
      {children}
    </Link>
  );
};


export default function Header() {
  const { isAuthenticated, userRole, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium font-body">
            <NavLink href="/cardapio"><Utensils className="inline-block mr-1 h-4 w-4"/>Cardápio</NavLink>
            <NavLink href="/health"><HeartPulse className="inline-block mr-1 h-4 w-4"/>Status</NavLink>
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated ? (
            <>
              {userRole === 'customer' && <NavLink href="/dashboard"><LayoutDashboard className="inline-block mr-1 h-4 w-4"/>Painel</NavLink>}
              {userRole === 'admin' && <NavLink href="/admin"><Shield className="inline-block mr-1 h-4 w-4"/>Admin</NavLink>}
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <div className='flex items-center gap-2'>
              <Button asChild variant="ghost">
                  <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                  <Link href="/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </nav>
        {/* Mobile menu could be added here */}
      </div>
    </header>
  );
}
