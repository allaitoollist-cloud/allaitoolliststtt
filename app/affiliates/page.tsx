import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { DollarSign, Users, TrendingUp, Link2, Mail, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Affiliate Program — Earn with All AI Tool List',
    description: 'Join our affiliate program and earn commission by referring AI tool creators to list on our directory.',
};

const STEPS = [
    { step: '01', title: 'Sign Up', desc: 'Fill out the affiliate application form. Approval within 24 hours.' },
    { step: '02', title: 'Get Your Link', desc: 'Receive a unique referral link to share with your audience.' },
    { step: '03', title: 'Refer Clients', desc: 'Share with AI tool creators, founders, and startups who want more exposure.' },
    { step: '04', title: 'Earn Commission', desc: 'Earn 30% commission on every paid listing you refer. Paid monthly.' },
];

const PERKS = [
    { icon: DollarSign, title: '30% Commission', desc: 'Earn $14.70 per Featured listing, $44.70 per Sponsored listing you refer.' },
    { icon: Users, title: 'No Cap', desc: 'Refer unlimited clients. The more you refer, the more you earn.' },
    { icon: TrendingUp, title: 'Monthly Payouts', desc: 'Payments sent every month via Binance (USDT), Payoneer, or Bank Transfer.' },
    { icon: Link2, title: '90-Day Cookie', desc: 'If someone clicks your link and pays within 90 days, you get credit.' },
];

const COMMISSION = [
    { plan: 'Featured Listing', price: '$49', commission: '$14.70', rate: '30%', color: 'border-orange-200 bg-orange-50' },
    { plan: 'Sponsored Placement', price: '$149', commission: '$44.70', rate: '30%', color: 'border-violet-200 bg-violet-50' },
];

export default function AffiliatesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
                        <DollarSign className="w-4 h-4" />
                        Affiliate Program
                    </div>
                    <h1 className="text-5xl font-black mb-5 leading-tight">
                        Earn 30% Commission<br />
                        <span className="text-orange-400">on Every Referral</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Refer AI tool creators to All AI Tool List and earn commission on every paid listing. Simple, transparent, and no limits.
                    </p>
                    <a
                        href="mailto:hello@allaitoollist.com?subject=Affiliate Program Application"
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/25"
                    >
                        Apply Now — It&apos;s Free
                        <ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-sm text-gray-500 mt-4">Approval within 24 hours · No minimum traffic required</p>
                </div>
            </section>

            {/* Commission Table */}
            <section className="py-16 px-4 bg-gray-50 border-b border-gray-100">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-black text-center text-gray-900 mb-8">What You Earn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {COMMISSION.map(c => (
                            <div key={c.plan} className={`border-2 ${c.color} rounded-2xl p-6 text-center`}>
                                <div className="text-sm font-bold text-gray-500 mb-1">{c.plan}</div>
                                <div className="text-4xl font-black text-gray-900 mb-1">{c.commission}</div>
                                <div className="text-sm text-gray-500">per referral ({c.rate} of {c.price})</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perks */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-black text-center text-gray-900 mb-10">Why Join Our Affiliate Program?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PERKS.map(p => (
                            <div key={p.title} className="text-center space-y-3">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto">
                                    <p.icon className="w-6 h-6 text-orange-500" />
                                </div>
                                <h3 className="font-black text-gray-900">{p.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-black text-center text-gray-900 mb-10">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STEPS.map(s => (
                            <div key={s.step} className="relative">
                                <div className="text-5xl font-black text-orange-100 mb-3">{s.step}</div>
                                <h3 className="font-black text-gray-900 mb-1">{s.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section className="py-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-black text-center text-gray-900 mb-8">Requirements</h2>
                    <div className="space-y-3">
                        {[
                            'No minimum traffic or audience size required',
                            'Must not use spammy or misleading promotion methods',
                            'Referrals must be genuine AI tool creators or companies',
                            'Self-referrals are not eligible for commission',
                            'Payouts via Binance (USDT), Payoneer, or Bank Transfer',
                        ].map(req => (
                            <div key={req} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <span className="text-gray-700">{req}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="max-w-2xl mx-auto text-center">
                    <Zap className="w-10 h-10 text-orange-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-black text-white mb-4">Ready to Start Earning?</h2>
                    <p className="text-gray-400 mb-8">Send us an email to apply. We&apos;ll set you up with your unique referral link within 24 hours.</p>
                    <a
                        href="mailto:hello@allaitoollist.com?subject=Affiliate Program Application&body=Hi, I'd like to join the affiliate program. My name is: [Your Name]. My website/platform: [URL or description]."
                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        Apply via Email
                    </a>
                    <p className="text-gray-600 text-sm mt-4">hello@allaitoollist.com</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
