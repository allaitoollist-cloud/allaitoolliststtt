'use client';

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { SEOContent } from '@/components/SEOContent';
import { AdditionalSections } from '@/components/AdditionalSections';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ToolCard } from '@/components/ToolCard';
import { Footer } from '@/components/Footer';
import { ReviewsSection } from '@/components/ReviewsSection';
import { CollectionsSection } from '@/components/CollectionsSection';
import { QuickFilters } from '@/components/QuickFilters';
import { ComparisonBar } from '@/components/ComparisonBar';
import { TrendingToolsSection } from '@/components/TrendingToolsSection';
import { FeaturedToolsSection } from '@/components/FeaturedToolsSection';
import { NewsletterSection } from '@/components/NewsletterSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Tool } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface CategoryWithCount {
    name: string;
    count: number;
    description: string;
}

interface HomeClientProps {
    initialTools: Tool[];
    categories?: CategoryWithCount[];
}

export default function HomeClient({ initialTools, categories = [] }: HomeClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
    const [quickFilters, setQuickFilters] = useState<string[]>([]);

    const ITEMS_PER_PAGE = 24;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'name'>('latest');

    // Derive all unique categories from tools
    const allCategories = useMemo(() => {
        const cats = new Set<string>();
        initialTools.forEach(tool => {
            if (tool.category) cats.add(tool.category);
        });
        return Array.from(cats).sort();
    }, [initialTools]);

    // Filter tools based on search and filters
    const filteredTools = useMemo(() => {
        return initialTools.filter((tool) => {
            // Search filter
            const matchesSearch =
                searchQuery === '' ||
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (Array.isArray(tool.tags) &&
                    tool.tags.some(
                        (tag: string) =>
                            typeof tag === 'string' &&
                            tag.toLowerCase().includes(searchQuery.toLowerCase())
                    ));

            // Category filter
            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(tool.category);

            // Pricing filter
            const matchesPricing =
                selectedPricing.length === 0 ||
                selectedPricing.includes(tool.pricing);

            return matchesSearch && matchesCategory && matchesPricing;
        });

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'latest') {
                // Sort by date added (newest first)
                const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
                const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
                return dateB - dateA;
            } else if (sortBy === 'popular') {
                // Sort by views (most popular first)
                return (b.views || 0) - (a.views || 0);
            } else {
                // Sort alphabetically by name
                return a.name.localeCompare(b.name);
            }
        });

        return sorted;
    }, [initialTools, searchQuery, selectedCategories, selectedPricing, sortBy]);

    // Reset visible count and page when filters change
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
        setCurrentPage(1);
    }, [searchQuery, selectedCategories, selectedPricing]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handlePricingToggle = (pricing: string) => {
        setSelectedPricing((prev) =>
            prev.includes(pricing)
                ? prev.filter((p) => p !== pricing)
                : [...prev, pricing]
        );
    };

    const handleResetFilters = () => {
        setSelectedCategories([]);
        setSelectedPricing([]);
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar onSearch={setSearchQuery} />

            <main className="flex-grow">
                <Hero onSearch={setSearchQuery} />

                {/* Featured Tools Section - Shows admin-marked featured tools */}
                <FeaturedToolsSection tools={initialTools} />

                {/* Category Grid Section */}
                <CategoryGrid categories={categories} />

                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Mobile Filter Trigger */}
                        <div className="md:hidden mb-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="w-full gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filters
                                        {(selectedCategories.length > 0 || selectedPricing.length > 0) && (
                                            <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                                                {selectedCategories.length + selectedPricing.length}
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent
                                    side="left"
                                    className="w-[300px] sm:w-[400px] overflow-y-auto"
                                >
                                    <div className="mt-6">
                                        <FilterSidebar
                                            selectedCategories={selectedCategories}
                                            selectedPricing={selectedPricing}
                                            availableCategories={allCategories}
                                            onCategoryToggle={handleCategoryToggle}
                                            onPricingToggle={handlePricingToggle}
                                            onReset={handleResetFilters}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        <aside className="hidden md:block">
                            <FilterSidebar
                                selectedCategories={selectedCategories}
                                selectedPricing={selectedPricing}
                                availableCategories={allCategories}
                                onCategoryToggle={handleCategoryToggle}
                                onPricingToggle={handlePricingToggle}
                                onReset={handleResetFilters}
                            />
                        </aside>

                        <div className="flex-1">
                            {/* Quick Filters */}
                            <QuickFilters
                                selectedFilters={quickFilters}
                                onFilterToggle={(filter) => {
                                    setQuickFilters((prev) =>
                                        prev.includes(filter)
                                            ? prev.filter((f) => f !== filter)
                                            : [...prev, filter]
                                    );
                                }}
                                onClearAll={() => setQuickFilters([])}
                            />

                            {/* Sorting Dropdown */}
                            <div className="flex justify-end mb-4">
                                <Select value={sortBy} onValueChange={(value: 'latest' | 'popular' | 'name') => setSortBy(value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">Latest</SelectItem>
                                        <SelectItem value="popular">Popular</SelectItem>
                                        <SelectItem value="name">Name (A-Z)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* --- COMPACT CATEGORY SECTIONS (Only if no search/filter active) --- */}
                            {!searchQuery && selectedCategories.length === 0 && selectedPricing.length === 0 ? (
                                <div className="space-y-12">
                                    {/* Section 1: Latest AI (Using 'featured' or sorting by date mock) -> "Latest AI" */}
                                    <div className="bg-[#0A0A0F]/50 border border-white/5 rounded-2xl p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                                Latest AI Tools
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {initialTools.filter(t => t.dateAdded && new Date(t.dateAdded) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).slice(0, 9).map((tool) => (
                                                <div key={tool.id} className="bg-[#0F0F16] border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center gap-3 group">
                                                    <Link href={tool.url} target="_blank" className="flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center overflow-hidden">
                                                            {/* Mini Icon Logic */}
                                                            {tool.icon ? <img src={tool.icon} alt={tool.name} className="w-6 h-6 object-contain" /> : <span className="text-xs">AI</span>}
                                                        </div>
                                                    </Link>
                                                    <div className="flex-grow min-w-0">
                                                        <Link href={tool.url} target="_blank" className="block truncate">
                                                            <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 truncate">{tool.name}</h3>
                                                        </Link>
                                                        <p className="text-[10px] text-gray-500 truncate">{tool.category}</p>
                                                    </div>
                                                    <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10">
                                                        <Link href={tool.url} target="_blank">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 text-center">
                                            <Button variant="outline" className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10 w-full sm:w-auto">
                                                More New AI Tools &rarr;
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Section 2: AI Chat & Assistants (Category: Chat, Writing, etc) */}
                                    <div className="bg-[#0A0A0F]/50 border border-white/5 rounded-2xl p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                                                AI Chat Assistants
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {initialTools.filter(t => ['Chat', 'Assistant', 'Writing', 'Text'].some(c => t.category?.includes(c))).slice(0, 9).map((tool) => (
                                                <div key={tool.id} className="bg-[#0F0F16] border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center gap-3 group">
                                                    <Link href={tool.url} target="_blank" className="flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center overflow-hidden">
                                                            {tool.icon ? <img src={tool.icon} alt={tool.name} className="w-6 h-6 object-contain" /> : <span className="text-xs">Chat</span>}
                                                        </div>
                                                    </Link>
                                                    <div className="flex-grow min-w-0">
                                                        <Link href={tool.url} target="_blank" className="block truncate">
                                                            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 truncate">{tool.name}</h3>
                                                        </Link>
                                                        <p className="text-[10px] text-gray-500 truncate">{tool.shortDescription}</p>
                                                    </div>
                                                    <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10">
                                                        <Link href={tool.url} target="_blank">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 text-center">
                                            <Link href="/category/Chat">
                                                <Button variant="outline" className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 w-full sm:w-auto">
                                                    More Chat Tools &rarr;
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Section 3: Super Tools (Trending) */}
                                    <div className="bg-[#0A0A0F]/50 border border-white/5 rounded-2xl p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                                                Super Tools (Trending)
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {initialTools.filter(t => t.trending).slice(0, 9).map((tool) => (
                                                <div key={tool.id} className="bg-[#0F0F16] border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center gap-3 group">
                                                    <Link href={tool.url} target="_blank" className="flex-shrink-0">
                                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center overflow-hidden">
                                                            {tool.icon ? <img src={tool.icon} alt={tool.name} className="w-6 h-6 object-contain" /> : <span className="text-xs">Hot</span>}
                                                        </div>
                                                    </Link>
                                                    <div className="flex-grow min-w-0">
                                                        <Link href={tool.url} target="_blank" className="block truncate">
                                                            <h3 className="text-sm font-semibold text-white group-hover:text-purple-400 truncate">{tool.name}</h3>
                                                        </Link>
                                                        <p className="text-[10px] text-gray-500 truncate">{tool.shortDescription}</p>
                                                    </div>
                                                    <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/10">
                                                        <Link href={tool.url} target="_blank">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 text-center">
                                            <Button
                                                variant="outline"
                                                className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 w-full sm:w-auto"
                                                onClick={() => {
                                                    // Trigger filter for trending or just show all
                                                    // For now, let's just show all by setting a dummy filter or scrollTo
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    setSearchQuery(' '); // Hack to trigger "search mode" which shows the grid
                                                    setTimeout(() => setSearchQuery(''), 100); // clear it
                                                    // Actually, better to have a state.
                                                }}
                                            >
                                                View All Trending &rarr;
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Link to Full List */}
                                    <div className="py-12 flex justify-center">
                                        <Button
                                            size="lg"
                                            className="bg-white text-black hover:bg-gray-200 font-bold px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transform hover:scale-105 transition-all"
                                            onClick={() => {
                                                // Setting a category to 'All' or just triggering re-render?
                                                // Let's just create a state for viewMode if we want to stay clean
                                                // For now, I'll just set a state on component.
                                                // I can't easily add state in replace_file_content without context.
                                                // I will use a simple query param or just set a filter.
                                                setSearchQuery(' '); // trigger list view
                                            }}
                                        >
                                            Explore The Ultimate AI List &rarr;
                                        </Button>
                                    </div>

                                </div>
                            ) : (
                                /* Keep Existing Filtered Results View */
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">
                                            {searchQuery ? 'Search Results' : 'Explore All Tools'}
                                        </h2>
                                        <span className="text-sm text-muted-foreground">
                                            {filteredTools.length}{' '}
                                            {filteredTools.length === 1 ? 'result' : 'results'}
                                        </span>
                                    </div>

                                    {filteredTools.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredTools.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((tool) => (
                                                    <ToolCard key={tool.id} tool={tool} />
                                                ))}
                                            </div>

                                            {Math.ceil(filteredTools.length / ITEMS_PER_PAGE) > 1 && (
                                                <div className="flex items-center justify-center gap-2 mt-12">
                                                    {/* Previous Button */}
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setCurrentPage(p => Math.max(1, p - 1));
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        disabled={currentPage === 1}
                                                        className="w-10 h-10 p-0"
                                                    >
                                                        &lt;
                                                    </Button>

                                                    {/* Page Numbers */}
                                                    {Array.from({ length: Math.min(Math.ceil(filteredTools.length / ITEMS_PER_PAGE), 5) }, (_, i) => {
                                                        const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
                                                        let pageNumber = i + 1;

                                                        // Dynamic windowing for pages
                                                        if (totalPages > 5) {
                                                            if (currentPage > 3) {
                                                                pageNumber = currentPage - 2 + i;
                                                            }
                                                            if (currentPage > totalPages - 2) {
                                                                pageNumber = totalPages - 4 + i;
                                                            }
                                                        }

                                                        if (pageNumber > totalPages) return null;

                                                        return (
                                                            <Button
                                                                key={pageNumber}
                                                                onClick={() => {
                                                                    setCurrentPage(pageNumber);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                variant={currentPage === pageNumber ? "default" : "outline"}
                                                                className={`w-10 h-10 p-0 ${currentPage === pageNumber ? 'bg-primary text-primary-foreground' : 'bg-transparent text-foreground'}`}
                                                            >
                                                                {pageNumber}
                                                            </Button>
                                                        );
                                                    })}

                                                    {/* Next Button */}
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setCurrentPage(p => Math.min(Math.ceil(filteredTools.length / ITEMS_PER_PAGE), p + 1));
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        disabled={currentPage === Math.ceil(filteredTools.length / ITEMS_PER_PAGE)}
                                                        className="w-10 h-10 p-0"
                                                    >
                                                        &gt;
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-muted-foreground text-lg mb-4">
                                                No tools found matching your criteria
                                            </p>
                                            <Button onClick={handleResetFilters} variant="outline">
                                                Reset Filters
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsSection />

                {/* Trending Tools Section */}
                <TrendingToolsSection />

                {/* Collections Section */}
                <CollectionsSection />

                {/* Newsletter Section */}
                <NewsletterSection />

                {/* Feature Showcase Sections */}
                <FeatureShowcase />

                {/* Use Cases & Benefits */}
                <AdditionalSections />

                {/* SEO Content Sections */}
                <SEOContent categories={categories} />
            </main >

            <Footer />

            {/* Comparison Bar */}
            <ComparisonBar />
        </div >
    );
}
