import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Share2, CheckCircle2, Sparkles, Globe, Calendar, Eye, Tag, Star, TrendingUp, Zap, Users, Award, Heart, Bookmark } from 'lucide-react';
import { ShareDialog } from '@/components/ShareDialog';
import { ToolCard } from '@/components/ToolCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { dbToolToTool, Tool } from '@/types';
import Image from 'next/image';

interface PageProps {
    params: {
        slug: string;
    };
}

export const dynamic = 'force-dynamic';

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { data: dbTool } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!dbTool) {
        return {
            title: 'Tool Not Found',
            description: 'The AI tool you are looking for could not be found.',
        };
    }

    const tool = dbToolToTool(dbTool);

    return {
        title: `${tool.name} - AI Tool Review & Alternatives | All AI Tool List`,
        description: tool.shortDescription || `Discover ${tool.name}, a powerful AI tool in the ${tool.category} category. Read reviews, compare alternatives, and visit the official website.`,
        keywords: [tool.name, tool.category, 'AI tool', 'artificial intelligence', ...(tool.tags || [])],
        openGraph: {
            title: `${tool.name} - All AI Tool List`,
            description: tool.shortDescription,
            url: `https://allaitoollist.com/tool/${tool.slug}`,
            siteName: 'All AI Tool List',
            images: tool.icon ? [
                {
                    url: tool.icon,
                    width: 1200,
                    height: 630,
                    alt: `${tool.name} logo`,
                }
            ] : [],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${tool.name} - All AI Tool List`,
            description: tool.shortDescription,
            images: tool.icon ? [tool.icon] : [],
        },
        alternates: {
            canonical: `https://allaitoollist.com/tool/${tool.slug}`,
        },
    };
}

export default async function ToolDetailPage({ params }: PageProps) {
    const { data: dbTool } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!dbTool) {
        notFound();
    }

    const tool = dbToolToTool(dbTool);

    // Fetch similar tools (alternatives)
    const { data: similarDbTools } = await supabase
        .from('tools')
        .select('*')
        .eq('category', tool.category)
        .neq('id', tool.id)
        .limit(8);

    const similarTools = (similarDbTools || []).map(dbToolToTool);

    // Fetch featured tools
    const { data: featuredDbTools } = await supabase
        .from('tools')
        .select('*')
        .eq('featured', true)
        .neq('id', tool.id)
        .limit(4);

    const featuredTools = (featuredDbTools || []).map(dbToolToTool);

    // Get theme colors based on category (consistent with ToolCard)
    const getToolTheme = (category: string) => {
        const themeMap: Record<string, any> = {
            'Image': { gradient: 'from-purple-900/20 via-indigo-900/20', border: 'border-purple-500/30', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', accent: 'purple' },
            'Video': { gradient: 'from-pink-900/20 via-rose-900/20', border: 'border-pink-500/30', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20', accent: 'pink' },
            'Audio': { gradient: 'from-orange-900/20 via-red-900/20', border: 'border-orange-500/30', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', accent: 'orange' },
            'Design': { gradient: 'from-fuchsia-900/20 via-purple-900/20', border: 'border-fuchsia-500/30', badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20', accent: 'fuchsia' },
            'Code': { gradient: 'from-emerald-900/20 via-green-900/20', border: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', accent: 'emerald' },
            'Development': { gradient: 'from-cyan-900/20 via-blue-900/20', border: 'border-cyan-500/30', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', accent: 'cyan' },
            'Data': { gradient: 'from-blue-900/20 via-indigo-900/20', border: 'border-blue-500/30', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', accent: 'blue' },
            'Business': { gradient: 'from-slate-800/20 via-gray-900/20', border: 'border-slate-400/30', badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20', accent: 'slate' },
            'Marketing': { gradient: 'from-red-900/20 via-orange-900/20', border: 'border-red-500/30', badge: 'bg-red-500/10 text-red-400 border-red-500/20', accent: 'red' },
            'SEO': { gradient: 'from-amber-900/20 via-yellow-900/20', border: 'border-amber-500/30', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', accent: 'amber' },
            'Writing': { gradient: 'from-yellow-900/20 via-amber-900/20', border: 'border-yellow-500/30', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', accent: 'yellow' },
            '3D': { gradient: 'from-indigo-900/20 via-violet-900/20', border: 'border-indigo-500/30', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', accent: 'indigo' },
            'Game': { gradient: 'from-lime-900/20 via-green-900/20', border: 'border-lime-500/30', badge: 'bg-lime-500/10 text-lime-400 border-lime-500/20', accent: 'lime' },
            'Character': { gradient: 'from-rose-900/20 via-pink-900/20', border: 'border-rose-500/30', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', accent: 'rose' },
        };

        const cat = category?.split(' ')[0] || 'Other';

        if (themeMap[cat]) return themeMap[cat];
        if (themeMap[category]) return themeMap[category];

        const keywords = Object.keys(themeMap);
        const match = keywords.find(k => category?.includes(k));
        if (match) return themeMap[match];

        return {
            gradient: 'from-gray-800/20 via-gray-900/20',
            border: 'border-primary/30',
            badge: 'bg-primary/10 text-primary border-primary/20',
            accent: 'blue'
        };
    };

    const theme = getToolTheme(tool.category);

    // JSON-LD Structured Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: tool.category,
        description: tool.shortDescription,
        url: tool.url,
        offers: {
            '@type': 'Offer',
            price: tool.pricing === 'Free' ? '0' : 'varies',
            priceCurrency: 'USD',
        },
        aggregateRating: tool.rating ? {
            '@type': 'AggregateRating',
            ratingValue: tool.rating,
            ratingCount: tool.views || 1,
        } : undefined,
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0A0A0F]">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />

            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="border-b border-white/5 bg-[#0F0F16]">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href={`/category/${encodeURIComponent(tool.category)}`} className="hover:text-white transition-colors">{tool.category}</Link>
                            <span>/</span>
                            <span className="text-white">{tool.name}</span>
                        </div>
                    </div>
                </div>

                {/* Hero Section with Tool Preview */}
                <div className={`relative overflow-hidden border-b border-white/5`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-50`} />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                    <div className="container mx-auto px-4 py-12 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            {/* Left: Tool Info */}
                            <div className="lg:col-span-3 space-y-6">
                                <div className="flex items-start gap-6">
                                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border ${theme.border} flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-2xl flex-shrink-0`}>
                                        {tool.icon ? (
                                            <img src={tool.icon} alt={tool.name} className="w-12 h-12 object-contain" />
                                        ) : (
                                            <Sparkles className="w-10 h-10 text-white/50" />
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                                {tool.name}
                                            </h1>
                                            {tool.verified && (
                                                <CheckCircle2 className="h-6 w-6 text-blue-500 flex-shrink-0" aria-label="Verified Tool" />
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <Badge className={`${theme.badge} border text-xs px-2 py-1`}>
                                                {tool.category}
                                            </Badge>
                                            <Badge className={`${tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' : tool.pricing === 'Freemium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'} border text-xs px-2 py-1`}>
                                                {tool.pricing}
                                            </Badge>
                                            {tool.featured && (
                                                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 border text-xs px-2 py-1">
                                                    <Award className="h-3 w-3 mr-1" />
                                                    Featured
                                                </Badge>
                                            )}
                                            {tool.trending && (
                                                <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 border text-xs px-2 py-1">
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                    Trending
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Rating */}
                                        {tool.rating && (
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-5 w-5 ${star <= Math.round(tool.rating!) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-white font-bold text-lg">{tool.rating.toFixed(1)}</span>
                                                {tool.views && (
                                                    <span className="text-gray-400 text-sm">({tool.views.toLocaleString()} reviews)</span>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                                            {tool.shortDescription}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-6 text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] transition-all transform hover:scale-105"
                                        size="lg"
                                        asChild
                                    >
                                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                            <Globe className="mr-2 h-5 w-5" />
                                            Visit {tool.name}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>

                                    <Button variant="outline" className="border-white/20 hover:bg-white/5 text-white px-6 py-6" size="lg">
                                        <Bookmark className="mr-2 h-5 w-5" />
                                        Save for Later
                                    </Button>

                                    <ShareDialog
                                        url={`https://allaitoollist.com/tool/${tool.slug}`}
                                        title={`Check out ${tool.name} on All AI Tool List!`}
                                        trigger={
                                            <Button variant="outline" className="border-white/20 hover:bg-white/5 text-white px-6 py-6" size="lg">
                                                <Share2 className="mr-2 h-5 w-5" />
                                                Share
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Right: Tool Screenshot/Preview */}
                            <div className="lg:col-span-2">
                                <Card className={`bg-gradient-to-br from-white/5 to-white/[0.02] border ${theme.border} overflow-hidden h-full min-h-[300px]`}>
                                    <CardContent className="p-0 h-full flex items-center justify-center">
                                        {tool.icon ? (
                                            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-8">
                                                <img
                                                    src={tool.icon}
                                                    alt={`${tool.name} preview`}
                                                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                                <Sparkles className="w-20 h-20 text-white/20 mb-4" />
                                                <p className="text-gray-500 text-sm">Tool Preview</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About Section */}
                            <Card className="bg-[#0F0F16] border-white/5 overflow-hidden">
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className={`w-1 h-8 bg-gradient-to-b from-${theme.accent}-500 to-${theme.accent}-700 rounded-full`}></div>
                                        About {tool.name}
                                    </h2>
                                    <div className="prose prose-invert prose-lg max-w-none">
                                        <p className="text-gray-300 leading-relaxed text-base mb-4">
                                            {tool.fullDescription || tool.shortDescription}
                                        </p>

                                        {/* Key Features (if we had them) */}
                                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                                                <Zap className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-white font-semibold text-sm mb-1">Fast & Efficient</h4>
                                                    <p className="text-gray-400 text-xs">Optimized for speed and performance</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                                                <Users className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-white font-semibold text-sm mb-1">User Friendly</h4>
                                                    <p className="text-gray-400 text-xs">Easy to use interface</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tags Section */}
                            {tool.tags && tool.tags.length > 0 && (
                                <Card className="bg-[#0F0F16] border-white/5">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Tag className="h-5 w-5 text-gray-400" />
                                            Tags & Features
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {tool.tags.map((tag: string) => (
                                                <Badge key={tag} variant="secondary" className="bg-white/5 text-gray-300 border-white/10 text-sm px-3 py-1 hover:bg-white/10 transition-colors cursor-pointer">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Featured Tools Section */}
                            {featuredTools.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            <Award className="h-6 w-6 text-amber-500" />
                                            Featured AI Tools
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {featuredTools.map(featured => (
                                            <ToolCard key={featured.id} tool={featured} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Card className="bg-gradient-to-br from-[#0F0F16] to-[#1A1A2E] border-white/5 sticky top-24">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-semibold text-white text-lg mb-4">Quick Stats</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {tool.views && (
                                            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                                                <Eye className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                                                <div className="text-2xl font-bold text-white">{(tool.views / 1000).toFixed(1)}K</div>
                                                <div className="text-xs text-gray-400">Views</div>
                                            </div>
                                        )}
                                        {tool.rating && (
                                            <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
                                                <Star className="h-5 w-5 text-yellow-400 mx-auto mb-2 fill-yellow-400" />
                                                <div className="text-2xl font-bold text-white">{tool.rating.toFixed(1)}</div>
                                                <div className="text-xs text-gray-400">Rating</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 text-sm pt-4 border-t border-white/10">
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-gray-400 flex items-center gap-2">
                                                <Tag className="h-4 w-4" />
                                                Category
                                            </span>
                                            <Link href={`/category/${encodeURIComponent(tool.category)}`}>
                                                <Badge className={`${theme.badge} border cursor-pointer hover:opacity-80`}>
                                                    {tool.category}
                                                </Badge>
                                            </Link>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-gray-400 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Added
                                            </span>
                                            <span className="font-medium text-white text-xs">
                                                {tool.dateAdded ? new Date(tool.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-gray-400">Pricing</span>
                                            <Badge className={`${tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' : tool.pricing === 'Freemium' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'} border text-xs`}>
                                                {tool.pricing}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* CTA Card */}
                            <Card className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} overflow-hidden`}>
                                <CardContent className="p-6 text-center">
                                    <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
                                    <h3 className="text-white font-bold text-lg mb-2">Try {tool.name} Today</h3>
                                    <p className="text-gray-300 text-sm mb-4">Experience the power of AI</p>
                                    <Button
                                        className="w-full bg-white hover:bg-gray-200 text-black font-bold"
                                        asChild
                                    >
                                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                            Get Started
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Alternatives Section */}
                    {similarTools.length > 0 && (
                        <div className="mt-16">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-white mb-3">
                                    🔄 AI Alternatives for {tool.name}
                                </h2>
                                <p className="text-gray-400 text-lg">
                                    Explore {similarTools.length} more AI tools in the {tool.category} category
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {similarTools.map(similar => (
                                    <ToolCard key={similar.id} tool={similar} />
                                ))}
                            </div>

                            <div className="text-center mt-8">
                                <Link href={`/category/${encodeURIComponent(tool.category)}`}>
                                    <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/5 text-white">
                                        View All {tool.category} Tools
                                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
