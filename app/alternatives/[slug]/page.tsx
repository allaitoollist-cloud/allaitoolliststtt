import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { dbToolToTool } from '@/types';
import { ToolCard } from '@/components/ToolCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        slug: string;
    };
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { data: dbTool } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!dbTool) {
        return { title: 'Tool Not Found' };
    }

    const tool = dbToolToTool(dbTool);

    return {
        title: `${tool.name} Alternatives - Best ${tool.category} Tools Like ${tool.name}`,
        description: `Looking for ${tool.name} alternatives? Discover ${tool.category} AI tools similar to ${tool.name}. Compare features, pricing, and find the best alternative for your needs.`,
        keywords: [
            `${tool.name} alternatives`,
            `tools like ${tool.name}`,
            `${tool.name} competitors`,
            `best ${tool.category} tools`,
            `${tool.name} vs`,
        ],
        openGraph: {
            title: `${tool.name} Alternatives - Best Similar Tools`,
            description: `Discover the best alternatives to ${tool.name}. Compare features, pricing, and reviews.`,
            url: `https://allaitoollist.com/alternatives/${params.slug}`,
            type: 'website',
        },
        alternates: {
            canonical: `https://allaitoollist.com/alternatives/${params.slug}`,
        },
    };
}

export default async function AlternativesPage({ params }: PageProps) {
    // Fetch the main tool
    const { data: dbTool } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!dbTool) {
        notFound();
    }

    const tool = dbToolToTool(dbTool);

    // Fetch alternatives (same category, different tool)
    const { data: alternativesDb } = await supabase
        .from('tools')
        .select('*')
        .eq('category', tool.category)
        .neq('id', tool.id)
        .order('views', { ascending: false })
        .limit(12);

    const alternatives = (alternativesDb || []).map(dbToolToTool);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-bright-green/10 via-local-blue/10 to-bright-green/10 border-b border-border">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-4xl mx-auto">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                                <Link href="/" className="hover:text-foreground">Home</Link>
                                <span>/</span>
                                <Link href={`/tool/${tool.slug}`} className="hover:text-foreground">{tool.name}</Link>
                                <span>/</span>
                                <span className="text-foreground">Alternatives</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                                Best {tool.name} Alternatives
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground mb-8">
                                Looking for alternatives to {tool.name}? We've curated {alternatives.length}+ similar {tool.category} AI tools that might be a better fit for your needs. Compare features, pricing, and user reviews to find your perfect match.
                            </p>

                            {/* Original Tool Card */}
                            <Card className="bg-card border-bright-green/30">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {tool.icon && (
                                            <img src={tool.icon} alt={tool.name} className="w-16 h-16 rounded-lg" />
                                        )}
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-foreground">{tool.name}</h3>
                                                <Badge className="bg-bright-green/10 text-bright-green border-bright-green/20">
                                                    Original Tool
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground mb-4">{tool.shortDescription}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="secondary">{tool.category}</Badge>
                                                <Badge variant="secondary">{tool.pricing}</Badge>
                                            </div>
                                        </div>
                                        <Link href={`/tool/${tool.slug}`}>
                                            <Button variant="outline">View Details</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Alternatives Grid */}
                <div className="container mx-auto px-4 py-12">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            {alternatives.length} {tool.name} Alternatives
                        </h2>
                        <p className="text-muted-foreground">
                            Explore these {tool.category} tools that offer similar or better features than {tool.name}.
                        </p>
                    </div>

                    {alternatives.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {alternatives.map((alt) => (
                                <ToolCard key={alt.id} tool={alt} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">No alternatives found yet.</p>
                            <Link href={`/category/${tool.category}`}>
                                <Button variant="outline">Browse {tool.category} Tools</Button>
                            </Link>
                        </div>
                    )}

                    {/* Why Look for Alternatives Section */}
                    <div className="mt-16 pt-12 border-t border-border">
                        <h3 className="text-2xl font-bold text-foreground mb-6">
                            Why Look for {tool.name} Alternatives?
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-card">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-bright-green flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2">Better Pricing Options</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Find tools with more flexible pricing plans that fit your budget.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-bright-green flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2">Different Features</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Discover tools with unique features that better match your workflow.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-bright-green flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2">Better Performance</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Some alternatives may offer faster processing or better results.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-bright-green flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2">Privacy & Security</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Find tools with stronger data protection and privacy policies.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center bg-gradient-to-r from-bright-green/10 to-local-blue/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-4">
                            Can't Find the Right Alternative?
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Browse our complete directory of {tool.category} AI tools.
                        </p>
                        <Link href={`/category/${tool.category}`}>
                            <Button size="lg" className="bg-bright-green hover:bg-bright-green-hover text-white">
                                View All {tool.category} Tools
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
