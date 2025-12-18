'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Bot, Sparkles, Newspaper, BookOpen, Trophy, Flame, X, DollarSign, GitCompare } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

interface NavbarProps {
    onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps = {}) {
    // Use useEffect to set banner state on client to avoid hydration mismatch
    const [showBanner, setShowBanner] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage for banner preference
        const bannerHidden = localStorage.getItem('banner-hidden');
        setShowBanner(!bannerHidden);
    }, []);

    const resources = [
        {
            title: 'Top 10 Rankings',
            href: '/top-10',
            description: 'Most popular AI tools',
            icon: Trophy,
        },
        {
            title: 'AI News',
            href: '/news',
            description: 'Latest AI updates',
            icon: Newspaper,
        },
        {
            title: 'Tutorials',
            href: '/tutorials',
            description: 'Learn AI tools',
            icon: BookOpen,
        },
        {
            title: 'Exclusive Deals',
            href: '/deals',
            description: 'Save on AI tools',
            icon: DollarSign,
        },
    ];

    const quickActions = [
        { label: 'Compare Tools', href: '/compare', icon: GitCompare },
        { label: 'Pricing Plans', href: '/pricing', icon: DollarSign },
        { label: 'Submit Tool', href: '/submit', icon: Sparkles },
    ];

    return (
        <>
            {/* Promo Banner */}
            {mounted && showBanner && (
                <div className="relative bg-gradient-to-r from-primary/90 via-purple-600/90 to-pink-600/90 text-white">
                    <div className="container mx-auto px-4 py-2.5">
                        <div className="flex items-center justify-center gap-2 text-sm md:text-base">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span className="font-medium">
                                🎉 New: <span className="font-bold">60+ AI Tools</span> Added! Explore Now →
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowBanner(false);
                            localStorage.setItem('banner-hidden', 'true');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-6 md:gap-8">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Bot className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                            </div>
                            <span className="hidden sm:inline text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-primary group-hover:to-purple-400 transition-all duration-300">
                                AI Tool List
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-6">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link href="/categories" legacyBehavior passHref>
                                            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                                Categories
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                                {resources.map((resource) => (
                                                    <li key={resource.title}>
                                                        <Link href={resource.href} legacyBehavior passHref>
                                                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                                                <div className="flex items-center gap-2">
                                                                    <resource.icon className="h-4 w-4 text-primary" />
                                                                    <div className="text-sm font-medium leading-none">
                                                                        {resource.title}
                                                                    </div>
                                                                </div>
                                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                                    {resource.description}
                                                                </p>
                                                            </NavigationMenuLink>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link href="/blog" legacyBehavior passHref>
                                            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                                Blog
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link href="/about" legacyBehavior passHref>
                                            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                                About
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link href="/contact" legacyBehavior passHref>
                                            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                                Contact
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* What's Hot Badge */}
                        <Link href="/top-10">
                            <Badge className="hidden md:flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 cursor-pointer">
                                <Flame className="h-3 w-3" />
                                <span className="text-xs font-medium">5 New</span>
                            </Badge>
                        </Link>

                        {/* Submit Tool CTA */}
                        <Link href="/submit" className="hidden md:block">
                            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Submit Tool
                            </Button>
                        </Link>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col gap-4 mt-8">
                                    {/* What's Hot - Mobile */}
                                    <Link href="/top-10">
                                        <Badge className="w-full justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                                            <Flame className="h-3 w-3 mr-1" />
                                            5 New Tools Today
                                        </Badge>
                                    </Link>

                                    <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors">
                                        Categories
                                    </Link>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                            Resources
                                        </div>
                                        <Link href="/top-10" className="flex items-center gap-2 text-base hover:text-primary transition-colors pl-2">
                                            <Trophy className="h-4 w-4" />
                                            Top 10 Rankings
                                        </Link>
                                        <Link href="/news" className="flex items-center gap-2 text-base hover:text-primary transition-colors pl-2">
                                            <Newspaper className="h-4 w-4" />
                                            AI News
                                        </Link>
                                        <Link href="/tutorials" className="flex items-center gap-2 text-base hover:text-primary transition-colors pl-2">
                                            <BookOpen className="h-4 w-4" />
                                            Tutorials
                                        </Link>
                                    </div>

                                    <Link href="/blog" className="text-lg font-medium hover:text-primary transition-colors">
                                        Blog
                                    </Link>
                                    <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">
                                        About
                                    </Link>
                                    <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors">
                                        Contact
                                    </Link>

                                    <hr className="border-white/10 my-4" />

                                    <Link href="/submit" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                                        <Sparkles className="h-5 w-5" />
                                        Submit Tool
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav>
        </>
    );
}
