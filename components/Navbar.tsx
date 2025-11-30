'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Bot, Sparkles, TrendingUp, Newspaper, BookOpen, Trophy, Flame, X, Zap, DollarSign, GitCompare, Heart, Bell, User, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface NavbarProps {
    onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps = {}) {
    const [searchValue, setSearchValue] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch?.(value);
    };

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

    // Mock notifications
    const notifications = [
        { id: 1, text: 'New AI tool added: Cursor AI', time: '2h ago', unread: true },
        { id: 2, text: 'ChatGPT updated to v4.5', time: '5h ago', unread: true },
        { id: 3, text: 'Your review was approved', time: '1d ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <>
            {/* Promo Banner */}
            {showBanner && (
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
                        onClick={() => setShowBanner(false)}
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

                        {/* Search Bar - Desktop */}
                        <div className="hidden md:flex relative w-48 lg:w-64 group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search tools..."
                                className="pl-9 bg-secondary/50 border-white/5 focus-visible:ring-primary/50 transition-all hover:bg-secondary/80 h-10"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Favorites Counter */}
                        <Button variant="ghost" size="icon" className="hidden md:flex relative text-muted-foreground hover:text-primary">
                            <Heart className="h-5 w-5" />
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">
                                3
                            </Badge>
                        </Button>

                        {/* Notifications */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="hidden md:flex relative text-muted-foreground hover:text-primary">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">Notifications</h4>
                                        <Button variant="ghost" size="sm" className="text-xs">
                                            Mark all read
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-3 rounded-md cursor-pointer transition-colors ${notif.unread ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-secondary/50'
                                                    }`}
                                            >
                                                <p className="text-sm">{notif.text}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full" size="sm">
                                        View All Notifications
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Quick Actions Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary">
                                    <Zap className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {quickActions.map((action) => (
                                    <DropdownMenuItem key={action.label} asChild>
                                        <Link href={action.href} className="flex items-center gap-2 cursor-pointer">
                                            <action.icon className="h-4 w-4" />
                                            <span>{action.label}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Search Button - Mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-muted-foreground hover:text-primary"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* User Menu / Sign In */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hidden md:flex gap-1 text-muted-foreground hover:text-foreground">
                                    <User className="h-4 w-4" />
                                    <span>Account</span>
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/login" className="cursor-pointer">Sign In</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/register" className="cursor-pointer">Create Account</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/favorites" className="cursor-pointer flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        My Favorites
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer">Settings</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

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

                                    {/* Favorites & Notifications - Mobile */}
                                    <div className="flex gap-2">
                                        <Link href="/favorites" className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Heart className="h-4 w-4 mr-2" />
                                                Favorites (3)
                                            </Button>
                                        </Link>
                                        <Link href="/notifications" className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full relative">
                                                <Bell className="h-4 w-4 mr-2" />
                                                Alerts
                                                {unreadCount > 0 && (
                                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500">
                                                        {unreadCount}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </Link>
                                    </div>

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

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                            Quick Actions
                                        </div>
                                        {quickActions.map((action) => (
                                            <Link key={action.label} href={action.href} className="flex items-center gap-2 text-base hover:text-primary transition-colors pl-2">
                                                <action.icon className="h-4 w-4" />
                                                {action.label}
                                            </Link>
                                        ))}
                                    </div>

                                    <hr className="border-white/10 my-4" />

                                    <Link href="/submit" className="flex items-center gap-2 text-lg font-medium hover:text-primary transition-colors">
                                        <Sparkles className="h-5 w-5" />
                                        Submit Tool
                                    </Link>
                                    <Link href="/login" className="text-lg font-medium hover:text-primary transition-colors">
                                        Sign In
                                    </Link>
                                    <Link href="/register" className="text-lg font-medium hover:text-primary transition-colors">
                                        Create Account
                                    </Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="md:hidden border-t border-white/10 p-4 bg-background/95 backdrop-blur-xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search AI tools..."
                                className="pl-9 bg-secondary/50 border-white/5"
                                value={searchValue}
                                onChange={handleSearchChange}
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
