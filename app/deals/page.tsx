import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import Link from 'next/link';
import { Tag, Clock, Zap, ExternalLink, Star, Flame } from 'lucide-react';

export const metadata: Metadata = {
    title: 'AI Tool Deals & Lifetime Offers | All AI Tool List',
    description: 'Exclusive discounts, lifetime deals and bonuses on the best AI tools. Updated weekly.',
};

const DEALS = [
    {
        id: 1, name: 'Jasper AI', category: 'Writing AI', logo: '✍️',
        deal: 'Lifetime Deal', discount: '70% OFF', originalPrice: '$49/mo', dealPrice: '$199 one-time',
        description: 'AI writing assistant for marketing teams. Unlimited words, 50+ templates.',
        badge: '🔥 Hot', daysLeft: 3, rating: 4.8, reviews: 2341, featured: true,
    },
    {
        id: 2, name: 'Pictory AI', category: 'Video AI', logo: '🎬',
        deal: 'Annual Deal', discount: '40% OFF', originalPrice: '$99/mo', dealPrice: '$59/mo',
        description: 'Turn scripts & blog posts into professional videos automatically.',
        badge: '⚡ Flash', daysLeft: 7, rating: 4.6, reviews: 892, featured: true,
    },
    {
        id: 3, name: 'Surfer SEO', category: 'SEO AI', logo: '🏄',
        deal: 'Annual Plan', discount: '25% OFF', originalPrice: '$89/mo', dealPrice: '$67/mo',
        description: 'AI-powered SEO content optimizer. Rank higher with data-driven insights.',
        badge: '⭐ Editor Choice', daysLeft: 14, rating: 4.7, reviews: 1567, featured: false,
    },
    {
        id: 4, name: 'Murf AI', category: 'Audio AI', logo: '🎙️',
        deal: 'Lifetime Deal', discount: '60% OFF', originalPrice: '$29/mo', dealPrice: '$149 one-time',
        description: 'Professional AI voice generator. 120+ voices, 20+ languages.',
        badge: '💎 Premium', daysLeft: 5, rating: 4.5, reviews: 734, featured: false,
    },
    {
        id: 5, name: 'Descript', category: 'Video AI', logo: '✂️',
        deal: 'Pro Annual', discount: '30% OFF', originalPrice: '$30/mo', dealPrice: '$21/mo',
        description: 'Edit video by editing text. AI filler word remover, studio sound.',
        badge: '🆕 New', daysLeft: 21, rating: 4.9, reviews: 3201, featured: false,
    },
    {
        id: 6, name: 'Writesonic', category: 'Writing AI', logo: '⚡',
        deal: 'Lifetime Deal', discount: '80% OFF', originalPrice: '$99/mo', dealPrice: '$99 one-time',
        description: 'GPT-4 powered AI writer. Blog posts, ads, product descriptions.',
        badge: '🔥 Hot', daysLeft: 2, rating: 4.4, reviews: 1102, featured: false,
    },
];

function DealBadge({ label }: { label: string }) {
    if (label.includes('Hot')) return <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">{label}</span>;
    if (label.includes('Flash')) return <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{label}</span>;
    if (label.includes('Editor')) return <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded-full">{label}</span>;
    if (label.includes('Premium')) return <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">{label}</span>;
    return <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{label}</span>;
}

export default function DealsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                        <Flame className="w-4 h-4" />
                        Exclusive AI Tool Deals
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Save Big on AI Tools</h1>
                    <p className="text-xl text-orange-100 mb-6 max-w-2xl mx-auto">
                        Lifetime deals, heavy discounts & exclusive bonuses — updated weekly.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        {['Lifetime Deals', 'Annual Discounts', 'Flash Sales', 'Editor Picks'].map(t => (
                            <span key={t} className="bg-white/10 border border-white/20 px-4 py-2 rounded-full">{t}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                        {[
                            { label: 'Active Deals', value: '40+' },
                            { label: 'Avg. Discount', value: '55%' },
                            { label: 'Saved by Users', value: '$2M+' },
                        ].map(s => (
                            <div key={s.label}>
                                <div className="text-2xl font-black text-orange-500">{s.value}</div>
                                <div className="text-sm text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">

                {/* Featured Deals */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">🔥 Featured Deals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                    {DEALS.filter(d => d.featured).map(deal => (
                        <div key={deal.id} className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:border-orange-400 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">{deal.logo}</div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg">{deal.name}</h3>
                                        <span className="text-xs text-gray-500">{deal.category}</span>
                                    </div>
                                </div>
                                <DealBadge label={deal.badge} />
                            </div>

                            <p className="text-sm text-gray-600 mb-4">{deal.description}</p>

                            <div className="flex items-center gap-2 mb-4">
                                {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(deal.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}
                                <span className="text-xs text-gray-500">{deal.rating} ({deal.reviews.toLocaleString()})</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl mb-4">
                                <div>
                                    <div className="text-xs text-gray-500 line-through">{deal.originalPrice}</div>
                                    <div className="text-2xl font-black text-orange-600">{deal.dealPrice}</div>
                                    <div className="text-xs text-gray-500">{deal.deal}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-black text-red-500">{deal.discount}</div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 justify-center mt-1">
                                        <Clock className="w-3 h-3" /> {deal.daysLeft}d left
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                Get This Deal <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* All Deals */}
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">All Deals</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
                    {DEALS.filter(d => !d.featured).map(deal => (
                        <div key={deal.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-orange-300 transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">{deal.logo}</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{deal.name}</h3>
                                        <span className="text-xs text-gray-400">{deal.category}</span>
                                    </div>
                                </div>
                                <DealBadge label={deal.badge} />
                            </div>

                            <p className="text-xs text-gray-600 mb-3">{deal.description}</p>

                            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-4">
                                <div>
                                    <div className="text-xs text-gray-400 line-through">{deal.originalPrice}</div>
                                    <div className="text-lg font-black text-gray-900">{deal.dealPrice}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-red-500">{deal.discount}</div>
                                    <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                                        <Clock className="w-3 h-3" /> {deal.daysLeft}d left
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                Get Deal <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Submit Deal CTA */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-10 text-white text-center">
                    <Tag className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    <h2 className="text-3xl font-black mb-3">List Your AI Tool Deal</h2>
                    <p className="text-orange-100 mb-6 max-w-lg mx-auto">
                        Reach 50,000+ AI enthusiasts. Get more signups and lifetime customers by featuring your deal here.
                    </p>
                    <a href="mailto:hello@allaitoollist.com?subject=Deal Listing Inquiry" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
                        Submit Your Deal →
                    </a>
                    <p className="text-xs text-orange-200 mt-4">Starting at $149/week · Email hello@allaitoollist.com</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
