'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Zap, Star, Users, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { getBrowserClient } from '@/lib/supabase-browser';

const PERKS = [
    { icon: Zap, title: '5 New AI Tools', desc: 'Every week, hand-picked new tools — reviewed and rated by our team.' },
    { icon: Star, title: 'Exclusive Deals', desc: 'Subscriber-only discounts and early access to featured tools.' },
    { icon: Users, title: '50,000+ Readers', desc: 'Join a community of founders, developers, and creators using AI.' },
    { icon: CheckCircle2, title: 'No Spam', desc: 'One email per week. Unsubscribe anytime in one click.' },
];

const SAMPLE_ISSUES = [
    { date: 'Apr 14, 2026', title: '🔥 GPT-5 drops + 5 new tools you need to try', opens: '68%' },
    { date: 'Apr 7, 2026', title: '⚡ Sora goes live + top video AI tools ranked', opens: '71%' },
    { date: 'Mar 31, 2026', title: '🎨 Best image AI tools of Q1 2026 (free + paid)', opens: '65%' },
];

export default function NewsletterPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError('');
        try {
            const supabase = getBrowserClient();
            const { error: dbErr } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email }]);
            if (dbErr && dbErr.code !== '23505') throw dbErr;
            setDone(true);
            setEmail('');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <Navbar />

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
                <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
                        <Mail className="w-4 h-4" />
                        Weekly AI Newsletter
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
                        The AI Tools Newsletter<br />You&apos;ll Actually Read
                    </h1>
                    <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
                        Every Monday — 5 new AI tools, 1 deal, 1 tutorial. Under 3 minutes. Free forever.
                    </p>

                    {/* Subscribe Form */}
                    {done ? (
                        <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
                            <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
                            <h3 className="text-xl font-black mb-2">You&apos;re in! 🎉</h3>
                            <p className="text-blue-100 text-sm">Check your inbox for a welcome email. First newsletter arrives Monday.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="flex-1 px-5 py-4 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 px-7 py-4 bg-white text-blue-700 font-black rounded-xl hover:bg-blue-50 transition-colors shrink-0 disabled:opacity-60"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Subscribe <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    )}
                    {error && <p className="text-red-300 text-sm mt-3">{error}</p>}
                    <p className="text-xs text-blue-300 mt-4">50,000+ subscribers · No spam · Unsubscribe anytime</p>
                </div>
            </div>

            <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">

                {/* Perks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
                    {PERKS.map(p => (
                        <div key={p.title} className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-4 items-start hover:border-blue-300 transition-colors">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                <p.icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                                <p className="text-sm text-gray-500">{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Past Issues */}
                <div className="mb-16">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Recent Issues</h2>
                    <div className="space-y-3">
                        {SAMPLE_ISSUES.map(issue => (
                            <div key={issue.date} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between hover:border-blue-300 transition-colors group cursor-pointer">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">{issue.date}</p>
                                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{issue.title}</h3>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <div className="text-lg font-black text-green-600">{issue.opens}</div>
                                    <div className="text-xs text-gray-400">open rate</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                {!done && (
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center">
                        <Mail className="w-10 h-10 mx-auto mb-4 opacity-80" />
                        <h2 className="text-2xl font-black mb-3">Ready to Stay Ahead in AI?</h2>
                        <p className="text-blue-100 mb-6">Join 50,000+ readers getting the best AI tools in their inbox every Monday.</p>
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none"
                            />
                            <button type="submit" disabled={loading} className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
