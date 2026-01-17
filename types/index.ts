// Database Types (matching Supabase schema)
export interface DatabaseTool {
    id: string;
    name: string;
    slug: string;
    short_description: string;
    full_description: string;
    url: string;
    icon: string | null;
    category: string;
    tags: string[];
    pricing: string;
    views: number;
    trending: boolean;
    featured: boolean;
    verified: boolean;
    rating: number;
    review_count: number;
    platform: string[];
    date_added: string;
    updated_at: string;
    created_at: string;
    is_draft: boolean;
}

export interface UserProfile {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string;
}

export interface Review {
    id: string;
    tool_id: string;
    user_id: string;
    rating: number;
    comment: string | null;
    helpful_count: number;
    created_at: string;
    updated_at: string;
}

export interface Favorite {
    id: string;
    user_id: string;
    tool_id: string;
    created_at: string;
}

export interface ToolSubmission {
    id: string;
    tool_name: string;
    tool_url: string;
    description: string;
    category: string;
    pricing: string;
    submitter_name: string | null;
    submitter_email: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    reviewed_at: string | null;
}

// Keep existing Tool interface for frontend compatibility
export interface Tool {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    url: string;
    icon?: string;
    category: string;
    tags: string[];
    pricing: string;
    views?: number;
    trending?: boolean;
    featured?: boolean;
    verified?: boolean;
    rating?: number;
    reviewCount?: number;
    platform?: string[];
    dateAdded?: string;
    lastUpdated?: string;
    isDraft?: boolean;
}

// Helper function to convert database format to frontend format
export function dbToolToTool(dbTool: DatabaseTool): Tool {
    return {
        id: dbTool.id,
        name: dbTool.name,
        slug: dbTool.slug,
        shortDescription: dbTool.short_description,
        fullDescription: dbTool.full_description,
        url: dbTool.url,
        icon: dbTool.icon || undefined,
        category: dbTool.category,
        tags: dbTool.tags,
        pricing: dbTool.pricing,
        views: dbTool.views,
        trending: dbTool.trending,
        featured: dbTool.featured,
        verified: dbTool.verified,
        rating: dbTool.rating,
        reviewCount: dbTool.review_count,
        platform: dbTool.platform,
        dateAdded: dbTool.date_added,
        lastUpdated: dbTool.updated_at,
        isDraft: dbTool.is_draft,
    };
}

// Helper function to convert frontend format to database format
export function toolToDbTool(tool: Partial<Tool>): Partial<DatabaseTool> {
    return {
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        short_description: tool.shortDescription,
        full_description: tool.fullDescription,
        url: tool.url,
        icon: tool.icon,
        category: tool.category,
        tags: tool.tags,
        pricing: tool.pricing,
        views: tool.views,
        trending: tool.trending,
        featured: tool.featured,
        verified: tool.verified,
        rating: tool.rating,
        review_count: tool.reviewCount,
        platform: tool.platform,
    };
}

// Category interface
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string;
    created_at: string;
}

export const categories = [
    "All",
    "Text",
    "Image",
    "Video",
    "Audio",
    "Code",
    "Writing",
    "Productivity",
    "Automation",
    "Marketing",
    "Design",
    "Business",
    "Education",
    "Research",
    "Data",
    "SEO",
    "Social Media",
    "Customer Support",
    "Other"
];

export const pricingModels = [
    "All",
    "Free",
    "Freemium",
    "Paid",
    "Contact for Pricing"
];

export const platforms = [
    "Web",
    "Mobile",
    "API",
    "Desktop",
    "Browser Extension"
];
