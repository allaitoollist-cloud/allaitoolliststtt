'use client';

import { useEffect, useState } from 'react';
import { Users, Sparkles, TrendingUp, Star } from 'lucide-react';

export function StatsSection() {
    // Start with true to match server render, then animate on client
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Small delay to ensure hydration completes before animation
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        {
            icon: Sparkles,
            value: '1000+',
            label: 'AI Tools Listed',
            color: 'from-yellow-400 to-orange-500',
            bgColor: 'from-yellow-400/10 to-orange-500/10',
        },
        {
            icon: Users,
            value: '50K+',
            label: 'Active Users',
            color: 'from-blue-400 to-cyan-500',
            bgColor: 'from-blue-400/10 to-cyan-500/10',
        },
        {
            icon: TrendingUp,
            value: '100K+',
            label: 'Monthly Visits',
            color: 'from-green-400 to-emerald-500',
            bgColor: 'from-green-400/10 to-emerald-500/10',
        },
        {
            icon: Star,
            value: '4.9/5',
            label: 'User Rating',
            color: 'from-purple-400 to-pink-500',
            bgColor: 'from-purple-400/10 to-pink-500/10',
        },
    ];

    return (
        <div className="relative py-20 md:py-28 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">Trusted by Thousands</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-4">
                        <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                            Growing Community of
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            AI Enthusiasts
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of users discovering and using the best AI tools every day
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`group relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${stat.bgColor} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Card */}
                            <div className="relative bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:scale-105">
                                {/* Icon */}
                                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stat.bgColor} border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`h-8 w-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                                </div>

                                {/* Value */}
                                <div className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                    {stat.value}
                                </div>

                                {/* Label */}
                                <div className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </div>

                                {/* Decorative Line */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-muted-foreground">
                        Want to see your tool here?{' '}
                        <a href="/submit" className="text-primary hover:underline font-semibold">
                            Submit it now →
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
