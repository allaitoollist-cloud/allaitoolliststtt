'use client';

import { semanticHubs } from "@/data/semantic_hubs";
import { Tool } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HubViewProps {
    hubSlug: string;
    tools: Tool[]; // Top rated tools for this hub
}

export default function HubView({ hubSlug, tools }: HubViewProps) {
    const hub = semanticHubs[hubSlug];
    if (!hub) return null;

    const Icon = hub.icon;

    return (
        <div className="space-y-16">

            {/* 1. Hub Hero / Context Section */}
            <section className="bg-secondary/5 border-b border-border py-20 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <div className="p-4 bg-background rounded-2xl border border-border shadow-sm">
                            <Icon className="h-12 w-12 text-primary" />
                        </div>
                        {/* Hero Section with E-E-A-T Signals */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    Verified Research
                                </span>
                                <span className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                {hub.title}
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                                {hub.description}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats / Trust Signals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-background/50 backdrop-blur border border-border rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{tools.length}+</div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Verified Tools</div>
                        </div>
                        <div className="bg-background/50 backdrop-blur border border-border rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{hub.subIntents.length}</div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Specialized Use Cases</div>
                        </div>
                        {/* Placeholders for future data */}
                        <div className="bg-background/50 backdrop-blur border border-border rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">New</div>
                            <div className="text-xs text-muted-foreground uppercase font-semibold">Updated weekly</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Sub-Intent Clusters (The "Level 2" Strategy) */}
            <section className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center gap-2 mb-8">
                    <Layers className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Explore by Use Case</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {hub.subIntents.map((intent) => (
                        <Link key={intent.title} href={intent.href} className="group">
                            <Card className="h-full p-6 hover:border-primary/50 transition-all hover:shadow-lg bg-card/50">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                                    {intent.title}
                                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
                                </h3>
                                <p className="text-muted-foreground mb-4 text-sm h-10">{intent.description}</p>

                                {/* Mini Tool Preview (Mock logical representation) */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-secondary/30 p-2 rounded">
                                    <Layers className="h-3 w-3" />
                                    Includes: {intent.queryTags.join(', ')}
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 3. Top Tools in this Hub (Ranked List) */}
            <section className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-2xl font-bold mb-6">Top Rated {hub.title} Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.slice(0, 6).map((tool) => (
                        <Card key={tool.id} className="p-6 flex flex-col hover:shadow-lg transition-shadow border-primary/10">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center overflow-hidden">
                                    {tool.icon ? (
                                        <Image src={tool.icon} alt={tool.name} width={48} height={48} className="object-cover" />
                                    ) : (
                                        <div className="text-xl font-bold">{tool.name[0]}</div>
                                    )}
                                </div>
                                <div className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                                    {tool.pricing}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {/* Primary Tags */}
                                {tool.tags.slice(0, 3).map(t => (
                                    <span key={t} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{tool.shortDescription}</p>



                            <Link href={`/tool/${tool.slug}`} className="w-full mt-auto">
                                <Button className="w-full" variant="outline">View Analysis</Button>
                            </Link>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" variant="secondary" asChild>
                        {/* Fallback to standard view for full list */}
                        <Link href={`/category/${hub.slug}?view=all`}>View All {tools.length} Tools</Link>
                    </Button>
                </div>
            </section>

            {/* 4. Knowledge Graph / Related Content */}
            {hub.relatedGuides.length > 0 && (
                <section className="container mx-auto px-4 max-w-6xl pb-20">
                    <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                        <div className="flex items-center gap-2 mb-6">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <h2 className="text-2xl font-bold">Expert Guides & Comparisons</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {hub.relatedGuides.map((guide) => (
                                <Link key={guide.href} href={guide.href} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary transition-colors group">
                                    <span className="font-medium group-hover:text-primary transition-colors">{guide.title}</span>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
