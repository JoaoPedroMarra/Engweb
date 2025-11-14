import Link from 'next/link';
import { cn } from '@/lib/utils';
import {FlameKindling} from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2 text-2xl font-bold text-primary transition-colors hover:text-primary/80", className)}>
      <FlameKindling className="h-7 w-7 text-primary group-hover:text-amber-500 transition-colors"/>
      <span className="font-headline">FastBurguer</span>
    </Link>
  );
}
