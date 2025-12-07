'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AdminHeader() {
    return (
        <header className="border-b border-white/10 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
                <div>
                    <h2 className="text-xl font-bold">Admin Dashboard</h2>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/" target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Website
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
