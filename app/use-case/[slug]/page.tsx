// FROZEN TEMPLATE: DO NOT ALTER STRUCTURE
// This template is locked for SEO consistency.
// Structural changes require a system-level update.

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { dbToolToTool, categories } from '@/types';
import CategoryClient from '@/components/CategoryClient';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info, HelpCircle, Layers, Check, Search, Shield } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        slug: string;
    };
}

// Map "Use Case" slugs to Database Queries
async function getToolsForUseCase(slug: string) {
    // 1. Try matching by TAG (Exact or Contained)
    // The previous .contains('tags', [slug]) handles JSONB array containment
    const { data: tagTools } = await supabase
        .from('tools')
        .select('*')
        .contains('tags', [slug]) // Requires tag to be exactly in the array
        .order('views', { ascending: false });

    if (tagTools && tagTools.length > 0) return tagTools;

    // 2. Try matching by Category (Case Insensitive)
    const { data: catTools } = await supabase
        .from('tools')
        .select('*')
        .ilike('category', `%${slug.replace(/-/g, ' ')}%`) // Partial match for category
        .order('views', { ascending: false });

    return catTools || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const formattedSlug = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const title = `Best AI Tools for ${formattedSlug} (2024 Guide)`;
    const description = `Discover top-rated AI tools for ${formattedSlug}. Streamline your workflow, automate tasks, and compare the best software solutions for ${formattedSlug}.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://aitoollist.com/use-case/${params.slug}`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://aitoollist.com/use-case/${params.slug}`,
        }
    };
}

export default async function UseCasePage({ params }: PageProps) {
    const dbTools = await getToolsForUseCase(params.slug);

    if (!dbTools || dbTools.length === 0) {
        return notFound();
    }

    const publishedTools = (dbTools || []).filter(t => !t.is_draft);
    if (publishedTools.length === 0) return notFound();

    const tools = publishedTools.map(dbToolToTool);
    const formattedTitle = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Dynamic SEO Content Generation tailored to Intent
    const problemStatement = `
        <p class="mb-4">
            Professionals and creators focused on <strong>${formattedTitle}</strong> are increasingly turning to Artificial Intelligence to overcome common bottlenecks. 
            Whether it's the need for speed, precision, or scaling operations, AI tools for ${formattedTitle} offer powerful solutions.
        </p>
        <p>
            This curated list features the top software choices available today. By leveraging these tools, you can automate manual processes, 
            unlock new creative possibilities, and gain a competitive edge in the field of ${formattedTitle}.
        </p>
    `;

    // Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `AI Tools for ${formattedTitle}`,
        description: `Curated list of AI software for ${formattedTitle}.`,
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: tools.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://aitoollist.com/tool/${tool.slug}`,
                name: tool.name
            }))
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />

            <main className="flex-grow">

                {/* 1. Use Case Header */}
                <div className="pt-24 pb-12 border-b border-border">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <nav className="flex justify-center items-center text-sm text-muted-foreground mb-6">
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-foreground capitalize">{formattedTitle}</span>
                        </nav>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
                            Best AI Tools for {formattedTitle}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Discover how AI is transforming {formattedTitle} with tools that save time,
                            reduce errors, and boost productivity.
                        </p>
                    </div>
                </div>

                {/* 2. Problem & Solution Overview (SEO Core) */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="bg-secondary/5 rounded-2xl p-8 border border-border">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Info className="h-6 w-6 text-primary" /> Why use AI for {formattedTitle}?
                            </h2>
                            <div className="prose prose-lg dark:prose-invert text-muted-foreground" dangerouslySetInnerHTML={{ __html: problemStatement }} />
                        </div>
                    </div>
                </section>

                {/* 3. Best AI Tools Grid */}
                <div id="tools">
                    <CategoryClient tools={tools} category={formattedTitle} />
                </div>

                {/* 4. How to Choose */}
                <section className="py-16 bg-secondary/5 border-y border-border">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <h2 className="text-3xl font-bold mb-8 text-center">How to Choose the Right Tool</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-background p-6 rounded-xl border border-border">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <Search className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold mb-2">Identify Needs</h3>
                                <p className="text-sm text-muted-foreground">Do you need automation, generation, or analytics? Define your primary bottleneck first.</p>
                            </div>
                            <div className="bg-background p-6 rounded-xl border border-border">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold mb-2">Check Integration</h3>
                                <p className="text-sm text-muted-foreground">Ensure the tool plays nicely with your existing {formattedTitle} workflow and software stack.</p>
                            </div>
                            <div className="bg-background p-6 rounded-xl border border-border">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                                    <Check className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold mb-2">Start Small</h3>
                                <p className="text-sm text-muted-foreground">Most tools offer free trials. Test one that fits your budget before rolling it out fully.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Internal Linking / Related */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Layers className="h-6 w-6 text-primary" /> key Categories for {formattedTitle}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {categories.filter(c => c !== 'All').map(cat => (
                                <Link
                                    key={cat}
                                    href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="px-4 py-2 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. FAQs */}
                <section className="py-16 bg-secondary/5 border-t border-border">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <h2 className="text-2xl font-bold mb-8 text-center">Common Questions</h2>
                        <Accordion type="single" collapsible className="w-full bg-background rounded-xl border border-border px-6">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg">Will AI replace {formattedTitle} jobs?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    AI is designed to augment {formattedTitle} roles, not necessarily replace them. It handles repetitive tasks, allowing professionals to focus on strategy and creativity.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg">Are these tools suitable for beginners?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                                    Yes, many tools on this list offer intuitive interfaces and templates specifically designed for those new to AI automation in {formattedTitle}.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>

                {/* 8. Conversion CTA */}
                <section className="py-20 border-t border-border">
                    <div className="container mx-auto px-4 text-center max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Don't see your favorite tool?</h2>
                        <p className="text-muted-foreground mb-8 text-lg">
                            We are constantly updating our directory for {formattedTitle}. Submit a tool to help the community.
                        </p>
                        <Link href="/submit">
                            <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                                Submit a Tool
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
