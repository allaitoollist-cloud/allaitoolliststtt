'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    Image as ImageIcon,
    Video,
    Code,
    Sparkles,
    PenTool,
    MessageSquare,
    Music,
    Database,
    Briefcase,
    TrendingUp,
    Search,
    FileText,
    Palette,
    Cpu,
    Box,
    Gamepad2,
    Users,
    ArrowRight
} from 'lucide-react';

interface CategoryGridProps {
    categories?: Array<{ name: string; count: number; description?: string }>;
}

export function CategoryGrid({ categories = [] }: CategoryGridProps) {
    // Icon mapping for categories
    const getCategoryIcon = (category: string) => {
        const iconMap: Record<string, any> = {
            'Image': ImageIcon,
            'Video': Video,
            'Code': Code,
            'AI': Sparkles,
            'Design': PenTool,
            'Chat': MessageSquare,
            'Audio': Music,
            'Data': Database,
            'Business': Briefcase,
            'Marketing': TrendingUp,
            'SEO': Search,
            'Writing': FileText,
            'Text': FileText,
            'Art': Palette,
            'Development': Cpu,
            '3D': Box,
            'Game': Gamepad2,
            'Gaming': Gamepad2,
            'Character': Users,
        };

        const cat = category?.split(' ')[0] || 'AI';
        return iconMap[cat] || iconMap[category] || Sparkles;
    };

    // Theme colors for categories
    const getCategoryTheme = (category: string) => {
        const themeMap: Record<string, any> = {
            'Image': { gradient: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30', icon: 'text-purple-400', bg: 'bg-purple-500/10' },
            'Video': { gradient: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', icon: 'text-pink-400', bg: 'bg-pink-500/10' },
            'Audio': { gradient: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', icon: 'text-orange-400', bg: 'bg-orange-500/10' },
            'Design': { gradient: 'from-fuchsia-500/20 to-purple-500/20', border: 'border-fuchsia-500/30', icon: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
            'Code': { gradient: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30', icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            'Development': { gradient: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            'Data': { gradient: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', icon: 'text-blue-400', bg: 'bg-blue-500/10' },
            'Business': { gradient: 'from-slate-500/20 to-gray-500/20', border: 'border-slate-400/30', icon: 'text-slate-300', bg: 'bg-slate-500/10' },
            'Marketing': { gradient: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', icon: 'text-red-400', bg: 'bg-red-500/10' },
            'SEO': { gradient: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30', icon: 'text-amber-400', bg: 'bg-amber-500/10' },
            'Writing': { gradient: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            'Text': { gradient: 'from-stone-500/20 to-neutral-500/20', border: 'border-stone-500/30', icon: 'text-stone-300', bg: 'bg-stone-500/10' },
            '3D': { gradient: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/30', icon: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            'Game': { gradient: 'from-lime-500/20 to-green-500/20', border: 'border-lime-500/30', icon: 'text-lime-400', bg: 'bg-lime-500/10' },
            'Gaming': { gradient: 'from-lime-500/20 to-green-500/20', border: 'border-lime-500/30', icon: 'text-lime-400', bg: 'bg-lime-500/10' },
            'Character': { gradient: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/30', icon: 'text-rose-400', bg: 'bg-rose-500/10' },
            'Chat': { gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', icon: 'text-green-400', bg: 'bg-green-500/10' },
        };

        const cat = category?.split(' ')[0] || 'AI';

        if (themeMap[cat]) return themeMap[cat];
        if (themeMap[category]) return themeMap[category];

        const keywords = Object.keys(themeMap);
        const match = keywords.find(k => category?.includes(k));
        if (match) return themeMap[match];

        return {
            gradient: 'from-primary/20 to-purple-500/20',
            border: 'border-primary/30',
            icon: 'text-primary',
            bg: 'bg-primary/10'
        };
    };

    // Default categories if none provided
    const defaultCategories = [
        { name: 'Image', count: 150, description: 'AI image generation & editing' },
        { name: 'Video', count: 120, description: 'Video creation & editing tools' },
        { name: 'Code', count: 200, description: 'Coding assistants & dev tools' },
        { name: 'Writing', count: 180, description: 'Content writing & copywriting' },
        { name: 'Chat', count: 95, description: 'Chatbots & conversational AI' },
        { name: 'Design', count: 110, description: 'Design & creative tools' },
        { name: 'Audio', count: 75, description: 'Music & audio generation' },
        { name: 'Data', count: 85, description: 'Data analysis & insights' },
        { name: 'Business', count: 140, description: 'Business automation tools' },
        { name: 'Marketing', count: 130, description: 'Marketing & SEO tools' },
        { name: '3D', count: 60, description: '3D modeling & rendering' },
        { name: 'Game', count: 45, description: 'Gaming & game development' },
    ];

    const displayCategories = categories.length > 0 ? categories : defaultCategories;

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Explore by Category
                    </Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                        Find Your Perfect
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent"> AI Tool</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Browse through our curated categories to discover the best AI tools for your needs
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {displayCategories.map((category) => {
                        const Icon = getCategoryIcon(category.name);
                        const theme = getCategoryTheme(category.name);

                        return (
                            <Link
                                key={category.name}
                                href={`/category/${encodeURIComponent(category.name)}`}
                                className="group"
                            >
                                <Card className={`bg-[#0F0F16] border ${theme.border} hover:border-opacity-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${theme.icon}/20 overflow-hidden h-full`}>
                                    <CardContent className="p-6 relative">
                                        {/* Background Gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Icon */}
                                            <div className={`w-12 h-12 rounded-xl ${theme.bg} border ${theme.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className={`h-6 w-6 ${theme.icon}`} />
                                            </div>

                                            {/* Category Name */}
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                                {category.name}
                                            </h3>

                                            {/* Description */}
                                            {category.description && (
                                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                                    {category.description}
                                                </p>
                                            )}

                                            {/* Count & Arrow */}
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary" className={`${theme.bg} ${theme.icon} border-0 text-xs`}>
                                                    {category.count}+ tools
                                                </Badge>
                                                <ArrowRight className={`h-4 w-4 ${theme.icon} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href="/categories">
                        <button className="group relative px-8 py-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full font-bold text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105">
                            <span className="relative z-10 flex items-center gap-2">
                                View All Categories
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-purple-600/80 to-pink-600/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
