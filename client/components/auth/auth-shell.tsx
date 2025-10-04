"use client";
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthShellProps {
    children: React.ReactNode;
    centered?: boolean; // center content vertically & horizontally
    showTopBanner?: boolean;
    banner?: React.ReactNode;
    className?: string;
}

export function AuthShell({
    children,
    centered = false,
    showTopBanner = true,
    banner,
    className,
}: AuthShellProps) {
    const bannerContent =
        banner || (
            <p>
                This is a project for the community.
                <Link
                    href="/github"
                    className="font-medium theme-text-primary hover:underline ml-1"
                >
                    Star us on GitHub
                </Link>
            </p>
        );

    return (
        <div
            className={cn(
                'min-h-screen flex flex-col theme-bg-subtle bg-white dark:bg-slate-950 relative overflow-hidden',
                className
            )}
        >
            {/* Background layers (updated to green / white palette) */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(78,204,163,0.22),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(209,250,229,0.55),rgba(255,255,255,0))] dark:bg-[linear-gradient(to_bottom_right,rgba(78,204,163,0.12),transparent)]" />

            {showTopBanner && (
                <div className="w-full theme-bg-alt/70 backdrop-blur-sm p-3 text-center text-sm theme-text-secondary relative z-10 border-b border-emerald-100/40 dark:border-emerald-500/10">
                    {bannerContent}
                </div>
            )}

            <div
                className={cn(
                    'flex-grow relative z-10',
                    centered && 'flex items-center justify-center'
                )}
            >
                {children}
            </div>
        </div>
    );
}

export default AuthShell;