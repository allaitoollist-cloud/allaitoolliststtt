import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { Play, Users, Youtube, ExternalLink, Star } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Best AI YouTube Channels 2026 | All AI Tool List',
    description: 'The best YouTube channels to learn AI tools, prompt engineering, and stay updated on artificial intelligence in 2026.',
};

const CHANNELS = [
    {
        id: 1, name: 'Two Minute Papers', handle: '@TwoMinutePapers', subs: '1.4M',
        category: 'Research', desc: 'Karoly Zsolnai-Fehér breaks down cutting-edge AI research papers in 2-5 minutes. Perfect for staying ahead.',
        tags: ['Research', 'Academic', 'ML'], logo: '📄', featured: true, videos: '600+', views: '200M+',
        link: 'https://youtube.com/@TwoMinutePapers',
    },
    {
        id: 2, name: 'Andrej Karpathy', handle: '@AndrejKarpathy', subs: '1.1M',
        category: 'Deep Learning', desc: 'Former Tesla AI & OpenAI researcher. Long-form deep dives into neural networks, LLMs and AI fundamentals.',
        tags: ['Deep Learning', 'LLMs', 'Coding'], logo: '🧠', featured: true, videos: '40+', views: '30M+',
        link: 'https://youtube.com/@AndrejKarpathy',
    },
    {
        id: 3, name: 'Matt Wolfe', handle: '@mreflow', subs: '900K',
        category: 'AI Tools', desc: 'Weekly reviews of the latest AI tools, tutorials, and news. Best for discovering new tools.',
        tags: ['AI Tools', 'Reviews', 'News'], logo: '⚡', featured: true, videos: '500+', views: '80M+',
        link: 'https://youtube.com/@mreflow',
    },
    {
        id: 4, name: 'Fireship', handle: '@Fireship', subs: '3M',
        category: 'Dev + AI', desc: 'Fast-paced 100-second videos on AI tools for developers. Amazing for coders learning AI.',
        tags: ['Development', 'Tools', 'Fast'], logo: '🔥', featured: true, videos: '700+', views: '400M+',
        link: 'https://youtube.com/@Fireship',
    },
    {
        id: 5, name: 'AI Explained', handle: '@aiexplained-official', subs: '700K',
        category: 'Education', desc: 'Deep explanations of AI models and concepts. Great for understanding what\'s actually happening inside AI.',
        tags: ['Education', 'Analysis', 'LLMs'], logo: '🎓', featured: false, videos: '150+', views: '50M+',
        link: 'https://youtube.com/@aiexplained-official',
    },
    {
        id: 6, name: 'Yannic Kilcher', handle: '@YannicKilcher', subs: '500K',
        category: 'Research', desc: 'Paper readings and ML research breakdowns for a technical audience. Excellent for researchers.',
        tags: ['Research', 'Papers', 'Technical'], logo: '📊', featured: false, videos: '300+', views: '35M+',
        link: 'https://youtube.com/@YannicKilcher',
    },
    {
        id: 7, name: 'Prompt Engineering', handle: '@engineerprompt', subs: '400K',
        category: 'Prompting', desc: 'Practical prompt engineering techniques, ChatGPT hacks, and AI productivity workflows.',
        tags: ['Prompts', 'ChatGPT', 'Productivity'], logo: '✍️', featured: false, videos: '200+', views: '20M+',
        link: 'https://youtube.com',
    },
    {
        id: 8, name: 'The AI Advantage', handle: '@aiadvantage', subs: '380K',
        category: 'Business', desc: 'How to use AI tools to grow your business. Practical tutorials on ChatGPT, Midjourney, automation.',
        tags: ['Business', 'Automation', 'Tools'], logo: '💼', featured: false, videos: '180+', views: '18M+',
        link: 'https://youtube.com',
    },
    {
        id: 9, name: 'David Shapiro', handle: '@DavidShapiroAutomator', subs: '300K',
        category: 'AI Agents', desc: 'Building AI agents, autonomous systems, and exploring AGI. Philosophical + technical mix.',
        tags: ['Agents', 'AGI', 'Automation'], logo: '🤖', featured: false, videos: '250+', views: '15M+',
        link: 'https://youtube.com',
    },
    {
        id: 10, name: 'Midjourney Mastery', handle: '@midjourneymastery', subs: '250K',
        category: 'Image AI', desc: 'Master Midjourney, Stable Diffusion and image AI tools. Prompt crafting, styles, workflows.',
        tags: ['Image', 'Midjourney', 'Art'], logo: '🎨', featured: false, videos: '300+', views: '25M+',
        link: 'https://youtube.com',
    },
    {
        id: 11, name: 'Coding with AI', handle: '@codingwithai', subs: '220K',
        category: 'Coding', desc: 'Build real projects using GitHub Copilot, Cursor, Claude and other AI coding tools.',
        tags: ['Coding', 'Copilot', 'Projects'], logo: '💻', featured: false, videos: '150+', views: '12M+',
        link: 'https://youtube.com',
    },
    {
        id: 12, name: 'AI Jason', handle: '@AIJasonZ', subs: '200K',
        category: 'No-Code AI', desc: 'Build AI products without coding. Flowise, LangChain, Make.com, and no-code AI automation.',
        tags: ['No-Code', 'LangChain', 'Automation'], logo: '🛠️', featured: false, videos: '100+', views: '10M+',
        link: 'https://youtube.com',
    },
];

const CATEGORIES = ['All', 'AI Tools', 'Research', 'Deep Learning', 'Dev + AI', 'Education', 'Business', 'Image AI', 'Coding', 'AI Agents'];

const CATEGORY_COLORS: Record<string, string> = {
    'AI Tools': 'bg-blue-100 text-blue-700',
    'Research': 'bg-purple-100 text-purple-700',
    'Deep Learning': 'bg-indigo-100 text-indigo-700',
    'Dev + AI': 'bg-orange-100 text-orange-700',
    'Education': 'bg-green-100 text-green-700',
    'Business': 'bg-yellow-100 text-yellow-700',
    'Image AI': 'bg-pink-100 text-pink-700',
    'Coding': 'bg-cyan-100 text-cyan-700',
    'AI Agents': 'bg-red-100 text-red-700',
    'Prompting': 'bg-violet-100 text-violet-700',
    'No-Code AI': 'bg-teal-100 text-teal-700',
};

export default function YouTubePage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-red-600 to-rose-800 text-white">
                <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                        <Youtube className="w-4 h-4" />
                        Best AI YouTube Channels
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Learn AI from the Best Creators
                    </h1>
                    <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                        Hand-picked YouTube channels for AI tools, tutorials, research, and staying ahead in the AI revolution.
                    </p>
                    <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto text-center">
                        {[
                            { label: 'Channels', value: `${CHANNELS.length}+` },
                            { label: 'Total Subs', value: '10M+' },
                            { label: 'Videos', value: '5k+' },
                        ].map(s => (
                            <div key={s.label}>
                                <div className="text-2xl font-black">{s.value}</div>
                                <div className="text-xs text-red-200">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category filter */}
            <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button key={cat} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${cat === 'All' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex-grow max-w-6xl mx-auto px-4 py-10 w-full">

                {/* Featured */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">⭐ Must-Follow Channels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                    {CHANNELS.filter(c => c.featured).map(ch => (
                        <a key={ch.id} href={ch.link} target="_blank" rel="noopener noreferrer"
                            className="bg-white border-2 border-red-200 rounded-2xl p-6 hover:border-red-400 transition-all group flex gap-4">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">{ch.logo}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <div>
                                        <h3 className="font-black text-gray-900 group-hover:text-red-600 transition-colors">{ch.name}</h3>
                                        <span className="text-xs text-gray-400">{ch.handle}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                                </div>
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{ch.desc}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ch.subs} subs</span>
                                    <span className="flex items-center gap-1"><Play className="w-3 h-3" />{ch.videos}</span>
                                    <span className={`px-2 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[ch.category] || 'bg-gray-100 text-gray-600'}`}>{ch.category}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* All Channels */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">All Channels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {CHANNELS.filter(c => !c.featured).map(ch => (
                        <a key={ch.id} href={ch.link} target="_blank" rel="noopener noreferrer"
                            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-red-300 transition-all group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">{ch.logo}</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors">{ch.name}</h3>
                                    <span className="text-xs text-gray-400">{ch.handle}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{ch.desc}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ch.subs}</span>
                                    <span className="flex items-center gap-1"><Play className="w-3 h-3" />{ch.videos}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${CATEGORY_COLORS[ch.category] || 'bg-gray-100 text-gray-600'}`}>{ch.category}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {ch.tags.map(tag => <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>)}
                            </div>
                        </a>
                    ))}
                </div>

                {/* Suggest CTA */}
                <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl p-10 text-white text-center">
                    <Youtube className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    <h2 className="text-2xl font-black mb-3">Know a Great AI Channel?</h2>
                    <p className="text-red-100 mb-6">Suggest a YouTube channel and we&apos;ll review it for inclusion.</p>
                    <a href="mailto:hello@allaitoollist.com?subject=YouTube Channel Suggestion" className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors">
                        Suggest a Channel →
                    </a>
                </div>
            </main>

            <Footer />
        </div>
    );
}
