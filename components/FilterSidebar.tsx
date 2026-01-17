import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categories, pricingModels, platforms } from '@/types';
import { Star, ArrowUpDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FilterSidebarProps {
    selectedCategories: string[];
    selectedPricing: string[];
    selectedPlatforms?: string[];
    availableCategories?: string[]; // Added prop
    minRating?: number;
    sortBy?: string;
    onCategoryToggle: (category: string) => void;
    onPricingToggle: (pricing: string) => void;
    onPlatformToggle?: (platform: string) => void;
    onRatingChange?: (rating: number) => void;
    onSortChange?: (sort: string) => void;
    onReset: () => void;
}

export function FilterSidebar({
    selectedCategories,
    selectedPricing,
    selectedPlatforms = [],
    availableCategories = categories, // Default to imported list if not provided
    minRating = 0,
    sortBy = 'views',
    onCategoryToggle,
    onPricingToggle,
    onPlatformToggle,
    onRatingChange,
    onSortChange,
    onReset,
}: FilterSidebarProps) {
    const ratings = [5, 4, 3, 2, 1];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={onReset}>
                    Reset
                </Button>
            </div>

            <Separator />

            {/* Sort By */}
            {onSortChange && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        <Label className="text-sm font-medium">Sort By</Label>
                    </div>
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="views">Most Popular</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="name">Name (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <Separator />

            {/* Rating Filter */}
            {onRatingChange && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Minimum Rating</Label>
                    <div className="space-y-2">
                        {ratings.map((rating) => (
                            <div
                                key={rating}
                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${minRating === rating ? 'bg-primary/10' : 'hover:bg-secondary/50'
                                    }`}
                                onClick={() => onRatingChange(rating)}
                            >
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm">& up</span>
                            </div>
                        ))}
                        <div
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${minRating === 0 ? 'bg-primary/10' : 'hover:bg-secondary/50'
                                }`}
                            onClick={() => onRatingChange(0)}
                        >
                            <span className="text-sm">All Ratings</span>
                        </div>
                    </div>
                </div>
            )}

            <Separator />

            {/* Categories */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Categories</Label>
                <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                        {availableCategories.filter(cat => cat !== 'All').map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`category-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onCheckedChange={() => onCategoryToggle(category)}
                                />
                                <Label
                                    htmlFor={`category-${category}`}
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    {category}
                                </Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Pricing</Label>
                <div className="space-y-2">
                    {pricingModels.filter(p => p !== 'All').map((pricing) => (
                        <div key={pricing} className="flex items-center space-x-2">
                            <Checkbox
                                id={`pricing-${pricing}`}
                                checked={selectedPricing.includes(pricing)}
                                onCheckedChange={() => onPricingToggle(pricing)}
                            />
                            <Label
                                htmlFor={`pricing-${pricing}`}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {pricing}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Platform */}
            {onPlatformToggle && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Platform</Label>
                    <div className="space-y-2">
                        {platforms.map((platform) => (
                            <div key={platform} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`platform-${platform}`}
                                    checked={selectedPlatforms.includes(platform)}
                                    onCheckedChange={() => onPlatformToggle(platform)}
                                />
                                <Label
                                    htmlFor={`platform-${platform}`}
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    {platform}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
