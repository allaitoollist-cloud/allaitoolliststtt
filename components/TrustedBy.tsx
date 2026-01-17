'use client';

import { Sparkles } from 'lucide-react';

export function TrustedBy() {
    // Array of companies - in a real app these would be SVGs
    const companies = [
        { name: 'OpenAI', opacity: 'opacity-70' },
        { name: 'Google', opacity: 'opacity-60' },
        { name: 'Microsoft', opacity: 'opacity-60' },
        { name: 'Anthropic', opacity: 'opacity-70' },
        { name: 'Midjourney', opacity: 'opacity-80' },
        { name: 'Stability AI', opacity: 'opacity-70' },
        { name: 'Jasper', opacity: 'opacity-60' },
    ];

    return (
        <section className="py-10 border-b border-border/40 bg-background/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        Trusted by teams using the world's best AI
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 grayscale opacity-60 hover:opacity-100 transition-opacity duration-500">
                        {/* Placeholder Company Logos Text */}
                        {companies.map((company, index) => (
                            <div key={index} className={`text-xl md:text-2xl font-bold font-sans text-muted-foreground ${company.opacity} hover:text-foreground cursor-default transition-colors`}>
                                {company.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
