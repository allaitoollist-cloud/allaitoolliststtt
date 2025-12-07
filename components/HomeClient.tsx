'use client';

import { useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { Tool } from '@/types';

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
    }, [initialTools, searchQuery, selectedCategories, selectedPricing]);

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

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    {searchQuery ? 'Search Results' : 'Featured Tools'}
                                </h2>
                                <span className="text-sm text-muted-foreground">
                                    {filteredTools.length}{' '}
                                    {filteredTools.length === 1 ? 'result' : 'results'}
                                </span>
                            </div>

                            {filteredTools.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTools.map((tool) => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
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
            </main>

            <Footer />

            {/* Comparison Bar */}
            <ComparisonBar />
        </div>
    );
}
