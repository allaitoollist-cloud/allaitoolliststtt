import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

interface Article {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
    body: string[];
}

const ARTICLES: Article[] = [
    {
        slug: 'openai-searchgpt',
        title: 'OpenAI Launches SearchGPT: A Real-Time Competitive Search Engine',
        excerpt: 'The new prototype aims to challenge Google by providing real-time information with direct citations.',
        date: 'July 25, 2026',
        readTime: '4 min read',
        category: 'Product Launch',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
        body: [
            'OpenAI has unveiled SearchGPT, a new prototype search engine designed to compete directly with Google by providing real-time information alongside direct citations from authoritative sources.',
            'Unlike traditional search engines that return a list of links, SearchGPT synthesizes information from multiple sources and presents a clear, conversational answer — while still linking back to original publishers so users can verify and explore further.',
            'The launch marks a significant expansion of OpenAI\'s ambitions beyond AI assistants into the search market, which has been dominated by Google for over two decades. Early demos show SearchGPT handling complex research queries with multi-step reasoning, surfacing news, product information, and academic content in a single integrated response.',
            'Publishers and news organizations have responded with cautious optimism. OpenAI has announced partnerships with several major media companies to ensure proper attribution and revenue sharing for content surfaced through the engine.',
            'SearchGPT is currently available as a prototype to a limited waitlist of users, with a broader rollout expected in the coming months.',
        ],
    },
    {
        slug: 'llama-4-release',
        title: 'Meta Releases Llama 4: The Most Capable Open-Source Model Yet',
        excerpt: "Mark Zuckerberg unveils the new 405B parameter model that rivals the world's best closed models.",
        date: 'July 23, 2026',
        readTime: '5 min read',
        category: 'Model Release',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200',
        body: [
            'Meta has released Llama 4, the latest generation of its open-source large language model family. The flagship 405-billion parameter variant represents a major leap in capability, with benchmark scores placing it in direct competition with top closed-source models from OpenAI and Anthropic.',
            'Mark Zuckerberg announced the release on his social channels, calling it "the most powerful open model ever released" and emphasizing Meta\'s commitment to keeping frontier AI accessible to researchers, developers, and businesses worldwide.',
            'Llama 4 introduces a new architecture with improved long-context handling (supporting up to 128K tokens), enhanced multilingual support across 30+ languages, and significantly better performance on coding, mathematics, and structured reasoning tasks.',
            'The model weights are available on Hugging Face and Meta\'s website under a commercial license that allows use for most applications. Smaller variants at 8B, 70B, and 405B parameters cater to different compute budgets.',
            'The open-source AI community has responded enthusiastically, with fine-tuned versions already appearing within hours of the release. Analysts view the launch as a strategic move to keep the AI ecosystem open and to grow Meta\'s developer ecosystem ahead of future product integrations.',
        ],
    },
    {
        slug: 'ai-valuation-trends',
        title: 'AI Startup Valuation Trends: Bubble or the New Reality?',
        excerpt: 'A deep dive into why venture capital is still flowing into foundation models despite high compute costs.',
        date: 'July 20, 2026',
        readTime: '6 min read',
        category: 'Market Analysis',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
        body: [
            'Venture capital investment in AI startups continues to surge in 2026, even as critics question whether valuations have become detached from underlying business fundamentals. Foundation model companies are attracting multi-billion dollar rounds despite burning through compute resources at unprecedented rates.',
            'The key driver, investors argue, is the winner-takes-most dynamic in foundation model development. A small number of leading models are capturing the majority of enterprise spending, creating enormous incentives to back the companies most likely to reach the frontier — regardless of near-term profitability.',
            'Infrastructure costs remain the central challenge. Training a frontier model now requires hundreds of millions of dollars in GPU compute, and inference costs at scale are significant. However, hardware efficiency improvements from custom AI chips are gradually improving the unit economics.',
            'Enterprise adoption is accelerating as AI moves from experimentation to production workflows. Revenue multiples for top-tier AI companies have expanded sharply, with the best-positioned startups commanding valuations of 40–80x annualized revenue — figures that recall the dot-com era but with more concrete enterprise contracts behind them.',
            'Skeptics point to concentration risk: a handful of hyperscalers control the compute infrastructure that all AI companies depend on, and any shift in pricing or access terms could compress margins industry-wide. The debate between "bubble" and "new paradigm" is likely to continue until the first generation of AI-native businesses proves sustained, large-scale profitability.',
        ],
    },
];

export async function generateStaticParams() {
    return ARTICLES.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = ARTICLES.find(a => a.slug === params.slug);
    if (!article) return { title: 'Article Not Found' };
    return {
        title: `${article.title} | All AI Tool List News`,
        description: article.excerpt,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            images: [article.image],
            type: 'article',
        },
    };
}

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
    const article = ARTICLES.find(a => a.slug === params.slug);
    if (!article) notFound();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                {/* Hero image */}
                <div className="relative h-72 md:h-96 w-full overflow-hidden">
                    <img
                        src={article.image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 max-w-3xl mx-auto">
                        <Badge className="mb-3 bg-white/20 text-white border-0 backdrop-blur-sm">
                            {article.category}
                        </Badge>
                    </div>
                </div>

                {/* Article content */}
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to News
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> {article.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> {article.readTime}
                        </span>
                    </div>

                    <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                        {article.excerpt}
                    </p>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-5">
                        {article.body.map((para, i) => (
                            <p key={i} className="leading-relaxed">{para}</p>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
