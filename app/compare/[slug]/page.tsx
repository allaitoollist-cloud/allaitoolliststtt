// FROZEN TEMPLATE: DO NOT ALTER STRUCTURE
// This template is locked for SEO consistency.
// Structural changes require a system-level update.

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star, Zap, ArrowRight, Scale, Info, CheckCircle2, ThumbsUp, ThumbsDown, HelpCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { dbToolToTool } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        slug: string;
    };
}

async function getToolsFromSlug(slug: string) {
    const parts = slug.split('-vs-');
    if (parts.length !== 2) return null;
    const [slug1, slug2] = parts;
    const { data: tools } = await supabase.from('tools').select('*').in('slug', [slug1, slug2]);
    if (!tools || tools.length < 2) return null;

    // sorting to match slug order
    const t1 = tools.find(t => t.slug === slug1);
    const t2 = tools.find(t => t.slug === slug2);

    if (!t1 || !t2) return null;

    return [dbToolToTool(t1), dbToolToTool(t2)];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const tools = await getToolsFromSlug(params.slug);
    if (!tools) return { title: 'Comparison Not Found' };

    const [t1, t2] = tools;
    return {
        title: `${t1.name} vs ${t2.name}: Which AI Tool is Better? (2024 Comparison)`,
        description: `Detailed side-by-side comparison of ${t1.name} vs ${t2.name}. Compare features, pricing, ratings, and pros & cons to decide which is best for you.`,
        openGraph: {
            title: `${t1.name} vs ${t2.name} Comparison`,
            description: `Compare ${t1.name} and ${t2.name} features and pricing.`,
            type: 'article',
        }
    };
}

export default async function ComparisonPage({ params }: PageProps) {
    const tools = await getToolsFromSlug(params.slug);
    if (!tools) return notFound();
    const [tool1, tool2] = tools;

    // Helper for table cells
    const renderCheck = (val: boolean) => val ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <div className="h-0.5 w-3 bg-gray-200 mx-auto" />;

    // Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `${tool1.name} vs ${tool2.name}: Which AI Tool is Better?`,
        about: [
            { '@type': 'SoftwareApplication', name: tool1.name, applicationCategory: tool1.category },
            { '@type': 'SoftwareApplication', name: tool2.name, applicationCategory: tool2.category }
        ]
    };

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/10">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <Navbar />

            <main className="flex-grow pt-8 pb-20">

                {/* 1. Header Section */}
                <div className="container mx-auto px-4 max-w-6xl">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 justify-center">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/compare" className="hover:text-primary transition-colors">Comparisons</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">{tool1.name} vs {tool2.name}</span>
                    </nav>

                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold mb-6 border border-primary/20">
                            <Scale className="h-3.5 w-3.5" /> AI HEAD-TO-HEAD
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            {tool1.name} <span className="text-muted-foreground font-light text-3xl md:text-5xl align-middle px-2">vs</span> {tool2.name}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Comparing <strong>{tool1.name}</strong> and <strong>{tool2.name}</strong> to help you decide which {tool1.category.toLowerCase()} tool fits your needs best.
                        </p>
                    </div>
                </div>

                {/* 2. Quick Summary / Verdict Cards */}
                <div className="container mx-auto px-4 mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start relative">

                        {/* Tool 1 Card */}
                        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-center flex flex-col items-center group">
                            <div className="w-20 h-20 bg-white border border-border rounded-xl flex items-center justify-center p-2 mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                {tool1.icon ? <Image src={tool1.icon} alt={tool1.name} width={64} height={64} className="object-contain" /> : <span className="text-2xl font-bold text-muted-foreground">{tool1.name[0]}</span>}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{tool1.name}</h2>
                            <Badge variant="outline" className="mb-4">{tool1.pricing}</Badge>

                            <div className="w-full bg-secondary/20 rounded-lg p-3 mb-6 text-sm font-medium text-muted-foreground">
                                Best for: <span className="text-foreground font-bold">{tool1.tags[0] || 'General Use'}</span>
                            </div>

                            <Link href={`/tool/${tool1.slug}`} className="w-full">
                                <Button className="w-full h-12 font-bold" variant="outline">Learn More</Button>
                            </Link>
                        </div>

                        {/* VS Badge */}
                        <div className="hidden lg:flex flex-col items-center justify-center z-10 absolute left-1/2 top-[100px] -translate-x-1/2">
                            <div className="w-16 h-16 rounded-full bg-white border-4 border-muted flex items-center justify-center shadow-lg font-black text-xl text-muted-foreground">
                                VS
                            </div>
                        </div>

                        {/* Tool 2 Card */}
                        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-center flex flex-col items-center lg:col-start-3 group">
                            <div className="w-20 h-20 bg-white border border-border rounded-xl flex items-center justify-center p-2 mb-4 shadow-sm group-hover:scale-105 transition-transform">
                                {tool2.icon ? <Image src={tool2.icon} alt={tool2.name} width={64} height={64} className="object-contain" /> : <span className="text-2xl font-bold text-muted-foreground">{tool2.name[0]}</span>}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{tool2.name}</h2>
                            <Badge variant="outline" className="mb-4">{tool2.pricing}</Badge>

                            <div className="w-full bg-secondary/20 rounded-lg p-3 mb-6 text-sm font-medium text-muted-foreground">
                                Best for: <span className="text-foreground font-bold">{tool2.tags[0] || 'Advanced Use'}</span>
                            </div>

                            <Link href={`/tool/${tool2.slug}`} className="w-full">
                                <Button className="w-full h-12 font-bold" variant="outline">Learn More</Button>
                            </Link>
                        </div>

                    </div>
                </div>

                {/* 3. Feature Comparison Table */}
                <section className="container mx-auto px-4 max-w-5xl mb-20">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Feature Breakdown</h2>
                    </div>

                    <div className="border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
                        <div className="grid grid-cols-3 bg-secondary/30 p-5 font-bold border-b border-border text-sm md:text-base sticky top-0">
                            <div className="text-muted-foreground self-center">Comparison Point</div>
                            <div className="text-center text-primary">{tool1.name}</div>
                            <div className="text-center text-primary">{tool2.name}</div>
                        </div>

                        {[
                            { name: "Pricing Model", v1: tool1.pricing, v2: tool2.pricing },
                            { name: "Verified", v1: tool1.verified ? "Yes, Verified" : "Unverified", v2: tool2.verified ? "Yes, Verified" : "Unverified" },
                            { name: "Website", v1: "Live", v2: "Live" },
                            { name: "User Rating", v1: `${tool1.rating}/5.0`, v2: `${tool2.rating}/5.0` },
                            { name: "Total Reviews", v1: tool1.reviewCount, v2: tool2.reviewCount },
                            { name: "Primary Category", v1: tool1.category, v2: tool2.category },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-3 p-4 md:p-5 border-b border-border/50 last:border-0 hover:bg-secondary/5 transition-colors text-sm md:text-base items-center">
                                <div className="font-medium text-foreground">{row.name}</div>
                                <div className="text-center font-semibold text-muted-foreground">{row.v1}</div>
                                <div className="text-center font-semibold text-muted-foreground">{row.v2}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Pros & Cons (Side by Side) */}
                <section className="container mx-auto px-4 max-w-5xl mb-20">
                    <h2 className="text-2xl font-bold mb-8 text-center">Pros & Cons Comparison</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-center mb-4">{tool1.name}</h3>
                            <div className="border border-green-200 bg-green-50/10 rounded-xl p-6 mb-4">
                                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> Pros</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> User friendly interface</li>
                                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Strong {tool1.category} features</li>
                                </ul>
                            </div>
                            <div className="border border-red-200 bg-red-50/10 rounded-xl p-6">
                                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2"><ThumbsDown className="h-4 w-4" /> Cons</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5" /> Limited advanced customization</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-center mb-4">{tool2.name}</h3>
                            <div className="border border-green-200 bg-green-50/10 rounded-xl p-6 mb-4">
                                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> Pros</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Powerful API integrations</li>
                                    <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> Scalable for teams</li>
                                </ul>
                            </div>
                            <div className="border border-red-200 bg-red-50/10 rounded-xl p-6">
                                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2"><ThumbsDown className="h-4 w-4" /> Cons</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex gap-2"><div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5" /> Higher pricing tier</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6 & 7. Pricing & Decision Guidance */}
                <section className="bg-secondary/5 py-16 border-y border-border">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">The Verdict: Which tool should you choose?</h2>
                            <p className="text-muted-foreground">Based on our analysis of features, pricing, and user reviews.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Choose A if... */}
                            <div className="bg-background p-8 rounded-2xl border border-border shadow-sm flex flex-col">
                                <div className="mb-4 text-primary font-bold text-lg">Choose {tool1.name} if...</div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                        You need a <strong>{tool1.pricing}</strong> solution.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                        Your primary focus is <strong>{tool1.tags[0] || tool1.category}</strong>.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                        You prefer ease of use over complexity.
                                    </li>
                                </ul>
                                <Button className="w-full h-12" asChild><a href={tool1.url} target="_blank">Visit {tool1.name} Website</a></Button>
                            </div>

                            {/* Choose B if... */}
                            <div className="bg-background p-8 rounded-2xl border border-border shadow-sm flex flex-col">
                                <div className="mb-4 text-primary font-bold text-lg">Choose {tool2.name} if...</div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                        You are looking for a <strong>{tool2.pricing}</strong> alternative.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                        You need advanced <strong>{tool2.tags[0] || 'Integrations'}</strong>.
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                        Scalability is your top priority.
                                    </li>
                                </ul>
                                <Button className="w-full h-12" asChild><a href={tool2.url} target="_blank">Visit {tool2.name} Website</a></Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. FAQs */}
                <section className="container mx-auto px-4 max-w-3xl py-20">
                    <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full border border-border rounded-xl">
                        <AccordionItem value="q1" className="px-6">
                            <AccordionTrigger>Is {tool1.name} cheaper than {tool2.name}?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {tool1.pricing === 'Free' && tool2.pricing !== 'Free' ? `Yes, ${tool1.name} offers a free plan while ${tool2.name} is paid.` :
                                    tool1.pricing !== 'Free' && tool2.pricing === 'Free' ? `No, ${tool2.name} is free while ${tool1.name} is paid.` :
                                        `Both tools offer similar pricing models (${tool1.pricing}). Check their official sites for specific tier details.`}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="q2" className="px-6">
                            <AccordionTrigger>Which tool is better for {tool1.category}?</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Both tools are strong contenders in {tool1.category}. {tool1.name} is generally preferred for its {tool1.shortDescription.slice(0, 30)}..., while {tool2.name} is known for {tool2.shortDescription.slice(0, 30)}...
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* 8. Internal Linking */}
                <section className="border-t border-border py-12 bg-secondary/5">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-muted-foreground mb-4">Explore individual reviews</p>
                        <div className="flex justify-center gap-4">
                            <Link href={`/tool/${tool1.slug}`} className="text-primary font-semibold hover:underline border-r border-border pr-4">
                                {tool1.name} Review
                            </Link>
                            <Link href={`/tool/${tool2.slug}`} className="text-primary font-semibold hover:underline">
                                {tool2.name} Review
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
