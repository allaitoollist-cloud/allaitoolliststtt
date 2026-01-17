import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { dbToolToTool } from '@/types';
import { ToolCard } from '@/components/ToolCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, TrendingUp, Users, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        industry: string;
    };
}

// Industry data with descriptions
const industryData: Record<string, { title: string; description: string; icon: any; keywords: string[] }> = {
    'marketing': {
        title: 'Marketing',
        description: 'Discover AI-powered marketing tools to automate campaigns, analyze data, optimize SEO, and boost your marketing ROI.',
        icon: TrendingUp,
        keywords: ['marketing automation', 'SEO tools', 'social media management', 'email marketing', 'analytics'],
    },
    'business': {
        title: 'Business',
        description: 'Streamline your business operations with AI tools for project management, CRM, analytics, and workflow automation.',
        icon: Briefcase,
        keywords: ['business automation', 'CRM', 'project management', 'analytics', 'productivity'],
    },
    'content-creation': {
        title: 'Content Creation',
        description: 'Create stunning content faster with AI tools for writing, image generation, video editing, and design.',
        icon: Zap,
        keywords: ['content writing', 'image generation', 'video editing', 'graphic design', 'copywriting'],
    },
    'education': {
        title: 'Education',
        description: 'Enhance learning and teaching with AI tools for students, teachers, and educational institutions.',
        icon: Users,
        keywords: ['learning tools', 'teaching aids', 'study helpers', 'educational software', 'tutoring'],
    },
    'ecommerce': {
        title: 'E-commerce',
        description: 'Boost your online store with AI tools for product descriptions, customer service, inventory management, and sales optimization.',
        icon: TrendingUp,
        keywords: ['product descriptions', 'customer service', 'inventory management', 'sales optimization', 'chatbots'],
    },
};

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const industry = params.industry;
    const data = industryData[industry];

    if (!data) {
        return { title: 'Industry Not Found' };
    }

    return {
        title: `Best AI Tools for ${data.title} - Top ${data.title} AI Software 2024`,
        description: `${data.description} Find the best AI tools for ${data.title.toLowerCase()} professionals. Compare features, pricing, and reviews.`,
        keywords: [`AI tools for ${data.title.toLowerCase()}`, ...data.keywords],
        openGraph: {
            title: `Best AI Tools for ${data.title}`,
            description: data.description,
            url: `https://allaitoollist.com/industry/${industry}`,
            type: 'website',
        },
        alternates: {
            canonical: `https://allaitoollist.com/industry/${industry}`,
        },
    };
}

export default async function IndustryPage({ params }: PageProps) {
    const industry = params.industry;
    const data = industryData[industry];

    if (!data) {
        notFound();
    }

    // Fetch relevant tools based on industry keywords
    const { data: dbTools } = await supabase
        .from('tools')
        .select('*')
        .or(data.keywords.map(k => `category.ilike.%${k}%`).join(','))
        .order('views', { ascending: false })
        .limit(50);

    const tools = (dbTools || []).map(dbToolToTool);

    const Icon = data.icon;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-bright-green/10 via-local-blue/10 to-bright-green/10 border-b border-border">
                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-bright-green/10 text-bright-green px-4 py-2 rounded-full mb-6">
                                <Icon className="h-5 w-5" />
                                <span className="font-semibold">{data.title} Industry</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                                Best AI Tools for {data.title}
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground mb-8">
                                {data.description}
                            </p>

                            <div className="flex flex-wrap gap-2 justify-center">
                                {data.keywords.map((keyword) => (
                                    <Badge key={keyword} variant="secondary" className="text-sm">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tools Grid */}
                <div className="container mx-auto px-4 py-12">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            {tools.length}+ AI Tools for {data.title} Professionals
                        </h2>
                        <p className="text-muted-foreground">
                            Handpicked and verified AI tools to help you succeed in {data.title.toLowerCase()}.
                        </p>
                    </div>

                    {tools.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {tools.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">No tools found for this industry yet.</p>
                            <Link href="/">
                                <Button variant="outline">Browse All Tools</Button>
                            </Link>
                        </div>
                    )}

                    {/* Related Categories */}
                    <div className="mt-16 pt-12 border-t border-border">
                        <h3 className="text-xl font-bold text-foreground mb-6">Related Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data.keywords.slice(0, 4).map((keyword) => (
                                <Link key={keyword} href={`/category/${keyword}`}>
                                    <Button variant="outline" className="w-full">
                                        {keyword}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Generate static params for known industries
export async function generateStaticParams() {
    return Object.keys(industryData).map((industry) => ({
        industry,
    }));
}
