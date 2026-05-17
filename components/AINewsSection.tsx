import Link from 'next/link';
import { ArrowRight, Newspaper, Clock, ArrowUpRight } from 'lucide-react';

const NEWS = [
    {
        title: 'OpenAI Launches SearchGPT: A Real-Time Competitive Search Engine',
        summary: 'The new prototype aims to challenge Google by providing real-time information with direct citations.',
        href: '/news/openai-searchgpt',
        date: 'July 25, 2026',
        tag: 'Product Launch',
        tagColor: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
        emoji: '🔍',
        emojiBg: 'bg-orange-50',
    },
    {
        title: 'Meta Releases Llama 4: The Most Capable Open-Source Model Yet',
        summary: "Mark Zuckerberg unveils the new 405B parameter model that rivals the world's best closed models.",
        href: '/news/llama-4-release',
        date: 'July 23, 2026',
        tag: 'Model Release',
        tagColor: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
        emoji: '🦙',
        emojiBg: 'bg-blue-50',
    },
    {
        title: 'AI Startup Valuation Trends: Bubble or the New Reality?',
        summary: 'A deep dive into why venture capital is still flowing into foundation models despite high compute costs.',
        href: '/news/ai-valuation-trends',
        date: 'July 20, 2026',
        tag: 'Market Analysis',
        tagColor: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
        emoji: '📈',
        emojiBg: 'bg-emerald-50',
    },
];

export function AINewsSection() {
    return (
        <section className="py-16 bg-gray-50/60 rounded-[48px] border border-gray-100">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-[0.2em]">
                            <Newspaper className="w-4 h-4" />
                            Daily Intelligence
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
                            Latest AI <span className="text-gray-400">News</span>
                        </h2>
                    </div>
                    <Link
                        href="/news"
                        className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-black text-[13px] hover:border-orange-300 hover:text-orange-600 transition-all shadow-sm hover:shadow-md group"
                    >
                        View All News
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {NEWS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex flex-col bg-white border border-gray-100 rounded-[28px] p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/8 hover:border-orange-100 hover:-translate-y-1"
                        >
                            {/* Emoji — large, prominent visual anchor */}
                            <div className={`w-16 h-16 ${item.emojiBg} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-white group-hover:scale-105 transition-transform duration-200`}>
                                {item.emoji}
                            </div>

                            {/* Tag + date */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${item.tagColor}`}>
                                    {item.tag}
                                </span>
                                <div className="flex items-center gap-1 text-gray-400 text-[11px] font-bold">
                                    <Clock className="w-3 h-3" />
                                    {item.date}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-[17px] font-black text-gray-900 mb-3 leading-snug group-hover:text-orange-600 transition-colors flex-1">
                                {item.title}
                            </h3>

                            {/* Summary */}
                            <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">
                                {item.summary}
                            </p>

                            {/* CTA */}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-200 self-start">
                                <span className="text-[13px] font-black text-gray-700 group-hover:text-white transition-colors">
                                    Read Full Story
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
