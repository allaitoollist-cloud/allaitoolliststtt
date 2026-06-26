import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';

const TRENDING = [
    { label: 'Video Creation',    slug: 'Video Generators',    emoji: '🎬', count: '240+', color: 'bg-blue-50   border-blue-100   group-hover:border-blue-200   group-hover:bg-blue-50' },
    { label: 'AI Art & Image',    slug: 'Image Generators',    emoji: '🎨', count: '380+', color: 'bg-rose-50   border-rose-100   group-hover:border-rose-200   group-hover:bg-rose-50' },
    { label: 'Chatbots',          slug: 'ChatBots',            emoji: '💬', count: '190+', color: 'bg-emerald-50 border-emerald-100 group-hover:border-emerald-200 group-hover:bg-emerald-50' },
    { label: 'Autonomous Agents', slug: 'AI Agents',           emoji: '🤖', count: '120+', color: 'bg-violet-50 border-violet-100 group-hover:border-violet-200 group-hover:bg-violet-50' },
    { label: 'Marketing Copy',    slug: 'Marketing',           emoji: '📣', count: '210+', color: 'bg-orange-50 border-orange-100 group-hover:border-orange-200 group-hover:bg-orange-50' },
    { label: 'Dev Assistants',    slug: 'Developer Tools',     emoji: '💻', count: '175+', color: 'bg-sky-50    border-sky-100    group-hover:border-sky-200    group-hover:bg-sky-50' },
    { label: 'Business & Finance',slug: 'Business',            emoji: '💼', count: '130+', color: 'bg-zinc-50   border-zinc-200   group-hover:border-zinc-300   group-hover:bg-zinc-100' },
    { label: 'Workflow',          slug: 'Automation',          emoji: '⚡', count: '160+', color: 'bg-yellow-50 border-yellow-100 group-hover:border-yellow-200 group-hover:bg-yellow-50' },
];

export function TrendingCategories() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-[0.2em]">
                            <TrendingUp className="w-4 h-4" />
                            Trending Now
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                            Explore by <span className="text-gray-400">Category</span>
                        </h2>
                    </div>
                    <Link
                        href="/categories"
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-black text-[13px] hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 shadow-sm group"
                    >
                        All Categories
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Category Grid — uniform height cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRENDING.map((cat) => (
                        <Link
                            key={cat.label}
                            href={`/category/${encodeURIComponent(cat.slug)}`}
                            className={`group relative flex flex-col p-6 rounded-[24px] bg-white border transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 min-h-[160px] ${cat.color}`}
                        >
                            {/* Emoji icon — uniform container */}
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 border border-white/80">
                                {cat.emoji}
                            </div>

                            <h3 className="text-[15px] font-black text-gray-900 leading-tight mb-1 group-hover:text-gray-700 transition-colors">
                                {cat.label}
                            </h3>
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-500 transition-colors">
                                {cat.count}+ tools
                            </p>

                            {/* Arrow indicator on hover */}
                            <div className="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-white/80 border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm">
                                <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="mt-8 sm:hidden">
                    <Link
                        href="/categories"
                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gray-900 hover:bg-orange-500 text-white font-black text-sm transition-all"
                    >
                        Browse All Categories
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
