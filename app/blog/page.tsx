import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'AI Blog: Top AI Tools for Marketing & Business Reviews 2026',
    description: 'Read expert reviews on the best free AI tools, learn how to choose AI software for your business, and discover tools that save time. Your ultimate AI resource.',
};

export default async function BlogPage() {
    const { data: blogs, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blogs:', error);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-24 bg-gradient-to-br from-[#0A0A0F] via-[#050508] to-black border-b border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px]" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

                    <div className="container relative mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1">
                                <Sparkles className="h-3 w-3 mr-2" />
                                2026 Strategy: Topic Clusters & Intent
                            </Badge>
                            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
                                Beyond Keywords: The <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Architecture of Intent.</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                Our blog is structured into <span className="text-white font-bold">Topical Clusters</span> to provide semantic depth for both human searchers and Generative AI Answer Engines (AEO).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Topic Clusters Visualization (The "Gucche" Section) */}
                <section className="py-12 bg-[#050508]">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "AI Marketing Cluster", count: 12, desc: "AEO, Influencer AI, and Growth Hacks.", color: "blue" },
                                { title: "Content Synthesis Cluster", count: 8, desc: "Generative Writing, Art, and Video.", color: "purple" },
                                { title: "Efficiency & Ops Cluster", count: 15, desc: "AI Agents, Automation, and Productivity.", color: "emerald" }
                            ].map((cluster, i) => (
                                <div key={i} className="group p-6 rounded-2xl bg-[#0F0F16] border border-white/5 hover:border-white/20 transition-all">
                                    <div className={`w-10 h-10 rounded-lg bg-${cluster.color}-500/10 flex items-center justify-center mb-4`}>
                                        <div className={`w-2 h-2 rounded-full bg-${cluster.color}-500 animate-pulse`} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{cluster.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{cluster.desc}</p>
                                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{cluster.count} ARTICLES IN CLUSTER</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Latest Insights / Pillar Content */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">
                                    Latest <span className="text-primary">Semantic Insights</span>
                                </h2>
                                <p className="text-gray-400">
                                    Explore our most recent deep-dives. We prioritize informational intent to help you navigate the AI landscape in 2026.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Badge variant="outline" className="cursor-pointer hover:bg-white/5">ALL</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-white/5 opacity-50">MARKETING</Badge>
                                <Badge variant="outline" className="cursor-pointer hover:bg-white/5 opacity-50">TUTORIALS</Badge>
                            </div>
                        </div>
                        {blogs && blogs.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogs.map((blog) => (
                                    <Link key={blog.id} href={`/blog/${blog.slug}`}>
                                        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-white/10 bg-card/50 backdrop-blur overflow-hidden group">
                                            {blog.cover_image && (
                                                <div className="relative h-48 overflow-hidden bg-muted">
                                                    <img
                                                        src={blog.cover_image}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            <CardContent className="p-6 space-y-4">
                                                {blog.category && (
                                                    <Badge variant="secondary" className="mb-2">
                                                        {blog.category}
                                                    </Badge>
                                                )}
                                                <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                                    {blog.title}
                                                </h3>
                                                {blog.excerpt && (
                                                    <p className="text-muted-foreground line-clamp-3 text-sm">
                                                        {blog.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>5 min read</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-primary font-medium pt-2">
                                                    Read More
                                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-xl text-muted-foreground">
                                    {error ? 'Failed to load blogs' : 'No blog posts published yet'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Check back soon for new articles!
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
