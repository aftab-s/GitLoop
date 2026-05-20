'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Compass, Info, LayoutDashboard } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export function MobileNav() {
  const pathname = usePathname();
  const { stats } = useAppStore();

  const links = [
    { href: '/', label: 'Home', icon: Music },
    ...(stats ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[var(--player-height)] md:hidden glass border-t border-white/5 flex items-center justify-around px-4 pb-safe backdrop-blur-md">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors duration-200 ${
              isActive ? 'text-accent-lime' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-accent-lime/10 border border-accent-lime/20' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
