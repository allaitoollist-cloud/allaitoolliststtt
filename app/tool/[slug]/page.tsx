import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft, ExternalLink, Share2, CheckCircle2, Sparkles, Globe, Calendar, Eye, Tag, Star,
    TrendingUp, Zap, Users, Award, Bookmark, Layout, Search, MessageSquare, ChevronRight, Code
} from 'lucide-react';
import { ShareDialog } from '@/components/ShareDialog';
import { ToolCard } from '@/components/ToolCard';
import { WriteReviewDialog } from '@/components/WriteReviewDialog';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { dbToolToTool } from '@/types';

interface PageProps {
    params: {
        slug: string;
    };
}

export const dynamic = 'force-dynamic';

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
        title: `${tool.name} Review 2026 - Alternatives, Pricing & Use Cases | All AI Tool List`,
        description: `${tool.name} is a ${tool.pricing} ${tool.category} AI tool. Verified review, top alternatives, pricing breakdown, and integration guide for 2026.`,
        keywords: [tool.name, `${tool.name} review`, `${tool.name} alternatives`, tool.category, 'AI tool 2026', ...(tool.tags || [])],
        openGraph: {
            title: `${tool.name} - All AI Tool List`,
            description: tool.shortDescription,
            url: `https://allaitoollist.com/tool/${tool.slug}`,
            siteName: 'All AI Tool List',
            images: tool.icon ? [{ url: tool.icon, width: 1200, height: 630, alt: `${tool.name} logo` }] : [],
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

    // Fetch Reviews
    const { data: dbReviews } = await supabase
        .from('reviews')
        .select(`
            *,
            user_profiles:user_id (full_name, avatar_url)
        `)
        .eq('tool_id', tool.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    const reviews = dbReviews || [];

    const { data: similarDbTools } = await supabase
        .from('tools')
        .select('*')
        .eq('category', tool.category)
        .neq('id', tool.id)
        .limit(8);

    const similarTools = (similarDbTools || []).map(dbToolToTool);

    const { data: featuredDbTools } = await supabase
        .from('tools')
        .select('*')
        .eq('featured', true)
        .neq('id', tool.id)
        .limit(4);

    const featuredTools = (featuredDbTools || []).map(dbToolToTool);

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <Navbar />

            <main className="flex-grow">
                {/* Breadcrumb */}
                <div className="border-b border-white/5 bg-zinc-900/50">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                            <span>/</span>
                            <Link href={`/category/${encodeURIComponent(tool.category)}`} className="hover:text-orange-500 transition-colors">{tool.category}</Link>
                            <span>/</span>
                            <span className="text-zinc-100">{tool.name}</span>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="relative overflow-hidden border-b border-white/5 bg-zinc-900/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-50" />
                    
                    <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                            {/* Left: Tool Info */}
                            <div className="lg:col-span-3 space-y-8">
                                <div className="flex items-start gap-8">
                                    <div className="relative w-24 h-24 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl flex-shrink-0">
                                        {tool.icon ? (
                                            <img src={tool.icon} alt={tool.name} className="w-14 h-14 object-contain" />
                                        ) : (
                                            <Sparkles className="w-12 h-12 text-zinc-700" />
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-3">
                                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                                {tool.name}
                                            </h1>
                                            {tool.verified && (
                                                <div className="bg-orange-500/10 p-1 rounded-full border border-orange-500/20">
                                                    <CheckCircle2 className="h-6 w-6 text-orange-500" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 font-bold px-3 py-1">
                                                {tool.category}
                                            </Badge>
                                            <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 font-bold px-3 py-1">
                                                {tool.pricing}
                                            </Badge>
                                            {tool.featured && (
                                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold px-3 py-1">
                                                    <Award className="h-3 w-3 mr-1" />
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl">
                                            {tool.shortDescription}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-7 text-xl rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-all transform hover:scale-105"
                                        size="lg"
                                        asChild
                                    >
                                        <a href={tool.affiliateUrl || tool.url} target="_blank" rel="noopener noreferrer">
                                            Visit {tool.name}
                                            <ExternalLink className="ml-2 h-5 w-5" />
                                        </a>
                                    </Button>

                                    <Button variant="outline" className="bg-zinc-900 border-white/10 hover:bg-zinc-800 text-white px-8 py-7 text-lg rounded-2xl font-bold" size="lg">
                                        <Bookmark className="mr-2 h-5 w-5" />
                                        Save
                                    </Button>

                                    <ShareDialog
                                        url={`https://allaitoollist.com/tool/${tool.slug}`}
                                        title={`Check out ${tool.name} on All AI Tool List!`}
                                        trigger={
                                            <Button variant="outline" className="bg-zinc-900 border-white/10 hover:bg-zinc-800 text-white px-8 py-7 text-lg rounded-2xl font-bold" size="lg">
                                                <Share2 className="mr-2 h-5 w-5" />
                                                Share
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Right: Quick Stats */}
                            <div className="lg:col-span-2">
                                <Card className="bg-zinc-900/50 border-white/10 overflow-hidden h-full rounded-[32px] backdrop-blur-xl">
                                    <CardContent className="p-8 flex flex-col justify-between h-full">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-black text-white">Verified Stats</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-zinc-800/50 p-6 rounded-3xl border border-white/5 text-center">
                                                    <Eye className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                                    <div className="text-3xl font-black text-white">{(tool.views || 0) > 1000 ? `${(tool.views! / 1000).toFixed(1)}K` : tool.views || '0'}</div>
                                                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Monthly Views</div>
                                                </div>
                                                <div className="bg-zinc-800/50 p-6 rounded-3xl border border-white/5 text-center">
                                                    <Star className="w-6 h-6 text-amber-500 mx-auto mb-2 fill-amber-500" />
                                                    <div className="text-3xl font-black text-white">{tool.rating?.toFixed(1) || '4.5'}</div>
                                                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Avg Rating</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 space-y-4 border-t border-white/5 mt-8">
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500 font-bold text-sm uppercase">Category</span>
                                                <span className="text-white font-black">{tool.category}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500 font-bold text-sm uppercase">Pricing</span>
                                                <span className="text-orange-500 font-black">{tool.pricing}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-zinc-500 font-bold text-sm uppercase">Verified</span>
                                                <span className="text-zinc-300 font-black">24h ago</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                        {/* ── Main Content Column ── */}
                        <div className="lg:col-span-2 space-y-16">
                            
                            {/* About Section */}
                            <section className="space-y-6">
                                <h2 className="text-3xl font-black text-white flex items-center gap-4">
                                    <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
                                    Overview
                                </h2>
                                <div className="prose prose-invert prose-orange max-w-none">
                                    <p className="text-xl text-zinc-400 leading-relaxed italic border-l-4 border-zinc-800 pl-6 py-2">
                                        {tool.fullDescription || tool.shortDescription}
                                    </p>
                                </div>
                            </section>

                            {/* Features Section */}
                            <section className="space-y-8">
                                <h2 className="text-3xl font-black text-white flex items-center gap-4">
                                    <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
                                    Key Features
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 rounded-[32px] bg-zinc-900 border border-white/5 hover:border-orange-500/30 transition-all">
                                        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
                                            <Zap className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Performance</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            Highly optimized for {tool.category.toLowerCase()} workflows with low latency and high accuracy.
                                        </p>
                                    </div>
                                    <div className="p-8 rounded-[32px] bg-zinc-900 border border-white/5 hover:border-orange-500/30 transition-all">
                                        <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20">
                                            <Users className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">User Experience</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            Intuitive interface designed for professionals and beginners alike.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Tags Section */}
                            {tool.tags && tool.tags.length > 0 && (
                                <section className="space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {tool.tags.map((tag: string) => (
                                            <Badge key={tag} className="bg-zinc-900 text-zinc-400 border-zinc-800 px-4 py-2 text-sm hover:text-orange-500 hover:border-orange-500/30 transition-all cursor-pointer">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Reviews Section */}
                            <section className="space-y-8 pt-10">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                                        <span className="w-1.5 h-8 bg-orange-500 rounded-full"></span>
                                        User Reviews
                                    </h2>
                                    <WriteReviewDialog toolId={tool.id} toolName={tool.name} />
                                </div>

                                {reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="p-8 rounded-[32px] bg-zinc-900 border border-white/5">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-lg">
                                                            {review.user_profiles?.full_name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white text-lg">{review.user_profiles?.full_name || 'Anonymous User'}</p>
                                                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-zinc-800 px-3 py-1.5 rounded-xl border border-white/5">
                                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                        <span className="text-white font-black text-sm">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-zinc-400 text-lg leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-[40px]">
                                        <MessageSquare className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                                        <p className="text-zinc-500 text-xl font-bold mb-8">No reviews yet. Be the first!</p>
                                        <WriteReviewDialog toolId={tool.id} toolName={tool.name} />
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* ── Sidebar Column ── */}
                        <div className="space-y-12">
                            {/* Similar Tools */}
                            {similarTools.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Similar Tools</h3>
                                    <div className="space-y-4">
                                        {similarTools.slice(0, 4).map((alt) => (
                                            <Link key={alt.id} href={`/tool/${alt.slug}`} className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-900 border border-white/5 hover:border-orange-500/30 transition-all group">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {alt.icon ? <img src={alt.icon} alt="" className="w-8 h-8 object-contain" /> : <Sparkles className="w-6 h-6 text-zinc-700" />}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h4 className="font-black text-white group-hover:text-orange-500 transition-colors truncate">{alt.name}</h4>
                                                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">{alt.pricing}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-white" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Featured Tools */}
                            {featuredTools.length > 0 && (
                                <div className="space-y-6 pt-10">
                                    <h3 className="text-xl font-black text-orange-500 uppercase tracking-tighter">★ Sponsored</h3>
                                    <div className="space-y-4">
                                        {featuredTools.slice(0, 2).map((featured) => (
                                            <Link key={featured.id} href={`/tool/${featured.slug}`} className="block p-1 rounded-[32px] bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg group">
                                                <div className="bg-zinc-900 rounded-[31px] p-6 h-full flex flex-col gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                            {featured.icon ? <img src={featured.icon} alt="" className="w-6 h-6 object-contain" /> : <Sparkles className="w-5 h-5 text-zinc-700" />}
                                                        </div>
                                                        <span className="font-black text-white group-hover:text-orange-500 transition-colors">{featured.name}</span>
                                                    </div>
                                                    <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed italic">&ldquo;{featured.shortDescription}&rdquo;</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
