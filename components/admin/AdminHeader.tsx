'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MobileSidebar } from '@/components/admin/Sidebar';

export function AdminHeader() {
    return (
        <header className="border-b border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 gap-3">
                <div className="flex items-center gap-3">
                    <MobileSidebar />
                    <h2 className="text-base sm:text-xl font-bold truncate">Admin Dashboard</h2>
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/" target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Visit Website</span>
                    </Link>
                </Button>
            </div>
        </header>
    );
}
