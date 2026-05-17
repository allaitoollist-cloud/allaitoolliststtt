import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI News — Latest AI Tool Updates & Launches | All AI Tool List',
    description: 'Stay updated on the latest AI news — model releases, product launches, funding rounds, and industry trends.',
};
import { Calendar, Clock, ArrowRight, Newspaper } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
    const newsItems = [
        {
            id: 1,
            title: "Claude Opus 4.7 Launches with Extended Thinking & Tool Use",
            excerpt: "Anthropic releases its most capable model yet, featuring hybrid reasoning, extended thinking mode, and significantly improved tool use for complex agentic tasks.",
            date: "May 15, 2026",
            readTime: "5 min read",
            category: "Model Release",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            featured: true
        },
        {
            id: 2,
            title: "OpenAI GPT-5 Now Available to All ChatGPT Users",
            excerpt: "After months in limited access, GPT-5 rolls out globally with multimodal reasoning, real-time web access, and a major leap in coding performance.",
            date: "May 12, 2026",
            readTime: "4 min read",
            category: "Product Launch",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
            featured: false
        },
        {
            id: 3,
            title: "Google Gemini 2.5 Pro Tops All Major Benchmarks",
            excerpt: "Google DeepMind's latest model achieves state-of-the-art results on coding, math, and science benchmarks, outperforming all competitors in multimodal tasks.",
            date: "May 10, 2026",
            readTime: "3 min read",
            category: "Research",
            image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=800",
            featured: false
        },
        {
            id: 4,
            title: "AI Agents Are Replacing Entire Workflows in 2026",
            excerpt: "A new wave of autonomous AI agents can now handle end-to-end tasks — from research to execution — without human intervention, reshaping how businesses operate.",
            date: "May 8, 2026",
            readTime: "6 min read",
            category: "Industry Trend",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
            featured: false
        },
        {
            id: 5,
            title: "Midjourney V7 Brings Photorealistic Video Generation",
            excerpt: "Midjourney expands beyond images with V7's new video mode, generating 10-second photorealistic clips from text prompts with unprecedented quality.",
            date: "May 5, 2026",
            readTime: "4 min read",
            category: "Creative AI",
            image: "https://images.unsplash.com/photo-1642132652075-2d43371d543d?auto=format&fit=crop&q=80&w=800",
            featured: false
        },
        {
            id: 6,
            title: "EU AI Act Enforcement Begins — What Tool Makers Must Know",
            excerpt: "The EU begins enforcing the landmark AI Act. High-risk AI systems now require mandatory documentation, audits, and registration — impacting hundreds of popular tools.",
            date: "May 2, 2026",
            readTime: "5 min read",
            category: "Policy",
            image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800",
            featured: false
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative isolate overflow-hidden pt-24 pb-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="flex justify-center mb-6">
                                <div className="bg-primary/10 p-3 rounded-2xl">
                                    <Newspaper className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6">
                                Latest AI News
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground">
                                Stay updated with the latest breakthroughs, product launches, and trends in the world of Artificial Intelligence.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Featured News */}
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {newsItems.filter(item => item.featured).map(item => (
                        <div key={item.id} className="mb-12 relative group overflow-hidden rounded-2xl border border-white/10 bg-card/50">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="relative h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                            {item.category}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {item.date}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-muted-foreground text-lg mb-6">
                                        {item.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {item.readTime}
                                        </span>
                                        <Button variant="ghost" className="group/btn">
                                            Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {newsItems.filter(item => !item.featured).map((item) => (
                            <Card key={item.id} className="group overflow-hidden bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-black/50 backdrop-blur-md border-0 text-white hover:bg-black/70">
                                            {item.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> {item.date}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {item.readTime}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
                                        {item.excerpt}
                                    </p>

                                    <Button variant="link" className="p-0 h-auto w-fit text-primary group-hover:text-primary/80">
                                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" size="lg">
                            Load More News
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
