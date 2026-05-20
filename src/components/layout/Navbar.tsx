'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, Sparkles, Compass, Info } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { NeonButton } from '../ui/NeonButton';
import { GradientText } from '../ui/GradientText';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { stats, reset } = useAppStore();

  const navLinks = [
    { href: '/', label: 'Home', icon: Music },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] border-b border-white/5 glass flex items-center justify-between px-6 md:px-12 backdrop-blur-md">
      {/* Logo */}
      <Link href="/" onClick={reset} className="flex items-center gap-2 group select-none">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-violet to-accent-lime shadow-md group-hover:scale-105 transition-transform duration-300">
          <Music className="w-5 h-5 text-[#0c0714] animate-pulse" />
        </div>
        <span className="font-serif-funky font-bold tracking-tight text-xl hidden sm:block">
          Commit<GradientText gradient="main">FM</GradientText>
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-300 relative py-1.5 ${
                isActive ? 'text-accent-lime font-bold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-lime rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Auth/Dashboard CTA */}
      <div className="flex items-center gap-4">
        {stats ? (
          <Link href="/dashboard">
            <NeonButton variant="primary" className="py-2 px-4 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0c0714]" />
              <span>Dashboard</span>
            </NeonButton>
          </Link>
        ) : (
          <a
            href="https://github.com/login/oauth/authorize"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/#generate';
            }}
          >
            <NeonButton variant="secondary" className="py-2 px-4 text-xs">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Generate Beat</span>
            </NeonButton>
          </a>
        )}
      </div>
    </header>
  );
}
